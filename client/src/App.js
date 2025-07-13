import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SearchInput from './components/SearchInput';
import RestResults from './components/RestResults';
import GrpcResults from './components/GrpcResults';
import ComparisonMetrics from './components/ComparisonMetrics';
import PerformanceChart from './components/PerformanceChart';
import grpcClient from './services/grpcClient';

function App() {
  const [query, setQuery] = useState('');
  const [restResults, setRestResults] = useState([]);
  const [grpcResults, setGrpcResults] = useState([]);
  const [restMetrics, setRestMetrics] = useState(null);
  const [grpcMetrics, setGrpcMetrics] = useState(null);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [isRestEnabled, setIsRestEnabled] = useState(true);
  const [isGrpcEnabled, setIsGrpcEnabled] = useState(true);
  const [useRealGrpc, setUseRealGrpc] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setRestResults([]);
      setGrpcResults([]);
      setRestMetrics(null);
      setGrpcMetrics(null);
      return;
    }

    const currentSearchId = Date.now();
    setSearchCount(prev => prev + 1);

    const promises = [];
    
    if (isRestEnabled) {
      promises.push(
        fetch(`/search?query=${encodeURIComponent(searchQuery)}&limit=10`)
          .then(async response => {
            const responseTime = parseInt(response.headers.get('X-Response-Time')) || 0;
            const responseSize = parseInt(response.headers.get('X-Response-Size')) || 0;
            const data = await response.json();
            
            return {
              type: 'REST',
              data,
              metrics: {
                requestLatency: responseTime,
                payloadSize: responseSize,
                timeToFirstByte: responseTime,
                requestsPerMinute: 60 // Simulated
              }
            };
          })
          .catch(error => {
            console.error('REST search failed:', error);
            return {
              type: 'REST',
              data: { suggestions: [], totalCount: 0 },
              metrics: {
                requestLatency: 0,
                payloadSize: 0,
                timeToFirstByte: 0,
                requestsPerMinute: 0
              }
            };
          })
      );
    }

    if (isGrpcEnabled) {
      if (useRealGrpc) {
        promises.push(
          grpcClient.search(searchQuery, 10)
            .then(result => {
              return {
                type: 'gRPC',
                data: {
                  suggestions: result.suggestions,
                  totalCount: result.totalCount,
                  responseTimeMs: result.responseTimeMs
                },
                metrics: result.metrics
              };
            })
            .catch(error => {
              console.error('Real gRPC search failed:', error);
              return {
                type: 'gRPC',
                data: { suggestions: [], totalCount: 0 },
                metrics: {
                  requestLatency: 0,
                  payloadSize: 0,
                  timeToFirstByte: 0,
                  requestsPerMinute: 0
                }
              };
            })
        );
      } else {
        promises.push(
          fetch('/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Type': 'gRPC-Simulation'
            },
            body: JSON.stringify({ query: searchQuery, limit: 10 })
          })
            .then(async response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              
              const responseTime = parseFloat(response.headers.get('X-Response-Time')) || Math.random() * 20 + 10;
              const responseSize = parseInt(response.headers.get('X-Response-Size')) || 0;
              const data = await response.json();
              
              return {
                type: 'gRPC',
                data,
                metrics: {
                  requestLatency: responseTime,
                  payloadSize: responseSize || Math.floor(JSON.stringify(data).length * 0.6),
                  timeToFirstByte: responseTime * 0.7,
                  requestsPerMinute: 15 // Simulated
                }
              };
            })
            .catch(error => {
              console.error('gRPC simulation failed:', error);
              return {
                type: 'gRPC',
                data: { suggestions: [], totalCount: 0 },
                metrics: {
                  requestLatency: 0,
                  payloadSize: 0,
                  timeToFirstByte: 0,
                  requestsPerMinute: 0
                }
              };
            })
        );
      }
    }

    try {
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        if (result.type === 'REST') {
          setRestResults(result.data.suggestions || []);
          setRestMetrics(result.metrics);
        } else if (result.type === 'gRPC') {
          setGrpcResults(result.data.suggestions || []);
          setGrpcMetrics(result.metrics);
        }
      });

      const historyEntry = {
        timestamp: currentSearchId,
        query: searchQuery,
        rest: results.find(r => r.type === 'REST')?.metrics,
        grpc: results.find(r => r.type === 'gRPC')?.metrics
      };

      setPerformanceHistory(prev => {
        const newHistory = [...prev, historyEntry].slice(-20);
        return newHistory;
      });

    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [isRestEnabled, isGrpcEnabled, useRealGrpc]);

  useEffect(() => {
    if (query.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [query, handleSearch]);

  return (
    <div className="App">
      <main className="App-main">
        <div className="two-column-layout">
          <div className="left-column">
            <header className="App-header">
              <h1>🚀 Visual Metrics Dashboard</h1>
              <p>Compare REST vs gRPC Performance in Real-Time</p>
            </header>
            {isGrpcEnabled && (
              <div className={`mode-info ${useRealGrpc ? 'real-grpc' : 'simulation'}`}>
                <div className="mode-status">
                  <span className="mode-label">
                    {useRealGrpc ? '🔗 Real gRPC Mode' : '🎭 Simulation Mode'}
                  </span>
                  <span className="mode-description">
                    {useRealGrpc 
                      ? 'Using actual gRPC-web calls through Envoy proxy'
                      : 'Using HTTP simulation of gRPC characteristics'
                    }
                  </span>
                </div>
                {useRealGrpc && (
                  <div className="setup-reminder">
                    <strong>⚠️ Setup Required:</strong> Make sure Envoy proxy is running on port 8080.
                    <br />
                    <code>npm run setup:grpc</code> or <code>docker-compose up -d</code>
                  </div>
                )}
              </div>
            )}

            <div className="search-section">
              <SearchInput 
                value={query} 
                onChange={setQuery} 
                placeholder="Search for movies (try 'batman', 'star wars', 'fast')..."
              />
              
              <div className="api-toggles">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isRestEnabled}
                    onChange={(e) => setIsRestEnabled(e.target.checked)}
                  />
                  <span>Enable REST API</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isGrpcEnabled}
                    onChange={(e) => setIsGrpcEnabled(e.target.checked)}
                  />
                  <span>Enable gRPC API</span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={useRealGrpc}
                    onChange={(e) => setUseRealGrpc(e.target.checked)}
                    disabled={!isGrpcEnabled}
                  />
                  <span>Use Real gRPC {useRealGrpc ? '(Requires Envoy)' : '(Simulation)'}</span>
                </label>
              </div>
            </div>

            <div className="results-section">
              <div className="results-sub-columns">
                {isRestEnabled && (
                  <div className="result-column">
                    <h3>🌐 REST Results</h3>
                    <RestResults results={restResults} metrics={restMetrics} />
                  </div>
                )}
                
                {isGrpcEnabled && (
                  <div className="result-column">
                    <h3>⚡ gRPC Results</h3>
                    <GrpcResults results={grpcResults} metrics={grpcMetrics} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="right-column">
            {restMetrics && grpcMetrics && (
                <ComparisonMetrics 
                  restMetrics={restMetrics} 
                  grpcMetrics={grpcMetrics} 
                />
            )}

            {performanceHistory.length > 0 && (
              <div className="chart-section">
                <h3>📈 Performance History</h3>
                <PerformanceChart data={performanceHistory} />
              </div>
            )}

            <div className="dev-tools-info">
              <h3>🔧 Dev Tools Inspection</h3>
              <p>Open Chrome DevTools (F12) → Network tab to see:</p>
              <ul>
                <li><strong>REST:</strong> XHR requests with JSON payloads</li>
                <li><strong>gRPC:</strong> More efficient binary protocol over HTTP/2</li>
                <li><strong>Performance:</strong> Compare request/response times and payload sizes</li>
              </ul>
            </div>
            
            <div className="stats">
              <p>Total searches performed: <strong>{searchCount}</strong></p>
              <p>Performance samples: <strong>{performanceHistory.length}</strong></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;