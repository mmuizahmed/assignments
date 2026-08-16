import React from 'react'
import {X} from 'lucide-react'
import {categoryProducts} from '../data/store'
import {Breadcrumbs, StoreLayout} from '../components/SiteChrome'
import {ProductCard} from '../components/Commerce'
import {FilterPanel} from '../components/Filters'
import {CatalogToolbar, Pagination} from '../components/Catalog'
import {DEFAULT_CATEGORY_FILTERS, filterAndSortProducts} from '../utils/catalogFilters'

export default function CategoryPage() {
  const [sort, setSort] = React.useState('Most Popular')
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [draftFilters, setDraftFilters] = React.useState(() => ({...DEFAULT_CATEGORY_FILTERS}))
  const [appliedFilters, setAppliedFilters] = React.useState(() => ({...DEFAULT_CATEGORY_FILTERS}))

  const visibleProducts = React.useMemo(
    () => filterAndSortProducts(categoryProducts, appliedFilters, sort),
    [appliedFilters, sort]
  )

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
      <Breadcrumbs items={['Casual']} />
      <div className="category-layout">
        <FilterPanel filters={draftFilters} onChange={setDraftFilters} onApply={applyFilters} />
        <section className="catalog-content">
          <CatalogToolbar sort={sort} onSort={setSort} onOpenFilters={openFilters} count={visibleProducts.length} />
          {filtersOpen && <div className="mobile-filter-drawer"><div className="drawer-header"><strong>Filters</strong><button onClick={closeFilters} aria-label="Close filters"><X /></button></div><FilterPanel mobile filters={draftFilters} onChange={setDraftFilters} onApply={applyFilters} /></div>}
          {visibleProducts.length > 0
            ? <div className="catalog-grid">{visibleProducts.map(product => <ProductCard product={product} key={product.id} />)}</div>
            : <div className="catalog-empty"><h2>No products found</h2><p>Change or remove a filter to see more products.</p></div>}
          {visibleProducts.length > 0 && <Pagination />}
        </section>
      </div>
    </main>
  </StoreLayout>
}
