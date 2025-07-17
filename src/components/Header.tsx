import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { ShoppingCart, LogOut, User, Home, Store, Clock } from 'lucide-react'


const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { getTotalItems, items } = useCart()
  const navigate = useNavigate()
  const location = useLocation()


    useEffect(() => {
    const total = getTotalItems();
    console.log("Total de items:", total);
  }, [items]);

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getShopColor = () => {
    if (!user?.tenant_id) return 'from-blue-600 to-purple-600'
    
    switch (user.tenant_id) {
      case 'tottus':
        return 'from-green-600 to-green-700'
      case 'plazavea':
        return 'from-red-600 to-yellow-500'
      case 'wong':
        return 'from-red-600 to-red-700'
      default:
        return 'from-blue-600 to-purple-600'
    }
  }

  const getShopName = () => {
    if (!user?.tenant_id) return 'Tienda de Abarrotes'
    
    switch (user.tenant_id) {
      case 'tottus':
        return 'Tottus'
      case 'plazavea':
        return 'Plaza Vea'
      case 'wong':
        return 'Wong'
      default:
        return 'Tienda de Abarrotes'
    }
  }

  return (
    <header className="bg-white shadow-lg border-b relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`w-12 h-12 bg-gradient-to-r ${getShopColor()} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                {getShopName()}
              </h1>
              <p className="text-sm text-gray-500">Tu tienda favorita</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === '/' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
            <Link 
              to="/shop/tottus" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname.includes('/shop/tottus') 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">🛒</span>
              <span>Tottus</span>
            </Link>
            <Link 
              to="/shop/plazavea" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname.includes('/shop/plazavea') 
                  ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">🏪</span>
              <span>Plaza Vea</span>
            </Link>
            <Link 
              to="/shop/wong" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname.includes('/shop/wong') 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">🛍️</span>
              <span>Wong</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Solo mostrar si está autenticado */}
            {isAuthenticated && (
              <Link to={`/cart/${user?.tenant_id}`} className="relative group">
                <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-all duration-300">
                  <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
                </div>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/history')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-xl hover:bg-blue-200 transition-all duration-300"
                  title="Ver historial de compras"
                >
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Historial</span>
                </button>
                
                <div className="flex items-center space-x-3 bg-gray-100 rounded-xl px-4 py-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.user_id}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 rounded-xl hover:bg-red-200 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 