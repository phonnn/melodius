import Gems from './model/gems.model.js';
import GemsLV from './model/gemslv.model.js';
import Blanks from './model/blanks.model.js';
import Rarity from './model/rarity.model.js';
import Types from './model/types.model.js';
import Users from './model/users.model.js';
import NFTs from './model/nfts.model.js';
import Minting from './model/minting.model.js';
import { randBetween, breed, openBox, addGem, gemUpgrade} from './nft_actions.js';

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


var typesModel = [];
var raritiesModel = [];
var gemsLvModel = [];
var gemsModel1 = [];
var gemsModel2 = [];
var gemsModel3 = [];
var blanksModel_1 = [];
var blanksModel_2 = [];

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
        gem: null,
    });

    blanksModel_1.push(newBlank_1);

    let newBlank_2 = new Blanks({
        type: randBetween(0, 3),
        gem: null,
    });

    blanksModel_2.push(newBlank_2);

    // gems data simulate
    let gemLevel = randBetween(1, 6);

    let newGem1 = new Gems({
        id: i + randBetween(1, 1000),
        type: i,
        isUsed: false,
        attributes: gemsLvModel[gemLevel-1],
        awakening_points: 0,
    });

    let newGem2 = new Gems({
        id: i + randBetween(1, 1000),
        type: i,
        isUsed: false,
        attributes: gemsLvModel[gemLevel-1],
        awakening_points: 0,
    });

    let newGem3 = new Gems({
        id: i + randBetween(1, 1000),
        type: i,
        isUsed: false,
        attributes: gemsLvModel[gemLevel-1],
        awakening_points: 0,
    });

    gemsModel1.push(newGem1);
    gemsModel2.push(newGem2);
    gemsModel3.push(newGem3);
}

const headphone1 = new NFTs({
	id: 1,
	nft_type: 1,
    chain: 97,
    attributes:[15, 25, 19, 30],
	level: 1,
	played_rounds: 1,
	breed_count: 0,
	last_breed: 0,
	lv_up_cooldown: 0,
	last_lv_up: 0,

    rarity: raritiesModel[2],
	blank_slot: blanksModel_1,
	type: typesModel[1],
});

const headphone2 = new NFTs({
	id: 2,
	nft_type: 1,
    chain: 97,
    attributes:[4, 8, 10, 2],
	level: 1,
	played_rounds: 1,
	breed_count: 0,
	last_breed: 0,
	lv_up_cooldown: 0,
	last_lv_up: 0,

    rarity: raritiesModel[0],
	blank_slot: blanksModel_2,
	type: typesModel[2],
});


// console.log("NFT1", headphone1)
// console.log()
// console.log("NFT2", headphone2)
// console.log()

// // breed with headphone1 and headphone2
// var newBox = breed(headphone1, headphone2);
// console.log("box", newBox)
// console.log()

// // open box
// var newHeadphone = openBox(newBox);
// console.log("headphone", newHeadphone)
// console.log() 

// add gem
console.log("headphone", headphone1)
console.log();

var gemType = headphone1.blank_slot[0].type;

console.log("gem", gemsModel1[gemType])
console.log()

addGem(headphone1, gemsModel1[gemType], 0)
console.log("NFT1_blank after add gems", headphone1.blank_slot)
console.log()

// gem upgrade
console.log("gem 1", gemsModel1[gemType])
console.log("gem 2", gemsModel2[gemType])
console.log("gem 3", gemsModel3[gemType])
console.log();

try {
    gemUpgrade(gemsModel1[gemType], gemsModel2[gemType], gemsModel3[gemType])
    console.log("gem 1 after upgrade", gemsModel1[gemType])
    console.log("gem 2 after upgrade", gemsModel2[gemType])
    console.log("gem 3 after upgrade", gemsModel3[gemType])
} catch (error) {
    console.log(error)
}


export { typesModel, raritiesModel, gemsModel1, gemsModel2, gemsModel3, gemsLvModel }