import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/UserContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import CharAvatar from "../../components/cards/CharAvatar";
import Input from "../../components/Inputs/Input";
import { toast } from "react-hot-toast";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import { LuCamera } from "react-icons/lu";

const Profile = () => {
    useUserAuth();

    const { user, updateUser, clearUser } = useContext(UserContext);

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showEmailConfirm, setShowEmailConfirm] = useState(false);

    // Password
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Profile image
    const [profileImageLoading, setProfileImageLoading] = useState(false);

    const navigate = useNavigate();

    // Keep form values synchronized with UserContext
    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setEmail(user.email || "");
        }
    }, [user]);

    // EDIT PROFILE
    const handleEdit = () => {
        setFullName(user?.fullName || "");
        setEmail(user?.email || "");
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setFullName(user?.fullName || "");
        setEmail(user?.email || "");
        setIsEditing(false);
    };

    const handleUpdateProfile = async () => {
        const updates = {};

        if (fullName.trim() !== user.fullName) {
            updates.fullName = fullName.trim();
        }

        if (email.trim() !== user.email) {
            updates.email = email.trim();
        }

        if (Object.keys(updates).length === 0) {
            toast("Nothing is changed");
            return;
        }

        try {
            setLoading(true);

            const response = await axiosInstance.patch(
                API_PATHS.AUTH.UPDATE_PROFILE,
                updates
            );

            const emailChanged = !!updates.email;

            setIsEditing(false);

            if (emailChanged) {
                localStorage.removeItem("token");
                clearUser();

                toast.success(
                    "Email changed. Please verify your new email."
                );

                navigate("/login");
                return;
            }

            updateUser(response.data.user);

            toast.success(response.data.msg);

        } catch (err) {
            console.log("UPDATE PROFILE ERROR:", err);
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            console.log("BACKEND MESSAGE:", err.backendMessage);

            toast.error(
                err.response?.data?.msg ||
                err.backendMessage ||
                "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSaveClick = () => {
        const emailChanged = email.trim() !== user.email;

        if (emailChanged) {
            setShowEmailConfirm(true);
            return;
        }

        handleUpdateProfile();
    };


    // PROFILE IMAGE
    const handleProfileImageChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        try {
            setProfileImageLoading(true);

            const formData = new FormData();
            formData.append("image", file);

            // Upload image
            const response = await axiosInstance.post(
                API_PATHS.IMAGE.UPLOAD_IMAGE,
                formData
            );

            const imageUrl = response.data.imageUrl;

            // Save image URL to user profile
            const profileResponse = await axiosInstance.patch(
                API_PATHS.AUTH.UPDATE_PROFILE_IMAGE,
                formData
            );

            updateUser(profileResponse.data.user);

            toast.success(
                "Profile picture updated successfully"
            );

        } catch (err) {
            console.error(
                "PROFILE IMAGE UPDATE ERROR:",
                err
            );

            toast.error(
                err.response?.data?.msg ||
                err.backendMessage ||
                "Failed to update profile picture"
            );
        } finally {
            setProfileImageLoading(false);

            // Allows selecting the same image again
            e.target.value = "";
        }
    };

    // CHANGE PASSWORD

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Password confirmation failed!");
            return;
        }

        try {
            setPasswordLoading(true);

            const response = await axiosInstance.patch(
                API_PATHS.AUTH.CHANGE_PASSWORD,
                {
                    currentPassword,
                    newPassword,
                }
            );

            toast.success(response.data.msg);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowChangePassword(false);

            // Logout after password change
            localStorage.removeItem("token");
            clearUser();

            navigate("/login");

        } catch (err) {
            console.log(
                "CHANGE PASSWORD ERROR:",
                err
            );

            toast.error(
                err.response?.data?.msg ||
                err.backendMessage ||
                "Failed to change password"
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleCancelPasswordChange = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowChangePassword(false);
    };

    return (
        <DashboardLayout activeMenu="Profile">

            <div className="my-5 max-w-3xl mx-auto">

                {/* Page Header */}
                <h2 className="text-2xl font-semibold text-gray-800">
                    Profile
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Manage your personal information and account security.
                </p>

                {/* Profile Card */}
                <div className="card mt-6">

                    {/* PROFILE IMAGE */}

                    <div className="flex flex-col items-center">

                        <div className="relative group w-28 h-28">

                            {user?.profileImageUrl ? (
                                <img
                                    src={user.profileImageUrl}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-full object-cover"
                                />
                            ) : (
                                <CharAvatar
                                    fullName={user?.fullName}
                                    width="w-28"
                                    height="h-28"
                                    style="text-3xl"
                                />
                            )}

                            {/* Hover Overlay */}
                            <label
                                htmlFor="profile-image-upload"
                                className={`
                                    absolute inset-0
                                    w-28 h-28
                                    rounded-full
                                    flex items-center justify-center
                                    bg-black/50
                                    text-white
                                    cursor-pointer
                                    transition-opacity
                                    ${
                                        profileImageLoading
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100"
                                    }
                                `}
                            >
                                {profileImageLoading ? (
                                    <span className="text-xs font-medium">
                                        Uploading...
                                    </span>
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <LuCamera size={24} />
                                        <span className="text-xs font-medium">
                                            Change
                                        </span>
                                    </div>
                                )}
                            </label>

                            <input
                                id="profile-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfileImageChange}
                                disabled={profileImageLoading}
                            />

                        </div>

                        <h3 className="text-lg font-semibold mt-3">
                            {user?.fullName}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {user?.email}
                        </p>

                    </div>

                    {/* PERSONAL INFORMATION */}

                    <div className="mt-8">

                        {!isEditing ? (

                            <div>

                                <h3 className="text-lg font-medium">
                                    Personal Information
                                </h3>

                                <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Full Name
                                        </p>

                                        <p className="text-sm font-medium text-gray-800 mt-1">
                                            {user?.fullName}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-xs text-gray-500">
                                            Email Address
                                        </p>

                                        <p className="text-sm font-medium text-gray-800 mt-1">
                                            {user?.email}
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="add-btn add-btn-fill mt-5"
                                >
                                    Edit Profile
                                </button>

                            </div>

                        ) : (

                            <div>

                                <h3 className="text-lg font-medium">
                                    Edit Profile
                                </h3>

                                {/* Full Name */}
                                <div className="mt-5">

                                    <Input
                                        value={fullName}
                                        onChange={({ target }) =>
                                            setFullName(target.value)
                                        }
                                        label="Full Name"
                                        placeholder="Enter your full name"
                                        type="text"
                                    />

                                </div>

                                {/* Email */}
                                <div className="mt-4">

                                    <Input
                                        value={email}
                                        onChange={({ target }) =>
                                            setEmail(target.value)
                                        }
                                        label="Email Address"
                                        placeholder="Enter your email address"
                                        type="email"
                                    />

                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 mt-6">

                                    <button
                                        type="button"
                                        onClick={handleSaveClick}
                                        disabled={loading}
                                        className="add-btn add-btn-fill"
                                    >
                                        {loading
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="add-btn"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* SECURITY */}

                    <div className="mt-10 pt-8 border-t border-gray-200">

                        <h3 className="text-lg font-semibold text-gray-800">
                            Security
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage your password and account security.
                        </p>

                        {!showChangePassword ? (

                            <div className="flex items-center justify-between gap-4 mt-5 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">

                                <div>
                                    <h4 className="text-sm font-medium text-gray-800">
                                        Change Password
                                    </h4>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Update your password to keep your
                                        account secure.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowChangePassword(true)
                                    }
                                    className="add-btn add-btn-fill"
                                >
                                    Change Password
                                </button>

                            </div>

                        ) : (

                            <div className="mt-5 p-5 rounded-lg border border-gray-200 bg-gray-50">

                                <h4 className="text-base font-semibold text-gray-800">
                                    Change Password
                                </h4>

                                <p className="text-xs text-gray-500 mt-1 mb-5">
                                    Enter your current password and choose
                                    a new one.
                                </p>

                                <div className="space-y-4">

                                    <Input
                                        value={currentPassword}
                                        onChange={({ target }) =>
                                            setCurrentPassword(target.value)
                                        }
                                        label="Current Password"
                                        placeholder="Enter your current password"
                                        type="password"
                                    />

                                    <Input
                                        value={newPassword}
                                        onChange={({ target }) =>
                                            setNewPassword(target.value)
                                        }
                                        label="New Password"
                                        placeholder="Enter your new password"
                                        type="password"
                                    />

                                    <p className="text-xs text-gray-500 -mt-2">
                                        Minimum 8 characters with at least
                                        1 uppercase letter, 1 number,
                                        and 1 special character.
                                    </p>

                                    <Input
                                        value={confirmPassword}
                                        onChange={({ target }) =>
                                            setConfirmPassword(target.value)
                                        }
                                        label="Confirm New Password"
                                        placeholder="Confirm your new password"
                                        type="password"
                                    />

                                </div>

                                {/* Warning */}
                                <div className="mt-5 rounded-lg bg-amber-50 border border-amber-200 p-3">

                                    <p className="text-xs text-amber-700 leading-5">
                                        For your security, you will be logged
                                        out after changing your password.
                                        You will need to log in again using
                                        your new password.
                                    </p>

                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 mt-6">

                                    <button
                                        type="button"
                                        onClick={handleCancelPasswordChange}
                                        disabled={passwordLoading}
                                        className="add-btn"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleChangePassword}
                                        disabled={passwordLoading}
                                        className="add-btn add-btn-fill"
                                    >
                                        {passwordLoading
                                            ? "Changing..."
                                            : "Change Password"}
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>

                </div>

                {/* EMAIL CHANGE CONFIRMATION */}

                <Modal
                    isOpen={showEmailConfirm}
                    onClose={() => setShowEmailConfirm(false)}
                    title="Change Email Address"
                >

                    <div className="flex justify-center mb-4">

                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <span className="text-2xl">
                                ⚠️
                            </span>
                        </div>

                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                        Change Email Address?
                    </h3>

                    <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">

                        <p className="text-sm text-amber-800 leading-6">
                            Your current email address will no longer be
                            verified. After changing it, you will be logged
                            out and you'll need to verify your new email
                            address before you can log in again.
                        </p>

                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-5">
                        Are you sure you want to continue?
                    </p>

                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            type="button"
                            onClick={() =>
                                setShowEmailConfirm(false)
                            }
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 dark:text-white dark:hover:bg-slate-900 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowEmailConfirm(false);
                                handleUpdateProfile();
                            }}
                            className="px-5 py-2.5 rounded-lg bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors shadow-sm"
                        >
                            Yes, Change Email
                        </button>

                    </div>

                </Modal>

            </div>

        </DashboardLayout>
    );
};

export default Profile;