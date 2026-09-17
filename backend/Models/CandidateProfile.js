import mongoose from 'mongoose';
const s = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    headline: String,
    bio: String,
    skills: [String],
    experienceYears: {
        type: Number,
        min: 0,
        max: 60
    },
    currentCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    currentPosition: String,
    education: [mongoose.Schema.Types.Mixed],
    projects: [mongoose.Schema.Types.Mixed],
    certifications: [mongoose.Schema.Types.Mixed],
    github: String,
    linkedin: String,
    portfolio: String,
    resumeUrl: String,
    resumeText: String,
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});
s.index({
    skills: 1
});
s.index({
    location: 1
});
export default mongoose.model('CandidateProfile', s);