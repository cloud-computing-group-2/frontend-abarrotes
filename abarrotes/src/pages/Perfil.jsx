export default function Perfil({ user, orders }) {
  return (
    <div className="container mt-4">
      <h3>Mi Perfil 👤</h3>
      <p><strong>Email:</strong> {user.user_id}</p>
      <p><strong>Tenant ID:</strong> {user.tenant_id}</p>

      <h4 className="mt-4">Mis Compras 🛍️</h4>
      {orders.length === 0 ? (
        <p>No has realizado compras todavía.</p>
      ) : (
        <ul className="list-group">
          {orders.map((item, idx) => (
            <li key={idx} className="list-group-item">
              {item.name} - {item.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
