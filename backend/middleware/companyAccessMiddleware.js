
import Employee from '../models/Employee.js';
import Company from '../models/Company.js';
export const requireCompanyAccess = async (req, res, next) => {
    try {
        const companyId = req.params.companyId || req.params.id;
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({
            success: false,
            message: 'Company not found',
            errors: []
        });
        if (req.user.role === 'admin') {
            req.company = company;
            return next();
        }
        if (req.user.role === 'company' && company.createdBy.toString() === req.user._id.toString()) {
            req.company = company;
            return next();
        }
        const emp = await Employee.findOne({
            company: company._id,
            user: req.user._id,
            employmentStatus: 'active',
            verificationStatus: 'verified'
        });
        if (!emp) return res.status(403).json({
            success: false,
            message: 'You do not have verified access to this company',
            errors: []
        });
        req.company = company;
        req.employee = emp;
        next();
    } catch (e) {
        next(e);
    }
};