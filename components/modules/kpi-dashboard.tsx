'use client'

import { useMES } from '@/lib/mes-context'
import { calculateKPIs, getProductById } from '@/lib/mockData'
import { TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function KPIDashboard() {
  const { batches } = useMES()
  const kpis = calculateKPIs(batches)

  // Generate chart data
  const timeSeriesData = [
    { time: '08:00', yield: 96, quality: 2, cycleTime: 1.5 },
    { time: '09:00', yield: 94, quality: 3, cycleTime: 1.4 },
    { time: '10:00', yield: 97, quality: 1, cycleTime: 1.6 },
    { time: '11:00', yield: 95, quality: 2, cycleTime: 1.5 },
    { time: '12:00', yield: 98, quality: 1, cycleTime: 1.7 },
    { time: '13:00', yield: 96, quality: 3, cycleTime: 1.5 },
  ]

  const productDistribution = [
    { name: 'Mobil 1 5W-30', value: batches.filter(b => b.productId === 'prod_1').length },
    { name: 'Mobil 1 10W-40', value: batches.filter(b => b.productId === 'prod_2').length },
    { name: 'Mobil DTE 10', value: batches.filter(b => b.productId === 'prod_3').length },
  ]

  const colors = ['#06b6d4', '#0ea5e9', '#06d6a0']

  const completedBatches = batches.filter(b => b.status === 'DISPATCHED')
  const energyData = completedBatches.map((b, i) => ({
    batch: b.batchNumber.substring(0, 8),
    energy: 2.1 + Math.random() * 0.6,
  })).slice(0, 6)

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-blue-600">Production Yield</p>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-4xl font-bold text-blue-900">{kpis.yieldPct}%</p>
          <p className="text-xs text-green-400 mt-2">Target: 95% ✓</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-blue-600">Quality Loss</p>
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-4xl font-bold text-blue-900">{kpis.qualityLossPct}%</p>
          <p className="text-xs text-orange-400 mt-2">Target: &lt;5%</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-blue-600">Avg Cycle Time</p>
            <TrendingDown className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-4xl font-bold text-blue-900">{kpis.avgCycleTimeHours}h</p>
          <p className="text-xs text-blue-400 mt-2">Target: &lt;2h</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-blue-600">Energy Efficiency</p>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-4xl font-bold text-blue-900">{kpis.energyPerKL.toFixed(2)}</p>
          <p className="text-xs text-yellow-400 mt-2">kWh/KL</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield vs Quality Trend */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Yield vs Quality Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="yield"
                stroke="#06b6d4"
                name="Yield %"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="quality"
                stroke="#f97316"
                name="Quality Loss %"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Distribution */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {colors.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Energy Consumption Chart */}
      <div className="bg-white border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Energy Consumption per Batch</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={energyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="batch" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '4px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="energy" fill="#06b6d4" name="kWh/KL" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Batch Completion</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-blue-600">Planned</span>
                <span className="font-semibold text-blue-900">{kpis.batchesPlanned}</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded">
                <div className="h-full bg-slate-500 rounded" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-blue-600">Completed</span>
                <span className="font-semibold text-blue-900">{kpis.batchesCompleted}</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{
                    width: `${
                      kpis.batchesPlanned > 0
                        ? (kpis.batchesCompleted / kpis.batchesPlanned) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Shift Performance</h3>
          <div className="space-y-2">
            {['A', 'B', 'C'].map(shift => {
              const shiftBatches = batches.filter(b => b.shift === shift)
              const completedShift = shiftBatches.filter(b => b.status === 'DISPATCHED').length
              return (
                <div key={shift}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blue-600">Shift {shift}</span>
                    <span className="font-semibold text-blue-900">
                      {completedShift}/{shiftBatches.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{
                        width: `${shiftBatches.length > 0 ? (completedShift / shiftBatches.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Production Summary</h3>
          <div className="space-y-3">
            <div className="bg-slate-700 rounded p-3">
              <p className="text-xs text-blue-600">Total Volume Planned</p>
              <p className="text-2xl font-bold text-blue-900">
                {batches.reduce((sum, b) => sum + b.plannedQtyKL, 0)} KL
              </p>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <p className="text-xs text-blue-600">Volume Completed</p>
              <p className="text-2xl font-bold text-green-400">
                {completedBatches.reduce((sum, b) => sum + b.actualQtyKL, 0)} KL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
