import { env, isProduction } from "../config/env.mjs";
import logger from "../constants/logger.mjs";

type VerifyTurnstileInput = {
  token: string;
};

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(input: VerifyTurnstileInput): Promise<boolean> {
  if (!input.token) return false;
  if (!isProduction && input.token === "dev-turnstile-token") return true;

  if (!env.TURNSTILE_SECRET_KEY) {
    logger.warn("TURNSTILE_SECRET_KEY is not configured; human verification denied.");
    return false;
  }

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: input.token,
  });

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    logger.warn(`Turnstile verification failed with HTTP ${response.status}`);
    return false;
  }

  const result = (await response.json()) as TurnstileResponse;
  if (!result.success) {
    logger.warn("Turnstile verification rejected token", { errors: result["error-codes"] });
  }

  return result.success === true;
}
