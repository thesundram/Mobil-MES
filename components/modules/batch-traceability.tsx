'use client'

import { useState } from 'react'
import { useMES } from '@/lib/mes-context'
import { getProductById, getUserById } from '@/lib/mockData'
import { ChevronRight } from 'lucide-react'

export default function BatchTraceability() {
  const { batches } = useMES()
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '')

  const selectedBatch = batches.find(b => b.id === selectedBatchId)

  const stages = [
    {
      id: 'created',
      name: 'Created',
      status: selectedBatch ? 'complete' : 'pending',
      time: selectedBatch?.createdAt,
      details: selectedBatch ? `by ${getUserById(selectedBatch.operatorId)?.name}` : '',
    },
    {
      id: 'blending',
      name: 'Blending',
      status: selectedBatch?.blendingStartTime ? (selectedBatch.blendingEndTime ? 'complete' : 'in-progress') : 'pending',
      time: selectedBatch?.blendingStartTime,
      endTime: selectedBatch?.blendingEndTime,
    },
    {
      id: 'qc',
      name: 'QC Testing',
      status: selectedBatch?.qcResult ? 'complete' : selectedBatch?.status === 'READY_FOR_QC' ? 'pending' : selectedBatch?.status.includes('READY_FOR_FILLING') || selectedBatch?.status === 'FILLING' || selectedBatch?.status === 'DISPATCHED' ? 'complete' : 'pending',
      time: selectedBatch?.qcDate,
      details: selectedBatch?.qcResult ? `Result: ${selectedBatch.qcResult}` : '',
      engineer: selectedBatch?.qcEnginerId ? getUserById(selectedBatch.qcEnginerId)?.name : '',
    },
    {
      id: 'filling',
      name: 'Filling',
      status: selectedBatch?.fillingStartTime ? (selectedBatch.fillingEndTime ? 'complete' : 'in-progress') : 'pending',
      time: selectedBatch?.fillingStartTime,
      endTime: selectedBatch?.fillingEndTime,
    },
    {
      id: 'dispatch',
      name: 'Dispatched',
      status: selectedBatch?.status === 'DISPATCHED' ? 'complete' : 'pending',
      time: selectedBatch?.dispatchedAt,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Batch Selection */}
      <div className="bg-white border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Select Batch</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {batches.map(batch => (
            <button
              key={batch.id}
              onClick={() => setSelectedBatchId(batch.id)}
              className={`text-left p-3 rounded transition-colors border ${
                selectedBatchId === batch.id
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100'
              }`}
            >
              <p className="font-mono font-semibold text-sm">{batch.batchNumber}</p>
              <p className="text-xs opacity-75 mt-1">{getProductById(batch.productId)?.name}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedBatch && (
        <>
          {/* Batch Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1">Batch ID</p>
              <p className="font-mono font-bold text-blue-600 text-lg">{selectedBatch.batchNumber}</p>
            </div>
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1">Product</p>
              <p className="font-semibold text-blue-900">{getProductById(selectedBatch.productId)?.name}</p>
            </div>
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1">Quantity</p>
              <p className="font-bold text-blue-900 text-lg">{selectedBatch.plannedQtyKL} KL</p>
            </div>
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1">Current Status</p>
              <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${
                selectedBatch.status === 'DISPATCHED' ? 'bg-green-600 text-blue-900' :
                selectedBatch.status === 'READY_FOR_QC' ? 'bg-yellow-600 text-blue-900' :
                selectedBatch.status === 'READY_FOR_FILLING' ? 'bg-blue-600 text-blue-900' :
                selectedBatch.status === 'IN_PROGRESS' ? 'bg-blue-600 text-blue-900' :
                'bg-blue-200 text-slate-100'
              }`}>
                {selectedBatch.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-6">Batch Timeline</h3>
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  <div className="flex items-start gap-4">
                    {/* Timeline Node */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        stage.status === 'complete'
                          ? 'bg-green-500 text-blue-900'
                          : stage.status === 'in-progress'
                            ? 'bg-blue-500 text-blue-900'
                            : 'bg-blue-200 text-blue-600'
                      }`}>
                        {stage.status === 'complete' ? '✓' : stage.status === 'in-progress' ? '●' : '○'}
                      </div>
                      {index < stages.length - 1 && (
                        <div className="w-0.5 h-20 bg-blue-200 mt-2"></div>
                      )}
                    </div>

                    {/* Stage Details */}
                    <div className="flex-1 py-1">
                      <h4 className="font-semibold text-blue-900">{stage.name}</h4>
                      {stage.time && (
                        <p className="text-xs text-blue-600 mt-1">
                          Started: {stage.time.toLocaleString()}
                        </p>
                      )}
                      {stage.endTime && (
                        <p className="text-xs text-blue-600">
                          Completed: {stage.endTime.toLocaleString()}
                        </p>
                      )}
                      {stage.details && (
                        <p className="text-sm text-blue-300 mt-1">{stage.details}</p>
                      )}
                      {stage.engineer && (
                        <p className="text-xs text-blue-600 mt-1">Engineer: {stage.engineer}</p>
                      )}
                      {stage.status === 'pending' && (
                        <p className="text-xs text-slate-500 mt-1">Pending...</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Operator & Shift Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-blue-600 mb-1">Operator</p>
                  <p className="font-semibold text-blue-900">{getUserById(selectedBatch.operatorId)?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Shift</p>
                  <p className="font-semibold text-blue-900">Shift {selectedBatch.shift}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Created At</p>
                  <p className="font-mono text-sm text-blue-600">
                    {selectedBatch.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Quality & Filling Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-blue-600 mb-1">QC Result</p>
                  {selectedBatch.qcResult ? (
                    <span className={`px-2 py-1 rounded text-xs font-bold inline-block ${
                      selectedBatch.qcResult === 'PASS'
                        ? 'bg-green-600 text-blue-900'
                        : selectedBatch.qcResult === 'FAIL'
                          ? 'bg-red-600 text-blue-900'
                          : 'bg-yellow-600 text-blue-900'
                    }`}>
                      {selectedBatch.qcResult}
                    </span>
                  ) : (
                    <p className="text-blue-600 text-sm">Not tested</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Planned vs Actual</p>
                  <p className="font-semibold text-blue-900">
                    {selectedBatch.plannedQtyKL} KL → {selectedBatch.actualQtyKL} KL
                  </p>
                  {selectedBatch.actualQtyKL > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      Yield: {((selectedBatch.actualQtyKL / selectedBatch.plannedQtyKL) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
