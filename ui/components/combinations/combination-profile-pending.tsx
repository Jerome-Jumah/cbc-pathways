"use client";

import { Button } from "@/components/ui/button";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface CombinationProfilePendingProps {
  onGenerate: () => void;
  isGenerating: boolean;
  generationError: string | null;
}

export function CombinationProfilePending({
  onGenerate,
  isGenerating,
  generationError,
}: CombinationProfilePendingProps) {
  return (
    <div className="flex flex-col gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 mb-8">
      <div className="flex items-start gap-3">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          size={20}
          className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
        />
        <div className="flex flex-col gap-1 flex-1">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
            Profile insights available on request
          </p>
          <p className="text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            Generate instant AI career pathways, difficulty breakdown, and subject insights for this combination.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1">
        <Button
          size="sm"
          disabled={isGenerating}
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold h-9 px-5 shadow-sm"
          onClick={onGenerate}
        >
          {isGenerating ? "Generating…" : "Generate Profile Insights"}
        </Button>
        {generationError && (
          <span className="text-xs font-semibold text-destructive">{generationError}</span>
        )}
      </div>
    </div>
  );
}
