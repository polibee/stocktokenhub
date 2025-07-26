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
Important Notes

The Jupiter Swap project account for the Referral Program is 45ruCyfdRkWpRNGEqWzjCiXRHkZs8WXCLQ67Pnpye7Hp.
The referralTokenAccount can either be:
Input mint or the output mint on the swap for ExactIn.
Input mint ONLY on the swap for ExactOut.
You can use the Dashboard, SDK or API to set up the referralAccount and referralTokenAccount in this guide.
Let’s Get Started

1. Set up

You will need to complete the prerequisites and understanding of Environment Setup and Get Quote and Swap guide as this is reliant on the Swap API.

Obtain referralAccount and referralTokenAccount

There are 3 ways you can set up a referral account.

Use our referral dashboard to create them. After creating, remember to find your Referral Key on the page and the associated token accounts.
Use our SDK to create them. You can use the example scripts to create.
Use our API to create them. You can use this API reference to create.
Obtain mintAccount

As for the mint account, assuming you have an interface where a user swaps, you will know up front what are the input or output mints. For the sake of example, we will use a hardcoded mint public key.

const referralAccount = new Publickey('ReplaceWithPubkey');
const mintAccount = new Publickey('So11111111111111111111111111111111111111112');

2. Set your referral fee in Quote

Setting your referral fee is simple, just add platformFeeBps parameter to the /quote endpoint.

In this example, we set platformFeeBps to 20 which equates to 0.2%.

const quoteResponse = await (
    await fetch(
        'https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000&slippageBps=50&restrictIntermediateTokens=true&platformFeeBps=20'
    )
  ).json();
  
console.log(JSON.stringify(quoteResponse, null, 2));

3. Set your referral token account in Swap

In order to refer and receive fees from all types of tokens, you will need to have already initialize referralTokenAccounts (owned by your referralAccount) for the mint in the swap. By calling the Swap API with the parameter feeAccount, which is the referralTokenAccount, you will receive the serialized swap transaction that will set a fee to be taken from the referred and sent to that token account.

In this code block, we will be using the SDK to try to find the referralTokenAccount based on our previously defined referralAccount and mintAccount.

If the token account is found, it will proceed to the Swap API.
If the token account is not found, it will send a transaction to the network to attempt to initialize one for the mint. Do note that transactions may fail due to various reasons like Priority Fees.
import { ReferralProvider } from "@jup-ag/referral-sdk";

const { tx, referralTokenAccountPubKey } = await provider.initializeReferralTokenAccount({
    payerPubKey: wallet.publicKey,
    referralAccountPubKey: referralAccount,
    mint: mintAccount,
});

const referralTokenAccount = await connection.getAccountInfo(referralTokenAccountPubKey);

// Attempt to initialize a token account
if (!referralTokenAccount) {
    const signature = await sendAndConfirmTransaction(connection, tx, [wallet]);
    console.log({ signature, referralTokenAccountPubKey: referralTokenAccountPubKey.toBase58() });

// Since initialized, it will carry on
} else {
    console.log(`referralTokenAccount ${referralTokenAccountPubKey.toBase58()} for mint ${mintAccount.toBase58()} already exists`);
};

const feeAccount = referralTokenAccountPubKey;
console.log(feeAccount);

However, if you are confident that the referralTokenAccount for specific mints have been created, you can use this method to get it. Do note that, even if the token account is not intialized, it will return a pubkey as it is a Program Derived Address. Read more here.

const [feeAccount] = PublicKey.findProgramAddressSync(
    [
        Buffer.from("referral_ata"), // A string that signifies the account type, here "referral_ata."
        referralAccount.toBuffer(), //  The public key of the referral account converted into a buffer.
        mintAccount.toBuffer(), // The mint public key, converted into a buffer.
    ],
    new PublicKey("REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3") // The public key of the Referral Program
);

Using the above, we will now know the feeAccount to be passed in as the parameter in Swap API. You can refer to the Build Swap Transaction guide to add any parameters where necessary to help transaction sending, etc.

const swapResponse = await (
    await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toBase58(), // Pass in actual referred user in production
            feeAccount: feeAccount,
        })
    })
).json();

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