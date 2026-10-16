import type { LucideIcon } from 'lucide-react'
import {
  CircleCheck,
  Compass,
  House,
  PenLine,
  Smile,
  TrendingUp,
  User,
} from 'lucide-react'

export type NavItemId =
  | 'beranda'
  | 'eksplorasi'
  | 'quest'
  | 'refleksi'
  | 'insight'
  | 'profil'

export interface NavItem {
  id: NavItemId
  label: string
  path: string
  icon: LucideIcon
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'beranda', label: 'Beranda', path: '/', icon: House },
  { id: 'eksplorasi', label: 'Eksplorasi', path: '/eksplorasi', icon: Compass },
  { id: 'quest', label: 'Quest Hari Ini', path: '/quest', icon: CircleCheck },
  { id: 'refleksi', label: 'Refleksi', path: '/refleksi', icon: PenLine },
  { id: 'insight', label: 'Pola & Insight', path: '/insight', icon: TrendingUp },
  { id: 'profil', label: 'Profil', path: '/profil', icon: User },
]

export type BottomNavItemId = 'beranda' | 'checkin' | 'quest' | 'jurnal' | 'eksplor'

export interface BottomNavItem {
  id: BottomNavItemId
  label: string
  path: string
  icon: LucideIcon
}

export const BOTTOM_NAV_ITEMS: readonly BottomNavItem[] = [
  { id: 'beranda', label: 'Beranda', path: '/', icon: House },
  { id: 'checkin', label: 'Check-In', path: '/check-in', icon: Smile },
  { id: 'quest', label: 'Quest', path: '/quest', icon: CircleCheck },
  { id: 'jurnal', label: 'Jurnal', path: '/refleksi', icon: PenLine },
  { id: 'eksplor', label: 'Eksplor', path: '/eksplorasi', icon: Compass },
]
