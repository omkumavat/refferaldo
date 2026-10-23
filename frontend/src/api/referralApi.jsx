export const getReferralById = async (id) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/referrals/${id}`, {
      credentials: "include",
    });
    const result = await res.json();
    if (!res.ok || !result.success) return { success: false, error: result.message };
    return { success: true, job: result.data };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

export const updateReferral = async (id, data) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/referrals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result.success) return { success: false, error: result.message };
    return { success: true, job: result.data.job };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getPublicReferralForm = async (slug) => {
  const response = await fetch(
    `${API_BASE_URL}/referrals/public/${slug}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load referral form");
  }

  return data;
};

// Submit an application for the referral
export const submitReferralApplication = async (
  slug,
  formData
) => {
  const response = await fetch(
    `${API_BASE_URL}/referrals/submit/${slug}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit application");
  }

  return data;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(url, options = {}) {
  const response = await fetch(`${API}${url}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

// export const getFormAnalytics = (formId) =>
//   request(`/referrals/submit/${formId}/analytics`);

export const getFormSubmissions = (formId, filters = {}) => {
  const params = new URLSearchParams(filters);
  return request(
    `/referrals/submit/${formId}/submissions?${params}`
  );
};

export const getBestMatches = (formId) =>
  request(`/referrals/submit/${formId}/best-matches`);

export const updateSubmissionStatus = (submissionId, status) =>
  request(`/referrals/submit/${submissionId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const referCandidate = (submissionId) =>
  request(`/referrals/submit/${submissionId}/refer`, {
    method: "POST",
    body: JSON.stringify({}),
  });

export const getMostReferredCandidates = () =>
  request("/referrals/submit/candidates/most-referred");

export const getAvailableReferralForms = (userId, candidateId) =>
  request(`/referrals/submit/referral-forms/available/${userId}/${candidateId}`);

export const referCandidateToForm = (formId, candidateId) =>
  request(
    `/referrals/submit/referral-forms/${encodeURIComponent(formId)}/refer/${encodeURIComponent(candidateId)}`,
    { method: "POST" }
  );