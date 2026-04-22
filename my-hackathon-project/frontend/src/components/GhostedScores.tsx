const GHOSTED_SCORES = [
  '62% match — weak traction',
  '81% — strong problem, weak team',
  '47% — too early for this program',
  '73% — market timing is right',
  '55% — needs more validation',
]

export default function GhostedScores() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {GHOSTED_SCORES.map((score, i) => (
        <span
          key={i}
          className="absolute text-foreground/[0.06] font-semibold text-sm whitespace-nowrap"
          style={{
            top: `${10 + i * 18}%`,
            left: `${(i % 2 === 0 ? -5 : 15) + i * 8}%`,
            transform: `rotate(${i % 2 === 0 ? -3 : 2}deg)`,
          }}
        >
          {score}
        </span>
      ))}
    </div>
  )
}
