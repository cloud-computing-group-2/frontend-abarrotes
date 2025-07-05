import { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { Product } from '../contexts/ShopContext'

interface SearchBarProps {
  products: Product[]
  onSearchResults: (results: Product[]) => void
  placeholder?: string
}

const SearchBar = ({ products, onSearchResults, placeholder = "Buscar productos..." }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Función de búsqueda fuzzy (tolerancia a errores tipográficos)
  const fuzzySearch = (text: string, searchTerm: string): boolean => {
    const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const normalizedSearch = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    
    if (normalizedSearch.length === 0) return true
    
    let searchIndex = 0
    for (let i = 0; i < normalizedText.length && searchIndex < normalizedSearch.length; i++) {
      if (normalizedText[i] === normalizedSearch[searchIndex]) {
        searchIndex++
      }
    }
    
    // Permitir hasta 2 errores tipográficos
    const maxErrors = Math.max(1, Math.floor(normalizedSearch.length * 0.3))
    return searchIndex >= normalizedSearch.length - maxErrors
  }

  // Función de búsqueda por prefijo
  const prefixSearch = (text: string, searchTerm: string): boolean => {
    const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const normalizedSearch = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return normalizedText.startsWith(normalizedSearch)
  }

  // Función de búsqueda principal
  const searchProducts = (searchTerm: string): Product[] => {
    if (!searchTerm.trim()) return []
    
    const results: Product[] = []
    const searchFields = ['name', 'description', 'category']
    
    products.forEach(product => {
      let matchFound = false
      
      // Buscar en todos los campos del producto
      for (const field of searchFields) {
        const fieldValue = product[field as keyof Product] as string
        
        // Búsqueda por prefijo (prioridad alta)
        if (prefixSearch(fieldValue, searchTerm)) {
          results.unshift(product) // Agregar al inicio para prioridad
          matchFound = true
          break
        }
        
        // Búsqueda fuzzy (prioridad media)
        if (fuzzySearch(fieldValue, searchTerm)) {
          results.push(product)
          matchFound = true
          break
        }
      }
    })
    
    // Eliminar duplicados y limitar resultados
    const uniqueResults = results.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    )
    
    return uniqueResults.slice(0, 8) // Máximo 8 resultados
  }

  // Efecto para manejar la búsqueda
  useEffect(() => {
    const results = searchProducts(query)
    setFilteredProducts(results)
    onSearchResults(results)
    setIsDropdownOpen(query.length > 0 && results.length > 0)
    setSelectedIndex(-1)
  }, [query, products])

  // Efecto para manejar clicks fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
          handleSelectProduct(filteredProducts[selectedIndex])
        }
        break
      case 'Escape':
        setIsDropdownOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSelectProduct = (product: Product) => {
    setQuery(product.name)
    setIsDropdownOpen(false)
    setSelectedIndex(-1)
    onSearchResults([product])
  }

  const handleClearSearch = () => {
    setQuery('')
    setIsDropdownOpen(false)
    setSelectedIndex(-1)
    onSearchResults([])
    inputRef.current?.focus()
  }

  const highlightMatch = (text: string, searchTerm: string): string => {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length > 0 && filteredProducts.length > 0) {
              setIsDropdownOpen(true)
            }
          }}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown de autocompletado */}
      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="py-1">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                  index === selectedIndex ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div 
                      className="font-medium text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(product.name, query)
                      }}
                    />
                    <div 
                      className="text-sm text-gray-600 truncate"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(product.description, query)
                      }}
                    />
                    <div className="text-xs text-gray-500">
                      {product.category} • ${product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && query && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No se encontraron productos que coincidan con "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar 