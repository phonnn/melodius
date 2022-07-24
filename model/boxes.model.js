import { Schema, model } from 'mongoose';

const boxSchema = new Schema({
  id: { type: Number, required: true },
  rarity: { type: String, required: true }
}, {
  timestamps: true,
});

const Boxes = model('Boxes', boxSchema);
export default Boxes;
