import { jwtDecode } from "jwt-decode";

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser ? localStorage.setItem("accessToken", value) : null;

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser ? localStorage.setItem("refreshToken", value) : null;

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const decodeToken = (token: string) => {
  return jwtDecode(token);
};
