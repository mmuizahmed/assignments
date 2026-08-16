import {Link, useLocation} from 'react-router-dom'
import {ChevronDown, ChevronRight, CircleUserRound, Mail, Menu, Search, ShoppingCart, X} from 'lucide-react'
import {ASSET} from '../data/store'
import {useCart} from '../context/CartContext'

export function AnnouncementBar() {
  return <div className="announcement-bar">
    <span>Sign up and get 20% off to your first order. <u>Sign Up Now</u></span>
    <X aria-hidden="true" />
  </div>
}

export function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const location = useLocation()
  const {totalQuantity} = useCart()
  React.useEffect(() => setMenuOpen(false), [location.pathname])
  return <>
    <AnnouncementBar />
    <header className="site-header">
      <button className="icon-button mobile-menu-button" aria-label="Open menu" onClick={() => setMenuOpen(value => !value)}>
        <Menu />
      </button>
      <Link className="brand-wordmark" to="/">SHOP.CO</Link>
      <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        <Link to="/category/casual">Shop <ChevronDown /></Link>
        <a href="#sale">On Sale</a>
        <a href="#new-arrivals">New Arrivals</a>
        <a href="#brands">Brands</a>
      </nav>
      <label className="site-search">
        <Search />
        <input aria-label="Search for products" placeholder="Search for products..." />
      </label>
      <div className="header-actions">
        <button className="icon-button mobile-search-button" aria-label="Search"><Search /></button>
        <Link className="icon-button cart-link" aria-label={`Cart, ${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`} to="/cart">
          <ShoppingCart />
          {totalQuantity > 0 && <span className="cart-count" aria-hidden="true">{totalQuantity > 99 ? '99+' : totalQuantity}</span>}
        </Link>
        <button className="icon-button" aria-label="Account"><CircleUserRound /></button>
      </div>
    </header>
  </>
}

export function Breadcrumbs({items = []}) {
  return <div className="breadcrumbs">
    <Link to="/">Home</Link>
    {items.map((item, index) => <React.Fragment key={`${item}-${index}`}>
      <ChevronRight className="breadcrumb-chevron" aria-hidden="true" />
      <span className={index === items.length - 1 ? 'current' : ''}>{item}</span>
    </React.Fragment>)}
  </div>
}

export function SiteFooter() {
  const columns = [
    ['COMPANY', 'About', 'Features', 'Works', 'Career'],
    ['HELP', 'Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'],
    ['FAQ', 'Account', 'Manage Deliveries', 'Orders', 'Payments'],
    ['RESOURCES', 'Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist']
  ]
  return <footer className="site-footer">
    <div className="footer-grid">
      <div className="footer-brand">
        <Link className="brand-wordmark footer-wordmark" to="/">SHOP.CO</Link>
        <p>We have clothes that suits your style and which you're proud to wear. From women to men.</p>
        <div className="social-links" aria-label="Social links">
          {['twitter', 'facebook', 'instagram', 'github'].map(name => <a key={name} href={`#${name}`} aria-label={name}><img src={`${ASSET}icons/${name}.svg`} /></a>)}
        </div>
      </div>
      {columns.map(([heading, ...links]) => <div className="footer-column" key={heading}>
        <h3>{heading}</h3>
        {links.map(link => <a href={`#${link.toLowerCase().replaceAll(' ', '-')}`} key={link}>{link}</a>)}
      </div>)}
    </div>
    <div className="footer-bottom">
      <span>Shop.co {'\u00A9'} 2000-2023, All Rights Reserved</span>
      <img className="payment-badges" src={`${ASSET}icons/payment-badges.svg`} alt="Visa, Mastercard, PayPal, Apple Pay and Google Pay" />
    </div>
  </footer>
}

export function Newsletter() {
  return <section className="newsletter-block">
    <h2><span className="newsletter-title-desktop">STAY UPTO DATE ABOUT<br />OUR LATEST OFFERS</span><span className="newsletter-title-mobile">STAY UPTO DATE<br />ABOUT OUR<br />LATEST OFFERS</span></h2>
    <div className="newsletter-form">
      <label><Mail aria-hidden="true" /><input type="email" placeholder="Enter your email address" /></label>
      <button type="button">Subscribe to Newsletter</button>
    </div>
  </section>
}

export function StoreLayout({children, className = ''}) {
  return <div className={`store-layout ${className}`}><Header />{children}<Newsletter /><SiteFooter /></div>
}

// React is intentionally imported here so shared components stay independently usable.
import React from 'react'
