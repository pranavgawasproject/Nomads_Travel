# ===========================================
# Nomads Travel Makefile
# Simplify common development tasks
# ===========================================

.PHONY: help install dev frontend build docker-up docker-down clean

GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
NC     := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)Nomads Travel Makefile$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Install frontend dependencies
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	@cd frontend && npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

dev: ## Start development server
	@echo "$(YELLOW)Starting Next.js frontend server...$(NC)"
	@cd frontend && npm run dev

frontend: ## Start frontend server
	cd frontend && npm run dev

build: ## Build frontend for production
	@echo "$(YELLOW)Building Next.js app...$(NC)"
	@cd frontend && npm run build
	@echo "$(GREEN)✓ Build complete$(NC)"

clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning...$(NC)"
	@cd frontend && rm -rf .next node_modules/.cache
	@echo "$(GREEN)✓ Clean complete$(NC)"
