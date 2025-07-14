import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useShop } from '../contexts/ShopContext'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, CreditCard, ShoppingBag, CheckCircle } from 'lucide-react'
import { ShopType } from '../App'
import { completeCart } from '../services/cartService'
import { useState } from 'react'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { shopType } = useParams<{ shopType?: ShopType }>()
  const {
    items,
    currentTenant,
    getTotalItems,
    getTotalPrice,
    clearCart
  } = useCart()
  const { getShopName } = useShop()
  const { isAuthenticated, user } = useAuth()
  const [ loading, setLoading ] = useState(false);

  // Si no hay shopType en la URL, verificar que hay productos en el carrito
  if (!shopType && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrito vacío</h1>
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

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Ir a comprar
          </button>
        </div>
      </div>
    )
  }

const handleConfirmOrder = async () => {
  if (
    !isAuthenticated ||
    !user ||
    !user.tenant_id ||
    !user.user_id ||
    !user.token
  ) {
    alert('Faltan datos del usuario o no estás autenticado');
    return;
  }

  setLoading(true);

  try {
    await completeCart(
      {
        tenant_id: user.tenant_id,
        user_id: user.user_id,
      },
      user.token
    );

    const totalPrice = getTotalPrice();
    const totalItems = getTotalItems();
    const tenantName = items.length > 0 ? getShopName(items[0].tenant) : 'Tienda';

    const message = `¡Compra Exitosa!

Tenant: ${tenantName}
Productos: ${totalItems} items
Precio Total: $${totalPrice.toFixed(2)}

¡Gracias por tu compra! Tu pedido ha sido procesado.`;

    alert(message);
    clearCart();
    navigate('/');
  } catch (error: any) {
    console.error('Error al confirmar la compra en backend:', error.message);
    alert('Ocurrió un error al confirmar tu compra. Intenta nuevamente.');
  } finally {
    setLoading(false);
  }
};


  const tenantName = items.length > 0 ? getShopName(items[0].tenant) : 'Tienda'

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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">💳 Confirmar Pedido</h1>
                <p className="text-lg text-gray-600">
                  {items.length > 0 ? `${getShopName(items[0].tenant)} - ${getTotalItems()} productos` : 'Productos de la tienda'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full px-4 py-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido del checkout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalles del pedido */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resumen del pedido */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white">📦 Resumen del Pedido</h2>
                <p className="text-blue-100">Revisa los productos que vas a comprar</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-6 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                        <p className="text-xs text-gray-500">${item.price.toFixed(2)} c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Información de envío */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
                <h2 className="text-2xl font-bold text-white">🚚 Información de Envío</h2>
                <p className="text-green-100">Dónde quieres recibir tu pedido</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Tu número de teléfono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección de envío</label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Ingresa tu dirección completa"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información de pago */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-2xl font-bold text-white">💳 Información de Pago</h2>
                <p className="text-purple-100">Método de pago seguro</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de tarjeta</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de vencimiento</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Resumen de Compra</h2>
              
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
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-6 w-6" />
                    <span>Confirmar Compra</span>
                  </>
                )}
              </button>
              
              <div className="mt-6 space-y-3 text-center">
                <p className="text-sm text-gray-500">
                  🛡️ Compra segura con encriptación SSL
                </p>
                <p className="text-sm text-gray-500">
                  🔒 Tus datos están protegidos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage 