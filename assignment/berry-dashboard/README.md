# Berry Dashboard

Dark admin UI matching [berrydashboard.com](https://berrydashboard.com/dashboard/default). Four pages only: Dashboard, Users, Products, Orders.

## Run

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). It redirects to `/dashboard`.

## Routes

- `/dashboard` — earning, orders, income, growth chart, popular stocks
- `/users` — user list (Style 01)
- `/products` — shop grid with search, sort, and filters
- `/orders` — order table with search and pagination

## Source

```text
src/
├── app/                 # Next.js routes and global styles
├── components/layout/   # sidebar, navbar, footer, shell
├── components/dashboard/# dashboard cards and charts
├── components/ui/       # status chips
├── data/mock.ts         # fake users, products, orders
└── lib/tokens.ts        # colors and spacing from the live site
```
