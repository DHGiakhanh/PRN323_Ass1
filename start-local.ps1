# start-local.ps1
# Starts backend and frontend with recommended environment variables for local development.
# Usage: Open PowerShell in repo root and run: .\start-local.ps1

# Set JWT secret and admin seed (customize if needed)
$env:Jwt__Key = "dev_secret_change_me"
$env:Jwt__Issuer = "ASMPRN232"
$env:Jwt__Audience = "ASMPRN232Clients"
$env:SEED_ADMIN_EMAIL = "admin@example.com"
$env:SEED_ADMIN_PASSWORD = "P@ssw0rd123"

# Start backend in a separate window
$backendPath = "d:\PRN232\code\QE180127_assign1\ecommerce-be\ASMPRN232"
$frontendPath = "d:\PRN232\code\QE180127_assign1\ecommerce-ui"

Write-Host "Starting backend..."
Start-Process powershell -ArgumentList "-NoExit -Command cd '$backendPath'; dotnet run" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "Starting frontend (will use .env.development which sets PORT=3001 and REACT_APP_API_URL)..."
Start-Process powershell -ArgumentList "-NoExit -Command cd '$frontendPath'; npm start" -WindowStyle Normal

Write-Host "Started backend and frontend in new PowerShell windows."
 