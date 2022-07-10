# Built with

- Solidity
- Hardhat


# Getting Started

## Installation

1. Clone the repo
```shell
    git clone https://github.com/sushantreddycom/p3-hardhat-fund-me
```
2. Install the packages
```shell
yarn add 
```

3. Enter your keys, Etherscan and Coinmarket API in .env file
```shell
    const RPC_RINKEBY_URL=''
    const RINKEBY_PRIVATE_KEY=''
    const ETHERSCAN_API_KEY=''
    const COINMARKETCAP_API_KEY=''
```

# Usage
In this project, I have created a sample contract to fund a particular address and withdraw from that address. 

Also has sample unit and staging tests. Project also generates gas-report.txt for optimizing gas expenses. To enable gas report generation, go to hardhat config and update *gasReporter* flag to *true* as below.

``` shell
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COIN_MARKET_CAP_API,
    },
```

## Running a local node
Setup localhost by using

```shell
yarn hardhat node
```
## Running tests
To run unit tests,

```shell
yarn hardhat test --network localhost
```

To run staging tests,

```shell
yarn hardhat test --network rinkeby    
```

To check code coverage,

```shell
yarn coverage
```
## Deploying scripts
To run fund.ts or withdraw.ts scrips in the scripts folder (say on localhost )

```shell
yarn hardhat run scripts/fund.ts --network localhost
```

# License
Project distributed under MIT License.

# Contact
Name: [@sushantreddycom](https://twitter.com/sushantreddycom)

Project Link:[ Github Link](https://github.com/sushantreddycom/p3-hardhat-fund-me) 
