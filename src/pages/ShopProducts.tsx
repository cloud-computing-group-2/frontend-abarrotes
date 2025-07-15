import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useShop } from '../contexts/ShopContext'
import { useCart } from '../contexts/CartContext'
import { ArrowLeft, ShoppingCart, X } from 'lucide-react'
import { ShopType } from '../App'
import SearchBar from '../components/SearchBar'
import { Product } from '../contexts/ShopContext'
import { checkProductStock } from '../services/productService'

const API_BASE = 'https://sh7pqkg24f.execute-api.us-east-1.amazonaws.com/dev'

const ShopProducts = () => {
  const { shopType } = useParams<{ shopType?: ShopType }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { getShopProducts, getShopTheme, getShopName, loadShopProducts, hasMore } = useShop()
  const { addToCart, getTotalItems, setCurrentTenant } = useCart()

  const rol = user?.rol || ''
  const token = user?.token || null

  // local stock overrides
  const [stockMap, setStockMap] = useState<Record<string, number>>({})

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)

  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newStock, setNewStock] = useState('')

  useEffect(() => {
    if (isAuthenticated && shopType && token) {
      loadShopProducts(shopType, token)
      setStockMap({})
    }
  }, [isAuthenticated, shopType, token])

  const products = shopType ? getShopProducts(shopType) : []

  // combine original products with override stockMap
  const displayList = useMemo(() => {
    const list = (isSearchActive ? filteredProducts : products)
    return list.map(p => ({
      ...p,
      stock: stockMap[p.id] ?? p.stock,
      inStock: (stockMap[p.id] ?? p.stock) > 0
    }))
  }, [products, filteredProducts, isSearchActive, stockMap])

  const theme = shopType ? getShopTheme(shopType) : {
    primary: 'bg-blue-600', secondary: 'bg-blue-500', accent: 'bg-blue-400',
    background: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200',
    hover: 'hover:bg-blue-700', button: 'bg-blue-600 hover:bg-blue-700', card: 'bg-white border-blue-200'
  }
  const shopName = shopType ? getShopName(shopType) : 'Tienda'

  const handleSearchResults = (results: Product[], query: string) => {
    setFilteredProducts(results)
    setIsSearchActive(query.trim().length >= 2)
  }

  const handleBuyNow = async (productId: string) => {
    if (!isAuthenticated) return navigate('/login')
    if (!shopType || !token) return

    try {
      // fetch latest stock
      const { stock, available } = await checkProductStock(shopType, productId, token)
      if (!available) {
        alert('Lo sentimos, este producto está agotado.')
        loadShopProducts(shopType, token)
        return
      }

      // update local stock immediately
      setStockMap(prev => ({ ...prev, [productId]: stock - 1 }))

      const product = products.find(p => p.id === productId)
      if (!product) return

      setCurrentTenant(shopType)
      addToCart(product)
    } catch (err) {
      console.error('Error al verificar stock:', err)
      alert('No se pudo verificar stock, inténtalo más tarde.')
    }
  }

  const handleLoadMore = () => {
    if (token && shopType) loadShopProducts(shopType, token, true)
  }

  const handleDelete = async (id: string) => {
    if (!token || !shopType) return
    await fetch(`${API_BASE}/productos/eliminar`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tenant_id: shopType, producto_id: id })
    })
    loadShopProducts(shopType, token)
  }

  const handleCreateProduct = async () => {
    if (!token || !newName || !newPrice || !newStock || !shopType) return
    const nuevo = { tenant_id: shopType, nombre: newName, precio: parseFloat(newPrice), stock: parseInt(newStock) }
    await fetch(`${API_BASE}/productos/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(nuevo)
    })
    setNewName(''); setNewPrice(''); setNewStock('')
    loadShopProducts(shopType, token)
  }

  if (!shopType || !['tottus','plazavea','wong'].includes(shopType)) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tienda no encontrada</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-700">Volver al inicio</Link>
      </div>
    </div>
  }

  return (
    <div className={`min-h-screen ${theme.background} p-6`}>
      <div className="flex flex-col items-start w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">{shopName}</h1>
              <p className="text-lg text-gray-600">Descubre los mejores productos</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Productos disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{displayList.length}</p>
            </div>
          </div>
          <div className={`h-2 w-full ${theme.primary} rounded-full shadow-lg`} />
        </div>

        {/* Search */}
        <div className="w-full mb-8 bg-white rounded-2xl shadow-lg p-6">
          <SearchBar products={products} onSearch={handleSearchResults} />
        </div>

        {/* Admin Section */}
        {rol==='ADMIN' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 w-full">
            {/* Admin form fields omitted for brevity */}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
          {displayList.map(product=>(
            <div key={product.id} className={`${theme.card} rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                  <span className={`w-3 h-3 rounded-full ${product.inStock?'bg-green-500':'bg-red-500'}`} />
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <span className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full font-semibold shadow-sm border border-gray-200 bg-white ${
                  product.stock>10?'text-green-700':product.stock>0?'text-yellow-700':'text-red-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${product.stock>10?'bg-green-500':product.stock>0?'bg-yellow-400':'bg-red-500'}`} />
                  {product.stock>0?`${product.stock} disponibles`:'Sin stock'}
                </span>
                <div className="text-2xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</div>
                <button onClick={()=>handleBuyNow(product.id)} disabled={!product.inStock} className={`w-full px-6 py-3 rounded-xl font-semibold text-white transform hover:scale-105 transition-all ${product.inStock?theme.primary:'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                  {product.inStock?'🛒 Agregar al Carrito':'❌ Agotado'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {!isSearchActive&&shopType&&hasMore(shopType)&&(
          <div className="text-center mt-12 w-full">
            <button onClick={handleLoadMore} className={`px-8 py-4 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-all ${theme.primary}`}>
              📦 Cargar más productos
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopProducts
