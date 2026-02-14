# Mobil MES - Manufacturing Execution System

A professional Manufacturing Execution System (MES) web application designed for Mobil oil and lubricant manufacturing operations. This demonstration platform showcases critical production workflows from planning through dispatch, with realistic data modeling and industry-standard UI patterns.

## Project Overview

**Purpose**: Credible sales and pilot demonstration tool for stakeholders including Plant Heads, QA Managers, and Operations VPs.

**Target Users**:
- Production Planners: Create and manage daily production schedules
- Shift Operators: Execute blending and filling operations
- QA Engineers: Conduct quality testing and batch release decisions
- Plant Managers: Monitor KPIs and operational performance

## Architecture

### Tech Stack
- **Frontend**: Next.js 16 with React 19 (App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charting**: Recharts for KPI visualization
- **State Management**: React Context API with custom hooks
- **Database**: Mock in-memory data layer (no external integrations)

### Core Structure

```
/components
  /modules          # Feature-specific modules
    - dashboard-overview.tsx    # Real-time KPI summary
    - production-planning.tsx   # Batch creation and scheduling
    - blending-control.tsx      # Recipe master and live blending
    - batch-traceability.tsx    # Complete lifecycle timeline
    - quality-management.tsx    # QC testing and batch release
    - filling-packing.tsx       # Filling line operations
    - kpi-dashboard.tsx         # Analytics and trends

/lib
  - mockData.ts      # Product specs, tank inventory, user roles
  - mes-context.tsx  # Global batch state management

/app
  - page.tsx         # Main dashboard with navigation
  - layout.tsx       # Root layout with MES provider
```

## Feature Modules

### 1. Dashboard Overview
- Real-time KPI cards (Yield %, Quality Loss %, Cycle Time, Energy/KL)
- Batch status distribution visualization
- Recent batches table with sortable columns
- Quick access to critical metrics

### 2. Production Planning
- Create new batches with product/quantity selection
- Automatic tank capacity validation
- Planned batch queue management
- Production schedule summary

### 3. Blending Control
- Batch selection from available queue
- Recipe master display with tolerance bands
- Live blending progress with real-time metrics (temperature, pressure)
- Automatic progress simulation via mock PLC data
- Start/Complete blending controls

### 4. Batch Traceability
- Complete batch lifecycle timeline (5 stages)
- Batch details with operator and shift info
- Stage-by-stage timestamp logging
- QC result and fill volume tracking
- Batch search and filtering

### 5. Quality Management
- Pending QC test queue
- Lab test data entry (Viscosity Index, TAN, Oxidation Stability)
- Automated spec validation with visual feedback
- QC decision interface (PASS/HOLD/FAIL)
- Deviation notes for non-compliant batches
- QC history with pass rate metrics

### 6. Filling & Packing
- QC-approved batch queue
- Filling line selection with status display
- Real-time fill level and flow rate metrics
- Planned vs actual quantity tracking
- Start/Complete filling controls
- Filling statistics dashboard

### 7. KPI Dashboard
- Multiple chart types (line, bar, pie)
- Yield vs Quality trend analysis
- Product distribution breakdown
- Energy consumption trends
- Shift-level performance comparison
- Production summary cards

## Demo Flow (10-12 Clicks)

A complete batch lifecycle can be demonstrated in approximately 2 minutes:

1. **Production Planning** (1-2 clicks)
   - Click "Create Batch" → Select product → Enter quantity → Create

2. **Blending Operations** (2-3 clicks)
   - Click "Blending Control" → Select batch → Start Blending → (auto-completes with progress)

3. **Quality Testing** (2-3 clicks)
   - Click "Quality Management" → Select batch → Enter test values → Submit PASS

4. **Filling & Dispatch** (2-3 clicks)
   - Click "Filling & Packing" → Select batch → Select line → Start Fill → Complete Fill

5. **Results Verification** (1 click)
   - Click "Dashboard" → View updated KPIs and batch in recent table

## Data Model

### Key Entities

**Products** (Realistic Mobil Portfolio)
- Mobil 1 5W-30 (Synthetic PAO)
- Mobil 1 10W-40 (Synthetic PAO)
- Mobil DTE 10 Excel (Mineral)

Each product includes:
- Viscosity specifications with tolerance bands
- TAN (Total Acid Number) limits
- Oxidation stability requirements

**Batches** (Full Lifecycle)
```
- ID, Batch Number (B-2026-XXXX)
- Product reference
- Planned and actual quantities (KL)
- Status (PLANNED → IN_PROGRESS → READY_FOR_QC → READY_FOR_FILLING → FILLING → DISPATCHED)
- Timestamps for each stage
- QC result (PASS/HOLD/FAIL)
- Operator and shift assignments
```

**Recipes** (Additive Mix Formulations)
```
- Base Oil: 80-90%
- Additive A: 5-12%
- Additive B: 3-8%
- Tolerance bands: ±1-2%
```

**Infrastructure**
- 4 Storage/Blend Tanks (50-100 KL each)
- 3 Filling Lines (2 operational, 1 in maintenance)
- User roles with RBAC (Production Planner, Operator, QA, Manager)

## User Experience Highlights

### Visual Design
- **Dark industrial theme**: Slate-950 background with cyan/blue accents
- **Professional typography**: Clean sans-serif with monospace for IDs/values
- **Minimal cognitive load**: Single-purpose screens with focused workflows
- **Status indicators**: Color-coded badges (green=ready, amber=warning, red=alert)
- **Real-time updates**: Live progress bars and auto-refreshing metrics

### Workflow Optimization
- **Role-based navigation**: Users only see relevant modules
- **Progressive disclosure**: Complex data revealed on demand
- **Consistent patterns**: Similar controls across all modules
- **Quick actions**: Most operations complete in 1-2 clicks
- **Clear feedback**: Status changes reflected immediately

## Demo Talking Points

1. **End-to-End Visibility**
   - Every stage of production captured in timeline
   - Complete audit trail from planning to dispatch
   - Operator accountability throughout process

2. **Quality Assurance**
   - Automated specification validation
   - Deviation tracking and documentation
   - Batch hold/release workflow prevents non-conforming products

3. **Operational Efficiency**
   - Real-time KPI monitoring drives continuous improvement
   - Cycle time optimization reduces queues and cost
   - Energy consumption tracking identifies inefficiencies

4. **Data-Driven Decisions**
   - Historical batch trends guide future planning
   - Shift performance comparison enables best practice sharing
   - Product mix analysis optimizes tank allocation

5. **Regulatory Compliance**
   - Complete traceability for recall management
   - Documented QC decisions for audits
   - Timestamp logging for regulatory requirements

## Deployment & Customization

### Running Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Customization Points
- Add real database: Replace mock data with PostgreSQL queries
- Integrate PLC/IoT: Connect live blending metrics to actual equipment
- Add authentication: Implement multi-tenant user management
- Export compliance: Generate PDF reports and audit trails
- Mobile support: Responsive design works on tablets for shop floor

### Production Roadmap
- Real database integration (Neon PostgreSQL)
- PLC/SCADA data ingestion via MQTT or REST
- User authentication with role-based access
- Historical data archival and reporting
- Mobile app for shift floor operations
- Integration with ERP systems (SAP, Oracle)

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main layout with sidebar navigation |
| `lib/mockData.ts` | Product specs, initial batch samples, KPI calculations |
| `lib/mes-context.tsx` | Global state for batch operations |
| `components/modules/*.tsx` | Individual feature modules |

## Notes for Presenters

- **Load Time**: Instant (no API delays) - perfect for demonstrations
- **Sample Data**: Pre-populated with realistic batches in various states
- **Role Switching**: Current user is Ahmed Operator (can hardcode different roles in mockData.ts)
- **Mock PLC Data**: Blending progress simulates realistic 60-second blend cycles
- **KPI Accuracy**: All calculations are deterministic based on batch data
- **Responsive**: Works on desktop, tablet, and mobile (with CSS adjustments)

## Future Enhancements

- Multi-plant support with location-specific dashboards
- Predictive analytics for cycle time estimation
- Integration with maintenance scheduling system
- Advanced reporting with custom date ranges
- Email notifications for batch status milestones
- Mobile app with offline capability
- Real-time capacity planning optimization

---

**Version**: 1.0 Demonstration  
**Last Updated**: February 2026  
**Target Audience**: Executive sponsors, plant operations teams, quality assurance leads

## License

© **2026** Designed by **Sundram Pandey** - **Uttam Innovative Solution Pvt. Ltd.**

## Support

For support and inquiries, please contact **Uttam Innovative Solution Pvt. Ltd.**