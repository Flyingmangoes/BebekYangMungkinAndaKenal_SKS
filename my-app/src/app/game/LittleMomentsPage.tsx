import { ArrowLeft } from 'lucide-react'

import { LittleMoments } from '@/app/game/little-moments'
import { LinkButton } from '@/components/ui/LinkButton'

export function LittleMomentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <LinkButton to="/quest" variant="ghost" size="sm" icon={ArrowLeft} className="self-start">
        Kembali ke Quest
      </LinkButton>
      <LittleMoments />
    </div>
  )
}
