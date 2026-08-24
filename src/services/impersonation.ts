import { ImpersonateResponse } from "../types/user";

const IMPERSONATION_KEY = "dt_impersonation";

export interface ImpersonationSession {
  accessToken: string;
  expiresAt: number;
  user: ImpersonateResponse["user"];
}

// Decode a JWT and read its `exp` claim (seconds since epoch), without verifying the signature
export const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

// Treats a token that fails to decode as expired (fail closed).
export const isTokenExpired = (token: string): boolean => {
  const expiresAt = getTokenExpiry(token);
  if (expiresAt === null) return true;
  return Date.now() >= expiresAt;
};

export const startImpersonation = (response: ImpersonateResponse): void => {
  const expiresAt = getTokenExpiry(response.accessToken) ?? Date.now();
  const session: ImpersonationSession = {
    accessToken: response.accessToken,
    expiresAt,
    user: response.user,
  };
  sessionStorage.setItem(IMPERSONATION_KEY, JSON.stringify(session));
};

export const clearImpersonation = (): void => {
  sessionStorage.removeItem(IMPERSONATION_KEY);
};

// Returns the active impersonation session, or null if none exists / it has expired
// (clearing the stored session as a side effect when expired).
export const getActiveImpersonation = (): ImpersonationSession | null => {
  const raw = sessionStorage.getItem(IMPERSONATION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as ImpersonationSession;
    if (!session.accessToken || Date.now() >= session.expiresAt) {
      clearImpersonation();
      return null;
    }
    return session;
  } catch {
    clearImpersonation();
    return null;
  }
};
