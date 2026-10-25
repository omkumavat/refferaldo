import Candidate from '../models/CandidateProfile.js';
import Job from '../models/Job.js';
import User from "../models/User.js"
import ReferralSubmission from '../models/Application.js';
import ReferralRequest from '../models/ReferralRequest.js';
import Referral from '../models/Referral.js';
import Employee from '../models/Employee.js';
import Company from '../models/Company.js';
import Notification from '../models/Notification.js';
import Match from '../models/Match.js';
import { extractResumeText, parseResumeWithAI } from "../utils/resumeParser.js";
// import ai from '../services/aiService.js';

import { ok, fail, pick } from '../utils/api.js';
import { getPagination, meta } from '../utils/pagination.js';

export const list = async (req, res) => {
    const {
        page,
        limit,
        skip
    } = getPagination(req);
    const f = {};
    if (req.query.skills) f.skills = {
        $in: req.query.skills.split(',').map(x => new RegExp(x, 'i'))
    };
    if (req.query.search) f.$or = [{
        headline: {
            $regex: req.query.search,
            $options: 'i'
        }
    }, {
        bio: {
            $regex: req.query.search,
            $options: 'i'
        }
    }, {
        skills: {
            $regex: req.query.search,
            $options: 'i'
        }
    }];
    const [data, total] = await Promise.all([Candidate.find(f).populate('user', 'name email avatar location').populate('currentCompany', 'name logo').skip(skip).limit(limit).sort({
        updatedAt: -1
    }), Candidate.countDocuments(f)]);
    return res.json({
        success: true,
        data,
        pagination: meta(page, limit, total)
    });
};

export const getProfile = async (req, res) => {
    try {
        const profile = await Candidate.findOne({
            user: req.params.id
        }).populate('currentCompany', 'name logo');
        return ok(res, {
            // user: req.user,
            profile
        });
    } catch (error) {
        return fail(res, 'Error fetching profile', 500);
    }
}

export const updateProfile = async (req, res) => {
    const p = await Candidate.findOneAndUpdate({
        user: req.user._id
    }, {
        user: req.user._id,
        ...pick(req.body, ['headline', 'bio', 'skills', 'experienceYears', 'currentCompany', 'currentPosition', 'education', 'projects', 'certifications', 'github', 'linkedin', 'portfolio', 'profileCompletion'])
    }, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
    });
    return ok(res, p, 'Candidate profile updated');
};
export const resume = async (req, res) => {
    if (!req.file) return fail(res, 'Resume file is required', 422);
    const p = await Candidate.findOneAndUpdate({
        user: req.params.id
    }, {
        user: req.params.id,
        resumeUrl: `/${process.env.UPLOAD_DIR || 'uploads'}/${req.file.filename}`
    }, {
        upsert: true,
        new: true
    });
    return ok(res, p, 'Resume uploaded');
};


const ALLOWED_SECTIONS = [
    "education",
    "experience",
    "projects",
    "achievements",
    "certifications",
];

export const addCandidateProfile = async (req, res) => {
    try {
        const { userId, section } = req.params;

        if (!ALLOWED_SECTIONS.includes(section)) {
            return res.status(400).json({
                success: false,
                message: `Invalid section "${section}"`,
            });
        }

        const { id, ...item } = req.body; // drop any client-generated temp id (e.g. Date.now())

        const profile = await Candidate.findOneAndUpdate(
            { user: userId },
            { $push: { [section]: item } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.json({ success: true, data: { profile } });
    } catch (error) {
        console.error("Failed to add profile item:", error);
        res.status(500).json({ success: false, message: "Failed to add item" });
    }
}

export const parseResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const resumeUrl = `/public/resumes/${req.file.filename}`;
        const resumeText = await extractResumeText(req.file.path, req.file.mimetype);

        // Save the file + raw text right away, regardless of whether AI parsing succeeds
        await Candidate.findOneAndUpdate(
            { user: req.params.id },
            { resumeUrl },
            { new: true, upsert: true }
        );

        let extracted = null;
        let parseError = null;

        try {
            extracted = await parseResumeWithAI(resumeText);
        } catch (err) {
            parseError = err.message;
        }

        // console.log(extracted)
        const autosave = req.query.autosave === "true";

        if (extracted) {
            const { id, ...safeExtracted } = extracted;

            const profile = await Candidate.findOneAndUpdate(
                { user: req.params.id },
                { $set: safeExtracted },
                { new: true, runValidators: true }
            );
        }

        res.json({ success: true, data: { resumeUrl, extracted, parseError } })
    } catch (error) {
        console.error("Resume parse failed:", error);
        res.status(500).json({ success: false, message: "Failed to process resume" });
    }
}

export const getMyReferralSubmissions = async (req, res) => {
    try {
        const candidateId = req.params.userId || req.user.id;

        const submissions = await ReferralSubmission.find({
            candidate: candidateId,
        })
            .populate("answers.question")
            .populate({
                path: "form",
                select: "title roleName jobTitle slug company createdBy employee",
                populate: [
                    { path: "company", select: "name companyname" },
                    { path: "createdBy", select: "name email" },
                    // { path: "employee", select: "name email" },
                ],
            })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({ submissions });
    } catch (error) {
        console.error("Get candidate submissions error:", error);

        return res.status(500).json({
            message: "Failed to fetch your submissions.",
        });
    }
};
export const referrals = async (req, res) => {
    const {
        page,
        limit,
        skip
    } = getPagination(req);
    const [data, total] = await Promise.all([Referral.find({
        candidate: req.user._id
    }).populate('job', 'title status').populate('company', 'name logo').populate('employee', 'name').skip(skip).limit(limit).sort({
        createdAt: -1
    }), Referral.countDocuments({
        candidate: req.user._id
    })]);
    return res.json({
        success: true,
        data,
        pagination: meta(page, limit, total)
    });
};
export const apply = async (req, res) => {
    const j = await Job.findOne({
        _id: req.params.jobId,
        status: 'active'
    });
    if (!j) return fail(res, 'Active job not found', 404);
    const a = await Application.create({
        candidate: req.user._id,
        job: j._id
    });
    await Notification.create({
        user: j.createdBy,
        type: 'application',
        title: 'New application',
        message: `A candidate applied for ${j.title}.`,
        relatedId: a._id,
        relatedType: 'Application'
    });
    return ok(res, a, 'Application submitted', 201);
};
export const referralRequest = async (req, res) => {
    const j = await Job.findOne({
        _id: req.params.jobId,
        status: 'active'
    });
    if (!j) return fail(res, 'Active job not found', 404);
    const employeeId = req.body.employeeId;
    if (!employeeId) return fail(res, 'employeeId is required', 422);
    const e = await Employee.findOne({
        user: employeeId,
        company: j.company,
        employmentStatus: 'active',
        verificationStatus: 'verified'
    });
    if (!e) return fail(res, 'Employee is not verified for this company', 403);
    const r = await ReferralRequest.create({
        candidate: req.user._id,
        job: j._id,
        company: j.company,
        employee: employeeId,
        message: req.body.message
    });
    await Notification.create({
        user: employeeId,
        type: 'referral_request',
        title: 'New referral request',
        message: `A candidate requested a referral for ${j.title}.`,
        relatedId: r._id,
        relatedType: 'ReferralRequest'
    });
    return ok(res, r, 'Referral request submitted', 201);
};
export const recommended = async (req, res) => {
    const p = await Candidate.findOne({
        user: req.user._id
    });
    if (!p) return ok(res, [], 'Complete your candidate profile to get recommendations');
    const jobs = await Job.find({
        status: 'active'
    }).populate('company', 'name logo');
    const rec = await ai.generateJobRecommendations(jobs, p);
    rec.sort((a, b) => b.score - a.score);
    return ok(res, rec.slice(0, 20));
};



import fs from "fs/promises";
import path from "path";

const profileImageDir = path.resolve("public/profile-images");

async function deleteOldLocalPhoto(photoUrl) {
  if (
    typeof photoUrl !== "string" ||
    !photoUrl.startsWith("/uploads/profile-images/")
  ) {
    return;
  }

  const filename = path.basename(photoUrl);
  const filePath = path.join(profileImageDir, filename);

  // Ensure the resolved path remains inside the upload directory.
  if (path.dirname(filePath) !== profileImageDir) return;

  await fs.unlink(filePath).catch(() => {});
}

export const uploadProfilePhoto = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please select an image.",
    });
  }

  const newFilePath = req.file.path;

  try {
    const userId = req.param?.userId || req.user?._id;

    if (!userId) {
      await fs.unlink(newFilePath).catch(() => {});

      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      await fs.unlink(newFilePath).catch(() => {});

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const previousPhoto = user.avatar;
    const photoUrl =
      `/public/profile-images/${req.file.filename}`;

    user.avatar = photoUrl;
    await user.save();

    // Cleanup is best-effort; never fail a successful update just
    // because an old file could not be deleted.
    if (previousPhoto && previousPhoto !== photoUrl) {
      await deleteOldLocalPhoto(previousPhoto);
    }

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        photo: photoUrl,
      },
    });
  } catch (error) {
    await fs.unlink(newFilePath).catch(() => {});
    next(error);
  }
};
