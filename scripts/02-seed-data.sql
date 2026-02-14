-- ============================================================================
-- MES DATABASE SEED DATA - MOBIL OIL MANUFACTURING
-- ============================================================================

-- ============================================================================
-- USERS: PRODUCTION PLANNER, SHIFT OPERATOR, QA ENGINEER, PLANT MANAGER
-- ============================================================================
INSERT INTO users (username, password_hash, full_name, role, shift, email) VALUES
-- Planners
('planner_raj', '$2b$10$dummy_hash_1', 'Raj Kumar', 'planner', 'morning', 'raj.kumar@mobil.com'),

-- Operators
('op_amit', '$2b$10$dummy_hash_2', 'Amit Sharma', 'operator', 'morning', 'amit.sharma@mobil.com'),
('op_priya', '$2b$10$dummy_hash_3', 'Priya Menon', 'operator', 'afternoon', 'priya.menon@mobil.com'),
('op_vikram', '$2b$10$dummy_hash_4', 'Vikram Singh', 'operator', 'night', 'vikram.singh@mobil.com'),

-- QA Engineers
('qa_neha', '$2b$10$dummy_hash_5', 'Neha Patel', 'qa_engineer', 'morning', 'neha.patel@mobil.com'),
('qa_rohit', '$2b$10$dummy_hash_6', 'Rohit Verma', 'qa_engineer', 'afternoon', 'rohit.verma@mobil.com'),

-- Plant Manager
('mgr_arun', '$2b$10$dummy_hash_7', 'Arun Nair', 'manager', NULL, 'arun.nair@mobil.com'),
('mgr_deepa', '$2b$10$dummy_hash_8', 'Deepa Sharma', 'manager', NULL, 'deepa.sharma@mobil.com');

-- ============================================================================
-- PRODUCTS: MOBIL ENGINE OIL GRADES
-- ============================================================================
INSERT INTO products (name, viscosity_grade, base_oil_type, description) VALUES
('Mobil DTE 10 Excel', '5W-30', 'Paraffinic', 'Premium synthetic engine oil for passenger vehicles'),
('Mobil DTE 15 Excel', '10W-40', 'Paraffinic', 'Advanced engine oil for high-performance engines'),
('Mobil Delvac MX', '15W-40', 'Paraffinic', 'Heavy-duty diesel engine oil'),
('Mobil Delvac Synthetic', '5W-40', 'Synthetic', 'Fully synthetic heavy-duty engine oil'),
('Mobil Super 2000 X1', '10W-30', 'Semi-Synthetic', 'Semi-synthetic passenger vehicle engine oil'),
('Mobil Nuto H32', '32', 'Mineral', 'Hydraulic fluid for industrial systems');

-- ============================================================================
-- ADDITIVES: BASE OIL COMPONENTS & ADDITIVES
-- ============================================================================
INSERT INTO additives (name, type, description) VALUES
('Base Oil PA-100', 'base_oil', 'High-viscosity paraffinic base oil'),
('Anti-Wear Additive PKZ', 'anti-wear', 'Zinc-based anti-wear protection'),
('Detergent DTC-400', 'detergent', 'Detergent to prevent sludge formation'),
('Oxidation Inhibitor OI-200', 'oxidation-inhibitor', 'Prevents oil degradation'),
('Corrosion Inhibitor CI-150', 'corrosion-inhibitor', 'Protects metal surfaces'),
('Foam Suppressant FS-50', 'foam-suppressant', 'Reduces foam formation');

-- ============================================================================
-- RECIPES: FORMULATIONS FOR EACH PRODUCT
-- ============================================================================
INSERT INTO recipes (product_id, base_oil_pct, additive_a_id, additive_a_pct, additive_b_id, additive_b_pct, additive_c_id, additive_c_pct, tolerance_pct) VALUES
(1, 85.0, 2, 8.0, 3, 5.0, 4, 2.0, 2.0), -- 5W-30: 85% base + 8% anti-wear + 5% detergent + 2% oxidation
(2, 82.0, 2, 10.0, 3, 6.0, 4, 2.0, 2.0), -- 10W-40: 82% base + 10% anti-wear + 6% detergent + 2% oxidation
(3, 80.0, 2, 12.0, 3, 6.0, 5, 2.0, 2.0), -- 15W-40: 80% base + 12% anti-wear + 6% detergent + 2% corrosion
(4, 83.0, 2, 9.0, 3, 6.0, 4, 2.0, 2.0), -- 5W-40: 83% base + 9% anti-wear + 6% detergent + 2% oxidation
(5, 86.0, 2, 7.0, 3, 5.0, 4, 2.0, 2.0), -- 10W-30: 86% base + 7% anti-wear + 5% detergent + 2% oxidation
(6, 95.0, 4, 3.0, 6, 2.0, NULL, NULL, 2.0); -- 32 Hydraulic: 95% base + 3% oxidation + 2% foam suppressant

-- ============================================================================
-- EQUIPMENT: TANKS
-- ============================================================================
INSERT INTO tanks (name, tank_type, capacity_kl, current_level_kl, status) VALUES
('Tank-A1 (Base Oil)', 'base_oil', 100.0, 75.5, 'idle'),
('Tank-A2 (Base Oil)', 'base_oil', 100.0, 82.3, 'idle'),
('Tank-B1 (Additives)', 'additive', 50.0, 38.2, 'idle'),
('Tank-B2 (Additives)', 'additive', 50.0, 42.1, 'idle'),
('Tank-H1 (Holding)', 'holding', 80.0, 65.0, 'idle'),
('Tank-H2 (Holding)', 'holding', 80.0, 45.2, 'idle');

-- ============================================================================
-- EQUIPMENT: BLENDING VESSELS
-- ============================================================================
INSERT INTO blending_vessels (name, capacity_kl, current_level_kl, status) VALUES
('Blender-V1', 60.0, 0.0, 'idle'),
('Blender-V2', 60.0, 0.0, 'idle'),
('Blender-V3', 40.0, 0.0, 'idle');

-- ============================================================================
-- EQUIPMENT: FILLING LINES
-- ============================================================================
INSERT INTO filling_lines (name, line_number, capacity_liters_per_min, status) VALUES
('Filling Line 1', 1, 500.0, 'idle'),
('Filling Line 2', 2, 500.0, 'idle'),
('Filling Line 3', 3, 300.0, 'maintenance'),
('Filling Line 4', 4, 500.0, 'idle');

-- ============================================================================
-- SAMPLE BATCHES (FOR DEMO)
-- ============================================================================

-- Batch 1: Planned (just created)
INSERT INTO batches (batch_number, product_id, planned_qty_kl, status, created_by, shift, production_date) 
VALUES ('BTH-2025-0001', 1, 10.0, 'planned', 1, 'morning', CURRENT_DATE);

-- Batch 2: In Progress (blending started)
INSERT INTO batches (batch_number, product_id, planned_qty_kl, status, created_by, shift, production_date) 
VALUES ('BTH-2025-0002', 2, 15.0, 'blending', 1, 'morning', CURRENT_DATE);

INSERT INTO batch_blending (batch_id, vessel_id, operator_id, start_time, base_oil_actual_pct, additive_a_actual_pct, additive_b_actual_pct, temperature_celsius, pressure_bar, deviation_recorded)
VALUES (2, 1, 2, CURRENT_TIMESTAMP - INTERVAL '30 minutes', 82.1, 10.2, 5.9, 45.2, 1.8, FALSE);

-- Batch 3: Holding (blending complete, waiting QC)
INSERT INTO batches (batch_number, product_id, planned_qty_kl, status, created_by, shift, production_date) 
VALUES ('BTH-2025-0003', 1, 12.0, 'holding', 1, 'morning', CURRENT_DATE);

INSERT INTO batch_blending (batch_id, vessel_id, operator_id, start_time, end_time, base_oil_actual_pct, additive_a_actual_pct, additive_b_actual_pct, temperature_celsius, pressure_bar, deviation_recorded)
VALUES (3, 2, 3, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1.5 hours', 85.0, 8.1, 4.9, 48.5, 2.1, FALSE);

-- Batch 4: QC Passed (ready for filling)
INSERT INTO batches (batch_number, product_id, planned_qty_kl, status, created_by, shift, production_date) 
VALUES ('BTH-2025-0004', 3, 20.0, 'qc_passed', 1, 'morning', CURRENT_DATE);

INSERT INTO batch_blending (batch_id, vessel_id, operator_id, start_time, end_time, base_oil_actual_pct, additive_a_actual_pct, additive_b_actual_pct, temperature_celsius, pressure_bar, deviation_recorded)
VALUES (4, 1, 2, CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '3.5 hours', 80.0, 12.1, 6.0, 50.1, 2.2, FALSE);

INSERT INTO batch_qc (batch_id, engineer_id, viscosity_index, viscosity_spec_min, viscosity_spec_max, tan_value, tan_spec_max, oxidation_stability_minutes, oxidation_spec_min, result, test_date)
VALUES (4, 5, 98.5, 95.0, 105.0, 0.35, 0.50, 650, 600, 'pass', CURRENT_TIMESTAMP - INTERVAL '2 hours');

-- Batch 5: Completed (filled & dispatched)
INSERT INTO batches (batch_number, product_id, planned_qty_kl, actual_qty_kl, status, created_by, shift, production_date, completed_at) 
VALUES ('BTH-2025-0005', 2, 18.0, 17.95, 'completed', 1, 'morning', CURRENT_DATE - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '3 hours');

INSERT INTO batch_blending (batch_id, vessel_id, operator_id, start_time, end_time, base_oil_actual_pct, additive_a_actual_pct, additive_b_actual_pct, temperature_celsius, pressure_bar, deviation_recorded)
VALUES (5, 2, 2, CURRENT_TIMESTAMP - INTERVAL '1 day 5 hours', CURRENT_TIMESTAMP - INTERVAL '1 day 4.5 hours', 82.0, 10.0, 6.0, 46.0, 2.0, FALSE);

INSERT INTO batch_qc (batch_id, engineer_id, viscosity_index, viscosity_spec_min, viscosity_spec_max, tan_value, tan_spec_max, oxidation_stability_minutes, oxidation_spec_min, result, test_date)
VALUES (5, 6, 99.2, 95.0, 105.0, 0.32, 0.50, 680, 600, 'pass', CURRENT_TIMESTAMP - INTERVAL '1 day 2 hours');

INSERT INTO batch_filling (batch_id, line_id, operator_id, planned_qty_kl, actual_qty_kl, fill_start, fill_end, packing_material_used_units, loss_overfill_indicator, variance_pct)
VALUES (5, 1, 2, 18.0, 17.95, CURRENT_TIMESTAMP - INTERVAL '1 day 2 hours', CURRENT_TIMESTAMP - INTERVAL '1 day 1.5 hours', 3600, 'normal', -0.28);

-- ============================================================================
-- AUDIT LOG ENTRIES (for demo)
-- ============================================================================
INSERT INTO audit_log (batch_id, action, details, user_id, timestamp) VALUES
(1, 'BATCH_CREATED', 'Batch BTH-2025-0001 planned for 5W-30 product', 1, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(2, 'BLENDING_STARTED', 'Blending started in Vessel V1 by Amit Sharma', 2, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(3, 'BLENDING_COMPLETED', 'Blending completed for batch BTH-2025-0003', 3, CURRENT_TIMESTAMP - INTERVAL '1.5 hours'),
(4, 'QC_PASSED', 'QC test passed by Neha Patel - Viscosity OK', 5, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(5, 'FILLING_STARTED', 'Filling started on Line 1', 2, CURRENT_TIMESTAMP - INTERVAL '1 day 2 hours'),
(5, 'FILLING_COMPLETED', 'Filling completed - 17.95 KL filled', 2, CURRENT_TIMESTAMP - INTERVAL '1 day 1.5 hours'),
(5, 'BATCH_COMPLETED', 'Batch completed and ready for dispatch', 1, CURRENT_TIMESTAMP - INTERVAL '1 day 1 hour');
