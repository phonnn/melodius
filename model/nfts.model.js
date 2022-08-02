import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const nftSchema = new Schema({
	id: { type: Number, required: true }, //nft id
	nft_type: { type: Number, required: true }, //box = 0, headphone = 1
    chainId: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    onSale: { type: Boolean, required: true },

    attributes: [{ type: Number}], //0: Optimality, 1: Luck, 2: Comfort, 3: Battery Capacity
	level: { type: Number},
	played_rounds: { type: Number},
	breed_count: { type: Number},
	last_breed: { type: Number},
	lv_up_cooldown: { type: Number},
	last_lv_up: { type: Number},

    rarity: { type: Schema.Types.ObjectId, ref: 'Rarity', required: true },
    type: { type: Schema.Types.ObjectId, ref: 'Types', required: true },
	blank_slot: [{type: Schema.Types.ObjectId, ref: 'Blanks'}],
}, {
  	timestamps: true,
});

const NFTs = model('NFTs', nftSchema);
export default NFTs;