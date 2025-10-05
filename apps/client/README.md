# Micro Commerce App — Client

A React Native + Expo mobile client for the Micro Commerce platform.
It connects to the Express + PostgreSQL backend via REST API and provides a mobile commerce experience — user authentication, product browsing, cart and checkout

## Tech Stack
- Framework: React Native (Expo)
- Language: TypeScript
- Navigation: Expo Router
- State Management: Zustand (lightweight store)
- Networking: Axios
- Authentication: JWT-based (stored securely via Expo SecureStore)
- UI Components: React Native Paper / NativeWind (Tailwind for RN)
- Form Handling: React Hook Form + Zod
- API Integration: REST (connects to /api/v1 endpoints of the server)
- Build/Deployment: Expo CLI (Managed Workflow)

Testing: Jest + React Native Testing Library


## Requirements
- Node.js 18+
- Expo-Go App (Install from playstore)
- Backend server running (from the Micro Commerce Server project)
   - API Base URL reachable (e.g. http://localhost:8080/api/v1)
- Package manager: npm

## Installation & Running the App

### Installation
```bash
cd apps/client
npm install
```

### Running the app
```bash
npx expo start
```

## Environment Variables
Create an `.env.development` file in `apps/client/` and copy the url that you get from running `npx expo start` e.g if you get `exp://192.168.1.119:8081`, copy the `191.168.1.119` to .env.development as `EXPO_PUBLIC_API_URL=http://191.168.1.119:8080/api/v1`

```
EXPO_PUBLIC_API_URL=your-expo-url-you-get-from-running-command-above
```

## Authentication Flow
- Signup/Login using /api/v1/auth endpoints
- JWT tokens stored via expo-secure-store
- Axios interceptors automatically attach Authorization: Bearer <token>
- Refresh token handled silently via /auth/refresh

## Features

| Feature | Description |
|----------|--------------|
| **Authentication** | Signup, Login, Forgot/Reset password |
| **Product Catalog** | Browse |
| **Cart** | Add, remove, and update items |
| **Orders** | Checkout |
| **Auto Refresh** | Refresh access token using stored refresh token |

## Known Limitations
- Backend dependency: The app requires the server API to be live — it doesn’t work offline yet.
- Email verification: Password reset email yet to be implemented
- No push notifications (planned for future version).
- Limited admin functionality: Admin operations
- Caching and offline support minimal.