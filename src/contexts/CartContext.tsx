import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from './ShopContext'
import { ShopType } from '../App'
import { useAuth } from './AuthContext'

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

  const addToCart = (product: Product) => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito')
      return
    }

    // Verificar que el producto sea del tenant del usuario
    if (user && user.tenant_id !== product.tenant) {
      alert(`Solo puedes comprar productos de tu tienda (${user.tenant_id})`)
      return
    }

    setItems(prevItems => {
      // Si el carrito está vacío, establecer el tenant actual
      if (prevItems.length === 0) {
        setCurrentTenant(product.tenant)
      }
      
      // Solo permitir productos del mismo tenant
      if (prevItems.length > 0 && prevItems[0].tenant !== product.tenant) {
        alert('Solo puedes comprar productos de la tienda actual')
        return prevItems // No agregar productos de otros tenants
      }
      
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

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