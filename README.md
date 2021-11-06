# SwormSwap Exchange Fiat to Crypto

SwormSwap Exchange Fait to Crypto is an exchange that convert fiat directly to 
to cryptocurrency, leveraging chainlink and paypal. The user can get Ethereum, StormNG (The Native Token of the platform) or Link by using their Credit Cards or Paypal accounts.

# Quickstart


Install the dependencies 
```
yarn install
```
Start the project 
```
yarn start 
```
The frontend and already deployed smart contract would be avaliable

# Installation
Set your `MNEMONIC` and `RPC_URL` 
```
export MNEMONIC="apple, cheese, etc...."
export RPC_URL="https://kovan.infura.io/v3/adfdsfasdfadsfasdfadfadfadf"

```
You will need Truffle installed too 
Then run:
```
yarn
truffle migrate --reset --network rinkeby
yarn start
```
A paypal developer account and intermediate server would be required
