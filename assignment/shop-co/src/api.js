export const API = 'http://localhost:5000'

export function toShopProduct(product) {
  const colors = product.colors || []
  const sizes = product.sizes || []

  return {
    ...product,
    id: product.slug,
    price: Number(product.price),
    oldPrice: product.oldPrice || undefined,
    discount: product.discount || undefined,
    rating: `${product.rating}/5`,
    homeImage: product.homeImage || undefined,
    cartImage: product.cartImage || product.image,
    colors,
    sizes,
    color: colors[0] || 'Black',
    size: sizes.includes('Large') ? 'Large' : (sizes[0] || 'Large'),
    description: product.description || ''
  }
}

export async function getProducts() {
  const response = await fetch(`${API}/api/products`)
  if (!response.ok) throw new Error('Could not load products')
  const products = await response.json()
  return products.map(toShopProduct)
}

export async function createOrder(order) {
  const response = await fetch(`${API}/api/orders`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(order)
  })
  if (!response.ok) throw new Error('Could not save order')
  return response.json()
}
