export const parseResume = async (text = '') => ({
    skills: [],
    experienceYears: 0,
    summary: text.slice(0, 300)
});
export const parseJobDescription = async (text = '') => ({
    skills: [],
    experienceMin: 0,
    experienceMax: 10,
    summary: text.slice(0, 300)
});
export const calculateJobMatch = async (candidate, job) => {
    const a = new Set((candidate.skills || []).map(x => x.toLowerCase()));
    const skills = (job.skills || []).map(x => x.toLowerCase());
    const matched = skills.filter(x => a.has(x));
    const missing = skills.filter(x => !a.has(x));
    return {
        score: skills.length ? Math.round(matched.length / skills.length * 100) : 0,
        matchedSkills: matched,
        missingSkills: missing,
        explanation: `Matched ${matched.length} of ${skills.length} listed skills.`
    };
};
export const generateJobRecommendations = async (jobs, candidate) => jobs.map(j => ({
    job: j,
    score: (j.skills || []).filter(s => (candidate.skills || []).map(x => x.toLowerCase()).includes(s.toLowerCase())).length
}));
export const generateResumeSummary = async (profile) => `Candidate profile with ${(profile.skills||[]).length} skills and ${profile.experienceYears||0} years of experience.`;