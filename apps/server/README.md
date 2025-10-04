# Micro Commerce App — Server

A TypeScript/Express server for a micro commerce application. It provides authentication, product catalog, cart, and order management REST APIs backed by PostgreSQL using Drizzle ORM.

- Base URL: /api/v1
- Health check: GET /api/v1/healthz

## Tech Stack
- Runtime: Node.js (TypeScript)
- Web framework: Express 5
- Auth: JWT (passport-jwt)
- Validation: express-validator
- ORM: Drizzle ORM (PostgreSQL)
- DB driver: node-postgres (pg)
- Logging: morgan + winston
- Config: dotenv (environment-specific .env files)
- Email: Resend (for password reset)
- Testing: Jest, Supertest, Testcontainers (PostgreSQL)

## Requirements
- Node.js 18+
- PostgreSQL 14+ available and reachable for development
- Package manager: pnpm (recommended for monorepo), npm, or yarn

## Project Structure (server)
```
apps/server/
  src/
    index.ts              # bootstrap + env loading
    app.ts                # express app with middleware and routing
    db.ts                 # drizzle + postgres connection
    config/passport.ts    # passport-jwt strategy
    middleware/           # auth, role, logger, error handler, validate
    modules/
      auth/               # signup, login, refresh, forgot/reset password
      users/
      products/
      carts/
      orders/
    scripts/
      seed-users.ts
      seed-products.ts
  drizzle.config.ts       # drizzle kit config
  package.json            # scripts, deps
```

## Environment Variables
Environment files are loaded per NODE_ENV, e.g. .env.development, .env.production, .env.test.

Create apps/server/.env.development with at least the following:
```
# Server
PORT=8080
NODE_ENV=development
APP_URL=http://localhost:3000

# JWT
JWT_SECRET=replace-with-a-strong-secret

# PostgreSQL
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=micro_commerce

# Email (Resend)
RESEND_API_KEY=replace-with-your-resend-api-key
```
Notes:
- RESEND_API_KEY is required at runtime if you use the forgot-password flow.
- The server reads .env.<NODE_ENV> (e.g. .env.development) at startup.

## Installation
From the repo root (recommended with pnpm workspace):
- pnpm install

Or from the server app directory only:
- cd apps/server
- pnpm install

npm/yarn users can substitute their package manager equivalents.

## Database Setup (Drizzle ORM + PostgreSQL)
Ensure your DB is running and the credentials in .env.development are correct. Apply schema with Drizzle:
- pnpm --filter server db:push

Alternatively, to generate SQL artifacts:
- pnpm --filter server db:gen
- pnpm --filter server db:migrate

## Running the Server
Development (TypeScript via ts-node):
- pnpm --filter server dev

Directly in the server directory:
- cd apps/server
- pnpm dev

Health check:
- curl http://localhost:8080/api/v1/healthz

## Seeding Sample Data
From the server directory:
- pnpm seed:users
- pnpm seed:products
- pnpm seed:all

## Testing
- pnpm --filter server test

Notes:
- In NODE_ENV=test, the auth middleware stubs a user for convenience in some flows.
- Testcontainers is available to run PostgreSQL in tests, but ensure Docker is running if tests rely on it.

## API Endpoints
Base path: /api/v1

### General
- GET /api/v1
- GET /api/v1/healthz

### Auth
- POST /api/v1/auth/signup
- POST /api/v1/auth/admin/signup
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password

Examples:
Signup
```
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Passw0rd!"}'
```
Response (201)
```
{
  "success": true,
  "data": {
    "id": 1,
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>",
    "role": "user"
  }
}
```

Login
```
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Passw0rd!"}'
```
Response (200)
```
{
  "success": true,
  "data": {
    "id": 1,
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>",
    "role": "user"
  }
}
```

Refresh Access Token
```
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<jwt>"}'
```

Forgot Password (sends email via Resend)
```
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Reset Password
```
curl -X POST http://localhost:8080/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<token-from-email>","newPassword":"NewPassw0rd!"}'
```

### Products
All product routes require authentication. Creating/updating/deleting requires admin role.

- GET /api/v1/products
- GET /api/v1/products/search/query?q=<keyword>&category=<cat>&brand=<brand>&minPrice=<num>&maxPrice=<num>&page=<n>&limit=<n>
- GET /api/v1/products/:id
- POST /api/v1/products (admin)
- PUT /api/v1/products/:id (admin)
- DELETE /api/v1/products/:id (admin)

List Products
```
curl http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer <accessToken>"
```
Create Product (admin)
```
curl -X POST http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer <adminAccessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Widget",
    "description": "Nice widget",
    "price": "19.99",
    "stock": 100,
    "brand": "Acme",
    "category": "gadgets"
  }'
```

Typical success response
```
{
  "success": true,
  "data": { ... }
}
```

### Carts
All cart routes require authentication.

- POST /api/v1/cart
- GET /api/v1/cart
- DELETE /api/v1/cart
- POST /api/v1/cart/items
- DELETE /api/v1/cart/items
- GET /api/v1/cart/items
- PUT /api/v1/cart/items/:itemId
- DELETE /api/v1/cart/items/:itemId
- GET /api/v1/cart/items/:itemId

Add Item
```
curl -X POST http://localhost:8080/api/v1/cart/items \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2,"price":"19.99"}'
```

### Orders
All order routes require authentication.

- GET /api/v1/orders
- GET /api/v1/orders/:id
- POST /api/v1/orders
- GET /api/v1/orders/history/:id

Create Order
```
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer <accessToken>"
```

### Users
- GET /api/v1/users

```
curl http://localhost:8080/api/v1/users
```

## Error Handling
Errors are returned with appropriate HTTP status codes, typically:
```
{
  "message": "Validation error",
  "errors": [ ... ]
}
```
Or domain errors like:
```
{
  "message": "Unauthorized: You must be logged in to access this resource"
}
```

## Known Limitations
- Email delivery requires RESEND_API_KEY configured and reachable; otherwise forgot-password will throw at runtime.
- Some simple endpoints (e.g., users) are stubbed for demonstration.

## Useful Scripts
From apps/server/package.json:
- dev: nodemon + ts-node (watches src)
- start: node dist/index.js (requires a build step)
- test: jest (Windows env flag for Node ESM support)
- db:push | db:gen | db:migrate: Drizzle schema ops
- seed:users | seed:products | seed:all: Populate sample data

## License
MIT (or as specified in the repository)
