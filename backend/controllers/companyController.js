import Company from '../models/Company.js'
import Employee from '../models/Employee.js'
import Job from '../models/Job.js';
import Notification from '../models/Notification.js'
import { ok, fail, pick } from '../utils/api.js'
import { getPagination, meta } from '../utils/pagination.js'
import { fetchJobsByCompanyName, fetchJobsFromCareersPage } from "../utils/jobsFetcher.js";

export const create = async (req, res) => {
    if (req.user.role !== 'company' && req.user.role !== 'admin') return fail(res, 'Only company users or admins can create companies', 403);
    const c = await Company.create({
        ...pick(req.body, ['name', 'logo', 'website', 'domain', 'description', 'industry', 'headquarters']),
        createdBy: req.user._id
    });
    return ok(res, c, 'Company created', 201);
};
export const list = async (req, res) => {
    const {
        page,
        limit,
        skip
    } = getPagination(req);
    const f = {};
    if (req.query.search) f.$or = [{
        name: {
            $regex: req.query.search,
            $options: 'i'
        }
    }, {
        industry: {
            $regex: req.query.search,
            $options: 'i'
        }
    }];
    if (req.query.verificationStatus) f.verificationStatus = req.query.verificationStatus;
    const [data, total] = await Promise.all([Company.find(f).populate('createdBy', 'name email').skip(skip).limit(limit).sort({
        createdAt: -1
    }), Company.countDocuments(f)]);
    return res.json({
        success: true,
        data,
        pagination: meta(page, limit, total)
    });
};
export const get = async (req, res) => {
    const c = await Company.findById(req.params.id).populate('createdBy', 'name email');
    if (!c) return fail(res, 'Company not found', 404);
    return ok(res, c);
};
export const update = async (req, res) => {
    const c = req.company;
    Object.assign(c, pick(req.body, ['name', 'logo', 'website', 'domain', 'description', 'industry', 'headquarters']));
    await c.save();
    return ok(res, c, 'Company updated');
};
export const remove = async (req, res) => {
    await Company.findByIdAndDelete(req.company._id);
    return ok(res, {}, 'Company deleted');
};
export const verify = async (req, res) => {
    const c = await Company.findById(req.params.id);
    if (!c) return fail(res, 'Company not found', 404);
    const status = req.body.status;
    if (!['verified', 'rejected', 'pending'].includes(status)) return fail(res, 'Invalid verification status', 422);
    c.verificationStatus = status;
    c.verifiedAt = status === 'verified' ? new Date() : undefined;
    await c.save();
    await Notification.create({
        user: c.createdBy,
        type: 'company_verification',
        title: 'Company verification updated',
        message: `Your company verification status is ${status}.`,
        relatedId: c._id,
        relatedType: 'Company'
    });
    return ok(res, c, 'Company verification updated');
};
export const employees = async (req, res) => ok(res, await Employee.find({
    company: req.params.id
}).populate('user', 'name email phone location').sort({
    createdAt: -1
}));
export const addEmployee = async (req, res) => {
    const c = req.company;
    if (c.verificationStatus !== 'verified') return fail(res, 'Company must be verified before employees can be added', 403);
    const {
        userId,
        designation,
        department
    } = req.body;
    if (!userId) return fail(res, 'userId is required', 422);
    const u = require('../models/User');
    const user = await u.findById(userId);
    if (!user || user.role !== 'employee') return fail(res, 'A valid employee user is required', 400);
    const e = await Employee.create({
        company: c._id,
        user: userId,
        designation,
        department,
        verificationStatus: 'pending'
    });
    return ok(res, e, 'Employee added for verification', 201);
};

export const removeEmployee = async (req, res) => {
    await Employee.findOneAndDelete({
        company: req.company._id,
        user: req.params.userId
    });
    return ok(res, {}, 'Employee relationship removed');
};

export const getCompanyJobs = async (req, res) => {
    try {
        const { companyname, companyweb, company_career } = req.query;
        console.log(companyname, company_career)
        const { jobs, matchedSlug } = await fetchJobsByCompanyName(companyname);
        const jobs2 = await fetchJobsFromCareersPage(company_career);
        console.log(jobs, jobs2, matchedSlug)
    } catch (err) {

    }
}
export const jobs = async (req, res) => {
    const {
        page,
        limit,
        skip
    } = getPagination(req);
    const [data, total] = await Promise.all([Job.find({
        company: req.params.id
    }).sort({
        createdAt: -1
    }).skip(skip).limit(limit), Job.countDocuments({
        company: req.params.id
    })]);
    return res.json({
        success: true,
        data,
        pagination: meta(page, limit, total)
    });
};