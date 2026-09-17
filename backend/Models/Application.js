import mongoose from 'mongoose';

const s = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'under-review', 'interview', 'offer', 'rejected', 'hired'],
        default: 'applied'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
s.index({
    candidate: 1,
    job: 1
}, {
    unique: true
});
export default mongoose.model('Application', s);