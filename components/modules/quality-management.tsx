'use client'

import { useState } from 'react'
import { useMES } from '@/lib/mes-context'
import { getProductById } from '@/lib/mockData'
import { CheckCircle, AlertTriangle } from 'lucide-react'

export default function QualityManagement() {
  const { batches, recordQC } = useMES()
  const [selectedBatchId, setSelectedBatchId] = useState<string>('')
  const [testResults, setTestResults] = useState({
    viscosityIndex: '',
    tan: '',
    oxidationStability: '',
  })
  const [qcDecision, setQcDecision] = useState<'PASS' | 'HOLD' | 'FAIL'>('PASS')
  const [deviationNotes, setDeviationNotes] = useState('')

  const pendingQCBatches = batches.filter(b => b.status === 'READY_FOR_QC')
  const selectedBatch = batches.find(b => b.id === selectedBatchId)
  const product = selectedBatch ? getProductById(selectedBatch.productId) : null

  const handleSubmitQC = () => {
    if (selectedBatchId) {
      recordQC(selectedBatchId, qcDecision, 'user_3')
      setSelectedBatchId('')
      setTestResults({ viscosityIndex: '', tan: '', oxidationStability: '' })
      setQcDecision('PASS')
      setDeviationNotes('')
    }
  }

  const allQCBatches = batches.filter(b => b.qcResult)

  return (
    <div className="space-y-6">
      {/* QC Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pending QC Batches */}
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Pending QC Testing ({pendingQCBatches.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pendingQCBatches.map(batch => (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`w-full text-left p-3 rounded transition-colors border ${
                    selectedBatchId === batch.id
                      ? 'bg-yellow-500 border-yellow-400 text-slate-900'
                      : 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600'
                  }`}
                >
                  <p className="font-mono font-semibold text-sm">{batch.batchNumber}</p>
                  <p className="text-xs opacity-75 mt-1">{getProductById(batch.productId)?.name}</p>
                  <p className="text-xs opacity-50 mt-1">Ready since: {batch.blendingEndTime?.toLocaleTimeString()}</p>
                </button>
              ))}
              {pendingQCBatches.length === 0 && (
                <p className="text-blue-600 text-sm py-4">No batches pending QC testing.</p>
              )}
            </div>
          </div>

          {/* QC Test Form */}
          {selectedBatch && product && (
            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-6">Test Data Entry</h3>

              {/* Batch Info */}
              <div className="mb-6 p-4 bg-slate-700 rounded">
                <p className="font-mono text-cyan-400 font-semibold">{selectedBatch.batchNumber}</p>
                <p className="text-slate-300 text-sm mt-1">{product.name}</p>
              </div>

              {/* Test Input Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Viscosity Index (Range: {product.specs.viscosityIndex.min}-{product.specs.viscosityIndex.max})
                  </label>
                  <input
                    type="number"
                    value={testResults.viscosityIndex}
                    onChange={e => setTestResults({ ...testResults, viscosityIndex: e.target.value })}
                    placeholder="Enter value"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-blue-900 text-sm"
                  />
                  {testResults.viscosityIndex && (
                    <p className={`text-xs mt-1 ${
                      Number(testResults.viscosityIndex) >= product.specs.viscosityIndex.min &&
                      Number(testResults.viscosityIndex) <= product.specs.viscosityIndex.max
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {Number(testResults.viscosityIndex) >= product.specs.viscosityIndex.min &&
                      Number(testResults.viscosityIndex) <= product.specs.viscosityIndex.max
                        ? '✓ Within specification'
                        : '✗ Out of specification'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Total Acid Number (TAN) (Range: {product.specs.tan.min}-{product.specs.tan.max})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={testResults.tan}
                    onChange={e => setTestResults({ ...testResults, tan: e.target.value })}
                    placeholder="Enter value"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-blue-900 text-sm"
                  />
                  {testResults.tan && (
                    <p className={`text-xs mt-1 ${
                      Number(testResults.tan) >= product.specs.tan.min &&
                      Number(testResults.tan) <= product.specs.tan.max
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {Number(testResults.tan) >= product.specs.tan.min &&
                      Number(testResults.tan) <= product.specs.tan.max
                        ? '✓ Within specification'
                        : '✗ Out of specification'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Oxidation Stability (Range: {product.specs.oxidationStability.min}-{product.specs.oxidationStability.max})
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={testResults.oxidationStability}
                    onChange={e => setTestResults({ ...testResults, oxidationStability: e.target.value })}
                    placeholder="Enter value"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-blue-900 text-sm"
                  />
                  {testResults.oxidationStability && (
                    <p className={`text-xs mt-1 ${
                      Number(testResults.oxidationStability) >= product.specs.oxidationStability.min &&
                      Number(testResults.oxidationStability) <= product.specs.oxidationStability.max
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {Number(testResults.oxidationStability) >= product.specs.oxidationStability.min &&
                      Number(testResults.oxidationStability) <= product.specs.oxidationStability.max
                        ? '✓ Within specification'
                        : '✗ Out of specification'}
                    </p>
                  )}
                </div>
              </div>

              {/* QC Decision */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">QC Decision</label>
                <div className="flex gap-3">
                  {(['PASS', 'HOLD', 'FAIL'] as const).map(decision => (
                    <button
                      key={decision}
                      onClick={() => setQcDecision(decision)}
                      className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${
                        qcDecision === decision
                          ? decision === 'PASS'
                            ? 'bg-green-600 text-blue-900'
                            : decision === 'HOLD'
                              ? 'bg-yellow-600 text-blue-900'
                              : 'bg-red-600 text-blue-900'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {decision}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deviation Notes */}
              {qcDecision !== 'PASS' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deviation Notes (Required for {qcDecision})
                  </label>
                  <textarea
                    value={deviationNotes}
                    onChange={e => setDeviationNotes(e.target.value)}
                    placeholder="Describe the deviation and recommended actions..."
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-blue-900 text-sm h-24"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitQC}
                disabled={!testResults.viscosityIndex || !testResults.tan || !testResults.oxidationStability}
                className={`w-full py-2 rounded font-semibold flex items-center justify-center gap-2 transition-colors ${
                  testResults.viscosityIndex && testResults.tan && testResults.oxidationStability
                    ? qcDecision === 'PASS'
                      ? 'bg-green-600 hover:bg-green-700 text-blue-900'
                      : 'bg-orange-600 hover:bg-orange-700 text-blue-900'
                    : 'bg-slate-700 text-blue-600 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Submit QC Results
              </button>
            </div>
          )}
        </div>

        {/* QC History & Stats */}
        <div className="bg-white border border-blue-200 rounded-lg p-6 h-fit">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">QC History</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allQCBatches.length === 0 ? (
              <p className="text-blue-600 text-sm">No tested batches yet.</p>
            ) : (
              allQCBatches.map(batch => (
                <div key={batch.id} className="bg-slate-700 rounded p-3 border-l-4 border-slate-600">
                  <p className="font-mono text-xs text-cyan-400 font-semibold">{batch.batchNumber}</p>
                  <p className="text-xs text-blue-600 mt-1">{getProductById(batch.productId)?.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      batch.qcResult === 'PASS'
                        ? 'bg-green-600 text-blue-900'
                        : batch.qcResult === 'FAIL'
                          ? 'bg-red-600 text-blue-900'
                          : 'bg-yellow-600 text-blue-900'
                    }`}>
                      {batch.qcResult}
                    </span>
                    <p className="text-xs text-slate-500">{batch.qcDate?.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-600 space-y-3">
            <div className="bg-slate-700 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">Pass Rate</p>
              <p className="text-xl font-bold text-green-400">
                {allQCBatches.length > 0
                  ? Math.round(
                      (allQCBatches.filter(b => b.qcResult === 'PASS').length / allQCBatches.length) * 100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <p className="text-xs text-blue-600 mb-1">Total Tested</p>
              <p className="text-xl font-bold text-blue-900">{allQCBatches.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
