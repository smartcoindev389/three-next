interface Payload {
  exp: number;
}

const getTokenPayload = (token: string | null): Payload | null => {
  if (!token) return null;

  const parts = token.split(".");

  if (parts.length !== 3) return null;

  try {
    return JSON.parse(atob(parts[1]));
  } catch (e) {
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  const payload = getTokenPayload(token);
  const exp = payload?.exp;

  if (!exp) return true;

  return Date.now() > exp * 1000;
};

export const isTokenExpiringSoon = (token: string | null): boolean => {
  const payload = getTokenPayload(token);

  if (!payload || !payload.exp) return true;

  const expiry = payload.exp * 1000;
  const now = Date.now();

  return expiry - now < 10 * 60 * 1000;
};
