'use client'

import { useMES } from '@/lib/mes-context'
import { calculateKPIs, getProductById, getUserById } from '@/lib/mockData'
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'

export default function DashboardOverview() {
  const { batches } = useMES()
  const kpis = calculateKPIs(batches)

  const statuses = {
    planned: batches.filter(b => b.status === 'PLANNED').length,
    inProgress: batches.filter(b => b.status === 'IN_PROGRESS').length,
    readyQC: batches.filter(b => b.status === 'READY_FOR_QC').length,
    readyFilling: batches.filter(b => b.status === 'READY_FOR_FILLING').length,
    filled: batches.filter(b => b.status === 'FILLED').length,
    dispatched: batches.filter(b => b.status === 'DISPATCHED').length,
  }

  const recentBatches = batches.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-600">Yield %</p>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{kpis.yieldPct}%</p>
          <p className="text-xs text-blue-600 mt-2">Production efficiency</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-600">Quality Loss</p>
            <AlertCircle className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{kpis.qualityLossPct}%</p>
          <p className="text-xs text-blue-600 mt-2">Failed QC batches</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-600">Avg Cycle Time</p>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{kpis.avgCycleTimeHours}h</p>
          <p className="text-xs text-blue-600 mt-2">Blending to dispatch</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-600">Energy/KL</p>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{kpis.energyPerKL.toFixed(2)}</p>
          <p className="text-xs text-blue-600 mt-2">kWh per kiloliter</p>
        </div>
      </div>

      {/* Batch Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Batch Status Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Planned', count: statuses.planned, color: 'bg-slate-500' },
              { label: 'In Progress', count: statuses.inProgress, color: 'bg-blue-500' },
              { label: 'Ready for QC', count: statuses.readyQC, color: 'bg-yellow-500' },
              { label: 'Ready for Filling', count: statuses.readyFilling, color: 'bg-cyan-500' },
              { label: 'Filled', count: statuses.filled, color: 'bg-green-500' },
              { label: 'Dispatched', count: statuses.dispatched, color: 'bg-emerald-600' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-slate-300">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-blue-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Production Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-blue-600 mb-1">Total Batches</p>
              <p className="text-2xl font-bold text-blue-900">{batches.length}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 mb-1">Completed Today</p>
              <p className="text-2xl font-bold text-blue-600">{kpis.batchesCompleted}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 mb-1">Total Volume Planned</p>
              <p className="text-2xl font-bold text-blue-900">
                {batches.reduce((sum, b) => sum + b.plannedQtyKL, 0)} KL
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600 mb-1">Volume Completed</p>
              <p className="text-2xl font-bold text-green-400">
                {batches.filter(b => b.status === 'DISPATCHED').reduce((sum, b) => sum + b.actualQtyKL, 0)} KL
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Batches */}
      <div className="bg-white border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Recent Batches</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-600">Batch #</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-600">Product</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-600">Operator</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-600">Qty (KL)</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-600">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-blue-600">QC</th>
              </tr>
            </thead>
            <tbody>
              {recentBatches.map(batch => (
                <tr key={batch.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">{batch.batchNumber}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{getProductById(batch.productId)?.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{getUserById(batch.operatorId)?.name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-900">{batch.plannedQtyKL}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      batch.status === 'DISPATCHED' ? 'bg-green-500 text-blue-900' :
                      batch.status === 'READY_FOR_QC' ? 'bg-yellow-500 text-slate-900' :
                      batch.status === 'READY_FOR_FILLING' ? 'bg-cyan-500 text-slate-900' :
                      batch.status === 'IN_PROGRESS' ? 'bg-blue-500 text-blue-900' :
                      'bg-slate-600 text-slate-100'
                    }`}>
                      {batch.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {batch.qcResult ? (
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        batch.qcResult === 'PASS' ? 'bg-green-600 text-blue-900' :
                        batch.qcResult === 'FAIL' ? 'bg-red-600 text-blue-900' :
                        'bg-yellow-600 text-blue-900'
                      }`}>
                        {batch.qcResult}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
