const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers;

describe("Get tokens", function () {
	let provider, accounts, owner, brianToken;

	beforeEach(async function () {
		provider = ethers.provider;
		accounts = await ethers.getSigners();
		owner = accounts[0];

		const BrianToken = await ethers.getContractFactory("BrianCoin", owner);
		brianToken = await BrianToken.deploy();
		await brianToken.deployed();
	});

	it("Should take some ether and give BrianCoins", async function () {
		await brianToken.get_tokens(100000, {
			value: utils.parseEther("1"),
		});
		expect(await provider.getBalance(brianToken.address)).to.equal(
			utils.parseEther("1")
		);
		expect(await brianToken.balances(owner.address)).to.equal(100000);
	});

	it("Should take some BrianCoins and give ether", async function () {
		await brianToken.get_tokens(100000, {
			value: utils.parseEther("1"),
		});

		await brianToken.withdraw_tokens(25000);

		expect(await provider.getBalance(brianToken.address)).to.equal(
			utils.parseEther("0.75")
		);
		expect(await brianToken.balances(owner.address)).to.equal(75000);
	});

	it("Should revert transaction if incorrect value is sent", async function () {
		await expect(
			brianToken.get_tokens(1, {
				value: 100,
			})
		).to.be.revertedWith("Mismatching value and amount");
		expect(await brianToken.balances(owner.address)).to.equal(0);
		expect(await provider.getBalance(brianToken.address)).to.equal(0);
	});

	it("Should revert if taking too many BrianCoins", async function () {
		await brianToken.get_tokens(100000, {
			value: utils.parseEther("1"),
		});

		await expect(brianToken.withdraw_tokens(100001)).to.be.revertedWith(
			"Not Enough BrianCoin"
		);

		expect(await provider.getBalance(brianToken.address)).to.equal(
			utils.parseEther("1")
		);
		expect(await brianToken.balances(owner.address)).to.equal(100000);
	});

	it("Should allow transfers", async function () {
		await brianToken.get_tokens(100000, {
			value: utils.parseEther("1"),
		});
		brianToken = brianToken.connect(accounts[1]);
		await brianToken.get_tokens(100000, {
			value: utils.parseEther("1"),
		});

		await brianToken.transfer_tokens(owner.address, 50000);
		expect(await brianToken.balances(owner.address)).to.equal(150000);
		expect(await brianToken.balances(accounts[1].address)).to.equal(50000);
		await expect(
			brianToken.transfer_tokens(owner.address, 50001)
		).to.be.revertedWith("Not Enough BrianCoin");
	});

	it("Should emit transactions", async function () {
		await expect(
			brianToken.get_tokens(100000, {
				value: utils.parseEther("1"),
			})
		)
			.to.emit(brianToken, "Transfer")
			.withArgs(brianToken.address, owner.address, 100000);

		await expect(brianToken.withdraw_tokens(100000))
			.to.emit(brianToken, "Transfer")
			.withArgs(owner.address, brianToken.address, 100000);
	});
});

describe("Make Changes to the boys", function () {
	let provider, accounts, owner, brianToken;

	beforeEach(async function () {
		provider = ethers.provider;
		accounts = await ethers.getSigners();
		owner = accounts[0];

		const BrianToken = await ethers.getContractFactory("BrianCoin", owner);
		brianToken = await BrianToken.deploy();
		await brianToken.deployed();
	});

	it("Should allow owner to add to fam", async function () {
		expect(await brianToken.the_boys(owner.address)).to.equal(true);
		await brianToken.add_to_fam(accounts[1].address);
		expect(await brianToken.the_boys(accounts[1].address)).to.equal(true);
	});

	it("Should allow the boys to add to fam", async function () {
		await brianToken.add_to_fam(accounts[1].address);
		brianToken = brianToken.connect(accounts[1]);

		expect(await brianToken.add_to_fam(accounts[2].address));
		expect(await brianToken.the_boys(accounts[2].address)).to.equal(true);
	});

	it("Shouldn't allow others to add to fam", async function () {
		brianToken = brianToken.connect(accounts[1]);
		await expect(
			brianToken.add_to_fam(accounts[2].address)
		).to.be.revertedWith("Only the boys can add to fam");
		expect(await brianToken.the_boys(accounts[2].address)).to.equal(false);
	});

	it("Should allow the owner to remove to fam", async function () {
		await brianToken.add_to_fam(accounts[1].address);
		expect(await brianToken.the_boys(accounts[1].address)).to.equal(true);

		await brianToken.remove_from_fam(accounts[1].address);
		expect(await brianToken.the_boys(accounts[1].address)).to.equal(false);
	});

	it("Shouldn't allow the others to remove from fam", async function () {
		await brianToken.add_to_fam(accounts[1].address);
		expect(await brianToken.the_boys(accounts[1].address)).to.equal(true);

		brianToken = brianToken.connect(accounts[1]);
		await expect(
			brianToken.remove_from_fam(accounts[1].address)
		).to.be.revertedWith("Only the owner can remove a boy");
	});
});
