
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

    it("setMinter test", async function () {
        var pass = true
        try {
            // onlyOwner test
            await spawner.connect(accounts[1]).setMinter(presale.address);
            pass = false;
            console.log("onlyOwner")
        } catch (error) {
            await spawner.setMinter(presale.address);
            let minter = await spawner.minter();
            
            if(minter != presale.address){
                pass = false;
            }
        }

        if(!pass){
            throw 'setMinter test Failed'
        }
    });

    it("setSaleEvent test", async function () {
        var pass = true
        let start = Math.floor(new Date().getTime() / 1000);
        let end = start + 3600;
        let price1 = 100;
        let price2 = 500;

        // set minter
        await spawner.setMinter(presale.address);

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

            let round1_price = await spawner.prices(1);
            let round2_price = await spawner.prices(2);
            console.log("round1_price", round1_price)
            console.log("round2_price", round2_price)

            // check xem giá round 1, round 2 có set đúng không
            if(round1_price != price1 * 1e18){
                pass = false;
            }
            
            if(round2_price != price2 * 1e18){
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
        var listAddress = [];

        // set minter
        await spawner.setMinter(accounts[0].address);
        
        //set price
        await spawner.setPrice(1, 100);

        // add account 0-4 to presale list
        for(let i = 0; i < 5; i++){
            listAddress.push(accounts[i].address);
        }

        // onlyMinter test
        try {
            await spawner.connect(accounts[1]).safeMint(accounts[1].address, 1, 1);
            pass = false;
            console.log("onlyMinter")
        } catch (error) {}

        // address 0 test
        try {
            //mint cho address 0 => lỗi
            await spawner.safeMint(constants.ZERO_ADDRESS, 1, 1);
            pass = false;
            console.log("Address(0)")
        } catch (error) {}

        // amount 0 test
        try {
            //mint số lượng 0 => lỗi
            await spawner.safeMint(accounts[1].address, 1, 0);
            pass = false;
            console.log("Amount = 0")
        } catch (error) {}
        
        // maxSupply mint test 
        try {
            // max nft = 10000
            // mint số lượng vượt quá max supply => lỗi
            await spawner.safeMint(accounts[0].address, 1, 10001);
            pass = false;
        } catch (error) {}

        // check if round not set test
        try {
            // round 2 chưa được setup => giá round 2 = 0 => lỗi
            await spawner.safeMint(accounts[1].address, 2, 1);
            pass = false;
            console.log("Round not set")
        } catch (error) {}

        // mint test
        await token.transfer(accounts[1].address, ethers.utils.parseEther('1000')); // 1000 token => max 10 nft
        await token.connect(accounts[1]).approve(spawner.address, ethers.utils.parseEther('1000'));

        try {
            // mua vượt quá balance
            await spawner.safeMint(accounts[1].address, 1, 11);
            pass = false;
        } catch (error) {
            await spawner.safeMint(accounts[1].address, 1, 10);
            let nft_bal = await spawner.balanceOf(accounts[1].address);

            if(nft_bal != 10){
                pass = false;
            }  
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

        // set minter
        await spawner.setMinter(presale.address);

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
        await token.connect(accounts[1]).approve(spawner.address, ethers.utils.parseEther('1000'));
        
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
    const NFTSpawner = await _NFTSpawner.deploy("Test NFT", "NFT", MockToken.address);

    const _Presale = await ethers.getContractFactory("Presale");
    const Presale = await _Presale.deploy(NFTSpawner.address);
    
    console.log('Deploy done');
    return { MockToken, NFTSpawner, Presale }
}
