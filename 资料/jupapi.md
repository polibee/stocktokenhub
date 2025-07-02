

jup refer account:HQaGy9AtmnFhvkhp3QWFZYa9KjPFrn4p2hwoNWQnMcgA

About Swap API
The Jupiter Swap API enables you to tap into the Jupiter Metis v1 Routing Engine, which aggregates across all liquidity available within the DEXes of Solana's DeFi ecosystem, allowing you to swap seamlessly from any token to any token.

Features
Feature	Description
Robust routing engine	The Jupiter Metis v1 Routing Engine is a robust and battle-tested routing engine that has been in production for over 2 years with multiple DEXes integrated and trillions of dollars in volume.
Best on-chain price	Trades can split across multiple different on-chain tokens and AMMs to ensure the best possible on-chain price.
Swap any token	Swap from any token to another token.
Zero platform fees	Swaps made via the Swap API do not incur any trading fees, both for you and your users.
Custom integrator fees	Integrators can choose to charge their own custom fees.
Slippage protection	Routes are intentionally chosen to decrease the likelihood of trade failures due to price slippage.
Fine-grained control	Allows for full control of how your transaction is crafted and broadcasted.
What About Ultra API?
Ultra API is the spiritual successor to Swap API, and is much simpler to use than Swap API. If you are first starting out on your Solana development journey, using Ultra API is highly recommended over Swap API.

However, unlike Ultra API, Swap API allows developers to:

Add custom instructions.
Add Cross Program Invocation (CPI) calls.
Choose the broadcasting strategy for the signed transaction (ie. via priority fee, Jito, etc.).
Choose which DEXes or AMMs to route through.
Modify the number of accounts to use in a transaction.
If you have a highly custom need like what is described above, then Swap API may be for you. However, with Swap API, there are many more things you need to worry about that Ultra API automatically handles for:

Upkeep of RPCs: To retrieve wallet balances, broadcast and retrieve transactions, etc.
Deciding transaction fee: Including, but not limited to, priority fee, Jito fee, etc.
Deciding slippage: The optimal slippage to use to balance between trade success and price protection, do note that RTSE is only available via Ultra API.
Broadcasting the transaction: Ultra uses a proprietary transaction sending engine which dramatically improves landing rate and speed.
Parsing the swap results: Polling and parsing the resulting transaction from the RPC, including handling for success and error cases.
If the above sounds like too much work, then Ultra API will be the better choice.

Getting Started with Swap API
Get Quote: Request for a quote which consists of the route plan, and other params such as integrator fee, slippage, etc.
Build Swap Transaction: Post the quote to build a swap transaction.
You can utilize other methods to return swap instructions or use CPI rather than the default swap transaction.
You can utilize other parameters such as priority fee, dynamic slippage, etc to customize the transaction.
Send Swap Transaction: Sign and send the swap transaction to the network via your preferred RPC or other methods.
Other Guides

Adding Fees to Swap API: Add custom integrator fees to the swap transaction.
Using Swap API as a payment method: Use Swap API as a payment method for your users.
Using Swap Terminal: Lite version of Jupiter that provides end-to-end swap with just a few lines of code.
Swap APIGet Quote
Get Quote
Please use the Swap API at your own discretion.
The Jupiter UI at https://jup.ag/ contains multiple safeguards, warnings and default settings to guide our users to trade safer. Jupiter is not liable for losses incurred by users on other platforms.

If you need clarification or support, please reach out to us in Discord.

Routing Engine
The quotes from Swap API are from the Jupiter Metis v1 Routing Engine.

The Quote API enables you to tap into the Jupiter Metis v1 Routing Engine, which accesses the deep liquidity available within the DEXes of Solana's DeFi ecosystem. In this guide, we will walkthrough how you can get a quote for a specific token pair and other related parameters.

Let’s Get Started
In this guide, we will be using the Solana web3.js package.

If you have not set up your environment to use the necessary libraries and the connection to the Solana network, please head over to Environment Setup.

API Reference
To fully utilize the Quote API, check out the Quote API Reference.

Quote API
note
Lite URL: https://lite-api.jup.ag/quote
Pro URL: https://api.jup.ag/swap/v1/quote
To upgrade to Pro or understand our rate limiting, please refer to this section.

API Key Setup
API Rate Limit
The most common trading pair on Solana is SOL and USDC, to get a quote for this specific token pair, you need to pass in the required parameters such as:

Parameters	Description
inputMint	The pubkey or token mint address e.g. So11111111111111111111111111111111111111112
outputMint	The pubkey or token mint address e.g. EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
amount	The number of input tokens before the decimal is applied, also known as the “raw amount” or “integer amount” in lamports for SOL or atomic units for all other tokens.
slippageBps	The number of basis points you can tolerate to lose during time of execution. e.g. 1% = 100bps
Get Quote
Using the root URL and parameters to pass in, it is as simple as the example code below!

const quoteResponse = await (
    await fetch(
        'https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50&restrictIntermediateTokens=true'
    )
  ).json();
  
console.log(JSON.stringify(quoteResponse, null, 2));


Example response:

{
  "inputMint": "So11111111111111111111111111111111111111112",
  "inAmount": "100000000",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "outAmount": "16198753",
  "otherAmountThreshold": "16117760",
  "swapMode": "ExactIn",
  "slippageBps": 50,
  "platformFee": null,
  "priceImpactPct": "0",
  "routePlan": [
    {
      "swapInfo": {
        "ammKey": "5BKxfWMbmYBAEWvyPZS9esPducUba9GqyMjtLCfbaqyF",
        "label": "Meteora DLMM",
        "inputMint": "So11111111111111111111111111111111111111112",
        "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "inAmount": "100000000",
        "outAmount": "16198753",
        "feeAmount": "24825",
        "feeMint": "So11111111111111111111111111111111111111112"
      },
      "percent": 100
    }
  ],
  "contextSlot": 299283763,
  "timeTaken": 0.015257836
}

tip
outAmount refers to the best possible output amount based on the route at time of quote, this means that slippageBps does not affect.

What’s Next
Now, you are able to get a quote, next steps is to submit a transaction to execute the swap based on the quote given. Let’s go!

Additional Resources
Restrict Intermediate Tokens
restrictIntermediateTokens can be set to true . If your route is routed through random intermediate tokens, it will fail more frequently. With this, we make sure that your route is only routed through highly liquid intermediate tokens to give you the best price and more stable route.

Legacy Transactions
All Jupiter swaps are using Versioned Transactions and Address Lookup Tables. However, not all wallets support Versioned Transactions yet, so if you detect a wallet that does not support versioned transactions, you will need to set the asLegacyTransaction parameter to true.

Adding Fees
By using the Quote API in your app, you can add a fee to charge your users. You can refer to the platformFeeBps parameter and to add it to your quote and in conjuction, add feeAccount (it can be any valid token account) to your swap request.

Direct Routes
In some cases, you may want to restrict the routing to only go through 1 market. You can use the onlyDirectRoutes parameter to achieve this. This will ensure routing will only go through 1 market.

note
If there are no direct routes, there will be no quote.
If there is only 1 market but it is illiquid, it will still return the route with the illiquid market.
unfavorable trades
Please be aware that using onlyDirectRoutes can often yield unfavorable trades or outcomes.

Max Accounts
In some cases, you may want to add more accounts to the transaction for specific use cases, but it might exceed the transaction size limit. You can use the maxAccounts parameter to limit the number of accounts in the transaction.

unfavorable trades
Please be aware that the misuse of maxAccounts can yield unfavorable trades or outcomes.

tip
Refer to the Requote with Lower Max Accounts guide for more information on how to requote and adjust the swap when using maxAccounts.
note
maxAccounts is an estimation and the actual number of accounts may vary.
maxAccounts only applies to the total number of accounts of the inner swaps in the swap instruction and not any of the setup, cleanup or other instructions (see the example below).
We recommend setting maxAccounts to 64
Keep maxAccounts as large as possible, only reduce maxAccounts if you exceed the transaction size limit.
If maxAccounts is set too low, example to 30, the computed route may drop DEXes/AMMs like Meteora DLMM that require more than 30 accounts.

Jupiter has 2 types of routing instructions, if you plan to limit maxAccounts, you will need to account for if the market is routable with ALTs or not:

Routing Instruction (Simple Routing): The market is still new, and we do not have ALTs set up for the market, hence the number of accounts required is higher as there are more accounts required.
Shared Accounts Routing Instruction: The market has sufficient liquidity (and has been live for a while), and we have ALTs set up for the market to be used in the routing instruction, hence the number of accounts required is lower as there are less accounts required.
Counting the accounts using an example transaction
In this transaction:

Max Accounts Stabble ExampleMax Accounts Lifinity V2 ExampleMax Accounts Shared Accounts Route Example
You can see that there are a total of 2 inner swaps where the number of accounts respectively are
Stabble Stable Swap: 12
Lifinity Swap V2: 13
Total: 25
The maxAccounts parameter is to control this value - to limit the total number of accounts in the inner swaps.
It doesn’t take into the consideration of a few things:
Each of the inner swap's program address, so 2 in this case.
Top level routing instruction accounts where in this case Shared Accounts Route is 13 and Route is 9.
There are also other accounts that are required to set up, clean up, etc which are not counted in the maxAccounts parameter
List of DEXes and their required accounts
Notes:

Values in the table are only estimations and the actual number of accounts may vary.
Min accounts are needed when we have already created the necessary ALTs for a specific pool resulting in less accounts needed in a Shared Accounts Routing context.
Sanctum and Sanctum Infinity are unique, and their accounts are dynamic.
DEX	Max	Min
Meteora DLMM	47	19
Meteora	45	18
Moonshot	37	15
Obric	30	12
Orca Whirlpool	30	12
Pumpfun AMM	42	17
Pumpfun Bonding Curve	40	16
Raydium	45	18
Raydium CLMM	45	19
Raydium CPMM	37	14
Sanctum	80	80
Sanctum Infinity	80	80
Solfi	22	9
Build Swap Transaction
The Swap API is one of the ways for you to interact with the Jupiter Swap Aggregator program. Before you send a transaction to the network, you will need to build the transaction that defines the instructions to execute and accounts to read/write to.

It can be complex to handle this yourself, but good news! Most of our APIs and SDKs just handles it for you, so you get a response with the transaction to be prepared and sent to the network.

Use Swap API to handle it for you or ...
If you are looking to interact with the Jupiter Swap Aggregator program in a different way, check out the other guides:

Swap Instructions
To compose with instructions and build your own transaction, read how to use the /swap-instructions in this section.

Flash Fill or Cross Program Invocation (CPI)
To interact with your own Solana program, read how to use the Flash Fill method or CPI in this section.

Let’s Get Started
In this guide, we will pick up from where Get Quote guide has left off.

If you have not set up your environment to use the necessary libraries, the RPC connection to the network and successfully get a quote from the Quote API, please start at Environment Setup or get quote.

API Reference
To fully utilize the Swap API, check out the Swap API or Swap Instructions Reference.

Swap API
note
Lite URL: https://lite-api.jup.ag/swap
Pro URL: https://api.jup.ag/swap/v1/swap
To upgrade to Pro or understand our rate limiting, please refer to this section.

API Key Setup
API Rate Limit
From the previous guide on getting a quote, now using the quote response and your wallet, you can receive a serialized swap transaction that needs to be prepared and signed before sending to the network.

Get Serialized Transaction
Using the root URL and parameters to pass in, it is as simple as the example code below!

Optimizing for Transaction Landing is super super important!
This code block includes additional parameters that our Swap API supports, such as estimating compute units, priority fees and slippage, to optimize for transaction landing.

To understand how these parameters help, the next step, Send Swap Transaction guide will discuss them.

const swapResponse = await (
await fetch('https://lite-api.jup.ag/swap/v1/swap', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    quoteResponse,
    userPublicKey: wallet.publicKey,
    
    // ADDITIONAL PARAMETERS TO OPTIMIZE FOR TRANSACTION LANDING
    // See next guide to optimize for transaction landing
    dynamicComputeUnitLimit: true,
    dynamicSlippage: true,
    prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: 1000000,
            priorityLevel: "veryHigh"
          }
        }
    })
})
).json();

console.log(swapResponse);

From the above example, you should see this response.

{
    swapTransaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAGDkS+3LuGTbs......+/oD9qb31dH6i0QZ2IHELXUX3Y1YeW79p9Stkqk12z4yvZFJiQ4GCQwLBwYQBgUEDggNTQ==',
    lastValidBlockHeight: 279632475,
    prioritizationFeeLamports: 9999,
    computeUnitLimit: 388876,
    prioritizationType: {
        computeBudget: { 
            microLamports: 25715,
            estimatedMicroLamports: 785154 
        }
    },
    dynamicSlippageReport: {
        slippageBps: 50,
        otherAmount: 20612318,
        simulatedIncurredSlippageBps: -18,
        amplificationRatio: '1.5',
        categoryName: 'lst',
        heuristicMaxSlippageBps: 100
    },
    simulationError: null
}


What’s Next
Now, you are able to get a quote and use our Swap API to build the swap transaction for you. Next steps is to proceed to prepare and sign the transaction and send the signed transaction to the network.

Let’s go sign and send!

Additional Resources
Build Your Own Transaction With Instructions
If you prefer to compose with instructions instead of the provided transaction that is returned from the /swap endpoint (like the above example). You can post to /swap-instructions instead, it takes the same parameters as the /swap endpoint but returns you the instructions rather than the serialized transaction.

note
In some cases, you may add more accounts to the transaction, which may exceed the transaction size limits. To work around this, you can use the maxAccounts parameter in /quote endpoint to limit the number of accounts in the transaction.

Refer to the GET /quote's maxAccounts guide for more details.

/swap-instructions code snippet
Example code snippet of using /swap-instruction

const instructions = await (
    await fetch('https://lite-api.jup.ag/swap/v1/swap-instructions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        quoteResponse,
        userPublicKey: wallet.publicKey,
    })
    })
).json();

if (instructions.error) {
    throw new Error("Failed to get swap instructions: " + instructions.error);
}

const {
    tokenLedgerInstruction, // If you are using `useTokenLedger = true`.
    computeBudgetInstructions, // The necessary instructions to setup the compute budget.
    setupInstructions, // Setup missing ATA for the users.
    swapInstruction: swapInstructionPayload, // The actual swap instruction.
    cleanupInstruction, // Unwrap the SOL if `wrapAndUnwrapSol = true`.
    addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
} = instructions;

const deserializeInstruction = (instruction) => {
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
    keys: string[]
): Promise<AddressLookupTableAccount[]> => {
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
    }, new Array<AddressLookupTableAccount>());
};

const addressLookupTableAccounts: AddressLookupTableAccount[] = [];

addressLookupTableAccounts.push(
    ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
);

const blockhash = (await connection.getLatestBlockhash()).blockhash;
const messageV0 = new TransactionMessage({
    payerKey: payerPublicKey,
    recentBlockhash: blockhash,
    instructions: [
    // uncomment if needed: ...setupInstructions.map(deserializeInstruction),
    deserializeInstruction(swapInstructionPayload),
    // uncomment if needed: deserializeInstruction(cleanupInstruction),
    ],
}).compileToV0Message(addressLookupTableAccounts);
const transaction = new VersionedTransaction(messageV0);

Build Your Own Transaction With Flash Fill Or CPI
If you prefer to interact with the Jupiter Swap Aggregator program with your own on-chain program. There are 2 ways to do it, typically on-chain program call Cross Program Invocation (CPI) to interact with each other, we also have another method called Flash Fill built by Jupiter (due to limitations of CPI in the past).

CPI is now recommended!
As of January 2025, Jupiter Swap via CPI is recommended for most users.

The Loosen CPI restriction feature has been deployed on Solana, you can read more here.

Why Flash Fill?
With Jupiter's complex routing, best prices comes at a cost. It often means more compute resources and accounts are required as it would route across multiple DEXes in one transaction.

Solana transactions are limited to 1232 bytes, Jupiter is using Address Lookup Tables (ALTs) to include more accounts in one transaction. However, the CPI method cannot use ALTs, which means when you add more accounts to a Jupiter Swap transaction, it will likely fail if it exceeds the transaction size limits.

Flash Fill allows the use of Versioned Transaction and ALTs, hence, reducing the total accounts used for a Jupiter Swap transaction.

CPI References
A CPI transaction will be composed of these instructions:

Borrow enough SOL from the program to open a wSOL account that the program owns.
Swap X token from the user to wSOL on Jupiter via CPI.
Close the wSOL account and send it to the program.
The program then transfers the SOL back to the user.
Links and Resources:

https://github.com/jup-ag/jupiter-cpi-swap-example
https://github.com/jup-ag/sol-swap-cpi
To ease integration via CPI, you may add the following crate jupiter-cpi to your program.
In cargo.toml

[dependencies]
jupiter-cpi = { git = "https://github.com/jup-ag/jupiter-cpi", rev = "5eb8977" }

In your code

use jupiter_cpi;
...

let signer_seeds: &[&[&[u8]]] = &[...];

// Pass accounts to context one-by-one and construct accounts here
// Or in practise, it may be easier to use remaining_accounts
// https://book.anchor-lang.com/anchor_in_depth/the_program_module.html

let accounts = jupiter_cpi::cpi::accounts::SharedAccountsRoute {
    token_program: ,
    program_authority: ,
    user_transfer_authority: ,
    source_token_account: ,
    program_source_token_account: ,
    program_destination_token_account: ,
    destination_token_account: ,
    source_mint: ,
    destination_mint: ,
    platform_fee_account: ,
    token_2022_program: ,
};
let cpi_ctx = CpiContext::new_with_signer(
    ctx.accounts.jup.to_account_info(),
    accounts,
    signer_seeds,
);

jupiter_cpi::cpi::shared_accounts_route(
    cpi_ctx,
    id,
    route_plan,
    in_amount,
    quoted_out_amount,
    slippage_bps,
    platform_fee_bps,
);

...

Flash Fill References
A Flash Fill transaction will be composed of these instructions:

Borrow enough SOL for opening the wSOL account from this program.
Create the wSOL account for the borrower.
Swap X token to wSOL.
Close the wSOL account and send it to the borrower.
Repay the SOL for opening the wSOL account back to this program.
Links and resources:

https://github.com/jup-ag/sol-swap-flash-fill
Send Swap Transaction
Transaction sending can be very simple but optimizing for transaction landing can be challenging. This is critical in periods of network congestion when many users and especially bots are competing for block space to have their transactions processed.

Improve Transaction Landing Tip
By using Jupiter Swap API, you can enable Dynamic Slippage, Priority Fee estimation and Compute Unit estimation, all supported on our backend and served directly to you through our API.

Let’s Get Started
In this guide, we will pick up from where Get Quote and Build Swap Transaction guide has left off.

If you have not set up your environment to use the necessary libraries, the RPC connection to the network and successfully get a quote from the Quote API, please start at Environment Setup or get quote.

Prepare Transaction
Who is the signer?
The most important part of this step is to sign the transaction. For the sake of the guide, you will be using the file system wallet you have set up to sign and send yourself.

However, for other production scenarios such as building your own program or app on top of the Swap API, you will need the user to be the signer which is often through a third party wallet provider, so do account for it.

In the previous guide, we are able to get the swapTransaction from the Swap API response. However, you will need to reformat it to sign and send the transaction, here are the formats to note of.

Formats	Description
Serialized Uint8array format	The correct format to send to the network.
Serialized base64 format	This is a text encoding of the Uint8array data, meant for transport like our Swap API or storage. You should not sign this directly.
Deserialized format	This is the human-readable, object-like format before serialization. This is the state you will sign the transaction.
Here's the code to deserialize and sign, then serialize.

swapTransaction from the Swap API is a serialized transaction in the base64 format.
Convert it to Uint8array (binary buffer) format.
Deserialize it to a VersionedTransaction object to sign.
Finally, convert it back to Uint8array format to send the transaction.
const transactionBase64 = swapResponse.swapTransaction
const transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64'));
console.log(transaction);

transaction.sign([wallet]);

const transactionBinary = transaction.serialize();
console.log(transactionBinary);

Blockhash Validity
If you look at the response of console.log(transaction);, you can see that our backend has already handled the blockhash and last valid block height in your transaction.

The validity of a blockhash typically lasts for 150 slots, but you can manipulate this to reduce the validity of a transaction, resulting in faster failures which could be useful in certain scenarios.

Read more about transaction expiry here.

Send Transaction
Transaction Sending Options
Finally, there are a 2 transaction sending options that we should take note of. Depending on your use case, these options can make a big difference to you or your users. For example, if you are using the Swap API as a payment solution, setting higher maxRetries allows the transaction to have more retries as it is not as critical compared to a bot that needs to catch fast moving markets.

Transaction Sending Options
Options	Description
maxRetries	Maximum number of times for the RPC node to retry sending the transaction to the leader. If this parameter is not provided, the RPC node will retry the transaction until it is finalized or until the blockhash expires.
skipPreflight	If true, skip the preflight transaction checks (default: false).

Verify that all signatures are valid.
Check that the referenced blockhash is within the last 150 blocks.
Simulate the transaction against the bank slot specified by the preflightCommitment.
const signature = await connection.sendRawTransaction(transactionBinary, {
    maxRetries: 2,
    skipPreflight: true
});

Transaction Confirmation
In addition, after sending the transaction, it is always a best practice to check the transaction confirmation state, and if not, log the error for debugging or communicating with your users on your interface. Read more about transaction confirmation tips here.

const confirmation = await connection.confirmTransaction({signature,}, "finalized");

if (confirmation.value.err) {
    throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}\nhttps://solscan.io/tx/${signature}/`);
} else console.log(`Transaction successful: https://solscan.io/tx/${signature}/`);

Swap Transaction Executed!
If you have followed the guides step by step without missing a beat, your transaction should theoretically land and you can view the link in console log to see the transaction.

Oh? Transaction Not Landing?
As the Solana network grew and increased in activity over the years, it has become more challenging to land transactions. There are several factors that can drastically affect the success of your transaction:

Setting competitive priority fee
Setting accurate amount of compute units
Managing slippage effectively
Broadcasting transaction efficiently
Other tips
How Jupiter Estimates Priority Fee?
You can pass in prioritizationFeeLamports to Swap API where our backend will estimate the Priority Fee for you.

We are using Triton’s getRecentPrioritizationFees to estimate using the local fee market in writable accounts of the transaction (comparing to the global fee market), across the past 20 slots and categorizing them into different percentiles.

Read more about Priority Fee here.

Parameters	Description
maxLamports	A maximum cap applied if the estimated priority fee is too high. This is helpful when you have users using your application and can be a safety measure to prevent overpaying.
global	A boolean to choose between using a global or local fee market to estimate. If global is set to false, the estimation focuses on fees relevant to the writable accounts involved in the instruction.
priorityLevel	A setting to choose between the different percentile levels. Higher percentile will have better transaction landing but also incur higher fees.

medium: 25th percentile
high: 50th percentile
veryHigh: 75th percentile
const swapResponse = await (
  await fetch('https://lite-api.jup.ag/swap/v1/swap', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          quoteResponse,
          userPublicKey: wallet.publicKey,
          prioritizationFeeLamports: {
              priorityLevelWithMaxLamports: {
                  maxLamports: 10000000,
                  global: false,
                  priorityLevel: "veryHigh"
              }
          }
      })
  })
).json();

How Jupiter Estimates Compute Unit Limit?
You can pass in dynamicComputeUnitLimit to Swap API where our backend will estimate the Compute Unit Limit for you.

When true, it allows the transaction to utilize a dynamic compute unit rather than using incorrect compute units which can be detrimental to transaction prioritization. Additionally, the amount of compute unit used and the compute unit limit requested to be used are correlated to the amount of priority fees you pay.

Read more about Compute Budget, Compute Unit, etc here.

const swapTransaction = await (
  await fetch('https://lite-api.jup.ag/swap/v1/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: wallet.publicKey,
      dynamicComputeUnitLimit: true
    })
  })
).json();

How Jupiter Estimates Slippage?
Apart from the static slippageBps parameter, Jupiter has iterated on different designs to estimate slippage better.

By using Dynamic Slippage, during swap transaction building, we will simulate the transaction and estimate a slippage value, which we then factor in the token categories heuristics to get the final slippage value.

Dynamic Slippage vs Real Time Slippage Estimator (RTSE)
RTSE is very different from Dynamic Slippage and has provided a much better user experience and results. RTSE is able to intelligently estimate the best possible slippage to use at the time of execution, balancing between trade success and price protection. RTSE uses a variety of heuristics, algorithms and monitoring to ensure the best user experience:

Heuristics: Token categories, historical and real-time slippage data, and more.
Algorithms: Exponential Moving Average (EMA) on slippage data, and more.
Monitoring: Real-time monitoring of failure rates to ensure reactiveness to increase slippage when necessary.
Refer to Ultra API for more information on RTSE.

warning
To use Dynamic Slippage, you will need to pass in dynamicSlippage=true to both the /swap/v1/quote and /swap/v1/swap endpoints.

Do note that we have discontinued development on Dynamic Slippage.

const quoteResponse = await (
  await fetch(
    'https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50&restrictIntermediateTokens=true&dynamicSlippage=true'
  )
).json();

const swapTransaction = await (
  await fetch('https://lite-api.jup.ag/swap/v1/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: wallet.publicKey,
      dynamicSlippage: true,
    })
  })
).json();


How Jupiter Broadcast Transactions?
Transaction broadcasting is the process of submitting a signed transaction to the network so that validators can verify, process, and include it in a block.

Broadcasting Through RPCs
After you’ve built and signed your transaction, the signed transaction is serialized into a binary format and sent to the network via a Solana RPC node. The RPC node will verify and relay the transaction to the leader validator responsible for producing the next block.

Read more about how RPC nodes broadcast transactions.

This is the most typical method to send transactions to the network to get executed. It is simple but you need to make sure the transactions are:

Send in the serialized transaction format.
Use fresh blockhash and last valid blockheight.
Use optimal amount of priority fees and compute unit limit.
Free of error.
Utilize retries.
Configure your RPCs
Optional but you can send your transaction to a staked RPC endpoint also known as Stake-Weighted Quality of Service (SWQoS).
Used dedicated RPC services versus free or shared, depending on how critical your usage is.
Propagate to multiple RPC rather than reliant on one.
Broadcasting Through Jito
To include Jito Tips in your Swap transaction, you can do specify in the Swap API parameters. However, please take note of these when sending your transaction to Jito and you can find thsese information in their documentation:

You need to submit to a Jito RPC endpoint for it to work.
You need to send an appropriate amount of Jito Tip to be included to be processed.
More about Jito
You can leverage Jito to send transactions via tips for faster inclusion and better outcomes. Similar to Priority Fees, Jito Tips incentivize the inclusion of transaction bundles during block production, enhancing users' chances of securing critical transactions in competitive scenarios.

Additionally, Jito enables bundling transactions to ensure they execute together or not at all, helping protect against front-running and other MEV risks through “revert protection” if any part of the sequence fails, all while reducing transaction latency for timely execution.

Read more about how Jito works and other details here.

const swapTransaction = await (
  await fetch('https://lite-api.jup.ag/swap/v1/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: wallet.publicKey,
      prioritizationFeeLamports: {
        jitoTipLamports: 1000000 // note that this is FIXED LAMPORTS not a max cap
      }
    })
  })
).json();
Swap API GuidesAdd Fees To Swap
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
Swap API GuidesPayments Through Swap
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
Swap API GuidesRequote with Lower Max Accounts
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
Swap API GuidesSwap In Solana Unity SDK
Swap In Solana Unity SDK (C#)
Jupiter is fully supported within the Solana.Unity-SDK. The core library is independent of Unity and can be incorporated into Unreal Engine using the UnrealCLR library or in a C# backend.

Using the Solana.Unity-SDK, game developers can effortlessly incorporate Jupiter swaps into their games and achieve cross-platform compatibility without the need to modify a single line of code.

Within the SDK, the Jupiter Swap API can also be used as a payment method, enabling you to utilize Jupiter + SolanaPay for facilitating user payments with any SPL token, allowing pricing in USDC or other tokens.

Documentation
For the detailed documentation, please visit: Solana Unity SDK Jupiter Documentation

Demos
Watch this demo video showcasing an in-game swap powered by the Jupiter integration: Watch Demo Video
Explore a live game demo here: Live Demo
Introduction to Terminal
Jupiter Terminal Hero

Jupiter Terminal is an open-source, lightweight, plug-and-play version of Jupiter that allows you to seamlessly integrate end-to-end swap functionality into your application with minimal effort - with just a few lines of code, you can embed a fully functional swap interface directly into your website while providing the same powerful Ultra Mode swap experience found on https://jup.ag.

Terminal Playground
Try out the Terminal Playground to experience the full swap features and see the different customization options with code snippets.

To view the open-source code, visit the GitHub repository.

Quick Start
To quick start your integration, check out the Next.js, React or HTML app examples.

Key Features
Seamless Integration: Embed Jupiter's swap functionality directly into your application without redirects.
Multiple Display Options: Choose between integrated, widget, or modal display modes.
Customizable Options: Configure the terminal to match your application's needs.
RPC-less: Integrate Terminal without any RPCs, Ultra handles transaction sending, wallet balances and token information.
Ultra Mode: Access to all features of Ultra Mode, read more about it in the Ultra API docs.
Getting Started
When integrating Terminal, there are a few integration methods to think about, and choose the one that best fits your application's architecture and requirements.

Integration Methods
Using Window Object - Simplest way to add and initialize Terminal.
Using NPM Package - Install via npm install @jup-ag/terminal and initialize as a module (will require you to maintain its dependencies).
Wallet Integration
Wallet Standard Support: For applications without existing wallet provider, Terminal will provide a wallet adapter and connection - powered by Unified Wallet Kit.
Passthrough Wallet: For applications with existing wallet provider(s), set enableWalletPassthrough=true with context, and Terminal will allow the application to pass through the existing wallet provider's connection to Terminal.
Adding Fees to Terminal
Referral Account: You can create a referral account via scripts or Referral Dashboard.
Referral Fee: You can set the referral fee and account in the formProps interface when you initialize the Terminal.
Quick Start Guides
In the next sections, we'll walk you through the steps to integrate Jupiter Terminal into different types of web applications from scratch.

Next.js
React
HTML
By integrating Jupiter Terminal into your application, you can seamlessly integrate a fully functional swap interface into your application with minimal effort, while staying at the forefront of Solana DeFi innovation.
Jupiter TerminalReact App Example
React App Example
In this guide, we'll walk you through from scratch the steps to integrate Jupiter Terminal into a React application.

Prerequisites
Before you begin, make sure you have the following installed on your system.

Node.js and npm: Download and install from nodejs.org

Step 1: Create a New React Project
Head to your preferred directory and create a new React project using create-react-app with TypeScript template (you can use other templates or methods to start your project too):

npx create-react-app terminal-demo --template typescript
cd terminal-demo
npm start

Step 2: Add TypeScript Support
Create a type declaration file terminal.d.ts in your project's /src/types folder:

declare global {
  interface Window {
    Jupiter: JupiterTerminal;
  }
};
export {};

Full TypeScript Declaration

declare global {
    interface Window {
        Jupiter: JupiterTerminal;
    }
}

export type WidgetPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
export type WidgetSize = 'sm' | 'default';
export type SwapMode = "ExactInOrOut" | "ExactIn" | "ExactOut";
export type DEFAULT_EXPLORER = 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';

export interface FormProps {
    swapMode?: SwapMode;
    initialAmount?: string;
    initialInputMint?: string;
    initialOutputMint?: string;
    fixedAmount?: boolean;
    fixedMint?: string;
    referralAccount?: string;
    referralFee?: number;
}

export interface IInit {
    localStoragePrefix?: string;
    formProps?: FormProps;
    defaultExplorer?: DEFAULT_EXPLORER;
    autoConnect?: boolean;
    displayMode?: 'modal' | 'integrated' | 'widget';
    integratedTargetId?: string;
    widgetStyle?: {
        position?: WidgetPosition;
        size?: WidgetSize;
    };
    containerStyles?: CSSProperties;
    containerClassName?: string;
    enableWalletPassthrough?: boolean;
    passthroughWalletContextState?: WalletContextState;
    onRequestConnectWallet?: () => void | Promise<void>;
    onSwapError?: ({
        error,
        quoteResponseMeta,
    }: {
        error?: TransactionError;
        quoteResponseMeta: QuoteResponse | null;
    }) => void;
    onSuccess?: ({
        txid,
        swapResult,
        quoteResponseMeta,
    }: {
        txid: string;
        swapResult: SwapResult;
        quoteResponseMeta: QuoteResponse | null;
    }) => void;
    onFormUpdate?: (form: IForm) => void;
    onScreenUpdate?: (screen: IScreen) => void;
}

export interface JupiterTerminal {
    _instance: JSX.Element | null;
    init: (props: IInit) => void;
    resume: () => void;
    close: () => void;
    root: Root | null;
    enableWalletPassthrough: boolean;
    onRequestConnectWallet: IInit['onRequestConnectWallet'];
    store: ReturnType<typeof createStore>;
    syncProps: (props: { passthroughWalletContextState?: IInit['passthroughWalletContextState'] }) => void;
    onSwapError: IInit['onSwapError'];
    onSuccess: IInit['onSuccess'];
    onFormUpdate: IInit['onFormUpdate'];
    onScreenUpdate: IInit['onScreenUpdate'];
    localStoragePrefix: string;
}

export { };

Step 3: Embed the Terminal Script
In your /public/index.html, add the Jupiter Terminal script:

<head>
  <script src="https://terminal.jup.ag/main-v4.js" data-preload defer></script>
</head>

Step 4: Initialize Terminal
There are two ways to initialize Jupiter Terminal in a React application:

Method 1: Using Window Object
In your /src/App.tsx, use the following code to initialize the terminal.

import React, { useEffect } from 'react';
import './App.css';
import './types/terminal.d';

export default function App() {
  useEffect(() => {
    // Initialize terminal
    window.Jupiter.init({
      displayMode: "widget",
      integratedTargetId: "jupiter-terminal",
    });
  }, []);

  return (
    <div className="App">
      <h1>Jupiter Terminal Demo</h1>
      <div id="jupiter-terminal" />
    </div>
  );
}

Method 2: Using @jup-ag/terminal Package
warning
Do note that using this method will require you to maintain its dependencies.

Install the package:
npm install @jup-ag/terminal

Initialize the terminal:
import React, { useEffect } from "react";
import "@jup-ag/terminal/css";
import "./App.css";
import "./types/terminal.d";

export default function App() {
  useEffect(() => {
    import("@jup-ag/terminal").then((mod) => {
      const { init } = mod;
      init({
        displayMode: "widget",
        integratedTargetId: "jupiter-terminal",
      });
    });
  }, []);

  return (
    <div>
      <h1>Jupiter Terminal Demo</h1>
      <div id="jupiter-terminal" />
    </div>
  );
}

There you have it! You've successfully integrated Jupiter Terminal into your Next.js application.

Please test the swap functionality and check the transaction.
If you require more customizations, check out the Terminal Playground or the Customization documentation.
If you have any questions or issues, please refer to the FAQ or contact us on Discord.
HTML App Example
In this guide, we'll walk you through from scratch the steps to integrate Jupiter Terminal into a HTML application.

Prerequisites
Before you begin, make sure you have the following installed on your system.

Node.js and npm: Download and install from nodejs.org http-server: Download and install http-server from npm

Step 1: Create a New HTML Project
Head to your preferred directory and create a new folder for your project:

mkdir terminal-demo
cd terminal-demo
touch index.html

Step 2: Add the Terminal Script
Add the Terminal script to your project:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jupiter Terminal Demo</title>
    <script src="https://terminal.jup.ag/main-v4.js" data-preload defer></script>
    <style>
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Jupiter Terminal Demo</h1>
        <div id="jupiter-terminal"></div>
    </div>

    <script>
        window.onload = function() {
            window.Jupiter.init({
                displayMode: "widget",
                integratedTargetId: "jupiter-terminal",
            });
        };
    </script>
</body>
</html>

Step 3: Run the Project
Run the project using http-server:

http-server

There you have it! You've successfully integrated Jupiter Terminal into your HTML application.

Please test the swap functionality and check the transaction.
If you require more customizations, check out the Terminal Playground or the Customization documentation.
If you have any questions or issues, please refer to the FAQ or contact us on Discord.
Customizing Terminal
Try out the Terminal Playground to experience the full swap features and see the different customization options with code snippets.

For the full customization options, you can refer to the repository.

If you are using TypeScript, you can use the type declaration file to get the full type definitions for the Terminal.

Full TypeScript Declaration

declare global {
    interface Window {
        Jupiter: JupiterTerminal;
    }
}

export type WidgetPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
export type WidgetSize = 'sm' | 'default';
export type SwapMode = "ExactInOrOut" | "ExactIn" | "ExactOut";
export type DEFAULT_EXPLORER = 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';

export interface FormProps {
    swapMode?: SwapMode;
    initialAmount?: string;
    initialInputMint?: string;
    initialOutputMint?: string;
    fixedAmount?: boolean;
    fixedMint?: string;
    referralAccount?: string;
    referralFee?: number;
}

export interface IInit {
    localStoragePrefix?: string;
    formProps?: FormProps;
    defaultExplorer?: DEFAULT_EXPLORER;
    autoConnect?: boolean;
    displayMode?: 'modal' | 'integrated' | 'widget';
    integratedTargetId?: string;
    widgetStyle?: {
        position?: WidgetPosition;
        size?: WidgetSize;
    };
    containerStyles?: CSSProperties;
    containerClassName?: string;
    enableWalletPassthrough?: boolean;
    passthroughWalletContextState?: WalletContextState;
    onRequestConnectWallet?: () => void | Promise<void>;
    onSwapError?: ({
        error,
        quoteResponseMeta,
    }: {
        error?: TransactionError;
        quoteResponseMeta: QuoteResponse | null;
    }) => void;
    onSuccess?: ({
        txid,
        swapResult,
        quoteResponseMeta,
    }: {
        txid: string;
        swapResult: SwapResult;
        quoteResponseMeta: QuoteResponse | null;
    }) => void;
    onFormUpdate?: (form: IForm) => void;
    onScreenUpdate?: (screen: IScreen) => void;
}

export interface JupiterTerminal {
    _instance: JSX.Element | null;
    init: (props: IInit) => void;
    resume: () => void;
    close: () => void;
    root: Root | null;
    enableWalletPassthrough: boolean;
    onRequestConnectWallet: IInit['onRequestConnectWallet'];
    store: ReturnType<typeof createStore>;
    syncProps: (props: { passthroughWalletContextState?: IInit['passthroughWalletContextState'] }) => void;
    onSwapError: IInit['onSwapError'];
    onSuccess: IInit['onSuccess'];
    onFormUpdate: IInit['onFormUpdate'];
    onScreenUpdate: IInit['onScreenUpdate'];
    localStoragePrefix: string;
}

export { };

Display Modes
Jupiter Terminal offers three distinct display modes to suit different use cases:

1. Integrated Mode
The integrated mode embeds the terminal directly into your application's layout. This is ideal for creating a seamless swap experience within your dApp.

{
  displayMode: "integrated",
  integratedTargetId: string, // Required: ID of the container element
  containerStyles?: {
    width?: string,
    height?: string,
    borderRadius?: string,
    overflow?: string
  },
  containerClassName?: string
}

2. Widget Mode
The widget mode creates a floating terminal that can be positioned in different corners of the screen. Perfect for quick access to swaps without taking up too much space.

{
  displayMode: "widget",
  widgetStyle?: {
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    size?: "sm" | "default"
  },
}

3. Modal Mode
The modal mode displays the terminal in a popup overlay. This is useful when you want to keep the terminal hidden until needed.

{
  displayMode: "modal",
}

Form Props Configuration
The formProps object allows you to customize the initial state and behavior of the swap form! This can be useful for use cases like fixed token swaps for memecoin communities or fixed amount payments.

{
  displayMode: "modal",
  formProps?: {
    swapMode?: SwapMode, // Set the swap mode to "ExactIn", "ExactOut", or default to "ExactInOrOut"

    initialAmount?: string, // Pre-fill the swap amount (e.g. "100")
    initialInputMint?: string, // Pre-select the input token by its mint address
    initialOutputMint?: string, // Pre-select the output token by its mint address

    fixedAmount?: boolean, // When true, users cannot change the swap amount
    fixedMint?: string, // Lock one side of the swap to a specific token by its mint address

    referralAccount?: string, // Set the referral account for the swap
    referralFee?: number, // Set the referral fee for the swap
  }
}

Wallet Integration
Jupiter Terminal supports third-party wallet integration through the enableWalletPassthrough prop. This allows your application to pass through an existing wallet provider's connection in your application to Terminal. If you do not have an existing wallet provider, Terminal will provide a wallet adapter and connection - powered by Unified Wallet Kit.

{
  // When true, wallet connection are handled by your dApp,
  // and use `syncProps()` to syncronise wallet state with Terminal.
  enableWalletPassthrough?: boolean,
  
  // When enableWalletPassthrough is true, this allows Terminal 
  // to callback your app's wallet connection flow
  onRequestConnectWallet?: () => void | Promise<void>;
}

Event Handling
Jupiter Terminal provides event handlers to track swap operations:

{
  onSuccess: ({ txid, swapResult, quoteResponseMeta }) => {
    // Handle successful swap
    console.log("Swap successful:", txid);
  },
  onSwapError: ({ error, quoteResponseMeta }) => {
    // Handle swap errors
    console.error("Swap failed:", error);
  }
}

Examples
Fixed SOL Swap
window.Jupiter.init({
  displayMode: "integrated",
  integratedTargetId: "swap-container",
  formProps: {
    initialInputMint: "So11111111111111111111111111111111111111112", // SOL
    initialOutputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    fixedMint: "So11111111111111111111111111111111111111112",
  },
});

Payment Integration
window.Jupiter.init({
  displayMode: "modal",
  formProps: {
    swapMode: "ExactOut",
    initialAmount: "10",
    fixedAmount: true,
    initialOutputMint: "YOUR_TOKEN_MINT",
    fixedMint: "YOUR_TOKEN_MINT",
  },
});

Floating Widget
window.Jupiter.init({
  displayMode: "widget",
  widgetStyle: {
    position: "bottom-right",
    size: "sm",
  },
});
FAQ
1. How do I feature request or get support?

For feature requests, please open an issue on the GitHub repository and tag us on Discord.
For support, please join the Discord server and get help in the developer channels.
2. How do I add fees to Terminal?

Creating Referral Account and Token Accounts: You can create via scripts or Referral Dashboard.
Adding to FormProps: You can set the referral account and fee in the formProps interface when you initialize the Terminal.
3. Integrated Mode: Token Search Modal Collapses Terminal

Ensure you establish a fixed height for the terminal container under containerStyles
{
   displayMode: "integrated",
   integratedTargetId: "jupiter-terminal",
   containerStyles: {
      height: "500px",
   },
}

Best Practices for Customization
1. Responsive Design

Use percentage-based widths for container styles
Test on different screen sizes
Consider mobile-first design
2. User Experience

Position widgets in easily accessible locations
Consider fixed token pairs for specific use cases
Implement proper error handling and prompts
3. Security

Use environment variables for sensitive data
Implement proper error boundaries
Validate user inputs
Edit this page
Jupiter Wallet KitGetting Started
Unified Wallet Kit
The Unified Wallet Kit is an open-source, Swiss Army Knife wallet adapter designed to streamline your development on Solana. Integrating multiple wallets into a single interface can be cumbersome, the Unified Wallet Kit aims to eliminates redundancies by providing these building blocks in a simple, plug-and-play package. This allows developers to focus on what matters most: building innovative features for your users.

The Unified Wallet Kit will help you reduce repetitive tasks within your development process, including:

Creating a wallet notification system.
Managing wallet states (connected, disconnected, etc.).
Implementing a mobile-friendly wallet connector .
Unified Wallet Kit References
Wallet Kit Playground: To play with different settings,features and styling.
Open Source Repository: To understand and make use of the wallet adapter better.
Quick Examples: To reference code snippets and examples.
Core Features
Feature	Description
Compact Bundle	Main ESM bundle is a lightweight 94KB (20KB gzipped).
Built-in Support	Comes with Wallet Standard and Mobile Wallet Adapter support.
Abstracted Wallet Adapter	Use the Bring Your Own Wallet (BYOW) approach to select custom and legacy wallets.
Mobile Responsive	Designed to be mobile-first.
Smart Notification System	Integrates seamlessly with your existing notification system or can be used independently.
Internationalization	Supports multiple languages including English, Chinese, Vietnamese, French, Japanese, Bahasa Indonesia, and Russian.
Theming Options	Choose from light, dark, and Jupiter modes, with more customization options coming soon.
New User Onboarding	Simplifies the onboarding process for new users.
Let's Get Started
TLDR Steps
Adjust the Theme Selector to your desired version.
Select your appropriate Language
Expand the "Show Snippet" box for the wallet configuration you would like in your app and
Select the Copy to Clipboard button for easy code insertion into your app.
Install the Unified Wallet Kit to your project dependencies.
Install the wallet adapter depenency
npm i @jup-ag/wallet-adapter

Wrap your app with <UnifiedWalletProvider />
const ExampleBaseOnly = () => {
  return (
    <UnifiedWalletProvider
      wallets={[]}
      config={{
        autoConnect: false,
        env: 'mainnet-beta',
        metadata: {
          name: 'UnifiedWallet',
          description: 'UnifiedWallet',
          url: 'https://jup.ag',
          iconUrls: ['https://jup.ag/favicon.ico'],
        },
        notificationCallback: WalletNotification,
        walletlistExplanation: {
          href: 'https://station.jup.ag/docs/old/additional-topics/wallet-list',
        },
      }}
    >
      <UnifiedWalletButton />
    </UnifiedWalletProvider>
  );
};

export default ExampleBaseOnly;

info
This kit also supports the attachment of custom elements to specific wallets

config={{
  walletAttachments: { 
    'Phantom': {
      attachment: <div tw="text-xs rounded-md bg-red-500 px-2 mx-2 text-center">Auto Confirm</div>
    } 
  }
}}
Jupiter Referral ProgramIntroduction
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