import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
import type { Response } from "express";
import { env, isProduction } from "../config/env.mjs";

export type AnonymousSession = {
  sessionId: string;
  createdAt: string;
  verifiedHuman?: boolean;
  humanVerifiedAt?: string;
};

export const SESSION_COOKIE_NAME = "cbc_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const DEV_SECRET = "cbc-pathways-development-session-secret-change-in-production";

function key() {
  return createHash("sha256").update(env.SESSION_SECRET ?? DEV_SECRET).digest();
}

function base64url(input: Buffer) {
  return input.toString("base64url");
}

function unbase64url(input: string) {
  return Buffer.from(input, "base64url");
}

export function createAnonymousSession(): AnonymousSession {
  return {
    sessionId: randomUUID(),
    createdAt: new Date().toISOString(),
    verifiedHuman: false,
  };
}

export function encryptSession(session: AnonymousSession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [base64url(iv), base64url(tag), base64url(encrypted)].join(".");
}

export function decryptSession(cookieValue: string | undefined): AnonymousSession | null {
  if (!cookieValue) return null;

  try {
    const [ivValue, tagValue, encryptedValue] = cookieValue.split(".");
    if (!ivValue || !tagValue || !encryptedValue) return null;

    const decipher = createDecipheriv("aes-256-gcm", key(), unbase64url(ivValue));
    decipher.setAuthTag(unbase64url(tagValue));
    const decrypted = Buffer.concat([decipher.update(unbase64url(encryptedValue)), decipher.final()]).toString("utf8");
    const parsed = JSON.parse(decrypted) as AnonymousSession;

    if (!parsed.sessionId || !parsed.createdAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function parseCookie(header: string | undefined, name: string) {
  if (!header) return undefined;
  const cookies = header.split(";").map(cookie => cookie.trim());
  const match = cookies.find(cookie => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function getSessionFromCookie(header: string | undefined) {
  return decryptSession(parseCookie(header, SESSION_COOKIE_NAME));
}

export function setSessionCookie(res: Response, session: AnonymousSession) {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(encryptSession(session))}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];

  if (isProduction) parts.push("Secure");

  res.setHeader("Set-Cookie", parts.join("; "));
}
