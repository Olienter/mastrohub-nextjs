#!/bin/bash

# MastroHub Backup Script
# Usage: ./scripts/backup.sh [backup_type] [retention_days]

set -e

# Configuration
BACKUP_TYPE=${1:-full}
RETENTION_DAYS=${2:-30}
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${BACKUP_TYPE}_${DATE}"

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

# Create backup directory
create_backup_dir() {
    log_info "Creating backup directory..."
    mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
    log_success "Backup directory created: $BACKUP_DIR/$BACKUP_NAME"
}

# Database backup
backup_database() {
    log_info "Starting database backup..."
    
    # Check if PostgreSQL container is running
    if docker ps | grep -q postgres; then
        log_info "Backing up PostgreSQL database..."
        
        # Create database backup
        if docker exec mastrohub-nextjs_postgres_1 pg_dump -U mastrohub mastrohub > "$BACKUP_DIR/$BACKUP_NAME/database.sql"; then
            log_success "Database backup completed"
        else
            log_error "Database backup failed"
            return 1
        fi
        
        # Create database schema backup
        if docker exec mastrohub-nextjs_postgres_1 pg_dump -U mastrohub --schema-only mastrohub > "$BACKUP_DIR/$BACKUP_NAME/schema.sql"; then
            log_success "Database schema backup completed"
        else
            log_warning "Database schema backup failed"
        fi
    else
        log_warning "PostgreSQL container not running, skipping database backup"
    fi
}

# Redis backup
backup_redis() {
    log_info "Starting Redis backup..."
    
    # Check if Redis container is running
    if docker ps | grep -q redis; then
        log_info "Backing up Redis data..."
        
        # Trigger Redis backup
        if docker exec mastrohub-nextjs_redis_1 redis-cli BGSAVE; then
            log_success "Redis backup triggered"
            
            # Wait for backup to complete
            sleep 5
            
            # Copy Redis dump file
            if docker cp mastrohub-nextjs_redis_1:/data/dump.rdb "$BACKUP_DIR/$BACKUP_NAME/redis.rdb"; then
                log_success "Redis backup completed"
            else
                log_warning "Failed to copy Redis dump file"
            fi
        else
            log_warning "Redis backup failed"
        fi
    else
        log_warning "Redis container not running, skipping Redis backup"
    fi
}

# File backup
backup_files() {
    log_info "Starting file backup..."
    
    # Backup configuration files
    log_info "Backing up configuration files..."
    cp docker-compose.yml "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
    cp docker-compose.production.yml "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
    cp docker-compose.staging.yml "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
    cp nginx.conf "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
    
    # Backup environment files
    log_info "Backing up environment files..."
    cp .env* "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
    
    # Backup monitoring configuration
    log_info "Backing up monitoring configuration..."
    cp -r monitoring "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
    
    # Backup scripts
    log_info "Backing up scripts..."
    cp -r scripts "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true
    
    log_success "File backup completed"
}

# Application data backup
backup_app_data() {
    log_info "Starting application data backup..."
    
    # Backup uploads directory if it exists
    if [ -d "uploads" ]; then
        log_info "Backing up uploads directory..."
        tar -czf "$BACKUP_DIR/$BACKUP_NAME/uploads.tar.gz" uploads/
        log_success "Uploads backup completed"
    fi
    
    # Backup logs directory if it exists
    if [ -d "logs" ]; then
        log_info "Backing up logs directory..."
        tar -czf "$BACKUP_DIR/$BACKUP_NAME/logs.tar.gz" logs/
        log_success "Logs backup completed"
    fi
    
    # Backup SSL certificates if they exist
    if [ -d "ssl" ]; then
        log_info "Backing up SSL certificates..."
        tar -czf "$BACKUP_DIR/$BACKUP_NAME/ssl.tar.gz" ssl/
        log_success "SSL certificates backup completed"
    fi
}

# Create backup manifest
create_manifest() {
    log_info "Creating backup manifest..."
    
    cat > "$BACKUP_DIR/$BACKUP_NAME/manifest.txt" << EOF
MastroHub Backup Manifest
=========================
Backup Type: $BACKUP_TYPE
Date: $(date)
Timestamp: $DATE
Retention Days: $RETENTION_DAYS

Backup Contents:
$(ls -la "$BACKUP_DIR/$BACKUP_NAME/" | grep -v "^total")

System Information:
$(uname -a)

Docker Information:
$(docker version 2>/dev/null || echo "Docker not available")

Disk Usage:
$(df -h .)

EOF
    
    log_success "Backup manifest created"
}

# Compress backup
compress_backup() {
    log_info "Compressing backup..."
    
    cd "$BACKUP_DIR"
    if tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"; then
        log_success "Backup compressed: ${BACKUP_NAME}.tar.gz"
        
        # Remove uncompressed directory
        rm -rf "$BACKUP_NAME"
        
        # Update backup name
        BACKUP_NAME="${BACKUP_NAME}.tar.gz"
    else
        log_error "Backup compression failed"
        return 1
    fi
}

# Clean old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups (older than $RETENTION_DAYS days)..."
    
    # Find and remove old backup files
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "backup_*" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
    
    log_success "Old backups cleaned up"
}

# Verify backup
verify_backup() {
    log_info "Verifying backup..."
    
    local backup_file="$BACKUP_DIR/$BACKUP_NAME"
    
    if [ -f "$backup_file" ]; then
        # Check file size
        local size=$(du -h "$backup_file" | cut -f1)
        log_info "Backup size: $size"
        
        # Test archive integrity
        if tar -tzf "$backup_file" > /dev/null 2>&1; then
            log_success "Backup verification passed"
        else
            log_error "Backup verification failed"
            return 1
        fi
    else
        log_error "Backup file not found"
        return 1
    fi
}

# Main backup process
main() {
    log_info "Starting MastroHub backup process..."
    
    # Validate backup type
    if [[ ! "$BACKUP_TYPE" =~ ^(full|database|files|app)$ ]]; then
        log_error "Invalid backup type. Use 'full', 'database', 'files', or 'app'"
        exit 1
    fi
    
    # Create backup directory
    create_backup_dir
    
    # Perform backup based on type
    case $BACKUP_TYPE in
        "full")
            backup_database
            backup_redis
            backup_files
            backup_app_data
            ;;
        "database")
            backup_database
            backup_redis
            ;;
        "files")
            backup_files
            backup_app_data
            ;;
        "app")
            backup_app_data
            ;;
    esac
    
    # Create manifest
    create_manifest
    
    # Compress backup
    compress_backup
    
    # Verify backup
    verify_backup
    
    # Cleanup old backups
    cleanup_old_backups
    
    log_success "Backup process completed!"
    log_info "Backup location: $BACKUP_DIR/$BACKUP_NAME"
    log_info "Backup size: $(du -h "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)"
}

# Handle script interruption
trap 'log_error "Backup interrupted"; exit 1' INT TERM

# Run main function
main "$@"
