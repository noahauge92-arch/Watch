const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'chronos_vault',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
})

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err)
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ChronosVault API is running',
    timestamp: new Date().toISOString()
  })
})

// --- WATCH ROUTES ---

// GET /api/watches - Get all watches
app.get('/api/watches', async (req, res) => {
  try {
    const { brand, sortBy = 'created_at', order = 'DESC' } = req.query
    
    let query = 'SELECT * FROM watches'
    let params = []
    
    if (brand) {
      query += ' WHERE LOWER(brand) = LOWER($1)'
      params.push(brand)
    }
    
    // Validate sort fields to prevent SQL injection
    const validSortFields = ['id', 'brand', 'model', 'purchase_price', 'current_estimated_value', 'purchase_date', 'created_at']
    const validOrders = ['ASC', 'DESC']
    
    if (validSortFields.includes(sortBy) && validOrders.includes(order.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`
    }
    
    const result = await pool.query(query, params)
    
    // Calculate ROI for each watch
    const watchesWithROI = result.rows.map(watch => ({
      ...watch,
      roi: watch.current_estimated_value && watch.purchase_price 
        ? ((watch.current_estimated_value - watch.purchase_price) / watch.purchase_price * 100).toFixed(2)
        : null
    }))
    
    res.json({
      success: true,
      data: watchesWithROI,
      count: watchesWithROI.length
    })
  } catch (error) {
    console.error('Error fetching watches:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch watches',
      message: error.message 
    })
  }
})

// GET /api/watches/:id - Get specific watch
app.get('/api/watches/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const watchQuery = 'SELECT * FROM watches WHERE id = $1'
    const watchResult = await pool.query(watchQuery, [id])
    
    if (watchResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Watch not found' 
      })
    }
    
    const watch = watchResult.rows[0]
    
    // Get historical prices for this watch
    const historyQuery = 'SELECT * FROM historical_prices WHERE watch_id = $1 ORDER BY recorded_date ASC'
    const historyResult = await pool.query(historyQuery, [id])
    
    // Calculate ROI
    const roi = watch.current_estimated_value && watch.purchase_price 
      ? ((watch.current_estimated_value - watch.purchase_price) / watch.purchase_price * 100).toFixed(2)
      : null
    
    res.json({
      success: true,
      data: {
        ...watch,
        roi,
        historical_prices: historyResult.rows
      }
    })
  } catch (error) {
    console.error('Error fetching watch:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch watch',
      message: error.message 
    })
  }
})

// POST /api/watches - Add new watch
app.post('/api/watches', async (req, res) => {
  try {
    const {
      brand,
      model,
      reference,
      purchase_price,
      purchase_date,
      current_estimated_value,
      notes
    } = req.body
    
    // Validation
    if (!brand || !model || !purchase_price || !purchase_date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: brand, model, purchase_price, purchase_date'
      })
    }
    
    const query = `
      INSERT INTO watches (brand, model, reference, purchase_price, purchase_date, current_estimated_value, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    
    const values = [
      brand,
      model,
      reference || null,
      purchase_price,
      purchase_date,
      current_estimated_value || null,
      notes || null
    ]
    
    const result = await pool.query(query, values)
    const newWatch = result.rows[0]
    
    // Add initial historical price entry if current value is provided
    if (current_estimated_value) {
      await pool.query(
        'INSERT INTO historical_prices (watch_id, recorded_date, estimated_value) VALUES ($1, CURRENT_DATE, $2)',
        [newWatch.id, current_estimated_value]
      )
    }
    
    // Calculate ROI
    const roi = current_estimated_value && purchase_price 
      ? ((current_estimated_value - purchase_price) / purchase_price * 100).toFixed(2)
      : null
    
    res.status(201).json({
      success: true,
      data: { ...newWatch, roi },
      message: 'Watch added successfully'
    })
  } catch (error) {
    console.error('Error adding watch:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add watch',
      message: error.message 
    })
  }
})

// PUT /api/watches/:id - Update watch
app.put('/api/watches/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      brand,
      model,
      reference,
      purchase_price,
      purchase_date,
      current_estimated_value,
      notes
    } = req.body
    
    // Check if watch exists
    const existingWatch = await pool.query('SELECT * FROM watches WHERE id = $1', [id])
    
    if (existingWatch.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Watch not found' 
      })
    }
    
    const query = `
      UPDATE watches 
      SET brand = $1, model = $2, reference = $3, purchase_price = $4, 
          purchase_date = $5, current_estimated_value = $6, notes = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `
    
    const values = [
      brand || existingWatch.rows[0].brand,
      model || existingWatch.rows[0].model,
      reference !== undefined ? reference : existingWatch.rows[0].reference,
      purchase_price || existingWatch.rows[0].purchase_price,
      purchase_date || existingWatch.rows[0].purchase_date,
      current_estimated_value !== undefined ? current_estimated_value : existingWatch.rows[0].current_estimated_value,
      notes !== undefined ? notes : existingWatch.rows[0].notes,
      id
    ]
    
    const result = await pool.query(query, values)
    const updatedWatch = result.rows[0]
    
    // Add historical price entry if value changed
    const oldValue = existingWatch.rows[0].current_estimated_value
    if (current_estimated_value && current_estimated_value !== oldValue) {
      await pool.query(
        'INSERT INTO historical_prices (watch_id, recorded_date, estimated_value) VALUES ($1, CURRENT_DATE, $2)',
        [id, current_estimated_value]
      )
    }
    
    // Calculate ROI
    const roi = updatedWatch.current_estimated_value && updatedWatch.purchase_price 
      ? ((updatedWatch.current_estimated_value - updatedWatch.purchase_price) / updatedWatch.purchase_price * 100).toFixed(2)
      : null
    
    res.json({
      success: true,
      data: { ...updatedWatch, roi },
      message: 'Watch updated successfully'
    })
  } catch (error) {
    console.error('Error updating watch:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update watch',
      message: error.message 
    })
  }
})

// DELETE /api/watches/:id - Delete watch
app.delete('/api/watches/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await pool.query('DELETE FROM watches WHERE id = $1 RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Watch not found' 
      })
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Watch deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting watch:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete watch',
      message: error.message 
    })
  }
})

// --- PORTFOLIO ROUTES ---

// GET /api/portfolio/stats - Get portfolio statistics
app.get('/api/portfolio/stats', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_watches,
        SUM(purchase_price) as total_invested,
        SUM(current_estimated_value) as current_value,
        AVG(CASE 
          WHEN current_estimated_value IS NOT NULL AND purchase_price > 0 
          THEN (current_estimated_value - purchase_price) / purchase_price * 100 
          ELSE NULL 
        END) as average_roi
      FROM watches
    `
    
    const result = await pool.query(query)
    const stats = result.rows[0]
    
    const totalProfit = (stats.current_value || 0) - (stats.total_invested || 0)
    
    res.json({
      success: true,
      data: {
        total_watches: parseInt(stats.total_watches),
        total_invested: parseFloat(stats.total_invested || 0),
        current_value: parseFloat(stats.current_value || 0),
        total_profit: parseFloat(totalProfit.toFixed(2)),
        average_roi: parseFloat((stats.average_roi || 0).toFixed(2))
      }
    })
  } catch (error) {
    console.error('Error fetching portfolio stats:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch portfolio statistics',
      message: error.message 
    })
  }
})

// GET /api/portfolio/brands - Get brand distribution
app.get('/api/portfolio/brands', async (req, res) => {
  try {
    const query = `
      SELECT 
        brand,
        COUNT(*) as count,
        SUM(purchase_price) as total_invested,
        SUM(current_estimated_value) as current_value
      FROM watches
      GROUP BY brand
      ORDER BY current_value DESC
    `
    
    const result = await pool.query(query)
    
    const brands = result.rows.map(row => ({
      ...row,
      count: parseInt(row.count),
      total_invested: parseFloat(row.total_invested || 0),
      current_value: parseFloat(row.current_value || 0),
      roi: row.current_value && row.total_invested 
        ? ((row.current_value - row.total_invested) / row.total_invested * 100).toFixed(2)
        : null
    }))
    
    res.json({
      success: true,
      data: brands
    })
  } catch (error) {
    console.error('Error fetching brand distribution:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch brand distribution',
      message: error.message 
    })
  }
})

// --- HISTORICAL PRICE ROUTES ---

// POST /api/watches/:id/price - Add historical price entry
app.post('/api/watches/:id/price', async (req, res) => {
  try {
    const { id } = req.params
    const { estimated_value, recorded_date } = req.body
    
    if (!estimated_value) {
      return res.status(400).json({
        success: false,
        error: 'estimated_value is required'
      })
    }
    
    // Check if watch exists
    const watchExists = await pool.query('SELECT id FROM watches WHERE id = $1', [id])
    if (watchExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Watch not found' 
      })
    }
    
    const query = `
      INSERT INTO historical_prices (watch_id, recorded_date, estimated_value)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    
    const values = [
      id,
      recorded_date || new Date().toISOString().split('T')[0], // Default to today
      estimated_value
    ]
    
    const result = await pool.query(query, values)
    
    // Also update the current estimated value in the watches table
    await pool.query(
      'UPDATE watches SET current_estimated_value = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [estimated_value, id]
    )
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Historical price added successfully'
    })
  } catch (error) {
    console.error('Error adding historical price:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add historical price',
      message: error.message 
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 ChronosVault API Server running!
📍 Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health check: http://localhost:${PORT}/api/health

🔗 Available endpoints:
   GET    /api/health
   GET    /api/watches
   GET    /api/watches/:id
   POST   /api/watches
   PUT    /api/watches/:id
   DELETE /api/watches/:id
   GET    /api/portfolio/stats
   GET    /api/portfolio/brands
   POST   /api/watches/:id/price
  `)
})