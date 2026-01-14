import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, getCurrentUser } from '../services/authService'
import { Package, LogOut, Menu, X } from 'lucide-react'
import '../styles/Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => handleNavClick('/dashboard')}>
          <Package className="brand-icon" />
          <span>Inventory Manager</span>
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li><button onClick={() => handleNavClick('/dashboard')}>Dashboard</button></li>
          <li><button onClick={() => handleNavClick('/products')}>Products</button></li>
        </ul>

        <div className="navbar-right">
          <div className="user-info">
            <span>{user?.fullName}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}