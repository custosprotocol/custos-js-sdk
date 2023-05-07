import { Wallet } from "@coral-xyz/anchor";
import { CustosProtocol } from ".";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const keypair = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
        24,58,95,211,152,100,106,160,161,192,179,
        195,141,102,68,26,70,140,199,91,168,193,
        58,141,160,162,183,47,141,224,231,161,30,
        213,62,103,145,154,118,179,247,7,187,52,
        169,135,184,250,47,226,52,255,251,111,202,
        104,182,238,46,220,116,178,47,197
    ])
);

const publicKey = keypair.publicKey;

// Change the public address of the hot wallet to test
const hotWallet = new PublicKey("Fn9A5Ge92QkwrYAASFv5R7nh9VMve9ssERPfhaNPF3Lj");
const wallet = new Wallet(keypair);

// Change the mint address to test
const mint = new anchor.web3.PublicKey("2wrJgr3YrgUgr8RqUfe6Mv2E1T4sAQweZsBo1JDfE1st");

const opts = {
    preflightCommitment: "processed" as anchor.web3.ConfirmOptions,
};

// Change the network to a mainnet public address to test
const network =
  "https://rpc-devnet.helius.xyz/?api-key=91e99370-59b6-43e1-841a-bfe40c0dd061";

const getProvider = (wallet: Wallet) => {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
  
    const connection = new anchor.web3.Connection(
      network,
      opts.preflightCommitment
    );
  
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      opts.preflightCommitment
    );
    return provider;
};

const getConnection = () => {
  const connection = new anchor.web3.Connection(
    network,
    opts.preflightCommitment
  );

  return connection;
};

const sendAndConfirmInstruction = async (ix: anchor.web3.TransactionInstruction) => {
  const { blockhash } = await connection.getLatestBlockhash("finalized");
    const transaction = new anchor.web3.Transaction({
      recentBlockhash: blockhash,
      feePayer: publicKey,
    }).add(ix);
    const signed_tx = await wallet?.signTransaction(transaction);
    if (signed_tx == undefined) {
      return;
    }
    const serialized_transaction = signed_tx.serialize();

    const sig = await connection.sendRawTransaction(serialized_transaction);
    await connection.confirmTransaction(sig, "confirmed");
    return sig;
}

const provider = getProvider(wallet);
const connection = getConnection();
const custos = new CustosProtocol(provider);

describe("custos", () => {
  it("Create Delegate", async () => {
    const ix = await custos.createWalletDelegate(hotWallet);
    const sig = await sendAndConfirmInstruction(ix);
    console.log("sig: ", sig);

    // get delegation data
    const data = await custos.getWalletDelegates(hotWallet);
    expect(data.length).toBeGreaterThan(0);
    console.log("delegate account: ", data[0].publicKey.toString());
    console.log("cold wallet: ", data[0].account.authority.toString());
  });

  it("Revoke Delegate", async () => {
    const ix = await custos.revokeWalletDelegate();
    const sig = await sendAndConfirmInstruction(ix);
    console.log("sig: ", sig);

    // get delegation data
    const data = await custos.getWalletDelegates(hotWallet);
    expect(data.length).toEqual(0);
  });

  it("Create Token Delegate", async () => {
    const ix = await custos.createTokenDelegate(hotWallet, mint);
    const sig = await sendAndConfirmInstruction(ix);
    console.log("sig: ", sig);

    // get token delegation data
    const data = await custos.getTokenDelegates(hotWallet);
    expect(data.length).toBeGreaterThan(0);
    console.log("delegate account: ", data[0].publicKey.toString());
    console.log("cold wallet: ", data[0].account.authority.toString());
    console.log("token ata: ", data[0].account.tokenAccount.toString());
  });

  it("Revoke Token Delegate", async () => {
    const ix = await custos.revokeTokenDelegate(mint);
    const sig = await sendAndConfirmInstruction(ix);
    console.log("sig: ", sig);

    // get token delegation data
    const data = await custos.getTokenDelegates(hotWallet);
    expect(data.length).toEqual(0);
  });
});
