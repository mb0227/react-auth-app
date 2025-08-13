let accessTokenMemory = null;

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const LOGOUT_EVENT = "app:logout";

export function getAccessToken() {
  return accessTokenMemory || localStorage.getItem(ACCESS_KEY) || null;
}

export function setAccessToken(token) {
  accessTokenMemory = token || null;
  if (token) localStorage.setItem(ACCESS_KEY, token);
  else localStorage.removeItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || null;
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem(REFRESH_KEY, token);
  else localStorage.removeItem(REFRESH_KEY);
}

export function clearTokens() {
  accessTokenMemory = null;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function broadcastLogout() {
  try {
    localStorage.setItem(LOGOUT_EVENT, String(Date.now()));
    window.dispatchEvent(new Event(LOGOUT_EVENT));
  } catch {}
}

export function onLogout(callback) {
  function storageHandler(e) {
    if (e.key === LOGOUT_EVENT) callback?.();
  }
  function sameTabHandler() {
    callback?.();
  }
  window.addEventListener("storage", storageHandler);
  window.addEventListener(LOGOUT_EVENT, sameTabHandler);
  return () => {
    window.removeEventListener("storage", storageHandler);
    window.removeEventListener(LOGOUT_EVENT, sameTabHandler);
  };
}