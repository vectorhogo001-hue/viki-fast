import { useEffect, useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { AdaptersView } from './components/AdaptersView'
import { HistoryView } from './components/HistoryView'
import { SettingsView } from './components/SettingsView'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { useTheme } from './hooks/useTheme'
import { useStats } from './hooks/useStats'
import { useAdapters } from './hooks/useAdapters'
import { AppConfig } from './types'

function App() {
  const { toggleTheme, resolvedTheme } = useTheme()
  const [activeView, setActiveView] = useState<'dashboard' | 'adapters' | 'history' | 'settings'>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { stats, isConnected } = useStats()
  const { adapters, updateAdapter, refreshAdapters } = useAdapters()
  const [config, setConfig] = useState<AppConfig>({
    scheduler_mode: 'weighted',
    ipv6_policy: 'auto',
    mtu: 9000,
    socks5_enabled: false,
    adapters: [],
    theme: 'auto',
    auto_start: false,
    auto_pause: true,
  })

  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  const handleConfigChange = (key: string, value: unknown) => {
    setConfig(prev => ({ ...prev, [key]: value }))
    // In a real app, this would call the backend
    console.log(`Config updated: ${key} =`, value)
  }

  return (
    <div className={`h-full flex flex-col bg-zinc-950 text-zinc-50 ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
      <Header
        theme={resolvedTheme}
        onToggleTheme={toggleTheme}
        isConnected={isConnected}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {activeView === 'dashboard' && (
            <Dashboard
              stats={stats as any}
              adapters={adapters}
              isConnected={isConnected}
            />
          )}
          {activeView === 'adapters' && (
            <AdaptersView
              adapters={adapters}
              onUpdateAdapter={updateAdapter}
              onRefresh={refreshAdapters}
            />
          )}
          {activeView === 'history' && (
            <HistoryView />
          )}
          {activeView === 'settings' && (
            <SettingsView
              config={config}
              onConfigChange={handleConfigChange}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App