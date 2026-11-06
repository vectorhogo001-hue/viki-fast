import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Menu, X, Wifi, Ethernet, Usb, Activity, Settings, Sun, Moon, Wifi as WifiIcon, Monitor, BarChart2, Cpu, Network, WifiOff } from 'lucide-react'
import { HeaderProps } from './types'

export function Header({ theme, onToggleTheme, isConnected, onToggleSidebar, sidebarOpen }: HeaderProps) {
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-14 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))}
          className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <WifiIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-white">NetMerge</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-zinc-300 font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="relative">
          <button
            ref={triggerRef}
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1"
            aria-label="Theme options"
          >
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-zinc-300" />
            ) : theme === 'light' ? (
              <Sun className="w-5 h-5 text-zinc-300" />
            ) : (
              <Monitor className="w-5 h-5 text-zinc-300" />
            )}
          </button>

          {showThemeMenu && (
            <div
              ref={themeMenuRef}
              className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg py-1 z-50 animate-in"
            >
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('theme-change', { detail: 'light' }))}
                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-800 flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('theme-change', { detail: 'dark' }))}
                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-800 flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('theme-change', { detail: 'auto' }))}
                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-800 flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header