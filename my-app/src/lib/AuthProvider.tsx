import { useMemo, useState, type ReactNode } from 'react'

import { AuthContext } from '@/lib/authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const value = useMemo(() => ({ isAuthenticated, setIsAuthenticated }), [isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
