# PostgreSQL + Prisma Migration Guide

This backend has been migrated from SQLite to PostgreSQL with Prisma ORM. All existing API endpoints remain unchanged.

## Prerequisites

- Node.js 22.14.0 or higher
- PostgreSQL 12+ (local or Docker)
- npm

## Setup Instructions

### 1. Install PostgreSQL Locally

#### Option A: Using Docker (Recommended)

```bash
cd warehouse-app
docker-compose up -d
```

This will start a PostgreSQL container with:
- Database: `warehouse_db`
- User: `warehouse_user`
- Password: `warehouse_pass`
- Port: `5432`

#### Option B: Manual PostgreSQL Installation

Install PostgreSQL on your system, then create a database:

```sql
CREATE DATABASE warehouse_db;
CREATE USER warehouse_user WITH ENCRYPTED PASSWORD 'warehouse_pass';
ALTER ROLE warehouse_user WITH LOGIN;
GRANT ALL PRIVILEGES ON DATABASE warehouse_db TO warehouse_user;
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
```

This will create all tables in PostgreSQL based on the schema in `prisma/schema.prisma`.

### 5. Seed Database (Optional - for testing)

```bash
npm run seed
```

This creates:
- Admin user: `admin` / `admin123`
- Seller user: `ali` / `seller123`
- Sample products and pricing rules
- Sample purchases and sales

### 6. Start Backend Server

```bash
npm start
```

Server will run on `http://localhost:5000`

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://warehouse_user:warehouse_pass@localhost:5432/warehouse_db?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=5000
NODE_ENV=development
```

## API Endpoints (Unchanged)

All endpoints remain the same as before:

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Products**: `GET /api/products`, `POST /api/products`, `GET /api/products/:id`
- **Purchases**: `GET /api/purchases`, `POST /api/purchases`
- **Sales**: `GET /api/sales`, `POST /api/sales`, `GET /api/sales/:id`
- **Reports**: `GET /api/reports/dashboard`, `GET /api/reports/stock-summary`, `GET /api/reports/period`
- **Users**: `GET /api/users`, `POST /api/users`, `DELETE /api/users/:id`
- **Pricing**: `GET /api/pricing/:productId`, `PUT /api/pricing/:productId`
- **Batches**: `GET /api/batches`, `POST /api/batches`, `GET /api/batches/:id`
- **Cash Out**: `GET /api/cashout`, `POST /api/cashout`, `PUT /api/cashout/:id`, `DELETE /api/cashout/:id`
- **Debts**: `GET /api/debts`, `POST /api/debts`, `POST /api/debts/:id/pay`, `PUT /api/debts/:id`, `DELETE /api/debts/:id`

## Deployment to Render

### Prerequisites

- PostgreSQL database on Render or external provider (Neon, Railway, AWS RDS, etc.)
- GitHub repository with code pushed

### Steps

1. **Create PostgreSQL Database on Render**:
   - Go to https://render.com
   - Create a new PostgreSQL database
   - Copy the external connection string

2. **Set Environment Variables**:
   - Update `DATABASE_URL` with your Render PostgreSQL connection string
   - Update `JWT_SECRET` to a secure value

3. **Deploy Backend**:
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Set `Build command`: `cd backend && npm install && npx prisma generate && npx prisma migrate deploy`
   - Set `Start command`: `cd backend && npm start`
   - Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT=5000`, `NODE_ENV=production`

4. **Run Migrations on Render**:
   - After first deploy, run migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. **Seed Production Database (Optional)**:
   ```bash
   npm run seed
   ```

## Development Workflow

### Making Schema Changes

1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name <migration_name>`
3. Prisma will apply changes and update Prisma Client
4. Commit migration files and schema

### Common Tasks

```bash
# View current database state
npx prisma studio

# Reset database (dev only!)
npx prisma migrate reset

# Create new migration from schema changes
npx prisma migrate dev --name add_new_field

# Check migration status
npx prisma migrate status
```

## Technical Details

### Models in Prisma Schema

- **User**: Authentication, roles (manager/seller)
- **Product**: Inventory items with types (armatura, cement, etc.)
- **PricingRule**: Price controls per product
- **Purchase**: Incoming stock tracking
- **Sale**: Customer sales with profit tracking
- **SaleItem**: Individual items in sales
- **IncomingBatch**: Batch deliveries with cost allocation
- **BatchProduct**: Products in batches with meter calculations
- **BatchExpense**: Expenses allocated to batches
- **CashOut**: Expense tracking
- **Debt**: Credit sales tracking

### Database Naming Convention

- Table names: PascalCase (User, Product, Sale)
- Column names: camelCase (userId, productId, createdAt)
- Prisma generates SQL table names automatically

### Key Changes from SQLite

1. **Async/Await**: All database operations use async/await
2. **Type Safety**: Prisma provides TypeScript types
3. **Better Relationships**: Automatic joins with relations
4. **Transactions**: Built-in transaction support
5. **Connection Pooling**: Automatic connection management
6. **Production-Ready**: PostgreSQL is more scalable than SQLite

## Troubleshooting

### "Can't reach database server"
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall/network access

### Migration errors
- Run `npx prisma migrate reset` (dev only)
- Or manually fix schema conflicts

### Prisma Client errors
- Run `npx prisma generate` again
- Delete `node_modules` and `package-lock.json`, reinstall
- Check that .env file exists and DATABASE_URL is set

## Support

For issues:
1. Check `.env` file configuration
2. Verify PostgreSQL connection
3. Check Prisma documentation: https://www.prisma.io/docs/
4. Review Render deployment guide: https://render.com/docs
