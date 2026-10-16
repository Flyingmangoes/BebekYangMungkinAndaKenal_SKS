import { BerandaPage } from '@/app/beranda/BerandaPage'
import GuestBeranda from '@/app/guest/GuestBeranda'
import { useAuth } from '@/lib/useAuth'

export function HomeRoute({ forceGuest = false }: { forceGuest?: boolean }) {
  const { isAuthenticated } = useAuth()

  return !forceGuest && isAuthenticated ? <BerandaPage /> : <GuestBeranda />
}
