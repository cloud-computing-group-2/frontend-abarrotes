// ShopProducts.tsx actualizado con barra de búsqueda, banner, colores por tienda y opción de agregar producto solo para admins

import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useShop } from '../contexts/ShopContext'
import { useCart } from '../contexts/CartContext'
import { ArrowLeft, ShoppingCart, X } from 'lucide-react'
import { ShopType } from '../App'
import SearchBar from '../components/SearchBar'
import { Product } from '../contexts/ShopContext'

const API_BASE = 'https://sh7pqkg24f.execute-api.us-east-1.amazonaws.com/dev'

const ShopProducts = () => {
  const { shopType } = useParams<{ shopType?: ShopType }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { getShopProducts, getShopTheme, getShopName, loadShopProducts, hasMore } = useShop()
  const { addToCart, getTotalItems, setCurrentTenant } = useCart()

  const rol = user?.rol || ''
  const token = user?.token || null
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)

  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newStock, setNewStock] = useState('')

  useEffect(() => {
    if (isAuthenticated && shopType && token) {
      loadShopProducts(shopType, token)
    }
  }, [isAuthenticated, shopType, token])

  const products = shopType ? getShopProducts(shopType) : []
  const theme = shopType ? getShopTheme(shopType) : { background: 'bg-gray-100' }
  const shopName = shopType ? getShopName(shopType) : 'Tienda'

  const handleSearchResults = (results: Product[], query: string) => {
    setFilteredProducts(results)
    setIsSearchActive(query.trim().length >= 2)
  }

  const displayProducts = isSearchActive ? filteredProducts : products

  const handleBuyNow = (productId: string) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const product = products.find(p => p.id === productId)
    if (product && shopType) {
      setCurrentTenant(shopType)
      addToCart(product)
    }
  }

  const uniqueDisplayProducts = Array.from(
    new Map(displayProducts.map(p => [p.id, p])).values()
  )

  const handleLoadMore = () => {
    if (token && shopType) {
      loadShopProducts(shopType, token, true)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token || !shopType) return
    await fetch(`${API_BASE}/productos/eliminar`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ tenant_id: shopType, producto_id: id })
    })
    loadShopProducts(shopType, token)
  }

  const handleCreateProduct = async () => {
    if (!token || !newName || !newPrice || !newStock || !shopType) return

    const nuevoProducto = {
      tenant_id: shopType,
      nombre: newName,
      precio: parseFloat(newPrice),
      stock: parseInt(newStock)
    }

    await fetch(`${API_BASE}/productos/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nuevoProducto)
    })

    setNewName('')
    setNewPrice('')
    setNewStock('')
    loadShopProducts(shopType, token)
  }

  const buttonColor =
    shopType === 'wong' || shopType === 'tottus' ? 'bg-red-600' : 'bg-green-600'

  if (!shopType || !['tottus', 'plazavea', 'wong'].includes(shopType)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tienda no encontrada</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.background} p-6`}>
      <div className="flex flex-col items-start w-full max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">{shopName}</h2>
        <div className="h-1 w-full bg-gray-300 mb-4" />
        <SearchBar products={products} onSearch={handleSearchResults} />

        {rol === 'ADMIN' && (
          <div className="bg-white mt-6 p-4 rounded shadow w-full">
            <h3 className="text-lg font-semibold mb-2">Agregar Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre" className="border p-2 rounded" />
              <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Precio" className="border p-2 rounded" />
              <input type="number" value={newStock} onChange={e => setNewStock(e.target.value)} placeholder="Stock" className="border p-2 rounded" />
            </div>
            <button onClick={handleCreateProduct} className={`mt-4 px-4 py-2 text-white rounded shadow ${buttonColor}`}>Agregar Producto</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 w-full">
          {uniqueDisplayProducts.map(product => (
            <div key={product.id} className="bg-white shadow p-4 rounded">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-1">Stock: {product.stock}</p>
              <div className="text-xl font-bold text-gray-900 mb-2">${product.price.toFixed(2)}</div>
              <button
                onClick={() => handleBuyNow(product.id)}
                disabled={!product.inStock}
                className="w-full px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {product.inStock ? 'Comprar Ahora' : 'Agotado'}
              </button>
              {rol === 'ADMIN' && (
                <button
                  onClick={() => handleDelete(product.id)}
                  className={`mt-2 w-full px-4 py-2 text-white rounded ${buttonColor}`}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {!isSearchActive && shopType && hasMore(shopType) && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-700"
            >
              Cargar más
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopProducts
