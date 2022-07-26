import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const typeSchema = new Schema({
    id: { type: Number, required: true }, //Classic: 0, Electric: 1, Solar: 2, Atom: 3
    name: { type: String, required: true },
    rounds_per_game: { type: Number, required: true },
    music_per_stamina: { type: Number, required: true },
    mint_cooldown: { type: Number, required: true },
    genesis_supply: { type: Number, required: true },
    age_to_mint: { type: Number, required: true },
    stamina_to_mint: { type: Number, required: true }
});

const Types = model('Types', typeSchema);
export default Types;
