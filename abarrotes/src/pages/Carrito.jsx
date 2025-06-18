export default function Carrito({ cart, handlePurchase, removeFromCart }) {
  return (
    <div className="container mt-4">
      <h3>Tu Carrito 🛒</h3>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.name} - {item.category}</span>
                <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(idx)}>Quitar</button>
              </li>
            ))}
          </ul>
          <button className="btn btn-success" onClick={handlePurchase}>Comprar Todo</button>
        </>
      )}
    </div>
  );
}
