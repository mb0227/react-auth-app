import API from "./client";

const unwrap = (res) => res?.data?.data;

export async function getProfile() {
  const res = await API.get("/api/user");
  return unwrap(res);
}

export async function getProfileImage() {
  const res = await API.get("/api/user/get-profile-image");
  return unwrap(res);
}

export async function changePassword(payload) {
  const res = await API.post("/api/user/change-password", payload);
  return unwrap(res);
}

export async function saveProfileImageBase64(base64Image) {
  const res = await API.post("/api/user/save-profile-image", { Base64Image: base64Image });
  return unwrap(res);
}

export async function updateUserProfile(formData) {
  const res = await API.patch("/api/user/update-user-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export async function updateUser(payload) {
  const res = await API.put("/api/user/update-user", payload);
  return unwrap(res);
}

export async function deleteAccount() {
  const res = await API.delete("/api/user/delete-account");
  return unwrap(res);
}