import React from 'react'
import {Check, ChevronDown, MoreHorizontal, SlidersHorizontal} from 'lucide-react'
import {useNavigate, useParams} from 'react-router-dom'
import {ASSET, reviews} from '../data/store'
import {getProducts} from '../api'
import {Breadcrumbs, StoreLayout} from '../components/SiteChrome'
import {Price, ProductCard, QuantityControl, Rating} from '../components/Commerce'
import {useCart} from '../context/CartContext'

const SWATCH = {
  Black: '#000',
  White: '#fff',
  Blue: '#063af5',
  Red: '#f50606',
  Green: '#00c12b',
  Orange: '#f57906',
  Yellow: '#f5dd06',
  Olive: '#4f4631',
  Teal: '#314f4a',
  Navy: '#31344f',
  Pink: '#f506a4',
  Purple: '#7d06f5',
  Cyan: '#06caf5'
}

function ProductGallery({product}) {
  const src = `${ASSET}${product.image}`
  return <div className="product-gallery">
    <div className="product-thumbs">{[0, 1, 2].map(item => <picture key={item}><img src={src} alt="" /></picture>)}</div>
    <picture className="product-main-image"><img src={src} alt={product.name} /></picture>
  </div>
}

export default function ProductPage() {
  const {productId} = useParams()
  const [product, setProduct] = React.useState(null)
  const [others, setOthers] = React.useState([])
  const [error, setError] = React.useState('')
  const [size, setSize] = React.useState('Large')
  const [color, setColor] = React.useState('Black')
  const [quantity, setQuantity] = React.useState(1)
  const navigate = useNavigate()
  const {addItem} = useCart()

  React.useEffect(() => {
    getProducts()
      .then(list => {
        const found = list.find(item => item.id === productId) || null
        setProduct(found)
        setOthers(list.filter(item => item.id !== productId).slice(0, 4))
        if (found) {
          setSize(found.size)
          setColor(found.color)
          setQuantity(1)
        }
      })
      .catch(() => setError('Could not load this product. Start the backend on port 5000.'))
  }, [productId])

  const addToCart = () => {
    addItem(product, quantity, {size, color})
    navigate('/cart')
  }

  if (!product) {
    return <StoreLayout className="product-detail-page">
      <main className="product-detail-main"><p>{error || 'Loading product...'}</p></main>
    </StoreLayout>
  }

  const colors = product.colors.length ? product.colors : ['Black']
  const sizes = product.sizes.length ? product.sizes : ['Large']

  return <StoreLayout className="product-detail-page">
    <main className="product-detail-main">
      <Breadcrumbs items={['Shop', product.style || 'Men', product.productType || 'T-shirts']} />
      <section className="product-intro">
        <ProductGallery product={product} />
        <div className="product-information">
          <h1>{product.name.toUpperCase()}</h1><Rating value={product.rating} large /><Price product={product} detail /><p>{product.description}</p><hr />
          <span className="control-label">Select Colors</span>
          <div className="color-choices">{colors.map(item => <button
            className={`color-choice ${color === item ? 'selected' : ''}`}
            style={{background: SWATCH[item] || '#ccc', color: item === 'White' ? '#111' : '#fff'}}
            aria-label={item}
            aria-pressed={color === item}
            onClick={() => setColor(item)}
            key={item}
          >{color === item && <Check />}</button>)}</div><hr />
          <span className="control-label">Choose Size</span>
          <div className="product-sizes">{sizes.map(item => <button className={size === item ? 'selected' : ''} onClick={() => setSize(item)} key={item}>{item}</button>)}</div><hr />
          <div className="product-buy-row"><QuantityControl value={quantity} onDecrease={() => setQuantity(value => Math.max(1, value - 1))} onIncrease={() => setQuantity(value => value + 1)} /><button className="button-black" onClick={addToCart}>Add to Cart</button></div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="review-tabs"><button>Product Details</button><button className="active">Rating &amp; Reviews</button><button>FAQs</button></div>
        <div className="reviews-toolbar"><h2>All Reviews <small>({product.reviews || 0})</small></h2><button className="round-control" aria-label="Filter reviews"><SlidersHorizontal /></button><button className="sort-control">Latest <ChevronDown /></button><button className="button-black">Write a Review</button></div>
        <div className="review-grid">{reviews.map(review => <article className="review-card" key={review.name}><Rating value={review.rating} /><strong>{review.name} <span className="verified-mark"><Check /></span></strong><p>{review.text}</p><small>Posted on {review.date}</small><MoreHorizontal className="review-more" /></article>)}</div>
        <button className="button-outline load-reviews">Load More Reviews</button>
      </section>

      <section className="recommendations"><h2 className="section-title">YOU MIGHT ALSO LIKE</h2><div className="home-product-grid">{others.map(item => <ProductCard product={item} key={item.id} />)}</div></section>
    </main>
  </StoreLayout>
}
