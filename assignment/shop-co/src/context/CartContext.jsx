import React from 'react'
const STORAGE_KEY = 'shopco-cart-v2'
const LEGACY_STORAGE_KEY = 'shopco-cart-v1'
const CartContext = React.createContext(null)

function createCartKey(item) {
  const size = item.size || 'One Size'
  const color = item.color || 'Default'
  return `${item.id}::${size}::${color}`
}

function normalizeCartItem(item) {
  const quantity = Number.isFinite(Number(item.quantity))
    ? Math.max(1, Math.floor(Number(item.quantity)))
    : 1
  const normalized = {...item, quantity}

  return {
    ...normalized,
    cartKey: item.cartKey || createCartKey(normalized)
  }
}

function loadInitialCart() {
  if (typeof window === 'undefined') return []

  const storedCart = window.localStorage.getItem(STORAGE_KEY)
  if (storedCart === null) return []

  try {
    const parsedCart = JSON.parse(storedCart)
    return Array.isArray(parsedCart)
      ? parsedCart.filter(item => item && item.id).map(normalizeCartItem)
      : []
  } catch {
    return []
  }
}

export function CartProvider({children}) {
  const [items, setItems] = React.useState(loadInitialCart)

  React.useEffect(() => {
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // The cart remains usable in memory when browser storage is unavailable.
    }
  }, [items])

  const addItem = React.useCallback((product, quantity = 1, options = {}) => {
    const amount = Math.max(1, Math.floor(Number(quantity) || 1))
    const nextItem = normalizeCartItem({
      ...product,
      ...options,
      size: options.size || product.size || 'One Size',
      color: options.color || product.color || 'Default',
      cartImage: options.cartImage || product.cartImage || product.image,
      quantity: amount
    })

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.cartKey === nextItem.cartKey)

      if (!existingItem) return [...currentItems, nextItem]

      return currentItems.map(item => item.cartKey === nextItem.cartKey
        ? {...item, quantity: item.quantity + amount}
        : item)
    })
  }, [])

  const updateQuantity = React.useCallback((cartKey, delta) => {
    setItems(currentItems => currentItems.map(item => item.cartKey === cartKey
      ? {...item, quantity: Math.max(1, item.quantity + delta)}
      : item))
  }, [])

  const removeItem = React.useCallback(cartKey => {
    setItems(currentItems => currentItems.filter(item => item.cartKey !== cartKey))
  }, [])

  const clearCart = React.useCallback(() => {
    setItems([])
  }, [])

  const totalQuantity = React.useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const value = React.useMemo(() => ({
    items,
    totalQuantity,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  }), [items, totalQuantity, addItem, updateQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = React.useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}

export {STORAGE_KEY}
