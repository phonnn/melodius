import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const blankSchema = new Schema({
    type: { type: Number, required: true }, //0 = Orange: Optimality, 1 = Grey: Luck, 2 = Pink: Comfort, 3 = Green: Battery Capacity
    gem: {type: Schema.Types.ObjectId, ref: 'Gems'},
});

const Blanks = model('Blanks', blankSchema);
export default Blanks;
