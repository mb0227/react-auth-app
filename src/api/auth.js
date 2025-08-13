import API from "./client";

const unwrap = (res) => res?.data?.data;

export function signUp(payload) {
  return API.post("/api/auth/signup", payload);
}

export function signIn(payload) {
  return API.post("/api/auth/signin", payload);
}

export function verifyOtp({ email, otp }) {
  return API.post("/api/auth/verify-otp", { email, otp });
}

export function resendOtp({ email }) {
  return API.post("/api/auth/resend-otp", { email });
}

export function forgotPassword({ email }) {
  return API.post("/api/auth/forgot-password", { email });
}

export function resetPassword({ email, password, otp }) {
  return API.post("/api/auth/reset-password", { email, password, otp });
}

export async function googleLogin() {
  const res = await API.get("/api/auth/google/login");
  return unwrap(res);
}

export async function googleCallback({ code, state }) {
  const res = await API.post("/api/auth/google/callback", null, {
    params: { code, state },
  });
  return res;
}