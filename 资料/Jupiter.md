Referral Program
The Referral Program is an open-source program used by Jupiter Programs (or any other programs) to enable developers to earn fees.

Referral Program Source Code
Open Source Repository: To understand and make use of the referral program better.

Jupiter API Integrators
The Jupiter Programs use the Referral Program to allow developers to earn fees when integrating with Jupiter. Below are some resources to help you quickly get started. There are a different ways to setup such as via the Jupiter Referral Dashboard or using the provided scripts.

Jupiter Referral Dashboard: To view and manage your referral accounts used with Jupiter APIs.
Add Fees to Ultra API: To add fees to your Ultra API integration.
Add Fees to Swap and Trigger API: To add fees to your Swap and Trigger API integration.
Add Fees to Terminal: To add fees to your Terminal integration.
Other Program Integrators
Project Usage
If you have a project/product that runs a program on the Solana blockchain, you can integrate the Referral Program to allow/share revenue with the integrators of your program.

Similar to how Jupiter Programs uses the Referral Program to help developers earn fees and/or share the revenue with Jupiter. For example, Jupiter Ultra uses the Jupiter Swap program which relies on the Referral Program.

Create a Project by calling initialize_project with your chosen base key and a project name (base key refers to a key identifier of your project).
Set a default_share_bps to share the fees with your referrers (or integrators).
An example of a Project account: Jupiter Ultra Project
Referrer Usage
If you are a referrer such as a developer or integrator of a project that runs a program on the Solana blockchain, you can create the necessary accounts via the Referral Program to earn fees.

The program must be integrated with the Referral Program.
Create a Referral account by calling initialize_referral_account with the correct Project account, the Referral account, and your own Partner account (Partner account is the admin of this referral account).
Create the necessary Referral token accounts for the Referral account to receive fees in.

Add Fees To Swap
info
As of January 2025, when integrating the Swap API, you no longer need to use the Referral Program to set up a referralAccount and referralTokenAccount to collect fees from the swaps you provide to the end users.

Simply, just pass in any valid token account as the feeAccount parameter in the Swap API.

However, do note that it is still applicable to the Trigger API.

note
You can still find information about the Referral Program.

The Referral Program is an open source program by Jupiter to provide referral fees for integrators who are integrating Jupiter Swap and Jupiter Limit Order. You can check out the code here to gain a better understanding of how it works.

Use Case
By default, there are zero protocol fees on Jupiter Swap. Integrators have the option to introduce a platform fee denoted in basis points, e.g. 20 bps for 0.2% of the token input or output.

Important Notes
Input mint or the output mint on the swap for ExactIn.
Input mint ONLY on the swap for ExactOut.
Example, if you swap JUP to USDC, you cannot take fees in SOL, it has to be part of the swap.
It does not support Token2022 tokens.
Referral Program is no longer required.
Via Referral Program (Required only for Trigger API)
1. Set up
You will need to complete the prerequisites and understanding of Environment Setup and Get Quote and Swap guide as this is reliant on the Swap API.

2. Set your fee in Quote
Setting your fee is simple, just add platformFeeBps parameter to the /quote endpoint.

In this example, we set platformFeeBps to 20 which equates to 0.2%.

const quoteResponse = await (
    await fetch(
        'https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000&slippageBps=50&restrictIntermediateTokens=true&platformFeeBps=20'
    )
  ).json();


3. Set your feeAccount in Swap
In the /swap endpoint, you will need to pass in the feeAccount parameter. The feeAccount is any token account that will receive the fees from the swap. Do ensure that the token account is initialized and is the correct mint to receive the fees in.

const swapResponse = await (
    await fetch('https://api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey, // Pass in actual referred user in production
            feeAccount: feeAccount,
        })
    })
).json();

4. Sign and send transaction
Finally, the user can sign the transaction and it can be submitted to the network to be executed. You can refer to the Send Swap Transaction guide to complete this step.

Create Token Account
To create a token account, you can use the following code or refer to Solana Cookbook.

The code creates the transaction to create the token account and handles the transaction siging and sending.
If the token account already exists, it will not create and might throw an error such as Provided owner is not allowed.
import { createAssociatedTokenAccount } from "@solana/spl-token";

const mintPubkey = new PublicKey(
    "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
);

let ata = await createAssociatedTokenAccount(
    connection, // connection
    wallet, // fee payer
    mintPubkey, // mint
    wallet.publicKey, // owner of the token account
    // confirmOptions, // if you need to skip simulation and send the transaction immediately
    // programId, // if you need to use a different token program id such as token-2022
    // associatedTokenProgramId,
    // allowOwnerOffCurve, // if you need to allow the owner to be off curve
);
console.log(`ATA: ${ata.toBase58()}`);
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