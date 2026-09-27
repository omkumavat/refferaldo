import mongoose from "mongoose";
const s = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    logo: String,
    website: String,
    career_site: String,
    domain: String,
    description: String,
    industry: String,
    headquarters: String,
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
        index: true
    },
    employeeAssociated: {
        type: Number,
    },
    verifiedAt: Date,
}, {
    timestamps: true
});
s.index({
    name: 1
});
export default mongoose.model('Company', s);