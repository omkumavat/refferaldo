import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendOTPEmail = async (req, res) => {
    // console(req.body); // Check request body
    const { name, email, otp } = req.body;

    if (!otp) {
        return res.status(400).json({ error: "OTP is missing in request body" });
    }

    // console(typeof otp, otp); // Check OTP value

    const Otp = typeof otp === "string" ? otp.split("") : [];

    const templatePath = path.join(__dirname, "../views", "SignupOTP.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({ name, email, Otp });

    // console(htmlContent); // Ensure OTP is rendering correctly

    const mailOptions = {
        from: `CodeVerse <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your OTP Verification Code",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};


export const sendSignUpSuccessfulEmail = async (req, res) => {
    // console(req.body);
    const { name, email, username } = req.body;
    const templatePath = path.join(__dirname, "../views", 'SignupSuccess.hbs');
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({ name, username });

    const mailOptions = {
        from: `CodeVerse <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Welcome to Our Platform",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console("OTP email sent successfully.");
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};


export const sendVerificationEmail = async (email, token, returnUrl) => {
    const verificationUrl = `http://localhost:5173/verify?token=${token}&returnUrl=${returnUrl}`;

    const templatePath = path.join(__dirname, "../views", 'Verification.hbs');
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({ verificationUrl });

    await transporter.sendMail({
        from: `Refferal.do Admin <${process.env.MAIL_USER}`,
        to: email,
        subject: 'Complete Your Registration',
        html: htmlContent
    });
};

export const resetPasswordEmail = async (email, token, returnUrl, name) => {
    const resetUrl = `http://localhost:5173/reset-password?token=${token}&returnUrl=${returnUrl}&email=${encodeURIComponent(email)}`;

    const templatePath = path.join(__dirname, "../views", 'reset-password.hbs');
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({ resetUrl, name });

    await transporter.sendMail({
        from: `Refferal.do Admin <${process.env.MAIL_USER}`,
        to: email,
        subject: 'Reset Your Password',
        html: htmlContent
    });
};

export const sendDirectReferralEmail = async (email,name,title, companyName,  empName) => {

    const templatePath = path.join(__dirname, "../views", 'directReferralNotification.hbs');
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({  candidateName:name,
            jobTitle:title,
            companyName: companyName,
            employeeName: empName,
            referralUrl: "http://localhost:5173/candidate/applications", });

    await transporter.sendMail({
        from: `Refferal.do Admin <${process.env.MAIL_USER}`,
        to: email,
        subject: 'Congratulations! You were referred directly',
        html: htmlContent
    });
};

export const sendReferralStatusEmail = async (email,submission, statusInfo) => {

    if (statusInfo) {
        const replaceVariables = (text) =>
            text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
                const values = {
                    candidateName: submission.name,
                    jobTitle:  submission.form?.title,
                    companyName:
                        submission.form?.company?.companyname ||
                        submission.form?.company?.name,
                    employeeName:
                        submission.form?.createdBy?.name || "The referring employee"
                };

                return values[key] ?? "";
            });

        const emailData = {
            emailHeading: statusInfo.emailHeading,
            statusLabel: statusInfo.statusLabel,
            emailMessage: replaceVariables(statusInfo.emailMessage),
            encouragementMessage: statusInfo.encouragementMessage
        };

        const templatePath = path.join(__dirname, "../views", 'referralStatusUpdate.hbs');
        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const template = Handlebars.compile(templateSource);
        let htmlContent = template({ candidateName:submission.name,
            jobTitle:submission.form.title,
            companyName: submission.form.company.name,
            employeeName: submission.form.createdBy.name,
            dashboardUrl: "http://localhost:5173/candidate/applications",
             emailData });

        await transporter.sendMail({
            from: `Refferal.do Admin <${process.env.MAIL_USER}`,
            to: email,
            subject: 'Update on your Referral Status',
            html: htmlContent
        });
    };
}