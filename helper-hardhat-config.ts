export interface networkConfigItem {
    name: string
    blockConfirmation?: number
    ethUsdPriceFeedAddress?: string
    daiUsdPriceFeedAddress?: string
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}
export const networkConfig: networkConfigInfo = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
        daiUsdPriceFeedAddress: "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF",
        blockConfirmation: 6,
    },
    1: {
        name: "mainnet",
        ethUsdPriceFeedAddress: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        daiUsdPriceFeedAddress: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
        blockConfirmation: 6,
    },
    42: {
        name: "kovan",
        ethUsdPriceFeedAddress: "0x9326BFA02ADD2366b30bacB125260Af641031331",
        daiUsdPriceFeedAddress: "0x777A68032a88E5A84678A77Af2CD65A7b3c0775a",
        blockConfirmation: 6,
    },
}

export const developmentChains = ["hardhat", "localhost"]
export const DECIMALS = 8
export const INITIAL_ANSWER = 200000000000
