import { useState } from 'react'
import type { InputData } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface InputCardProps {
  onSubmit: (data: InputData) => void
}

const STAGES = ['Idea', 'MVP', 'Early Traction', 'Growing'] as const

export default function InputCard({ onSubmit }: InputCardProps) {
  const [description, setDescription] = useState('')
  const [stage, setStage] = useState<InputData['stage']>('Idea')
  const [traction, setTraction] = useState('')

  const isValid = description.trim().length >= 80

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    onSubmit({
      description: description.trim(),
      stage,
      traction: traction.trim() || undefined,
    })
  }

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Textarea
              placeholder="Describe your startup in 2–3 sentences…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.trim().length} / 80 min characters
            </p>
          </div>

          <Select value={stage} onValueChange={(v) => setStage(v as InputData['stage'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select your stage" />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Any traction? (users, revenue, pilots, etc.)"
            value={traction}
            onChange={(e) => setTraction(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={!isValid}>
              Check my chances
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Takes ~10 seconds. No signup required.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
