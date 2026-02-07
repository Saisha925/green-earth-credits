#!/bin/bash

# Start Development Servers for Green Earth Credits
# This script starts both the frontend (Vite) and backend (Express) servers

echo "=========================================="
echo "Green Earth Credits - Development Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js is installed: $(node --version)"
echo ""

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    npm install
    echo ""
fi

# Install backend dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    cd server
    npm install
    cd ..
    echo ""
fi

# Create backend .env if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo -e "${BLUE}Creating server/.env from template...${NC}"
    cp server/.env.example server/.env
    echo -e "${GREEN}✓ Created server/.env${NC}"
    echo "  Please update with your Razorpay credentials if needed"
    echo ""
fi

echo -e "${GREEN}=========================================="
echo "Starting Development Servers..."
echo "==========================================${NC}"
echo ""

# Start both servers in parallel
echo -e "${BLUE}Starting Frontend on http://localhost:5173${NC}"
echo -e "${BLUE}Starting Backend on http://localhost:5000${NC}"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Run both in background, but wait for them
(npm run dev) &
FRONTEND_PID=$!

(cd server && npm run dev) &
BACKEND_PID=$!

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
