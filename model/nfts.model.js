import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const nftSchema = new Schema({
	id: { type: Number, required: true }, //nft id
	nft_type: { type: Number, required: true }, //box = 0, headphone = 1
    chain: { type: Number, required: true },

    optimality: { type: Number},
	luck: { type: Number},
	comfort: { type: Number},
	battery: { type: Number},
	level: { type: Number},
	played_rounds: { type: Number},
	breed_count: { type: Number},
	last_breed: { type: Number},
	lv_up_cooldown: { type: Number},
	last_lv_up: { type: Number},

    rarity: {type: Schema.Types.ObjectId, ref: 'Rarity', required: true },
    type: {type: Schema.Types.ObjectId, ref: 'Types', required: true},
	blank_slot: [{type: Schema.Types.ObjectId, ref: 'Blanks'}],
}, {
  	timestamps: true,
});

const NFTs = model('NFTs', nftSchema);
export default NFTs;