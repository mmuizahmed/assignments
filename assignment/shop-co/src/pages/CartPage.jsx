import React from 'react'
import {ArrowRight, Tag, Trash2} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import {ASSET} from '../data/store'
import {Breadcrumbs, StoreLayout} from '../components/SiteChrome'
import {Price, QuantityControl} from '../components/Commerce'
import {useCart} from '../context/CartContext'

export default function CartPage() {
  const {items, updateQuantity, removeItem, clearCart} = useCart()
  const navigate = useNavigate()
  const [promo, setPromo] = React.useState('')
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = Math.round(subtotal * 0.2)
  const deliveryFee = items.length ? 15 : 0
  const total = subtotal - discount + deliveryFee
  const checkout = () => {
    clearCart()
    navigate('/')
  }

  return <StoreLayout className="cart-page">
    <main className="cart-main">
      <Breadcrumbs items={['Cart']} />
      <h1>YOUR CART</h1>
      <div className="cart-layout">
        <section className={`cart-items ${items.length === 0 ? 'is-empty' : ''}`}>
          {items.length === 0 && <div className="empty-cart"><h2>Your cart is empty</h2><p>Add a product and it will stay here for your next visit.</p></div>}
          {items.map(item => <article className="cart-item" key={item.cartKey}>
          <img src={`${ASSET}${item.cartImage || item.image}`} alt="" />
          <div className="cart-item-copy"><h2>{item.name}</h2><span>Size: {item.size}</span><span>Color: {item.color}</span><Price product={item} showCompare={false} /></div>
          <button className="remove-item" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.cartKey)}><Trash2 /></button>
          <QuantityControl compact value={item.quantity} onDecrease={() => updateQuantity(item.cartKey, -1)} onIncrease={() => updateQuantity(item.cartKey, 1)} />
        </article>)}
        </section>
        <section className="order-summary"><h2>Order Summary</h2><div className="summary-lines"><p>Subtotal <strong>${subtotal}</strong></p><p>Discount (-20%) <strong className="red-text">-${discount}</strong></p><p>Delivery Fee <strong>${deliveryFee}</strong></p><hr /><p>Total <b>${total}</b></p></div><div className="promo-row"><label><Tag /><input value={promo} onChange={event => setPromo(event.target.value)} placeholder="Add promo code" /></label><button>Apply</button></div><button className="button-black checkout-button" onClick={checkout}>Go to Checkout <ArrowRight /></button></section>
      </div>
    </main>
  </StoreLayout>
}
