import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { network, deployments, ethers, getNamedAccounts } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { FundMe, MockV3Aggregator } from "../../typechain"

describe("FundMe", () => {
    let fundMe: FundMe
    let mockV3Aggregator: MockV3Aggregator
    const sendValue = ethers.utils.parseEther("0.1")
    let deployer: SignerWithAddress

    beforeEach(async () => {
        if (!developmentChains.includes(network.name)) {
            throw "Tests can only be run on local network"
        }

        await deployments.fixture(["all"])
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        fundMe = await ethers.getContract("FundMe")
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
    })

    describe("constructor", () => {
        it("constructor assigns the price feed address correctly", async () => {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", () => {
        // test 1
        it("check if transaction fails if amount less than 50 USD", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "FundMe__NotEnoughTransferValue"
            )
        })

        // test 2
        it("check if wallet balance increases on transfer", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(
                deployer.address
            )
            assert.equal(response.toString(), sendValue.toString())
        })

        // test 3
        it("test if funders array is incremented when a new account transfers", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            assert.equal(response, deployer.address)
        })
    })

    describe("withdraw", () => {
        // we first need to fund the contract before withdrawing
        // we do it using beforeEach
        // for all functions in withdraw scope, beforeEach() gets executed

        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        // test 1 - check if withdraw can only be done by owner
        it("check if only owner can access this function", async () => {
            const accounts = await ethers.getSigners()
            const newAccount: SignerWithAddress = accounts[1]

            await expect(
                fundMe.connect(newAccount).withdraw()
            ).to.be.revertedWith("FundMe__NotOwner")
        })

        // test 2 - check if we can give a single funder all ether back
        it("check if all ether transferred to single funder", async () => {
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            )
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )

            const transactionResponse = await fundMe
                .connect(deployer)
                .withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt

            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer.address
            )
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            // fund balance should go to zero
            assert.equal(endingFundMeBalance.toString(), "0")

            // starting contract balance + starting deployer balance = ending deployer balance + gas fees used
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance
                    .add(gasUsed.mul(effectiveGasPrice))
                    .toString()
            )
        })

        // test 3 - check if funds from multiple accounts can be withdrawn

        it("check if funds from multiple accounts can be withdrawn", async () => {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                await fundMe.connect(accounts[i]).fund({ value: sendValue })
            }

            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            )

            const transactionResponse = await fundMe.withdraw()
            const txnReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = txnReceipt
            const totalgas = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            )
            // ending fund balance is 0
            assert.equal(endingFundMeBalance.toString(), "0")

            // check if all balances match
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(totalgas).toString()
            )

            // check if each of the mapping accounts has zero balance

            for (let i = 0; i < 6; i++) {
                assert.equal(
                    (
                        await fundMe.getAddressToAmountFunded(
                            accounts[i].address
                        )
                    ).toString(),
                    "0"
                )
            }

            // check that funders(0) should not exist - since it gets reset
            await expect(fundMe.getFunder(0)).to.be.reverted
        })
    })

    describe("cheaperWithdraw testing...", () => {
        // we first need to fund the contract before withdrawing
        // we do it using beforeEach
        // for all functions in withdraw scope, beforeEach() gets executed

        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        // test 1 - check if withdraw can only be done by owner
        it("check if only owner can access this function", async () => {
            const accounts = await ethers.getSigners()
            const newAccount: SignerWithAddress = accounts[1]

            await expect(
                fundMe.connect(newAccount).cheaperWithdraw()
            ).to.be.revertedWith("FundMe__NotOwner")
        })

        // test 2 - check if we can give a single funder all ether back
        it("check if all ether transferred to single funder", async () => {
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            )
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )

            const transactionResponse = await fundMe
                .connect(deployer)
                .cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt

            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer.address
            )
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            // fund balance should go to zero
            assert.equal(endingFundMeBalance.toString(), "0")

            // starting contract balance + starting deployer balance = ending deployer balance + gas fees used
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance
                    .add(gasUsed.mul(effectiveGasPrice))
                    .toString()
            )
        })

        // test 3 - check if funds from multiple accounts can be withdrawn

        it("check if funds from multiple accounts can be withdrawn", async () => {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                await fundMe.connect(accounts[i]).fund({ value: sendValue })
            }

            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            )

            const transactionResponse = await fundMe.cheaperWithdraw()
            const txnReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = txnReceipt
            const totalgas = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            )
            // ending fund balance is 0
            assert.equal(endingFundMeBalance.toString(), "0")

            // check if all balances match
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(totalgas).toString()
            )

            // check if each of the mapping accounts has zero balance

            for (let i = 0; i < 6; i++) {
                assert.equal(
                    (
                        await fundMe.getAddressToAmountFunded(
                            accounts[i].address
                        )
                    ).toString(),
                    "0"
                )
            }

            // check that funders(0) should not exist - since it gets reset
            await expect(fundMe.getFunder(0)).to.be.reverted
        })
    })
})
