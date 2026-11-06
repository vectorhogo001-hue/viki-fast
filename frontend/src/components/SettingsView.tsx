import { useState } from 'react'
import { Save, Loader2, Palette, Zap, Globe, Cpu, HardDrive, Shield, Key, Bell, Monitor, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SettingsViewProps {
  config: any
  onConfigChange: (key: string, value: unknown) => void
}

export function SettingsView({ config, onConfigChange }: SettingsViewProps) {
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'network' | 'scheduler' | 'appearance' | 'advanced'>('general')

  const tabs = [
    { id: 'general', label: 'General', icon: Save },
    { id: 'network', label: 'Network', icon: Globe },
    { id: 'scheduler', label: 'Scheduler', icon: Cpu },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Shield },
  ] as const

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaving(false)
    console.log('Settings saved:', config)
  }

  return (
    <div className="flex-1 overflow-hidden p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Configure NetMerge GUI preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="lg:w-48 flex-shrink-0">
          <nav className="space-y-1" role="tablist" aria-label="Settings categories">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-500'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                )}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto space-y-6">
          {activeTab === 'general' && <GeneralSettings config={config} onChange={onConfigChange} />}
          {activeTab === 'network' && <NetworkSettings config={config} onChange={onConfigChange} />}
          {activeTab === 'scheduler' && <SchedulerSettings config={config} onChange={onConfigChange} />}
          {activeTab === 'appearance' && <AppearanceSettings config={config} onChange={onConfigChange} />}
          {activeTab === 'advanced' && <AdvancedSettings config={config} onChange={onConfigChange} />}
        </main>
      </div>
    </div>
  )
}

function GeneralSettings({ config, onChange }: { config: any; onChange: (key: string, value: unknown) => void }) {
  return (
    <div className="space-y-6">
      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Save className="w-5 h-5" />
          General
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="Start at Login"
            description="Automatically start NetMerge when you sign in"
            type="toggle"
            checked={config.auto_start}
            onChange={v => onChange('auto_start', v)}
          />

          <SettingItem
            label="Auto-pause when single connection"
            description="Automatically pause balancing when only one connection is available"
            type="toggle"
            checked={config.auto_pause}
            onChange={v => onChange('auto_pause', v)}
          />

          <SettingItem
            label="Theme"
            description="Choose color theme"
            type="select"
            value={config.theme}
            options={[
              { value: 'auto', label: 'Auto (System)' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
            onChange={v => onChange('theme', v)}
          />
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="New Version Available"
            description="Notify when a new version is available"
            type="toggle"
            checked={true}
            onChange={v => console.log('notify_update', v)}
          />

          <SettingItem
            label="Connection Changes"
            description="Notify when network adapters are added or removed"
            type="toggle"
            checked={true}
            onChange={v => console.log('notify_connections', v)}
          />

          <SettingItem
            label="Speed Threshold Alerts"
            description="Notify when speed drops below threshold"
            type="toggle"
            checked={false}
            onChange={v => console.log('notify_speed', v)}
          />
        </div>
      </section>
    </div>
  )
}

function NetworkSettings({ config, onChange }: { config: any; onChange: (key: string, value: unknown) => void }) {
  return (
    <div className="space-y-6">
      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Globe className="w-5 h-5" />
          IPv6 Policy
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="IPv6 Policy"
            description="How to handle IPv6 connections when adapters have different IPv6 support"
            type="select"
            value={config.ipv6_policy}
            options={[
              { value: 'auto', label: 'Auto - Use IPv6 only when all adapters support it' },
              { value: 'on', label: 'Force On - Always use IPv6 when available' },
              { value: 'off', label: 'Force Off - Disable IPv6, use IPv4 only' },
            ]}
            onChange={v => onChange('ipv6_policy', v)}
          />
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          SOCKS5 Proxy
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="Enable SOCKS5 Proxy"
            description="Run a SOCKS5 proxy on 127.0.0.1:1080 for per-app routing"
            type="toggle"
            checked={config.socks5_enabled}
            onChange={v => onChange('socks5_enabled', v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingItem
              label="Proxy Host"
              type="input"
              value="127.0.0.1"
              placeholder="127.0.0.1"
              onChange={v => console.log('proxy_host', v)}
            />
            <SettingItem
              label="Proxy Port"
              type="input"
              value="1080"
              placeholder="1080"
              inputType="number"
              onChange={v => console.log('proxy_port', v)}
            />
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          MTU Settings
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="Virtual Adapter MTU"
            description="Maximum Transmission Unit for the virtual adapter (higher = less CPU, but may cause fragmentation)"
            type="select"
            value={config.mtu}
            options={[
              { value: '1500', label: '1500 (Standard)' },
              { value: '9000', label: '9000 (Jumbo Frames - Recommended)' },
            ]}
            onChange={v => onChange('mtu', parseInt(v))}
          />
        </div>
      </section>
    </div>
  )
}

function SchedulerSettings({ config, onChange }: { config: any; onChange: (key: string, value: unknown) => void }) {
  return (
    <div className="space-y-6">
      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Scheduling Algorithm
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="Scheduling Algorithm"
            description="How new connections are distributed across adapters"
            type="select"
            value={config.scheduler_mode}
            options={[
              { value: 'weighted', label: 'Weighted - Distribute by adapter capacity (recommended)' },
              { value: 'lowest', label: 'Lowest - Send to least busy adapter' },
            ]}
            onChange={v => onChange('scheduler_mode', v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingItem
              label="Flow Timeout (seconds)"
              description="Time before idle TCP flow is considered closed"
              type="input"
              value="2"
              inputType="number"
              min="1"
              max="60"
              onChange={v => console.log('flow_timeout', v)}
            />
            <SettingItem
              label="Health Check Interval (seconds)"
              description="How often to probe adapters for internet connectivity"
              type="input"
              value="1"
              inputType="number"
              min="1"
              max="10"
              onChange={v => console.log('health_interval', v)}
            />
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Speed Limits (Token Bucket)
        </h3>

        <p className="text-zinc-400 text-sm">
          Configure per-adapter speed limits. Limits apply to both download and upload.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 space-y-2">
              <h4 className="font-medium text-white">Wi-Fi</h4>
              <div className="space-y-2">
                <label className="label">Download Limit (MB/s)</label>
                <input type="number" min="0" step="1" className="input" placeholder="0 = unlimited" />
                <label className="label">Upload Limit (MB/s)</label>
                <input type="number" min="0" step="1" className="input" placeholder="0 = unlimited" />
              </div>
            </div>
            <div className="card p-4 space-y-2">
              <h4 className="font-medium text-white">Ethernet</h4>
              <div className="space-y-2">
                <label className="label">Download Limit (MB/s)</label>
                <input type="number" min="0" step="1" className="input" placeholder="0 = unlimited" />
                <label className="label">Upload Limit (MB/s)</label>
                <input type="number" min="0" step="1" className="input" placeholder="0 = unlimited" />
              </div>
            </div>
            <div className="card p-4 space-y-2">
              <h4 className="font-medium text-white">USB Tether</h4>
              <div className="space-y-2">
                <label className="label">Download Limit (MB/s)</label>
                <input type="number" min="0" step="1" className="input" placeholder="0 = unlimited" value="5" />
                <label className="label">Upload Limit (MB/s)</label>
                <input type="number" min="0" step="1" className="input" placeholder="0 = unlimited" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AppearanceSettings({ config, onChange }: { config: any; onChange: (key: string, value: unknown) => void }) {
  return (
    <div className="space-y-6">
      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="Color Theme"
            description="Choose the color theme for the application"
            type="select"
            value={config.theme}
            options={[
              { value: 'auto', label: 'Auto (Follow System)' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
            onChange={v => onChange('theme', v)}
          />

          <SettingItem
            label="Accent Color"
            description="Primary accent color for the UI"
            type="select"
            value="blue"
            options={[
              { value: 'blue', label: 'Blue' },
              { value: 'green', label: 'Green' },
              { value: 'purple', label: 'Purple' },
              { value: 'orange', label: 'Orange' },
              { value: 'red', label: 'Red' },
            ]}
            onChange={v => console.log('accent_color', v)}
          />
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Dashboard Layout
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="Default View"
            description="Which view to show on startup"
            type="select"
            value="dashboard"
            options={[
              { value: 'dashboard', label: 'Dashboard' },
              { value: 'adapters', label: 'Adapters' },
              { value: 'history', label: 'History' },
            ]}
            onChange={v => console.log('default_view', v)}
          />

          <SettingItem
            label="Show Speedometer"
            type="toggle"
            checked={true}
            onChange={v => console.log('show_speedometer', v)}
          />

          <SettingItem
            label="Show Flow Distribution"
            type="toggle"
            checked={true}
            onChange={v => console.log('show_flow_dist', v)}
          />

          <SettingItem
            label="Show Latency Chart"
            type="toggle"
            checked={true}
            onChange={v => console.log('show_latency', v)}
          />

          <SettingItem
            label="Chart Refresh Rate"
            type="select"
            value="500"
            options={[
              { value: '250', label: '250ms (Fast)' },
              { value: '500', label: '500ms (Default)' },
              { value: '1000', label: '1s (Slow)' },
              { value: '2000', label: '2s (Minimal)' },
            ]}
            onChange={v => console.log('chart_refresh', v)}
          />
        </div>
      </section>

      <section className="card p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Key className="w-5 h-5" />
          Data & Privacy
        </h3>

        <div className="space-y-4">
          <SettingItem
            label="Data Retention"
            description="How long to keep history data"
            type="select"
            value="30"
            options={[
              { value: '7', label: '7 days' },
              { value: '30', label: '30 days' },
              { value: '90', label: '90 days' },
              { value: '365', label: '1 year' },
            ]}
            onChange={v => console.log('data_retention', v)}
          />

          <SettingItem
            label="Anonymous Usage Statistics"
            description="Help improve NetMerge by sending anonymous usage data"
            type="toggle"
            checked={false}
            onChange={v => console.log('analytics', v)}
          />

          <div className="pt-4 border-t border-zinc-800">
            <button className="btn-danger w-full" onClick={() => console.log('clear_data')}>
              Clear All History Data
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function AdvancedSettings({ config: _config, onChange: _onChange }: { config: any; onChange: (key: string, value: unknown) => void }) {
  return (
    <div className="space-y-6">
      <section className="card p-6 space-y-6 border-zinc-700/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 text-amber-400">
          <Shield className="w-5 h-5" />
          Danger Zone
        </h3>

        <p className="text-zinc-400 text-sm">
          These settings can affect system stability. Only change if you know what you're doing.
        </p>

        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <SettingItem
            label="Debug Logging"
            description="Enable verbose logging for troubleshooting"
            type="toggle"
            checked={false}
            onChange={v => console.log('debug_logging', v)}
          />

          <SettingItem
            label="Enable pprof Profiler"
            description="Expose Go pprof endpoint on localhost:6060"
            type="toggle"
            checked={false}
            onChange={v => console.log('pprof', v)}
          />

          <SettingItem
            label="Custom Wintun Path (Windows)"
            description="Path to wintun.dll if not in standard location"
            type="input"
            value=""
            placeholder="C:\\path\\to\\wintun.dll"
            onChange={v => console.log('wintun_path', v)}
          />
        </div>
      </section>

      <section className="card p-6 space-y-6 border-red-500/20">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          Reset & Uninstall
        </h3>

        <p className="text-zinc-400 text-sm">
          These actions are irreversible. Use with caution.
        </p>

        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <button className="btn-secondary w-full justify-start" onClick={() => console.log('reset_config')}>
            Reset All Settings to Defaults
          </button>
          <button className="btn-danger w-full justify-start" onClick={() => console.log('uninstall')}>
            Uninstall NetMerge GUI
          </button>
        </div>
      </section>
    </div>
  )
}

interface SettingItemProps {
  label: string
  description?: string
  type: 'toggle' | 'select' | 'input'
  value?: string | number
  checked?: boolean
  options?: Array<{ value: string; label: string }>
  onChange?: (value: any) => void
  inputType?: string
  min?: string
  max?: string
  placeholder?: string
}

function SettingItem({
  label,
  description,
  type,
  value,
  checked,
  options,
  onChange,
  inputType,
  min,
  max,
  placeholder,
}: SettingItemProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (onChange) {
      if (type === 'toggle') {
        onChange((e.target as HTMLInputElement).checked)
      } else {
        onChange(e.target.value)
      }
    }
  }

  return (
    <div className="space-y-1">
      <label className="label">{label}</label>
      {description && <p className="text-xs text-zinc-500">{description}</p>}
      {type === 'toggle' && (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      )}
      {type === 'select' && (
        <select
          value={value}
          onChange={handleChange}
          className="input max-w-xs"
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
      {type === 'input' && (
        <input
          type={inputType || 'text'}
          value={value}
          onChange={handleChange}
          className="input max-w-xs"
          placeholder={placeholder}
          min={min}
          max={max}
        />
      )}
    </div>
  )
}

export default SettingsView