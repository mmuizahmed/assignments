import React from 'react'
import {Link} from 'react-router-dom'
import {Star} from 'lucide-react'
import {ASSET} from '../data/store'

export function Rating({value = '4.5/5', large = false}) {
  return <span className={`rating ${large ? 'rating-large' : ''}`}>
    <span className="rating-stars" aria-label={`${value} rating`}>
      {[0, 1, 2, 3, 4].map(index => <Star key={index} fill="currentColor" />)}
    </span>
    <small>{value}</small>
  </span>
}

export function Price({product, detail = false, showCompare = true}) {
  return <div className={`price-line ${detail ? 'price-line-detail' : ''}`}>
    <strong>${product.price}</strong>
    {showCompare && product.oldPrice && <del>${product.oldPrice}</del>}
    {showCompare && product.discount && <span className="discount-badge">{product.discount}</span>}
  </div>
}

export function ProductCard({product, home = false}) {
  const image = home && product.homeImage ? product.homeImage : product.image
  return <Link className="product-card" to={`/product/${product.id}`}>
    <div className="product-card-image"><img src={`${ASSET}${image}`} alt="" /></div>
    <h3>{product.name}</h3>
    <Rating value={product.rating} />
    <Price product={product} />
  </Link>
}

export function QuantityControl({value, onDecrease, onIncrease, compact = false}) {
  return <div className={`quantity-control ${compact ? 'compact' : ''}`}>
    <button aria-label="Decrease quantity" onClick={onDecrease}>-</button>
    <span>{value}</span>
    <button aria-label="Increase quantity" onClick={onIncrease}>+</button>
  </div>
}
