Ticketing Backend (NestJS Monorepo)

- Apps: `api-gateway`, `auth-service`, `users-service`, `tickets-service`
- Tech: NestJS, Mongoose, JWT, Passport OAuth (Google/GitHub/Facebook), Redis cache (stub), Throttling

Environment variables

- JWT_SECRET, JWT_EXPIRES_IN
- MONGO_URI (per service or default local URIs)
- THROTTLE_TTL, THROTTLE_LIMIT
- GOOGLE/GITHUB/FACEBOOK client credentials

Development

1. Install: `npm install`
2. Run apps (example):
   - `npm run start:gateway`
   - `npm run start:auth`
   - `npm run start:users`
   - `npm run start:tickets`


