import type { ComponentType } from 'react'

export interface LittleMomentsProps {
  initialLevelId?: string
  onLevelComplete?: (levelId: string) => void
  className?: string
}

export const LittleMoments: ComponentType<LittleMomentsProps>
export default LittleMoments
