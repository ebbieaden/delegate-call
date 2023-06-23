const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DelegateCall Attack", function () {
  let Good;
  let goodContract;
  let Helper;
  let helperContract;
  let Attack;
  let attackContract;

  beforeEach(async function () {
    Helper = await ethers.getContractFactory("Helper");
    helperContract = await deployContract("Helper");
    Good = await ethers.getContractFactory("Good");
    goodContract = await deployContract("Good", [helperContract.address]);
    Attack = await ethers.getContractFactory("Attack");
    attackContract = await deployContract("Attack", [goodContract.address]);
  });

  it("should change the owner of the Good Contract", async function () {
    const initialOwner = await goodContract.owner();
    await attackContract.attack();
    const newOwner = await goodContract.owner();

    expect(newOwner).to.equal(attackContract.address);
    expect(newOwner).to.not.equal(initialOwner);
  });

  it("should update the num value in the Helper contract", async function () {
    const numValue = 42;
    await attackContract.setNum(numValue);
    const updatedNum = await helperContract.num();

    expect(updatedNum).to.equal(numValue);
  });
});


// const { expect } = require("chai");
// const { ethers, deployments } = require("hardhat");

// describe("DelegateCall Attack", function () {
//   let Good;
//   let goodContract;
//   let Helper;
//   let helperContract;
//   let Attack;
//   let attackContract;

//   beforeEach(async function () {
//     await deployments.fixture();

//     Helper = await ethers.getContractFactory("Helper");
//     helperContract = await Helper.deploy();
//     await helperContract.deployed(); // Wait for deployment transaction to be mined

//     Good = await ethers.getContractFactory("Good");
//     goodContract = await Good.deploy(helperContract.address);
//     await goodContract.deployed();

//     Attack = await ethers.getContractFactory("Attack");
//     attackContract = await Attack.deploy(goodContract.address);
//     await attackContract.deployed();
//   });

//   it("should change the owner of the Good Contract", async function () {
//     // Retrieve the initial owner of the Good Contract
//     const initialOwner = await goodContract.owner();

//     // Call the attack function
//     await attackContract.attack();

//     // Retrieve the new owner of the Good Contract after the attack
//     const newOwner = await goodContract.owner();

//     // Assert that the owner has changed to the address of the attack contract
//     expect(newOwner).to.equal(attackContract.address);
//     // Assert that the owner is not the initial owner
//     expect(newOwner).to.not.equal(initialOwner);
//   });

//   it("should update the num value in the Helper contract", async function () {
//     const numValue = 42;

//     // Call the setNum function in the Good Contract
//     await attackContract.setNum(numValue);

//     // Retrieve the updated num value from the Helper contract
//     const updatedNum = await helperContract.num();

//     // Assert that the num value has been updated
//     expect(updatedNum).to.equal(numValue);
//   });
// });
