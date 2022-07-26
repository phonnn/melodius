import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const mintingSchema = new Schema({
    mint_count: { type: Number, required: true },
    music_cost: { type: Number, required: true },
    melo_cost: { type: Number, required: true },
});

const Minting = model('Minting', mintingSchema);
export default Minting;
