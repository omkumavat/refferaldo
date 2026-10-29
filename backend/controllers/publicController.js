
import ContactMessage from "../Models/Contact.js";

const CONTACT_TOPICS = [
    "General Inquiry",
    "Job Referral Support",
    "Account & Profile",
    "Company Partnership",
    "Report a Problem",
    "Feedback & Suggestions",
    "Other",
];

export const submitContact = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            topic,
            subject,
            message,
            contactPreference,
            consent,
        } = req.body;

        if (
            !name?.trim() ||
            !email?.trim() ||
            !subject?.trim() 
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
        }

        if (
            name.length > 100 ||
            email.length > 254 ||
            subject.length > 150 ||
            message.length > 2000 ||
            (phone && phone.length > 20)
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields exceed the allowed length.",
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        if (!CONTACT_TOPICS.includes(topic)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid contact topic.",
            });
        }

        if (!["Email", "Phone", "Either"].includes(contactPreference)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid contact preference.",
            });
        }

        if (consent !== true) {
            return res.status(400).json({
                success: false,
                message: "Consent is required to submit this inquiry.",
            });
        }

        const contactMessage = await ContactMessage.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || "",
            topic,
            subject: subject.trim(),
            message: message.trim(),
            contactPreference,
            consent,
        });



        return res.status(200).json({
            success: true,
            message: "Your message has been sent successfully. We'll get back to you soon.",
        });
    } catch (error) {
        console.error("Contact submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send your message right now. Please try again later.",
        });
    }
};
