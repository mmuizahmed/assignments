# SHOP.CO

Responsive React implementation of the supplied SHOP.CO Figma screens.

## Run

```powershell
npm install
npm run dev
```

Production build:

```powershell
npm run build
npm run preview
```

## Deploy from this monorepo

When importing the repository into Vercel, set the project Root Directory to:

```text
assignment/shop-co
```

Vercel should detect Vite automatically. The included `vercel.json` sends direct
SPA routes such as `/product/tape`, `/category/casual`, and `/cart` to
`index.html`, allowing React Router to handle them.

## Routes

- `/` — homepage
- `/product/:productId` — product details
- `/category/:categorySlug` — category listing
- `/cart` — shopping cart

## Source structure

```text
src/
├── components/
│   ├── Catalog.jsx
│   ├── Commerce.jsx
│   ├── Filters.jsx
│   └── SiteChrome.jsx
├── data/
│   └── store.js
├── pages/
│   ├── CartPage.jsx
│   ├── CategoryPage.jsx
│   ├── HomePage.jsx
│   └── ProductPage.jsx
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx
```

Figma-exported assets are grouped under `public/assets/brands`, `home`,
`icons`, and `products`. Desktop/mobile Figma references and verification
captures are under `reference`.
