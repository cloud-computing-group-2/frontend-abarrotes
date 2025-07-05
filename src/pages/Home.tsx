import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShoppingBag, Store, Users, ArrowRight } from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()


  const shops = [
    {
      id: 'tottus',
      name: 'Tottus',
      description: 'Productos orgánicos frescos y opciones saludables',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '🛒'
    },
    {
      id: 'plazavea',
      name: 'Plaza Vea',
      description: 'Productos de calidad a excelentes precios',
      color: 'from-yellow-500 via-red-500 to-red-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '🏪'
    },
    {
      id: 'wong',
      name: 'Wong',
      description: 'Productos premium y marcas exclusivas',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '🛍️'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-pink-400/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-green-400/30 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Tienda de Abarrotes</h1>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">¡Bienvenido, {user?.name}!</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Elige Tu Tienda de Abarrotes Favorita
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre productos increíbles de las principales cadenas de abarrotes de Perú. 
            Cada tienda ofrece productos únicos y experiencias adaptadas a tus necesidades.
          </p>
          <div className="flex justify-center mt-8 space-x-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>

        {/* Shop Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className={`${shop.bgColor} ${shop.borderColor} border-2 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden group`}
              onClick={() => navigate(`/shop/${shop.id}`)}
            >
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="text-center relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{shop.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">{shop.name}</h3>
                <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">{shop.description}</p>
                                                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-white font-medium bg-gradient-to-r ${shop.color} hover:shadow-lg hover:scale-110 transition-all duration-300 group-hover:bg-opacity-90`}>
                  Explorar Productos
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Credits Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Elaborado por
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {['Laura Nagamine', 'Salvador Donayre', 'Nayeli Guzmán', 'Mauro Bobadilla', 'Breysi Salazar'].map((name, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <p className="text-sm font-medium text-gray-700">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 