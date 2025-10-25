#!/bin/bash

# ==================== CONFIGURATION ====================
REPO_BASE_DIR="$HOME/tetrashop-projects"
LOG_FILE="$REPO_BASE_DIR/git_operations.log"

# لیست کامل مخازن مورد اشاره
declare -A REPOSITORIES=(
    ["tetrashop-final-optimized"]="https://github.com/your-username/tetrashop-final-optimized.git"
    ["ocr-system"]="https://github.com/your-username/ocr-system.git"
    ["natiq-mosatalah-web"]="https://github.com/your-username/natiq-mosatalah-web.git"
    ["intelligent-writer"]="https://github.com/your-username/intelligent-writer.git"
    ["Persian-Text-Analyzer"]="https://github.com/your-username/Persian-Text-Analyzer.git"
    ["Data-Processing-Pipeline"]="https://github.com/your-username/Data-Processing-Pipeline.git"
    ["universal-knowledge-olympic"]="https://github.com/your-username/universal-knowledge-olympic.git"
    ["tetra-ai-cloud"]="https://github.com/your-username/tetra-ai-cloud.git"
    ["tetra-chess-engine"]="https://github.com/your-username/tetra-chess-engine.git"
    ["tetra-speech-recognition"]="https://github.com/your-username/tetra-speech-recognition.git"
)

# مخازن وابستگی
declare -A DEPENDENCY_REPOS=(
    ["persian-nlp"]="https://github.com/your-username/persian-nlp.git"
    ["ai-models"]="https://github.com/your-username/ai-models.git"
    ["cloud-infrastructure"]="https://github.com/your-username/cloud-infrastructure.git"
    ["web-components"]="https://github.com/your-username/web-components.git"
)

# ==================== LOGGING FUNCTIONS ====================
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

log_success() {
    log_message "✅ $1"
}

log_error() {
    log_message "❌ $1"
}

log_warning() {
    log_message "⚠️ $1"
}

log_info() {
    log_message "ℹ️ $1"
}

# ==================== CORE FUNCTIONS ====================
create_base_directory() {
    log_info "Creating base directory: $REPO_BASE_DIR"
    mkdir -p "$REPO_BASE_DIR"
    cd "$REPO_BASE_DIR" || exit 1
}

check_git_installation() {
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed. Please install git first."
        exit 1
    fi
    log_success "Git is installed: $(git --version)"
}

clone_or_update_repo() {
    local repo_name="$1"
    local repo_url="$2"
    local repo_dir="$REPO_BASE_DIR/$repo_name"
    
    log_info "Processing repository: $repo_name"
    
    if [ -d "$repo_dir" ]; then
        log_info "Repository exists, updating..."
        cd "$repo_dir" || return 1
        
        # Check if directory is a git repository
        if [ -d ".git" ]; then
            # Get current branch
            current_branch=$(git branch --show-current 2>/dev/null || echo "main")
            
            # Stash any local changes
            if ! git diff-index --quiet HEAD --; then
                log_warning "Stashing local changes in $repo_name"
                git stash push -m "Auto-stash by git-manager $(date '+%Y-%m-%d %H:%M:%S')"
            fi
            
            # Pull latest changes
            if git pull origin "$current_branch"; then
                log_success "Successfully updated $repo_name"
                
                # Apply stashed changes if any
                if git stash list | grep -q "Auto-stash by git-manager"; then
                    git stash pop
                    log_success "Restored stashed changes in $repo_name"
                fi
            else
                log_error "Failed to update $repo_name"
                return 1
            fi
        else
            log_error "$repo_dir exists but is not a git repository"
            return 1
        fi
    else
        log_info "Cloning new repository: $repo_name"
        if git clone "$repo_url" "$repo_dir"; then
            log_success "Successfully cloned $repo_name"
        else
            log_error "Failed to clone $repo_name"
            return 1
        fi
    fi
    
    return 0
}

commit_changes() {
    local repo_dir="$1"
    local commit_message="$2"
    
    cd "$repo_dir" || return 1
    
    if ! git diff-index --quiet HEAD --; then
        log_info "Changes detected in $(basename "$repo_dir"), committing..."
        
        git add .
        
        if git commit -m "$commit_message"; then
            log_success "Committed changes in $(basename "$repo_dir")"
            return 0
        else
            log_error "Failed to commit changes in $(basename "$repo_dir")"
            return 1
        fi
    else
        log_info "No changes to commit in $(basename "$repo_dir")"
        return 0
    fi
}

push_changes() {
    local repo_dir="$1"
    
    cd "$repo_dir" || return 1
    
    local current_branch=$(git branch --show-current)
    
    log_info "Pushing changes in $(basename "$repo_dir") to $current_branch"
    
    if git push origin "$current_branch"; then
        log_success "Successfully pushed $(basename "$repo_dir")"
        return 0
    else
        log_error "Failed to push $(basename "$repo_dir")"
        return 1
    fi
}

setup_remote_tracking() {
    local repo_dir="$1"
    local repo_name="$2"
    
    cd "$repo_dir" || return 1
    
    # Check if remote is set correctly
    local current_remote=$(git remote get-url origin 2>/dev/null || echo "")
    local expected_remote="${REPOSITORIES[$repo_name]}"
    
    if [ -z "$expected_remote" ]; then
        expected_remote="${DEPENDENCY_REPOS[$repo_name]}"
    fi
    
    if [ "$current_remote" != "$expected_remote" ] && [ -n "$expected_remote" ]; then
        log_warning "Remote URL mismatch for $repo_name. Updating..."
        git remote set-url origin "$expected_remote" || git remote add origin "$expected_remote"
        log_success "Updated remote for $repo_name"
    fi
}

create_branch_if_not_exists() {
    local repo_dir="$1"
    local branch_name="$2"
    
    cd "$repo_dir" || return 1
    
    if ! git show-ref --verify --quiet "refs/heads/$branch_name"; then
        log_info "Creating new branch: $branch_name in $(basename "$repo_dir")"
        git checkout -b "$branch_name"
    else
        git checkout "$branch_name"
    fi
}

# ==================== WORKFLOW FUNCTIONS ====================
sync_all_repositories() {
    log_info "Starting synchronization of all repositories..."
    
    local success_count=0
    local total_count=0
    
    # Sync main repositories
    for repo in "${!REPOSITORIES[@]}"; do
        ((total_count++))
        if clone_or_update_repo "$repo" "${REPOSITORIES[$repo]}"; then
            setup_remote_tracking "$REPO_BASE_DIR/$repo" "$repo"
            ((success_count++))
        fi
    done
    
    # Sync dependency repositories
    for repo in "${!DEPENDENCY_REPOS[@]}"; do
        ((total_count++))
        if clone_or_update_repo "$repo" "${DEPENDENCY_REPOS[$repo]}"; then
            setup_remote_tracking "$REPO_BASE_DIR/$repo" "$repo"
            ((success_count++))
        fi
    done
    
    log_success "Synchronization completed: $success_count/$total_count repositories successful"
}

commit_all_changes() {
    local commit_message="${1:-"Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"}"
    
    log_info "Starting auto-commit process..."
    
    local commit_count=0
    
    for repo in "${!REPOSITORIES[@]}"; do
        repo_dir="$REPO_BASE_DIR/$repo"
        if [ -d "$repo_dir" ]; then
            if commit_changes "$repo_dir" "$commit_message"; then
                ((commit_count++))
            fi
        fi
    done
    
    for repo in "${!DEPENDENCY_REPOS[@]}"; do
        repo_dir="$REPO_BASE_DIR/$repo"
        if [ -d "$repo_dir" ]; then
            if commit_changes "$repo_dir" "$commit_message"; then
                ((commit_count++))
            fi
        fi
    done
    
    log_success "Auto-commit completed: $commit_count repositories had changes"
}

push_all_changes() {
    log_info "Starting auto-push process..."
    
    local push_count=0
    local total_count=0
    
    for repo in "${!REPOSITORIES[@]}"; do
        repo_dir="$REPO_BASE_DIR/$repo"
        if [ -d "$repo_dir" ]; then
            ((total_count++))
            if push_changes "$repo_dir"; then
                ((push_count++))
            fi
        fi
    done
    
    for repo in "${!DEPENDENCY_REPOS[@]}"; do
        repo_dir="$REPO_BASE_DIR/$repo"
        if [ -d "$repo_dir" ]; then
            ((total_count++))
            if push_changes "$repo_dir"; then
                ((push_count++))
            fi
        fi
    done
    
    log_success "Auto-push completed: $push_count/$total_count repositories pushed successfully"
}

create_unified_branch() {
    local branch_name="${1:-"feature/unified-cloud-integration"}"
    
    log_info "Creating unified branch: $branch_name across all repositories"
    
    for repo in "${!REPOSITORIES[@]}"; do
        repo_dir="$REPO_BASE_DIR/$repo"
        if [ -d "$repo_dir" ]; then
            if create_branch_if_not_exists "$repo_dir" "$branch_name"; then
                log_success "Created/checked out branch in $repo"
            fi
        fi
    done
}

status_report() {
    log_info "Generating status report for all repositories..."
    
    echo ""
    echo "📊 REPOSITORY STATUS REPORT"
    echo "================================"
    
    for repo in "${!REPOSITORIES[@]}"; do
        repo_dir="$REPO_BASE_DIR/$repo"
        echo ""
        echo "Repository: $repo"
        echo "Directory: $repo_dir"
        
        if [ -d "$repo_dir" ]; then
            cd "$repo_dir" || continue
            
            if [ -d ".git" ]; then
                local current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
                local commit_count=$(git rev-list --count HEAD 2>/dev/null || echo "0")
                local last_commit=$(git log -1 --format="%h - %s (%cr)" 2>/dev/null || echo "No commits")
                local status=$(git status --porcelain)
                
                echo "✅ Status: OK"
                echo "🌿 Branch: $current_branch"
                echo "📝 Commits: $commit_count"
                echo "🕐 Last commit: $last_commit"
                
                if [ -n "$status" ]; then
                    echo "📋 Changes: Uncommitted changes present"
                    echo "$status" | while read -r line; do
                        echo "   $line"
                    done
                else
                    echo "📋 Changes: Clean"
                fi
            else
                echo "❌ Status: Not a git repository"
            fi
        else
            echo "❌ Status: Directory not found"
        fi
    done
    
    echo ""
    echo "================================"
    log_success "Status report completed"
}

backup_repositories() {
    local backup_dir="$REPO_BASE_DIR/backup/$(date '+%Y-%m-%d_%H-%M-%S')"
    
    log_info "Creating backup in: $backup_dir"
    mkdir -p "$backup_dir"
    
    for repo in "${!REPOSITORIES[@]}"; do
        repo_dir="$REPO_BASE_DIR/$repo"
        if [ -d "$repo_dir" ]; then
            log_info "Backing up $repo..."
            cp -r "$repo_dir" "$backup_dir/" 2>/dev/null
        fi
    done
    
    # Backup log file
    cp "$LOG_FILE" "$backup_dir/" 2>/dev/null
    
    log_success "Backup completed: $backup_dir"
}

# ==================== MAIN EXECUTION ====================
main() {
    local command="${1:-help}"
    
    # Initialize
    check_git_installation
    create_base_directory
    
    case $command in
        "sync")
            sync_all_repositories
            ;;
        "commit")
            commit_all_changes "$2"
            ;;
        "push")
            push_all_changes
            ;;
        "full-sync")
            sync_all_repositories
            commit_all_changes "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
            push_all_changes
            ;;
        "branch")
            create_unified_branch "$2"
            ;;
        "status")
            status_report
            ;;
        "backup")
            backup_repositories
            ;;
        "setup")
            sync_all_repositories
            create_unified_branch "develop"
            status_report
            ;;
        "help"|*)
            echo "🚀 TetraShop Git Manager - Complete Repository Management"
            echo "========================================================="
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  sync         - Sync all repositories (pull latest changes)"
            echo "  commit [msg] - Commit changes in all repositories"
            echo "  push         - Push changes in all repositories"
            echo "  full-sync    - Sync, commit, and push all repositories"
            echo "  branch [name]- Create unified branch across repositories"
            echo "  status       - Generate detailed status report"
            echo "  backup       - Create backup of all repositories"
            echo "  setup        - Initial setup (sync + create branch + status)"
            echo "  help         - Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 sync"
            echo "  $0 commit \"Add cloud integration features\""
            echo "  $0 full-sync"
            echo "  $0 branch feature/cloud-unification"
            echo ""
            ;;
    esac
    
    log_info "Git manager execution completed: $command"
}

# Run main function with all arguments
main "$@"
