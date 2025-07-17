import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { useCart } from '../contexts/CartContext';
import SearchBar from '../components/SearchBar';
import { Product } from '../contexts/ShopContext';
import { checkProductStock } from '../services/productService';
import { ShopType } from '../App';

const ShopProducts = () => {
  const { shopType } = useParams<{ shopType?: ShopType }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    getShopProducts,
    getShopTheme,
    getShopName,
    loadShopProducts,
    hasMore
  } = useShop();
  const { addToCart, removeFromCart, setCurrentTenant } = useCart();

  const [agregadoMap, setAgregadoMap] = useState<Record<string, number>>({});
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Carga productos y resetea stockMap
  useEffect(() => {
    if (isAuthenticated && shopType && user?.token) {
      loadShopProducts(shopType, user.token);
      setStockMap({});
    }
  }, [isAuthenticated, shopType, user?.token]);

  // Resetea contador al cambiar tienda
  useEffect(() => {
    setAgregadoMap({});
  }, [shopType]);

  const products = shopType ? getShopProducts(shopType) : [];
  const displayList = useMemo(() => {
    const list = isSearchActive ? filteredProducts : products;
    return list.map(p => ({
      ...p,
      stock: stockMap[p.id] ?? p.stock,
      inStock: (stockMap[p.id] ?? p.stock) > 0
    }));
  }, [products, filteredProducts, isSearchActive, stockMap]);

  const theme = shopType
    ? getShopTheme(shopType)
    : { primary: 'bg-blue-600', background: 'bg-blue-50', card: 'bg-white border-blue-200' };
  const shopName = shopType ? getShopName(shopType) : 'Tienda';

  const handleSearchResults = (results: Product[], query: string) => {
    setFilteredProducts(results);
    setIsSearchActive(query.trim().length >= 2);
  };

  const handleBuyNow = async (productId: string) => {
    if (!isAuthenticated) return navigate('/login');
    if (!shopType || !user?.token) return;
    try {
      const { stock, available } = await checkProductStock(shopType, productId, user.token);
      if (!available) {
        alert('Producto agotado');
        loadShopProducts(shopType, user.token);
        return;
      }
      // decrement stock & increment counter
      setStockMap(prev => ({ ...prev, [productId]: stock - 1 }));
      setAgregadoMap(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
      const prod = products.find(p => p.id === productId);
      if (prod) {
        setCurrentTenant(shopType);
        addToCart(prod);
      }
    } catch {
      alert('Error al verificar stock');
    }
  };

  const handleDecrement = (productId: string) => {
    const current = agregadoMap[productId] || 0;
    if (current <= 0) return;
    setAgregadoMap(prev => ({ ...prev, [productId]: current - 1 }));
    setStockMap(prev => {
      const orig = products.find(p => p.id === productId)?.stock ?? 0;
      const now = prev[productId] ?? orig;
      return { ...prev, [productId]: now + 1 };
    });
    const prod = products.find(p => p.id === productId);
    if (prod) removeFromCart(prod);
  };

  // Nuevo: "Comprar" dirige a checkout tras añadir 1 unidad
  const handleComprarAhora = async (productId: string) => {
    await handleBuyNow(productId);
    navigate('/checkout');
  };

  const handleLoadMore = () => {
    if (user?.token && shopType) loadShopProducts(shopType, user.token, true);
  };

  if (!shopType || !['tottus', 'plazavea', 'wong'].includes(shopType)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
          <Link to="/" className="text-blue-600 hover:underline">Volver</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background} p-6`}>
      <h1 className="text-5xl font-bold mb-4">{shopName}</h1>
      <SearchBar products={products} onSearch={handleSearchResults} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {displayList.map(product => {
          const count = agregadoMap[product.id] || 0;
          return (
            <div key={product.id} className={`${theme.card} relative rounded-xl shadow p-6`}>
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</div>

              {/* Contador */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => handleDecrement(product.id)}
                  disabled={count === 0}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-bold disabled:opacity-50"
                >
                  −
                </button>
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-semibold"
                >
                  {count}
                </button>
                <button
                  onClick={() => handleBuyNow(product.id)}
                  disabled={!product.inStock}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-bold disabled:opacity-50"
                >
                  +
                </button>
              </div>

              {/* Botón de "Comprar ahora" */}
              <button
                onClick={() => handleComprarAhora(product.id)}
                disabled={!product.inStock}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Comprar Ahora
              </button>

              <div className="mt-2 text-center text-sm text-gray-500">
                {product.inStock ? `${product.stock} disponibles` : '❌ Agotado'}
              </div>
            </div>
          );
        })}
      </div>

      {!isSearchActive && shopType && hasMore(shopType) && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            className={`px-8 py-4 text-white text-lg font-semibold rounded-xl shadow-lg ${theme.primary} hover:opacity-90`}
          >
            📦 Cargar más productos
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopProducts;
