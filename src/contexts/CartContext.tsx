import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from './ShopContext'
import { ShopType } from '../App'
import { useAuth } from './AuthContext'
import { addCartItem, deleteCartItem, updateCartItem } from '../services/cartService'; 

/*
type Product = {
  id: string;
  name: string;
  price: number;
  tenant: string;
  // ...
};

type User = {
  id: string;
  tenant_id: string;
};

*/

interface CartItem extends Product {
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

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión');
      return;
    }

    if (user && user.tenant_id !== product.tenant) {
      alert(`Solo puedes comprar productos de tu tienda (${user.tenant_id})`);
      return;
    }

    const existingItem = items.find(item => item.id === product.id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    // Backup del carrito actual
    const previousItems = [...items];

    try {
      // Optimistic update
      setItems(prevItems => {
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          setCurrentTenant(product.tenant);
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });

      // Backend update
      if (existingItem) {
        await updateCartItem(
          {
            tenant_id: user?.tenant_id,
            user_id: user?.user_id,
            product_id: product.id,
            amount: newQuantity,
          },
          user?.token
        );
      } else {
        await addCartItem(
          {
            tenant_id: user?.tenant_id,
            user_id: user?.user_id,
            product_id: product.id,
            amount: 1,
          },
          user?.token
        );
      }

    } catch (error: any) {
      // Revert if backend fails
      setItems(previousItems);
      alert('Error al actualizar el carrito: ' + error.message);
      console.error('Error en el backend:', error.message);
    }
  };



  const removeFromCart = (productId: string) => {

      if (user && user.token) {
        deleteCartItem(
          {
            tenant_id: user.tenant_id,
            user_id: user.user_id,
            product_id: productId,
          },
          user.token
        ).then(response => {
          console.log(response.message);
        }).catch(error => {
          console.error('Error al eliminar producto del carrito:', error.message);
        });
      } else {
        console.error('Usuario no autenticado');
      }

    setItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(productId); // Aquí podrías también hacer una llamada al backend si quieres
      return;
    }
    const previousItems = [...items];
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    try {
      await updateCartItem(
        {
          tenant_id: user.tenant_id,
          user_id: user.user_id,
          product_id: productId,
          amount: quantity,
        },
        user.token
      );
    } catch (error: any) {
      setItems(previousItems);
      alert('Error al actualizar el carrito: ' + error.message);
      console.error('Error en el backend:', error.message);
    }
  };




  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
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
    setCurrentTenant
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
} 