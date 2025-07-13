
// src/services/productService.ts
import { Product } from '../contexts/ShopContext';

const API_BASE = 'https://726nsxq3m7.execute-api.us-east-1.amazonaws.com/dev';

type CartItemInput = {
  tenant_id: string;
  user_id: string;
  product_id: string;
  amount: number;
};

export type DeleteCartItemInput = {
  tenant_id: string;
  user_id: string;
  product_id: string;
};

export async function updateCartItem(
  data: CartItemInput,
  token: string
): Promise<{ message: string }> {

    console.log('Updating cart item:');
    console.log(data);
  const url = `${API_BASE}/cart/update`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token, 
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || 'Error al actualizar el ítem del carrito');
  }

  const result = await res.json();
  return {
    message: result.message,
  };
}

export async function addCartItem(
  data: CartItemInput,
  token: string
): Promise<{ message: string }> {

    console.log('Adding cart item:');
    console.log(data);

  const url = `${API_BASE}/cart/add`;

  const res = await fetch(url, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || 'Error al agregar ítem al carrito');
  }

  const result = await res.json();
  return {
    message: result.message,
  };
}

export async function deleteCartItem(
  data: DeleteCartItemInput,
  token: string
): Promise<{ message: string }> {

  console.log('Deleting cart item:');
  console.log(data);
  const url = `${API_BASE}/cart/delete`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || 'Error al eliminar el ítem del carrito');
  }

  const result = await res.json();
  return {
    message: result.message,
  };
}

export async function completeCart(
  data: { tenant_id: string; user_id: string },
  token: string
): Promise<{ message: string }> {
  console.log('Completing cart purchase:');
  console.log(data);

  const url = `${API_BASE}/cart/complete`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || 'Error al completar la compra');
  }

  const result = await res.json();
  return {
    message: result.message,
  };
}
