import { useState } from 'react';

export default function Catalogo({ addToCart }) {
  const categories = ['Categoria1', 'Categoria2', 'Categoria3', 'Categoria4', 'Categoria5', 'Categoria6'];
  
  // Simulamos productos
  const products = {
    Categoria1: ['Arroz', 'Fideos'],
    Categoria2: ['Leche', 'Yogurt'],
    Categoria3: ['Aceite', 'Sal'],
    Categoria4: ['Azúcar', 'Mantequilla'],
    Categoria5: ['Jugo', 'Refresco'],
    Categoria6: ['Pan', 'Galletas'],
  };

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-3">
          <h5>Categorías</h5>
          <ul className="list-group">
            {categories.map(cat => (
              <li key={cat} className={`list-group-item ${cat === selectedCategory ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedCategory(cat)}>
                {cat}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-9">
          <h5>Productos de {selectedCategory}</h5>
          <div className="row">
            {products[selectedCategory].map((prod, idx) => (
              <div key={idx} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{prod}</h5>
                    <button className="btn btn-primary" onClick={() => addToCart({ name: prod, category: selectedCategory })}>
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
