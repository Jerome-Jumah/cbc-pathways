"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

type TurnstileWidgetProps = {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  className?: string
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function TurnstileWidget({ onVerify, onExpire, onError, className }: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const [loading, setLoading] = useState(Boolean(siteKey))

  useEffect(() => {
    if (!siteKey || !ref.current) return

    const render = () => {
      if (!ref.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onError,
        theme: "auto",
      })
      setLoading(false)
    }

    if (window.turnstile) {
      render()
      return
    }

    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    script.defer = true
    script.onload = render
    script.onerror = () => {
      setLoading(false)
      onError?.()
    }
    document.head.appendChild(script)

    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    }
  }, [onError, onExpire, onVerify])

  if (!siteKey) {
    return (
      <div className={cn("rounded-xl border border-border bg-muted p-4", className)}>
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Human verification is running in development mode.
        </p>
        <Button type="button" onClick={() => onVerify("dev-turnstile-token")} className="rounded-xl font-bold">
          Continue
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      {loading && <p className="text-sm font-medium text-muted-foreground">Loading verification…</p>}
      <div ref={ref} />
    </div>
  )
}
