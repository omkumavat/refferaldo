import mongoose from 'mongoose';

const s = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    responsibilities: [String],
    requirements: [String],
    preferredQualifications: [String],
    skills: [String],
    location: String,
    workMode: {
        type: String,
        enum: ['remote', 'hybrid', 'onsite'],
        default: 'onsite'
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time'
    },
    experienceMin: {
        type: Number,
        min: 0
    },
    experienceMax: {
        type: Number,
        min: 0
    },
    salaryMin: Number,
    salaryMax: Number,
    salaryCurrency: {
        type: String,
        default: 'INR'
    },
    referralReward: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'closed'],
        default: 'draft',
        index: true
    },
    source: {
        type: String,
        enum: ['company', 'imported'],
        default: 'company'
    },
    applicationDeadline: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
s.index({
    company: 1,
    status: 1
});
s.index({
    skills: 1
});
s.index({
    location: 1
});
s.index({
    createdAt: -1
});
s.index({
    title: 'text',
    description: 'text',
    skills: 'text',
    location: 'text'
});
export default mongoose.model('Job', s);