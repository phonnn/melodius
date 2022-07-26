import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const gemsSchema = new Schema({
    type: { type: Number, required: true },
    level: { type: Number, required: true },
    name: { type: String, required: true },
    gems_to_upgrade: { type: Number, required: true },
    upgrade_cost: { type: Number, required: true },
    attribute: { type: Number, required: true },
    awakening: { type: Number, required: true },
    success_rate: { type: Number, required: true },
});

const Gems = model('Gems', gemsSchema);
export default Gems;
