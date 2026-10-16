import { useCallback, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { BottomNav } from '@/components/layout/BottomNav'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { CURRENT_USER } from '@/lib/userProfile'

export function AppLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  const handleNavigate = useCallback(
    (path: string) => {
      void navigate(path)
    },
    [navigate],
  )

  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar
        activePath={pathname}
        onNavigate={handleNavigate}
        userFullName={CURRENT_USER.fullName}
        userModeLabel={CURRENT_USER.modeLabel}
        weekRhythmLabel={CURRENT_USER.weekRhythmLabel}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          userName={CURRENT_USER.name}
          energyLabel={CURRENT_USER.energyLabel}
          moodLabel={CURRENT_USER.moodLabel}
          locationLabel={CURRENT_USER.locationLabel}
          temperatureLabel={CURRENT_USER.temperatureLabel}
          onBreathClick={() => {
            handleNavigate('/quest')
          }}
          onCompanionClick={() => {
            handleNavigate('/refleksi')
          }}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-12">
          <Outlet />
        </main>
      </div>

      <BottomNav activePath={pathname} onNavigate={handleNavigate} />
    </div>
  )
}
