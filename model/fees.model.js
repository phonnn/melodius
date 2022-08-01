import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const feeSchema = new Schema({
    type: { type: Number, required: true },
    note: { type: String, require: true},
    percentage: { type: Number, required: true },
});

const Fees = model('Fees', feeSchema);
export default Fees;