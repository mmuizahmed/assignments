import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import ScrollToTop from './components/ScrollToTop'
import {CartProvider} from './context/CartContext'

export default function App() {
  return <BrowserRouter>
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </CartProvider>
  </BrowserRouter>
}
