import { authenticator } from 'otplib';

import Gems from './model/gems.model.js';
import GemsLV from './model/gemslv.model.js';
import Blanks from './model/blanks.model.js';
import Rarity from './model/rarity.model.js';
import Types from './model/types.model.js';
import Users from './model/users.model.js';
import NFTs from './model/nfts.model.js';
import Minting from './model/minting.model.js';
import Listing from './model/listing.model.js';
import Stamina from './model/stamina.model.js';
import Fees from './model/fees.model.js';

import { 
    randBetween, 
    breed, 
    openBox, 
    addGem, 
    removeGem, 
    gemUpgrade, 
    staminaUpgrade, 
    listingItem, 
    delistingItem, 
    buyItem, 
    renewCode, 
    renewCodeAdmin, 
    accountCreate, 
    clearUsedCode, 
    addWallet,
    enable2FA,
    disable2FA,
    tokenDeposit,
    tokenWithdraw,
    nftDeposit,
    nftWithdraw,
} from './nft_actions.js';
import { usersModel, listingModel, refCodesModel } from './nft_actions.js';

// const BREED_COST = [[120, 80], [240, 80], [360, 80],  [600, 80], [960, 80], [1560, 80], [2520, 80]]

var types_data = [
    ['Classic', 10, 2, 86400000, 1760, 345600000, 240],
    ['Electric', 12, 2.4, 172800000, 800 , 345600000, 240],
    ['Solar', 15, 3, 259200000, 480, 345600000, 240],
    ['Atom', 17, 3.4, 345600000, 160 , 345600000, 240],
];

var rarity_data = [
    ['Common', 1, 10, 4, 0],
    ['Uncommon', 8, 18, 6, 2],
    ['Super Rare', 15, 35, 8, 4],
    ['Unique', 28, 63, 10, 6],
];

var gems_data = [
    ['Chipped', 3, 50, 2, 5, 35],
    ['Flawed', 3, 100, 8, 70, 55],
    ['Regular', 3, 200, 25, 220, 65],
    ['Glossy', 3, 400, 72, 600, 75],
    ['Flawless', 3, 800, 200, 1400, 85],
    ['Radiant', 3, 1000, 400, 4300, 85], //simulate
];

var stamina_data = [
    [1, 4, 600000, 'Newbie'],
    [3, 8, 1200000, 'Daily User'],
    [9, 18, 2700000, 'Best Player'],
    [15, 24, 3600000, 'Pro Player'],
    [30, 40, 6000000, 'Super Player']
];

var fee_data = [
    ['Marketplace Trading Fee', 2],
    ['Marketplace Royalty Fee', 4],
    ['Headphones Minting', 6],
]

// simulated database
var typesModel = [];
var raritiesModel = [];
var gemsLvModel = [];
var gemsModel1 = [];
var gemsModel2 = [];
var gemsModel3 = [];
var blanksModel_1 = [];
var blanksModel_2 = [];
var staminaModel = [];
var NFTsModel = [];
var feesModel = [];


// user simulate
const admin = new Users({
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'xxxx',
    role: 0,
    stamina: 0,
    maxStamina: 0,
    staminaRegen: 0,
    maxMUSIC: 5,
    headphones_count: 0,
    staminaSpend: 0,
    assets: [],
    wallets: [],
    referrer: null,
});
usersModel.push(admin);


///////////////////////////////////////
// account create
// console.log(refCodesModel);
// console.log()
renewCodeAdmin(admin, 3);

var user1 = accountCreate('user1', 'xxxx', 'user1@gmail.com', refCodesModel[0].code);
var user2 = accountCreate('user2', 'xxxx', 'user2@gmail.com', refCodesModel[1].code);

// console.log(refCodesModel);
// console.log()

clearUsedCode(admin)
// console.log(refCodesModel);
// console.log()

addWallet(admin, 'address0', 97);
addWallet(user1, 'address1', 97);
addWallet(user2, 'address2', 97);
// console.log(usersModel);
// console.log()



// stamina data per level simulate
for (let i=0; i<5; i++){
    let newStaminaLV = new Stamina({
        headphones_own: stamina_data[i][0],
        stamina: stamina_data[i][1],
        regen: stamina_data[i][2],
        note: stamina_data[i][3],
    });
    staminaModel.push(newStaminaLV);
}

// gems level data simulate
for (let i=0; i<6; i++){
    let newGemsLV = new GemsLV({
        level: i+1,
        name: gems_data[i][0],
        gems_to_upgrade: gems_data[i][1],
        upgrade_cost: gems_data[i][2],
        addition_points: gems_data[i][3],
        awakening_rate: gems_data[i][4],
        success_rate: gems_data[i][5],
    });
    gemsLvModel.push(newGemsLV);
}

for (let i=0; i<4; i++){
    // nft type simulate
    let newType = new Types({
        id: i,
        name: types_data[i][0],
        rounds_per_game: types_data[i][1],
        music_per_stamina: types_data[i][2],
        mint_cooldown: types_data[i][3],
        genesis_supply: types_data[i][4],
        age_to_mint: types_data[i][5],
        stamina_to_mint: types_data[i][6]
    });
    typesModel.push(newType);
    
    // nft rarity simulate
    let newRarity = new Rarity({
        id: i,
        name: rarity_data[i][0],
        min_attr: rarity_data[i][1],
        max_attr: rarity_data[i][2],
        attr_per_lv: rarity_data[i][3],
        addition_stamina: rarity_data[i][4]
    });

    raritiesModel.push(newRarity);

    // nft blanks simulate
    let newBlank_1 = new Blanks({
        type: randBetween(0, 3),
        gem: undefined,
    });

    blanksModel_1.push(newBlank_1);

    let newBlank_2 = new Blanks({
        type: randBetween(0, 3),
        gem: undefined,
    });

    blanksModel_2.push(newBlank_2);

    // gems data simulate
    let gemLevel = randBetween(1, 6);

    let newGem1 = new Gems({
        type: i,
        chainId: 97,
        owner: user1._id,
        useOn: undefined,
        onSale: false,
        attributes: gemsLvModel[gemLevel-1],
        awakening_points: 0,
    });

    let newGem2 = new Gems({
        type: i,
        chainId: 97,
        owner: user1._id,
        useOn: undefined,
        onSale: false,
        attributes: gemsLvModel[gemLevel-1],
        awakening_points: 0,
    });

    let newGem3 = new Gems({
        type: i, 
        chainId: 97,
        owner: admin._id,
        useOn: undefined,
        onSale: false,
        attributes: gemsLvModel[gemLevel-1],
        awakening_points: 0,
    });

    gemsModel1.push(newGem1);
    gemsModel2.push(newGem2);
    gemsModel3.push(newGem3);
}

// 10 genesis box simulate
for (let i=0; i<10; i++){
    let boxType = randBetween(0, 3);
    let boxRarity = randBetween(0, 3);
    let user_index = randBetween(0, 1);
    
    var blankSlot = [];
    for(let i=0; i<4; i++){
        let blankType = randBetween(0, 3);

        blankSlot[i] = new Blanks({
            type: blankType,
            gem: undefined,
        });
    }

    // create genesis box
    let newBox = new NFTs({
        id: i,
        nft_type: 0,
        owner: usersModel[user_index]._id,
        onSale: false,
        chainId: 97,
        rarity: raritiesModel[boxRarity],
        type: typesModel[boxType],
        blank_slot: blankSlot,
    });

    // add nft data into simulate database
    NFTsModel.push(newBox);

    //open genesis box
    openBox(usersModel[user_index], newBox);
}

// fee
for (let i=0; i<3; i++){
    let newFee = new Fees({
        type: i,
        note: fee_data[i][0],
        percentage: fee_data[i][1],
    });
    feesModel.push(newFee);
}


var adminHP = NFTsModel.filter(obj => obj.owner == admin._id && obj.nft_type == 1);


///////////////////////////////////////
// // breed with 2 admin's headphone
// var newBox = breed(admin, adminHP[0], adminHP[1]);
// console.log("box", newBox)
// console.log()




///////////////////////////////////////
// // open box
// var newHeadphone = openBox(admin, newBox);
// console.log("headphone", newHeadphone)
// console.log() 




///////////////////////////////////////
// // add gem
// console.log("headphone", adminHP[0])
// console.log();

// var gemType = adminHP[0].blank_slot[0].type;

// console.log("gem", gemsModel1[gemType])
// console.log()

// addGem(admin, adminHP[0], gemsModel1[gemType], 0)
// console.log("NFT1_blank after add gems", adminHP[0].blank_slot)
// console.log()




///////////////////////////////////////
// // remove gem
// removeGem(admin, adminHP[0], gemsModel1[gemType], 0)

// // gem upgrade
// console.log("gem 1", gemsModel1[gemType])
// console.log("gem 2", gemsModel2[gemType])
// console.log("gem 3", gemsModel3[gemType])
// console.log();

// try {
//     gemUpgrade(admin, gemsModel1[gemType], gemsModel2[gemType], gemsModel3[gemType])
//     console.log("gem 1 after upgrade", gemsModel1[gemType])
//     console.log("gem 2 after upgrade", gemsModel2[gemType])
//     console.log("gem 3 after upgrade", gemsModel3[gemType])
// } catch (error) {
//     console.log(error)
// }




///////////////////////////////////////
// // 2fa enable/disable
let secret = enable2FA(user1);
// console.log(user1.private)
// console.log()
// console.log(secret)
// console.log()

// var token = authenticator.generate(secret);
// disable2FA(user1, token);
// console.log(token)
// console.log()




/////////////////////////////////////
// token deposit/withdraw
console.log(`admin assets before deposit: melo: ${admin.assets[0].value} --- music: ${admin.assets[1].value}`)
console.log(`user1 assets before deposit: melo: ${user1.assets[0].value} --- music: ${user1.assets[1].value}`)
console.log(`user2 assets before deposit: melo: ${user2.assets[0].value} --- music: ${user2.assets[1].value}`)
console.log()

tokenDeposit(admin, 0, 97, 1000000)
tokenDeposit(admin, 1, 97, 1000000)
tokenDeposit(user1, 0, 97, 10000)
tokenDeposit(user1, 1, 97, 1000)
tokenDeposit(user2, 0, 97, 10000)
tokenDeposit(user2, 1, 97, 1000)
console.log(`admin assets after deposit: melo: ${admin.assets[0].value} --- music: ${admin.assets[1].value}`)
console.log(`user1 assets after deposit: melo: ${user1.assets[0].value} --- music: ${user1.assets[1].value}`)
console.log(`user2 assets after deposit: melo: ${user2.assets[0].value} --- music: ${user2.assets[1].value}`)
console.log()

var token = authenticator.generate(secret);
tokenWithdraw(user1, 0, 97, 100, token)
var token = authenticator.generate(secret);
tokenWithdraw(user1, 1, 97, 100, token)

tokenWithdraw(user2, 0, 97, 100)
console.log(`admin assets after user1, user2 withdraw: melo: ${admin.assets[0].value} --- music ${admin.assets[1].value}`)
console.log(`user1 assets after user1 withdraw: melo: ${user1.assets[0].value} --- music ${user1.assets[1].value}`)
console.log(`user2 assets after user2 withdraw: melo: ${user2.assets[0].value} --- music ${user2.assets[1].value}`)
console.log()




/////////////////////////////////////
// nft deposit/withdraw
var user1NFT = NFTsModel.filter(obj => obj.owner == user1._id);
console.log("before user1 withdraw:", user1NFT[0].owner)

var token = authenticator.generate(secret);
nftWithdraw(user1, user1NFT[0], 97, token);
console.log("after user1 withdraw:", user1NFT[0].owner)

nftDeposit(user2, user1NFT[0], 97)
console.log("after user2 deposit:", user1NFT[0].owner)
console.log(`admin assets after user1, user2 withdraw: melo: ${admin.assets[0].value} --- music ${admin.assets[1].value}`)



///////////////////////////////////////
// // listing item
// var item = adminHP[0];  //nft
// // var item = gemsModel1[1];    //gem
// console.log("item before listing", item)
// console.log()
// console.log("admin before listing", admin)
// console.log()

// listingItem(admin, item, 100);
// var listingInfo = listingModel.find(obj => obj.item._id == item._id);

// console.log("item after listing", item)
// console.log()
// console.log("admin after listing", admin)
// console.log()

// // de-listing item
// delistingItem(admin, item);
// console.log("item after de-listing", item)
// console.log()

// // buy item
// buyItem(user1, item);
// console.log("item after buy", item)
// console.log()

// console.log("admin after buy", admin)
// console.log()
// console.log("user1 after buy", user1)
// console.log()




/////////////////////////////////////////
// // acctivation code
// user1.staminaSpend = 15 // simulate
// renewCode(user1);
// renewCode(user2);
// console.log(user1);
// console.log()
// console.log(user2);
// console.log()
// console.log(refCodesModel);




export { typesModel, raritiesModel, gemsModel1, gemsModel2, gemsModel3, gemsLvModel, NFTsModel, staminaModel, feesModel }