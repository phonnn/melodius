import { typesModel, raritiesModel, blanksModel } from './index.js'
import NFTs from './model/nfts.model.js';

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function randomGenerator(percentage1, percentage2, percentage3, percentage4){
    percentage1 *= 10;
    percentage2 *= 10;
    percentage3 *= 10;
    percentage4 *= 10;

    let randomNumber = randBetween(1, 1000);

    if(randomNumber < percentage1)
        return 0
    else if(randomNumber < percentage2 + percentage2)
        return 1
    else if(randomNumber < percentage1 + percentage2 + percentage3)
        return 2
    else if(randomNumber < percentage1 + percentage2 + percentage3 + percentage4)
        return 3
}

function openBox(boxNFT){
    if(boxNFT.nft_type != 0){
        throw "It's Headphone";
    }

    //headphone rarity
    var headphoneRarity;
    if(boxNFT.rarity.id == 0){
        headphoneRarity = randomGenerator(97, 3, 0, 0);
    } else if (boxNFT.rarity.id == 1){
        headphoneRarity = randomGenerator(25, 73, 2, 0);
    } else if (boxNFT.rarity.id == 2){
        headphoneRarity = randomGenerator(0, 27, 71, 2);
    } else if (boxNFT.rarity.id == 3){
        headphoneRarity = randomGenerator(0, 0, 32, 68);
    }

    //get from simulation db
    let min_Attr = raritiesModel[headphoneRarity].min_attr
    let max_Attr = raritiesModel[headphoneRarity].max_attr

    //random attr
    let optimality = randBetween(min_Attr, max_Attr);
    let luck = randBetween(min_Attr, max_Attr);
    let comfort = randBetween(min_Attr, max_Attr);
    let battery = randBetween(min_Attr, max_Attr);
    
    boxNFT.nft_type = 1; //change nft type to 1 <=> box -> headphone
    boxNFT.optimality = optimality;
    boxNFT.luck = luck;
    boxNFT.comfort = comfort;
    boxNFT.battery = battery;
    boxNFT.level = 1;
	boxNFT.played_rounds = 0,
	boxNFT.breed_count = 0,
	boxNFT.last_breed = 0,
	boxNFT.lv_up_cooldown = 0,
	boxNFT.last_lv_up = 0,

    boxNFT.rarity = raritiesModel[headphoneRarity];
	boxNFT.blank_slot = blanksModel;
    
    return boxNFT
}


function breed(parentNFT_1, parentNFT_2){
    if(parentNFT_1.nft_type != 1 || parentNFT_1.breed_count > 6){
        throw "NFT Error";
    }

    if(parentNFT_2.nft_type != 1 || parentNFT_2.breed_count > 6){
        throw "NFT Error";
    }

    parentNFT_1.breed_count += 1;
    parentNFT_1.last_breed = Date.now();

    parentNFT_2.breed_count += 1;
    parentNFT_2.last_breed = Date.now();

    //box rarity
    var NFT1_rarity, NFT2_rarity, boxRarity;

    if(parentNFT_1.rarity.id > parentNFT_2.rarity.id){
        NFT1_rarity = parentNFT_2.rarity.id;
        NFT2_rarity = parentNFT_1.rarity.id;
    } else{
        NFT1_rarity = parentNFT_1.rarity.id;
        NFT2_rarity = parentNFT_2.rarity.id;
    }

    if(NFT1_rarity == NFT2_rarity){
        boxRarity = NFT1_rarity;
    } else if (NFT1_rarity == 0 && NFT2_rarity == 1) { //common vs uncommon
        boxRarity = randomGenerator(51, 49, 0, 0);
    } else if (NFT1_rarity == 0 && NFT2_rarity == 2) { //common vs super rare
        boxRarity = randomGenerator(50, 49, 1, 0);
    } else if (NFT1_rarity == 0 && NFT2_rarity == 3) { //common vs unique
        boxRarity = randomGenerator(50, 49, 0, 1);
    } else if (NFT1_rarity == 1 && NFT2_rarity == 2) { //uncommon vs super rare
        boxRarity = randomGenerator(0, 51, 49, 0);
    } else if (NFT1_rarity == 1 && NFT2_rarity == 3) { //uncommon vs unique
        boxRarity = randomGenerator(0, 50, 49, 1);
    } else if (NFT1_rarity == 2 && NFT2_rarity == 3) { //super rare vs unique
        boxRarity = randomGenerator(0, 0, 51, 49);
    }

    //box type
    var NFT1_type, NFT2_type, boxType;

    if(parentNFT_1.type.id > parentNFT_2.type.id){
        NFT1_type = parentNFT_2.type.id;
        NFT2_type = parentNFT_1.type.id;
    } else{
        NFT1_type = parentNFT_1.type.id;
        NFT2_type = parentNFT_2.type.id;
    }

    if(NFT1_type == 0 && NFT2_type == 0){          //classic vs classic
        boxType = randomGenerator(85, 6, 6, 3);
    } else if (NFT1_type == 0 && NFT2_type == 1) { //classic vs electric
        boxType = randomGenerator(45, 45, 7, 3);
    } else if (NFT1_type == 0 && NFT2_type == 2) { //classic vs solar
        boxType = randomGenerator(45, 7, 45, 3);
    } else if (NFT1_type == 0 && NFT2_type == 3) { //classic vs atom
        boxType = randomGenerator(80, 6, 6, 8);
    } else if (NFT1_type == 1 && NFT2_type == 1) { //electric vs electric
        boxType = randomGenerator(6, 85, 6, 3);
    } else if (NFT1_type == 1 && NFT2_type == 2) { //electric vs solar
        boxType = randomGenerator(7, 45, 45, 3);
    } else if (NFT1_type == 1 && NFT2_type == 3) { //electric vs atom
        boxType = randomGenerator(6, 80, 6, 8);
    } else if (NFT1_type == 2 && NFT2_type == 2) { //solar vs solar
        boxType = randomGenerator(6, 6, 85, 3);
    } else if (NFT1_type == 2 && NFT2_type == 3) { //solar vs atom
        boxType = randomGenerator(6, 6, 80, 8);
    } else if (NFT1_type == 3 && NFT2_type == 3) { //atom vs atom
        boxType = randomGenerator(25, 25, 25, 25);
    }

    //mint new nft and get it's id from blockchain
    let nft_id = 6645645 // simulation id
    
    var newBox = new NFTs({
        id: nft_id,
        nft_type: 0,
        chain: parentNFT_1.chain,
        rarity: raritiesModel[boxRarity],
        type: typesModel[boxType]
    });
    return newBox
}

export { randBetween, breed, openBox}