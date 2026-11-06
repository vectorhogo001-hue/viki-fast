import { useState, useCallback, useEffect } from 'react'
import type { AdapterStats, AdapterConfig } from '../types'

interface UseAdaptersReturn {
  adapters: AdapterStats[]
  updateAdapter: (config: AdapterConfig) => Promise<void>
  refreshAdapters: () => Promise<void>
  loading: boolean
}

export function useAdapters(): UseAdaptersReturn {
  const [adapters, setAdapters] = useState<AdapterStats[]>([])
  const [loading, setLoading] = useState(false)

  const refreshAdapters = useCallback(async () => {
    setLoading(true)
    // In a real app, this would call the backend
    await new Promise(resolve => setTimeout(resolve, 500))
    // Mock data would come from backend
    setLoading(false)
  }, [])

  const updateAdapter = useCallback(async (config: AdapterConfig) => {
    setAdapters(prev => prev.map(ad =>
      ad.name === config.name ? { ...ad, ...config } : ad
    ))
    // In a real app, this would call the backend
    await new Promise(resolve => setTimeout(resolve, 200))
  }, [])

  // Initialize with mock data
  useEffect(() => {
    setAdapters([
      {
        name: 'Wi-Fi',
        mac: '00:11:22:33:44:55',
        ipv4: '192.168.1.100',
        ipv6: 'fe80::1234:5678:9abc:def0',
        rx: 1024 * 1024 * 150,
        tx: 1024 * 1024 * 25,
        speed_rx: 1024 * 1024 * 12,
        speed_tx: 1024 * 1024 * 2,
        flows: 42,
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
        rx: 1024 * 1024 * 500,
        tx: 1024 * 1024 * 50,
        speed_rx: 1024 * 1024 * 45,
        speed_tx: 1024 * 1024 * 5,
        flows: 28,
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
        rx: 1024 * 1024 * 80,
        tx: 1024 * 1024 * 15,
        speed_rx: 1024 * 1024 * 8,
        speed_tx: 1024 * 1024 * 1,
        flows: 15,
        weight: 0.8,
        speed_limit: 1024 * 1024 * 5,
        ipv6_enabled: false,
        healthy: true,
        type: 'tether',
      },
    ])
  }, [])

  return { adapters, updateAdapter, refreshAdapters, loading }
}