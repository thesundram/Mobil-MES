'use client'

import { useState } from 'react'
import { useMES } from '@/lib/mes-context'
import { getProductById, mockFillingLines } from '@/lib/mockData'
import { Play, CheckCircle } from 'lucide-react'

export default function FillingPacking() {
  const { batches, startFilling, completeFilling } = useMES()
  const [selectedBatchId, setSelectedBatchId] = useState<string>('')
  const [selectedLineId, setSelectedLineId] = useState<string>(mockFillingLines[0]?.id || '')
  const [fillingStarted, setFillingStarted] = useState(false)

  const readyForFillingBatches = batches.filter(b => b.status === 'READY_FOR_FILLING')
  const fillingBatches = batches.filter(b => b.status === 'FILLING')
  const selectedBatch = batches.find(b => b.id === selectedBatchId)

  const handleStartFilling = () => {
    if (selectedBatchId && selectedLineId) {
      startFilling(selectedBatchId, selectedLineId)
      setFillingStarted(true)
    }
  }

  const handleCompleteFilling = () => {
    if (selectedBatchId && selectedBatch) {
      completeFilling(selectedBatchId, selectedBatch.plannedQtyKL)
      setSelectedBatchId('')
      setFillingStarted(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Batch Selection */}
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Ready for Filling ({readyForFillingBatches.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {readyForFillingBatches.map(batch => (
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
              {readyForFillingBatches.length === 0 && (
                <p className="text-blue-600 text-sm">No batches ready for filling.</p>
              )}
            </div>
          </div>

          {/* Currently Filling */}
          {fillingBatches.length > 0 && (
            <div className="bg-slate-800 border border-blue-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Currently Filling</h3>
              <div className="space-y-2">
                {fillingBatches.map(batch => (
                  <button
                    key={batch.id}
                    onClick={() => setSelectedBatchId(batch.id)}
                    className={`w-full text-left p-3 rounded transition-colors ${
                      selectedBatchId === batch.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-100 hover:bg-blue-800'
                    }`}
                  >
                    <p className="font-mono font-semibold">{batch.batchNumber}</p>
                    <p className="text-sm opacity-75">
                      Line: {mockFillingLines.find(l => l.id === batch.fillingLineId)?.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filling Line Selection & Operation */}
          {selectedBatch && (
            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Filling Operations</h3>

              {/* Batch Summary */}
              <div className="mb-6 p-4 bg-blue-100 rounded">
                <p className="font-mono text-blue-600 font-semibold">{selectedBatch.batchNumber}</p>
                <p className="text-slate-300 text-sm mt-1">{getProductById(selectedBatch.productId)?.name}</p>
                <p className="text-lg font-bold text-blue-900 mt-2">Target: {selectedBatch.plannedQtyKL} KL</p>
              </div>

              {/* Line Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Select Filling Line</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mockFillingLines.map(line => (
                    <button
                      key={line.id}
                      onClick={() => setSelectedLineId(line.id)}
                      disabled={line.status === 'maintenance' || (selectedBatch.status === 'FILLING' && !fillingStarted)}
                      className={`p-3 rounded transition-colors text-left text-sm ${
                        selectedLineId === line.id
                          ? 'bg-blue-500 text-white font-semibold'
                          : line.status === 'maintenance'
                            ? 'bg-slate-600 text-blue-600 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                      }`}
                    >
                      <p className="font-semibold">{line.name}</p>
                      <p className="text-xs opacity-75 capitalize">{line.status}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filling Metrics */}
              <div className="mb-6 p-4 bg-blue-100 rounded space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Fill Level</span>
                    <span className="font-mono text-blue-600">
                      {selectedBatch.status === 'FILLING' ? (Math.random() * 100).toFixed(1) : '0'}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-600 rounded overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all"
                      style={{
                        width: selectedBatch.status === 'FILLING' ? `${(Math.random() * 100).toFixed(1)}%` : '0%',
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-blue-600 mb-1">Flow Rate</p>
                  <p className="text-lg font-bold text-blue-900">
                    {selectedBatch.status === 'FILLING' ? '12.5 KL/min' : '0 KL/min'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-blue-600 mb-1">Elapsed Time</p>
                  <p className="text-lg font-bold text-blue-900">
                    {selectedBatch.status === 'FILLING' && selectedBatch.fillingStartTime
                      ? `${Math.floor(
                          (Date.now() - selectedBatch.fillingStartTime.getTime()) / 1000 / 60
                        )} minutes`
                      : '0 minutes'}
                  </p>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3">
                {selectedBatch.status === 'READY_FOR_FILLING' ? (
                  <button
                    onClick={handleStartFilling}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-slate-950 font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Start Filling
                  </button>
                ) : selectedBatch.status === 'FILLING' ? (
                  <button
                    onClick={handleCompleteFilling}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-blue-900 font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete Filling
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Fill Statistics */}
        <div className="bg-white border border-blue-200 rounded-lg p-6 h-fit">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Filling Statistics</h3>

          <div className="space-y-4">
            <div className="bg-blue-100 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">Ready for Filling</p>
              <p className="text-2xl font-bold text-blue-900">{readyForFillingBatches.length}</p>
            </div>

            <div className="bg-blue-100 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">Currently Filling</p>
              <p className="text-2xl font-bold text-blue-600">{fillingBatches.length}</p>
            </div>

            <div className="bg-blue-100 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">Total Volume Ready</p>
              <p className="text-2xl font-bold text-blue-900">
                {readyForFillingBatches.reduce((sum, b) => sum + b.plannedQtyKL, 0)} KL
              </p>
            </div>

            <div className="bg-blue-100 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">Avg Fill Time</p>
              <p className="text-2xl font-bold text-blue-900">22 min</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">Available Lines</h4>
            <div className="space-y-2">
              {mockFillingLines.map(line => (
                <div key={line.id} className="flex items-center justify-between text-sm">
                  <p className="text-slate-300">{line.name}</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    line.status === 'idle'
                      ? 'bg-green-600 text-blue-900'
                      : line.status === 'filling'
                        ? 'bg-blue-600 text-blue-900'
                        : 'bg-orange-600 text-blue-900'
                  }`}>
                    {line.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
