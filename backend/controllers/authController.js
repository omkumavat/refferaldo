import crypto from 'crypto';
import User from '../models/User.js';
import Employee from '../models/Employee.js'
import Candidate from '../models/CandidateProfile.js';
import Company from '../models/Company.js';
import Verification from '../models/Verification.js';
import { signToken } from '../utils/jwt.js';
import { ok, fail } from '../utils/api.js';
import { sendVerificationEmail, resetPasswordEmail } from './EmailService.js';

const cookieOpts = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
});

const personalEmailProviders = [
    'gmail.com',
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
        companyweb,
        returnUrl
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

    sendVerificationEmail(normalizedEmail, raw, returnUrl).catch((err) => {
        console.error('Error sending verification email:', err);
    });

    if (role === "employee") {
        let company = await Company.findOne({
            name: companyname.toLowerCase()
        });

        let comp;
        if (!company) {
            comp = await Company.create({
                name: companyname,
                website: companyweb,
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
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (
            !user ||
            !(await user.comparePassword(password))
        ) {
            return fail(res, "Invalid email or password", 401);
        }

        if (!user.isActive) {
            return fail(res, "Account is inactive", 403);
        }

        if (!user.isEmailVerified) {
            const verification = await Verification.findOne({
                user: user._id,
                type: "email",
                status: "pending"
            });

            // Missing or expired verification record.
            if (
                !verification ||
                verification.expiresAt <= new Date()
            ) {
                // Delete associated verification records.
                await Verification.deleteMany({
                    user: user._id,
                });

                // Delete the role-specific profile.
                if (user.role === "candidate") {
                    await Candidate.deleteOne({ user: user._id });
                } else if (user.role === "employee") {
                    await Employee.deleteOne({ user: user._id });
                }

                // Delete the user only after related cleanup succeeds.
                await User.deleteOne({ _id: user._id });

                return fail(
                    res,
                    !verification
                        ? "Verification record not found. Your account has been removed. Please sign up again."
                        : "Your verification has expired. Your account has been removed. Please sign up again.",
                    403
                );
            }

            // Verification exists and has not expired.
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in.",
                code: "EMAIL_NOT_VERIFIED",
                email: user.email,
                gmailUrl: "https://mail.google.com/",
            });
        }

        // Issue JWT only after successful email verification.
        const token = signToken(user);

        res.cookie("accessToken", token, cookieOpts());

        return ok(
            res,
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    isEmailVerified: user.isEmailVerified,
                },
            },
            "Login successful"
        );
    } catch (error) {
        console.error("Login error:", error);
        return fail(res, "Something went wrong", 500);
    }
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

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        let { email, returnUrl } = req.body

        email = email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        // Use the same response whether the account exists or not.
        const message =
            "If an eligible account exists, a password reset link will be sent.";

        if (!user || !user.isActive || !user.isEmailVerified) {
            return res.status(200).json({
                success: true,
                message,
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.passwordResetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.passwordResetExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save({ validateBeforeSave: false });

        try {
            // Replace this call with your existing email function's signature.
            await resetPasswordEmail(email, resetToken, returnUrl, user?.name);
        } catch (emailError) {
            // Do not leave an unusable token active if email delivery fails.
            user.passwordResetTokenHash = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            throw emailError;
        }

        return res.status(200).json({
            success: true,
            message,
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to process your request. Please try again.",
        });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword, email } = req.body;

        if (!token || !password || !confirmPassword || !email) {
            return res.status(400).json({
                success: false,
                message: "Token, password and confirmation are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Apply the same password policy as your signup flow.
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            passwordResetTokenHash: hashedToken,
            passwordResetExpires: { $gt: new Date() },
            isActive: true,
            isEmailVerified: true,
            email:email
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset link is invalid or has expired. Please request a new one.",
            });
        }

        // Ensure your User pre-save hook hashes passwords.
        user.password = password;
        user.passwordResetTokenHash = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful. You can now log in.",
        });
    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to reset your password. Please try again.",
        });
    }
};
