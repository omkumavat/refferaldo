import mongoose from "mongoose";
const s = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avatar :{
        type:String
    },
    designation: String,
    department: String,
    employmentStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verifiedAt: Date
}, {
    timestamps: true
});
s.index({
    company: 1,
    user: 1
}, {
    unique: true
});
export default mongoose.model('Employee', s);