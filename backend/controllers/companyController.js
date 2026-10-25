import Company from '../models/Company.js'
import Employee from '../models/Employee.js'
import Job from '../models/Job.js';
import Notification from '../models/Notification.js'
import { ok, fail, pick } from '../utils/api.js'
import { getPagination, meta } from '../utils/pagination.js'
import { fetchJobsForSources } from "../utils/jobsFetcher.js";
import ReferralForm from "../models/Referral.js"


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
        const { id } = req.params;
        
        const profile = await Employee.findOne({
            user: id
        }).populate('company');
        
        if (profile.company.verificationStatus === 'pending') {
            return ok(res, {verified:false, jobs:[], company: profile.company}, 'Employee added for verification', 201);
        }

        const data = {
            companyname: profile.company.name,
            sources:profile.company.sources
        }
        const result = await fetchJobsForSources(data);

        res.status(200).json({
            verified:true,
            success: true,
            jobs: result,

        });
        return ok(res, {verified:true, jobs: result, company: profile.company}, 'Employee added for verification', 201);
    } catch (error) {
        console.error("Failed to fetch company jobs:", error);
        res.status(500).json({ success: false, message: "Failed to fetch jobs" });
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


export const getPublicCompanies = async (req, res) => {
  try {
    const {
      search = "",
      industry = "",
      page = "1",
      limit = "12",
    } = req.query;

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(
      48,
      Math.max(1, Number.parseInt(limit, 10) || 12)
    );

    const filter = {
      
    }

    if (search.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { industry: { $regex: escapedSearch, $options: "i" } },
        { headquarters: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (industry.trim()) {
      filter.industry = industry.trim();
    }

    const [companies, total] = await Promise.all([
      Company.find()
        .sort({ name: 1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Company.countDocuments(),
    ]);

    
    const enrichedCompanies = await Promise.all(
      companies.map(async (company) => {
        const [openJobs] = await Promise.all([
          ReferralForm.countDocuments({
            company: company._id,
            status: "active",
          }),
        ]);

        return {
          ...company,
          openJobs,
          referrers:company.employeeAssociated
        };
      })
    );

    return res.status(200).json({
      success: true,
      companies: enrichedCompanies,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get public companies error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load companies at this time.",
    });
  }
};
