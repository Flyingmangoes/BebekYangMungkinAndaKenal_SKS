import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseCopyToClipboardResult {
  copiedKey: string | null
  copy: (text: string, key: string) => Promise<void>
}

export function useCopyToClipboard(resetAfterMs = 2000): UseCopyToClipboardResult {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const copy = useCallback(
    async (text: string, key: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopiedKey(key)
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => {
          setCopiedKey(null)
        }, resetAfterMs)
      } catch {
        setCopiedKey(null)
      }
    },
    [resetAfterMs],
  )

  return { copiedKey, copy }
}
