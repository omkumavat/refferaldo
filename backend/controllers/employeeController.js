import Employee from '../models/Employee.js';
import ReferralRequest from '../models/ReferralRequest.js';
import Referral from '../models/Referral.js';
import Job from '../models/Job.js'
import Company from '../models/Company.js';
import Notification from '../models/Notification.js';

import { ok, fail } from '../utils/api.js'
import { getPagination, meta } from '../utils/pagination.js';
export const dashboard = async (req, res) => {
    const e = req.employee;
    const [requests, referrals] = await Promise.all([ReferralRequest.countDocuments({
        employee: req.user._id,
        status: 'pending'
    }), Referral.countDocuments({
        employee: req.user._id
    })]);
    return ok(res, {
        employee: e,
        pendingRequests: requests,
        totalReferrals: referrals
    });
};
export const jobs = async (req, res) => {
    const {
        page,
        limit,
        skip
    } = getPagination(req);
    const [data, total] = await Promise.all([Job.find({
        company: req.employee.company,
        status: 'active'
    }).sort({
        createdAt: -1
    }).skip(skip).limit(limit), Job.countDocuments({
        company: req.employee.company,
        status: 'active'
    })]);
    return res.json({
        success: true,
        data,
        pagination: meta(page, limit, total)
    });
};

export const getEmployee = async (req, res) => {
    try {
        const profile = await Employee.findOne({
            user: req.params.id
        }).populate('company')
        .populate('user', '-password');
        return ok(res, {
            // user: req.user,
            profile
        });
    } catch (error) {
        return fail(res, 'Error fetching profile', 500);
    }
}
export const requests = async (req, res) => {
    const {
        page,
        limit,
        skip
    } = getPagination(req);
    const f = {
        employee: req.user._id
    };
    if (req.query.status) f.status = req.query.status;
    const [data, total] = await Promise.all([ReferralRequest.find(f).populate('candidate', 'name email').populate('job', 'title').populate('company', 'name').skip(skip).limit(limit).sort({
        createdAt: -1
    }), ReferralRequest.countDocuments(f)]);
    return res.json({
        success: true,
        data,
        pagination: meta(page, limit, total)
    });
};
export const request = async (req, res) => {
    const r = await ReferralRequest.findOne({
        _id: req.params.id,
        employee: req.user._id
    }).populate('candidate', 'name email').populate('job', 'title').populate('company', 'name');
    if (!r) return fail(res, 'Referral request not found', 404);
    return ok(res, r);
};
export const accept = async (req, res) => {
    const r = await ReferralRequest.findOne({
        _id: req.params.id,
        employee: req.user._id,
        status: 'pending'
    });
    if (!r) return fail(res, 'Pending referral request not found', 404);
    r.status = 'accepted';
    await r.save();
    await Notification.create({
        user: r.candidate,
        type: 'referral_request',
        title: 'Referral request accepted',
        message: 'An employee accepted your referral request.',
        relatedId: r._id,
        relatedType: 'ReferralRequest'
    });
    return ok(res, r, 'Referral request accepted');
};
export const reject = async (req, res) => {
    const r = await ReferralRequest.findOne({
        _id: req.params.id,
        employee: req.user._id,
        status: 'pending'
    });
    if (!r) return fail(res, 'Pending referral request not found', 404);
    r.status = 'rejected';
    await r.save();
    await Notification.create({
        user: r.candidate,
        type: 'referral_request',
        title: 'Referral request rejected',
        message: 'An employee rejected your referral request.',
        relatedId: r._id,
        relatedType: 'ReferralRequest'
    });
    return ok(res, r, 'Referral request rejected');
};
export const createReferral = async (req, res) => {
    const r = await ReferralRequest.findOne({
        _id: req.body.referralRequestId,
        employee: req.user._id,
        status: 'accepted'
    });
    if (!r) return fail(res, 'Accepted referral request not found', 404);
    const existing = await Referral.findOne({
        candidate: r.candidate,
        job: r.job,
        employee: req.user._id
    });
    if (existing) return fail(res, 'Referral already submitted', 409);
    const job = await Job.findById(r.job);
    const referral = await Referral.create({
        candidate: r.candidate,
        job: r.job,
        company: r.company,
        employee: req.user._id,
        referralRequest: r._id,
        rewardAmount: job.referralReward,
        status: 'submitted'
    });
    await Notification.create({
        user: r.company ? job.createdBy : r.candidate,
        type: 'referral_submitted',
        title: 'Referral submitted',
        message: `A referral was submitted for ${job.title}.`,
        relatedId: referral._id,
        relatedType: 'Referral'
    });
    return ok(res, referral, 'Referral submitted', 201);
};
export const referrals = async (req, res) => {
    const {
        page,
        limit,
        skip
    } = getPagination(req);
    const [data, total] = await Promise.all([Referral.find({
        employee: req.user._id
    }).populate('candidate', 'name email').populate('job', 'title').populate('company', 'name').skip(skip).limit(limit).sort({
        createdAt: -1
    }), Referral.countDocuments({
        employee: req.user._id
    })]);
    return res.json({
        success: true,
        data,
        pagination: meta(page, limit, total)
    });
};
export const rewards = async (req, res) => {
    const data = await Referral.aggregate([{
        $match: {
            employee: req.user._id
        }
    }, {
        $group: {
            _id: '$rewardStatus',
            amount: {
                $sum: '$rewardAmount'
            },
            count: {
                $sum: 1
            }
        }
    }]);
    return ok(res, data);
};