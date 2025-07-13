# 📊 gRPC vs REST Auto-Complete Performance Comparison

A comprehensive performance comparison dashboard between gRPC and REST APIs for auto-complete search functionality, featuring real-time metrics visualization and interactive charts.

## 🚀 Features

### Backend (Node.js)
- **REST API**: Traditional HTTP/JSON endpoint (`GET /search?query=batman`)
- **gRPC API**: High-performance Protocol Buffers over HTTP/2
- **Performance Tracking**: Real-time metrics collection for both protocols
- **Movie Dataset**: 100+ popular movies for realistic search testing

### Frontend (React)
- **Dual Search Interface**: Side-by-side REST and gRPC results
- **Real-time Metrics**: Live performance comparison table
- **Interactive Charts**: Line and bar charts using Recharts
- **Performance History**: Track metrics over multiple searches
- **Responsive Design**: Modern, mobile-friendly UI

### Key Metrics Tracked
- ⏱️ **Request Latency** (ms)
- 📦 **Payload Size** (bytes) 
- 🚀 **Time to First Byte** (ms)
- 📈 **Requests Per Minute**

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express (REST API)
- @grpc/grpc-js (gRPC server)
- Protocol Buffers
- CORS enabled

**Frontend:**
- React 18
- Recharts (data visualization)
- Modern CSS with gradients and animations
- Responsive grid layouts

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with developer tools

## 🚀 Quick Start

### Option 1: Simulation Mode (Default)

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd grpc-vs-rest-autocomplete
   npm install
   cd client && npm install && cd ..
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```
   This will start:
   - Backend server on `http://localhost:3001`
   - gRPC server on port `50051`
   - React frontend on `http://localhost:3000`

3. **Open your browser:**
   Navigate to `http://localhost:3000` and start searching!

### Option 2: Real gRPC Implementation

1. **Prerequisites:**
   - Docker Desktop installed and running
   - All dependencies from Option 1

2. **Setup gRPC-web:**
   ```bash
   # Install gRPC-web dependencies (already done if you followed Option 1)
   cd client && npm install grpc-web google-protobuf && cd ..
   
   # Generate gRPC-web client files (already generated)
   npm run proto:web
   ```

3. **Start with real gRPC:**
   ```bash
   # Start Envoy proxy
   npm run setup:grpc
   
   # Start development servers
   npm run dev
   ```
   
   This will start:
   - Backend server with gRPC on `http://localhost:3001` and port `50051`
   - Envoy proxy on `http://localhost:8080` (gRPC-web bridge)
   - React frontend on `http://localhost:3000` (using real gRPC calls)

4. **Stop services:**
   ```bash
   npm run envoy:stop  # Stop Envoy proxy
   # Use Ctrl+C to stop dev servers
   ```

### Alternative: Start Services Separately

```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run client
```

## 🔍 Usage

1. **Open the Dashboard**: Navigate to http://localhost:3000
2. **Search for Movies**: Try queries like "batman", "star wars", "fast", "mission"
3. **Compare Performance**: Watch real-time metrics in the comparison table
4. **Analyze Trends**: View performance history in interactive charts
5. **Toggle APIs**: Enable/disable REST or gRPC to test individually

## 📊 Performance Insights

### Simulation Mode vs Real gRPC Mode

**Simulation Mode (Default):**
- Uses HTTP/JSON to simulate gRPC characteristics
- Faster setup, no Docker required
- Educational demonstration of performance differences
- Simulated metrics based on typical gRPC vs REST patterns

**Real gRPC Mode:**
- Actual gRPC-web calls through Envoy proxy
- True binary protobuf serialization
- Real network performance measurements
- Authentic gRPC streaming and error handling

### Expected Results
- **gRPC Latency**: ~10-30ms (typically 60-80% faster)
- **REST Latency**: ~50-100ms
- **gRPC Payload**: ~40% smaller due to Protocol Buffers
- **REST Payload**: Larger JSON responses

### Performance Comparison Results

When running the application, you should observe:

**gRPC advantages:**
- Lower latency (typically 2-4x faster)
- Smaller payload sizes (binary protobuf vs JSON)
- Better throughput for high-frequency requests
- More efficient network utilization

**REST advantages:**
- Simpler debugging (human-readable JSON)
- Better browser dev tools support
- Wider ecosystem compatibility
- No proxy requirements

**Real-world factors:**
- Network conditions affect both protocols
- gRPC shines in microservice communication
- REST remains king for public APIs
- gRPC-web adds some overhead compared to native gRPC

### Chrome DevTools Inspection
1. Open DevTools (F12) → Network tab
2. Perform searches and observe:
   - **REST**: XHR requests with JSON payloads
   - **gRPC**: More efficient binary protocol over HTTP/2
   - **Size Comparison**: gRPC typically shows smaller transfer sizes
   - **Timing**: gRPC generally shows faster response times

## 🏗️ Project Structure

```
grpc-vs-rest-autocomplete/
├── package.json                 # Root dependencies & scripts
├── proto/
│   └── search.proto            # gRPC service definition
├── server/
│   ├── index.js                # Main server (REST + gRPC)
│   └── data/
│       └── movies.json         # Movie dataset
└── client/
    ├── package.json            # React dependencies
    ├── public/
    │   └── index.html          # HTML template
    └── src/
        ├── App.js              # Main React component
        ├── components/
        │   ├── SearchInput.js   # Shared search input
        │   ├── RestResults.js   # REST results display
        │   ├── GrpcResults.js   # gRPC results display
        │   ├── ComparisonMetrics.js # Performance table
        │   └── PerformanceChart.js  # Charts visualization
        └── styles/             # CSS files
```

## 🎯 API Endpoints

### REST API
```http
GET /search?query=batman&limit=10
GET /health
```

### gRPC API
```protobuf
service SearchService {
  rpc Search(SearchRequest) returns (SearchResponse);
}
```

## 🔧 Development

### Adding New Movies
Edit `server/data/movies.json` to add more search data.

### Modifying gRPC Schema
1. Update `proto/search.proto`
2. Regenerate code: `npm run proto`
3. Update server implementation

### Customizing Metrics
Modify the performance tracking in `server/index.js` and update the frontend components accordingly.

## 📈 Performance Optimization Tips

1. **gRPC Advantages**:
   - Binary serialization (Protocol Buffers)
   - HTTP/2 multiplexing
   - Smaller payload sizes
   - Built-in compression

2. **REST Considerations**:
   - Human-readable JSON
   - Better caching support
   - Easier debugging
   - Wider ecosystem support

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on specific ports
   lsof -ti:3000 | xargs kill -9  # React dev server
   lsof -ti:3001 | xargs kill -9  # Express server
   lsof -ti:50051 | xargs kill -9 # gRPC server
   lsof -ti:8080 | xargs kill -9  # Envoy proxy
   ```

2. **Module not found errors**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   cd client && rm -rf node_modules package-lock.json && npm install
   ```

3. **Real gRPC Setup Issues**
   
   **Docker not running:**
   ```bash
   # Check Docker status
   docker info
   # Start Docker Desktop if needed
   ```
   
   **Envoy proxy connection failed:**
   ```bash
   # Check Envoy status
   docker-compose ps
   # View Envoy logs
   npm run envoy:logs
   # Restart Envoy
   npm run envoy:stop && npm run envoy:start
   ```
   
   **gRPC-web client errors:**
   ```bash
   # Regenerate client files
   npm run proto:web
   # Check if Envoy is accessible
   curl http://localhost:8080
   ```

4. **Simulation mode issues**
   - Ensure gRPC server is running on port 50051
   - Check firewall settings
   - Verify Protocol Buffers compilation

5. **Frontend Not Loading**
   - Clear browser cache
   - Check console for JavaScript errors
   - Ensure backend is running

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🎉 Acknowledgments

- Movie data curated from popular film databases
- Built with modern web technologies
- Inspired by real-world API performance challenges

---

**Happy Performance Testing! 🚀**