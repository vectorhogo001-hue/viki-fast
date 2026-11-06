.PHONY: help build build-frontend build-backend dev test clean install-deps

# Default target
help:
	@echo "Viki Fast - Build Commands"
	@echo ""
	@echo "  make install-deps    - Install all dependencies (Go + Node)"
	@echo "  make build-frontend  - Build frontend only"
	@echo "  make build-backend   - Build Go backend only"
	@echo "  make build           - Build complete application (frontend + backend)"
	@echo "  make dev             - Run development server"
	@echo "  make test            - Run tests"
	@echo "  make clean           - Clean build artifacts"
	@echo "  make package         - Create distribution packages"

# Install all dependencies
install-deps:
	@echo "Installing Go dependencies..."
	go mod tidy
	@echo "Installing Node dependencies..."
	cd frontend && npm install

# Build frontend only
build-frontend:
	@echo "Building frontend..."
	cd frontend && npm run build

# Build Go backend
build-backend:
	@echo "Building Go backend..."
	go build -o bin/viki-fast ./cmd/viki-fast

# Build everything
build: build-frontend build-backend
	@echo "Build complete!"

# Development server
dev:
	@echo "Starting development servers..."
	@echo "Frontend: http://localhost:34115"
	@echo "Backend will be built and run by Wails"
	wails dev

# Run tests
test:
	@echo "Running tests..."
	go test ./...
	cd frontend && npm run test 2>/dev/null || true

# Clean build artifacts
clean:
	@echo "Cleaning..."
	rm -rf bin/
	rm -rf frontend/dist/
	rm -rf frontend/node_modules/.cache/

# Package for distribution
package:
	@echo "Creating distribution packages..."
	goreleaser release --clean --snapshot --rm-dist

# Install Wails CLI if not present
install-wails:
	go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Setup development environment
setup-dev: install-wails install-deps
	@echo "Development environment ready!"
	@echo "Run 'make dev' to start development server"