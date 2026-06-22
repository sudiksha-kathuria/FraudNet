#!/bin/bash

# Start Both Frontend and Backend Services
# Run this from the project root directory

echo ""
echo "=========================================="
echo "  Citizen Fraud Shield - Full Stack Start"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not installed. Please install Node.js first."
    exit 1
fi
echo "OK: Node.js installed"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python not installed. Please install Python 3.8+"
    exit 1
fi
echo "OK: Python installed"

echo ""
echo "=========================================="
echo "Starting Services..."
echo "=========================================="
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Start Backend in background
echo "Starting Backend Server..."
(
    cd backend
    python3 -m venv venv 2>/dev/null
    source venv/bin/activate
    pip install -q -r requirements.txt 2>/dev/null
    python3 app.py
) &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend in background
echo "Starting Frontend Server..."
(
    npm install -q
    npm run dev
) &
FRONTEND_PID=$!

# Wait for both to start
sleep 5

echo ""
echo "=========================================="
echo "Services Starting Up..."
echo "=========================================="
echo ""
echo "Backend should be ready at:"
echo "  http://localhost:8000"
echo "  http://localhost:8000/health"
echo ""
echo "Frontend should be ready at:"
echo "  http://localhost:5173"
echo ""
echo "Verification:"
echo "  node verify-connection.js"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
