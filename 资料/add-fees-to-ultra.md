Add Fees To Ultra
In this guide, we will be walking through the steps to create the necessary accounts for adding fees to your Ultra transaction.

Important Notes
Note	Description
Referral Dashboard UI	Use the Referral Dashboard to create referral accounts through a user-friendly interface. This is the recommended approach for most users before proceeding with the SDK setup below.
Additional required accounts	It is required to have a valid referral account and referral token accounts for the specific token mints. These accounts are initalized with the Referral Program under the "Jupiter Ultra" Referral Project.
Fee mint	In the /order response, you will see the feeMint field which is the token mint we will collect the fees in for that particular order.

Since Jupiter will always dictate which token mint to collect the fees in, you must ensure that you have the valid referral token account created for the specific fee mint. If it is not initialized, the order will still return and can be executed without your fees. This is to ensure success rates and the best experience with Jupiter Ultra.
Jupiter fees	By default, Jupiter Ultra incurs a 0.05% or 0.1% fee based on token mint. When you add a referral fee, Jupiter will take a flat 20% of your integrator fees, for example, if you plan to take 100bps, Jupiter will take 20bps from it.
Integrator fees	You can configure referralFee to be between 50bps to 255bps. The /order response will show the total fee in feeBps field which should be exactly what you specified in referralFee.

Do note that, the referral token account has to be created before calling /order because during the request, we will check if the token account is initialized before applying your referral fee (if it is not applied, we will only apply our default fees).
Limitations	
Currently, we do not support fees for Token2022 tokens.
Setting up the referral accounts and token accounts can only be done via the SDK (the scripts provided in this guide), and not via the Referral Dashboard.
Step-by-step
Install additional dependencies.
Create referralAccount.
Create referralTokenAccount for each token mint.
Add referralAccount and referralFee to Ultra /order endpoint.
Sign and send the transaction via Ultra /execute endpoint.
Verify transaction and fees.
Full Code Example

import { ReferralProvider } from "@jup-ag/referral-sdk";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import fs from 'fs';

const connection = new Connection("https://api.mainnet-beta.solana.com");
const privateKeyArray = JSON.parse(fs.readFileSync('/Path/to/.config/solana/id.json', 'utf8').trim());
const wallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

const provider = new ReferralProvider(connection);
const projectPubKey = new PublicKey('DkiqsTrw1u1bYFumumC7sCG2S8K25qc2vemJFHyW2wJc');

async function initReferralAccount() {
  const transaction = await provider.initializeReferralAccountWithName({
    payerPubKey: wallet.publicKey,
    partnerPubKey: wallet.publicKey,
    projectPubKey: projectPubKey,
    name: "insert-name-here",
  });

  const referralAccount = await connection.getAccountInfo(
    transaction.referralAccountPubKey,
  );

  if (!referralAccount) {
    const signature = await sendAndConfirmTransaction(connection, transaction.tx, [wallet]);
    console.log('signature:', `https://solscan.io/tx/${signature}`);
    console.log('created referralAccountPubkey:', transaction.referralAccountPubKey.toBase58());
  } else {
    console.log(
      `referralAccount ${transaction.referralAccountPubKey.toBase58()} already exists`,
    );
  }
}

async function initReferralTokenAccount() {
  const mint = new PublicKey("So11111111111111111111111111111111111111112"); // the token mint you want to collect fees in
  
  const transaction = await provider.initializeReferralTokenAccountV2({
    payerPubKey: wallet.publicKey,
    referralAccountPubKey: new PublicKey("insert-referral-account-pubkey-here"), // you get this from the initReferralAccount function
    mint,
  });
  
    const referralTokenAccount = await connection.getAccountInfo(
      transaction.tokenAccount,
    );
  
    if (!referralTokenAccount) {
      const signature = await sendAndConfirmTransaction(connection, transaction.tx, [wallet]);
      console.log('signature:', `https://solscan.io/tx/${signature}`);
      console.log('created referralTokenAccountPubKey:', transaction.tokenAccount.toBase58());
      console.log('mint:', mint.toBase58());
    } else {
      console.log(
        `referralTokenAccount ${transaction.tokenAccount.toBase58()} for mint ${mint.toBase58()} already exists`,
      );
    }
}

async function claimAllTokens() {
  const transactions = await provider.claimAllV2({
    payerPubKey: wallet.publicKey,
    referralAccountPubKey: new PublicKey("insert-referral-account-pubkey-here"),
  })

  // Send each claim transaction one by one.
  for (const transaction of transactions) {
    transaction.sign([wallet]);

    const signature = await sendAndConfirmRawTransaction(connection, transaction.serialize(), [wallet]);
    console.log('signature:', `https://solscan.io/tx/${signature}`);
  }
}

// initReferralAccount(); // you should only run this once
// initReferralTokenAccount();
// claimAllTokens();

Dependencies
npm install @jup-ag/referral-sdk
npm install @solana/web3.js@1 # Using v1 of web3.js instead of v2
npm install bs58
npm install dotenv # if required for wallet setup

RPC Connection and Wallet Setup

Set up RPC Connection

note
Solana provides a default RPC endpoint. However, as your application grows, we recommend you to always use your own or provision a 3rd party provider’s RPC endpoint such as Helius or Triton.

import { Connection } from "@solana/web3.js";

const connection = new Connection('https://api.mainnet-beta.solana.com');

Set up Development Wallet

note
You can paste in your private key for testing purposes but this is not recommended for production applications.
If you want to store your private key in the project directly, you can do it via a .env file.
To set up a development wallet via .env file, you can use the following script.

// index.js
import { Keypair } from '@solana/web3.js';
import dotenv from 'dotenv';
require('dotenv').config();

const wallet = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || ''));

# .env
PRIVATE_KEY=""

To set up a development wallet via a wallet generated via Solana CLI, you can use the following script.

import { Keypair } from '@solana/web3.js';
import fs from 'fs';

const privateKeyArray = JSON.parse(fs.readFileSync('/Path/To/.config/solana/id.json', 'utf8').trim());
const wallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

Create referralAccount
You should only need to create the referral account once.
After this step, you need to create the referral token accounts for each token mint.
import { ReferralProvider } from "@jup-ag/referral-sdk";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const privateKeyArray = JSON.parse(fs.readFileSync('/Path/to/.config/solana/id.json', 'utf8').trim());
const wallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
const provider = new ReferralProvider(connection);
const projectPubKey = new PublicKey('DkiqsTrw1u1bYFumumC7sCG2S8K25qc2vemJFHyW2wJc'); // Jupiter Ultra Referral Project

async function initReferralAccount() {
  const transaction = await provider.initializeReferralAccountWithName({
    payerPubKey: wallet.publicKey,
    partnerPubKey: wallet.publicKey,
    projectPubKey: projectPubKey,
    name: "insert-name-here",
  });

  const referralAccount = await connection.getAccountInfo(
    transaction.referralAccountPubKey,
  );

  if (!referralAccount) {
    const signature = await sendAndConfirmTransaction(connection, transaction.tx, [wallet]);
    console.log('signature:', `https://solscan.io/tx/${signature}`);
    console.log('created referralAccountPubkey:', transaction.referralAccountPubKey.toBase58());
  } else {
    console.log(
      `referralAccount ${transaction.referralAccountPubKey.toBase58()} already exists`,
    );
  }
}

Create referralTokenAccount
You need to create the referralAccount first.
You need to create a referralTokenAccount for each token mint you want to collect fees in.
We don't recommend creating a token account for every token mint, as it costs rent and most tokens might not be valuable, instead created token accounts for top mints to begin with (you can always add more later).
import { ReferralProvider } from "@jup-ag/referral-sdk";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const privateKeyArray = JSON.parse(fs.readFileSync('/Path/to/.config/solana/id.json', 'utf8').trim());
const wallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
const provider = new ReferralProvider(connection);

async function initReferralTokenAccount() {
  const mint = new PublicKey("So11111111111111111111111111111111111111112"); // the token mint you want to collect fees in
  
  const transaction = await provider.initializeReferralTokenAccountV2({
    payerPubKey: wallet.publicKey,
    referralAccountPubKey: new PublicKey("insert-referral-account-pubkey-here"),
    mint,
  });
  
    const referralTokenAccount = await connection.getAccountInfo(
      transaction.tokenAccount,
    );
  
    if (!referralTokenAccount) {
      const signature = await sendAndConfirmTransaction(connection, transaction.tx, [wallet]);
      console.log('signature:', `https://solscan.io/tx/${signature}`);
      console.log('created referralTokenAccountPubKey:', transaction.tokenAccount.toBase58());
      console.log('mint:', mint.toBase58());
    } else {
      console.log(
        `referralTokenAccount ${transaction.tokenAccount.toBase58()} for mint ${mint.toBase58()} already exists`,
      );
    }
}

Usage in Ultra
After creating the necessary accounts, you can now add the referralAccount and referralFee to the Ultra /order endpoint.
From the order response, you should see the feeMint field, which is the token mint we will collect the fees in for that particular order.
From the order response, you should see the feeBps field, which is the total fee in bps, which should be exactly what you specified in referralFee.
Then, you can sign and send the transaction via the Ultra /execute endpoint.
danger
Do note that, during your request to /order, we will check if the specific fee mint's referral token account is initialized. If it is not, the order will still return and can be executed without your fees. This is to ensure success rates and the best experience with Jupiter Ultra.

Hence, please verify the transaction when testing with a new referral token account, and always create the referral token account before calling /order.

import { Keypair, VersionedTransaction } from "@solana/web3.js";
import fs from 'fs';

const privateKeyArray = JSON.parse(fs.readFileSync('/Path/to/.config/solana/id.json', 'utf8').trim());
const wallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

const orderResponse = await (
  await fetch(
      'https://lite-api.jup.ag/ultra/v1/order?' + 
      'inputMint=So11111111111111111111111111111111111111112&' +
      'outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&' +
      'amount=100000000&' +
      'taker=jdocuPgEAjMfihABsPgKEvYtsmMzjUHeq9LX4Hvs7f3&' +
      'referralAccount=&' + // insert referral account public key here
      'referralFee=50' // insert referral fee in basis points (bps)
  )
).json();

console.log(JSON.stringify(orderResponse, null, 2));

const transactionBase64 = orderResponse.transaction // Extract the transaction from the order response
const transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64')); // Deserialize the transaction
transaction.sign([wallet]); // Sign the transaction
const signedTransaction = Buffer.from(transaction.serialize()).toString('base64'); // Serialize the transaction to base64 format

const executeResponse = await (
    await fetch('https://lite-api.jup.ag/ultra/v1/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            signedTransaction: signedTransaction,
            requestId: orderResponse.requestId,
        }),
    })
).json();

if (executeResponse.status === "Success") {
    console.log('Swap successful:', JSON.stringify(executeResponse, null, 2));
    console.log(`https://solscan.io/tx/${executeResponse.signature}`);
} else {
    console.error('Swap failed:', JSON.stringify(executeResponse, null, 2));
    console.log(`https://solscan.io/tx/${executeResponse.signature}`);
}


Claim All Fees
The claimAllV2 method will return a list of transactions to claim all fees and are batched by 5 claims for each transaction.
The code signs and sends the transactions one by one - you can also Jito Bundle to send multiple at once, if preferred.
When claiming fees, the transaction will include the transfer of the fees to both your referral account and Jupiter's (20% of your integrator fees).
import { ReferralProvider } from "@jup-ag/referral-sdk";
import { Connection, Keypair, PublicKey, sendAndConfirmRawTransaction } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const privateKeyArray = JSON.parse(fs.readFileSync('/Path/to/.config/solana/id.json', 'utf8').trim());
const wallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
const provider = new ReferralProvider(connection);

async function claimAllTokens() {
  const transactions = await provider.claimAllV2({
    payerPubKey: wallet.publicKey,
    referralAccountPubKey: new PublicKey("insert-referral-account-pubkey-here"),
  })

  // Send each claim transaction one by one.
  for (const transaction of transactions) {
    transaction.sign([wallet]);

    const signature = await sendAndConfirmRawTransaction(connection, transaction.serialize(), [wallet]);
    console.log('signature:', `https://solscan.io/tx/${signature}`);
  }
}
Payments Through Swap
The Jupiter Swap API can be utilized such that you, a merchant can allow your customer to pay in any tokens while you still receive in your preferred token payment at the end of the transaction.

Use Case
Let’s set the stage. You are selling a jupcake!!! to your customer and merchant might only accept in 1 USDC, but your customer only has 1 SOL. Well, you’re at the right place! By using the Swap API, merchant can let customer pay in SOL while merchant still receive USDC in order to complete the payment for a jupcake.

Customer has 1,000,000 SOL.
Merchant sells 1 jupcake for 1 USDC.
Use the Swap API to swap exactly 1 USDC output from Customer's SOL.
Merchant receives the 1 USDC, as planned!
Let’s Get Started
1. Setup
You will need slightly different imports and also remember to set up connection to an RPC. If you have not set up the other typical libraries or are familiar with the Swap API, please follow this Environment Setup and Get Quote and Swap guide.

npm i @solana/spl-token

import { PublicKey, Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

Before we start getting a quote and swap transaction, for example sake, we will need to prepare both merchant and customer accounts. In production scenario, you will need to dynamically pass this in and allow users to sign in their device interfaces.

note
Do note that you will need to have already set up:

A wallet in your machine to simulate yourself as the customer as the customer is the signer of the transaction (similar to how we set up in Environment Setup).
trackingAccount is an additional Solana Account you can pass in to track only Jupiter transactions easily.
Set Up Accounts
const privateKeyArray = JSON.parse(fs.readFileSync('/Path/to/.config/solana/id.json', 'utf8').trim());
const customerWallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Your preferred token payment
const customerAccount = customerWallet.publicKey;
const merchantAccount = new PublicKey('ReplaceWithMerchantPubkey');
// const trackingAccount = new PublicKey('ReplaceWithPubkey'); // If required

console.log("USDC_MINT:", USDC_MINT.publicKey);
console.log("merchantAccount:", merchantAccount.publicKey);
// console.log("trackingAccount:", trackingAccount.publicKey);

Set Up destinationTokenAccount
One more thing you will need to set up! Later on, you will need to pass in destinationTokenAccount which will be your token account for your preferred token payment mint. Do note that it is the merchant's token account and it needs to be initialized.

// Get the associated token account for the merchant wallet
const merchantUSDCTokenAccount = await getAssociatedTokenAddress(
	  USDC_MINT,
	  merchantAccount,
	  true,
	  TOKEN_PROGRAM_ID,
	  ASSOCIATED_TOKEN_PROGRAM_ID
);

console.log("merchantUSDCTokenAccount:", merchantUSDCTokenAccount.publicKey);

2. Set swapMode to ExactOut in Quote
Next, the merchant have to Get Quote for the customer. We are using the ExactOut mode because we know exactly how much output amount (1 USDC) the merchant want to receive but not sure how much input amount the customer should pay with.

By getting a quote first, the customer can know upfront the specific amount of input token before they approve and sign the transaction.

Limitations of ExactOut
Currently, there are some limitations as ExactOut is not widely supported across all DEXes.

Supported DEXes are only Orca Whirlpool, Raydium CLMM, and Raydium CPMM.
NOT ALL token pairs may be available.
const quoteResponse = await (
    await fetch(
        'https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000&slippageBps=50&restrictIntermediateTokens=true&swapMode=ExactOut'
    )
  ).json();
  
console.log(JSON.stringify(quoteResponse, null, 2));


From the this quote, you should get part of the response like this, where amount specified in the query parameter represents the outAmount in the response and of course, swapMode: ExactOut.

{
    "inputMint": "So11111111111111111111111111111111111111112",
    "inAmount": "4434914",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "outAmount": "1000000",
    "otherAmountThreshold": "4434914",
    "swapMode": "ExactOut",
    ...
}

3. Set destinationTokenAccount in Swap
The merchant then retrieves the serialized swap transaction, but the merchant need to specify the destinationTokenAccount in the parameters — this will build the swap transaction to swap but send to the merchant's specified token account which we defined earlier.

The destinationTokenAccount should be the merchant’s token account to receive the payment in. Also do note that customerAccount should be accounted for. You can refer to the Build Swap Transaction guide for other parameters to be passed in.

const swapResponse = await (
    await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: customerAccount.publicKey,
            destinationTokenAccount: merchantUSDCTokenAccount.publicKey,
            // trackingAccount: trackingAccount.publicKey,
        })
    })
).json();

4. Prepare Transaction
We have walked through the steps here and explained some of the code, you can refer to Send Swap Transaction - Prepare Transaction. The main difference for payments is to ensure that the customer is the fee payer (the merchant can be generous and be the fee payer too!) and the signer.

const transactionBase64 = swapResponse.swapTransaction
const transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64'));
transaction.feePayer = customerAccount.publicKey;
transaction.sign([customerWallet]);
const transactionBinary = transaction.serialize();

5. Send Transaction
We have walked through the steps here and explained some of the code, you can refer to Send Swap Transaction - Send Transaction. The main difference for payments is, you might want to try adjusting maxRetries to a higher count as it is not time sensitive and ideally this is used with tighter slippage and ensuring the inputMint is not too unstable.

Do note that more retries will cause the user to wait slightly longer, so find the balance between the two. Read more here: https://solana.com/docs/advanced/retry.

const signature = await connection.sendRawTransaction(transactionBinary, {
    maxRetries: 10,
    preflightCommitment: "finalized",
});
  
const confirmation = await connection.confirmTransaction({ signature }, "finalized");

if (confirmation.value.err) {
    throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}\nhttps://solscan.io/${signature}/`);
} else console.log(`Transaction successful: https://solscan.io/tx/${signature}/`);

The succeeded Swap Transaction should show:

Token A swaps from the customer's token account
Token A swap to Token B
Token B sends to the merchant's token account
If transactions are not landing well, you can refer to this section.
Requote with Lower Max Accounts
In some cases where you might be limited or require strict control by adding your own instructions to the swap transaction, you might face issues with exceeding transaction size limit. In this section, we will provide some helping code to help you requote when the transaction size is too large.

note
We provide a maxAccounts param in the /quote endpoint to allow you to reduce the total number of accounts used for a swap - this will allow you to add your own instructions.

Refer to this section for more information and do note its limitations and important notes before using.

Example Code
Request for quote and the swap transaction as per normal.
Serialize the transaction.
Use the conditions to check if the transaction is too large.
If too large, requote again with lower max accounts - do note that the route will change.
If not, sign and send to the network.
tip
We recommend maxAccounts 64 and start as high as you can, then incrementally reduce when requoting.

Do note that with lower max accounts, it will might yield bad routes or no route at all.

tip
When you serialize the transaction, you can log the number of raw bytes being used in the transaction.

You can either add your custom instructions before or after serializing the transaction.

import {
    AddressLookupTableAccount,
    Connection,
    Keypair,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';

// Set up dev environment
import fs from 'fs';
const privateKeyArray = JSON.parse(fs.readFileSync('/Path/to/key', 'utf8').trim());
const wallet = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
const connection = new Connection('your-own-rpc');

// Recommended
const MAX_ACCOUNTS = 64

async function getQuote(maxAccounts) {
    const params = new URLSearchParams({
        inputMint: 'insert-mint',
        outputMint: 'insert-mint',
        amount: '1000000',
        slippageBps: '100',
        maxAccounts: maxAccounts.toString()
    });

    const url = `https://lite-api.jup.ag/swap/v1/quote?${params}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const quoteResponse = await response.json();
    
    if (quoteResponse.error) {
        throw new Error(`Jupiter API error: ${quoteResponse.error}`);
    }
    
    return quoteResponse;
};

async function getSwapInstructions(quoteResponse) {
    const response = await fetch('https://lite-api.jup.ag/swap/v1/swap-instructions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quoteResponse: quoteResponse,
            userPublicKey: wallet.publicKey.toString(),
            prioritizationFeeLamports: {
                priorityLevelWithMaxLamports: {
                    maxLamports: 10000000,
                    priorityLevel: "veryHigh"
                }
            },
            dynamicComputeUnitLimit: true,
        }, null, 2)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const swapInstructionsResponse = await response.json();
    
    if (swapInstructionsResponse.error) {
        throw new Error(`Jupiter API error: ${swapInstructionsResponse.error}`);
    }

    return swapInstructionsResponse;
};

async function buildSwapTransaction(swapInstructionsResponse) {
    const {
        computeBudgetInstructions,
        setupInstructions,
        swapInstruction,
        cleanupInstruction,
        addressLookupTableAddresses,
    } = swapInstructionsResponse;
    
    const deserializeInstruction = (instruction) => {
        if (!instruction) return null;
        return new TransactionInstruction({
            programId: new PublicKey(instruction.programId),
            keys: instruction.accounts.map((key) => ({
                pubkey: new PublicKey(key.pubkey),
                isSigner: key.isSigner,
                isWritable: key.isWritable,
            })),
            data: Buffer.from(instruction.data, "base64"),
        });
    };

    const getAddressLookupTableAccounts = async (
        keys
    ) => {
        const addressLookupTableAccountInfos =
            await connection.getMultipleAccountsInfo(
                keys.map((key) => new PublicKey(key))
            );
    
        return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
            const addressLookupTableAddress = keys[index];
            if (accountInfo) {
                const addressLookupTableAccount = new AddressLookupTableAccount({
                    key: new PublicKey(addressLookupTableAddress),
                    state: AddressLookupTableAccount.deserialize(accountInfo.data),
                });
                acc.push(addressLookupTableAccount);
            }
    
            return acc;
        }, []);
    };

    const addressLookupTableAccounts = [];
    addressLookupTableAccounts.push(
        ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
    );

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    // Create transaction message with all instructions
    const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions: [
            ...(computeBudgetInstructions?.map(deserializeInstruction).filter(Boolean) || []),
            ...(setupInstructions?.map(deserializeInstruction).filter(Boolean) || []),
            deserializeInstruction(swapInstruction),
            ...(cleanupInstruction ? [deserializeInstruction(cleanupInstruction)].filter(Boolean) : []),
        ].filter(Boolean),
    }).compileToV0Message(addressLookupTableAccounts);

    const transaction = new VersionedTransaction(messageV0);

    return transaction;
}

async function checkTransactionSize(transaction) {
    // Max raw bytes of a Solana transaction is 1232 raw bytes
    // Using the conditions below, we can check the size of the transaction
    // (or if it is too large to even serialize)
    try {
        const transactionUint8Array = transaction.serialize();
        console.log(transactionUint8Array.length)

        // Use 1232 assuming you have added your instructions to the transaction above
        // If you have not add your instructions, you will need to know how much bytes you might use
        return (transactionUint8Array.length > 1232);

    } catch (error) {
        if (error instanceof RangeError) {
            console.log("Transaction is too large to even serialize (RangeError)");

            return true;

        } else {
            throw error; // Re-throw if it's not a RangeError
        }
    }
}

// Main execution logic with retry mechanism
let counter = 0;
let transactionTooLarge = true;
let quoteResponse, swapInstructionsResponse, transaction;

while (transactionTooLarge && counter < MAX_ACCOUNTS) {
    try {
        console.log(`Attempting with maxAccounts: ${MAX_ACCOUNTS - counter}`);
        
        quoteResponse = await getQuote(MAX_ACCOUNTS - counter);
        swapInstructionsResponse = await getSwapInstructions(quoteResponse);
        transaction = await buildSwapTransaction(swapInstructionsResponse);
        transactionTooLarge = await checkTransactionSize(transaction);
        
        if (transactionTooLarge) {
            console.log(`Transaction too large (with ${MAX_ACCOUNTS - counter} maxAccounts), retrying with fewer accounts...`);
            counter++;
        } else {
            console.log(`Transaction size OK with ${MAX_ACCOUNTS - counter} maxAccounts`);
        }
        
    } catch (error) {
        console.error('Error in attempt:', error);
        counter += 2; // Incrementing by 1 account each time will be time consuming, you can use a higher counter
        transactionTooLarge = true;
    }
}

if (transactionTooLarge) {
    console.error('Failed to create transaction within size limits after all attempts');
} else {
    console.log('Success! Transaction is ready for signing and sending');
    
    // After, you can add your transaction signing and sending logic
}


Example Response
Attempting with maxAccounts: 64
Transaction is too large to even serialize (RangeError)
Transaction too large (with 64 maxAccounts), retrying with fewer accounts...

Attempting with maxAccounts: 63
Transaction is too large to even serialize (RangeError)
Transaction too large (with 63 maxAccounts), retrying with fewer accounts...

...

Attempting with maxAccounts: 57
1244
Transaction too large (with 57 maxAccounts), retrying with fewer accounts...

Attempting with maxAccounts: 56
1244
Transaction too large (with 56 maxAccounts), retrying with fewer accounts...

...

Attempting with maxAccounts: 51
1213
Transaction size OK with 51 maxAccounts
Success! Transaction is ready for signing and sending

Edit this page
