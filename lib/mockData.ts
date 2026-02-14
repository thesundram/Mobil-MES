// Mock data and utilities for MES demonstration
// This simulates a realistic ERP/MES database without external integrations

export type UserRole = 'production_planner' | 'operator' | 'qa_engineer' | 'plant_manager'

export type BatchStatus = 
  | 'PLANNED' 
  | 'IN_PROGRESS' 
  | 'READY_FOR_QC' 
  | 'READY_FOR_FILLING' 
  | 'FILLING' 
  | 'FILLED' 
  | 'DISPATCHED'

export interface User {
  id: string
  name: string
  role: UserRole
  shift: 'A' | 'B' | 'C'
}

export interface Product {
  id: string
  name: string
  viscosityGrade: string
  baseOilType: string
  specs: {
    viscosityIndex: { min: number; max: number }
    tan: { min: number; max: number }
    oxidationStability: { min: number; max: number }
  }
}

export interface Recipe {
  id: string
  productId: string
  baseOilPct: number
  additiveAPct: number
  additiveBPct: number
  toleranceBase: number
  toleranceAdditive: number
}

export interface Tank {
  id: string
  name: string
  capacityKL: number
  currentLevelKL: number
  status: 'empty' | 'idle' | 'in_use'
}

export interface FillingLine {
  id: string
  name: string
  status: 'idle' | 'filling' | 'maintenance'
}

export interface Batch {
  id: string
  batchNumber: string
  productId: string
  plannedQtyKL: number
  actualQtyKL: number
  status: BatchStatus
  operatorId: string
  shift: string
  createdAt: Date
  blendingStartTime?: Date
  blendingEndTime?: Date
  fillingLineId?: string
  fillingStartTime?: Date
  fillingEndTime?: Date
  qcResult?: 'PASS' | 'HOLD' | 'FAIL'
  qcEnginerId?: string
  qcDate?: Date
  dispatchedAt?: Date
}

export interface BlendingData {
  batchId: string
  baseOilActual: number
  additiveAActual: number
  additiveBActual: number
  temperature: number
  pressure: number
  timestamp: Date
}

// Mock Products (Mobil Portfolio)
export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Mobil 1 5W-30',
    viscosityGrade: '5W-30',
    baseOilType: 'Synthetic PAO',
    specs: {
      viscosityIndex: { min: 95, max: 105 },
      tan: { min: 0.5, max: 1.2 },
      oxidationStability: { min: 900, max: 1100 },
    },
  },
  {
    id: 'prod_2',
    name: 'Mobil 1 10W-40',
    viscosityGrade: '10W-40',
    baseOilType: 'Synthetic PAO',
    specs: {
      viscosityIndex: { min: 95, max: 110 },
      tan: { min: 0.6, max: 1.3 },
      oxidationStability: { min: 850, max: 1050 },
    },
  },
  {
    id: 'prod_3',
    name: 'Mobil DTE 10 Excel',
    viscosityGrade: '46',
    baseOilType: 'Mineral',
    specs: {
      viscosityIndex: { min: 80, max: 100 },
      tan: { min: 0.3, max: 0.8 },
      oxidationStability: { min: 500, max: 700 },
    },
  },
]

// Mock Recipes
export const mockRecipes: Recipe[] = [
  {
    id: 'rec_1',
    productId: 'prod_1',
    baseOilPct: 85,
    additiveAPct: 10,
    additiveBPct: 5,
    toleranceBase: 2,
    toleranceAdditive: 1,
  },
  {
    id: 'rec_2',
    productId: 'prod_2',
    baseOilPct: 80,
    additiveAPct: 12,
    additiveBPct: 8,
    toleranceBase: 2,
    toleranceAdditive: 1,
  },
  {
    id: 'rec_3',
    productId: 'prod_3',
    baseOilPct: 90,
    additiveAPct: 7,
    additiveBPct: 3,
    toleranceBase: 2,
    toleranceAdditive: 1,
  },
]

// Mock Tanks
export const mockTanks: Tank[] = [
  { id: 'tank_1', name: 'Storage Tank A1', capacityKL: 100, currentLevelKL: 85, status: 'idle' },
  { id: 'tank_2', name: 'Storage Tank A2', capacityKL: 100, currentLevelKL: 60, status: 'idle' },
  { id: 'tank_3', name: 'Blend Tank B1', capacityKL: 50, currentLevelKL: 0, status: 'empty' },
  { id: 'tank_4', name: 'Blend Tank B2', capacityKL: 50, currentLevelKL: 35, status: 'idle' },
]

// Mock Filling Lines
export const mockFillingLines: FillingLine[] = [
  { id: 'line_1', name: 'Filling Line 01', status: 'idle' },
  { id: 'line_2', name: 'Filling Line 02', status: 'idle' },
  { id: 'line_3', name: 'Filling Line 03', status: 'maintenance' },
]

// Mock Users
export const mockUsers: User[] = [
  { id: 'user_1', name: 'John Planner', role: 'production_planner', shift: 'A' },
  { id: 'user_2', name: 'Ahmed Operator', role: 'operator', shift: 'A' },
  { id: 'user_3', name: 'Sarah QA', role: 'qa_engineer', shift: 'A' },
  { id: 'user_4', name: 'Michael VP', role: 'plant_manager', shift: 'A' },
]

  // Current logged-in user (simulated)
  export const currentUser: User = mockUsers[3] // Michael VP - Plant Manager

// Generate sample batches in various states for demo
export const generateSampleBatches = (): Batch[] => {
  const now = new Date()
  return [
    {
      id: 'batch_001',
      batchNumber: 'B-2026-002501',
      productId: 'prod_1',
      plannedQtyKL: 10,
      actualQtyKL: 0,
      status: 'PLANNED',
      operatorId: 'user_2',
      shift: 'A',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'batch_002',
      batchNumber: 'B-2026-002502',
      productId: 'prod_2',
      plannedQtyKL: 15,
      actualQtyKL: 0,
      status: 'IN_PROGRESS',
      operatorId: 'user_2',
      shift: 'A',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      blendingStartTime: new Date(now.getTime() - 30 * 60 * 1000),
    },
    {
      id: 'batch_003',
      batchNumber: 'B-2026-002503',
      productId: 'prod_1',
      plannedQtyKL: 12,
      actualQtyKL: 0,
      status: 'READY_FOR_QC',
      operatorId: 'user_2',
      shift: 'A',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      blendingStartTime: new Date(now.getTime() - 2.5 * 60 * 60 * 1000),
      blendingEndTime: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
    },
    {
      id: 'batch_004',
      batchNumber: 'B-2026-002504',
      productId: 'prod_2',
      plannedQtyKL: 10,
      actualQtyKL: 10,
      status: 'READY_FOR_FILLING',
      operatorId: 'user_2',
      shift: 'A',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      blendingStartTime: new Date(now.getTime() - 4.5 * 60 * 60 * 1000),
      blendingEndTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      qcResult: 'PASS',
      qcEnginerId: 'user_3',
      qcDate: new Date(now.getTime() - 3.5 * 60 * 60 * 1000),
    },
    {
      id: 'batch_005',
      batchNumber: 'B-2026-002505',
      productId: 'prod_1',
      plannedQtyKL: 8,
      actualQtyKL: 8,
      status: 'DISPATCHED',
      operatorId: 'user_2',
      shift: 'A',
      createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
      blendingStartTime: new Date(now.getTime() - 7.5 * 60 * 60 * 1000),
      blendingEndTime: new Date(now.getTime() - 7 * 60 * 60 * 1000),
      fillingLineId: 'line_1',
      fillingStartTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      fillingEndTime: new Date(now.getTime() - 4.5 * 60 * 60 * 1000),
      qcResult: 'PASS',
      qcEnginerId: 'user_3',
      qcDate: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      dispatchedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
  ]
}

// Helper functions
export const getProductById = (id: string) => mockProducts.find(p => p.id === id)
export const getRecipeByProductId = (productId: string) => mockRecipes.find(r => r.productId === productId)
export const getUserById = (id: string) => mockUsers.find(u => u.id === id)

// Calculate KPIs
export interface KPIs {
  yieldPct: number
  qualityLossPct: number
  avgCycleTimeHours: number
  energyPerKL: number
  batchesPlanned: number
  batchesCompleted: number
}

export const calculateKPIs = (batches: Batch[]): KPIs => {
  const completed = batches.filter(b => b.status === 'DISPATCHED')
  const failed = batches.filter(b => b.qcResult === 'FAIL')
  
  const totalPlanned = batches.reduce((sum, b) => sum + b.plannedQtyKL, 0)
  const totalActual = batches.filter(b => b.status === 'DISPATCHED').reduce((sum, b) => sum + b.actualQtyKL, 0)
  
  const cycleTimes = completed
    .filter(b => b.blendingStartTime && b.dispatchedAt)
    .map(b => (b.dispatchedAt!.getTime() - b.blendingStartTime!.getTime()) / (1000 * 60 * 60))
  
  return {
    yieldPct: totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0,
    qualityLossPct: batches.length > 0 ? Math.round((failed.length / batches.length) * 100) : 0,
    avgCycleTimeHours: cycleTimes.length > 0 ? Math.round((cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length) * 10) / 10 : 0,
    energyPerKL: 2.45,
    batchesPlanned: batches.length,
    batchesCompleted: completed.length,
  }
}
