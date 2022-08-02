import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const transferSchema = new Schema({
	tokenType: { type: Number, required: true }, // TOKEN: 0, NFT: 1
    id: { type: Number }, //nft id, token id
    action: { type: Number, required: true }, // withdraw: 0, deposit: 1
    value: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    chainId: { type: Number, required: true },
    wallet: { type: String, required: true },
}, {
  	timestamps: true,
});

const Transfers = model('Transfers', transferSchema);
export default Transfers;