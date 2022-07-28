import { typesModel, raritiesModel, gemsModel1, gemsModel2, gemsModel3, gemsLvModel, NFTsModel, staminaModel, usersModel } from './index.js'
import NFTs from './model/nfts.model.js';
import Blanks from './model/blanks.model.js';
import Listing from './model/listing.model.js';

var listingModel = [];

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomGenerator(percentage1, percentage2, percentage3, percentage4) {
    percentage1 *= 10;
    percentage2 *= 10;
    percentage3 *= 10;
    percentage4 *= 10;

    let randomNumber = randBetween(1, 1000);

    if (randomNumber < percentage1)
        return 0
    else if (randomNumber < percentage2 + percentage2)
        return 1
    else if (randomNumber < percentage1 + percentage2 + percentage3)
        return 2
    else if (randomNumber < percentage1 + percentage2 + percentage3 + percentage4)
        return 3
}

function openBox(user, boxNFT) {
    if (boxNFT.nft_type != 0) {
        throw "It's Headphone";
    }

    if (user._id != boxNFT.owner) {
        throw "Not Owner";
    }

    if (boxNFT.onSale) {
        throw "Box is on sale";
    }

    //headphone rarity
    var headphoneRarity;
    if (boxNFT.rarity.id == 0) {
        headphoneRarity = randomGenerator(97, 3, 0, 0);
    } else if (boxNFT.rarity.id == 1) {
        headphoneRarity = randomGenerator(25, 73, 2, 0);
    } else if (boxNFT.rarity.id == 2) {
        headphoneRarity = randomGenerator(0, 27, 71, 2);
    } else if (boxNFT.rarity.id == 3) {
        headphoneRarity = randomGenerator(0, 0, 32, 68);
    }

    //get attr from simulation db
    let min_Attr = raritiesModel[headphoneRarity].min_attr
    let max_Attr = raritiesModel[headphoneRarity].max_attr

    //random attr
    let optimality = randBetween(min_Attr, max_Attr);
    let luck = randBetween(min_Attr, max_Attr);
    let comfort = randBetween(min_Attr, max_Attr);
    let battery = randBetween(min_Attr, max_Attr);

    boxNFT.nft_type = 1; //change nft type to 1 <=> box -> headphone
    boxNFT.attributes = [optimality, luck, comfort, battery];
    boxNFT.level = 1;
    boxNFT.played_rounds = 0;
    boxNFT.breed_count = 0;
    boxNFT.last_breed = 0;
    boxNFT.lv_up_cooldown = 0;
    boxNFT.last_lv_up = 0;

    boxNFT.rarity = raritiesModel[headphoneRarity];
    boxNFT.blank_slot = boxNFT.blank_slot;

    // update max stamina for user
    staminaUpgrade(user);

    return boxNFT
}

function getBoxRarity(parentNFT_1_rarity, parentNFT_2_rarity) {
    let NFT1_rarity, NFT2_rarity, boxRarity;

    if (parentNFT_1_rarity > parentNFT_2_rarity) {
        NFT1_rarity = parentNFT_2_rarity;
        NFT2_rarity = parentNFT_1_rarity;
    } else {
        NFT1_rarity = parentNFT_1_rarity;
        NFT2_rarity = parentNFT_2_rarity;
    }

    if (NFT1_rarity == NFT2_rarity) {
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

    return boxRarity;
}

function getBoxType(parentNFT_1_type, parentNFT_2_type) {
    var NFT1_type, NFT2_type, boxType;

    if (parentNFT_1_type > parentNFT_2_type) {
        NFT1_type = parentNFT_2_type;
        NFT2_type = parentNFT_1_type;
    } else {
        NFT1_type = parentNFT_1_type;
        NFT2_type = parentNFT_2_type;
    }

    if (NFT1_type == 0 && NFT2_type == 0) {          //classic vs classic
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

    return boxType;
}

function getBoxBlanks(parentNFT_1_blank, parentNFT_2_blank) {
    let NFT1_blank, NFT2_blank, blankType;

    if (parentNFT_1_blank > parentNFT_2_blank) {
        NFT1_blank = parentNFT_2_blank;
        NFT2_blank = parentNFT_1_blank;
    } else {
        NFT1_blank = parentNFT_1_blank;
        NFT2_blank = parentNFT_2_blank;
    }

    if (NFT1_blank == 0 && NFT2_blank == 0) {        //Optimality vs Optimality
        blankType = randomGenerator(70, 10, 10, 10);
    } else if (NFT1_blank == 0 && NFT2_blank == 1) { //Optimality vs Luck
        blankType = randomGenerator(40, 40, 10, 10);
    } else if (NFT1_blank == 0 && NFT2_blank == 2) { //Optimality vs Comfort 
        blankType = randomGenerator(40, 10, 40, 10);
    } else if (NFT1_blank == 0 && NFT2_blank == 3) { //Optimality vs Battery 
        blankType = randomGenerator(40, 10, 10, 40);
    } else if (NFT1_blank == 1 && NFT2_blank == 1) { //Luck vs Luck
        blankType = randomGenerator(10, 70, 10, 10);
    } else if (NFT1_blank == 1 && NFT2_blank == 2) { //Luck vs Comfort 
        blankType = randomGenerator(10, 40, 40, 10);
    } else if (NFT1_blank == 1 && NFT2_blank == 3) { //Luck vs Battery 
        blankType = randomGenerator(10, 40, 10, 40);
    } else if (NFT1_blank == 2 && NFT2_blank == 2) { //Comfort  vs Comfort 
        blankType = randomGenerator(10, 10, 70, 10);
    } else if (NFT1_blank == 2 && NFT2_blank == 3) { //Comfort  vs Battery 
        blankType = randomGenerator(10, 10, 40, 40);
    } else if (NFT1_blank == 3 && NFT2_blank == 3) { //Battery  vs Battery 
        blankType = randomGenerator(10, 10, 10, 70);
    }

    return blankType;
}

function breed(user, parentNFT_1, parentNFT_2) {
    if (parentNFT_1.nft_type != 1 || parentNFT_1.breed_count > 6) {
        throw "NFT Error";
    }

    if (parentNFT_2.nft_type != 1 || parentNFT_2.breed_count > 6) {
        throw "NFT Error";
    }

    if (user._id != parentNFT_1.owner || user._id != parentNFT_2.owner) {
        throw "Not Owner";
    }

    if (parentNFT_1.onSale || parentNFT_2.onSale) {
        throw "Headphone is on sale";
    }

    parentNFT_1.breed_count += 1;
    parentNFT_1.last_breed = Date.now();

    parentNFT_2.breed_count += 1;
    parentNFT_2.last_breed = Date.now();

    //box rarity
    let boxRarity = getBoxRarity(parentNFT_1.rarity.id, parentNFT_2.rarity.id)

    //box type
    let boxType = getBoxType(parentNFT_1.type.id, parentNFT_2.type.id)

    //blank type
    var blankSlot = [];
    for (let i = 0; i < 4; i++) {
        let blankType = getBoxBlanks(parentNFT_1.blank_slot[i].type, parentNFT_2.blank_slot[i].type)

        blankSlot[i] = new Blanks({
            type: blankType,
            gem: undefined,
        });
    }

    //mint new nft and get it's id from blockchain
    let nft_id = randBetween(1000, 10000) // simulation id

    var newBox = new NFTs({
        id: nft_id,
        nft_type: 0,
        owner: user._id,
        onSale: false,
        chainId: parentNFT_1.chainId,
        rarity: raritiesModel[boxRarity],
        type: typesModel[boxType],
        blank_slot: blankSlot,
    });

    return newBox
}

function addGem(user, headphone, gem, slot) {
    if (headphone.blank_slot[slot].type != gem.type) {
        throw "Blank and Gem are not the same type";
    }

    if (user._id != headphone.owner) {
        throw "Headphone not own";
    }

    if (user._id != gem.owner) {
        throw "Gem not own";
    }

    if (gem.useOn != undefined) {
        throw "Gem is using";
    }

    if (headphone.onSale) {
        throw "Headphone is on sale";
    }

    if (gem.onSale) {
        throw "Gem is on sale";
    }

    // awakeing point calculate
    let awakeningPoints = Math.floor(headphone.attributes[gem.type] * (gem.attributes.awakening_rate / 100));

    if (awakeningPoints < 1) {
        awakeningPoints = 1;
    }

    // awakening points calculate
    gem.awakening_points = awakeningPoints;

    // mark gem as used
    gem.useOn = headphone.id;

    // add gem into blank slot
    headphone.blank_slot[slot].gem = gem;
}

function removeGem(user, headphone, gem, slot) {
    if (user._id != headphone.owner) {
        throw "Headphone not own";
    }

    if (headphone.onSale) {
        throw "Headphone is on sale";
    }

    gem.awakening_points = 0;
    gem.useOn = undefined;

    // remove gem from blank slot
    headphone.blank_slot[slot].gem = undefined;
}

function gemUpgrade(user, gem1, gem2, gem3) { // upgrade gems1 and burn gem2, gem3
    if (user._id != gem1.owner || user._id != gem2.owner || user._id != gem3.owner) {
        throw "Gem not own";
    }

    if (gem1.id == gem2.id || gem1.id == gem3.id || gem2.id == gem3.id) {
        throw "Duplicate gems";
    }

    if (gem1.useOn != undefined || gem2.useOn != undefined || gem3.useOn != undefined) {
        throw "Gem is on use";
    }

    if (gem1.onSale || gem2.onSale || gem3.onSale) {
        throw "Gem is on sale";
    }
    
    if (gem1.attributes.level >= 6) {
        throw "Gems at max level";
    }

    if (gem1.attributes.level != gem2.attributes.level || gem1.attributes.level != gem3.attributes.level) {
        throw "Gems are not the same level";
    }

    if (gem1.type != gem2.type || gem1.type != gem3.type) {
        throw "Gems are not the same type";
    }


    // success or not?
    let isSuccess = randBetween(1, 100);
    if (isSuccess > gem1.success_rate) {
        return //upgrade failed
    }

    let gemLevel = gem1.attributes.level + 1;

    //get gem level model data from db
    let gemAttributes = gemsLvModel.find(obj => obj.level == gemLevel); //simulation
    gem1.attributes = gemAttributes

    // burn/delete gem2 and gems3 from blockchains/database
    gemsModel2.splice(gemsModel2.indexOf(gem2), 1); // simulate
    gemsModel3.splice(gemsModel2.indexOf(gem3), 1); // simulate
}

function staminaUpgrade(user) {
    // get headphone owned by user from simulate database
    let headphones = NFTsModel.filter(obj => obj.owner == user._id && obj.nft_type == 1 && !obj.onSale);

    if (headphones.length == 0) {
        return
    }

    // get base stamina info from simulation database
    let baseStaminaData = staminaModel.filter(obj => obj.headphones_own <= headphones.length);
    let maxStaminaData = baseStaminaData.reduce((p, c) => p.headphones_own > c.headphones_own ? p : c);

    var maxStamina = maxStaminaData.stamina;
    for (let headphone of headphones) {
        maxStamina += headphone.rarity.addition_stamina;
    }

    user.maxStamina = maxStamina > 40 ? 40 : maxStamina;
    user.headphones_count = headphones.length;
    user.staminaRegen = maxStaminaData.regen;
}

function listingItem(seller, item, price){
    if (seller._id != item.owner) {
        throw "Not Owner";
    }

    if (item.onSale) {
        throw "Item already on sale";
    }

    if (item.useOn != undefined) {
        throw "Gem is using";
    }

    if (price <= 0) {
        throw "Price Error";
    }

    if(item.nft_type != undefined){ // box or headphone
        // on-chain transfer nft logic here
    }

    item.onSale = true;

    // add new listing to simulate database
    var newListing = new Listing({
        seller: seller,
        item: item,
        price: price
    });

    listingModel.push(newListing);

    // update max stamina for seller
    staminaUpgrade(seller);
}

function delistingItem(seller, item){
    if (seller._id != item.owner) {
        throw "Not Owner";
    }

    if (!item.onSale) {
        throw "Item not sale";
    }

    if(item.nft_type != undefined){ // box or headphone
        // on-chain transfer nft logic here
    }

    item.onSale = false;

    // find listing info of item in database
    let listingInfo = listingModel.find(obj => obj.item._id == item._id); // simulate
    
    // remove listing
    listingModel.splice(listingModel.indexOf(listingInfo), 1); // simulate

    // update max stamina for seller
    staminaUpgrade(seller);
}

function buyItem(buyer, item){
    if (!item.onSale) {
        throw "Item not sale";
    }

    // find info in simulate database
    let listingInfo = listingModel.find(obj => obj.item._id == item._id);

    let buyerMUSIC = buyer.assets.find(obj => obj.token == 1 && obj.chainId == item.chainId);

    let seller = listingInfo.seller;
    let sellerMUSIC = seller.assets.find(obj => obj.token == 1 && obj.chainId == item.chainId);

    if (buyerMUSIC.value < listingInfo.price) {
        throw "Not enough token";
    }
    
    if (buyer._id == seller._id) {
        throw "Buy Error";
    }

    // balance transfer
    buyer.assets[buyer.assets.indexOf(buyerMUSIC)].value -= listingInfo.price;
    seller.assets[seller.assets.indexOf(sellerMUSIC)].value += (listingInfo.price * 0.98); // 2% fee
    
    // item owner transfer
    item.owner = buyer._id;
    item.onSale = false;

    // update max stamina for buyer
    staminaUpgrade(buyer);
    staminaUpgrade(seller);

    // remove listing
    listingModel.splice(listingModel.indexOf(listingInfo), 1); // simulate

    if(item.nft_type != undefined){ // box or headphone
        // on-chain transfer nft logic here
    }

}

export { randBetween, breed, openBox, addGem, removeGem, gemUpgrade, staminaUpgrade, listingItem, delistingItem, buyItem, listingModel }



