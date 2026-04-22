import { useEffect, useState } from 'react'

const STEPS = [
  { emoji: '🔍', text: 'Analyzing your problem clarity…' },
  { emoji: '📊', text: 'Evaluating your market understanding…' },
  { emoji: '💰', text: 'Reviewing your business model…' },
  { emoji: '⚙️', text: 'Checking feasibility…' },
  { emoji: '🧠', text: 'Scoring your funding readiness…' },
]

export default function LoadingAnimation() {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [showSlowMessage, setShowSlowMessage] = useState(false)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= STEPS.length) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    const slowTimer = setTimeout(() => {
      setShowSlowMessage(true)
    }, 7000)

    return () => {
      clearInterval(stepInterval)
      clearTimeout(slowTimer)
    }
  }, [])

  return (
    <div className="w-full py-10 px-4 space-y-3">
      {STEPS.map((step, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 text-sm transition-all duration-500 ${
            i < visibleSteps
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="text-base">{step.emoji}</span>
          <span className="text-foreground">{step.text}</span>
        </div>
      ))}
      {showSlowMessage && (
        <p className="text-xs text-muted-foreground pt-2 animate-pulse">
          Still working… this is taking a bit longer than usual
        </p>
      )}
    </div>
  )
}
