import { Schema, model } from 'mongoose';

const headphonetypeSchema = new Schema({
  name: { type: String, required: true },
  rounds_per_game: { type: Number, required: true },
  music_per_energy: { type: Number, required: true }
});

const HeadphoneTypes = model('HeadphoneTypes', headphonetypeSchema);
export default HeadphoneTypes;
