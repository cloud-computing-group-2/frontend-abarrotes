import React, { createContext, useContext, ReactNode, useState } from 'react'
import { ShopType } from '../App'
import { fetchShopProducts } from '../services/productService'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  stock: number
  tenant: ShopType
}

interface ShopContextType {
  getShopProducts: (shopType: ShopType) => Product[]
  getShopTheme: (shopType: ShopType) => {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    border: string
    hover: string
    button: string
    card: string
  }
  getShopName: (shopType: ShopType) => string
  loadShopProducts: (shopType: ShopType, token: string, append?: boolean) => Promise<void>
  hasMore: (shopType: ShopType) => boolean
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export const useShop = () => {
  const context = useContext(ShopContext)
  if (context === undefined) {
    throw new Error('useShop debe ser usado dentro de un ShopProvider')
  }
  return context
}

interface ShopProviderProps {
  children: ReactNode
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  const [realProducts, setRealProducts] = useState<Record<ShopType, Product[]>>({tottus: [],
  plazavea: [],
  wong: [],})
  const [nextTokens, setNextTokens] = useState<Partial<Record<ShopType, string | null>>>({})

  const loadShopProducts = async (shopType: ShopType, token: string, append = false) => {
    try {
      const currentToken = append ? nextTokens[shopType] ?? undefined : undefined
      const result = await fetchShopProducts(shopType, token, currentToken)

      setRealProducts(prev => ({
        ...prev,
        [shopType]: append
          ? [...(prev[shopType] || []), ...result.items]
          : result.items,
      }))

      setNextTokens(prev => ({
        ...prev,
        [shopType]: result.nextToken,
      }))
    } catch (err) {
      console.error(`Error cargando productos desde el backend (${shopType}):`, err)
    }
  }

  const hasMore = (shopType: ShopType) => {
    return !!nextTokens[shopType]
  }

  const getShopProducts = (shopType: ShopType): Product[] => {
  return realProducts[shopType] || []
}


  const getShopTheme = (shopType: ShopType) => {
    switch (shopType) {
      case 'tottus':
        return {
          primary: 'bg-green-600',
          secondary: 'bg-green-500',
          accent: 'bg-green-400',
          background: 'bg-green-50',
          text: 'text-green-800',
          border: 'border-green-200',
          hover: 'hover:bg-green-700',
          button: 'bg-green-600 hover:bg-green-700',
          card: 'bg-white border-green-200',
        }
      case 'plazavea':
        return {
          primary: 'bg-red-600',
          secondary: 'bg-yellow-500',
          accent: 'bg-red-400',
          background: 'bg-gradient-to-br from-yellow-50 to-red-50',
          text: 'text-red-800',
          border: 'border-red-200',
          hover: 'hover:bg-red-700',
          button: 'bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600',
          card: 'bg-white border-red-200',
        }
      case 'wong':
        return {
          primary: 'bg-red-600',
          secondary: 'bg-white',
          accent: 'bg-red-400',
          background: 'bg-gradient-to-br from-white to-red-50',
          text: 'text-red-800',
          border: 'border-red-200',
          hover: 'hover:bg-red-700',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          card: 'bg-white border-red-200',
        }
      default:
        return {
          primary: 'bg-blue-600',
          secondary: 'bg-blue-500',
          accent: 'bg-blue-400',
          background: 'bg-blue-50',
          text: 'text-blue-800',
          border: 'border-blue-200',
          hover: 'hover:bg-blue-700',
          button: 'bg-blue-600 hover:bg-blue-700',
          card: 'bg-white border-blue-200',
        }
    }
  }

  const getShopName = (shopType: ShopType): string => {
    switch (shopType) {
      case 'tottus':
        return 'Tottus'
      case 'plazavea':
        return 'Plaza Vea'
      case 'wong':
        return 'Wong'
      default:
        return 'Tienda Desconocida'
    }
  }

  const value: ShopContextType = {
    getShopProducts,
    getShopTheme,
    getShopName,
    loadShopProducts,
    hasMore,
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}
