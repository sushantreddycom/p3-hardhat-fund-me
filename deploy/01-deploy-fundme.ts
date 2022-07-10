import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Address, DeployFunction } from "hardhat-deploy/types"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    console.log("deploying function")

    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()

    const chainID: number = network.config.chainId!
    const isDevelopment = developmentChains.includes(network.name)
    console.log("chainID: ", chainID)

    // deploy fundMe contract
    let ethUSDPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = await deployments.get("MockV3Aggregator")
        ethUSDPriceFeedAddress = ethUSDAggregator.address
    } else {
        ethUSDPriceFeedAddress = networkConfig[chainID].ethUsdPriceFeedAddress!
    }

    console.log("Deploying Fund Me contract....")
    const args = [ethUSDPriceFeedAddress]
    console.log("eth USD Price Feed: ", args)

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUSDPriceFeedAddress],
        log: true,
        waitConfirmations: isDevelopment
            ? 1
            : networkConfig[chainID].blockConfirmation,
    })

    if (!isDevelopment) {
        await verify(fundMe.address, args)
    }
    console.log(
        `FundMe contract deployed successfully at address ${fundMe.address}`
    )
    console.log("-----------------------")
}

export default deployFunc

deployFunc.tags = ["all", "fundMe"]
