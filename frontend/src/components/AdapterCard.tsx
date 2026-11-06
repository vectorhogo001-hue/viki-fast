import { useState } from 'react'
import { Wifi, Ethernet, Usb, Loader2, Minus, Plus, CheckCircle2, AlertCircle, ExternalLink, ChevronDown } from 'lucide-react'
import { cn, formatBytes, formatSpeed } from '../../utils/cn'
import { AdapterStats } from '../../types'

interface AdapterCardProps {
  adapter: AdapterStats
}

export function AdapterCard({ adapter }: AdapterCardProps) {
  const [expanded, setExpanded] = useState(false)
  const typeIcons = {
    wifi: Wifi,
    ethernet: Ethernet,
    tether: Usb,
    unknown: Wifi,
  }
  const TypeIcon = typeIcons[adapter.type] || Wifi

  const getHealthColor = () => {
    if (!adapter.healthy) return 'text-red-400'
    if (adapter.speed_rx > 1024 * 1024 * 20) return 'text-green-400'
    if (adapter.speed_rx > 1024 * 1024 * 5) return 'text-yellow-400'
    return 'text-zinc-400'
  }

  return (
    <div className="card p-4 space-y-4 transition-all duration-200 hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            adapter.type === 'wifi' && 'bg-blue-500/20 text-blue-400',
            adapter.type === 'ethernet' && 'bg-green-500/20 text-green-400',
            adapter.type === 'tether' && 'bg-amber-500/20 text-amber-400',
            adapter.type === 'unknown' && 'bg-zinc-500/20 text-zinc-400'
          )}>
            <adapter.type === 'wifi' && <Wifi className="w-5 h-5" />}
            {adapter.type === 'ethernet' && <Ethernet className="w-5 h-5" />}
            {adapter.type === 'tether' && <Usb className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{adapter.name}</p>
            <p className="text-xs text-zinc-500 truncate">{adapter.type} • {adapter.mac}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'w-2 h-2 rounded-full',
            adapter.healthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          )} />
          <span className={cn('text-xs font-medium', adapter.healthy ? 'text-green-400' : 'text-red-400')}>
            {adapter.healthy ? 'Healthy' : 'Unhealthy'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
        <div className="text-center">
          <p className="text-2xl font-bold text-white tabular-nums">{formatSpeed(adapter.speed_rx)}</p>
          <p className="text-xs text-zinc-400">↓ Download</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white tabular-nums">{formatSpeed(adapter.speed_tx)}</p>
          <p className="text-xs text-zinc-400">↑ Upload</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white tabular-nums">{adapter.flows}</p>
          <p className="text-xs text-zinc-400">Flows</p>
        </div>
      </div>

      <details className="group space-y-3">
        <summary className="flex items-center justify-between cursor-pointer list-none p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
          <span className="text-sm font-medium text-zinc-300">Details</span>
          <ChevronDown className="w-4 h-4 text-zinc-500 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-800/30 rounded-lg space-y-2">
          <DetailRow label="IPv4" value={adapter.ipv4 || '—'} />
          <DetailRow label="IPv6" value={adapter.ipv6 || '—'} />
          <DetailRow label="MAC" value={adapter.mac} />
          <DetailRow label="Type" value={adapter.type} />
          <DetailRow label="Weight" value={adapter.weight.toFixed(1)} />
          <DetailRow label="Speed Limit" value={adapter.speed_limit > 0 ? formatSpeed(adapter.speed_limit) : 'Unlimited'} />
          <DetailRow label="IPv6" value={adapter.ipv6_enabled ? 'Enabled' : 'Disabled'} />
          <DetailRow label="Total RX" value={formatBytes(adapter.rx)} />
          <DetailRow label="Total TX" value={formatBytes(adapter.tx)} />
        </div>
      </details>
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

export default AdapterCard