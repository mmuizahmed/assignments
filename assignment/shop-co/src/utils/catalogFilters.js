export const CATEGORY_PRICE_MIN = 50
export const CATEGORY_PRICE_MAX = 250

export const DEFAULT_CATEGORY_FILTERS = Object.freeze({
  productType: '',
  maxPrice: CATEGORY_PRICE_MAX,
  color: '',
  size: '',
  style: ''
})

export function filterAndSortProducts(products, filters = DEFAULT_CATEGORY_FILTERS, sort = 'Most Popular') {
  const filteredProducts = products.filter(product => {
    if (product.price > filters.maxPrice) return false
    if (filters.productType && product.productType !== filters.productType) return false
    if (filters.color && !product.colors?.includes(filters.color)) return false
    if (filters.size && !product.sizes?.includes(filters.size)) return false
    if (filters.style && product.style !== filters.style) return false
    return true
  })

  if (sort === 'Price: Low') return [...filteredProducts].sort((a, b) => a.price - b.price)
  if (sort === 'Price: High') return [...filteredProducts].sort((a, b) => b.price - a.price)
  if (sort === 'Top Rated') return [...filteredProducts].sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
  return filteredProducts
}
