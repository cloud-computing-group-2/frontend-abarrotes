import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
// import { getPurchaseHistory } from '../services/cartService';

const fakeHistory = [
  {
    id: '1',
    shop: 'Tienda Central',
    date: '2024-06-01',
    items: [
      { name: 'Arroz', quantity: 2, price: 5.5 },
      { name: 'Azúcar', quantity: 1, price: 4.0 },
    ],
    total: 15.0,
  },
  {
    id: '2',
    shop: 'Bodega Norte',
    date: '2024-05-28',
    items: [
      { name: 'Aceite', quantity: 1, price: 10.0 },
    ],
    total: 10.0,
  },
];

const HistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // Para usar datos fake:
        setHistory(fakeHistory);
        // const compras = await getPurchaseHistory(user.tenant_id, user.token || '');
        // setHistory(Array.isArray(compras) ? compras : []);
      } catch (err: any) {
        setError(err.message || 'Error al obtener el historial');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const safeHistory = Array.isArray(history) ? history : [];

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
                <li key={order.id || idx} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{order.shop || order.tienda || 'Tienda'}</span>
                    <span className="text-sm text-gray-500">{order.date || order.fecha || ''}</span>
                  </div>
                  <ul className="ml-4 list-disc text-gray-700 text-sm mb-2">
                    {(order.items || order.productos || []).map((item: any, i: number) => (
                      <li key={i}>
                        {item.quantity || item.cantidad} x {item.name || item.producto} <span className="text-gray-400">@ S/{(item.price || item.precio)?.toFixed ? (item.price || item.precio).toFixed(2) : item.price || item.precio}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right font-bold text-blue-700">Total: S/{order.total?.toFixed ? order.total.toFixed(2) : order.total || order.monto_total}</div>
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