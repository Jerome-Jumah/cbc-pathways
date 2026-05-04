import type { NextFunction, Response } from "express";
import { z } from "zod";
import { STATUS_CODES } from "../constants/index.mjs";
import type { RequestWithSession } from "../middleware/session.mjs";
import { createAnonymousSession, setSessionCookie } from "../services/session.service.mjs";
import { verifyTurnstileToken } from "../services/turnstile.service.mjs";

const verifyHumanBodySchema = z.object({
  token: z.string().min(1),
});

export function initSession(req: RequestWithSession, res: Response) {
  const session = req.anonymousSession ?? createAnonymousSession();
  setSessionCookie(res, session);

  res.status(STATUS_CODES.SUCCESS).json({
    success: true,
    data: {
      sessionId: session.sessionId,
      verifiedHuman: session.verifiedHuman === true,
    },
  });
}

export async function verifyHuman(req: RequestWithSession, res: Response, next: NextFunction) {
  try {
    const { token } = verifyHumanBodySchema.parse(req.body);
    const verified = await verifyTurnstileToken({ token });

    if (!verified) {
      res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        code: "HUMAN_VERIFICATION_FAILED",
        message: "Human verification failed. Please try again.",
      });
      return;
    }

    const session = req.anonymousSession ?? createAnonymousSession();
    session.verifiedHuman = true;
    session.humanVerifiedAt = new Date().toISOString();
    setSessionCookie(res, session);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      data: {
        verifiedHuman: true,
      },
    });
  } catch (error) {
    next(error);
  }
}
