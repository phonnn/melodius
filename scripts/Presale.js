const { ethers, network } = require('hardhat');
const fs = require("fs");

const deployfunc = require("./isDeployed.js");
let accounts = []

async function main(){
    accounts = await ethers.getSigners();

    //usdt
    const USDT = "0x55d398326f99059fF775485246999027B3197955"

    //NFT info
    const nftName = "Test NFT";
    const nftSymbol = "TNFT"

    //Spawner
    const Spawner = await deployfunc.autoDeploy(
        'NFTSpawner',
        'NFTSpawner',
        network.name,
        nftName,
        nftSymbol,
        USDT
    );

    //Presale
    const Presale = await deployfunc.autoDeploy(
        'Presale',
        'Presale',
        network.name,
        Spawner.address
    );

    await Spawner.setMinter(Presale.address);    
}
main()
	.then(() => process.exit(0))
	.catch((error) => {
	console.error(error);
	process.exit(1);
});