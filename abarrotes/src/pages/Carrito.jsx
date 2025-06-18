export default function Carrito({ cart, handlePurchase }) {
  return (
    <div className="container mt-4">
      <h3>Tu Carrito 🛒</h3>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((item, idx) => (
              <li key={idx} className="list-group-item">
                {item.name} - {item.category}
              </li>
            ))}
          </ul>
          <button className="btn btn-success" onClick={handlePurchase}>Comprar</button>
        </>
      )}
    </div>
  );
}
