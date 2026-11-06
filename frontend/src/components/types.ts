export interface SidebarProps {
  open: boolean
  activeView: 'dashboard' | 'adapters' | 'history' | 'settings'
  onViewChange: (view: 'dashboard' | 'adapters' | 'history' | 'settings') => void
  isConnected: boolean
}

export interface HeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  isConnected: boolean
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export interface DashboardProps {
  stats: any
  adapters: any[]
  isConnected: boolean
}

export interface AdaptersViewProps {
  adapters: any[]
  onUpdateAdapter: (config: any) => void
  onRefresh: () => void
}

export interface HistoryViewProps {}

export interface SettingsViewProps {
  config: any
  onConfigChange: (key: string, value: unknown) => void
}

export interface AdapterCardProps {
  adapter: any
}

export interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean
}