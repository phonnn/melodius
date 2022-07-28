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

import { randBetween, breed, openBox, addGem, removeGem, gemUpgrade, staminaUpgrade, listingItem, delistingItem, buyItem, listingModel } from './nft_actions.js';

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


var usersModel = [];
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

// user simulate
const user1 = new Users({
    username: 'user1',
    email: 'aaaa@gmail.com',
    password: 'xxxx',
    stamina: 0,
    maxStamina: 0,
    staminaRegen: 0,
    maxMUSIC: 5,
    headphones_count: 0,
    stamina_spend: 0,
    assets: [
        {
            chainId: 97,
            token: 1,       //MUSIC token
            value: 1000,
        },
        {
            chainId: 97,
            token: 0,       //MELO token
            value: 1000,
        }
    ],
    addresses: [{
        chainId: 97,
        address: 'address1',
    }],
});

const user2 = new Users({
    username: 'user2',
    email: 'bbbb@gmail.com',
    password: 'xxxx',
    stamina: 0,
    maxStamina: 0,
    staminaRegen: 0,
    maxMUSIC: 5,
    headphones_count: 0,
    stamina_spend: 0,
    assets: [
        {
            chainId: 97,
            token: 1,       //MUSIC token
            value: 1000,
        },
        {
            chainId: 97,
            token: 0,       //MELO token
            value: 1000,
        }
    ],
    addresses: [{
        chainId: 97,
        address: 'address2',
    }],
});

usersModel.push(user1);
usersModel.push(user2);

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

// gems data per level simulate
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
        owner: user1._id,
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

var user1HP = NFTsModel.filter(obj => obj.owner == user1._id && obj.nft_type == 1);

///////////////////////////////////////
// // breed with 2 user1's headphone
// var newBox = breed(user1, user1HP[0], user1HP[1]);
// console.log("box", newBox)
// console.log()




///////////////////////////////////////
// // open box
// var newHeadphone = openBox(user1, newBox);
// console.log("headphone", newHeadphone)
// console.log() 




///////////////////////////////////////
// // add gem
// console.log("headphone", user1HP[0])
// console.log();

// var gemType = user1HP[0].blank_slot[0].type;

// console.log("gem", gemsModel1[gemType])
// console.log()

// addGem(user1, user1HP[0], gemsModel1[gemType], 0)
// console.log("NFT1_blank after add gems", user1HP[0].blank_slot)
// console.log()




///////////////////////////////////////
// // remove gem
// removeGem(user1, user1HP[0], gemsModel1[gemType], 0)

// // gem upgrade
// console.log("gem 1", gemsModel1[gemType])
// console.log("gem 2", gemsModel2[gemType])
// console.log("gem 3", gemsModel3[gemType])
// console.log();

// try {
//     gemUpgrade(user1, gemsModel1[gemType], gemsModel2[gemType], gemsModel3[gemType])
//     console.log("gem 1 after upgrade", gemsModel1[gemType])
//     console.log("gem 2 after upgrade", gemsModel2[gemType])
//     console.log("gem 3 after upgrade", gemsModel3[gemType])
// } catch (error) {
//     console.log(error)
// }




///////////////////////////////////////
// listing item
// var item = user1HP[0];
var item = gemsModel1[1];
console.log("item before listing", item)
console.log()
listingItem(user1, item, 100);
var listingInfo = listingModel.find(obj => obj.item._id == item._id);

console.log("item after listing", item)
console.log()

// // de-listing item
// delistingItem(user1, item);
// console.log("item after de-listing", item)
// console.log()

// buy item
buyItem(user2, item);
console.log("item after buy", item)
console.log()




export { typesModel, raritiesModel, gemsModel1, gemsModel2, gemsModel3, gemsLvModel, NFTsModel, staminaModel, usersModel }