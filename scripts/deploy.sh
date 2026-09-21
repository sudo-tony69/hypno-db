#!/usr/bin/env bash

set -e

SOURCE_BRANCH="master"
DEPLOY_BRANCH="prod"

REPO_ROOT="$(git rev-parse --show-toplevel)"
TEMP_DIR="$(mktemp -d)"

cleanup() {
    rm -rf "$TEMP_DIR"
}

trap cleanup EXIT

echo "🚀 Starting production deployment..."

# Make sure we're on master
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "❌ Run deployment from $SOURCE_BRANCH."
    echo "   Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Make sure master is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ You have uncommitted changes."
    echo "   Commit them before deploying."
    exit 1
fi

# Build
echo "📦 Building production..."

npm run build

# Save build outside repository
echo "📋 Saving build..."

cp -R dist/. "$TEMP_DIR/"

# Switch to prod
echo "🌿 Switching to $DEPLOY_BRANCH..."

git checkout "$DEPLOY_BRANCH"

# Remove everything except .git
echo "🧹 Cleaning production branch..."

find "$REPO_ROOT" -mindepth 1 -maxdepth 1 \
    ! -name '.git' \
    -exec rm -rf {} +

# Copy build to root
echo "📂 Publishing build..."

cp -R "$TEMP_DIR"/. "$REPO_ROOT/"

# Commit
echo "💾 Creating deployment commit..."

git add -A

if git diff --cached --quiet; then
    echo "ℹ️ No changes to deploy."
else
    git commit -m "Deploy production build"
    git push origin "$DEPLOY_BRANCH"
fi

# Return to master
echo "🌿 Returning to $SOURCE_BRANCH..."

git checkout "$SOURCE_BRANCH"

echo ""
echo "✅ Production deployment complete!"
