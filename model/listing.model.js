import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const listingSchema = new Schema({
    seller: {type: Schema.Types.ObjectId, ref: 'Users', required: true },
    item: {type: Schema.Types.ObjectId, required: true },
    price: { type: Number, required: true }
});

const Listing = model('Listing', listingSchema);
export default Listing;
