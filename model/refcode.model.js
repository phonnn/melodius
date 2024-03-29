import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const codeSchema = new Schema({
    code: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    isUsed: { type: Boolean, required: true },
});

const Code = model('Code', codeSchema);
export default Code;