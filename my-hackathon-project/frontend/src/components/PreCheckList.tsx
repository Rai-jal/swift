import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DEFAULT_CHECKLIST = [
  'Problem Clarity — What exact problem are you solving? Who has it? How urgent is it?',
  'Target Customer — A specific user persona, not "everyone" or "small businesses"',
  'Solution Specificity — What exactly does your product do? How is it different?',
  'Market Validation Evidence — Any real signal: interviews, waitlist, pilot users, early usage',
  'Product Stage — What has actually been built?',
]

interface PreCheckListProps {
  checklist?: string[]
  onEdit: () => void
}

export default function PreCheckList({ checklist, onEdit }: PreCheckListProps) {
  const items = checklist && checklist.length > 0 ? checklist : DEFAULT_CHECKLIST

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold leading-snug">
          You're not ready to be scored yet — but here's exactly what to figure out first.
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                {i + 1}
              </span>
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <Button variant="outline" className="w-full mt-2" onClick={onEdit}>
          Edit my description
        </Button>
      </CardContent>
    </Card>
  )
}
