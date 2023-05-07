import * as anchor from "@coral-xyz/anchor";
import { Program, Provider } from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Custos } from "./idl";
import { getProgram } from "./utils";
import { delegateAccountPrefix, delegateTokenAccountPrefix, PROGRAM_ID } from "./constants";
import { getAssociatedTokenAddress } from "@solana/spl-token";


export const CustosProtocol = class {
  provider: Provider;
  signer: PublicKey;
  delegationProgram: Program<Custos>;

  constructor(provider: Provider) {
    this.provider = provider;
    this.signer = provider.publicKey;
    this.delegationProgram = getProgram(this.provider);
  }

  createWalletDelegate = async (hotWallet: PublicKey): Promise<TransactionInstruction> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [delegateAccount, delegateAccountBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(delegateAccountPrefix), this.signer.toBuffer()],
      PROGRAM_ID
    );

    const ix = await this.delegationProgram.methods
      .createDelegate()
      .accounts({
        authority: this.signer,
        systemProgram: anchor.web3.SystemProgram.programId,
        delegateAccount,
        toDelegateAccount: hotWallet,
      })
      .instruction();

    return ix;
  };

  revokeWalletDelegate = async (): Promise<TransactionInstruction> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [delegateAccount, delegateAccountBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(delegateAccountPrefix), this.signer.toBuffer()],
      PROGRAM_ID
    );

    const ix = await this.delegationProgram.methods
      .revokeDelegate()
      .accounts({
        authority: this.signer,
        delegateAccount,
      })
      .instruction();

    return ix;
  };

  createTokenDelegate = async (hotWallet: PublicKey, mint: PublicKey): Promise<TransactionInstruction> => {
    let walletATA = await getAssociatedTokenAddress(
      mint, // mint
      this.signer // owner
    );
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [delegateTokenAccount, delegateAccountBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from(delegateTokenAccountPrefix),
          this.signer.toBuffer(),
          walletATA.toBuffer(),
        ],
        PROGRAM_ID
      );

    const ix = await this.delegationProgram.methods
      .createTokenDelegate()
      .accounts({
        authority: this.signer,
        mint,
        systemProgram: anchor.web3.SystemProgram.programId,
        delegateTokenAccount,
        tokenAccount: walletATA,
        toDelegateAccount: hotWallet,
      })
      .instruction();

    return ix;
  };

  revokeTokenDelegate = async (mint: PublicKey): Promise<TransactionInstruction> => {
    let walletATA = await getAssociatedTokenAddress(
      mint, // mint
      this.signer // owner
    );
   
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [delegateTokenAccount, delegateAccountBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(delegateTokenAccountPrefix),
        this.signer.toBuffer(),
        walletATA.toBuffer(),
      ],
      PROGRAM_ID
    );

    const ix = await this.delegationProgram.methods
      .revokeTokenDelegate()
      .accounts({
        authority: this.signer,
        delegateTokenAccount,
      })
      .instruction();

    return ix;
  };

  getWalletDelegates = async (hotWallet: PublicKey) => {
    const data = await this.delegationProgram.account.delegateAccount.all([
      {
        memcmp: {
          offset: 8 + 32,
          bytes: hotWallet.toBase58(),
        },
      },
    ]);

    return data;
  };

  getTokenDelegates = async (hotWallet: PublicKey) => {
    const data = await this.delegationProgram.account.delegateTokenAccount.all([
      {
        memcmp: {
          offset: 8 + 32,
          bytes: hotWallet.toBase58(),
        },
      },
    ]);

    return data;
  };
};