// src/services/productService.ts
import { Product } from '../contexts/ShopContext';

const API_BASE = 'https://cefdblvoi7.execute-api.us-east-1.amazonaws.com/dev';

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
      stock: item.stock || 0,
      tenant: item.tenant_id,
    })),
    nextToken: data.nextToken || null,
  };
}

// Función para verificar el stock de un producto específico
export async function checkProductStock(
  tenant_id: string,
  product_id: string,
  token: string
): Promise<{ stock: number; available: boolean }> {
  
  try {
    // Usar el endpoint de listar productos y filtrar por el producto específico
    const url = new URL(`${API_BASE}/productos/listar`);
    url.searchParams.append('tenant_id', tenant_id);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error || 'Error al verificar stock del producto');
    }

    const data = await res.json();
    
    // Buscar el producto específico en la lista
    const product = data.items.find((item: any) => item.producto_id === product_id);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return {
      stock: product.stock || 0,
      available: (product.stock || 0) > 0,
    };
  } catch (error) {
    console.error('Error verificando stock:', error);
    throw error;
  }
}

// Nueva función para actualizar el stock de un producto
export async function updateProductStock(
  tenant_id: string,
  product_id: string,
  newStock: number,
  token: string
): Promise<{ message: string }> {
  const url = `${API_BASE}/productos/actualizar-stock`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tenant_id, producto_id: product_id, stock: newStock }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Error al actualizar el stock del producto');
  }

  const result = await res.json();
  return {
    message: result.message,
  };
}
