import { useState, useEffect } from 'react'
import { getProducts, getLowStockProducts } from '../services/productService'
import Navbar from './Navbar'
import { ShoppingCart, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    value: 0,
    categories: 0
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const allProducts = await getProducts()
      const lowStock = await getLowStockProducts()

      const totalValue = allProducts.reduce((sum, p) => sum + (parseFloat(p.price) * p.quantity), 0)
      const categories = new Set(allProducts.map(p => p.category)).size

      setStats({
        total: allProducts.length,
        lowStock: lowStock.length,
        value: totalValue,
        categories: categories
      })
      setProducts(allProducts.slice(0, 5))
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={fetchData} className="refresh-btn">↻ Refresh</button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">
                  <ShoppingCart />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Products</p>
                  <p className="stat-value">{stats.total}</p>
                </div>
              </div>

              <div className="stat-card warning">
                <div className="stat-icon">
                  <AlertTriangle />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Low Stock Items</p>
                  <p className="stat-value">{stats.lowStock}</p>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">
                  <DollarSign />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Inventory Value</p>
                  <p className="stat-value">${stats.value.toFixed(2)}</p>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-icon">
                  <TrendingUp />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Categories</p>
                  <p className="stat-value">{stats.categories}</p>
                </div>
              </div>
            </div>

            <div className="recent-products">
              <h2>Recent Products</h2>
              <div className="table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="product-name">{product.name}</td>
                        <td>{product.sku}</td>
                        <td>{product.category || 'N/A'}</td>
                        <td>${parseFloat(product.price).toFixed(2)}</td>
                        <td className="stock-cell">
                          <span className={product.quantity < 10 ? 'low-stock' : 'normal'}>
                            {product.quantity}
                          </span>
                        </td>
                        <td>
                          {product.quantity < 10 ? (
                            <span className="status-badge warning">Low Stock</span>
                          ) : (
                            <span className="status-badge success">In Stock</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}