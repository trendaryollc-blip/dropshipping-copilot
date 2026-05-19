#!/usr/bin/env bash
BRANCH_NAME=${1:-launch-ready}
COMMIT_MSG=${2:-"chore: prepare project for launch (tests, README, Firestore mock, CI)"}

echo "Creating branch '$BRANCH_NAME' and committing prepared changes..."
git fetch origin
git checkout -b "$BRANCH_NAME"
git add -A
git commit -m "$COMMIT_MSG"

echo "Branch created and changes committed. To push and open a PR run:"
echo "git push -u origin $BRANCH_NAME"
