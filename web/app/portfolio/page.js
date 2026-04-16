'use client'

import { useState } from 'react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'

// Mock detailed portfolio data
const portfolioWatches = [
  {
    id: 1,
    brand: 'Rolex',
    model: 'Submariner Date',
    reference: '116610LN',
    purchasePrice: 8500,
    currentValue: 12800,
    purchaseDate: '2023-01-15',
    condition: 'Excellent',
    boxPapers: 'both',
    imageUrl: '/api/placeholder/300/200',
    roi: 50.6,
    monthlyData: [
      { month: 'Jan', value: 8500 },
      { month: 'Feb', value: 8800 },
      { month: 'Mar', value: 9200 },
      { month: 'Apr', value: 9800 },
      { month: 'May', value: 10500 },
      { month: 'Jun', value: 11200 },
      { month: 'Jul', value: 11800 },
      { month: 'Aug', value: 12200 },
      { month: 'Sep', value: 12800 }
    ]
  },
  {
    id: 2,
    brand: 'Patek Philippe',
    model: 'Nautilus',
    reference: '5711/1A-010',
    purchasePrice: 85000,
    currentValue: 120000,
    purchaseDate: '2023-03-22',
    condition: 'New',
    boxPapers: 'both',
    imageUrl: '/api/placeholder/300/200',
    roi: 41.2,
    monthlyData: [
      { month: 'Mar', value: 85000 },
      { month: 'Apr', value: 88000 },
      { month: 'May', value: 92000 },
      { month: 'Jun', value: 98000 },
      { month: 'Jul', value: 105000 },
      { month: 'Aug', value: 112000 },
      { month: 'Sep', value: 120000 }
    ]
  },
  {
    id: 3,
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    reference: '15400ST.OO.1220ST.02',
    purchasePrice: 32000,
    currentValue: 45000,
    purchaseDate: '2023-02-10',
    condition: 'Very Good',
    boxPapers: 'box',
    imageUrl: '/api/placeholder/300/200',
    roi: 40.6,
    monthlyData: [
      { month: 'Feb', value: 32000 },
      { month: 'Mar', value: 33500 },
      { month: 'Apr', value: 35000 },
      { month: 'May', value: 37500 },
      { month: 'Jun', value: 40000 },
      { month: 'Jul', value: 42000 },
      { month: 'Aug', value: 43500 },
      { month: 'Sep', value: 45000 }
    ]
  },
  {
    id: 4,
    brand: 'Omega',
    model: 'Speedmaster Professional',
    reference: '311.30.42.30.01.005',
    purchasePrice: 4200,
    currentValue: 5800,
    purchaseDate: '2023-04-05',
    condition: 'Excellent',
    boxPapers: 'papers',
    imageUrl: '/api/placeholder/300/200',
    roi: 38.1,
    monthlyData: [
      { month: 'Apr', value: 4200 },
      { month: 'May', value: 4400 },
      { month: 'Jun', value: 4700 },
      { month: 'Jul', value: 5000 },
      { month: 'Aug', value: 5400 },
      { month: 'Sep', value: 5800 }
    ]
  },
  {
    id: 5,
    brand: 'Rolex',
    model: 'GMT-Master II',
    reference: '126710BLNR',
    purchasePrice: 15000,
    currentValue: 19500,
    purchaseDate: '2023-06-18',
    condition: 'New',
    boxPapers: 'both',
    imageUrl: '/api/placeholder/300/200',
    roi: 30.0,
    monthlyData: [
      { month: 'Jun', value: 15000 },
      { month: 'Jul', value: 15800 },
      { month: 'Aug', value: 17200 },
      { month: 'Sep', value: 19500 }
    ]
  }
]

const priceVsRoiData = portfolioWatches.map(watch => ({
  brand: watch.brand,
  price: watch.purchasePrice,
  roi: watch.roi,
  current: watch.currentValue
}))

export default function Portfolio() {
  const [selectedWatch, setSelectedWatch] = useState(portfolioWatches[0])
  const [sortBy, setSortBy] = useState('roi')
  const [filterBrand, setFilterBrand] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // grid or table

  const totalInvested = portfolioWatches.reduce((sum, watch) => sum + watch.purchasePrice, 0)
  const totalCurrent = portfolioWatches.reduce((sum, watch) => sum + watch.currentValue, 0)
  const totalProfit = totalCurrent - totalInvested
  const averageROI = (totalProfit / totalInvested * 100).toFixed(1)

  const brands = [...new Set(portfolioWatches.map(watch => watch.brand))]
  
  const filteredWatches = portfolioWatches
    .filter(watch => filterBrand === 'all' || watch.brand === filterBrand)
    .sort((a, b) => {
      switch(sortBy) {\n        case 'roi': return b.roi - a.roi\n        case 'value': return b.currentValue - a.currentValue\n        case 'date': return new Date(b.purchaseDate) - new Date(a.purchaseDate)\n        default: return 0\n      }\n    })\n\n  return (\n    <div className=\"portfolio-page\">\n      <div className=\"page-header\">\n        <div>\n          <h1>Portfolio Analysis</h1>\n          <p className=\"page-subtitle\">Detailed view of your watch investments and performance metrics</p>\n        </div>\n        <div className=\"page-actions\">\n          <select \n            value={filterBrand} \n            onChange={(e) => setFilterBrand(e.target.value)}\n            className=\"form-input filter-select\"\n          >\n            <option value=\"all\">All Brands</option>\n            {brands.map(brand => (\n              <option key={brand} value={brand}>{brand}</option>\n            ))}\n          </select>\n          <select \n            value={sortBy} \n            onChange={(e) => setSortBy(e.target.value)}\n            className=\"form-input filter-select\"\n          >\n            <option value=\"roi\">Sort by ROI</option>\n            <option value=\"value\">Sort by Value</option>\n            <option value=\"date\">Sort by Date</option>\n          </select>\n          <div className=\"view-toggle\">\n            <button \n              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}\n              onClick={() => setViewMode('grid')}\n            >\n              📱 Grid\n            </button>\n            <button \n              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}\n              onClick={() => setViewMode('table')}\n            >\n              📋 Table\n            </button>\n          </div>\n        </div>\n      </div>\n\n      {/* Portfolio Summary */}\n      <div className=\"portfolio-summary grid grid-4\">\n        <MetricCard label=\"Total Invested\" value={`$${(totalInvested/1000).toFixed(0)}K`} />\n        <MetricCard label=\"Current Value\" value={`$${(totalCurrent/1000).toFixed(0)}K`} />\n        <MetricCard label=\"Total Profit\" value={`$${(totalProfit/1000).toFixed(0)}K`} positive />\n        <MetricCard label=\"Average ROI\" value={`${averageROI}%`} positive />\n      </div>\n\n      <div className=\"portfolio-content\">\n        <div className=\"portfolio-main\">\n          <div className=\"analysis-charts\">\n            {/* Price vs ROI Scatter */}\n            <ChartCard title=\"Price vs ROI Analysis\" subtitle=\"Investment amount vs return performance\">\n              <ResponsiveContainer width=\"100%\" height={300}>\n                <ScatterChart data={priceVsRoiData}>\n                  <CartesianGrid strokeDasharray=\"3 3\" stroke=\"#334155\" />\n                  <XAxis \n                    dataKey=\"price\" \n                    stroke=\"#94a3b8\" \n                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}\n                  />\n                  <YAxis \n                    dataKey=\"roi\" \n                    stroke=\"#94a3b8\" \n                    tickFormatter={(value) => `${value}%`}\n                  />\n                  <Tooltip \n                    contentStyle={{ \n                      backgroundColor: '#1a2236', \n                      border: '1px solid #334155',\n                      borderRadius: '8px'\n                    }}\n                    formatter={(value, name) => {\n                      if (name === 'roi') return [`${value}%`, 'ROI']\n                      return [`$${(value/1000).toFixed(1)}K`, name]\n                    }}\n                    labelFormatter={(label, payload) => {\n                      if (payload && payload[0]) {\n                        return `${payload[0].payload.brand}`\n                      }\n                      return label\n                    }}\n                  />\n                  <Scatter dataKey=\"roi\" fill=\"#8b5cf6\" />\n                </ScatterChart>\n              </ResponsiveContainer>\n            </ChartCard>\n\n            {/* Selected Watch Performance */}\n            <ChartCard title=\"Individual Watch Performance\" subtitle={`${selectedWatch.brand} ${selectedWatch.model}`}>\n              <ResponsiveContainer width=\"100%\" height={300}>\n                <LineChart data={selectedWatch.monthlyData}>\n                  <CartesianGrid strokeDasharray=\"3 3\" stroke=\"#334155\" />\n                  <XAxis dataKey=\"month\" stroke=\"#94a3b8\" />\n                  <YAxis \n                    stroke=\"#94a3b8\" \n                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}\n                  />\n                  <Tooltip \n                    contentStyle={{ \n                      backgroundColor: '#1a2236', \n                      border: '1px solid #334155',\n                      borderRadius: '8px'\n                    }}\n                    formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}\n                  />\n                  <Line \n                    type=\"monotone\" \n                    dataKey=\"value\" \n                    stroke=\"#8b5cf6\" \n                    strokeWidth={3}\n                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}\n                    activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}\n                  />\n                </LineChart>\n              </ResponsiveContainer>\n            </ChartCard>\n          </div>\n\n          {/* Watch Collection */}\n          <div className=\"watch-collection\">\n            <div className=\"collection-header\">\n              <h3>Watch Collection ({filteredWatches.length})</h3>\n            </div>\n            \n            {viewMode === 'grid' ? (\n              <div className=\"watches-grid\">\n                {filteredWatches.map(watch => (\n                  <WatchCard \n                    key={watch.id} \n                    watch={watch} \n                    isSelected={selectedWatch.id === watch.id}\n                    onSelect={() => setSelectedWatch(watch)}\n                  />\n                ))}\n              </div>\n            ) : (\n              <WatchTable watches={filteredWatches} selectedWatch={selectedWatch} onSelect={setSelectedWatch} />\n            )}\n          </div>\n        </div>\n      </div>\n    </div>\n  )\n}\n\nfunction MetricCard({ label, value, positive }) {\n  return (\n    <div className=\"metric-card animate-fade-in\">\n      <div className={`metric-value ${positive ? 'status-positive' : ''}`}>{value}</div>\n      <div className=\"metric-label\">{label}</div>\n    </div>\n  )\n}\n\nfunction ChartCard({ title, subtitle, children }) {\n  return (\n    <div className=\"card animate-fade-in\">\n      <div className=\"chart-header\">\n        <h3>{title}</h3>\n        {subtitle && <p className=\"chart-subtitle\">{subtitle}</p>}\n      </div>\n      <div className=\"chart-content\">\n        {children}\n      </div>\n    </div>\n  )\n}\n\nfunction WatchCard({ watch, isSelected, onSelect }) {\n  const profit = watch.currentValue - watch.purchasePrice\n  \n  return (\n    <div \n      className={`watch-card ${isSelected ? 'selected' : ''}`}\n      onClick={onSelect}\n    >\n      <div className=\"watch-image\">\n        <div className=\"image-placeholder\">⌚</div>\n        <div className=\"watch-roi\">\n          <span className={`roi-badge ${watch.roi >= 0 ? 'positive' : 'negative'}`}>\n            +{watch.roi}%\n          </span>\n        </div>\n      </div>\n      \n      <div className=\"watch-info\">\n        <h4 className=\"watch-title\">{watch.brand}</h4>\n        <p className=\"watch-model\">{watch.model}</p>\n        <p className=\"watch-reference\">{watch.reference}</p>\n        \n        <div className=\"watch-metrics\">\n          <div className=\"metric\">\n            <span className=\"metric-label\">Invested</span>\n            <span className=\"metric-value data-label\">${watch.purchasePrice.toLocaleString()}</span>\n          </div>\n          <div className=\"metric\">\n            <span className=\"metric-label\">Current</span>\n            <span className=\"metric-value data-label\">${watch.currentValue.toLocaleString()}</span>\n          </div>\n          <div className=\"metric\">\n            <span className=\"metric-label\">Profit</span>\n            <span className={`metric-value data-label ${profit >= 0 ? 'status-positive' : 'status-negative'}`}>\n              ${profit.toLocaleString()}\n            </span>\n          </div>\n        </div>\n        \n        <div className=\"watch-details\">\n          <span className=\"detail-badge\">{watch.condition}</span>\n          <span className=\"detail-badge\">\n            {watch.boxPapers === 'both' ? 'B&P' : \n             watch.boxPapers === 'box' ? 'Box' :\n             watch.boxPapers === 'papers' ? 'Papers' : 'None'}\n          </span>\n          <span className=\"detail-date\">{new Date(watch.purchaseDate).toLocaleDateString()}</span>\n        </div>\n      </div>\n    </div>\n  )\n}\n\nfunction WatchTable({ watches, selectedWatch, onSelect }) {\n  return (\n    <div className=\"watch-table\">\n      <div className=\"table-header\">\n        <div className=\"table-cell\">Watch</div>\n        <div className=\"table-cell\">Reference</div>\n        <div className=\"table-cell\">Invested</div>\n        <div className=\"table-cell\">Current</div>\n        <div className=\"table-cell\">Profit</div>\n        <div className=\"table-cell\">ROI</div>\n        <div className=\"table-cell\">Date</div>\n        <div className=\"table-cell\">Condition</div>\n      </div>\n      \n      {watches.map(watch => {\n        const profit = watch.currentValue - watch.purchasePrice\n        return (\n          <div \n            key={watch.id} \n            className={`table-row ${selectedWatch.id === watch.id ? 'selected' : ''}`}\n            onClick={() => onSelect(watch)}\n          >\n            <div className=\"table-cell\">\n              <div>\n                <div className=\"watch-brand\">{watch.brand}</div>\n                <div className=\"watch-model-small\">{watch.model}</div>\n              </div>\n            </div>\n            <div className=\"table-cell data-label\">{watch.reference}</div>\n            <div className=\"table-cell data-label\">${watch.purchasePrice.toLocaleString()}</div>\n            <div className=\"table-cell data-label\">${watch.currentValue.toLocaleString()}</div>\n            <div className={`table-cell data-label ${profit >= 0 ? 'status-positive' : 'status-negative'}`}>\n              ${profit.toLocaleString()}\n            </div>\n            <div className=\"table-cell status-positive\">+{watch.roi}%</div>\n            <div className=\"table-cell\">{new Date(watch.purchaseDate).toLocaleDateString()}</div>\n            <div className=\"table-cell\">\n              <span className=\"condition-badge\">{watch.condition}</span>\n            </div>\n          </div>\n        )\n      })}\n    </div>\n  )\n}"