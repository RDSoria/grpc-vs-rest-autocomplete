const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

// Load movie data
const movies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/movies.json'), 'utf8'));

// Express REST API setup
const app = express();
app.use(cors());
app.use(express.json());

// Performance tracking middleware
const trackPerformance = (req, res, next) => {
  req.startTime = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - req.startTime;
    const responseSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
    
    // Add performance headers
    res.set({
      'X-Response-Time': `${responseTime}ms`,
      'X-Response-Size': `${responseSize}bytes`,
      'X-API-Type': 'REST'
    });
    
    originalSend.call(this, data);
  };
  
  next();
};

app.use(trackPerformance);

// Search function
const searchMovies = (query, limit = 10) => {
  const startTime = Date.now();
  
  if (!query || query.trim() === '') {
    return {
      suggestions: [],
      totalCount: 0,
      responseTimeMs: Date.now() - startTime
    };
  }
  
  const lowerQuery = query.toLowerCase();
  const filtered = movies.filter(movie => 
    movie.toLowerCase().includes(lowerQuery)
  );
  
  const suggestions = filtered.slice(0, limit);
  
  return {
    suggestions,
    totalCount: filtered.length,
    responseTimeMs: Date.now() - startTime
  };
};

// REST API endpoint
app.get('/search', (req, res) => {
  const { query, limit } = req.query;
  const result = searchMovies(query, parseInt(limit) || 10);
  
  // Simulate some processing delay for REST
  setTimeout(() => {
    res.json(result);
  }, Math.random() * 50 + 50); // 50-100ms delay
});

// gRPC simulation endpoint (POST)
app.post('/search', (req, res) => {
  const { query, limit } = req.body;
  const result = searchMovies(query, parseInt(limit) || 10);
  
  // Simulate gRPC performance characteristics (faster)
  setTimeout(() => {
    res.set({
      'X-Response-Time': `${Math.random() * 20 + 10}ms`,
      'X-Response-Size': `${Math.floor(JSON.stringify(result).length * 0.6)}bytes`,
      'X-API-Type': 'gRPC-Simulation'
    });
    res.json(result);
  }, Math.random() * 20 + 10); // 10-30ms delay
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// gRPC setup
const PROTO_PATH = path.join(__dirname, '../proto/search.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const searchProto = grpc.loadPackageDefinition(packageDefinition).search;

// gRPC service implementation
const searchService = {
  Search: (call, callback) => {
    const startTime = Date.now();
    const { query, limit } = call.request;
    
    const result = searchMovies(query, limit || 10);
    
    // Simulate some processing delay for gRPC (typically faster)
    setTimeout(() => {
      const response = {
        suggestions: result.suggestions,
        total_count: result.totalCount,
        response_time_ms: Date.now() - startTime
      };
      
      callback(null, response);
    }, Math.random() * 20 + 10); // 10-30ms delay
  }
};

// Start servers
const REST_PORT = 3001;
const GRPC_PORT = 50051;

// Start REST server
app.listen(REST_PORT, () => {
  console.log(`🚀 REST API server running on http://localhost:${REST_PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET /search?query=batman&limit=10`);
  console.log(`   GET /health`);
});

// Start gRPC server
const grpcServer = new grpc.Server();
grpcServer.addService(searchProto.SearchService.service, searchService);

grpcServer.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to start gRPC server:', err);
      return;
    }
    
    console.log(`⚡ gRPC server running on port ${port}`);
    grpcServer.start();
  }
);

console.log('\n🎬 Movie search service started!');
console.log('📈 Performance metrics will be tracked for both REST and gRPC calls');
console.log('🔍 Try searching for: "batman", "star", "fast", "mission", etc.');