import { Schema, model } from 'mongoose';

const raritySchema = new Schema({
  name: { type: String, required: true },
  min_attr: { type: Number, required: true },
  max_attr: { type: Number, required: true },
  attr_per_lv: { type: Number, required: true },
  genesis_supply: { type: Number, required: true },
  mint_cooldown: { type: Number, required: true },
  age_to_mint: { type: Number, required: true },
  energy_to_mint: { type: Number, required: true },
});

const Rarity = model('Rarity', raritySchema);
export default Rarity;
