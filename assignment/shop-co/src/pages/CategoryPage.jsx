import React from 'react'
import {X} from 'lucide-react'
import {useParams} from 'react-router-dom'
import {getProducts} from '../api'
import {Breadcrumbs, StoreLayout} from '../components/SiteChrome'
import {ProductCard} from '../components/Commerce'
import {FilterPanel} from '../components/Filters'
import {CatalogToolbar, Pagination} from '../components/Catalog'
import {DEFAULT_CATEGORY_FILTERS, filterAndSortProducts} from '../utils/catalogFilters'

const STYLES = ['Casual', 'Formal', 'Party', 'Gym']

function filtersForSlug(slug) {
  const name = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : ''
  const style = STYLES.includes(name) ? name : ''
  return {...DEFAULT_CATEGORY_FILTERS, style}
}

export default function CategoryPage() {
  const {categorySlug} = useParams()
  const [products, setProducts] = React.useState([])
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState('')
  const [sort, setSort] = React.useState('Most Popular')
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [draftFilters, setDraftFilters] = React.useState(() => filtersForSlug(categorySlug))
  const [appliedFilters, setAppliedFilters] = React.useState(() => filtersForSlug(categorySlug))

  React.useEffect(() => {
    const nextFilters = filtersForSlug(categorySlug)
    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }, [categorySlug])

  React.useEffect(() => {
    getProducts()
      .then(list => {
        setProducts(list)
        setLoaded(true)
      })
      .catch(() => {
        setError('Could not load products. Start the backend on port 5000.')
        setLoaded(true)
      })
  }, [])

  const visibleProducts = React.useMemo(
    () => filterAndSortProducts(products, appliedFilters, sort),
    [products, appliedFilters, sort]
  )
  const title = appliedFilters.style || 'Shop'

  const openFilters = () => {
    setDraftFilters(appliedFilters)
    setFiltersOpen(true)
  }

  const closeFilters = () => {
    setDraftFilters(appliedFilters)
    setFiltersOpen(false)
  }

  const applyFilters = () => {
    setAppliedFilters(draftFilters)
    setFiltersOpen(false)
  }

  return <StoreLayout className="category-page">
    <main className="category-main">
      <Breadcrumbs items={[title]} />
      {error && <p>{error}</p>}
      <div className="category-layout">
        <FilterPanel filters={draftFilters} onChange={setDraftFilters} onApply={applyFilters} />
        <section className="catalog-content">
          <CatalogToolbar title={title} sort={sort} onSort={setSort} onOpenFilters={openFilters} count={visibleProducts.length} />
          {filtersOpen && <div className="mobile-filter-drawer"><div className="drawer-header"><strong>Filters</strong><button onClick={closeFilters} aria-label="Close filters"><X /></button></div><FilterPanel mobile filters={draftFilters} onChange={setDraftFilters} onApply={applyFilters} /></div>}
          {!loaded
            ? <p>Loading products...</p>
            : visibleProducts.length > 0
            ? <div className="catalog-grid">{visibleProducts.map(product => <ProductCard product={product} key={product.id} />)}</div>
            : <div className="catalog-empty"><h2>No products found</h2><p>Change or remove a filter to see more products.</p></div>}
          {visibleProducts.length > 0 && <Pagination />}
        </section>
      </div>
    </main>
  </StoreLayout>
}
