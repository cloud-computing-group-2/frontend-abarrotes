// src/services/productService.ts
import { Product } from '../contexts/ShopContext';

const API_BASE = 'https://sh7pqkg24f.execute-api.us-east-1.amazonaws.com/dev';

export async function fetchShopProducts(
  tenant_id: string,
  token: string,
  nextToken?: string
): Promise<{ items: Product[]; nextToken: string | null }> {
  
  const url = new URL(`${API_BASE}/productos/listar`);
  url.searchParams.append('tenant_id', tenant_id);
  if (nextToken) url.searchParams.append('nextToken', nextToken);

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Error al obtener productos');
  }

  const data = await res.json();

  return {
    items: data.items.map((item: any) => ({
      id: item.producto_id,
      name: item.nombre,
      price: item.precio,
      image: item.imagen,
      description: item.descripcion,
      category: item.categoria,
      inStock: item.stock > 0,
      tenant: item.tenant_id,
    })),
    nextToken: data.nextToken || null,
  };
}
