'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Batch, generateSampleBatches, mockFillingLines, mockProducts, mockTanks } from '@/lib/mockData'

interface MESContextType {
  batches: Batch[]
  createBatch: (productId: string, plannedQtyKL: number) => void
  updateBatchStatus: (batchId: string, newStatus: Batch['status']) => void
  startBlending: (batchId: string) => void
  completeBlending: (batchId: string) => void
  recordQC: (batchId: string, result: 'PASS' | 'HOLD' | 'FAIL', engineerId: string) => void
  startFilling: (batchId: string, lineId: string) => void
  completeFilling: (batchId: string, actualQtyKL: number) => void
  getBlendingProgress: (batchId: string) => { base: number; addA: number; addB: number; temp: number; pressure: number }
}

const MESContext = createContext<MESContextType | undefined>(undefined)

export function MESProvider({ children }: { children: React.ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>(generateSampleBatches())

  const createBatch = useCallback((productId: string, plannedQtyKL: number) => {
    const newBatch: Batch = {
      id: `batch_${Date.now()}`,
      batchNumber: `B-2026-00${batches.length + 2501}`,
      productId,
      plannedQtyKL,
      actualQtyKL: 0,
      status: 'PLANNED',
      operatorId: 'user_2',
      shift: 'A',
      createdAt: new Date(),
    }
    setBatches(prev => [newBatch, ...prev])
  }, [batches.length])

  const updateBatchStatus = useCallback((batchId: string, newStatus: Batch['status']) => {
    setBatches(prev =>
      prev.map(batch =>
        batch.id === batchId ? { ...batch, status: newStatus } : batch
      )
    )
  }, [])

  const startBlending = useCallback((batchId: string) => {
    setBatches(prev =>
      prev.map(batch =>
        batch.id === batchId
          ? { ...batch, status: 'IN_PROGRESS', blendingStartTime: new Date() }
          : batch
      )
    )
  }, [])

  const completeBlending = useCallback((batchId: string) => {
    setBatches(prev =>
      prev.map(batch =>
        batch.id === batchId
          ? { ...batch, status: 'READY_FOR_QC', blendingEndTime: new Date(), actualQtyKL: batch.plannedQtyKL }
          : batch
      )
    )
  }, [])

  const recordQC = useCallback((batchId: string, result: 'PASS' | 'HOLD' | 'FAIL', engineerId: string) => {
    setBatches(prev =>
      prev.map(batch =>
        batch.id === batchId
          ? {
              ...batch,
              status: result === 'PASS' ? 'READY_FOR_FILLING' : result === 'FAIL' ? 'PLANNED' : 'READY_FOR_QC',
              qcResult: result,
              qcEnginerId: engineerId,
              qcDate: new Date(),
            }
          : batch
      )
    )
  }, [])

  const startFilling = useCallback((batchId: string, lineId: string) => {
    setBatches(prev =>
      prev.map(batch =>
        batch.id === batchId
          ? { ...batch, status: 'FILLING', fillingLineId: lineId, fillingStartTime: new Date() }
          : batch
      )
    )
  }, [])

  const completeFilling = useCallback((batchId: string, actualQtyKL: number) => {
    setBatches(prev =>
      prev.map(batch =>
        batch.id === batchId
          ? {
              ...batch,
              status: 'DISPATCHED',
              actualQtyKL,
              fillingEndTime: new Date(),
              dispatchedAt: new Date(),
            }
          : batch
      )
    )
  }, [])

  const getBlendingProgress = useCallback((batchId: string) => {
    const batch = batches.find(b => b.id === batchId)
    if (!batch || batch.status !== 'IN_PROGRESS') {
      return { base: 0, addA: 0, addB: 0, temp: 0, pressure: 0 }
    }

    const recipe = mockProducts.find(p => p.id === batch.productId)
    if (!recipe) return { base: 0, addA: 0, addB: 0, temp: 0, pressure: 0 }

    // Simulate blending progress based on time elapsed
    const startTime = batch.blendingStartTime?.getTime() || Date.now()
    const elapsedSeconds = (Date.now() - startTime) / 1000
    const progressPct = Math.min(elapsedSeconds / 60, 1) // 60 second blend time in demo

    // Add some realistic variation
    const randomVariation = (max: number) => (Math.random() - 0.5) * max

    return {
      base: Math.min(85 + progressPct * 15 + randomVariation(2), 100),
      addA: Math.min(10 + progressPct * 5 + randomVariation(1), 100),
      addB: Math.min(5 + progressPct * 2 + randomVariation(0.5), 100),
      temp: 20 + progressPct * 60 + randomVariation(3),
      pressure: 1 + progressPct * 2.5 + randomVariation(0.1),
    }
  }, [batches])

  return (
    <MESContext.Provider value={{ batches, createBatch, updateBatchStatus, startBlending, completeBlending, recordQC, startFilling, completeFilling, getBlendingProgress }}>
      {children}
    </MESContext.Provider>
  )
}

export function useMES() {
  const context = useContext(MESContext)
  if (!context) {
    throw new Error('useMES must be used within a MESProvider')
  }
  return context
}
