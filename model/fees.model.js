import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const feeSchema = new Schema({
    type: { type: Number, required: true }, // Marketplace Trading Fee: 0, Marketplace Royalty Fee: 1, Headphones Minting: 2
    note: { type: String, require: true},
    percentage: { type: Number, required: true },
});

const Fees = model('Fees', feeSchema);
export default Fees;