import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
    {
        startDate: Date,
        endDate: Date,
        degree: String,
        institution: String,
    },
    { _id: true }
);

const experienceSchema = new mongoose.Schema(
    {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
    },
    { _id: true }
);

const projectSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        technologies: [String],
        link: String,
    },
    { _id: true }
);

const achievementSchema = new mongoose.Schema(
    {
        title: String,
        organization: String,
        year: Number,
        description: String,
    },
    { _id: true }
);

const certificationSchema = new mongoose.Schema(
    {
        name: String,
        issuer: String,
        issueDate: Date,
        credentialUrl: String,
    },
    { _id: true }
);

const candidateProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
        headline: String,

        bio: String,

        skills: [String],

        experienceYears: {
            type: Number,
            min: 0,
            max: 60,
        },

        currentCompany: {
            type: String
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Company",
        },

        currentPosition: String,

        experience: [experienceSchema],

        education: [educationSchema],

        projects: [projectSchema],

        achievements: [achievementSchema],

        certifications: [certificationSchema],

        github: String,

        linkedin: String,

        portfolio: String,

        resumeUrl: String,

        // resumeText: String,

        profileCompletion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

candidateProfileSchema.index({
    skills: 1,
});

export default mongoose.model(
    "CandidateProfile",
    candidateProfileSchema
);