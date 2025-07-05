import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ShopProducts from './pages/ShopProducts'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import { AuthProvider } from './contexts/AuthContext'
import { ShopProvider } from './contexts/ShopContext'
import { CartProvider } from './contexts/CartContext'

export type ShopType = 'tottus' | 'plazavea' | 'wong'

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shop/:shopType" element={<ShopProducts />} />
                <Route path="/cart/:shopType" element={<CartPage />} />
                <Route path="/checkout/:shopType" element={<CheckoutPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </ShopProvider>
    </AuthProvider>
  )
}

export default App 