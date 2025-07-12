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
  tenant: ShopType
}

interface ShopContextType {
  getShopProducts: (shopType: ShopType) => Product[]
  getShopTheme: (shopType: ShopType) => {
    primary: string
    secondary: string
    accent: string
    background: string
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
          primary: 'bg-tottus-600',
          secondary: 'bg-tottus-500',
          accent: 'bg-tottus-400',
          background: 'bg-tottus-50',
        }
      case 'plazavea':
        return {
          primary: 'bg-plazavea-red-600',
          secondary: 'bg-plazavea-yellow-500',
          accent: 'bg-plazavea-red-400',
          background: 'bg-plazavea-yellow-100',
        }
      case 'wong':
        return {
          primary: 'bg-wong-red-600',
          secondary: 'bg-white',
          accent: 'bg-wong-red-400',
          background: 'bg-gray-50',
        }
      default:
        return {
          primary: 'bg-blue-600',
          secondary: 'bg-blue-500',
          accent: 'bg-blue-400',
          background: 'bg-blue-50',
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
