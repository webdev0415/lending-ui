# lending-ui

🏦 Front end code for lending and borrowing NFTs

## This code includes:

- Website for lending, borrowing, and viewing deposited assets
- idl.json to connect to anchor
- anchor client within /src

Built with love by Honey Labs


## Setup local validator with Jet protcol

Clone this ... https://github.com/jet-lab/jet-v1
and run the follow commands 

cd scripts
solana-test-validator -r --bpf-program 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin ../deps/serum_dex.so
anchor build 
anchor deploy
ts-node localnet-migrate.ts

- this will create idls at app/public/idl/localnet/jet.json

Now you need to do three things
  - anchor idl init -f <target/idl/program.json> <program-id> in jet repo
  - move generated idl to the src/idl/localnet/jet.json path in lending-ui
  - npx ts-mocha -p ./tsconfig.json -t 1000000 --paths tests/*.spec.ts (mints some of the tokens to be used, can always do this manually)

If you need to mint tokens (your local wallet should be in the mint authority), you can use the spl-token cli and follow the instructions here https://learn.figment.io/tutorials/sol-mint-token.