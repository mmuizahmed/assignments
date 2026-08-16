import React from 'react'
import {Check, ChevronDown, MoreHorizontal, SlidersHorizontal} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import {ASSET, oneLifeProduct, recommendations, reviews} from '../data/store'
import {Breadcrumbs, StoreLayout} from '../components/SiteChrome'
import {Price, ProductCard, QuantityControl, Rating} from '../components/Commerce'
import {useCart} from '../context/CartContext'

function ProductGallery() {
  const thumbs = [
    ['one-life-front-thumb-mobile.png', 'one-life-front-thumb-desktop.png', 'One Life front view'],
    ['one-life-back-thumb-mobile.png', 'one-life-back-thumb-desktop.png', 'One Life back view'],
    ['one-life-model-thumb-mobile.png', 'one-life-model-thumb-desktop.png', 'One Life worn by model']
  ]
  return <div className="product-gallery">
    <div className="product-thumbs">{thumbs.map(([mobile, desktop, alt]) => <picture key={desktop}><source media="(max-width: 800px)" srcSet={`${ASSET}products/${mobile}`} /><img src={`${ASSET}products/${desktop}`} alt={alt} /></picture>)}</div>
    <picture className="product-main-image"><source media="(max-width: 800px)" srcSet={`${ASSET}products/one-life-main-mobile.png`} /><img src={`${ASSET}products/one-life-main-desktop.png`} alt="One Life graphic T-shirt" /></picture>
  </div>
}

export default function ProductPage() {
  const [size, setSize] = React.useState('Large')
  const [color, setColor] = React.useState('Olive')
  const [quantity, setQuantity] = React.useState(1)
  const navigate = useNavigate()
  const {addItem} = useCart()
  const colors = [
    {name: 'Olive', className: ''},
    {name: 'Teal', className: 'teal'},
    {name: 'Navy', className: 'navy'}
  ]
  const addToCart = () => {
    addItem(oneLifeProduct, quantity, {size, color})
    navigate('/cart')
  }

  return <StoreLayout className="product-detail-page">
    <main className="product-detail-main">
      <Breadcrumbs items={['Shop', 'Men', 'T-shirts']} />
      <section className="product-intro">
        <ProductGallery />
        <div className="product-information">
          <h1>{oneLifeProduct.name.toUpperCase()}</h1><Rating value={oneLifeProduct.rating} large /><Price product={oneLifeProduct} detail /><p>{oneLifeProduct.description}</p><hr />
          <span className="control-label">Select Colors</span>
          <div className="color-choices">{colors.map(item => <button
            className={`color-choice ${item.className} ${color === item.name ? 'selected' : ''}`.trim()}
            aria-label={item.name}
            aria-pressed={color === item.name}
            onClick={() => setColor(item.name)}
            key={item.name}
          >{color === item.name && <Check />}</button>)}</div><hr />
          <span className="control-label">Choose Size</span>
          <div className="product-sizes">{['Small', 'Medium', 'Large', 'X-Large'].map(item => <button className={size === item ? 'selected' : ''} onClick={() => setSize(item)} key={item}>{item}</button>)}</div><hr />
          <div className="product-buy-row"><QuantityControl value={quantity} onDecrease={() => setQuantity(value => Math.max(1, value - 1))} onIncrease={() => setQuantity(value => value + 1)} /><button className="button-black" onClick={addToCart}>Add to Cart</button></div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="review-tabs"><button>Product Details</button><button className="active">Rating &amp; Reviews</button><button>FAQs</button></div>
        <div className="reviews-toolbar"><h2>All Reviews <small>(451)</small></h2><button className="round-control" aria-label="Filter reviews"><SlidersHorizontal /></button><button className="sort-control">Latest <ChevronDown /></button><button className="button-black">Write a Review</button></div>
        <div className="review-grid">{reviews.map(review => <article className="review-card" key={review.name}><Rating value={review.rating} /><strong>{review.name} <span className="verified-mark"><Check /></span></strong><p>{review.text}</p><small>Posted on {review.date}</small><MoreHorizontal className="review-more" /></article>)}</div>
        <button className="button-outline load-reviews">Load More Reviews</button>
      </section>

      <section className="recommendations"><h2 className="section-title">YOU MIGHT ALSO LIKE</h2><div className="home-product-grid">{recommendations.map(product => <ProductCard product={product} key={product.id} />)}</div></section>
    </main>
  </StoreLayout>
}
