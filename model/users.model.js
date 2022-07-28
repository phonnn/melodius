import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    stamina: { type: Number, required: true },
    maxStamina: { type: Number, required: true },
    staminaRegen: { type: Number, required: true },
    stamina_spend: { type: Number, required: true },
    last_stamina_spend: { type: Number, required: true },
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
}, {
    timestamps: true,
});

const Users = model('Users', userSchema);
export default Users;