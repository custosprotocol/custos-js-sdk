import * as anchor from "@coral-xyz/anchor";
import { Program, Provider } from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Custos } from "./idl";
import { getProgram } from "./utils";
import { delegateAccountPrefix, PROGRAM_ID } from "./constants";


export const CustosProtocol = class {
  provider: Provider;
  signer: PublicKey;
  delegationProgram: Program<Custos>;

  constructor(provider: Provider) {
    this.provider = provider;
    this.signer = provider.publicKey;
    this.delegationProgram = getProgram(this.provider);
  }

  createDelegate = async (hotWallet: string): Promise<TransactionInstruction> => {
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

  revokeDelegate = async (): Promise<TransactionInstruction> => {
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

  getDelegate = async (): Promise<PublicKey | undefined> => {
    const data = await this.delegationProgram.account.delegateAccount.all();
    if (data.length === 0) {
      return;
    }
    return data[0].account.hotWallet;
  };
};