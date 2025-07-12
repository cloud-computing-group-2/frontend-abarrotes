import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react' // ✅ AÑADIDO useEffect
import { useAuth } from '../contexts/AuthContext'
import { useShop } from '../contexts/ShopContext' // ✅ Asegúrate de incluir loadShopProducts
import { useCart } from '../contexts/CartContext'
import { ArrowLeft, ShoppingCart, Star, X, Search } from 'lucide-react'
import { ShopType } from '../App'
import SearchBar from '../components/SearchBar'
import { Product } from '../contexts/ShopContext'

const ShopProducts = () => {
  const { shopType } = useParams<{ shopType: ShopType }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { getShopProducts, getShopTheme, getShopName, loadShopProducts, hasMore } = useShop()
  const { addToCart, getTotalItems, setCurrentTenant } = useCart()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (isAuthenticated && shopType && token) {
      loadShopProducts(shopType, token);
    }
  }, [isAuthenticated, shopType, token]);
  //console.log("ShopType:", shopType);
  //console.log("Token:", token);


  if (!shopType || !['tottus', 'plazavea', 'wong'].includes(shopType)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tienda no encontrada</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const products = getShopProducts(shopType)
  const theme = getShopTheme(shopType)
  const shopName = getShopName(shopType)

  const handleSearchResults = (results: Product[], query: string) => {
  setFilteredProducts(results)
  setIsSearchActive(query.trim().length >= 2)
}

  const handleClearSearch = () => {
  setFilteredProducts([])
  setIsSearchActive(false)
}


  const displayProducts = isSearchActive ? filteredProducts : products

  const handleBuyNow = (productId: string) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const product = products.find(p => p.id === productId)
    if (product) {
      setCurrentTenant(shopType)
      addToCart(product)
    }
  }

  const handleLoadMore = () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      loadShopProducts(shopType, token, true)  // true = append
    }
  }



  return (
    <div className={`min-h-screen ${theme.background}`}>
      <header className={`${theme.primary} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-white hover:text-gray-200">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{shopName}</h1>
                <p className="text-white/80">Descubre productos increíbles</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SearchBar
                products={products}
                onSearchResults={handleSearchResults}
                placeholder={`Buscar en ${shopName}...`}
              />
              <button
                onClick={() => navigate(`/cart/${shopType}`)}
                className="text-white hover:text-gray-200 relative"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSearchActive ? 'Resultados de Búsqueda' : 'Nuestros Productos'}
              </h2>
              <p className="text-gray-600">
                {isSearchActive
                  ? `Encontrados ${displayProducts.length} productos`
                  : 'Explora nuestra selección cuidadosamente curada'}
              </p>
            </div>
            {isSearchActive && (
              <button
                onClick={handleClearSearch}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Limpiar búsqueda</span>
              </button>
            )}
          </div>
        </div>

        {isSearchActive && displayProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600 mb-4">Intenta con otros términos de búsqueda</p>
            <button onClick={handleClearSearch} className="text-blue-600 hover:text-blue-700">
              Ver todos los productos
            </button>
          </div>
        )}

        {displayProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div key={product.id} className="card overflow-hidden">
                <div className="relative">
                  
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Agotado</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">por unidad</span>
                    </div>
                    <button
                      onClick={() => handleBuyNow(product.id)}
                      disabled={!product.inStock}
                      className={`px-4 py-2 rounded-lg font-medium text-white ${theme.primary} hover:bg-red-400 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105`}
                    >
                      {product.inStock ? 'Comprar Ahora' : 'Agotado'}
                    </button>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isSearchActive && hasMore(shopType) && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
            Cargar más
          </button>
        </div>
      )}


        {!isSearchActive && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-600">¡Vuelve más tarde para nuevos productos!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopProducts
