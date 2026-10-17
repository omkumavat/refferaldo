// Dummy API - replace these functions with your actual backend API later.

const dummyProfile = {
    id: "candidate-001",

    name: "Rahul Sharma",
    headline: "Full Stack Developer | React | Node.js",
    location: "Pune, Maharashtra",
    experience: "2 years",
    photo: "",

    summary:
        "Passionate software developer with experience building scalable web applications using React, Node.js and MongoDB.",

    email: "rahul.sharma@gmail.com",
    phone: "+91 9876543210",

    skills: [
        "React",
        "Node.js",
        "MongoDB",
        "Express.js",
        "JavaScript",
        "Git",
    ],

    experienceItems: [
        {
            id: 1,
            role: "Software Developer Intern",
            company: "Tech Solutions",
            period: "Jan 2025 - Jun 2025",
            detail:
                "Developed responsive React applications and REST APIs using Node.js and Express.",
        },
    ],

    education: [
        {
            id: 1,
            degree: "B.E. Computer Engineering",
            institution: "PICT",
            period: "2022 - 2026",
            detail: "CGPA: 8.9",
        },
    ],

    projects: [
        {
            id: 1,
            name: "Employee Referral Platform",
            detail:
                "Built a full-stack referral platform using React, Node.js, Express and MongoDB.",
            technologies: "React, Node.js, MongoDB",
            link: "",
        },
    ],

    achievements: [
        {
            id: 1,
            title: "Hackathon Finalist",
            organization: "JSPM Hackathon",
            year: "2025",
            detail: "Finalist among participating teams.",
        },
    ],

    links: {
        github: "https://github.com/rahulsharma",
        linkedin: "https://linkedin.com/in/rahulsharma",
        portfolio: "",
    },

    codingProfiles: {
        leetcode: "",
        codechef: "",
        hackerrank: "",
        geeksforgeeks: "",
    },

    resume: {
        name: "rahul_sharma_resume.pdf",
        updated: "2 weeks ago",
        url: "#",
    },
};

export const getCandidateProfile = async (userId, security) => {
    try {
        // console.log(security, userId)
        const API_URL = `${import.meta.env.VITE_API_URL}/candidate/profile/${security}/${userId}`;

        const [response_profile, response_user] = await Promise.all([
            fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }),
            fetch(`${import.meta.env.VITE_API_URL}/user/profile/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }),
        ]);

        if (!response_profile.ok || !response_user.ok) {
            return {
                success: false,
                error: `Request failed (profile: ${response_profile.status}, user: ${response_user.status})`,
            };
        }

        const profileData = await response_profile.json();
        const userData = await response_user.json();

        console.log(profileData, userData)

        return {
            success: true,
            profile: profileData?.data?.profile ?? null,
            user: userData?.data?.user ?? null,
        };
    } catch (error) {
        console.error("Error fetching candidate profile:", error);
        return {
            success: false,
            error: error.message || "Failed to fetch candidate profile",
        };
    }
};

export const updateCandidateProfile = async (profile) => {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/candidate/profile/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(profile),
        });

        const data = await response.json();

        return {
            success: true,
            data: data,
        }
    }
    catch (error) {
        console.log("Error updating candidate profile:", error);
    }
};

// candidateApi.js
export const uploadCandidateResume = async (userId, file) => {
    if (!userId || !file) {
        return { success: false, error: "Missing userId or file" };
    }

    try {
        const API_URL = import.meta.env.VITE_API_URL;

        const formData = new FormData();
        formData.append("resume", file);

        const response = await fetch(`${API_URL}/candidate/profile/resume/${userId}`, {
            method: "POST",
            credentials: "include",
            body: formData, 
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return { success: false, error: data.message || "Upload failed" };
        }

        return { success: true, profile: data.data.profile };
    } catch (error) {
        console.error("Error uploading resume:", error);
        return { success: false, error: error.message || "Upload failed" };
    }
};

// candidateApi.js

const TYPE_TO_SECTION = {
  experience: "experience",
  education: "education",
  project: "projects",
  achievement: "achievements",
  certification: "certifications",
};

export const addCandidateProfileItem = async (userId, type, data) => {
    const section = TYPE_TO_SECTION[type];

    if (!userId || !section) {
        return { success: false, error: "Missing userId or invalid type" };
    }

    try {
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await fetch(`${API_URL}/candidate/profile/add/${userId}/${section}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return { success: false, error: result.message || "Failed to add item" };
        }

        return { success: true, profile: result.data.profile };
    } catch (error) {
        console.error("Error adding profile item:", error);
        return { success: false, error: error.message || "Failed to add item" };
    }
};

// candidateApi.js
export const parseResumeAndExtract = async (userId, file) => {
    if (!userId || !file) {
        return { success: false, error: "Missing userId or file" };
    }

    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const formData = new FormData();
        formData.append("resume", file);

        const response = await fetch(`${API_URL}/candidate/profile/resume/parse/${userId}`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return { success: false, error: result.message || "Failed to parse resume" };
        }

        return { success: true, ...result.data };
    } catch (error) {
        console.error("Error parsing resume:", error);
        return { success: false, error: error.message || "Failed to parse resume" };
    }
};