'use client'

import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Mock data for the dashboard
const portfolioData = [
  { date: '2023-01', invested: 150000, currentValue: 148000 },
  { date: '2023-02', invested: 220000, currentValue: 235000 },
  { date: '2023-03', invested: 320000, currentValue: 340000 },
  { date: '2023-04', invested: 420000, currentValue: 465000 },
  { date: '2023-05', invested: 520000, currentValue: 580000 },
  { date: '2023-06', invested: 620000, currentValue: 690000 },
  { date: '2023-07', invested: 720000, currentValue: 795000 },
  { date: '2023-08', invested: 750000, currentValue: 825000 },
  { date: '2023-09', invested: 780000, currentValue: 847200 }
]

const brandDistribution = [
  { name: 'Rolex', value: 380000, count: 8, color: '#8b5cf6' },
  { name: 'Patek Philippe', value: 250000, count: 3, color: '#a78bfa' },
  { name: 'Audemars Piguet', value: 120000, count: 2, color: '#c4b5fd' },
  { name: 'Omega', value: 65000, count: 5, color: '#ddd6fe' },
  { name: 'Others', value: 32200, count: 4, color: '#ede9fe' }
]

const topPerformers = [
  { model: 'Submariner 116610LN', brand: 'Rolex', invested: 8500, current: 12800, roi: 50.6, date: '2023-01' },
  { model: 'Nautilus 5711/1A', brand: 'Patek Philippe', invested: 85000, current: 120000, roi: 41.2, date: '2023-03' },
  { model: 'Royal Oak 15400ST', brand: 'Audemars Piguet', invested: 32000, current: 45000, roi: 40.6, date: '2023-02' },
  { model: 'Speedmaster Professional', brand: 'Omega', invested: 4200, current: 5800, roi: 38.1, date: '2023-04' },
  { model: 'GMT-Master II 126710BLNR', brand: 'Rolex', invested: 15000, current: 19500, roi: 30.0, date: '2023-06' }
]

export default function Dashboard() {
  const totalInvested = 780000
  const currentValue = 847200
  const totalROI = ((currentValue - totalInvested) / totalInvested * 100).toFixed(1)
  const profit = currentValue - totalInvested
  const watchCount = 22

  return (
    <div className="dashboard">
      {/* Key Metrics */}
      <div className="metrics-grid grid grid-4">
        <MetricCard
          label="Total Portfolio Value"
          value={`$${(currentValue / 1000).toFixed(1)}K`}
          change="+2.4%"
          positive
        />
        <MetricCard
          label="Total Invested"
          value={`$${(totalInvested / 1000).toFixed(1)}K`}
          change="Last updated today"
          neutral
        />
        <MetricCard
          label="Total ROI"
          value={`${totalROI}%`}
          change={`+$${(profit / 1000).toFixed(1)}K`}
          positive
        />
        <MetricCard
          label="Active Watches"
          value={watchCount}
          change="3 added this month"
          neutral
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid grid grid-2">
        <ChartCard title="Portfolio Value Evolution" subtitle="Invested vs Current Value">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}K`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a2236', 
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`$${(value/1000).toFixed(1)}K`, '']}
              />
              <Area 
                type="monotone" 
                dataKey="invested" 
                stackId="1" 
                stroke="#8b5cf6" 
                fill="url(#investedGradient)"
                name="Invested"
              />
              <Area 
                type="monotone" 
                dataKey="currentValue" 
                stackId="2" 
                stroke="#10b981" 
                fill="url(#currentGradient)"
                name="Current Value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Brand Distribution" subtitle="Portfolio allocation by manufacturer">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={brandDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${(value/1000).toFixed(0)}K`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {brandDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a2236', 
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [`$${(value/1000).toFixed(1)}K`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Performers Table */}
      <div className="performers-section">
        <ChartCard title="Top Performing Watches" subtitle="Best ROI performers in your portfolio">
          <div className="performers-table">
            <div className="table-header">
              <div className="table-cell">Watch</div>
              <div className="table-cell">Brand</div>
              <div className="table-cell">Invested</div>
              <div className="table-cell">Current</div>
              <div className="table-cell">ROI</div>
              <div className="table-cell">Added</div>
            </div>
            {topPerformers.map((watch, index) => (
              <div key={index} className="table-row">
                <div className="table-cell font-semibold">{watch.model}</div>
                <div className="table-cell text-muted">{watch.brand}</div>
                <div className="table-cell data-label">${watch.invested.toLocaleString()}</div>
                <div className="table-cell data-label">${watch.current.toLocaleString()}</div>
                <div className="table-cell status-positive">+{watch.roi}%</div>
                <div className="table-cell text-muted">{watch.date}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ROI Comparison Bar Chart */}
      <div className="roi-chart">
        <ChartCard title="ROI Comparison" subtitle="Return on investment by watch">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topPerformers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="model" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a2236', 
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'ROI']}
              />
              <Bar dataKey="roi" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

function MetricCard({ label, value, change, positive, neutral }) {
  const changeClass = positive ? 'status-positive' : neutral ? 'status-neutral' : 'status-negative'
  
  return (
    <div className="metric-card animate-fade-in">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      <div className={`metric-change ${changeClass}`}>{change}</div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card animate-fade-in">
      <div className="chart-header">
        <h3>{title}</h3>
        {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      </div>
      <div className="chart-content">
        {children}
      </div>
    </div>
  )
}