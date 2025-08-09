'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { WorkspaceProvider } from '@/contexts/WorkspaceContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navigation from '@/components/Navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <Navigation />
          <main className="min-h-screen bg-bg pt-0">
            {children}
          </main>
        </WorkspaceProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
