#!/bin/bash

echo ""
echo "=========================================="
echo "  Citizen Fraud Shield - Full Stack Start"
echo "=========================================="
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT

echo "Starting Backend..."
(cd backend && pip3 install -q -r requirements.txt 2>/dev/null && python3 app.py) &
BACKEND_PID=$!

sleep 6

echo "Starting Frontend..."
(cd citizen-fraud-shield && npm install --silent 2>/dev/null && npm run dev) &
FRONTEND_PID=$!

wait
