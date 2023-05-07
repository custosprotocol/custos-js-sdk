# Custos JS SDK
Javascript SDK that can be used readily by developers to interact with the Custos Protocol.

The SDK can be used by:
1. **Wallets** to allow users to delegate a cold wallet and its assets to a hot wallet
2. **Dapps** to fetch the all delegates for a given hot wallet

## Install SDK

```
// Yarn
yarn add custos-js-sdk

// npm
npm install custos-js-sdk
```

Interacting with the custos sdk just requires you to pass a provider which can be created using the anchor client javaScript library. The below code express's how can a provider be created.

```ts
import * as anchor from "@coral-xyz/anchor";


const network = "https://api.mainnet-beta.solana.com"
const opts = {
  preflightCommitment: "processed" as anchor.web3.ConfirmOptions,
};

// Creating a connection object
const connection = new anchor.web3.Connection(
    network,
    opts.preflightCommitment
  );

// Creating the Provider Object
const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    opts.preflightCommitment
  );
```

Some util methods that can be used to build a transaction using the instruction built by the SDK, send and confirm it:

```ts
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
```

After creating the provider object we can create an instance of the custos-sdk class which is going to offer methods to interact with the custos program on-chain and verify the delegation.

```ts
const custos = new CustosProtocol(provider);
```

## Wallets
Wallets can use the SDK to allow users to delegate cold wallets and their assets to a dedicated hot wallet, right from the wallets themselves.

### Create Wallet Delegate
```ts
const ix = await custos.createWalletDelegate(hotWallet);
const signature = await sendAndConfirmInstruction(ix);
```

### Create Token Delegate
```ts
const mint = new anchor.web3.PublicKey("2wrJgr3YrgUgr8RqUfe6Mv2E1T4sAQweZsBo1JDfE1st");
const ix = await custos.createTokenDelegate(hotWallet, mint);
const signature = await sendAndConfirmInstruction(ix);
```

### Revoke Wallet Delegate
```ts
const ix = await custos.revokeWalletDelegate();
const signature = await sendAndConfirmInstruction(ix);
```

### Revoke Token Delegate
```ts
const mint = new anchor.web3.PublicKey("2wrJgr3YrgUgr8RqUfe6Mv2E1T4sAQweZsBo1JDfE1st");
const ix = await custos.createTokenDelegate(hotWallet, mint);
const signature = await sendAndConfirmInstruction(ix);
```

## Dapps
Dapps can use the SDK to fetch back the cold wallet or the tokens ATA from the delegated hot wallets.

### Fetch Wallet Delegates
```ts
const data = await custos.getWalletDelegates(hotWallet);
console.log("delegate account: ", data[0].publicKey.toString());
console.log("cold wallet: ", data[0].account.authority.toString());
```

### Fetch Token Delegates
```ts
const data = await custos.getTokenDelegates(hotWallet);
console.log("delegate account: ", data[0].publicKey.toString());
console.log("cold wallet: ", data[0].account.authority.toString());
console.log("token ata: ", data[0].account.tokenAccount.toString());
```