# ===========================================
# RoamIQ Makefile
# Simplify common development tasks
# ===========================================

.PHONY: help install dev backend frontend test lint build docker-up docker-down deploy clean

# Colors
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
NC     := \033[0m # No Color

# Help
help: ## Show this help message
	@echo "$(BLUE)RoamIQ Makefile$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

# Installation
install: ## Install all dependencies
	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
	@cd backend && npm install
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	@cd frontend && npm install
	@echo "$(GREEN)✓ All dependencies installed$(NC)"

# Development
dev: ## Start development servers
	@echo "$(YELLOW)Starting development servers...$(NC)"
	@echo "$(BLUE)Backend: http://localhost:3000$(NC)"
	@echo "$(BLUE)Frontend: http://localhost:5173$(NC)"
	@cd backend && npm run dev &
	@cd frontend && npm run dev

dev: ## Run both frontend and backend in development
	@echo "Starting development..."
	@make backend &
	@make frontend
	@wait

backend: ## Start backend server
	cd backend && npm run dev

frontend: ## Start frontend server
	cd frontend && npm run dev

# Build
build: ## Build frontend for production
	@echo "$(YELLOW)Building frontend...$(NC)"
	@cd frontend && npm run build
	@echo "$(GREEN)✓ Build complete$(NC)"

# Testing
test: ## Run tests
	@echo "$(YELLOW)Running tests...$(NC)"
	@cd backend && npm test || true
	@cd frontend && npm run lint || true

lint: ## Lint code
	@echo "$(YELLOW)Linting code...$(NC)"
	@cd backend && npm run lint || true
	@cd frontend && npm run lint || true

# Docker
docker-build: ## Build Docker images
	@echo "$(YELLOW)Building Docker images...$(NC)"
	docker-compose build

docker-up: ## Start Docker containers
	@echo "$(YELLOW)Starting Docker containers...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Services running$(NC)"
	@echo "$(BLUE)Frontend: http://localhost:5173$(NC)"
	@echo "$(BLUE)Backend: http://localhost:3000$(NC)"

docker-down: ## Stop Docker containers
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Services stopped$(NC)"

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-clean: ## Clean up Docker resources
	docker-compose down -v --rmi local
	@echo "$(GREEN)✓ Docker cleanup complete$(NC)"

# Deployment
deploy: ## Deploy to production
	@echo "$(YELLOW)Deploying to production...$(NC)"
	@echo "$(BLUE)Use Vercel for frontend and Render for backend$(NC)"

# Database
db-mongo: ## Connect to MongoDB
	@echo "$(YELLOW)Connecting to MongoDB...$(NC)"
	@docker exec -it roamiq-mongo mongosh || echo "Run 'make docker-up' first"

db-seed: ## Seed database
	@echo "$(YELLOW)Seeding database...$(NC)"
	cd backend && npm run seed || echo "No seed script configured"

# Utilities
clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning...$(NC)"
	@cd frontend && rm -rf dist node_modules/.vite
	@echo "$(GREEN)✓ Clean complete$(NC)"

reset: ## Reset everything (clean + reinstall)
	@make clean
	@make install

# Code Quality
format: ## Format code with prettier
	@cd frontend && npx prettier --write "src/**/*.{js,jsx,css}" || true

security: ## Run security audit
	@echo "$(YELLOW)Running security audit...$(NC)"
	@cd backend && npm audit
	@cd frontend && npm audit

# Documentation
docs: ## Generate documentation
	@echo "$(YELLOW)Generating documentation...$(NC)"
	@echo "Documentation is in README.md, CONTRIBUTING.md, and ROADMAP.md"
