
const { ethers} = require("hardhat");
const { constants } = require('@openzeppelin/test-helpers');

let accounts = []

describe("InitTest", async function () {
    beforeEach(async function() {
        accounts = await ethers.getSigners();
        const initial = await getInitialContracts();

        token = initial.MockToken;
        spawner = initial.NFTSpawner;
        presale = initial.Presale;
    });

    it("setSaleEvent test", async function () {
        var pass = true
        let start = Math.floor(new Date().getTime() / 1000);
        let end = start + 3600;
        let price1 = 100;
        let price2 = 500;

        try {
            // onlyMinter test
            await presale.connect(accounts[1]).setSaleEvent(1, start, end, price1);
            pass = false;
            console.log("onlyMinter")
        } catch (error) {
            // set thông số round 1, 2
            await presale.setSaleEvent(1, start, end, price1);
            await presale.setSaleEvent(2, start, end, price2);
            // giá round 1 = 100e18
            // giá round 2 = 500e18
            let round1 = await presale.getSaleEvent(1);
            let round2 = await presale.getSaleEvent(2);
            console.log(round1);
            console.log(round2);

            // check xem giá round 1, round 2 có set đúng không
            if(round1.price != price1){
                pass = false;
            }
            
            if(round2.price != price2){
                pass = false;
            }
        }

        if(!pass){
            throw 'setSaleEvent test Failed'
        }
    });

    it("setPresaleList test", async function () {
        var pass = true
        var listAddress = [];
        
        // add account 0-4 to presale list
        for(let i = 0; i < 5; i++){
            listAddress.push(accounts[i].address);
        }

        try {
            // onlyOwner test
            await presale.connect(accounts[1]).setPresaleList(1, listAddress);
            pass = false;
            console.log("onlyOwner")
        } catch (error) {
            await presale.setPresaleList(1, listAddress);
            
            //account 1 có trong white list => true
            let round1_true = await presale.getPresaleList(1, accounts[1].address);
            //account 5 không có trong white list => false
            let round1_false = await presale.getPresaleList(1, accounts[5].address);

            if(!(round1_true && !round1_false)){
                pass = false;
            }
        }

        if(!pass){
            throw 'setPresaleList test Failed'
        }
    });

    it("Mint test", async function () {
        var pass = true

        // onlyOwner test
        await spawner.transferOwnership(accounts[1].address)
        try {
            // owner hiện tại của contract spawner là accounts[1]
            await spawner.safeMint(accounts[1].address);
            pass = false;
            console.log("onlyOwner")
        } catch (error) {}

        // address 0 test
        try {
            //mint cho address 0 => lỗi
            await spawner.safeMint(constants.ZERO_ADDRESS, 1, 1);
            pass = false;
            console.log("Address(0)")
        } catch (error) {}
        
        // mint test
        // dùng accout 1 để mint
        await spawner.connect(accounts[1]).safeMint(accounts[2].address);
        let nft_bal = await spawner.balanceOf(accounts[2].address);

        if(nft_bal != 1){
            pass = false;
        }  

        if(!pass){
            throw 'Mint test test Failed'
        }
    });

    it("Buy test", async function () {
        var pass = true
        
        var listAddress = [];
        let start = Math.floor(new Date().getTime() / 1000) + 500;
        let end = start + 3600;
        let price1 = 100;
        let price2 = 500;

        // transferOwnership
        await spawner.transferOwnership(presale.address)

        // set sale event
        await presale.setSaleEvent(1, start, end, price1);
        await presale.setSaleEvent(2, start, end, price2);

        // add account 0-4 to presale list
        for(let i = 0; i < 5; i++){
            listAddress.push(accounts[i].address);
        }

        // set presale whitelist
        await presale.setPresaleList(1, listAddress);
        await presale.setPresaleList(2, listAddress);

        // buy test
        await token.transfer(accounts[1].address, ethers.utils.parseEther('1000'));
        await token.connect(accounts[1]).approve(presale.address, ethers.utils.parseEther('1000'));
        
        try {
            // address not in whitelist
            await presale.connect(accounts[6]).buy(1);
            pass = false;
            console.log("Address not in whitelist");
        } catch (error) {}
        
        // start time check
        try {
            // lúc này chưa tới start time nên chưa mua được
            await presale.connect(accounts[1]).buy(1);
            pass = false;
            console.log("Start time error");
        } catch (error) {
            // tua tới start time
            await ethers.provider.send("evm_setNextBlockTimestamp", [start + 1]);
            await ethers.provider.send('evm_mine');

            // round 1 buy
            await presale.connect(accounts[1]).buy(1);
        }

        // end time check
        try {
            //tua tới khi round 2 end
            await ethers.provider.send("evm_setNextBlockTimestamp", [end + 1]);
            await ethers.provider.send('evm_mine');

            // round 2 buy => lỗi
            await presale.connect(accounts[1]).buy(2);
            pass = false;
            console.log("End time error");
        } catch (error) {
            // đoạn này phải set lại sale event cho round 2 tại round 2 đã end rồi
            await presale.setSaleEvent(2, end, end + 3600, price2);

            // round 2 buy => success
            await presale.connect(accounts[1]).buy(2);
        }

        let nft_bal = await spawner.balanceOf(accounts[1].address) // = 2

        if(nft_bal != 2){
            pass = false;
        }

        try {
            await ethers.provider.send("evm_setNextBlockTimestamp", [start + 1]);
            await ethers.provider.send('evm_mine');
            // try duplicate buy
            await presale.connect(accounts[1]).buy(1);
            await presale.connect(accounts[1]).buy(2);
            pass = false;
        } catch (error) {}

        if(!pass){
            throw 'Buy Failed'
        }
    });
});

async function getInitialContracts() {
    const Mock = await ethers.getContractFactory("MockToken");
    const MockToken = await Mock.deploy(); 

    const _NFTSpawner = await ethers.getContractFactory("NFTSpawner");
    const NFTSpawner = await _NFTSpawner.deploy("Test NFT", "NFT");

    const _Presale = await ethers.getContractFactory("Presale");
    const Presale = await _Presale.deploy(NFTSpawner.address, MockToken.address);
    
    // await NFTSpawner.transferOwnership(Presale.address)
    console.log('Deploy done');
    return { MockToken, NFTSpawner, Presale }
}
