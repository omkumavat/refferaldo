import User from '../models/User.js';
import Candidate from '../models/CandidateProfile.js';
import {ok, fail, pick} from '../utils/api.js';
import { getPagination, meta } from '../utils/pagination.js';

export const getProfile = async (req, res) => {
    const profile = await User.findById(
        req.params.id
    ).select('-password');
    return ok(res, {
        user:profile,
    });
};
export const updateProfile = async (req, res) => {
    const fields = pick(req.body, ['name', 'phone', 'location', 'avatar']);
    await User.findByIdAndUpdate(req.user._id, fields, {
        runValidators: true
    });
    const profileFields = pick(req.body, ['headline', 'bio', 'skills', 'experienceYears', 'currentCompany', 'currentPosition', 'education', 'projects', 'certifications', 'github', 'linkedin', 'portfolio']);
    const profile = await Candidate.findOneAndUpdate({
        user: req.user._id
    }, {
        user: req.user._id,
        ...profileFields
    }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
    });
    return ok(res, {
        user: await User.findById(req.user._id).select('-password'),
        profile
    }, 'Profile updated');
};
export const listUsers = async (req, res) => {
    const {
        page,
        limit,
        skip
    } = getPagination(req);
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) filter.$or = [{
        name: {
            $regex: req.query.search,
            $options: 'i'
        }
    }, {
        email: {
            $regex: req.query.search,
            $options: 'i'
        }
    }];
    const [data, total] = await Promise.all([User.find(filter).select('-password').skip(skip).limit(limit).sort({
        createdAt: -1
    }), User.countDocuments(filter)]);
    return res.json({
        success: true,
        data,
        pagination: meta(page, limit, total)
    });
};
export const deleteAccount = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        isActive: false
    });
    res.clearCookie('accessToken');
    return ok(res, {}, 'Account deactivated');
};