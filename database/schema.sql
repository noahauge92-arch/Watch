-- watch/database/schema.sql

-- 1. Watches Table
CREATE TABLE watches (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  reference VARCHAR(100),
  purchase_price NUMERIC(12, 2) NOT NULL,
  purchase_date DATE NOT NULL,
  current_estimated_value NUMERIC(12, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Historical Prices (for performance charting)
CREATE TABLE historical_prices (
  id SERIAL PRIMARY KEY,
  watch_id INTEGER REFERENCES watches(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL,
  estimated_value NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_watches_brand ON watches(brand);
CREATE INDEX idx_historical_prices_watch_id ON historical_prices(watch_id);
CREATE INDEX idx_historical_prices_date ON historical_prices(recorded_date);
