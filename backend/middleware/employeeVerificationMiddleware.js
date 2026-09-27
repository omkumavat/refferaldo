import Employee from "../models/Employee.js";
export default async (req, res, next) => {
    try {
        const emp = await Employee.findOne({
            user: req.user._id,
            employmentStatus: 'active',
            verificationStatus: 'verified'
        });
        if (!emp) return res.status(403).json({
            success: false,
            message: 'Verified active employee membership is required',
            errors: []
        });
        req.employee = emp;
        next();
    } catch (e) {
        next(e);
    }
};