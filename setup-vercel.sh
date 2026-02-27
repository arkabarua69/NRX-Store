#!/bin/bash

# Nrx Store - Vercel Setup Script
# This script helps you set up environment variables for Vercel deployment

echo "🚀 Nrx Store - Vercel Setup Script"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}Step 1: Supabase Configuration${NC}"
echo "================================"
read -p "Enter your Supabase URL: " SUPABASE_URL
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY

echo ""
echo -e "${BLUE}Step 2: Backend API Configuration${NC}"
echo "=================================="
read -p "Enter your Backend API URL (e.g., https://your-app.railway.app/api): " API_URL

echo ""
echo -e "${BLUE}Step 3: Setting up Vercel environment variables...${NC}"
cd frontend

# Set environment variables in Vercel
vercel env add VITE_SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add VITE_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
vercel env add VITE_API_URL production <<< "$API_URL"

echo ""
echo -e "${GREEN}✅ Environment variables set successfully!${NC}"
echo ""
echo -e "${BLUE}Step 4: Creating local .env file...${NC}"

cat > .env << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
VITE_API_URL=$API_URL
EOF

echo -e "${GREEN}✅ Local .env file created!${NC}"
echo ""
echo -e "${BLUE}Step 5: Ready to deploy!${NC}"
echo ""
echo "Run these commands to deploy:"
echo -e "${YELLOW}  cd frontend${NC}"
echo -e "${YELLOW}  vercel --prod${NC}"
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
