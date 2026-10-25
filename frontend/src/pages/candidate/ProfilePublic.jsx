import React, { useEffect, useRef, useState } from "react";
import { getCandidateProfile } from "../../api/candidateApi";
import { VerificationBadge } from "../../components/Badges";
import {
    MapPin,
    Briefcase,
    Mail,
    Phone,
    FileText,
    Github,
    Linkedin,
    Globe,
    Plus,
    Download,
    Upload,
    Loader2
} from "lucide-react";
import { useParams } from "react-router-dom";
import { CandidateReferModal } from "../../components/referral/CandidateReferModal";
import { ShowCandidateInfo } from "../../components/referral/showCandidateInfo";
import { SuccessCandidate } from "../../components/referral/SuccessCandidate";
import { ConfirmReferral } from "../../components/referral/ConfirmReferral";
import { referCandidateToForm } from "../../api/referralApi";

const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const formatPeriod = (start, end) => {
    const startLabel = formatDate(start);
    if (!startLabel) return "";
    return `${startLabel} - ${end ? formatDate(end) : "Present"}`;
};


const SectionHeader = ({ title }) => (
    <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
    </div>
);

const EmptyState = ({ text }) => (
    <p className="text-sm text-slate-400">{text}</p>
);

export const CandidateProfilePublic = () => {
    const [user, setUser] = useState(null);
    const { id } = useParams();
    const [successCandidate, setSuccessCandidate] = useState(null);
    const [showCandidateInfo, setShowCandidateInfo] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [formId, setFormId] = useState(null);

    const [selected, setSelected] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState("");

    const [localUser] = useState(
        JSON.parse(
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            "{}"
        )
    );

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log(user)
                const response = await getCandidateProfile(id, "public");
                console.log(response)
                if (response.success) {
                    setProfile(response.profile);
                    setUser(response.user);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32 text-slate-500">
                Loading...
            </div>
        );
    }

    const checkForms = () => {
        if (localUser && localUser?.role === "employee") {
            setSelectedCandidate(user);
        }
    }

    // if (!profile) {
    //   return (
    //     <DashboardShell
    //       role="candidate"
    //       roleLabel="Candidate"
    //       sidebar={candidateSidebar}
    //     >
    //       <div className="flex items-center justify-center py-32 text-slate-500">
    //         We couldn't load your profile. Please try again later.
    //       </div>
    //     </DashboardShell>
    //   );
    // }

    const handleRefer = async () => {

        if (!selected) return;

        const candidate = selected;
        console.log("Referring candidate:", candidate);
        setBusyId(candidate._id);
        setError("");


        try {
            const result = await referCandidateToForm(
                formId,
                candidate._id || candidate.id
            );

            setSelected(null);
            setShowCandidateInfo(null);
            setSuccessCandidate(candidate);

            // await loadData();
        } catch (err) {
            setError(err.message || "Referral failed.");
        } finally {
            setBusyId(null);
        }
    };


    const hasLinks = profile.github || profile.linkedin || profile.portfolio;
    const companyName =
        profile.currentCompany && typeof profile.currentCompany === "object"
            ? profile.currentCompany.name
            : null;

    return (
        // 
        <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {/* HEADER */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                <div className="flex items-start gap-5 flex-col sm:flex-row">
                    {user?.photo ? (
                        <img
                            src={user.photo}
                            alt={user.name}
                            className="w-24 h-24 rounded-full object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-3xl font-semibold shrink-0">
                            {user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                {user?.name || "Unnamed Candidate"}
                            </h1>
                            {profile.verificationStatus === "verified" && (
                                <VerificationBadge label="Identity Verified" />
                            )}
                            {profile.verificationStatus === "pending" && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                    Verification Pending
                                </span>
                            )}
                        </div>

                        <p className="text-slate-600 mt-0.5">
                            {profile.headline || (
                                <span className="text-slate-400">No headline added</span>
                            )}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-500">
                            {user?.location && (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> {user.location}
                                </span>
                            )}

                            {(profile.currentPosition || companyName) && (
                                <span className="inline-flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {[profile.currentPosition, companyName]
                                        .filter(Boolean)
                                        .join(" at ")}
                                </span>
                            )}

                            {typeof profile.experienceYears === "number" && (
                                <span className="inline-flex items-center gap-1.5">
                                    {profile.experienceYears}{" "}
                                    {profile.experienceYears === 1 ? "year" : "years"} experience
                                </span>
                            )}
                        </div>
                    </div>

                    {
                        localUser && localUser?.role === "employee" && (
                            <div className="flex gap-2 shrink-0">
                                <button
                                    className="btn-primary text-xs"
                                    data-testid="edit-profile-btn"
                                    onClick={() => checkForms()}
                                >
                                    Refer
                                </button>
                            </div>
                        )
                    }

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* ABOUT */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-slate-900 mb-2">About</h2>
                        {profile.bio ? (
                            <p className="text-sm leading-7 text-slate-600 sm:text-base">
                                {profile.bio}
                            </p>
                        ) : (
                            <EmptyState text="No bio added yet" />
                        )}
                    </div>

                    {/* EXPERIENCE */}
                    <div className="card p-6">
                        <SectionHeader
                            title="Experience"
                            onAdd={() => setAddModal("experience")}
                        />

                        {profile.experience?.length ? (
                            <div className="space-y-4">
                                {profile.experience.map((e) => (
                                    <div key={e._id ?? e.id} className="flex gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">
                                                {e.position}
                                                {e.company && (
                                                    <>
                                                        {" "}
                                                        · <span className="text-slate-600 font-normal">{e.company}</span>
                                                    </>
                                                )}
                                            </p>
                                            {(e.startDate || e.endDate) && (
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {formatPeriod(e.startDate, e.endDate)}
                                                </p>
                                            )}
                                            {e.description && (
                                                <p className="text-sm text-slate-600 mt-1.5">
                                                    {e.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState text="No work experience added yet" />
                        )}
                    </div>

                    {/* EDUCATION */}
                    <div className="card p-6">
                        <SectionHeader
                            title="Education"
                            onAdd={() => setAddModal("education")}
                        />

                        {profile.education?.length ? (
                            <div className="space-y-4">
                                {profile.education.map((ed) => (
                                    <div key={ed._id ?? ed.id} className="flex gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">
                                                {ed.degree}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {[ed.institution, formatPeriod(ed.startDate, ed.endDate)]
                                                    .filter(Boolean)
                                                    .join(" · ")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState text="No education added yet" />
                        )}
                    </div>

                    {/* PROJECTS */}
                    <div className="card p-6">
                        <SectionHeader
                            title="Projects"
                            onAdd={() => setAddModal("project")}
                        />

                        {profile.projects?.length ? (
                            <div>
                                {profile.projects.map((p) => (
                                    <div
                                        key={p._id ?? p.id}
                                        className="pb-3 mb-3 last:pb-0 last:mb-0 border-b border-slate-100 last:border-0"
                                    >
                                        <p className="font-medium text-slate-900 text-sm">
                                            {p.name}
                                        </p>
                                        {p.description && (
                                            <p className="text-sm text-slate-600 mt-0.5">
                                                {p.description}
                                            </p>
                                        )}
                                        {p.technologies?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {p.technologies.map((t) => (
                                                    <span key={t} className="chip-emerald text-xs">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {p.link && (
                                            <a
                                                href={p.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-emerald-600 hover:text-emerald-700 mt-2 inline-block"
                                            >
                                                View project
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState text="No projects added yet" />
                        )}
                    </div>

                    {/* ACHIEVEMENTS */}
                    <div className="card p-6">
                        <SectionHeader
                            title="Achievements"
                            onAdd={() => setAddModal("achievement")}
                        />

                        {profile.achievements?.length ? (
                            <div className="space-y-4">
                                {profile.achievements.map((a) => (
                                    <div key={a._id ?? a.id} className="flex gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">
                                                {a.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {[a.organization, a.year].filter(Boolean).join(" · ")}
                                            </p>
                                            {a.description && (
                                                <p className="text-sm text-slate-600 mt-1.5">
                                                    {a.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState text="No achievements added yet" />
                        )}
                    </div>

                    {/* SKILLS */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-slate-900 mb-3">Skills</h2>
                        {profile.skills?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((s) => (
                                    <span key={s} className="chip-emerald">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <EmptyState text="No skills added yet" />
                        )}
                    </div>
                </div>

                <aside className="space-y-6">
                    {/* VERIFICATION */}
                    <div className="card p-6">
                        <h3 className="font-semibold text-slate-900 mb-3">Verification</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-2 text-slate-600">
                                    <Mail className="w-3.5 h-3.5" /> Email
                                </span>
                                {user?.isEmailVerified ? (
                                    <VerificationBadge label="Verified" />
                                ) : (
                                    <span className="text-xs text-slate-400">Not verified</span>
                                )}
                            </li>
                            {/* <li className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-2 text-slate-600">
                                    <Phone className="w-3.5 h-3.5" /> Phone
                                </span>
                                {user?.isPhoneVerified ? (
                                    <VerificationBadge label="Verified" />
                                ) : (
                                    <span className="text-xs text-slate-400">Not verified</span>
                                )}
                            </li> */}
                            <li className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-2 text-slate-600">
                                    <FileText className="w-3.5 h-3.5" /> Resume
                                </span>
                                {profile.resumeUrl ? (
                                    <VerificationBadge label="Uploaded" />
                                ) : (
                                    <span className="text-xs text-slate-400">Not uploaded</span>
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* CERTIFICATIONS */}
                    <div className="card p-6">
                        <SectionHeader
                            title="Certifications"
                            onAdd={() => setAddModal("certification")}
                        />

                        {profile.certifications?.length ? (
                            <div className="space-y-3">
                                {profile.certifications.map((c) => (
                                    <div key={c._id ?? c.id}>
                                        <p className="text-sm font-medium text-slate-900">
                                            {c.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {[c.issuer, formatDate(c.issueDate)]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </p>
                                        {c.credentialUrl && (
                                            <a
                                                href={c.credentialUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-emerald-600 hover:text-emerald-700"
                                            >
                                                View credential
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState text="No certifications added yet" />
                        )}
                    </div>

                    {/* LINKS */}
                    <div className="card p-6">
                        <h3 className="font-semibold text-slate-900 mb-3">Links</h3>
                        {hasLinks ? (
                            <div className="space-y-1">
                                {profile.github && (
                                    <a
                                        href={`https://${profile.github}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 py-1"
                                    >
                                        <Github className="w-4 h-4" /> {profile.github}
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a
                                        href={`https://${profile.linkedin}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 py-1"
                                    >
                                        <Linkedin className="w-4 h-4" /> {profile.linkedin}
                                    </a>
                                )}
                                {profile.portfolio && (
                                    <a
                                        href={`https://profile.portfolio}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 py-1"
                                    >
                                        <Globe className="w-4 h-4" /> {profile.portfolio}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <EmptyState text="No links added yet" />
                        )}
                    </div>

                    {/* RESUME */}
                    <div className="card p-6 border-emerald-200 bg-emerald-50/40">
                        <h3 className="font-semibold text-slate-900">Resume</h3>
                        {profile.resumeUrl ? (
                            <>
                                {/* <p className="text-xs text-slate-600 mt-1 truncate">
                  {profile.resumeUrl.split("/").pop()}
                </p> */}
                                <div className="flex gap-2 mt-3">
                                    <a
                                        href={`http://localhost:4000/resume/download/${profile.resumeUrl}/${user?.name}`}
                                        // target="_blank"
                                        // rel="noreferrer"
                                        // download={`${user?.name}-resume.pdf`}
                                        className="btn-secondary flex-1 justify-center text-xs inline-flex items-center gap-1.5"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-slate-500 mt-1">No resume uploaded yet</p>
                            </>
                        )}

                    </div>
                </aside>


            </div>

            {selectedCandidate && (
                <CandidateReferModal
                    candidate={user}
                    onClose={() => setSelectedCandidate(null)}
                    setFormId={setFormId}
                    onSuccess={(candidate) => {
                        setSelectedCandidate(null);
                        // setSuccessCandidate(candidate || selectedCandidate);
                        setSelected(user || selectedCandidate)
                        setShowCandidateInfo(null);
                        // loadCandidates();
                    }}
                />
            )}

            {selected && (
                <ConfirmReferral
                    setSelected={setSelected}
                    busyId={busyId}
                    selected={selected}
                    handleRefer={handleRefer}
                />
            )}

            {successCandidate && !showCandidateInfo && (
                <SuccessCandidate
                    successCandidate={successCandidate}
                    setSuccessCandidate={setSuccessCandidate}
                    setShowCandidateInfo={setShowCandidateInfo}
                />
            )}

            {/* Candidate Personal Information Modal */}
            {showCandidateInfo && !successCandidate && (
                <ShowCandidateInfo
                    showCandidateInfo={showCandidateInfo}
                    setShowCandidateInfo={setShowCandidateInfo}
                    setSuccessCandidate={setSuccessCandidate}
                />
            )}
        </div>


    );

};