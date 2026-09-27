import crypto from 'crypto';
import User from '../models/User.js';
import Employee from '../models/Employee.js'
import Company from '../models/Company.js';
import Verification from '../models/Verification.js';
import { signToken } from '../utils/jwt.js';
import { ok, fail } from '../utils/api.js';
import { sendVerificationEmail } from './EmailService.js';

const cookieOpts = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
});

const personalEmailProviders = [
    // 'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'live.com',
    'icloud.com',
    'protonmail.com',
    'proton.me',
    'aol.com',
    'zoho.com',
];

export const register = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        companyname,
        companyweb
    } = req.body;

    if (role === 'admin') {
        return fail(res, 'Admin registration is not allowed', 403);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailDomain = normalizedEmail.split('@')[1];

    // Employees must use a work email
    if (role === 'employee') {
        if (!emailDomain || personalEmailProviders.includes(emailDomain)) {
            return fail(
                res,
                'Employees must register using a valid work email address',
                400
            );
        }
    }

    const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: role || 'candidate',
    });

    const token = signToken(user);
    res.cookie('accessToken', token, cookieOpts());

    const raw = crypto.randomBytes(24).toString('hex');

    user.emailVerificationTokenHash = crypto
        .createHash('sha256')
        .update(raw)
        .digest('hex');

    user.emailVerificationExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    await Verification.create({
        user: user._id,
        type: 'email',
        status: 'pending',
        expiresAt: user.emailVerificationExpires,
    });

    sendVerificationEmail(normalizedEmail, raw).catch((err) => {
        console.error('Error sending verification email:', err);
    });

    if (role === "employee") {
        let company = await Company.findOne({
            name: companyname.toLowerCase()
        });

        let comp;
        if (!company) {
            comp = await Company.create({
                name:companyname,
                website:companyweb,
                employeeAssociated: 1
            });
            comp.save();
        } else {
            company.employeeAssociated++;
            company.save();
        }

        const emp = await Employee.create({
            company: comp._id,
            user: user._id
        })
        emp.save();
    }

    return ok(
        res,
        {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
        'Registration successful',
        201
    );
};

export const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    const user = await User.findOne({
        email
    }).select('+password');
    if (!user || !(await user.comparePassword(password))) return fail(res, 'Invalid email or password', 401);
    if (!user.isActive) return fail(res, 'Account is inactive', 403);
    const token = signToken(user);
    res.cookie('accessToken', token, cookieOpts());
    return ok(res, {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified
        }
    }, 'Login successful');
};
export const logout = async (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    return ok(res, {}, 'Logged out');
};
export const me = async (req, res) => ok(res, {
    user: req.user
});
export const verifyEmail = async (req, res) => {
    const {
        token
    } = req.body;
    if (!token) return fail(res, 'Verification token is required', 422);
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        emailVerificationTokenHash: hash,
        emailVerificationExpires: {
            $gt: Date.now()
        }
    });
    if (!user) return fail(res, 'Invalid or expired verification token', 400);
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    await Verification.findOneAndUpdate({
        user: user._id,
        type: 'email'
    }, {
        status: 'verified',
        verifiedAt: new Date()
    }, {
        sort: {
            createdAt: -1
        }
    });
    return ok(res, {}, 'Email verified');
};
export const forgotPassword = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (user) {
        const raw = crypto.randomBytes(32).toString('hex');
        user.passwordResetTokenHash = crypto.createHash('sha256').update(raw).digest('hex');
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        await user.save();
        if (process.env.NODE_ENV !== 'production') console.log(`Password reset token for ${user.email}: ${raw}`);
    }
    return ok(res, {}, 'If the account exists, password reset instructions have been issued');
};
export const resetPassword = async (req, res) => {
    const {
        token,
        password
    } = req.body;
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetTokenHash: hash,
        passwordResetExpires: {
            $gt: Date.now()
        }
    }).select('+password');
    if (!user) return fail(res, 'Invalid or expired reset token', 400);
    user.password = password;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return ok(res, {}, 'Password reset successful');
};