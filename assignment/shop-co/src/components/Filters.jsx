import React from 'react'
import {ChevronDown, ChevronRight, SlidersHorizontal} from 'lucide-react'
import {CATEGORY_PRICE_MAX, CATEGORY_PRICE_MIN} from '../utils/catalogFilters'

const colorOptions = [
  ['Green', '#00c12b'],
  ['Red', '#f50606'],
  ['Yellow', '#f5dd06'],
  ['Orange', '#f57906'],
  ['Cyan', '#06caf5'],
  ['Blue', '#063af5'],
  ['Purple', '#7d06f5'],
  ['Pink', '#f506a4'],
  ['White', '#fff'],
  ['Black', '#000']
]

function selectValue(filters, key, value, onChange) {
  onChange({...filters, [key]: filters[key] === value ? '' : value})
}

export function FilterPanel({mobile = false, filters, onChange, onApply}) {
  const priceProgress = ((filters.maxPrice - CATEGORY_PRICE_MIN) / (CATEGORY_PRICE_MAX - CATEGORY_PRICE_MIN)) * 100

  return <aside className={`filter-panel ${mobile ? 'filter-panel-mobile' : ''}`}>
    <div className="filter-heading"><strong>Filters</strong><SlidersHorizontal /></div>
    <hr />
    <div className="filter-links">{['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'].map(item => <button
      type="button"
      className={filters.productType === item ? 'selected' : ''}
      aria-pressed={filters.productType === item}
      onClick={() => selectValue(filters, 'productType', item, onChange)}
      key={item}
    >{item}<ChevronRight /></button>)}</div>
    <hr />
    <div className="filter-heading"><strong>Price</strong><ChevronDown /></div>
    <div className="price-range" style={{'--price-progress': `${priceProgress}%`}}>
      <div className="range-track" />
      <i />
      <input
        type="range"
        min={CATEGORY_PRICE_MIN}
        max={CATEGORY_PRICE_MAX}
        step="5"
        value={filters.maxPrice}
        aria-label="Maximum price"
        onChange={event => onChange({...filters, maxPrice: Number(event.target.value)})}
      />
      <span>${CATEGORY_PRICE_MIN}</span><span>${filters.maxPrice}</span>
    </div>
    <hr />
    <div className="filter-heading"><strong>Colors</strong><ChevronDown /></div>
    <div className="color-grid">{colorOptions.map(([name, color]) => <button
      type="button"
      key={name}
      style={{backgroundColor: color}}
      className={filters.color === name ? 'selected' : ''}
      aria-label={name}
      aria-pressed={filters.color === name}
      onClick={() => selectValue(filters, 'color', name, onChange)}
    />)}</div>
    <hr />
    <div className="filter-heading"><strong>Size</strong><ChevronDown /></div>
    <div className="size-grid">{['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'].map(size => <button
      type="button"
      className={filters.size === size ? 'selected' : ''}
      aria-pressed={filters.size === size}
      onClick={() => selectValue(filters, 'size', size, onChange)}
      key={size}
    >{size}</button>)}</div>
    <hr />
    <div className="filter-heading"><strong>Dress Style</strong><ChevronDown /></div>
    <div className="filter-links">{['Casual', 'Formal', 'Party', 'Gym'].map(item => <button
      type="button"
      className={filters.style === item ? 'selected' : ''}
      aria-pressed={filters.style === item}
      onClick={() => selectValue(filters, 'style', item, onChange)}
      key={item}
    >{item}<ChevronRight /></button>)}</div>
    <button type="button" className="button-black filter-submit" onClick={onApply}>Apply Filter</button>
  </aside>
}
