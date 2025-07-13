#!/bin/bash

# Setup script for real gRPC implementation

echo "🔧 Setting up real gRPC implementation..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    echo "   You can download Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker is running"

# Start Envoy proxy
echo "🚀 Starting Envoy proxy..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ Envoy proxy started successfully on port 8080"
    echo "📊 Envoy admin interface available at http://localhost:9901"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Make sure your backend server is running (npm run dev)"
    echo "   2. The React app will now use real gRPC calls through Envoy"
    echo "   3. Open http://localhost:3000 to test the application"
    echo ""
    echo "🔍 To stop Envoy: docker-compose down"
else
    echo "❌ Failed to start Envoy proxy"
    exit 1
fi