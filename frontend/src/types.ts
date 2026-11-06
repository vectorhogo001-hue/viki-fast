export interface AdapterStats {
  name: string
  mac: string
  ipv4: string
  ipv6: string
  rx: number
  tx: number
  speed_rx: number
  speed_tx: number
  flows: number
  weight: number
  speed_limit: number
  ipv6_enabled: boolean
  healthy: boolean
  type: 'wifi' | 'ethernet' | 'tether' | 'unknown'
}

export interface AdapterConfig {
  name: string
  weight: number
  speed_limit: number
  ipv6_enabled: boolean
  enabled: boolean
}

export interface StatsSnapshot {
  timestamp: string
  total_rx: number
  total_tx: number
  adapters: AdapterStats[]
  flow_counts: Record<string, number>
  scheduler_mode: string
  ipv6_policy: string
  mtu: number
}

export interface HistoryPoint {
  timestamp: string
  total_rx: number
  total_tx: number
  latency: number
}

export interface AppConfig {
  scheduler_mode: 'weighted' | 'lowest'
  ipv6_policy: 'auto' | 'on' | 'off'
  mtu: number
  socks5_enabled: boolean
  adapters: AdapterConfig[]
  theme: 'light' | 'dark' | 'auto'
  auto_start: boolean
  auto_pause: boolean
}