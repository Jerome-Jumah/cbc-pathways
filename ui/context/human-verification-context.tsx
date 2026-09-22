"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError, apiPost } from "@/lib/api/client";

export interface VerificationPromptOptions {
  title?: string;
  description?: string;
  onSuccess?: () => void | Promise<void>;
}

export interface HumanVerificationContextType {
  isHumanVerified: boolean;
  isVerifying: boolean;
  verificationError: string | null;
  verifyHuman: (token: string) => Promise<boolean>;
  resetVerificationError: () => void;
  // Prompt modal state and actions
  isPromptOpen: boolean;
  promptTitle: string;
  promptDescription: string;
  openVerificationPrompt: (options?: VerificationPromptOptions) => void;
  closeVerificationPrompt: () => void;
}

const HumanVerificationContext = createContext<HumanVerificationContextType | null>(null);

const DEFAULT_TITLE = "Human Verification Required";
const DEFAULT_DESCRIPTION = "Please complete the verification below before continuing.";

export function HumanVerificationProvider({ children }: { children: ReactNode }) {
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promptTitle, setPromptTitle] = useState(DEFAULT_TITLE);
  const [promptDescription, setPromptDescription] = useState(DEFAULT_DESCRIPTION);
  const [onSuccessCallback, setOnSuccessCallback] = useState<
    (() => void | Promise<void>) | null
  >(null);

  // Initialize anonymous session once at app root
  useEffect(() => {
    let mounted = true;
    void apiPost<{ success: boolean; data: { verifiedHuman: boolean } }>("/session/init", {})
      .then((res) => {
        if (mounted && res?.data?.verifiedHuman !== undefined) {
          setIsHumanVerified(Boolean(res.data.verifiedHuman));
        }
      })
      .catch(() => {
        // Public browsing continues uninterrupted; protected endpoints prompt on demand
      });

    return () => {
      mounted = false;
    };
  }, []);

  const verifyHuman = useCallback(
    async (token: string): Promise<boolean> => {
      setIsVerifying(true);
      setVerificationError(null);
      try {
        const res = await apiPost<{ success: boolean; data: { verifiedHuman: boolean } }>(
          "/security/verify-human",
          { token },
        );
        const verified = Boolean(res?.data?.verifiedHuman);
        setIsHumanVerified(verified);

        if (verified) {
          setIsPromptOpen(false);
          if (onSuccessCallback) {
            const cb = onSuccessCallback;
            setOnSuccessCallback(null);
            await cb();
          }
        } else {
          setVerificationError("Human verification failed. Please try again.");
        }
        return verified;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Human verification failed. Please try again.";
        setVerificationError(message);
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [onSuccessCallback],
  );

  const resetVerificationError = useCallback(() => {
    setVerificationError(null);
  }, []);

  const openVerificationPrompt = useCallback((options?: VerificationPromptOptions) => {
    setPromptTitle(options?.title ?? DEFAULT_TITLE);
    setPromptDescription(options?.description ?? DEFAULT_DESCRIPTION);
    setOnSuccessCallback(options?.onSuccess ? () => options.onSuccess! : null);
    setVerificationError(null);
    setIsPromptOpen(true);
  }, []);

  const closeVerificationPrompt = useCallback(() => {
    setIsPromptOpen(false);
    setOnSuccessCallback(null);
    setVerificationError(null);
  }, []);

  const value = useMemo(
    () => ({
      isHumanVerified,
      isVerifying,
      verificationError,
      verifyHuman,
      resetVerificationError,
      isPromptOpen,
      promptTitle,
      promptDescription,
      openVerificationPrompt,
      closeVerificationPrompt,
    }),
    [
      isHumanVerified,
      isVerifying,
      verificationError,
      verifyHuman,
      resetVerificationError,
      isPromptOpen,
      promptTitle,
      promptDescription,
      openVerificationPrompt,
      closeVerificationPrompt,
    ],
  );

  return (
    <HumanVerificationContext.Provider value={value}>
      {children}
    </HumanVerificationContext.Provider>
  );
}

export function useHumanVerification(): HumanVerificationContextType {
  const context = useContext(HumanVerificationContext);
  if (!context) {
    throw new Error("useHumanVerification must be used within a HumanVerificationProvider");
  }
  return context;
}
