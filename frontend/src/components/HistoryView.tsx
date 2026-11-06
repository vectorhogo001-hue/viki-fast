import { useMemo, useState } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Calendar, TrendingUp, Download, Upload, Clock, Activity } from 'lucide-react'
import { formatSpeed } from '@/utils/cn'
import { HistoryPoint } from '@/types'

export function HistoryView() {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h')
  const [metric, setMetric] = useState<'bandwidth' | 'latency' | 'flows'>('bandwidth')

  // Mock data for different time ranges
  const historyData = useMemo(() => generateMockHistory(timeRange), [timeRange])

  const currentData = useMemo(() => {
    switch (metric) {
      case 'bandwidth':
        return historyData.map(d => ({
          time: d.time,
          download: d.download,
          upload: d.upload,
        }))
      case 'latency':
        return historyData.map(d => ({
          time: d.time,
          wifi: d.wifi_latency,
          ethernet: d.ethernet_latency,
          tether: d.tether_latency,
        }))
      case 'flows':
        return historyData.map(d => ({
          time: d.time,
          wifi: d.wifi_flows,
          ethernet: d.ethernet_flows,
          tether: d.tether_flows,
        }))
    }
  }, [historyData, metric])

  const stats = useMemo(() => {
    const downloads = historyData.map(d => d.download)
    const uploads = historyData.map(d => d.upload)
    const latencies = historyData.map(d => d.wifi_latency)
    return {
      avgDownload: downloads.reduce((a, b) => a + b, 0) / downloads.length,
      peakDownload: Math.max(...downloads),
      avgUpload: uploads.reduce((a, b) => a + b, 0) / uploads.length,
      peakUpload: Math.max(...uploads),
      avgLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
    }
  }, [historyData])

  const renderChart = () => {
    if (metric === 'bandwidth') {
      return (
        <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={60}
            tickFormatter={v => formatSpeed(v) + '/s'} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#27272a',
              border: '1px solid #3f3f46',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [formatSpeed(value) + '/s', '']}
          />
          <Legend />
          <Area type="monotone" dataKey="download" stroke="#22c55e" fill="url(#colorDownload)" strokeWidth={2} />
          <Area type="monotone" dataKey="upload" stroke="#3b82f6" fill="url(#colorUpload)" strokeWidth={2} />
        </AreaChart>
      )
    }
    if (metric === 'latency') {
      return (
        <LineChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={50}
            tickFormatter={v => v + ' ms'} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#27272a',
              border: '1px solid #3f3f46',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value.toFixed(1)} ms`, '']}
          />
          <Legend />
          <Line type="monotone" dataKey="wifi" stroke="#3b82f6" strokeWidth={2} dot={false} name="Wi-Fi" />
          <Line type="monotone" dataKey="ethernet" stroke="#22c55e" strokeWidth={2} dot={false} name="Ethernet" />
          <Line type="monotone" dataKey="tether" stroke="#f59e0b" strokeWidth={2} dot={false} name="Tether" />
        </LineChart>
      )
    }
    return (
      <BarChart data={currentData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
        <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis dataKey="time" type="category" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="wifi" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Wi-Fi" />
        <Bar dataKey="ethernet" fill="#22c55e" radius={[0, 4, 4, 0]} name="Ethernet" />
        <Bar dataKey="tether" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Tether" />
      </BarChart>
    )
  }

  return (
    <div className="flex-1 overflow-hidden p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">History & Analytics</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Network performance history and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
            {(['1h', '6h', '24h', '7d', '30d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1 ml-2">
            {(['bandwidth', 'latency', 'flows'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  metric === m
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Avg Download"
          value={`${formatSpeed(stats.avgDownload)}/s`}
          icon={<Download className="w-5 h-5 text-green-400" />}
          subtitle={`Peak: ${formatSpeed(stats.peakDownload)}/s`}
        />
        <SummaryCard
          label="Avg Upload"
          value={`${formatSpeed(stats.avgUpload)}/s`}
          icon={<Upload className="w-5 h-5 text-blue-400" />}
          subtitle={`Peak: ${formatSpeed(stats.peakUpload)}/s`}
        />
        <SummaryCard
          label="Avg Latency"
          value={`${stats.avgLatency.toFixed(1)} ms`}
          icon={<Clock className="w-5 h-5 text-purple-400" />}
          subtitle="Wi-Fi adapter"
        />
        <SummaryCard
          label="Time Range"
          value={timeRange}
          icon={<Calendar className="w-5 h-5 text-yellow-400" />}
          subtitle={`${historyData.length} data points`}
        />
      </div>

      {/* Main Chart */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-white capitalize">
            {metric.charAt(0).toUpperCase() + metric.slice(1)} History
          </h3>
        </div>
        <div className="h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Data Points"
          value={historyData.length.toString()}
          icon={<Activity className="w-5 h-5 text-purple-400" />}
        />
        <SummaryCard
          label="Time Span"
          value={timeRange}
          icon={<Calendar className="w-5 h-5 text-yellow-400" />}
        />
        <SummaryCard
          label="Data Type"
          value={metric.charAt(0).toUpperCase() + metric.slice(1)}
          icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
        />
      </div>
    </div>
  )
}

function SummaryCard({ label, value, icon, subtitle }: {
  label: string
  value: string
  icon: React.ReactNode
  subtitle?: string
}) {
  return (
    <div className="card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-sm font-medium">{label}</span>
        <span className="p-2 rounded-lg bg-purple-500/10">{icon}</span>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
      </div>
    </div>
  )
}

function generateMockHistory(range: string): HistoryPoint[] {
  const points = {
    '1h': 12,   // 5-min intervals
    '6h': 12,   // 30-min intervals
    '24h': 24,  // 1-hour intervals
    '7d': 7,    // 1-day intervals
    '30d': 30,  // 1-day intervals
  }[range] || 24

  const intervalMs = {
    '1h': 5 * 60 * 1000,
    '6h': 30 * 60 * 1000,
    '24h': 60 * 60 * 1000,
    '7d': 24 * 60 * 60 * 1000,
    '30d': 24 * 60 * 60 * 1000,
  }[range] || 60 * 60 * 1000

  const now = Date.now()
  return Array.from({ length: points }, (_, i) => {
    const t = new Date(now - (points - i) * intervalMs)
    const baseDownload = 1024 * 1024 * 10
    const baseUpload = 1024 * 1024 * 2
    const variance = Math.sin(i * 0.5) * 0.5 + Math.random() * 0.3
    return {
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: t.toISOString(),
      download: Math.floor(baseDownload * (1 + variance)),
      upload: Math.floor(baseUpload * (1 + variance * 0.5)),
      wifi_latency: 12 + Math.random() * 8,
      ethernet_latency: 3 + Math.random() * 4,
      tether_latency: 25 + Math.random() * 15,
      wifi_flows: Math.floor(30 + Math.random() * 20),
      ethernet_flows: Math.floor(20 + Math.random() * 15),
      tether_flows: Math.floor(10 + Math.random() * 10),
    }
  })
}

export default HistoryView