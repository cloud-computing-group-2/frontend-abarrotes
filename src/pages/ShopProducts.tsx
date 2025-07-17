import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { useCart, CartItem } from '../contexts/CartContext';
import SearchBar from '../components/SearchBar';
import { Product } from '../contexts/ShopContext';
import { checkProductStock } from '../services/productService';
import { ShopType } from '../App';



const ShopProducts = () => {
  const { shopType } = useParams<{ shopType?: ShopType }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getShopProducts, getShopTheme, getShopName, loadShopProducts, hasMore } = useShop();
  const { addToCart, removeFromCart, setCurrentTenant } = useCart();

  const [agregadoMap, setAgregadoMap] = useState<Record<string, number>>({});
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  

  // Load products and reset local stock
  useEffect(() => {
    if (isAuthenticated && shopType && user?.token) {
      loadShopProducts(shopType, user.token);
      setStockMap({});
    }
  }, [isAuthenticated, shopType, user?.token]);

  // Reset counters when switching shops
  useEffect(() => {
    setAgregadoMap({});
  }, [shopType]);

  const products = shopType ? getShopProducts(shopType) : [];
  const displayList = useMemo(() => {
    const list = isSearchActive ? filteredProducts : products;
    return list.map(p => ({
      ...p,
      stock: stockMap[p.id] ?? p.stock,
      inStock: (stockMap[p.id] ?? p.stock) > 0,
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


  const handleIncrement = (productId: string) => {
    setAgregadoMap(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleDecrement = (productId: string) => {
    setAgregadoMap(prev => {
      const current = prev[productId] || 0;
      if (current > 0) {
        return {
          ...prev,
          [productId]: current - 1
        };
      }
      return prev;
    });
  };


  const handleComprarAhora = (product: Product, count: number) => {

    const cartItem: CartItem = {
      ...product,
      quantity: count,
    };

    addToCart(cartItem);

  }


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
            <div key={product.id} className={`${theme.card} rounded-xl shadow p-6`}>
              {/* Title with +/- counter */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrement(product.id)}
                    disabled={count === 0}
                    className="px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >−</button>
                  <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
                    {count}
                  </span>
                  <button
                    onClick={() => handleIncrement(product.id)}
                    disabled={!product.inStock}
                    className="px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  >+</button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</div>

              <button
                onClick={() => handleComprarAhora(product, count)}
                disabled={!product.inStock}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 mb-2"
              >
                Comprar Ahora
              </button>

              <div className="text-center text-sm text-gray-500">
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
            className={`px-8 py-4 text-white font-semibold rounded-xl shadow-lg ${theme.primary} hover:opacity-90`}
          >
            📦 Cargar más productos
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopProducts;
