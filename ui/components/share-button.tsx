"use client"

import { Button } from "@/components/ui/button"
import { Share01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ShareButtonProps = {
  title: string
  text?: string
  url?: string
  label?: string
  className?: string
  size?: React.ComponentProps<typeof Button>["size"]
  variant?: React.ComponentProps<typeof Button>["variant"]
}

export function ShareButton({
  title,
  text,
  url,
  label = "Share",
  className,
  size = "default",
  variant = "outline",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url ? new URL(url, window.location.origin).toString() : window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleShare}
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Share01Icon} data-icon="inline-start" />
      {copied ? "Link copied" : label}
    </Button>
  )
}
