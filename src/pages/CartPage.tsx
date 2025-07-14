import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useShop } from '../contexts/ShopContext'
import { useAuth } from '../contexts/AuthContext'
import { X, Plus, Minus, ShoppingBag, CreditCard, ArrowLeft } from 'lucide-react'
import { ShopType } from '../App'

const CartPage = () => {
  const navigate = useNavigate()
  const { shopType } = useParams<{ shopType: ShopType }>()
  const {
    items,
    currentTenant,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
    verifyCartStock
  } = useCart()
  const { getShopName } = useShop()
  const { isAuthenticated } = useAuth()

  if (!shopType || !['tottus', 'plazavea', 'wong'].includes(shopType)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tienda no encontrada</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header mejorado */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">🛒 Carrito de Compras</h1>
                <p className="text-lg text-gray-600">
                  {items.length > 0 ? `${getShopName(items[0].tenant)} - ${getTotalItems()} productos` : 'Tu carrito está vacío'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full px-6 py-3">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">{getTotalItems()} items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido del carrito */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-8 text-lg">Agrega productos de cualquier tienda para continuar</p>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
              >
                🛍️ Ir a las tiendas
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <h2 className="text-2xl font-bold text-white">Productos en tu carrito</h2>
                  <p className="text-blue-100">
                    {items.length > 0 ? `${getShopName(items[0].tenant)} - ${items.length} productos únicos` : 'Productos de la tienda'}
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className={`p-6 hover:bg-gray-50 transition-colors ${!item.inStock ? 'bg-red-50 border-l-4 border-red-400' : ''}`}>
                      <div className="flex items-center space-x-6">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                            <div className="flex items-center space-x-2">
                              {!item.inStock && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                  ⚠️ Sin stock
                                </span>
                              )}
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{item.description}</p>
                          <p className="text-sm text-gray-500 mb-4">{item.category}</p>
                          {!item.inStock && (
                            <p className="text-sm text-red-600 font-medium mb-2">
                              ⚠️ Este producto no está disponible en stock
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <Minus className="h-5 w-5" />
                            </button>
                            <span className="w-16 text-center text-xl font-bold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} c/u</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Seguir comprando
                </button>
                <button
                  onClick={verifyCartStock}
                  className="px-8 py-4 border-2 border-orange-300 rounded-xl text-orange-700 font-semibold hover:bg-orange-50 transition-colors"
                >
                  🔍 Verificar Stock
                </button>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items):</span>
                    <span className="text-xl font-bold text-gray-900">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Envío:</span>
                    <span className="text-green-600 font-semibold">🆓 Gratis</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-2xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-3"
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Proceder al Checkout</span>
                </button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    🛡️ Compra segura con encriptación SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage 