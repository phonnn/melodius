import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const gemslvSchema = new Schema({
    level: { type: Number, required: true },
    name: { type: String, required: true },
    gems_to_upgrade: { type: Number, required: true },
    upgrade_cost: { type: Number, required: true },
    addition_points: { type: Number, required: true },
    awakening_rate: { type: Number, required: true },
    success_rate: { type: Number, required: true },
});

const GemsLV = model('GemsLV', gemslvSchema);
export default GemsLV;
