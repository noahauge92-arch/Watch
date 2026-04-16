'use client'

import { useState } from 'react'

const watchBrands = [
  'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier',
  'Breitling', 'TAG Heuer', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin',
  'Panerai', 'Tudor', 'Seiko', 'Casio', 'Other'
]

const conditions = [
  'New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'
]

export default function AddWatch() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    reference: '',
    purchasePrice: '',
    purchaseDate: '',
    currentValue: '',
    condition: '',
    serialNumber: '',
    boxPapers: 'none',
    notes: '',
    images: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('')

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Watch data submitted:', formData)
      setSubmitStatus('success')
      
      // Reset form
      setFormData({
        brand: '',
        model: '',
        reference: '',
        purchasePrice: '',
        purchaseDate: '',
        currentValue: '',
        condition: '',
        serialNumber: '',
        boxPapers: 'none',
        notes: '',
        images: []
      })
      
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateROI = () => {
    const purchase = parseFloat(formData.purchasePrice)
    const current = parseFloat(formData.currentValue)
    
    if (purchase && current) {
      const roi = ((current - purchase) / purchase * 100).toFixed(1)
      return roi
    }
    return '0.0'
  }

  return (
    <div className="add-watch-page">
      <div className="page-header">
        <div>
          <h1>Add New Watch</h1>
          <p className="page-subtitle">Add a timepiece to your portfolio and track its performance</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="watch-form">
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brand" className="form-label">Brand *</label>
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select Brand</option>
                    {watchBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="model" className="form-label">Model *</label>
                  <input
                    id="model"
                    name="model"
                    type="text"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., Submariner, Speedmaster"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reference" className="form-label">Reference Number</label>
                  <input
                    id="reference"
                    name="reference"
                    type="text"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="e.g., 116610LN, 311.30.42.30.01.005"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="serialNumber" className="form-label">Serial Number</label>
                  <input
                    id="serialNumber"
                    name="serialNumber"
                    type="text"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="Watch serial number"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="condition" className="form-label">Condition</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="boxPapers" className="form-label">Box & Papers</label>
                  <select
                    id="boxPapers"
                    name="boxPapers"
                    value={formData.boxPapers}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="none">None</option>
                    <option value="box">Box Only</option>
                    <option value="papers">Papers Only</option>
                    <option value="both">Both Box & Papers</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="form-section">
              <h3 className="section-title">Financial Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="purchasePrice" className="form-label">Purchase Price (USD) *</label>
                  <input
                    id="purchasePrice"
                    name="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="purchaseDate" className="form-label">Purchase Date *</label>
                  <input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currentValue" className="form-label">Current Estimated Value (USD)</label>
                  <input
                    id="currentValue"
                    name="currentValue"
                    type="number"
                    step="0.01"
                    value={formData.currentValue}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated ROI</label>
                  <div className="roi-display">
                    <span className={`roi-value ${parseFloat(calculateROI()) >= 0 ? 'status-positive' : 'status-negative'}`}>
                      {calculateROI()}%
                    </span>
                    <span className="roi-label">
                      {parseFloat(calculateROI()) >= 0 ? 'Profit' : 'Loss'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3 className="section-title">Additional Information</h3>
              
              <div className="form-group">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional details about the watch, service history, etc."
                  className="form-input form-textarea"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="form-submit">
            {submitStatus === 'success' && (
              <div className="submit-message success">
                ✅ Watch added successfully to your portfolio!
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="submit-message error">
                ❌ Error adding watch. Please try again.
              </div>
            )}

            <div className="submit-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Adding Watch...
                  </>
                ) : (
                  <>
                    ➕ Add to Portfolio
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear the form?')) {
                    setFormData({
                      brand: '',
                      model: '',
                      reference: '',
                      purchasePrice: '',
                      purchaseDate: '',
                      currentValue: '',
                      condition: '',
                      serialNumber: '',
                      boxPapers: 'none',
                      notes: '',
                      images: []
                    })
                  }
                }}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Clear Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}