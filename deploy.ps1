# Lenjoy Manager - Deploy Script
# For Windows PowerShell

Write-Host "Lenjoy Manager - Docker One-Click Deploy" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker detected: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker not installed" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is available
try {
    $composeVersion = docker compose version
    Write-Host "[OK] Docker Compose detected: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker Compose not available" -ForegroundColor Red
    Write-Host "Please ensure Docker Compose V2 is installed" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check .env file
if (-not (Test-Path .env)) {
    Write-Host "[WARNING] .env file not found, creating from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "[OK] .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "[IMPORTANT] Please edit .env file and modify:" -ForegroundColor Yellow
    Write-Host "   - SECRET_KEY (MUST change)"
    Write-Host "   - DATABASE_PASSWORD (recommended)"
    Write-Host "   - DATABASE_ROOT_PASSWORD (recommended)"
    Write-Host ""
    $response = Read-Host "Press Enter to continue, or Ctrl+C to cancel and edit .env file"
}

# Create necessary directories
Write-Host "Creating required directories..." -ForegroundColor Cyan
@("logs\nginx", "logs\mysql", "api\media", "api\staticfiles", "letsencrypt") | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}
Write-Host "[OK] Directories created" -ForegroundColor Green

# Stop and remove old containers
Write-Host ""
Write-Host "Cleaning up old containers..." -ForegroundColor Cyan
docker compose down -v 2>$null

# Build and start services
Write-Host ""
Write-Host "Building Docker images (this may take a few minutes)..." -ForegroundColor Cyan
docker compose build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Docker build failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above and fix the issues." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Failed to start services!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    exit 1
}

# Wait for services to start
Write-Host ""
Write-Host "Waiting for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Check service status
Write-Host ""
Write-Host "Service Status:" -ForegroundColor Cyan
docker compose ps

# Display access information
Write-Host ""
Write-Host "[SUCCESS] Backend services deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start the frontend service locally:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Yellow
Write-Host "   pnpm install      # First time only" -ForegroundColor Yellow
Write-Host "   pnpm build        # Build for production" -ForegroundColor Yellow
Write-Host "   pnpm start        # Start production server" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Access URLs (after starting frontend):" -ForegroundColor Cyan
Write-Host "   - Frontend:      http://localhost (via Nginx)" -ForegroundColor White
Write-Host "   - Frontend Direct: http://localhost:3000" -ForegroundColor White
Write-Host "   - Backend API:   http://localhost/api" -ForegroundColor White
Write-Host "   - Admin Panel:   http://localhost/admin" -ForegroundColor White
Write-Host "   - API Docs:      http://localhost/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Common Commands:" -ForegroundColor Cyan
Write-Host "   - View logs:    docker compose logs -f" -ForegroundColor White
Write-Host "   - Stop services: docker compose down" -ForegroundColor White
Write-Host "   - Restart:      docker compose restart" -ForegroundColor White
Write-Host "   - Check status: docker compose ps" -ForegroundColor White
Write-Host ""
Write-Host "[TIP] First startup may take a few minutes to initialize database" -ForegroundColor Yellow
Write-Host "      Use 'docker compose logs -f api' to view backend startup logs" -ForegroundColor Yellow
Write-Host ""
