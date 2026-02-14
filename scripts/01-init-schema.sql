-- ============================================================================
-- MES DATABASE SCHEMA - MOBIL OIL MANUFACTURING
-- ============================================================================

-- ============================================================================
-- USERS & ROLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'planner', 'operator', 'qa_engineer', 'manager'
  shift VARCHAR(20), -- 'morning', 'afternoon', 'night'
  email VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PRODUCTS & RECIPES
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  viscosity_grade VARCHAR(20) NOT NULL, -- e.g., '5W-30', '10W-40'
  base_oil_type VARCHAR(100), -- e.g., 'Paraffinic', 'Naphthenic'
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS additives (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(100), -- e.g., 'anti-wear', 'detergent', 'oxidation-inhibitor'
  description TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  base_oil_pct DECIMAL(5, 2) NOT NULL,
  additive_a_id INTEGER REFERENCES additives(id),
  additive_a_pct DECIMAL(5, 2),
  additive_b_id INTEGER REFERENCES additives(id),
  additive_b_pct DECIMAL(5, 2),
  additive_c_id INTEGER REFERENCES additives(id),
  additive_c_pct DECIMAL(5, 2),
  tolerance_pct DECIMAL(3, 1) DEFAULT 2.0, -- ±% tolerance
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- EQUIPMENT: TANKS, VESSELS, FILLING LINES
-- ============================================================================
CREATE TABLE IF NOT EXISTS tanks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tank_type VARCHAR(50), -- 'base_oil', 'additive', 'holding'
  capacity_kl DECIMAL(10, 2) NOT NULL,
  current_level_kl DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'idle', -- 'idle', 'in_use', 'maintenance'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blending_vessels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity_kl DECIMAL(10, 2) NOT NULL,
  current_level_kl DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'idle', -- 'idle', 'blending', 'holding'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS filling_lines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  line_number INTEGER,
  capacity_liters_per_min DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'idle', -- 'idle', 'filling', 'maintenance'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- BATCHES & BATCH OPERATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY,
  batch_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'BTH-2025-001'
  product_id INTEGER NOT NULL REFERENCES products(id),
  planned_qty_kl DECIMAL(10, 2) NOT NULL,
  actual_qty_kl DECIMAL(10, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'planned', -- 'planned', 'blending', 'holding', 'qc_pending', 'qc_passed', 'filling', 'completed', 'failed'
  created_by INTEGER NOT NULL REFERENCES users(id),
  shift VARCHAR(20),
  production_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_blending (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES batches(id),
  vessel_id INTEGER REFERENCES blending_vessels(id),
  operator_id INTEGER REFERENCES users(id),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  base_oil_actual_pct DECIMAL(5, 2),
  additive_a_actual_pct DECIMAL(5, 2),
  additive_b_actual_pct DECIMAL(5, 2),
  additive_c_actual_pct DECIMAL(5, 2),
  temperature_celsius DECIMAL(5, 1),
  pressure_bar DECIMAL(5, 2),
  deviation_recorded BOOLEAN DEFAULT FALSE,
  deviation_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_qc (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES batches(id),
  engineer_id INTEGER REFERENCES users(id),
  viscosity_index DECIMAL(6, 2),
  viscosity_spec_min DECIMAL(6, 2),
  viscosity_spec_max DECIMAL(6, 2),
  tan_value DECIMAL(5, 2),
  tan_spec_max DECIMAL(5, 2),
  oxidation_stability_minutes INTEGER,
  oxidation_spec_min INTEGER,
  result VARCHAR(20) NOT NULL, -- 'pass', 'hold', 'fail'
  deviation_notes TEXT,
  test_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_filling (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES batches(id),
  line_id INTEGER REFERENCES filling_lines(id),
  operator_id INTEGER REFERENCES users(id),
  planned_qty_kl DECIMAL(10, 2),
  actual_qty_kl DECIMAL(10, 2),
  fill_start TIMESTAMP,
  fill_end TIMESTAMP,
  packing_material_used_units INTEGER,
  loss_overfill_indicator VARCHAR(20), -- 'normal', 'loss', 'overfill'
  variance_pct DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- AUDIT & TRACEABILITY
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER REFERENCES batches(id),
  action VARCHAR(255) NOT NULL,
  details TEXT,
  user_id INTEGER REFERENCES users(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDICES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_batches_batch_number ON batches(batch_number);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_product_id ON batches(product_id);
CREATE INDEX idx_batch_blending_batch_id ON batch_blending(batch_id);
CREATE INDEX idx_batch_qc_batch_id ON batch_qc(batch_id);
CREATE INDEX idx_batch_filling_batch_id ON batch_filling(batch_id);
CREATE INDEX idx_audit_log_batch_id ON audit_log(batch_id);
