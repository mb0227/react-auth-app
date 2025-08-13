import React, { useEffect, useState } from "react";
import {
  getProfile,
  updateUserProfile,
  changePassword,
  saveProfileImageBase64,
  getProfileImage,
  updateUser,
  deleteAccount,
} from "../api/user";
import { useAuth } from "../context/AuthContext";
import { fileToBase64 } from "../utils/fileToBase64";

export default function Home() {
  const { user, setUser, signOut } = useAuth();
  const [loading, setLoading] = useState(!user);
  const [username, setUsername] = useState(user?.username || "");
  const [image, setImage] = useState(null);

  const [profileSaving, setProfileSaving] = useState(false);

  const [pwd, setPwd] = useState({ OldPassword: "", NewPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);

  const [b64File, setB64File] = useState(null);
  const [b64Uploading, setB64Uploading] = useState(false);

  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const [updateAll, setUpdateAll] = useState({ username: "", email: "", password: "" });
  const [updateAllLoading, setUpdateAllLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!user) {
          const u = await getProfile();
          if (!mounted) return;
          setUser(u);
          setUsername(u?.username || "");
          setUpdateAll((s) => ({ ...s, username: u?.username || "", email: u?.email || "" }));
        } else {
          setUsername(user.username || "");
          setUpdateAll((s) => ({ ...s, username: user?.username || "", email: user?.email || "" }));
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user, setUser]);

  const refreshProfileImage = async () => {
    setImageLoading(true);
    try {
      const data = await getProfileImage();
      const url = typeof data === "string" ? data : data?.profileImageUrl || "";
      setProfileImageUrl(url || "");
    } catch {
      setProfileImageUrl("");
    } finally {
      setImageLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    const formData = new FormData();
    formData.append("username", username);
    if (image) formData.append("image", image);
    try {
      const updated = await updateUserProfile(formData);
      alert("Profile updated");
      if (updated?.username) setUser(updated);
      else {
        const fresh = await getProfile();
        setUser(fresh);
      }
      await refreshProfileImage();
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Update failed";
      alert(msg);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    try {
      await changePassword(pwd);
      alert("Password changed");
      setPwd({ OldPassword: "", NewPassword: "" });
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Change password failed";
      alert(msg);
    } finally {
      setPwdLoading(false);
    }
  };

  const handleUploadBase64 = async (e) => {
    e.preventDefault();
    if (!b64File) {
      alert("Select a file first.");
      return;
    }
    setB64Uploading(true);
    try {
      const b64 = await fileToBase64(b64File);
      await saveProfileImageBase64(b64);
      alert("Profile image saved (base64).");
      await refreshProfileImage();
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Upload failed";
      alert(msg);
    } finally {
      setB64Uploading(false);
      setB64File(null);
    }
  };

  const handleUpdateAll = async (e) => {
    e.preventDefault();
    setUpdateAllLoading(true);
    try {
      const updated = await updateUser(updateAll);
      alert("User updated");
      if (updated) setUser(updated);
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Update user failed";
      alert(msg);
    } finally {
      setUpdateAllLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await deleteAccount();
      alert("Account deleted");
      await signOut();
      window.location.replace("/signin");
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Delete account failed";
      alert(msg);
    }
  };

  useEffect(() => {
    refreshProfileImage();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">No user loaded.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Welcome {user.username}</h1>
        <div className="flex gap-4">
          <button className="text-red-600 underline" onClick={handleDeleteAccount}>
            Delete Account
          </button>
          <button className="text-gray-700 underline" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleUpdateProfile} className="border rounded p-4 md:col-span-2">
          <h2 className="font-semibold mb-4">Profile (multipart upload)</h2>
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            value={username}
            className="border p-2 w-full mb-3 rounded"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="block text-sm mb-1">Avatar</label>
          <input
            type="file"
            className="mb-4"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            accept="image/*"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={profileSaving}>
            {profileSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-4">Current Profile Image</h2>
          {imageLoading ? (
            <div>Loading image...</div>
          ) : profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border"
            />
          ) : (
            <div className="text-sm text-gray-500">No image</div>
          )}
          <button className="mt-3 text-blue-600 underline" onClick={refreshProfileImage}>
            Refresh
          </button>
        </div>

        <form onSubmit={handleUploadBase64} className="border rounded p-4">
          <h2 className="font-semibold mb-4">Update Image (base64)</h2>
          <input
            type="file"
            className="mb-3"
            onChange={(e) => setB64File(e.target.files?.[0] || null)}
            accept="image/*"
          />
          <button className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50" disabled={b64Uploading}>
            {b64Uploading ? "Uploading..." : "Save Image"}
          </button>
        </form>

        <form onSubmit={handleChangePassword} className="border rounded p-4">
          <h2 className="font-semibold mb-4">Change Password</h2>
          <label className="block text-sm mb-1">Old Password</label>
          <input
            type="password"
            className="border p-2 w-full mb-3 rounded"
            value={pwd.OldPassword}
            onChange={(e) => setPwd((s) => ({ ...s, OldPassword: e.target.value }))}
          />
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            className="border p-2 w-full mb-4 rounded"
            value={pwd.NewPassword}
            onChange={(e) => setPwd((s) => ({ ...s, NewPassword: e.target.value }))}
          />
          <button className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50" disabled={pwdLoading}>
            {pwdLoading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <form onSubmit={handleUpdateAll} className="border rounded p-4 md:col-span-2">
          <h2 className="font-semibold mb-4">Update User (PUT)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                className="border p-2 w-full mb-3 rounded"
                value={updateAll.username}
                onChange={(e) => setUpdateAll((s) => ({ ...s, username: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="border p-2 w-full mb-3 rounded"
                value={updateAll.email}
                onChange={(e) => setUpdateAll((s) => ({ ...s, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="border p-2 w-full mb-3 rounded"
                value={updateAll.password}
                onChange={(e) => setUpdateAll((s) => ({ ...s, password: e.target.value }))}
              />
            </div>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={updateAllLoading}>
            {updateAllLoading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
}