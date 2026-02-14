'use client'

import { useState } from 'react'
import { useMES } from '@/lib/mes-context'
import { mockProducts, mockRecipes, getRecipeByProductId, mockTanks, mockFillingLines } from '@/lib/mockData'
import { Check, AlertCircle, X, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ProductionPlanning() {
  const { batches, createBatch } = useMES()
  const [selectedProduct, setSelectedProduct] = useState('prod_2')
  const [plannedQty, setPlannedQty] = useState(10)
  const [plannedStart, setPlannedStart] = useState('2026-02-10T08:00')
  const [plannedEnd, setPlannedEnd] = useState('2026-02-10T16:00')
  const [shift, setShift] = useState('A')
  const [priority, setPriority] = useState('Normal')
  const [showDraftSaved, setShowDraftSaved] = useState(false)

  const selectedProductData = mockProducts.find(p => p.id === selectedProduct)
  const selectedRecipe = getRecipeByProductId(selectedProduct)

  // Calculate target quantities
  const targetQtyBase = selectedRecipe ? (selectedRecipe.baseOilPct / 100) * plannedQty : 0
  const targetQtyAddA = selectedRecipe ? (selectedRecipe.additiveAPct / 100) * plannedQty : 0
  const targetQtyAddB = selectedRecipe ? (selectedRecipe.additiveBPct / 100) * plannedQty : 0

  // Availability check simulation
  const availabilityStatus = {
    blendingVessel: { available: true, name: 'BL-02' },
    baseOilTank: { available: true, name: 'BO-TK-03' },
    additiveTankA: { available: true, name: 'AD-TK-01' },
    additiveTankB: { available: true, name: 'AD-TK-02' },
    fillingLine: { available: false, status: 'Scheduled', name: 'FL-01' },
  }

  const validationMessages = [
    { type: 'success', message: 'Recipe approved' },
    { type: 'success', message: 'Quantity within vessel capacity' },
    { type: 'warning', message: 'Filling line overlap' },
  ]

  const handleCreateBatch = () => {
    if (plannedQty > 0 && selectedProduct) {
      createBatch(selectedProduct, plannedQty)
      setPlannedQty(10)
      setShowDraftSaved(false)
    }
  }

  const handleSaveDraft = () => {
    setShowDraftSaved(true)
    setTimeout(() => setShowDraftSaved(false), 3000)
  }

  const StatusIndicator = ({ available, status }: { available: boolean; status?: string }) => {
    if (available) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-green-400">Available</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
        <span className="text-sm text-amber-400">{status}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-900">Batch Creation</h2>
          <p className="text-blue-600 mt-1">Production Planning</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Batch Details */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Batch Details</h3>
            <div className="space-y-4">
              {/* Product Grade */}
              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase mb-2">Product Grade</label>
                <select
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 text-sm focus:border-blue-500 focus:outline-none"
                >
                  {mockProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.viscosityGrade} - {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipe Version */}
              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase mb-2">Recipe Version</label>
                <div className="bg-slate-700 px-3 py-2 rounded text-sm text-blue-300">Auto-selected</div>
              </div>

              {/* Planned Quantity */}
              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase mb-2">Planned Quantity (KL)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={plannedQty}
                  onChange={e => setPlannedQty(Number(e.target.value))}
                  className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Planned Start */}
              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase mb-2">Planned Start</label>
                <input
                  type="datetime-local"
                  value={plannedStart}
                  onChange={e => setPlannedStart(e.target.value)}
                  className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Planned End */}
              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase mb-2">Planned End</label>
                <input
                  type="datetime-local"
                  value={plannedEnd}
                  onChange={e => setPlannedEnd(e.target.value)}
                  className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Shift */}
              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase mb-2">Shift</label>
                <select
                  value={shift}
                  onChange={e => setShift(e.target.value)}
                  className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Availability Check */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Availability Check</h3>
            <div className="space-y-3">
              {/* Blending Vessel */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-blue-900">Blending Vessel</p>
                  <p className="text-xs text-blue-600">{availabilityStatus.blendingVessel.name}</p>
                </div>
                <StatusIndicator available={availabilityStatus.blendingVessel.available} />
              </div>

              {/* Base Oil Tank */}
              <div className="flex items-center justify-between py-2 border-t border-blue-200 pt-3">
                <div>
                  <p className="text-sm font-medium text-blue-900">Base Oil Tank</p>
                  <p className="text-xs text-blue-600">{availabilityStatus.baseOilTank.name}</p>
                </div>
                <StatusIndicator available={availabilityStatus.baseOilTank.available} />
              </div>

              {/* Additive Tanks */}
              <div className="py-2 border-t border-blue-200 pt-3">
                <p className="text-sm font-medium text-blue-900 mb-2">Additive Tanks</p>
                <div className="space-y-2 ml-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-600">{availabilityStatus.additiveTankA.name}</p>
                    <StatusIndicator available={availabilityStatus.additiveTankA.available} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-600">{availabilityStatus.additiveTankB.name}</p>
                    <StatusIndicator available={availabilityStatus.additiveTankB.available} />
                  </div>
                </div>
              </div>

              {/* Filling Line */}
              <div className="flex items-center justify-between py-2 border-t border-blue-200 pt-3">
                <div>
                  <p className="text-sm font-medium text-blue-900">Filling Line</p>
                  <p className="text-xs text-blue-600">{availabilityStatus.fillingLine.name}</p>
                </div>
                <StatusIndicator
                  available={availabilityStatus.fillingLine.available}
                  status={availabilityStatus.fillingLine.status}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Full Width: Recipe Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Recipe Summary (Read-Only)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-blue-600 uppercase">Ingredient</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-blue-600 uppercase">Target %</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-blue-600 uppercase">Tolerance</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-blue-600 uppercase">Target Qty (KL)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-blue-200 hover:bg-slate-700">
                    <td className="py-3 px-2 text-blue-900">Base Oil A</td>
                    <td className="py-3 px-2 text-right text-blue-600 font-semibold">
                      {selectedRecipe?.baseOilPct.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right text-blue-300">±{selectedRecipe?.toleranceBase}</td>
                    <td className="py-3 px-2 text-right text-blue-900 font-semibold">{targetQtyBase.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-blue-200 hover:bg-slate-700">
                    <td className="py-3 px-2 text-blue-900">Additive X</td>
                    <td className="py-3 px-2 text-right text-blue-600 font-semibold">
                      {selectedRecipe?.additiveAPct.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right text-blue-300">±{selectedRecipe?.toleranceAdditive}</td>
                    <td className="py-3 px-2 text-right text-blue-900 font-semibold">{targetQtyAddA.toFixed(2)}</td>
                  </tr>
                  <tr className="hover:bg-slate-700">
                    <td className="py-3 px-2 text-blue-900">Additive Y</td>
                    <td className="py-3 px-2 text-right text-blue-600 font-semibold">
                      {selectedRecipe?.additiveBPct.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right text-blue-300">±{selectedRecipe?.toleranceAdditive}</td>
                    <td className="py-3 px-2 text-right text-blue-900 font-semibold">{targetQtyAddB.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Left: Validation Messages */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Validation Messages</h3>
            <div className="space-y-2">
              {validationMessages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {msg.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${msg.type === 'success' ? 'text-green-400' : 'text-amber-400'}`}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Right: Planning Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Planning Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleCreateBatch}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-blue-900 font-semibold py-2 px-4 rounded transition-colors"
              >
                <Check className="w-5 h-5" />
                Create Batch
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-blue-900 font-semibold py-2 px-4 rounded transition-colors"
              >
                Save as Draft
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-blue-900 font-semibold py-2 px-4 rounded transition-colors">
                <X className="w-5 h-5" />
                Cancel
              </button>
              {showDraftSaved && (
                <div className="mt-3 p-3 bg-green-900 border border-green-700 rounded text-green-300 text-sm">
                  Draft saved successfully
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Planned Batches */}
      <div className="bg-white border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Recent Planned Batches ({batches.filter(b => b.status === 'PLANNED').length})
        </h3>
        {batches.filter(b => b.status === 'PLANNED').length === 0 ? (
          <p className="text-blue-600 text-sm">No planned batches. Create one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches
              .filter(b => b.status === 'PLANNED')
              .slice(0, 3)
              .map(batch => (
                <div key={batch.id} className="bg-slate-700 rounded p-4 border border-slate-600">
                  <p className="font-mono text-blue-600 font-semibold text-sm">{batch.batchNumber}</p>
                  <p className="text-blue-300 text-sm mt-2">
                    {mockProducts.find(p => p.id === batch.productId)?.viscosityGrade}
                  </p>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{batch.plannedQtyKL}</p>
                      <p className="text-blue-600 text-xs">KL</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded">PLANNED</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
