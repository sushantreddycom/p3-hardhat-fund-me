import { ethers, network } from "hardhat"
import { FundMe } from "../typechain"

const main = async () => {
    // get deployer account
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const fundValue = ethers.utils.parseEther("1")
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(`fund Me contract deployed at ${fundMe.address}`)

    const fundMeResponse = await fundMe.fund({ value: fundValue })
    const txnReceipt = await fundMeResponse.wait(1)
    console.log("funded txn receipt", txnReceipt)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
