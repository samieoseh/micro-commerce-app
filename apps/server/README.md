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
- Package manager: npm, or yarn

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
Environment files are loaded per NODE_ENV, e.g. .env.development, .env.test.

Create apps/server/.env.development with at least the following:
```
# Server
PORT=8080
PORT=8080

DATABASE_URL="replace-with-your-database-url"

JWT_SECRET="marvelouscomfort"
RESEND_API_KEY=re_CaWb7Mee_5xXBQhQEEBq7NWreHEt9j9AQ
APP_URL="http://localhost:3000"
```

then copy the below to .env.test
```
JWT_SECRET="marvelouscomfort"
RESEND_API_KEY="re_CaWb7Mee_5xXBQhQEEBq7NWreHEt9j9AQ"
```

## Installation
```bash
cd apps/server
npm install
```

## Database Setup (Drizzle ORM + PostgreSQL)
Ensure your DB is running and DATABASE_URL in .env.development are correct. Apply schema with Drizzle:
```bash
cd apps/server
npm db:push
```

Alternatively, to generate SQL artifacts:
```bash
npm db:gen
npm db:migrate
```
## Running the Server
```bash
cd apps/server
npx ts-node src/index.ts
```

Health check:
```bash
curl http://localhost:8080/api/v1/healthz
```

## Seeding Sample Data
From the server directory:
```bash
cd apps/server
npm seed:all
```

## Testing
```bash
cd apps/server
npm test
```

Notes:
- In NODE_ENV=test, the auth middleware stubs a user for convenience in some flows.

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
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Passw0rd!"}'
```
Response (201)
```bash
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
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Passw0rd!"}'
```
Response (200)
```bash
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
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<jwt>"}'
```

Forgot Password (sends email via Resend)
```bash
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Reset Password
```bash
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
```bash
curl http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer <accessToken>"
```
Create Product (admin)
```bash
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
```bash
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
```bash
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
```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer <accessToken>"
```


## Error Handling
Errors are returned with appropriate HTTP status codes, typically:
```bash
{
  "message": "Validation error",
  "errors": [ ... ]
}
```
Or domain errors like:
```bash
{
  "message": "Unauthorized: You must be logged in to access this resource"
}
```

## Known Limitations
- Email delivery is only sent to my mail since it was use to obtain the RESEND_API_KEY. Paying for a plan mitigates it.
- Some simple endpoints (e.g., users) are stubbed for demonstration.

## License
MIT (or as specified in the repository)
