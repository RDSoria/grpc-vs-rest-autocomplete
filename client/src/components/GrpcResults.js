import React from 'react';
import './Results.css';

const GrpcResults = ({ results, metrics }) => {
  return (
    <div className="results-container grpc-results">
      {metrics && (
        <div className="metrics-summary">
          <div className="metric-item">
            <span className="metric-label">Response Time:</span>
            <span className="metric-value grpc-metric">{metrics.requestLatency.toFixed(1)}ms</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Payload Size:</span>
            <span className="metric-value grpc-metric">{metrics.payloadSize} bytes</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">TTFB:</span>
            <span className="metric-value grpc-metric">{metrics.timeToFirstByte.toFixed(1)}ms</span>
          </div>
        </div>
      )}
      
      <div className="results-list">
        {results.length > 0 ? (
          <>
            <div className="results-header">
              <span className="results-count">{results.length} suggestions</span>
              <span className="api-badge grpc-badge">gRPC</span>
            </div>
            <ul className="suggestions-list">
              {results.map((result, index) => (
                <li key={index} className="suggestion-item">
                  <span className="suggestion-text">{result}</span>
                  <span className="suggestion-index">#{index + 1}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="no-results">
            <span className="no-results-icon">⚡</span>
            <p>No results found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrpcResults;