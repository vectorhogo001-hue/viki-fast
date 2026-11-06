import { useEffect, useState, useCallback } from 'react'
import type { StatsSnapshot, AdapterStats } from '../types'

interface UseStatsReturn {
  stats: StatsSnapshot | null
  isConnected: boolean
  error: string | null
  reconnect: () => void
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<StatsSnapshot | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would connect to the Wails backend via WebSocket
    // For now, we'll simulate with mock data
    const mockStats = generateMockStats()
    setStats(mockStats)
    setIsConnected(true)
    setError(null)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => prev ? generateMockStats(prev) : generateMockStats())
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const reconnect = useCallback(() => {
    setIsConnected(false)
    setError('Reconnecting...')
    setTimeout(() => {
      setIsConnected(true)
      setError(null)
    }, 1000)
  }, [])

  return { stats, isConnected, error, reconnect }
}

function generateMockStats(prev?: StatsSnapshot): StatsSnapshot {
  const adapters: StatsSnapshot['adapters'] = [
    {
      name: 'Wi-Fi',
      mac: '00:11:22:33:44:55',
      ipv4: '192.168.1.100',
      ipv6: 'fe80::1234:5678:9abc:def0',
      rx: prev?.adapters[0]?.rx || 0,
      tx: prev?.adapters[0]?.tx || 0,
      speed_rx: Math.floor(Math.random() * 1024 * 1024 * 15) + 1024 * 1024 * 5,
      speed_tx: Math.floor(Math.random() * 1024 * 1024 * 3) + 1024 * 1024,
      flows: Math.floor(Math.random() * 20) + 30,
      weight: 1.0,
      speed_limit: 0,
      ipv6_enabled: true,
      healthy: true,
      type: 'wifi',
    },
    {
      name: 'Ethernet',
      mac: 'aa:bb:cc:dd:ee:ff',
      ipv4: '192.168.1.101',
      ipv6: 'fe80::aabb:ccdd:eeff:1122',
      rx: prev?.adapters[1]?.rx || 0,
      tx: prev?.adapters[1]?.tx || 0,
      speed_rx: Math.floor(Math.random() * 1024 * 1024 * 50) + 1024 * 1024 * 30,
      speed_tx: Math.floor(Math.random() * 1024 * 1024 * 8) + 1024 * 1024 * 2,
      flows: Math.floor(Math.random() * 10) + 20,
      weight: 1.5,
      speed_limit: 0,
      ipv6_enabled: true,
      healthy: true,
      type: 'ethernet',
    },
    {
      name: 'USB Tether',
      mac: '11:22:33:44:55:66',
      ipv4: '192.168.42.100',
      ipv6: '',
      rx: prev?.adapters[2]?.rx || 0,
      tx: prev?.adapters[2]?.tx || 0,
      speed_rx: Math.floor(Math.random() * 1024 * 1024 * 10) + 1024 * 1024 * 2,
      speed_tx: Math.floor(Math.random() * 1024 * 1024 * 2) + 1024 * 512,
      flows: Math.floor(Math.random() * 10) + 10,
      weight: 0.8,
      speed_limit: 1024 * 1024 * 5,
      ipv6_enabled: false,
      healthy: true,
      type: 'tether',
    },
  ]

  const updatedAdapters = adapters.map(ad => ({
    ...ad,
    rx: ad.rx + Math.floor(ad.speed_rx * 0.5),
    tx: ad.tx + Math.floor(ad.speed_tx * 0.5),
  }))

  return {
    timestamp: new Date().toISOString(),
    total_rx: updatedAdapters.reduce((sum, a) => sum + a.rx, 0),
    total_tx: updatedAdapters.reduce((sum, a) => sum + a.tx, 0),
    adapters: updatedAdapters,
    flow_counts: Object.fromEntries(updatedAdapters.map(a => [a.name, a.flows])),
    scheduler_mode: 'weighted',
    ipv6_policy: 'auto',
    mtu: 9000,
  }
}