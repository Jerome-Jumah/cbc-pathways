import type { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/index.mjs";
import logger from "../constants/logger.mjs";
import {
  createAnonymousSession,
  getSessionFromCookie,
  setSessionCookie,
  type AnonymousSession,
} from "../services/session.service.mjs";

export type RequestWithSession = Request & {
  anonymousSession?: AnonymousSession;
};

export function attachAnonymousSession(req: RequestWithSession, res: Response, next: NextFunction) {
  const existing = getSessionFromCookie(req.headers.cookie);
  if (existing) {
    req.anonymousSession = existing;
    next();
    return;
  }

  const session = createAnonymousSession();
  req.anonymousSession = session;
  setSessionCookie(res, session);
  next();
}

export function requireHumanVerification(req: RequestWithSession, res: Response, next: NextFunction) {
  if (req.anonymousSession?.verifiedHuman) {
    next();
    return;
  }

  logger.warn("Human verification required for protected endpoint", {
    path: req.originalUrl,
    method: req.method,
    hasCookieHeader: Boolean(req.headers.cookie),
    hasSession: Boolean(req.anonymousSession),
    verifiedHuman: req.anonymousSession?.verifiedHuman === true,
  });

  res.status(STATUS_CODES.FORBIDDEN).json({
    success: false,
    code: "HUMAN_VERIFICATION_REQUIRED",
    message: "Please verify you are human before continuing.",
  });
}

export function requireHumanVerificationForGeneration(req: RequestWithSession, res: Response, next: NextFunction) {
  if (req.query.generate === "true") {
    requireHumanVerification(req, res, next);
    return;
  }

  next();
}
