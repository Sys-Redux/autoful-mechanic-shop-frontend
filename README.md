# 🚗 Autoful - Mechanic Shop Management System Front-End

[![GitHub](https://img.shields.io/badge/GitHub-Sys--Redux-181717?style=for-the-badge&logo=github)](https://github.com/Sys-Redux)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-T--Edge-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/t-edge/)
[![Website](https://img.shields.io/badge/Website-sysredux.xyz-4285F4?style=for-the-badge&logo=googlechrome)](https://www.sysredux.xyz)
[![X](https://img.shields.io/badge/X-sys__redux-000000?style=for-the-badge&logo=x)](https://x.com/sys_redux)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?style=for-the-badge&logo=discord)](https://discord.gg/KdfApwrBuW)
[![Upwork](https://img.shields.io/badge/Upwork-Hire%20Me-6FDA44?style=for-the-badge&logo=upwork)](https://www.upwork.com/freelancers/~011b4cf7ebf1503859?mp_source=share)
[![Freelancer](https://img.shields.io/badge/Freelancer-Hire%20Me-29B2FE?style=for-the-badge&logo=freelancer)](https://www.freelancer.com/u/trevoredge?frm=trevoredge&sb=t)

---

A professional mechanic shop management system featuring role-based portals for customers and mechanics. Built with Next.js 16, Firebase Authentication, Redux Toolkit, and TanStack Query.

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Authentication** | Firebase Auth (Email/Password) |
| **Client State** | Redux Toolkit |
| **Server State** | TanStack Query (React Query) |
| **Styling** | Tailwind CSS 4 |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Notifications** | Sonner |

## 📁 Project Structure

```file
autoful-frontend/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── (customer)/       # Customer portal pages
│   ├── (mechanic)/       # Mechanic portal pages
│   ├── globals.css       # Design system & theme
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Landing page
├── components/
│   └── providers/
│       ├── QueryProvider.tsx   # TanStack Query setup
│       └── StoreProvider.tsx   # Redux store setup
├── hooks/
│   ├── useCustomers.ts         # Customer API hooks
│   ├── useInventory.ts         # Inventory API hooks
│   ├── useMechanics.ts         # Mechanics API hooks
│   └── useServiceTickets.ts    # Service tickets API hooks
├── lib/
│   ├── api.ts                  # API client with auth headers
│   ├── firebase.ts             # Firebase configuration
│   ├── services/
│   │   └── authService.ts      # Firebase auth wrapper
│   └── store/
│       ├── authSlice.ts        # Auth state management
│       ├── hooks.ts            # Typed Redux hooks
│       └── store.ts            # Redux store configuration
└── types/
    ├── auth.ts                 # Auth-related types
    └── index.ts                # Domain model types
```

## ✨ Features

### Two Role-Based Portals

- **Customer Portal**

  - View personal service ticket history
  - Track ongoing repairs
  - Manage account profile

- **Mechanic Portal**

  - Full CRUD on service tickets
  - Inventory management with low-stock alerts
  - Customer management
  - Assign/remove mechanics from jobs
  - Add parts to tickets (auto-deducts stock)

### Architecture Highlights

- **Redux for Auth State** - Persistent login state with localStorage sync
- **TanStack Query for API Data** - Automatic caching, refetching, and invalidation
- **Firebase Auth Integration** - Secure authentication with ID tokens
- **Type-Safe Throughout** - Full TypeScript coverage with Zod validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Firebase project with Email/Password auth enabled

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sys-Redux/autoful-mechanic-shop-frontend.git
   cd autoful-mechanic-shop-frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Configure `.env.local` with your Firebase credentials:

   ```env
   NEXT_PUBLIC_API_URL=https://autoful-mechanic-shop-api.onrender.com
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. Run the development server:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## 🔗 Related

- **Backend API**: [autoful-mechanic-shop-api](https://github.com/Sys-Redux/autoful-mechanic-shop-api) (Flask REST API)
- **API Documentation**: [Swagger Docs](https://autoful-mechanic-shop-api.onrender.com/api/docs)

## 🏗️ Development Status

- **Current Phase: Foundation Complete**

  - [x] Project setup with Next.js 16 + TypeScript
  - [x] Tailwind CSS design system with mechanic shop theme
  - [x] Firebase Authentication integration
  - [x] Redux Toolkit store with auth slice
  - [x] TanStack Query hooks for all API endpoints
  - [x] API client with automatic token injection
  - [ ] Login & Register pages (in progress)
  - [ ] Customer portal pages
  - [ ] Mechanic portal pages
  - [ ] Component library

## 📝 License

This project is part of my portfolio. Feel free to explore the code!

---

**Built with ☕ by [Sys-Redux](https://github.com/Sys-Redux)**
