import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from './ShopContext'
import { ShopType } from '../App'
import { useAuth } from './AuthContext'
import { useShop } from './ShopContext'
import { addCartItem, deleteCartItem, getCart, updateCartItem } from '../services/cartService'
import { checkProductStock } from '../services/productService'

export interface CartItem extends Product {
  quantity: number
}



interface CartContextType {
  items: CartItem[]
  currentTenant: ShopType | null
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setCurrentTenant: (tenant: ShopType) => void
  verifyCartStock: () => Promise<void>
  fetchCartFromBackend: () =>Promise<void>
  updateCart: (product: CartItem) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [currentTenant, setCurrentTenant] = useState<ShopType | null>(null)
  const { isAuthenticated, user } = useAuth()
  const { getShopProducts } = useShop()

  // Función para verificar stock usando la información ya cargada
  const checkStockFromLoadedProducts = (productId: string, tenant: ShopType): { stock: number; available: boolean } => {
    const products = getShopProducts(tenant)
    const product = products.find(p => p.id === productId)
    
    if (!product) {
      return { stock: 0, available: false }
    }
    
    return {
      stock: product.stock,
      available: product.inStock
    }
  }

  // Función para verificar stock en tiempo real desde la API
  const checkStockFromAPI = async (productId: string, tenant: ShopType): Promise<{ stock: number; available: boolean }> => {
    if (!user?.token) {
      return { stock: 0, available: false }
    }

    try {
      return await checkProductStock(tenant, productId, user.token)
    } catch (error) {
      console.error('Error verificando stock desde API:', error)
      // Fallback a la información local
      return checkStockFromLoadedProducts(productId, tenant)
    }
  }

  const fetchCartFromBackend = async () => {
    if (!user || !user.tenant_id || !user.user_id || !user.token) return;

    try {
      const { products } = await getCart(user.tenant_id, user.user_id, user.token);

      console.log("prods");
      console.log(products);

      console.log("prductos");

      console.log(products)

      setItems(
        products.map(p => ({
          id: p.product_id,
          name: p.nombre,
          price: p.precio,
          image: p.image || '', // valor por defecto
          description: p.description || '',
          category: p.category || '',
          inStock: true, // o false si lo sabes
          stock: p.stock || 100, // o el valor real si lo tienes
          tenant: user?.tenant_id as ShopType,
          quantity: p.amount ?? 1,
        }))
      );


      if (products.length > 0) {
        setCurrentTenant(products[0].tenant);
      }
    } catch (error: any) {
      console.error('Error al obtener el carrito:', error.message);
      //alert('No se pudo cargar el carrito');
    }
  };

const addToCart = async (product: CartItem) => {

  if (!isAuthenticated || !user?.tenant_id || !user?.user_id || !user?.token) {
    alert('Faltan datos del usuario o no estás autenticado');
    return;
  }

  if (user.tenant_id !== product.tenant) {
    alert(`Solo puedes comprar productos de tu tienda (${user.tenant_id})`);
    return;
  }

  const existingItem = items.find(item => item.id === product.id);
  const previousItems = [...items];

  try {
    if (existingItem) {
      //const updatedAmount = existingItem.quantity + product.quantity;

      await updateCartItem(
        {
          tenant_id: user.tenant_id,
          user_id: user.user_id,
          product_id: product.id,
          amount: product.quantity,
        },
        user.token
      );

      setItems(
        items.map(item =>
          item.id === product.id
            ? { ...item, quantity: product.quantity }
            : item
        )
      );
    } else {
      await addCartItem(
        {
          tenant_id: user.tenant_id,
          user_id: user.user_id,
          product_id: product.id,
          amount: product.quantity,
        },
        user.token
      );

      setItems([...items, product]);
    }

    setCurrentTenant(product.tenant);
  } catch (error: any) {
    console.error('Error al actualizar el carrito:', error.message);
    setItems(previousItems);
    alert('Error al actualizar el carrito: ' + error.message);
  }
};

const updateCart = async (product: CartItem) => {

  if (!isAuthenticated || !user?.tenant_id || !user?.user_id || !user?.token) {
    alert('Faltan datos del usuario o no estás autenticado');
    return;
  }

  if (user.tenant_id !== product.tenant) {
    alert(`Solo puedes comprar productos de tu tienda (${user.tenant_id})`);
    return;
  }
  const previousItems = [...items];
  setItems(
    items.map(item =>
      item.id === product.id
        ? { ...item, quantity: product.quantity }
        : item
    )
  );

  try {

      await updateCartItem(
        {
          tenant_id: user.tenant_id,
          user_id: user.user_id,
          product_id: product.id,
          amount: product.quantity,
        },
        user.token
      );
    
  } catch (error: any) {
    console.error('Error al actualizar el carrito:', error.message);
    alert('Error al actualizar el carrito: ' + error.message);
    setItems(previousItems);
  }
};

  const removeFromCart = (productId: string) => {
    if (user?.tenant_id && user?.user_id && user?.token) {
      deleteCartItem(
        {
          tenant_id: user.tenant_id,
          user_id: user.user_id,
          product_id: productId,
        },
        user.token
      )
        .then(response => {
          console.log(response.message)
        })
        .catch(error => {
          console.error('Error al eliminar producto del carrito:', error.message)
        })
    } else {
      console.error('Usuario no autenticado o datos incompletos')
    }

    setItems(prevItems => prevItems.filter(item => item.id !== productId))
  }


  const updateQuantity = (productId: string, newQuantity: number) => {
    if (!user || !user.tenant_id || !user.user_id || !user.token) return

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      )
    )
  }


  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    console.log(items)
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const verifyCartStock = async () => {
    if (!user?.token) {
      alert('Usuario no autenticado, no se puede verificar el stock del carrito.')
      return
    }

    const updatedItems: CartItem[] = []
    let stockChanged = false
    let unavailableProducts: string[] = []

    for (const item of items) {
      try {
        const stockInfo = await checkStockFromAPI(item.id, item.tenant)
        
        if (!stockInfo.available) {
          unavailableProducts.push(item.name)
          updatedItems.push({ ...item, quantity: 0 })
          stockChanged = true
        } else if (item.quantity > stockInfo.stock) {
          updatedItems.push({ ...item, quantity: stockInfo.stock })
          stockChanged = true
        } else {
          updatedItems.push(item)
        }
      } catch (error) {
        console.error(`Error verificando stock de ${item.name}:`, error)
        updatedItems.push(item) // Mantener cantidad actual si hay error
      }
    }

    setItems(updatedItems)

    // Mostrar mensaje al usuario
    if (stockChanged) {
      let message = 'Se actualizó el stock de algunos productos:\n'
      if (unavailableProducts.length > 0) {
        message += `\nProductos sin stock: ${unavailableProducts.join(', ')}`
      }
      message += '\n\nSe han ajustado las cantidades según el stock disponible.'
      alert(message)
    } else {
      alert('El stock de todos los productos está actualizado.')
    }
  }

  const value: CartContextType = {
    items,
    currentTenant,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    setCurrentTenant,
    verifyCartStock,
    fetchCartFromBackend,
    updateCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
