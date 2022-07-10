import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} from "../helper-hardhat-config"

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    const chainName = network.name

    // check if the chain Name is a development chain
    // in that case, deploy the MockV3Aggregator contract
    // once deployed, this contract sits on deployments object tbat can be called from outside.
    if (developmentChains.includes(chainName)) {
        console.log("local network detected... deploying mocks...")
        const resp = await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        console.log(`Mock deployed successfully at address ${resp.address}`)
        console.log("------------------------------------------")
    }
}

export default deployMocks

deployMocks.tags = ["all", "mocks"]
