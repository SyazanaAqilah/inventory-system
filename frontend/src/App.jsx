import React, { useState, useEffect } from 'react';
import { Package, LogOut, Plus, Search, Edit2, Trash2, Menu, X, AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react';

export default function InventoryUI() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user") || null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    if (token) {
      getAllProducts();
    }
  }, [token]);

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.data?.token) {
        setToken(data.data.token);
        setCurrentUser(data.data.fullName);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", data.data.fullName);
        setEmail("");
        setPassword("");
        showMessage("Login successful!", "success");
      } else {
        showMessage(data.message || "Login failed", "error");
      }
    } catch (error) {
      showMessage("Connection error: " + error.message, "error");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName })
      });
      const data = await response.json();
      if (response.ok) {
        showMessage("Registration successful! Please login.", "success");
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setFullName("");
      } else {
        showMessage(data.message || "Registration failed", "error");
      }
    } catch (error) {
      showMessage("Connection error: " + error.message, "error");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      setToken(null);
      setCurrentUser(null);
      setProducts([]);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      showMessage("Error loading products: " + error.message, "error");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        showMessage("Product deleted!", "success");
        getAllProducts();
      }
    } catch (error) {
      showMessage("Error: " + error.message, "error");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Package className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Manager</h1>
            <p className="text-gray-600 mt-2">{isLogin ? "Sign in to your account" : "Create a new account"}</p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
              setFullName("");
              setMessage("");
            }}
            className="w-full mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.quantity < 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-600 hidden sm:block">Inventory Manager</h1>
            </div>

            <ul className="hidden md:flex gap-8 flex-1 justify-center">
              <li>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`font-semibold transition relative ${
                    currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                  {currentPage === 'dashboard' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('products')}
                  className={`font-semibold transition relative ${
                    currentPage === 'products' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Products
                  {currentPage === 'products' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
                </button>
              </li>
            </ul>

            <div className="hidden md:flex items-center gap-4">
              <span className="text-gray-700 font-semibold">{currentUser}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setCurrentPage('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentPage('products');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
              >
                Products
              </button>
              <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard */}
      {currentPage === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Products</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{products.length}</p>
                </div>
                <ShoppingCart className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Low Stock Items</p>
                  <p className="text-4xl font-bold text-amber-600 mt-2">{lowStockCount}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-amber-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Inventory Value</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">${totalValue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Recent Products</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${product.price}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        <span className={product.quantity < 10 ? 'text-amber-600' : 'text-green-600'}>
                          {product.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      {currentPage === 'products' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Products Inventory</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{product.name}</h3>
                    {product.quantity < 10 && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full ml-2 whitespace-nowrap">
                        Low Stock
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">SKU: <span className="font-semibold">{product.sku}</span></p>
                  <p className="text-sm text-gray-600 mb-3">Category: <span className="font-semibold">{product.category}</span></p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600 text-xs uppercase tracking-wide">Price</p>
                        <p className="text-xl font-bold text-gray-900">${product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 text-xs uppercase tracking-wide">Stock</p>
                        <p className={`text-xl font-bold ${product.quantity < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                          {product.quantity}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
