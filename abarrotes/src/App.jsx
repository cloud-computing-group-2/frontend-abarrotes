import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import Navbar from './components/NavBar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({
    user_id: localStorage.getItem('user_id') || 'test@correo.com',
    tenant_id: localStorage.getItem('tenant_id') || 'tenant1',
  });

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handlePurchase = () => {
    setOrders([...orders, ...cart]);
    setCart([]);
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} cartCount={cart.length} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        {isLoggedIn && <Route path="/catalogo" element={<Catalogo addToCart={addToCart} />} />}
        {isLoggedIn && <Route path="/carrito" element={<Carrito cart={cart} handlePurchase={handlePurchase} />} />}
        {isLoggedIn && <Route path="/perfil" element={<Perfil user={user} orders={orders} />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
