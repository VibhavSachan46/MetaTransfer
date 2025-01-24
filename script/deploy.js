const {ethers} = require("hardhat");

async function main() {
  const Transaction = await ethers.getContractFactory("Transaction");
  const transaction = await Transaction.deploy();

  await transaction.waitForDeployment();

  const deployedAddress = await transaction.getAddress();

  console.log("Address of contract :", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//0xd913CDd430C5624d094606C9c02137122eB92338