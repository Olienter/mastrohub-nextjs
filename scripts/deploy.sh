#!/bin/bash

# MastroHub Deployment Script
# Usage: ./scripts/deploy.sh [environment] [version]

set -e

# Configuration
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
DOCKER_REGISTRY="ghcr.io"
IMAGE_NAME="mastrohub-nextjs"
FULL_IMAGE_NAME="$DOCKER_REGISTRY/$IMAGE_NAME:$VERSION"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_success "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install it and try again."
        exit 1
    fi
    log_success "Docker Compose is available"
}

# Backup current deployment
backup_deployment() {
    log_info "Creating backup of current deployment..."
    
    if [ -d "backups" ]; then
        BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
        mkdir -p "backups/$BACKUP_NAME"
        
        # Backup docker-compose files
        cp docker-compose.yml "backups/$BACKUP_NAME/" 2>/dev/null || true
        cp docker-compose.production.yml "backups/$BACKUP_NAME/" 2>/dev/null || true
        cp docker-compose.staging.yml "backups/$BACKUP_NAME/" 2>/dev/null || true
        
        # Backup environment files
        cp .env* "backups/$BACKUP_NAME/" 2>/dev/null || true
        
        log_success "Backup created: backups/$BACKUP_NAME"
    fi
}

# Pull latest image
pull_image() {
    log_info "Pulling latest image: $FULL_IMAGE_NAME"
    
    if docker pull "$FULL_IMAGE_NAME"; then
        log_success "Image pulled successfully"
    else
        log_error "Failed to pull image"
        exit 1
    fi
}

# Health check function
health_check() {
    local url="http://localhost:3000/api/health"
    local max_attempts=30
    local attempt=1
    
    log_info "Performing health check..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null; then
            log_success "Health check passed"
            return 0
        fi
        
        log_info "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    
    # Stop current containers
    docker-compose down
    
    # Restore from backup if available
    if [ -d "backups" ]; then
        LATEST_BACKUP=$(ls -t backups | head -1)
        if [ -n "$LATEST_BACKUP" ]; then
            log_info "Restoring from backup: $LATEST_BACKUP"
            cp "backups/$LATEST_BACKUP/"* . 2>/dev/null || true
        fi
    fi
    
    # Start previous version
    docker-compose up -d
    
    if health_check; then
        log_success "Rollback completed successfully"
    else
        log_error "Rollback failed"
        exit 1
    fi
}

# Deploy function
deploy() {
    log_info "Starting deployment to $ENVIRONMENT environment..."
    
    # Set environment-specific variables
    export ENVIRONMENT=$ENVIRONMENT
    export VERSION=$VERSION
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose down
    
    # Pull latest image
    pull_image
    
    # Start new deployment
    log_info "Starting new deployment..."
    if docker-compose up -d; then
        log_success "Deployment started successfully"
    else
        log_error "Failed to start deployment"
        rollback
        exit 1
    fi
    
    # Wait for containers to be ready
    log_info "Waiting for containers to be ready..."
    sleep 30
    
    # Perform health check
    if health_check; then
        log_success "Deployment completed successfully!"
        
        # Clean up old images
        log_info "Cleaning up old images..."
        docker image prune -f
        
        # Show deployment info
        log_info "Deployment Information:"
        echo "  Environment: $ENVIRONMENT"
        echo "  Version: $VERSION"
        echo "  Image: $FULL_IMAGE_NAME"
        echo "  Health Check URL: http://localhost:3000/api/health"
        echo "  Application URL: http://localhost:3000"
        
    else
        log_error "Health check failed, rolling back..."
        rollback
        exit 1
    fi
}

# Main deployment process
main() {
    log_info "Starting MastroHub deployment process..."
    
    # Validate environment
    if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
        log_error "Invalid environment. Use 'staging' or 'production'"
        exit 1
    fi
    
    # Check prerequisites
    check_docker
    check_docker_compose
    
    # Create backup
    backup_deployment
    
    # Deploy
    deploy
    
    log_success "Deployment process completed!"
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; rollback; exit 1' INT TERM

# Run main function
main "$@"
