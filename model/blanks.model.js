import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const blankSchema = new Schema({
    slot_id: { type: Number, required: true },
    gem: {type: Schema.Types.ObjectId, ref: 'Gems'},
});

const Blanks = model('Blanks', blankSchema);
export default Blanks;
