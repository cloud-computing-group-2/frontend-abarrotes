import React, { createContext, useContext, ReactNode } from 'react'
import { ShopType } from '../App'

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
  const tottusProducts: Product[] = [
    {
      id: '1',
      name: 'Plátanos Orgánicos',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
      description: 'Plátanos orgánicos frescos de granjas locales',
      category: 'Frutas',
      inStock: true,
      tenant: 'tottus'
    },
    {
      id: '2',
      name: 'Pan Integral',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      description: 'Pan integral recién horneado',
      category: 'Panadería',
      inStock: true,
      tenant: 'tottus'
    },
    {
      id: '3',
      name: 'Yogurt Griego',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      description: 'Yogurt griego cremoso con cultivos vivos',
      category: 'Lácteos',
      inStock: true,
      tenant: 'tottus'
    },
    {
      id: '4',
      name: 'Espinacas Frescas',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
      description: 'Hojas de espinaca orgánica fresca',
      category: 'Verduras',
      inStock: true,
      tenant: 'tottus'
    }
  ]

  const plazaveaProducts: Product[] = [
    {
      id: '5',
      name: 'Arroz Premium',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      description: 'Arroz premium de alta calidad',
      category: 'Granos',
      inStock: true,
      tenant: 'plazavea'
    },
    {
      id: '6',
      name: 'Tomates Frescos',
      price: 2.49,
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
      description: 'Tomates maduros y jugosos',
      category: 'Verduras',
      inStock: true,
      tenant: 'plazavea'
    },
    {
      id: '7',
      name: 'Pechuga de Pollo',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
      description: 'Pechuga de pollo fresca sin hueso',
      category: 'Carnes',
      inStock: true,
      tenant: 'plazavea'
    },
    {
      id: '8',
      name: 'Jugo de Naranja',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
      description: 'Jugo de naranja 100% natural',
      category: 'Bebidas',
      inStock: true,
      tenant: 'plazavea'
    }
  ]

  const wongProducts: Product[] = [
    {
      id: '9',
      name: 'Aguacates',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400',
      description: 'Aguacates frescos y maduros',
      category: 'Frutas',
      inStock: true,
      tenant: 'wong'
    },
    {
      id: '10',
      name: 'Filete de Salmón',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      description: 'Filete de salmón del Atlántico fresco',
      category: 'Pescados',
      inStock: true,
      tenant: 'wong'
    },
    {
      id: '11',
      name: 'Queso Artesanal',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
      description: 'Selección de queso artesanal premium',
      category: 'Lácteos',
      inStock: true,
      tenant: 'wong'
    },
    {
      id: '12',
      name: 'Chocolate Negro',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
      description: 'Barra de chocolate negro rico',
      category: 'Snacks',
      inStock: true,
      tenant: 'wong'
    }
  ]

  const getShopProducts = (shopType: ShopType): Product[] => {
    switch (shopType) {
      case 'tottus':
        return tottusProducts
      case 'plazavea':
        return plazaveaProducts
      case 'wong':
        return wongProducts
      default:
        return []
    }
  }

  const getShopTheme = (shopType: ShopType) => {
    switch (shopType) {
      case 'tottus':
        return {
          primary: 'bg-tottus-600',
          secondary: 'bg-tottus-500',
          accent: 'bg-tottus-400',
          background: 'bg-tottus-50'
        }
      case 'plazavea':
        return {
          primary: 'bg-plazavea-red-600',
          secondary: 'bg-plazavea-yellow-500',
          accent: 'bg-plazavea-red-400',
          background: 'bg-plazavea-yellow-100'
        }
      case 'wong':
        return {
          primary: 'bg-wong-red-600',
          secondary: 'bg-white',
          accent: 'bg-wong-red-400',
          background: 'bg-gray-50'
        }
      default:
        return {
          primary: 'bg-blue-600',
          secondary: 'bg-blue-500',
          accent: 'bg-blue-400',
          background: 'bg-blue-50'
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
    getShopName
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
} 