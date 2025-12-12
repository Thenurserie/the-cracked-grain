# The Cracked Grain

A comprehensive homebrewing e-commerce and recipe management platform built with Next.js, Prisma, and PostgreSQL.

## Features

- **E-commerce Store**: Browse and purchase homebrewing supplies
- **Recipe Builder**: Create and manage brewing recipes with BJCP style matching
- **Brewing Calculators**: Advanced calculators for OG, FG, IBU, SRM, and more
- **Water Chemistry**: Calculate mineral additions for target water profiles
- **Inventory Management**: Track your brewing ingredients and supplies
- **Brew Session Tracking**: Document your brewing sessions and notes
- **Equipment Profiles**: Manage different brewing equipment configurations
- **Mash Schedule Designer**: Design custom mash schedules

## Tech Stack

- **Framework**: Next.js 13.5 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (DigitalOcean, AWS RDS, or local)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/the-cracked-grain.git
cd the-cracked-grain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:
```
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Generate Prisma client:
```bash
npm run db:generate
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Database Setup

This project uses Prisma ORM with PostgreSQL. The schema is located in `prisma/schema.prisma`.

### Available Database Scripts

- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:deploy` - Deploy migrations to production
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio to view/edit data

### Schema Overview

The database includes tables for:
- Products and categories
- User accounts
- Orders and order items
- Recipes and brewing calculations
- Brew batches and sessions
- Equipment profiles
- Inventory management
- Water chemistry profiles
- Mash schedules

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── shop/              # Shop pages
│   ├── brewing/           # Brewing tools page
│   └── ...                # Other pages
├── components/            # React components
│   ├── brewing/          # Brewing-specific components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Other components
├── lib/                   # Utility functions
│   ├── brewing-calcs.ts  # Brewing calculations
│   ├── bjcp-styles.ts    # BJCP style guidelines
│   ├── db.ts             # Prisma client
│   └── ...               # Other utilities
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Authentication Note

The authentication features are currently stubbed out. To implement full authentication:

1. Set up an authentication provider (Auth.js, Clerk, Supabase Auth, etc.)
2. Update the stubbed auth pages in `app/login`, `app/signup`, and `app/account`
3. Update the Header component to show auth state
4. Remove the "authentication unavailable" messages from brewing components
5. Implement proper session management

## Building for Production

```bash
npm run build
npm run start
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
