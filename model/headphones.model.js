import { Schema, model } from 'mongoose';

const headphoneSchema = new Schema({
  id: { type: Number, required: true },
  optimality: { type: Number, required: true },
  luck: { type: Number, required: true },
  comfort: { type: Number, required: true },
  battery: { type: Number, required: true },
  level: { type: Number, required: true },
  played_rounds: { type: Number, required: true },
  rarity: {type: Schema.Types.ObjectId, ref: 'Rarity'},
  blank_slot: {type: Schema.Types.ObjectId, ref: 'Blanks'},
  type: {type: Schema.Types.ObjectId, ref: 'HeadphoneTypes'},
}, {
  timestamps: true,
});

const Headphones = model('Headphones', headphoneSchema);
export default Headphones;