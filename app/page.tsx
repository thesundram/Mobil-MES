'use client'

import React from "react"

import { useState } from 'react'
import { 
  Factory, 
  BarChart3, 
  Beaker, 
  Box, 
  ClipboardList, 
  Zap,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { currentUser } from '@/lib/mockData'
import DashboardOverview from '@/components/modules/dashboard-overview'
import ProductionPlanning from '@/components/modules/production-planning'
import BlendingControl from '@/components/modules/blending-control'
import BatchTraceability from '@/components/modules/batch-traceability'
import QualityManagement from '@/components/modules/quality-management'
import FillingPacking from '@/components/modules/filling-packing'
import KPIDashboard from '@/components/modules/kpi-dashboard'

type ModuleType = 'dashboard' | 'planning' | 'blending' | 'traceability' | 'qc' | 'filling' | 'kpi'

interface NavItem {
  id: ModuleType
  label: string
  icon: React.ReactNode
  roles: string[]
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['production_planner', 'operator', 'qa_engineer', 'plant_manager'],
  },
  {
    id: 'planning',
    label: 'Production Planning',
    icon: <ClipboardList className="w-5 h-5" />,
    roles: ['production_planner', 'plant_manager'],
  },
  {
    id: 'blending',
    label: 'Blending Control',
    icon: <Factory className="w-5 h-5" />,
    roles: ['operator', 'plant_manager'],
  },
  {
    id: 'traceability',
    label: 'Batch Traceability',
    icon: <Zap className="w-5 h-5" />,
    roles: ['qa_engineer', 'plant_manager', 'operator'],
  },
  {
    id: 'qc',
    label: 'Quality Management',
    icon: <Beaker className="w-5 h-5" />,
    roles: ['qa_engineer', 'plant_manager'],
  },
  {
    id: 'filling',
    label: 'Filling & Packing',
    icon: <Box className="w-5 h-5" />,
    roles: ['operator', 'plant_manager'],
  },
  {
    id: 'kpi',
    label: 'KPI Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['plant_manager', 'qa_engineer'],
  },
]

interface SubMenuTab {
  id: string
  label: string
}

const subMenuTabs: Record<ModuleType, SubMenuTab[]> = {
  dashboard: [],
  planning: [
    { id: 'create', label: 'Batch Creation' },
    { id: 'schedule', label: 'Production Schedule' },
    { id: 'history', label: 'Batch History' },
  ],
  blending: [],
  traceability: [],
  qc: [],
  filling: [],
  kpi: [],
}

export default function Page() {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState<string>('create')

  const accessibleItems = navItems.filter(item => item.roles.includes(currentUser.role))

  const renderModule = () => {
    switch (activeModule) {
      case 'planning':
        return <ProductionPlanning />
      case 'blending':
        return <BlendingControl />
      case 'traceability':
        return <BatchTraceability />
      case 'qc':
        return <QualityManagement />
      case 'filling':
        return <FillingPacking />
      case 'kpi':
        return <KPIDashboard />
      case 'dashboard':
      default:
        return <DashboardOverview />
    }
  }

  const currentSubMenuTabs = subMenuTabs[activeModule]
  const showSubMenu = currentSubMenuTabs.length > 0

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-blue-700 border-r border-blue-800 overflow-hidden transition-all duration-300`}
      >
        <div className="p-6 border-b border-blue-800 h-20 flex items-center">
          <div className="flex items-center gap-2 text-white">
            <Factory className="w-6 h-6" />
            <span className="font-bold text-lg hidden lg:inline">Mobil MES</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {accessibleItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id)
                setActiveSubTab('create')
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeModule === item.id
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'text-blue-100 hover:bg-blue-600'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-blue-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-blue-100 rounded-lg text-blue-700"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-2xl font-bold text-blue-900">
              {navItems.find(n => n.id === activeModule)?.label || 'Dashboard'}
            </h1>
          </div>
          
          {/* Right side: Plant Location and User Status */}
          <div className="flex items-center gap-6">
            <div className="text-right border-r border-blue-200 pr-6">
              <p className="text-sm text-blue-600">Plant Location</p>
              <p className="font-semibold text-blue-900">Singapore Refinery</p>
            </div>
            
            {/* Current User Status Card */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <p className="text-xs text-blue-600 mb-1">Current User</p>
                <p className="text-sm font-semibold text-blue-900">{currentUser.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-blue-600 capitalize">{currentUser.role.replace('_', ' ')}</span>
                  <span className="text-xs text-blue-700">• Shift {currentUser.shift}</span>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-blue-100 rounded-lg text-blue-700 hover:text-blue-900 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub Menu Bar - Appears for specific modules */}
        {showSubMenu && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 flex items-center">
            <nav className="flex gap-0">
              {currentSubMenuTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                    activeSubTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-blue-600 hover:text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Module Content */}
        <div className="flex-1 overflow-auto bg-white p-6">
          {renderModule()}
        </div>
      </div>
    </div>
  )
}
