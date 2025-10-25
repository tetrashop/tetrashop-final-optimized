#!/bin/bash

# اسکریپت همگام‌سازی خودکار مخازن
AUTO_SYNC_LOG="$HOME/tetrashop-projects/logs/auto-sync.log"

log_auto() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$AUTO_SYNC_LOG"
}

sync_with_retry() {
    local max_retries=3
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        if ./git-manager.sh full-sync; then
            log_auto "✅ Auto-sync completed successfully"
            return 0
        else
            ((retry_count++))
            log_auto "⚠️ Sync failed (attempt $retry_count/$max_retries), retrying..."
            sleep 10
        fi
    done
    
    log_auto "❌ Auto-sync failed after $max_retries attempts"
    return 1
}

continuous_sync() {
    local interval=${1:-3600} # Default 1 hour
    
    log_auto "🔄 Starting continuous sync every $interval seconds"
    
    while true; do
        sync_with_retry
        log_auto "⏰ Next sync in $interval seconds..."
        sleep $interval
    done
}

on_change_sync() {
    # این تابع نیاز به inotify-tools دارد
    if ! command -v inotifywait &> /dev/null; then
        echo "❌ inotify-tools is not installed. Please install it first."
        exit 1
    fi
    
    log_auto "👀 Starting filesystem monitoring for changes"
    
    while true; do
        inotifywait -r -e modify,create,delete "$HOME/tetrashop-projects" --exclude '\.git'
        log_auto "📁 File changes detected, starting sync..."
        sync_with_retry
    done
}

case "${1:-continuous}" in
    "continuous")
        continuous_sync "$2"
        ;;
    "on-change")
        on_change_sync
        ;;
    "single")
        sync_with_retry
        ;;
    *)
        echo "Usage: $0 {continuous|on-change|single} [interval]"
        echo "Examples:"
        echo "  $0 continuous 3600    # Sync every hour"
        echo "  $0 on-change          # Sync on file changes"
        echo "  $0 single             # Single sync operation"
        ;;
esac
