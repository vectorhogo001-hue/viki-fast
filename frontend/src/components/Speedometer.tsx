import { useMemo } from 'react'
import { formatSpeed } from '@/utils/cn'

interface SpeedometerProps {
  download: number
  upload: number
}

export function Speedometer({ download, upload }: SpeedometerProps) {
  const maxSpeed = useMemo(() => Math.max(download, upload, 1024 * 1024 * 100), [download, upload])

  const downloadPercent = Math.min((download / maxSpeed) * 100, 100)
  const uploadPercent = Math.min((upload / maxSpeed) * 100, 100)

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Speedometer</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center space-y-2">
          <p className="text-zinc-400 text-sm font-medium">Download</p>
          <p className="text-4xl font-bold text-green-400 tabular-nums">
            {formatSpeed(download)}
          </p>
          <p className="text-zinc-500 text-xs">↓ RX</p>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
              style={{ width: `${downloadPercent}%` }}
            />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-zinc-400 text-sm font-medium">Upload</p>
          <p className="text-4xl font-bold text-blue-400 tabular-nums">
            {formatSpeed(upload)}
          </p>
          <p className="text-zinc-500 text-xs">↑ TX</p>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${uploadPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Speedometer