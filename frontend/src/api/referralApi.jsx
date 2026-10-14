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
  referralId,
  answers
) => {
  const response = await fetch(
    `${API_BASE_URL}/referral-submissions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referralId,
        answers,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit application");
  }

  return data;
};
