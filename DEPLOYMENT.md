# Deployment Guide - LifeHacks Platform

This guide covers everything you need to deploy the LifeHacks platform from development to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Database Migration](#database-migration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd haki
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- Prisma ORM
- NextAuth.js
- React Markdown
- Tailwind CSS
- And other dependencies

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Prisma (if you encounter engine download issues)
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

**Important:** Generate a secure `NEXTAUTH_SECRET`:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` (SQLite) or PostgreSQL URL |
| `NEXTAUTH_URL` | Your application URL | `http://localhost:3000` (dev) or `https://yourdomain.com` (prod) |
| `NEXTAUTH_SECRET` | Secret key for session encryption | Generated using openssl |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING` | Skip Prisma engine checksum validation | Not set |

## Database Setup

### 1. Initialize the Database

Generate Prisma client and create the database:

```bash
npx prisma generate
npx prisma db push
```

### 2. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 3 test users (alex, dmitry, ivan)
- 6 sample lifehacks with markdown content
- Ratings and comments
- Favorite relationships

**Test User Credentials:**
- Email: `alex@example.com` / Password: `password123`
- Email: `dmitry@example.com` / Password: `password123`
- Email: `ivan@example.com` / Password: `password123`

### 3. View Database (Optional)

Open Prisma Studio to view and edit data:

```bash
npx prisma studio
```

Access at `http://localhost:5555`

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Type Checking

```bash
# Check for TypeScript errors
npx tsc --noEmit
```

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
vercel
```

Follow the prompts to deploy your application.

#### Step 4: Configure Environment Variables

In the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:
   - `DATABASE_URL` - Your production database URL (see [Database Options](#database-options))
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` - Your generated secret key

#### Step 5: Redeploy

```bash
vercel --prod
```

### Option 2: Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Build and Run

```bash
# Build the Docker image
docker build -t lifehacks-app .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret" \
  lifehacks-app
```

### Option 3: VPS (DigitalOcean, AWS, etc.)

#### Prerequisites on Server

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

#### Deploy Steps

1. Clone your repository on the server
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Generate Prisma client: `npx prisma generate`
5. Run database migrations: `npx prisma db push`
6. Build the application: `npm run build`
7. Start with PM2: `pm2 start npm --name "lifehacks" -- start`
8. Save PM2 configuration: `pm2 save`
9. Set up PM2 to start on boot: `pm2 startup`

#### Set Up Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Options

### SQLite (Development/Small Projects)

**Pros:** Simple, no setup required, file-based
**Cons:** Not suitable for high-traffic production

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (Production Recommended)

**Providers:**
- [Neon](https://neon.tech/) - Serverless PostgreSQL (Free tier available)
- [Supabase](https://supabase.com/) - PostgreSQL with additional features
- [Railway](https://railway.app/) - Easy PostgreSQL hosting
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) - Integrated with Vercel

**Example PostgreSQL URL:**

```env
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
```

#### Migrating from SQLite to PostgreSQL

1. Update `DATABASE_URL` in `.env` to PostgreSQL URL
2. Update schema if needed (PostgreSQL-specific features)
3. Run migrations:

```bash
npx prisma db push
```

4. Seed the database:

```bash
npm run seed
```

### MySQL

```env
DATABASE_URL="mysql://username:password@host:3306/database"
```

## Database Migration

### When Schema Changes

After updating `prisma/schema.prisma`:

#### Development

```bash
# Apply changes to database
npx prisma db push

# Regenerate Prisma client
npx prisma generate
```

#### Production

```bash
# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply migration in production
npx prisma migrate deploy
```

### Backing Up Data

#### SQLite

```bash
# Backup
cp prisma/dev.db prisma/dev.db.backup

# Restore
cp prisma/dev.db.backup prisma/dev.db
```

#### PostgreSQL

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Troubleshooting

### Issue: Prisma Engine Download Fails (403 Forbidden)

**Error:**
```
Failed to fetch prisma engines
```

**Solution:**

Add to `.env`:

```env
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

Then run:

```bash
npx prisma generate
```

### Issue: NextAuth Session Not Working

**Problem:** Users can't stay logged in

**Solutions:**

1. Verify `NEXTAUTH_SECRET` is set and matches across deployments
2. Ensure `NEXTAUTH_URL` matches your actual domain
3. Check that cookies are enabled in browser
4. For production, ensure your domain supports HTTPS

### Issue: Database Connection Fails

**Error:**
```
Can't reach database server
```

**Solutions:**

1. Verify `DATABASE_URL` is correct
2. Check database server is running
3. Verify network connectivity and firewall rules
4. For cloud databases, check IP whitelist settings

### Issue: Build Fails on Vercel

**Error:**
```
Type error: ...
```

**Solutions:**

1. Run `npx tsc --noEmit` locally to check for TypeScript errors
2. Ensure all dependencies are in `package.json` (not just devDependencies)
3. Check Node.js version compatibility

### Issue: Environment Variables Not Loading

**Solutions:**

1. Restart development server after changing `.env`
2. In production, verify variables are set in hosting platform
3. Don't commit `.env` to git (it's in `.gitignore`)
4. For Next.js public variables, prefix with `NEXT_PUBLIC_`

### Issue: Markdown Not Rendering

**Problem:** Content shows as plain text

**Solutions:**

1. Verify `react-markdown` and `remark-gfm` are installed
2. Check that content is wrapped in `<ReactMarkdown>` component
3. Clear browser cache and rebuild

## Performance Optimization

### 1. Enable Next.js Image Optimization

Use Next.js `<Image>` component for user avatars and images.

### 2. Database Indexes

Ensure indexes are set on frequently queried fields in `schema.prisma`:

```prisma
model Lifehack {
  // ...
  @@index([category])
  @@index([createdAt])
}
```

### 3. Caching Strategy

Consider implementing:
- Redis for session storage
- CDN for static assets (Vercel handles this automatically)
- API route caching for frequently accessed data

### 4. Database Connection Pooling

For production PostgreSQL, configure connection pooling:

```env
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=10&pool_timeout=20"
```

## Security Checklist

Before deploying to production:

- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Use HTTPS for production (not HTTP)
- [ ] Enable CORS only for trusted domains
- [ ] Set secure cookie settings in NextAuth
- [ ] Validate all user inputs
- [ ] Use environment variables for sensitive data
- [ ] Enable database backups
- [ ] Set up monitoring and error tracking
- [ ] Review and update dependencies regularly
- [ ] Implement rate limiting for API routes

## Monitoring and Maintenance

### Recommended Tools

- **Error Tracking:** [Sentry](https://sentry.io/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics) or [Google Analytics](https://analytics.google.com/)
- **Uptime Monitoring:** [UptimeRobot](https://uptimerobot.com/)
- **Performance:** [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Regular Maintenance

1. **Update Dependencies:** Run `npm update` monthly
2. **Database Backups:** Schedule automated backups
3. **Monitor Performance:** Check response times and error rates
4. **Security Updates:** Apply security patches promptly
5. **Database Cleanup:** Archive or remove old data as needed

## Support

For issues and questions:

1. Check this deployment guide
2. Review [Next.js documentation](https://nextjs.org/docs)
3. Check [Prisma documentation](https://www.prisma.io/docs)
4. Review project README.md

---

**Last Updated:** 2025-11-18
**Version:** 1.0.0
