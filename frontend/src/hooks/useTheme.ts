import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark' | 'auto'
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  toggleTheme: () => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      resolvedTheme: 'dark',
      setTheme: (theme: 'light' | 'dark' | 'auto') => {
        set({ theme })
        if (theme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          set({ resolvedTheme: prefersDark ? 'dark' : 'light' })
        } else {
          set({ resolvedTheme: theme })
        }
      },
      toggleTheme: () => {
        const { theme, resolvedTheme } = get()
        if (theme === 'auto') {
          const newResolved = resolvedTheme === 'dark' ? 'light' : 'dark'
          set({ theme: newResolved, resolvedTheme: newResolved })
        } else {
          const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
          set({ theme: newTheme, resolvedTheme: newTheme })
        }
      },
    }),
    {
      name: 'netmerge-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            state.resolvedTheme = prefersDark ? 'dark' : 'light'
          } else {
            state.resolvedTheme = state.theme
          }
        }
      },
    }
  )
)