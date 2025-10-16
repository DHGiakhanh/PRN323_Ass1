# E-commerce Assignment (PRN323_Ass1)

This repository contains a simple clothing e-commerce backend (ASP.NET Core) and frontend (React). It includes authentication (JWT), CRUD for products, cart and order management.

## Quickstart (local)

Prerequisites
- .NET 8 SDK
- Node.js (>=16) and npm
- PostgreSQL local instance

1) Configure local database
- Create a PostgreSQL database named `asm_prn323` and ensure you can connect with user `postgres` and password `123` (or change connection string below)

2) Update connection string (optional)
- By default the project uses connection in `ecommerce-be/ASMPRN232/appsettings.json` and `appsettings.Development.json`:

```
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=asm_prn323;Username=postgres;Password=123"
}
```

3) Apply migrations (optional — app will auto-apply on startup)

```powershell
cd d:\PRN232\code\QE180127_assign1\ecommerce-be\ASMPRN232
# optionally set admin seed via env vars to override default
$env:SEED_ADMIN_EMAIL = "admin@example.com"
$env:SEED_ADMIN_PASSWORD = "P@ssw0rd123"
# apply migrations
dotnet ef database update
```

4) Run backend

```powershell
# recommended to set JWT secret in env
$env:Jwt__Key = "change_this_dev_secret"
$env:Jwt__Issuer = "ASMPRN232"
$env:Jwt__Audience = "ASMPRN232Clients"
cd d:\PRN232\code\QE180127_assign1\ecommerce-be\ASMPRN232
dotnet run
```

5) Run frontend

```powershell
cd d:\PRN232\code\QE180127_assign1\ecommerce-ui
# point to API URL if backend running on different host/port
$env:REACT_APP_API_URL = "https://localhost:5001"
npm install
npm start
```

## Notes
- On first run the app will seed an admin user (email/password configurable via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
- Use the admin user to create/update/delete products from the UI.
- Orders are saved to the database. Cart is stored in localStorage on the client.
- For production consider stronger secrets and disabling automatic migrations.

If you want, I can help deploy this to a free hosting provider (Render/Vercel/Railway) — tell me which you'd prefer and I'll prepare steps.