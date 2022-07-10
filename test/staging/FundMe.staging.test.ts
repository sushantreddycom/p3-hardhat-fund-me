import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { FundMe } from "../../typechain"
import { assert } from "chai"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Staging Test", () => {
          // before we run the test, we deploy the FundMe contract
          let fundMe: FundMe
          let deployer: SignerWithAddress
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]

              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("testing funding and withdrawal on staging rinkeby network", async () => {
              const response = await fundMe
                  .connect(deployer)
                  .fund({ value: sendValue })
              const txnReceipt = await response.wait(1)

              const withdrawResponse = await fundMe.withdraw()
              const withdrawReceipt = await response.wait(1)

              assert.equal(
                  (await ethers.provider.getBalance(fundMe.address)).toString(),
                  "0"
              )
          })
      })
