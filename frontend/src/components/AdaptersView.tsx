import { useState } from 'react'
import { Wifi, Ethernet, Usb, Loader2, Minus, Plus, CheckCircle2, AlertCircle, ExternalLink, SlidersHorizontal, ToggleLeft, ToggleRight } from 'lucide-react'
import { cn, formatBytes, formatSpeed } from '../../utils/cn'
import { AdapterStats, AdapterConfig } from '../../types'

interface AdaptersViewProps {
  adapters: any[]
  onUpdateAdapter: (config: AdapterConfig) => void
  onRefresh: () => void
}

export function AdaptersView({ adapters, onUpdateAdapter, onRefresh }: AdaptersViewProps) {
  const [editingAdapter, setEditingAdapter] = useState<string | null>(null)
  const [localConfigs, setLocalConfigs] = useState<Record<string, AdapterConfig>>({})

  const adapterConfigs = adapters.map(ad => ({
    name: ad.name,
    weight: ad.weight,
    speed_limit: ad.speed_limit,
    ipv6_enabled: ad.ipv6_enabled,
    enabled: ad.healthy,
  }))

  return (
    <div className="flex-1 overflow-hidden p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Network Adapters</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage network adapters, weights, and speed limits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={false}
            className="btn-secondary flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {adapters.map(adapter => (
          <AdapterRow
            key={adapter.name}
            adapter={adapter}
            isEditing={editingAdapter === adapter.name}
            onEdit={() => setEditingAdapter(adapter.name)}
            onSave={config => {
              setEditingAdapter(null)
              onUpdateAdapter(config)
            }}
            onCancel={() => setEditingAdapter(null)}
          />
        ))}

        {adapters.length === 0 && (
          <div className="card p-12 text-center">
            <Loader2 className="w-12 h-12 text-zinc-500 animate-spin mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No network adapters detected</p>
            <p className="text-zinc-500 text-sm mt-2">Connect a network interface to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

function AdapterRow({
  adapter,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: {
  adapter: any
  isEditing: boolean
  onEdit: () => void
  onSave: (config: any) => void
  onCancel: () => void
}) {
  const [localConfig, setLocalConfig] = useState({
    weight: adapter.weight,
    speed_limit: adapter.speed_limit,
    ipv6_enabled: adapter.ipv6_enabled,
    enabled: adapter.healthy,
  })

  const handleSave = () => {
    onSave({
      name: adapter.name,
      ...localConfig,
    })
  }

  if (isEditing) {
    return (
      <div className="card p-4 space-y-4 border-primary-500/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">{adapter.name}</p>
              <p className="text-xs text-zinc-400">Editing configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleSave} className="btn-primary text-sm">
              Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="label">Weight</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={localConfig.weight}
              onChange={e => setLocalConfig(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none accent-primary-500"
            />
            <div className="flex justify-between text-xs text-zinc-400">
              <span>0.1</span>
              <span className="font-medium">{localConfig.weight.toFixed(1)}</span>
              <span>3.0</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">Speed Limit</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="1048576"
                value={localConfig.speed_limit}
                onChange={e => setLocalConfig(prev => ({ ...prev, speed_limit: parseInt(e.target.value) || 0 }))}
                className="input w-32"
                placeholder="0 = unlimited"
              />
              <span className="text-zinc-400 text-sm">bytes/s (0 = unlimited)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">IPv6</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localConfig.ipv6_enabled}
                onChange={e => setLocalConfig(prev => ({ ...prev, ipv6_enabled: e.target.checked }))}
                className="w-4 h-4 rounded border-zinc-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-zinc-300">Enable IPv6</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">Enabled</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localConfig.enabled}
                onChange={e => setLocalConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="w-4 h-4 rounded border-zinc-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-zinc-300">Enable this adapter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="text-white font-medium truncate max-w-[120px] text-right">{value}</span>
    </div>
  )
}

export default AdaptersView