import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout, cartCount }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">E-Shop Abarrotes</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/catalogo">Catálogo</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/carrito">Carrito 🛒 ({cartCount})</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/perfil">Perfil 👤</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={onLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Registro</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
