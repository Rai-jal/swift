import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  onRetry: () => void
  onEdit: () => void
}

export default function ErrorState({ onRetry, onEdit }: ErrorStateProps) {
  return (
    <div className="w-full py-10 px-4 text-center space-y-5">
      <p className="text-foreground text-base">
        We couldn't complete your analysis this time. This might be a temporary issue — let's try again.
      </p>
      <div className="flex gap-3 justify-center">
        <Button onClick={onRetry}>Try again</Button>
        <Button variant="outline" onClick={onEdit}>Edit my input</Button>
      </div>
    </div>
  )
}
