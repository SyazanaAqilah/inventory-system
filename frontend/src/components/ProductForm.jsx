import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, updateProduct, getProductById } from '../services/productService'
import Navbar from './Navbar'
import { ArrowLeft } from 'lucide-react'
import '../styles/ProductForm.css'

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setInitialLoading(true)
      const data = await getProductById(id)
      setFormData(data)
    } catch (err) {
      setError('Failed to load product')
      console.error(err)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (id) {
        await updateProduct(id, formData)
      } else {
        await createProduct(formData)
      }
      navigate('/products')
    } catch (err) {
      setError(err || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="form-container">
        <div className="form-header">
          <button onClick={() => navigate('/products')} className="back-btn">
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>{id ? 'Edit Product' : 'Add New Product'}</h1>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {initialLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="form-card">
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sku">SKU *</label>
                  <input
                    id="sku"
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    placeholder="e.g., PROD-001"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Electronics"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="0"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter product description"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  id="imageUrl"
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Saving...' : (id ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}