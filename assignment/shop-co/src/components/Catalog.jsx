import React from 'react'
import {ArrowLeft, ArrowRight, ChevronDown, SlidersHorizontal} from 'lucide-react'

export function Pagination() {
  return <div className="pagination">
    <button><ArrowLeft /> Previous</button>
    <div className="pagination-numbers"><b>1</b><span>2</span><span>3</span><span>...</span><span>8</span><span>9</span><span>10</span></div>
    <button>Next <ArrowRight /></button>
  </div>
}

export function CatalogToolbar({sort, onSort, onOpenFilters, count}) {
  const productCount = count === 0
    ? 'Showing 0 Products'
    : `Showing 1-${Math.min(count, 10)} of ${count} Products`

  return <div className="catalog-toolbar">
    <h1>Casual</h1>
    <span>{productCount}</span>
    <button className="mobile-filter-trigger" onClick={onOpenFilters} aria-label="Open filters"><SlidersHorizontal /></button>
    <label>Sort by: <select value={sort} onChange={event => onSort(event.target.value)}><option>Most Popular</option><option>Price: Low</option><option>Price: High</option><option>Top Rated</option></select><ChevronDown /></label>
  </div>
}
