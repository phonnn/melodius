import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    _2fa: { type: String },
    role: { type: Number, required: true },     // Admin: 0, User: 1
    stamina: { type: Number, required: true },
    maxStamina: { type: Number, required: true },
    staminaRegen: { type: Number, required: true },
    staminaSpend: { type: Number, required: true },
    last_staminaSpend: { type: Number, required: true },
    maxMUSIC: { type: Number, required: true },
    headphones_count: { type: Number, required: true },
    assets: [{
        chainId: { type: Number, required: true },
        token: { type: Number, required: true }, // MELO: 0, MUSIC: 1
        value: { type: Number, required: true },
    }],
    addresses: [{
        chainId: { type: Number, required: true },
        address: { type: String, required: true },
    }],
    referrer: { type: Schema.Types.ObjectId, required: true },
    refCode: { type: Schema.Types.ObjectId, ref: 'Code' },
}, {
    timestamps: true,
});

const Users = model('Users', userSchema);
export default Users;