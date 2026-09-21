"use client";

import { TurnstileWidget } from "@/components/security/turnstile-widget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHumanVerification } from "@/context/human-verification-context";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function HumanVerificationDialog() {
  const {
    isPromptOpen,
    closeVerificationPrompt,
    promptTitle,
    promptDescription,
    verifyHuman,
    isVerifying,
    verificationError,
  } = useHumanVerification();

  return (
    <Dialog open={isPromptOpen} onOpenChange={(open) => !open && closeVerificationPrompt()}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <HugeiconsIcon icon={ShieldCheckIcon} size={24} />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {promptTitle}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-muted-foreground">
            {promptDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 pt-2">
          <TurnstileWidget
            onVerify={verifyHuman}
            className="w-full"
          />

          {isVerifying && (
            <p className="text-xs font-medium text-muted-foreground">
              Verifying session…
            </p>
          )}

          {verificationError && (
            <p className="text-xs font-semibold text-destructive text-center">
              {verificationError}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
