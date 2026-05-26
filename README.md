# Evently

Evently is an events marketplace and organizer platform built with Next.js, Tailwind CSS and Prisma. It includes a public landing site, authenticated user dashboard, and an admin panel with role-based access control.

Tech stack
- Frontend: Next.js (App Router)
- Styling: Tailwind CSS
- UI primitives: shadcn/ui + Lucide icons
- Backend: Next.js API routes
- ORM: Prisma (PostgreSQL)
- Auth: NextAuth
- Validation: Zod
- Forms: React Hook Form
- Animations: Framer Motion

Quick start

1. Install dependencies

```bash
npm install
```

2. Create an environment file by copying the example and filling values

```bash
cp .env.example .env
```

3. Generate Prisma client (postinstall also runs this)

```bash
npm run db:generate
```

4. Create or push the database schema and run migrations (local dev)

```bash
# create a migration and apply
npm run db:migrate
# or push the schema without a migration (quick)
npm run db:push
```

5. Seed the database

```bash
npm run db:seed
```

6. Run the app in development

```bash
npm run dev
```

Build for production

```bash
npm run build
npm run start
```

.env example
Create a `.env` file in the project root. Here's an example of the minimum variables used by this app (replace values):

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/evently

# NextAuth
NEXTAUTH_SECRET=some-long-random-string
NEXTAUTH_URL=http://localhost:3000

# Optional: OAuth provider credentials (example: Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Vercel or production base URL
NEXT_PUBLIC_APP_URL=https://your-deployed-site.vercel.app
```

Database and Prisma
- Schema is defined in [prisma/schema.prisma](prisma/schema.prisma).
- Prisma client is generated to `app/generated/prisma` and consumed via `lib/prisma.ts`.
- Seeds are located at `prisma/seed.ts` and the `db:seed` script uses `tsx`.

API & auth
- API routes live under `app/api/*` and use Zod for validation where applicable.
- Authentication is implemented with NextAuth and user profiles are stored in the database.

Notes & troubleshooting
- If the Next.js build fails because a page attempts to access the database at build time, ensure `DATABASE_URL` is set or the page is configured as dynamic. This repository marks DB-backed pages as dynamic where appropriate.
- You may see a warning about the `middleware` convention — Next.js recommends using `proxy` configuration. This is a non-blocking deprecation warning.

Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run db:generate` — `prisma generate`
- `npm run db:push` — push schema
- `npm run db:migrate` — run migrations (dev)
- `npm run db:seed` — seed database
- `npm run db:studio` — open Prisma Studio

Deployment
- The project is ready to deploy on Vercel. Connect your repository in the Vercel dashboard and set the same environment variables there.
- Make sure to set `NEXTAUTH_URL` and `DATABASE_URL` in the Vercel environment settings.

Project structure (high level)
- `app/` — Next.js app routes and pages
- `app/api/` — server API routes
- `components/` — UI components
- `lib/` — utilities and `prisma.ts`
- `prisma/` — schema and seed
- `public/` — static assets

Where to go next
- See `app/(public)/page.tsx` for the landing page and `app/dashboard` for user features.
- To change the database schema, edit `prisma/schema.prisma`, run `npm run db:migrate`, then update seeds if needed.

If you'd like, I can also:
- add a concise CONTRIBUTING section and developer checklist
- provide step-by-step deployment instructions for Vercel
- add GitHub Actions for CI (build + lint)

---
Updated README to include setup, environment, database and deployment guidance.
