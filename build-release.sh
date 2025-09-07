#!/bin/bash

# VideoSpeedControl Chrome Extension Release Builder
# 视频速度控制 Chrome扩展发布构建脚本

set -e  # Exit on any error

echo "🚀 VideoSpeedControl Chrome Extension Release Builder"
echo "=================================================="

# Configuration
PROJECT_NAME="VideoSpeedControl"
VERSION="1.0.0"
BUILD_DIR="build"
RELEASE_DIR="release"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_NAME="${PROJECT_NAME}_v${VERSION}_${TIMESTAMP}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -f "manifest.json" ]; then
        log_error "manifest.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Check required tools
    command -v python >/dev/null 2>&1 || { log_error "Python is required but not installed. Aborting."; exit 1; }
    command -v node >/dev/null 2>&1 || { log_error "Node.js is required but not installed. Aborting."; exit 1; }
    
    log_success "Prerequisites check passed"
}

# Validate files
validate_files() {
    log_info "Validating project files..."
    
    # Validate JSON files
    python -m json.tool manifest.json > /dev/null || { log_error "manifest.json is invalid"; exit 1; }
    python -m json.tool _locales/en/messages.json > /dev/null || { log_error "English locale file is invalid"; exit 1; }
    python -m json.tool _locales/zh_CN/messages.json > /dev/null || { log_error "Chinese locale file is invalid"; exit 1; }
    
    # Validate JavaScript files
    node -c content/content.js || { log_error "content.js has syntax errors"; exit 1; }
    node -c popup/popup.js || { log_error "popup.js has syntax errors"; exit 1; }
    node -c background/background.js || { log_error "background.js has syntax errors"; exit 1; }
    
    log_success "File validation passed"
}

# Check for required assets
check_assets() {
    log_info "Checking required assets..."
    
    # Check for icon files
    MISSING_ICONS=0
    for size in 16 32 48 128; do
        if [ ! -f "assets/icons/icon${size}.png" ]; then
            log_warning "Missing icon: assets/icons/icon${size}.png"
            MISSING_ICONS=1
        fi
    done
    
    if [ $MISSING_ICONS -eq 1 ]; then
        log_warning "Some icon files are missing. Please generate them from SVG sources."
        log_info "You can continue building, but the extension may not load properly in Chrome."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Build cancelled. Please generate missing icon files first."
            exit 1
        fi
    else
        log_success "All icon files found"
    fi
    
    # Check for WXQR.jpg
    if [ ! -f "assets/images/WXQR.jpg" ]; then
        log_warning "WXQR.jpg not found in assets/images/. Support page QR code will not display."
    else
        log_success "WXQR.jpg found in assets/images/"
    fi
}

# Clean previous builds
clean_build() {
    log_info "Cleaning previous builds..."
    
    rm -rf "$BUILD_DIR"
    rm -rf "$RELEASE_DIR"
    
    log_success "Build directories cleaned"
}

# Create build directory structure
create_build_structure() {
    log_info "Creating build directory structure..."
    
    mkdir -p "$BUILD_DIR"
    mkdir -p "$RELEASE_DIR"
    
    log_success "Build structure created"
}

# Copy core extension files
copy_core_files() {
    log_info "Copying core extension files..."
    
    # Copy manifest
    cp manifest.json "$BUILD_DIR/"
    
    # Copy directories
    cp -r popup "$BUILD_DIR/"
    cp -r content "$BUILD_DIR/"
    cp -r background "$BUILD_DIR/"
    cp -r _locales "$BUILD_DIR/"
    cp -r assets "$BUILD_DIR/"
    
    # Copy support page and QR code
    cp support.html "$BUILD_DIR/"
    # WXQR.jpg is already included in assets/images/ directory copy
    
    log_success "Core files copied"
}

# Copy documentation (optional for release)
copy_documentation() {
    log_info "Copying documentation..."
    
    # Copy key documentation files
    cp README.md "$BUILD_DIR/"
    cp CLAUDE.md "$BUILD_DIR/"
    cp -r docs "$BUILD_DIR/" 2>/dev/null || true
    
    # Copy test files for development builds
    cp -r tests "$BUILD_DIR/" 2>/dev/null || true
    
    log_success "Documentation copied"
}

# Clean unnecessary files from build
clean_build_files() {
    log_info "Cleaning unnecessary files from build..."
    
    # Remove development files
    find "$BUILD_DIR" -name "*.md" -type f -delete 2>/dev/null || true
    find "$BUILD_DIR" -name ".DS_Store" -delete 2>/dev/null || true
    find "$BUILD_DIR" -name "Thumbs.db" -delete 2>/dev/null || true
    
    # Remove test files from production build
    rm -rf "$BUILD_DIR/tests" 2>/dev/null || true
    
    # Remove store materials (not needed in extension package)
    rm -rf "$BUILD_DIR/store" 2>/dev/null || true
    rm -rf "$BUILD_DIR/docs" 2>/dev/null || true
    
    log_success "Unnecessary files cleaned"
}

# Validate build
validate_build() {
    log_info "Validating build..."
    
    # Check essential files exist
    ESSENTIAL_FILES=(
        "manifest.json"
        "popup/popup.html"
        "popup/popup.js"
        "popup/popup.css"
        "content/content.js"
        "background/background.js"
        "_locales/en/messages.json"
        "_locales/zh_CN/messages.json"
        "support.html"
    )
    
    for file in "${ESSENTIAL_FILES[@]}"; do
        if [ ! -f "$BUILD_DIR/$file" ]; then
            log_error "Essential file missing in build: $file"
            exit 1
        fi
    done
    
    # Validate manifest in build
    python -m json.tool "$BUILD_DIR/manifest.json" > /dev/null || { 
        log_error "Build manifest.json is invalid"; 
        exit 1; 
    }
    
    log_success "Build validation passed"
}

# Create release package
create_package() {
    log_info "Creating release package..."
    
    # Create ZIP package for Chrome Web Store
    cd "$BUILD_DIR"
    zip -r "../$RELEASE_DIR/${RELEASE_NAME}.zip" . -x "*.DS_Store" "*/Thumbs.db"
    cd ..
    
    # Create development package (includes docs and tests)
    if [ -d "docs" ] || [ -d "tests" ]; then
        log_info "Creating development package..."
        cp -r docs "$BUILD_DIR/" 2>/dev/null || true
        cp -r tests "$BUILD_DIR/" 2>/dev/null || true
        cp *.md "$BUILD_DIR/" 2>/dev/null || true
        
        cd "$BUILD_DIR"
        zip -r "../$RELEASE_DIR/${RELEASE_NAME}_dev.zip" . -x "*.DS_Store" "*/Thumbs.db"
        cd ..
    fi
    
    log_success "Release packages created"
}

# Generate release info
generate_release_info() {
    log_info "Generating release information..."
    
    cat > "$RELEASE_DIR/RELEASE_INFO.txt" << EOF
VideoSpeedControl Chrome Extension Release
==========================================

Release Information:
- Version: $VERSION
- Build Date: $(date)
- Build ID: $TIMESTAMP
- Release Name: $RELEASE_NAME

Files in this release:
- ${RELEASE_NAME}.zip (Production package for Chrome Web Store)
- ${RELEASE_NAME}_dev.zip (Development package with docs and tests)

Installation Instructions:
1. Unzip the package
2. Open Chrome and go to chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked" and select the unzipped folder

Chrome Web Store Submission:
- Use the production package (${RELEASE_NAME}.zip)
- Upload to Chrome Developer Dashboard
- Fill in store listing information
- Submit for review

Support:
- GitHub: https://github.com/yourusername/video-speed-control
- Issues: https://github.com/yourusername/video-speed-control/issues

EOF
    
    log_success "Release information generated"
}

# Display build summary
display_summary() {
    echo
    echo "🎉 Build Complete!"
    echo "=================="
    echo
    log_success "Release packages created in '$RELEASE_DIR/' directory:"
    ls -la "$RELEASE_DIR/"
    echo
    log_info "Package sizes:"
    du -h "$RELEASE_DIR"/*.zip
    echo
    log_info "Next steps:"
    echo "  1. Test the extension by loading $BUILD_DIR/ in Chrome"
    echo "  2. Generate missing icon files if any warnings were shown"
    echo "  3. Upload ${RELEASE_NAME}.zip to Chrome Web Store"
    echo "  4. Submit for review"
    echo
    log_success "Build completed successfully! 🚀"
}

# Main build process
main() {
    echo "Starting build process..."
    echo
    
    check_prerequisites
    validate_files
    check_assets
    clean_build
    create_build_structure
    copy_core_files
    copy_documentation
    clean_build_files
    validate_build
    create_package
    generate_release_info
    display_summary
}

# Run main function
main "$@"