import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { hasAuthTokens } from '@/lib/api'
import { AuthContext } from '@/lib/authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthTokens)

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(hasAuthTokens())
    window.addEventListener('sks:auth-change', syncAuthState)
    return () => window.removeEventListener('sks:auth-change', syncAuthState)
  }, [])

  const value = useMemo(() => ({ isAuthenticated, setIsAuthenticated }), [isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
