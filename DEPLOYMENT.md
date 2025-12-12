# Deployment Guide

## GitHub Setup

### Initial Upload to GitHub

1. **Create the repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `the-cracked-grain`
   - Make it private or public as desired
   - Do NOT initialize with README (we already have one)

2. **Upload your code**:
   ```bash
   # Extract the archive if needed
   tar -xzf the-cracked-grain.tar.gz
   cd the-cracked-grain

   # Initialize git (if not already done)
   git init

   # Add all files
   git add .

   # Create initial commit
   git commit -m "Initial commit: Complete homebrewing platform"

   # Add your GitHub repository as remote
   git remote add origin https://github.com/YOUR-USERNAME/the-cracked-grain.git

   # Push to GitHub
   git push -u origin main
   ```

## DigitalOcean Database Setup

Your project is already configured to use your DigitalOcean PostgreSQL database.

### Current Configuration

The database connection is configured in `prisma.config.ts` to use:
- Database adapter: PostgreSQL
- Connection: Via environment variable `DATABASE_URL`

### Environment Variables

Make sure your `.env` file contains:
```
DATABASE_URL="postgresql://username:your_password_here@your-db-host.db.ondigitalocean.com:25060/crackedgrain?sslmode=require"
```

**Security Note**: The `.env` file is excluded from git via `.gitignore`. Never commit actual credentials to GitHub. Replace the placeholders above with your actual DigitalOcean database credentials.

### First-Time Database Setup

If you're setting up on a new database:

1. **Run migrations**:
   ```bash
   npm run db:migrate:deploy
   ```

2. **Verify schema**:
   ```bash
   npm run db:studio
   ```
   This opens Prisma Studio where you can view your tables.

## Production Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Push code to GitHub (see above)
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variable:
   - `DATABASE_URL`: Your DigitalOcean connection string
5. Deploy

Vercel will automatically:
- Build your Next.js app
- Generate Prisma client
- Deploy to a global CDN

### Option 2: DigitalOcean App Platform

1. Push code to GitHub
2. Create new app in DigitalOcean App Platform
3. Connect your GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Run command: `npm run start`
5. Add environment variable `DATABASE_URL` (can use internal connection string)
6. Deploy

### Option 3: Docker + DigitalOcean Droplet

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Then deploy using Docker:
```bash
docker build -t the-cracked-grain .
docker run -p 3000:3000 -e DATABASE_URL="your-connection-string" the-cracked-grain
```

## Post-Deployment Checklist

- [ ] Verify database connection works
- [ ] Test product listing and shop pages
- [ ] Verify all static pages load correctly
- [ ] Test brewing calculators
- [ ] Check that images load properly
- [ ] Test responsive design on mobile
- [ ] Set up custom domain (if desired)
- [ ] Configure SSL/HTTPS
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

## Troubleshooting

### Database Connection Issues

If you see "Can't reach database server":
- Verify DATABASE_URL is correctly set
- Check DigitalOcean firewall allows connections from your deployment
- For Vercel: Add Vercel's IP ranges to DigitalOcean allowlist
- Verify SSL mode is set to `require` in connection string

### Build Failures

If build fails with Prisma errors:
```bash
# Regenerate Prisma client
npm run db:generate

# Try building again
npm run build
```

### Missing Environment Variables

Make sure all required environment variables are set in your deployment platform:
- Vercel: Project Settings > Environment Variables
- DigitalOcean: App Settings > App-Level Environment Variables
- Docker: Pass via `-e` flag or docker-compose

## Maintenance

### Database Migrations

When you update the schema:

1. Create migration locally:
   ```bash
   npm run db:migrate
   ```

2. Commit the migration files in `prisma/migrations/`

3. Deploy to production - migrations run automatically with `npm run build`

### Updating Dependencies

```bash
npm update
npm audit fix
git commit -am "Update dependencies"
git push
```

## Support

For issues related to:
- **Prisma**: https://www.prisma.io/docs
- **Next.js**: https://nextjs.org/docs
- **DigitalOcean**: https://docs.digitalocean.com
- **Vercel**: https://vercel.com/docs
