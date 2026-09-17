import mongoose from "mongoose";
const s = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    type: {
        type: String,
        enum: ['email', 'employee', 'company', 'phone', 'identity'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    evidence: mongoose.Schema.Types.Mixed,
    verifiedAt: Date,
    expiresAt: Date
}, {
    timestamps: true
});
s.index({
    user: 1,
    type: 1
});
s.index({
    company: 1,
    type: 1
});
export default mongoose.model('Verification', s);