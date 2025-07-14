import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getPurchaseHistory } from '../services/cartService';
import { ArrowLeft, Clock, Package, DollarSign, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const { items, last_evaluated_key } = await getPurchaseHistory(
          user.tenant_id + '#' + user.user_id,
          user.token || '',
          10
        );
        console.log('Purchase history fetched:');
        console.log(items);
        setHistory(items);
        setLastKey(last_evaluated_key);
      } catch (err: any) {
        setError(err.message || 'Error al obtener el historial');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const loadMore = async () => {
    if (!user || !lastKey) return;

    try {
      const { items, last_evaluated_key } = await getPurchaseHistory(
        user.tenant_id + '#' + user.user_id,
        user.token || '',
        10,
        lastKey
      );
      setHistory(prev => [...prev, ...items]);
      setLastKey(last_evaluated_key || null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar más historial');
    }
  };

  const safeHistory = Array.isArray(history) ? history : [];
  console.log('Safe history:');
  console.log(safeHistory);

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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Historial de Compras</h1>
                <p className="text-lg text-gray-600">
                  {user ? `Compras de ${user.user_id}` : 'Tus compras recientes'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Historial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido del historial */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cargando historial...</h2>
              <p className="text-gray-600">Obteniendo tus compras recientes</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          safeHistory.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">No hay compras aún</h2>
                <p className="text-gray-600 mb-8 text-lg">Realiza tu primera compra para ver tu historial aquí</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  🛍️ Ir a comprar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tus Compras Recientes</h2>
                <div className="space-y-3">
                  {safeHistory.map((order: any, idx: number) => {
                    let tienda = (order.tenant_id?.split('#')[0]?.toLowerCase() || '');
                    let bg = 'from-gray-50 to-white';
                    if (tienda === 'tottus') bg = 'from-green-50 to-green-100';
                    else if (tienda === 'plazavea') bg = 'from-yellow-50 via-red-50 to-yellow-100';
                    else if (tienda === 'wong') bg = 'from-white to-red-50';
                    return (
                      <div key={order.cart_id || idx} className={`bg-gradient-to-r ${bg} rounded-xl p-3 border border-gray-200 hover:shadow-lg transition-all text-sm`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-gray-900">
                                {'Tienda ' + (order.tenant_id?.split('#')[0]?.toUpperCase() || 'TIENDA')}
                              </h3>
                              {/* Fecha eliminada */}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              S/{(order.total_price?.toFixed ? order.total_price.toFixed(2) : order.total_price) || '0.00'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(order.products || order.productos || []).length} productos
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {(order.products || order.productos || []).map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center py-1 px-2 bg-white rounded border border-gray-100 text-xs">
                              <span className="font-semibold text-gray-900">{item.nombre}</span>
                              <span className="text-gray-500">S/{(item.price)?.toFixed ? (item.price).toFixed(2) : item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {lastKey && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
                  >
                    📦 Cargar más compras
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HistoryPage; 