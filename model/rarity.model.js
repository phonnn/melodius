import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const raritySchema = new Schema({
    id: { type: Number, required: true }, //Common: 0, Uncommon: 1, Super Rare: 2, Unique: 3
    name: { type: String, required: true },
    min_attr: { type: Number, required: true },
    max_attr: { type: Number, required: true },
    attr_per_lv: { type: Number, required: true },
    addition_stamina: { type: Number, required: true },
});

const Rarity = model('Rarity', raritySchema);
export default Rarity;
