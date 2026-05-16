#!/usr/bin/env bash
set -euo pipefail

# Deploy Firestore rules to staging and production projects.
# Requires: firebase CLI authenticated (firebase login)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Deploying Firestore rules..."

echo "-> Deploying staging rules to project: trendaryo-automation-staging"
firebase deploy --only firestore:rules --project trendaryo-automation-staging --force || true

echo "-> Deploying production rules to project: trendaryo-automation-prod"
firebase deploy --only firestore:rules --project trendaryo-automation-prod --force || true

echo "Done. If any deploy failed, inspect CLI output and re-run the script." 
