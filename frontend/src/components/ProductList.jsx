import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, deleteProduct, searchProducts } from '../services/productService'
import Navbar from './Navbar'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import '../styles/ProductList.css'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, filter, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = async () => {
    let filtered = products

    if (searchTerm) {
      try {
        filtered = await searchProducts(searchTerm)
      } catch {
        filtered = products.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
    }

    if (filter === 'lowStock') {
      filtered = filtered.filter(p => p.quantity < 10)
    }

    setFilteredProducts(filtered)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        fetchProducts()
      } catch (err) {
        setError('Failed to delete product')
        console.error(err)
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="products-container">
        <div className="products-header">
          <h1>Products Inventory</h1>
          <button
            onClick={() => navigate('/products/new')}
            className="btn-primary"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="filters">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Products</option>
            <option value="lowStock">Low Stock</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-results">
            <p>No products found</p>
            {searchTerm && <p>Try adjusting your search terms</p>}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  {product.quantity < 10 && (
                    <span className="badge-warning">Low Stock</span>
                  )}
                </div>

                <div className="product-details">
                  <p><strong>SKU:</strong> {product.sku}</p>
                  <p><strong>Category:</strong> {product.category || 'N/A'}</p>
                  {product.description && (
                    <p className="description">{product.description.substring(0, 60)}...</p>
                  )}
                </div>

                <div className="product-info">
                  <div className="price-box">
                    <span className="label">Price</span>
                    <span className="value">${parseFloat(product.price).toFixed(2)}</span>
                  </div>
                  <div className="stock-box">
                    <span className="label">Stock</span>
                    <span className={`value ${product.quantity < 10 ? 'low' : 'normal'}`}>
                      {product.quantity}
                    </span>
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="btn-edit"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn-delete"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}