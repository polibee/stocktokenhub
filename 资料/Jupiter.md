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
Token API
The Jupiter Token API and verification system aims to provide a way to validate mint addresses and provide integrators a simply way to get mint information.

DEPRECATED
Token API V1 will be/is deprecated by 1 August 2025.

Please migrate to Token API V2 which consists of breaking changes.

About
As Solana grew and exploded with tens of thousands of newly minted tokens a day, the Jupiter Token API and verification system has evolved to meet the demands of token verification and provide an ecosystem-wide source of truth to rely on.

A historical breakdown of the evolutions of the Token API and verification system.

Solana Token Registry was deprecated in 2022.
Ecosystem Token List V1: Github: Maintained via Github with 4.8k Pull Requests verified manually.
Ecosystem Token List V2: Catdet List: Maintained by Catdets and community with simple metrics to aid review.
Ecosystem Token List V3: Verify: Using a variety of trading, social metrics and Organic Score to aid verification.
More reading materials
Introducing a new token verification method at https://verify.jup.ag
Background and History of the Ecosystem Token List V2