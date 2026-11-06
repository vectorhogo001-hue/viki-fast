import { useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Wifi, Loader2, Activity } from 'lucide-react'
import { formatBytes } from '@/utils/cn'
import { StatsSnapshot } from '@/types'
import { Speedometer } from './Speedometer'
import { FlowDistribution } from './FlowDistribution'
import { AdapterCard } from './AdapterCard'

interface DashboardProps {
  stats: StatsSnapshot | null
  adapters: any[]
  isConnected: boolean
}

export function Dashboard({ stats, adapters, isConnected }: DashboardProps) {
  if (!isConnected || !stats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
          <p className="text-zinc-400 text-lg">Connecting to NetMerge...</p>
          <p className="text-zinc-500 text-sm">Make sure net-merge is running</p>
        </div>
      </div>
    )
  }

  const totalSpeed = useMemo(() => {
    const rx = adapters.reduce((sum, a) => sum + a.speed_rx, 0)
    const tx = adapters.reduce((sum, a) => sum + a.speed_tx, 0)
    return { rx, tx }
  }, [adapters])

  const totalFlows = useMemo(() =>
    adapters.reduce((sum, a) => sum + a.flows, 0), [adapters])

  const healthyAdapters = adapters.filter(a => a.healthy).length
  const totalAdapters = adapters.length

  const flowData = useMemo(() => {
    const total = adapters.reduce((sum, a) => sum + a.flows, 0)
    return adapters.map(a => ({
      name: a.name,
      value: total > 0 ? (a.flows / total) * 100 : 0,
      color: a.type === 'wifi' ? '#3b82f6' : a.type === 'ethernet' ? '#22c55e' : '#f59e0b',
    }))
  }, [adapters])

  return (
    <div className="flex-1 overflow-hidden p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time network monitoring & load balancing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-400">Live</span>
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Download"
          value={`${formatBytes(totalSpeed.rx)}/s`}
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          trend="+12%"
          trendUp
        />
        <StatCard
          label="Total Upload"
          value={`${formatBytes(totalSpeed.tx)}/s`}
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
          trend="+8%"
          trendUp
        />
        <StatCard
          label="Active Flows"
          value={totalFlows.toString()}
          icon={<Activity className="w-5 h-5 text-purple-400" />}
          trend={`${healthyAdapters}/${adapters.length} healthy`}
          trendUp={true}
        />
        <StatCard
          label="Active Adapters"
          value={`${healthyAdapters}/${adapters.length}`}
          icon={<Wifi className="w-5 h-5 text-yellow-400" />}
          trend={healthyAdapters === adapters.length ? 'All healthy' : `${totalAdapters - healthyAdapters} issues`}
          trendUp={healthyAdapters === adapters.length}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Speedometer & Flow Distribution */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Speedometer
              download={totalSpeed.rx}
              upload={totalSpeed.tx}
            />
            <FlowDistribution data={flowData} />
          </div>

          {/* Adapter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adapters.map(adapter => (
              <AdapterCard key={adapter.name} adapter={adapter} />
            ))}
          </div>
        </div>

        {/* Latency & History Charts */}
        <div className="lg:col-span-1 space-y-4">
          <LatencyChart />
          <BandwidthHistoryChart />
        </div>
      </div>
    </div>
  )
}

// Sub-components
function StatCard({ label, value, icon, trend, trendUp }: {
  label: string
  value: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean
}) {
  return (
    <div className="card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-sm font-medium">{label}</span>
        <span className="p-2 rounded-lg bg-primary-500/10">{icon}</span>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <span className={`text-xs font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
          {trendUp ? '↑' : '↓'} {trend} vs last hour
        </span>
      </div>
    </div>
  )
}

function LatencyChart() {
  // Mock latency data
  const data = Array.from({ length: 20 }, (_, i) => ({
    time: `${(i * 3) % 60}m`,
    wifi: 12 + Math.random() * 8,
    ethernet: 3 + Math.random() * 4,
    tether: 25 + Math.random() * 15,
  }))

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Latency (ms)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWifi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEthernet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTether" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
            <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#27272a',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)} ms`, '']}
            />
            <Legend />
            <Area type="monotone" dataKey="wifi" stroke="#3b82f6" fill="url(#colorWifi)" strokeWidth={2} />
            <Area type="monotone" dataKey="ethernet" stroke="#22c55e" fill="url(#colorEthernet)" strokeWidth={2} />
            <Area type="monotone" dataKey="tether" stroke="#f59e0b" fill="url(#colorTether)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function BandwidthHistoryChart() {
  // Mock history data
  const data = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    download: Math.floor(Math.random() * 1024 * 1024 * 50) + 1024 * 1024 * 10,
    upload: Math.floor(Math.random() * 1024 * 1024 * 10) + 1024 * 1024 * 2,
  }))

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">24h Bandwidth History</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis dataKey="hour" type="category" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#27272a',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [formatBytes(value) + '/s', '']}
            />
            <Legend />
            <Bar dataKey="download" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="upload" fill="#22c55e" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard