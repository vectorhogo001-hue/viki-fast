import { useEffect } from 'react'
import { LayoutDashboard, Wifi, History, Settings, ChevronRight, Wifi as WifiIcon, Ethernet, Usb, Activity, X } from 'lucide-react'
import { cn } from '../utils/cn'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'adapters', label: 'Adapters', icon: Wifi },
  { id: 'history', label: 'History', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

type NavItemId = typeof navItems[number]['id']

export function Sidebar({ open, activeView, onViewChange, isConnected }: {
  open: boolean
  activeView: NavItemId
  onViewChange: (view: NavItemId) => void
  isConnected: boolean
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.dispatchEvent(new CustomEvent('toggle-sidebar'))
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!open) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-16 bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-800 transition-all duration-300">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))}
              className="w-full p-2 rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center"
              aria-label="Expand sidebar"
            >
              <LayoutDashboard className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-800 transition-all duration-300 flex flex-col">
      <div className="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
        <nav className="space-y-1" role="navigation" aria-label="Main navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as NavItemId)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                activeView === item.id
                  ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-500'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-zinc-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-800/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                <WifiIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-400 truncate">Status</p>
                <p className="text-sm font-semibold text-white">Active</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2 rounded-xl bg-zinc-800/50 text-center">
                <p className="text-2xl font-bold text-white">2</p>
                <p className="text-xs text-zinc-400">Active</p>
              </div>
              <div className="px-3 py-2 rounded-xl bg-zinc-800/50 text-center">
                <p className="text-2xl font-bold text-white">85</p>
                <p className="text-xs text-zinc-400">Flows</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))}
            className="w-full p-2 rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200"
            aria-label="Collapse sidebar"
          >
            <ChevronRight className="w-5 h-5" />
            <span className="text-sm font-medium">Collapse</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar