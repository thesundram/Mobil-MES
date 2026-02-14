'use client'

import { useState, useEffect } from 'react'
import { useMES } from '@/lib/mes-context'
import { getProductById, getRecipeByProductId } from '@/lib/mockData'
import { Play, Pause, CheckCircle } from 'lucide-react'

export default function BlendingControl() {
  const { batches, startBlending, completeBlending, getBlendingProgress } = useMES()
  const [selectedBatchId, setSelectedBatchId] = useState<string>('')
  const [blendProgress, setBlendProgress] = useState({ base: 0, addA: 0, addB: 0, temp: 0, pressure: 0 })
  const [autoRefresh, setAutoRefresh] = useState<NodeJS.Timeout | null>(null)

  const plannedBatches = batches.filter(b => b.status === 'PLANNED')
  const inProgressBatches = batches.filter(b => b.status === 'IN_PROGRESS')

  const selectedBatch = batches.find(b => b.id === selectedBatchId)
  const recipe = selectedBatch ? getRecipeByProductId(selectedBatch.productId) : null
  const product = selectedBatch ? getProductById(selectedBatch.productId) : null

  useEffect(() => {
    if (selectedBatch && selectedBatch.status === 'IN_PROGRESS') {
      const interval = setInterval(() => {
        setBlendProgress(getBlendingProgress(selectedBatch.id))
      }, 500)
      setAutoRefresh(interval)
      return () => clearInterval(interval)
    }
    return () => {
      if (autoRefresh) clearInterval(autoRefresh)
    }
  }, [selectedBatch, getBlendingProgress])

  const handleStartBlending = () => {
    if (selectedBatchId) {
      startBlending(selectedBatchId)
      setBlendProgress({ base: 0, addA: 0, addB: 0, temp: 0, pressure: 0 })
    }
  }

  const handleCompleteBlending = () => {
    if (selectedBatchId) {
      completeBlending(selectedBatchId)
      setSelectedBatchId('')
      setBlendProgress({ base: 0, addA: 0, addB: 0, temp: 0, pressure: 0 })
    }
  }

  return (
    <div className="space-y-6">
      {/* Batch Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Available Batches */}
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Available Batches</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {plannedBatches.map(batch => (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedBatchId === batch.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <p className="font-mono font-semibold">{batch.batchNumber}</p>
                  <p className="text-sm opacity-75">
                    {getProductById(batch.productId)?.name} - {batch.plannedQtyKL} KL
                  </p>
                </button>
              ))}
              {plannedBatches.length === 0 && (
                <p className="text-blue-600 text-sm">No planned batches available.</p>
              )}
            </div>
          </div>

          {/* In Progress Batches */}
          {inProgressBatches.length > 0 && (
            <div className="bg-slate-800 border border-blue-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Currently Blending</h3>
              <div className="space-y-2">
                {inProgressBatches.map(batch => (
                  <button
                    key={batch.id}
                    onClick={() => setSelectedBatchId(batch.id)}
                    className={`w-full text-left p-3 rounded transition-colors ${
                      selectedBatchId === batch.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-900 text-blue-100 hover:bg-blue-800'
                    }`}
                  >
                    <p className="font-mono font-semibold">{batch.batchNumber}</p>
                    <p className="text-sm opacity-75">
                      Started: {batch.blendingStartTime?.toLocaleTimeString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Blending Stats</h3>
          <div className="space-y-4">
            <div className="bg-slate-700 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">Available</p>
              <p className="text-2xl font-bold text-blue-900">{plannedBatches.length}</p>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressBatches.length}</p>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">Avg Blend Time</p>
              <p className="text-2xl font-bold text-blue-900">1.2 h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe & Blending Details */}
      {selectedBatch && recipe && product && (
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-blue-600">Batch Number</p>
              <p className="text-2xl font-bold text-blue-600 font-mono">{selectedBatch.batchNumber}</p>
              <p className="text-slate-300 mt-2">{product.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Quantity</p>
              <p className="text-2xl font-bold text-blue-900">{selectedBatch.plannedQtyKL} KL</p>
            </div>
          </div>

          {/* Recipe Master */}
          <div className="mb-6 p-4 bg-slate-700 rounded">
            <h4 className="font-semibold text-blue-900 mb-4">Recipe Master (Target)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-300 mb-2">Base Oil</p>
                <p className="text-2xl font-bold text-blue-900">{recipe.baseOilPct}%</p>
                <p className="text-xs text-blue-600">±{recipe.toleranceBase}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-2">Additive A</p>
                <p className="text-2xl font-bold text-blue-900">{recipe.additiveAPct}%</p>
                <p className="text-xs text-blue-600">±{recipe.toleranceAdditive}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-2">Additive B</p>
                <p className="text-2xl font-bold text-blue-900">{recipe.additiveBPct}%</p>
                <p className="text-xs text-blue-600">±{recipe.toleranceAdditive}%</p>
              </div>
            </div>
          </div>

          {/* Live Blend Progress */}
          {selectedBatch.status === 'IN_PROGRESS' && (
            <div className="mb-6 space-y-4">
              <h4 className="font-semibold text-blue-900">Live Blending Progress</h4>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Base Oil</span>
                  <span className="text-sm font-mono text-blue-600">{blendProgress.base.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all"
                    style={{ width: `${Math.min(blendProgress.base, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Additive A</span>
                  <span className="text-sm font-mono text-blue-400">{blendProgress.addA.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min(blendProgress.addA, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Additive B</span>
                  <span className="text-sm font-mono text-green-400">{blendProgress.addB.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${Math.min(blendProgress.addB, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-slate-700 rounded">
                <div>
                  <p className="text-xs text-blue-600">Temperature</p>
                  <p className="text-lg font-bold text-blue-900">{blendProgress.temp.toFixed(1)}°C</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Pressure</p>
                  <p className="text-lg font-bold text-blue-900">{blendProgress.pressure.toFixed(2)} bar</p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            {selectedBatch.status === 'PLANNED' ? (
              <button
                onClick={handleStartBlending}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-5 h-5" />
                Start Blending
              </button>
            ) : selectedBatch.status === 'IN_PROGRESS' ? (
              <button
                onClick={handleCompleteBlending}
                className="flex-1 bg-green-500 hover:bg-green-600 text-blue-900 font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Complete Blending
              </button>
            ) : null}
          </div>
        </div>
      )}

      {!selectedBatch && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 text-center">
          <p className="text-blue-600">Select a batch to begin blending operations</p>
        </div>
      )}
    </div>
  )
}
