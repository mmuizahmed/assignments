import React from 'react'
import {ArrowLeft, ArrowRight, Check} from 'lucide-react'
import {ASSET, dressStyles, newArrivals, topSelling} from '../data/store'
import {StoreLayout} from '../components/SiteChrome'
import {ProductCard, Rating} from '../components/Commerce'

function SectionTitle({children}) {
  return <h2 className="section-title">{children}</h2>
}

function ProductRow({title, items, anchor}) {
  return <section className="home-product-section" id={anchor}>
    <SectionTitle>{title}</SectionTitle>
    <div className="home-product-grid">{items.map(product => <ProductCard key={product.id} product={product} home />)}</div>
    <button className="button-outline">View All</button>
  </section>
}

export default function HomePage() {
  const testimonials = [
    {name: 'Sarah M.', text: '"I\'m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I\'ve bought has exceeded my expectations."'},
    {name: 'Alex K.', text: '"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."'},
    {name: 'James L.', text: '"As someone who\'s always on the lookout for unique fashion pieces, I\'m thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."'}
  ]

  return <StoreLayout className="home-page">
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
          <p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
          <a className="button-black" href="#new-arrivals">Shop Now</a>
          <div className="hero-stats">
            <div><strong>200+</strong><span>International Brands</span></div>
            <div><strong>2,000+</strong><span>High-Quality Products</span></div>
            <div><strong>30,000+</strong><span>Happy Customers</span></div>
          </div>
        </div>
        <picture className="hero-art">
          <source media="(max-width: 800px)" srcSet={`${ASSET}home/hero-mobile.png`} />
          <img src={`${ASSET}home/hero-desktop.png`} alt="Two people wearing black outfits" />
        </picture>
      </section>

      <section className="brand-strip" id="brands" aria-label="Featured brands">
        {['versace', 'zara', 'gucci', 'prada', 'calvin-klein'].map(name => <img key={name} src={`${ASSET}brands/${name}.svg`} alt={name.replace('-', ' ')} />)}
      </section>

      <ProductRow title="NEW ARRIVALS" items={newArrivals} anchor="new-arrivals" />
      <ProductRow title="TOP SELLING" items={topSelling} />

      <section className="dress-style-section">
        <SectionTitle>BROWSE BY DRESS STYLE</SectionTitle>
        <div className="dress-style-grid">
          {dressStyles.map(style => <a href={`/category/${style.name.toLowerCase()}`} className="dress-style-card" key={style.name}><picture><source media="(max-width: 800px)" srcSet={`${ASSET}${style.mobileImage}`} /><img src={`${ASSET}${style.image}`} alt={`${style.name} dress style`} /></picture></a>)}
        </div>
      </section>

      <section className="customer-section">
        <div className="customer-heading"><SectionTitle>OUR HAPPY CUSTOMERS</SectionTitle><div className="customer-arrows"><button aria-label="Previous testimonial"><ArrowLeft /></button><button aria-label="Next testimonial"><ArrowRight /></button></div></div>
        <div className="customer-cards">{testimonials.map(review => <article key={review.name}><Rating value="5.0/5" /><strong>{review.name} <span className="verified-mark"><Check /></span></strong><p>{review.text}</p></article>)}</div>
      </section>
    </main>
  </StoreLayout>
}
