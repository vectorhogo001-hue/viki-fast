import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts'

interface FlowDistributionProps {
  data: Array<{ name: string; value: number; color: string }>
}

export function FlowDistribution({ data }: FlowDistributionProps) {
  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Flow Distribution</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              contentStyle={{
                backgroundColor: '#27272a',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-400">{entry.name}</span>
            <span className="text-white font-medium">{entry.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FlowDistribution