#!/bin/bash

# Script to deploy the dashboard with clickable links

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful. Ready to deploy."

  # For Vercel deployment
  echo "To deploy to Vercel:"
  echo "1. Run 'vercel' in your project directory"
  echo "2. Select the appropriate project and environment"
  echo "3. Deploy the changes"

  # For local testing
  echo ""
  echo "For local testing:"
  echo "1. Run 'npm run dev' to start the development server"
  echo "2. Open http://localhost:3000 in your browser"
  echo "3. Navigate to the dashboard to test the clickable links"

else
  echo "Build failed. Please check the errors above."
  exit 1
fi