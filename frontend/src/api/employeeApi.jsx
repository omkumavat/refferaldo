export const getEmployeeProfile = async (userId) => {
    if (!userId) {
        return { success: false, error: "No user id provided" };
    }

    try {
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await fetch(`${API_URL}/employee/profile/${userId}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            return { success: false, error: `Request failed (${response.status})` };
        }

        const result = await response.json();

        console.log(result)
        return {
            success: true,
            profile: result?.data?.profile ?? null,
        };
    } catch (error) {
        console.error("Error fetching employee profile:", error);
        return { success: false, error: error.message || "Failed to fetch employee profile" };
    }
};

export const updateEmployeeProfile = async (profileId, data) => {
    if (!profileId) {
        return { success: false, error: "No profile id provided" };
    }

    try {
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await fetch(`${API_URL}/employee/profile/${profileId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return { success: false, error: result.message || "Failed to update profile" };
        }

        return { success: true, profile: result.profile };
    } catch (error) {
        console.error("Error updating employee profile:", error);
        return { success: false, error: error.message || "Failed to update profile" };
    }
};