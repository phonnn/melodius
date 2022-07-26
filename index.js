import Gems from './model/gems.model.js';
import Blanks from './model/blanks.model.js';
import Rarity from './model/rarity.model.js';
import Types from './model/types.model.js';
import Users from './model/users.model.js';
import NFTs from './model/nfts.model.js';
import Minting from './model/minting.model.js';
import { randBetween, breed, openBox} from './nft_actions.js';

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
    [1, 'Chipped', 3, 50, 2, 0.05, 0.35],
    [2, 'Flawed', 3, 100, 8, 0.7, 0.55],
    [3, 'Regular', 3, 200, 25, 2.2, 0.65],
    [4, 'Glossy', 3, 400, 72, 6, 0.75],
    [5, 'Flawless', 3, 800, 14, 0.85],
    [6, 'Radiant', NaN, NaN, 43, NaN],
];


var typesModel = [];
var raritiesModel = [];
var blanksModel = [];
var gemsModel = [];

for (let i=0; i<4; i++){
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

    let newRarity = new Rarity({
        id: i,
        name: rarity_data[i][0],
        min_attr: rarity_data[i][1],
        max_attr: rarity_data[i][2],
        attr_per_lv: rarity_data[i][3],
        addition_stamina: rarity_data[i][4]
    });

    raritiesModel.push(newRarity);

    let newBlank = new Blanks({
        slot_id: i+1,
        gem: null,
    });

    blanksModel.push(newBlank);
}

const headphone1 = new NFTs({
	id: 1,
	nft_type: 1,
    chain: 97,
    optimality: 15,
	luck: 25,
	comfort: 19,
	battery: 30,
	level: 2,
	played_rounds: 1,
	breed_count: 0,
	last_breed: 0,
	lv_up_cooldown: 0,
	last_lv_up: 0,

    rarity: raritiesModel[2],
	blank_slot: blanksModel,
	type: typesModel[1],
});

const headphone2 = new NFTs({
	id: 2,
	nft_type: 1,
    chain: 97,
    optimality: 15,
	luck: 25,
	comfort: 19,
	battery: 30,
	level: 2,
	played_rounds: 1,
	breed_count: 0,
	last_breed: 0,
	lv_up_cooldown: 0,
	last_lv_up: 0,

    rarity: raritiesModel[0],
	blank_slot: blanksModel,
	type: typesModel[2],
});

//breed with headphone1 and headphone2
var newBox = breed(headphone1, headphone2);
console.log("box", newBox)

//open box
var newHeadphone = openBox(newBox);
console.log()
console.log("headphone", newHeadphone)


export { typesModel, raritiesModel, blanksModel }