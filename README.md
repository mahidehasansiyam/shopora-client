# Shopora — Client

Next.js 16 e-commerce frontend for the Shopora platform.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 (CSS-only, no config file — `@theme` in `globals.css`)
- **Components:** shadcn/ui "base-nova" (uses `@base-ui/react`, not Radix) + HeroUI (`@heroui/react`)
- **Auth:** better-auth (server config with Mongo adapter + client via `better-auth/react`)
- **Icons:** lucide-react (primary), @gravity-ui/icons (secondary)
- **Forms:** Native HTML forms (no React Hook Form yet)
- **API calls:** Raw `fetch` (no Axios or TanStack Query)
- **Cart state:** React Context API (`CartContext.tsx`)
- **Toast notifications:** react-toastify
- **Charts:** recharts
- **Linting:** ESLint 9 (flat config)
- **Deploy:** Vercel

## How It Works

The client is a full-stack Next.js App Router application. The `better-auth` API route at `src/app/api/auth/[...all]/route.ts` handles authentication server-side (login, register, session). The client config is at `src/lib/auth-client.ts`.

### Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero banner, featured categories, trending products, newsletter |
| `/products/[id]` | Product detail page |
| `/explore` | Product listing with search/filter |
| `/checkout` | Order checkout flow |
| `/orders` | User order history |
| `/auth/*` | Login / register (handled by better-auth) |
| `/admin/dashboard` | Admin dashboard with revenue/order charts, top products, low stock alerts |
| `/admin/products` | Product inventory list (paginated, with edit/delete) |
| `/admin/post-product` | Create new product |
| `/admin/orders` | Order management (placeholder) |
| `/admin/users` | User management (list and delete) |

### Key Architecture

- **Providers** wrapped in `Providers.tsx` (CartContext + ToastContainer)
- **Layout** includes Navbar and Footer globally
- **Admin layout** has a protected sidebar with role guard (`role === "admin"`)
- **API helpers** in `src/lib/` — `cart-api.ts`, `order-api.ts`, `dashboard-api.ts`
- **Types** in `src/types/` — `product.ts`, `user.ts`

## Setup

```bash
npm install
cp .env.example .env   # or use existing .env
npm run dev            # next dev, port 3000
```

### Required env vars

- `MONGODB_URI` — MongoDB connection string (for better-auth server config)
- `BETTER_AUTH_SECRET` — Secret for better-auth
- `NEXT_PUBLIC_BETTER_AUTH_URL` — defaults to `http://localhost:3000`
- `NEXT_PUBLIC_API_URL` — defaults to `http://localhost:9000`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — for Google OAuth

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build + implicit typecheck |
| `npm run start` | Start production server |
| `npm run lint` | ESLint (flat config, no args) |
