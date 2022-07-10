import { ethers, network } from "hardhat"
import { FundMe } from "../typechain"

const main = async () => {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const sendValue = ethers.utils.parseEther("0.1")

    const fundMe = await ethers.getContract("FundMe", deployer)

    const withdrawResponse = await fundMe.withdraw()
    const withdrawReceipt = await withdrawResponse.wait(1)

    console.log("withdraw complete from fundme contract", withdrawReceipt)
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
