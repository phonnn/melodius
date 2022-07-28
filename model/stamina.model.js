import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const staminaSchema = new Schema({
    headphones_own: { type: Number, required: true },
    stamina: { type: Number, required: true },
    regenTime: { type: Number, required: true },
    note: { type: String, required: true },
});

const Stamina = model('Stamina', staminaSchema);
export default Stamina;
