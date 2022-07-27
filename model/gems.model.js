import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const gemsSchema = new Schema({
    id: { type: Number, required: true },
    type: { type: Number, required: true }, //0 = Orange: Optimality, 1 = Grey: Luck, 2 = Pink: Comfort, 3 = Green: Battery Capacity
    isUsed: { type: Boolean, required: true },
    attributes: {type: Schema.Types.ObjectId, ref: 'GemsLV', required: true },
    awakening_points: { type: Number, required: true },
});

const Gems = model('Gems', gemsSchema);
export default Gems;
