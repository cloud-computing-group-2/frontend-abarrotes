import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getPurchaseHistory } from '../services/cartService';
// import { getPurchaseHistory } from '../services/cartService';

const HistoryPage = () => {
  const { user } = useAuth();
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
        user.tenant_id,
        user.token || '',
        10,
        lastKey
      );
      setHistory(prev => [...prev, ...items]);
      setLastKey(last_evaluated_key);
    } catch (err: any) {
      console.error('Error paginando:', err);
    }
  };

  const safeHistory = Array.isArray(history) ? history : [];
  console.log('Safe history:');
  console.log(safeHistory);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Historial de Compras</h1>
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl">
        <p className="text-gray-600 mb-4">{user ? `Compras de ${user.user_id}` : 'Tus compras recientes:'}</p>
        {loading && <div className="text-center text-gray-400 py-8">Cargando historial...</div>}
        {error && <div className="text-center text-red-500 py-8">{error}</div>}
        {!loading && !error && (
          safeHistory.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No se han hecho compras.</div>
          ) : (
            <ul className="space-y-6">
              {safeHistory.map((order: any, idx: number) => (
                console.log('Order item:', order),
                <li key={order.cart_id || idx} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{order.tenant_id.split('#')[0]|| 'Tienda'}</span>
                    <span className="text-sm text-gray-500">{order.date || order.fecha || ''}</span>
                  </div>
                  <ul className="ml-4 list-disc text-gray-700 text-sm mb-2">
                    {(order.products || order.productos || []).map((item: any, i: number) => (
                      <li key={i}>
                        {item.amount} x {item.nombre} <span className="text-gray-400">@ S/{(item.price)?.toFixed ? (item.price).toFixed(2) : item.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right font-bold text-blue-700">Total: S/{order.total_price?.toFixed ? order.total_price.toFixed(2) : order.total_price}</div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default HistoryPage; 