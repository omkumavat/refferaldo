
import { useEffect, useRef, useState } from "react";
import { Camera, X, Upload, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function ProfilePhotoUpload({
    user,
    setUser,
}) {
    console.log(user);
    
    const fileInputRef = useRef(null);

    const [preview, setPreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Revoke temporary preview URLs to prevent memory leaks.
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const openFilePicker = () => {
        if (!uploading) fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        // Allow selecting the same file again later.
        event.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image.");
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG and WebP images are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5 MB.");
            return;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const closeModal = () => {
        if (uploading) return;

        setPreview("");
        setSelectedFile(null);
    };

    const handleUpload = async () => {
        if (!selectedFile || uploading) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("photo", selectedFile);

            // Adapt this token key to your existing login implementation.

            const response = await fetch(
                `${API_BASE_URL}/api/candidate/upload/profile-photo/${user._id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Photo upload failed.");
            }

            // Assumes the backend returns { user: { photo: "..." } }.
            const updatedPhoto = data.user?.photo || data.photo;

            if (!updatedPhoto) {
                throw new Error("Server did not return the updated photo.");
            }

            // Update the current page.
            setUser((previousUser) => ({
                ...previousUser,
                ...data.user,
                avatar: updatedPhoto,
            }));


            // Keep stored user data in sync.
            ["localStorage", "sessionStorage"].forEach((storageName) => {
                const storage = window[storageName];
                const storedUser = storage.getItem("user");

                if (storedUser) {
                    const user = JSON.parse(storedUser);

                    storage.setItem(
                        "user",
                        JSON.stringify({
                            ...user,
                            avatar: updatedPhoto,
                        })
                    );
                }
            });

            toast.success("Profile photo updated successfully.");
            setPreview("");
            setSelectedFile(null);
        } catch (error) {
            toast.error(error.message || "Unable to upload photo.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Profile image */}
            <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                aria-label="Change profile photo"
                className="group relative block h-24 w-24 shrink-0 overflow-hidden rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
                {user?.avatar ? (
                    <img
                        src={`http://localhost:4000${user.avatar}`}
                        alt={user.name || "Profile"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-3xl font-semibold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                )}

                {/* Camera overlay */}
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100 group-focus-visible:bg-black/40 group-focus-visible:opacity-100">
                    <Camera size={27} strokeWidth={1.8} />
                </span>
            </button>

            {/* Preview modal */}
            {preview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") closeModal();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="photo-modal-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2
                                id="photo-modal-title"
                                className="text-lg font-semibold text-slate-900"
                            >
                                Update profile photo
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={uploading}
                                aria-label="Close preview"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center">
                            <img
                                src={preview}
                                alt="Selected profile photo preview"
                                className="h-48 w-48 rounded-full border-4 border-slate-100 object-cover shadow-sm"
                            />

                            <p className="mt-4 max-w-full truncate text-sm text-slate-500">
                                {selectedFile?.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                JPG, PNG or WebP · Maximum 5 MB
                            </p>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={uploading}
                                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {uploading ? (
                                    <>
                                        <LoaderCircle
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={17} />
                                        Save photo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
