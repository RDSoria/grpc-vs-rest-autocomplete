import React from 'react';
import './ComparisonMetrics.css';

const ComparisonMetrics = ({ restMetrics, grpcMetrics }) => {
  const getPerformanceIndicator = (restValue, grpcValue, lowerIsBetter = true) => {
    if (!restValue || !grpcValue) return '';
    
    const restBetter = lowerIsBetter ? restValue < grpcValue : restValue > grpcValue;
    const grpcBetter = lowerIsBetter ? grpcValue < restValue : grpcValue > restValue;
    
    return {
      rest: restBetter ? 'better' : grpcBetter ? 'worse' : 'equal',
      grpc: grpcBetter ? 'better' : restBetter ? 'worse' : 'equal'
    };
  };

  const latencyIndicator = getPerformanceIndicator(restMetrics.requestLatency, grpcMetrics.requestLatency);
  const sizeIndicator = getPerformanceIndicator(restMetrics.payloadSize, grpcMetrics.payloadSize);
  const ttfbIndicator = getPerformanceIndicator(restMetrics.timeToFirstByte, grpcMetrics.timeToFirstByte);
  const rpmIndicator = getPerformanceIndicator(restMetrics.requestsPerMinute, grpcMetrics.requestsPerMinute, false);

  return (
    <div className="comparison-metrics">
      <h3>📊 Visual Metrics Dashboard (in React)</h3>
      
      <div className="metrics-table">
        <div className="table-header">
          <div className="metric-column">Metric</div>
          <div className="rest-column">REST</div>
          <div className="grpc-column">gRPC</div>
        </div>
        
        <div className="table-row">
          <div className="metric-column">Request Latency (ms)</div>
          <div className={`rest-column ${latencyIndicator.rest}`}>
            {restMetrics.requestLatency}ms
            {latencyIndicator.rest === 'better' && <span className="indicator">🟢</span>}
            {latencyIndicator.rest === 'worse' && <span className="indicator">🔴</span>}
          </div>
          <div className={`grpc-column ${latencyIndicator.grpc}`}>
            {grpcMetrics.requestLatency.toFixed(1)}ms
            {latencyIndicator.grpc === 'better' && <span className="indicator">🟢</span>}
            {latencyIndicator.grpc === 'worse' && <span className="indicator">🔴</span>}
          </div>
        </div>
        
        <div className="table-row">
          <div className="metric-column">Payload Size (bytes)</div>
          <div className={`rest-column ${sizeIndicator.rest}`}>
            {restMetrics.payloadSize}
            {sizeIndicator.rest === 'better' && <span className="indicator">🟢</span>}
            {sizeIndicator.rest === 'worse' && <span className="indicator">🔴</span>}
          </div>
          <div className={`grpc-column ${sizeIndicator.grpc}`}>
            {grpcMetrics.payloadSize}
            {sizeIndicator.grpc === 'better' && <span className="indicator">🟢</span>}
            {sizeIndicator.grpc === 'worse' && <span className="indicator">🔴</span>}
          </div>
        </div>
        
        <div className="table-row">
          <div className="metric-column">Time to First Byte</div>
          <div className={`rest-column ${ttfbIndicator.rest}`}>
            {restMetrics.timeToFirstByte}ms
            {ttfbIndicator.rest === 'better' && <span className="indicator">🟢</span>}
            {ttfbIndicator.rest === 'worse' && <span className="indicator">🔴</span>}
          </div>
          <div className={`grpc-column ${ttfbIndicator.grpc}`}>
            {grpcMetrics.timeToFirstByte.toFixed(1)}ms
            {ttfbIndicator.grpc === 'better' && <span className="indicator">🟢</span>}
            {ttfbIndicator.grpc === 'worse' && <span className="indicator">🔴</span>}
          </div>
        </div>
        
        <div className="table-row">
          <div className="metric-column">Requests Per Minute</div>
          <div className={`rest-column ${rpmIndicator.rest}`}>
            {restMetrics.requestsPerMinute}
            {rpmIndicator.rest === 'better' && <span className="indicator">🟢</span>}
            {rpmIndicator.rest === 'worse' && <span className="indicator">🔴</span>}
          </div>
          <div className={`grpc-column ${rpmIndicator.grpc}`}>
            {grpcMetrics.requestsPerMinute}
            {rpmIndicator.grpc === 'better' && <span className="indicator">🟢</span>}
            {rpmIndicator.grpc === 'worse' && <span className="indicator">🔴</span>}
          </div>
        </div>
      </div>
      
      <div className="performance-summary">
        <div className="summary-item">
          <span className="summary-label">Latency Improvement:</span>
          <span className="summary-value">
            {((restMetrics.requestLatency - grpcMetrics.requestLatency) / restMetrics.requestLatency * 100).toFixed(1)}%
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Size Reduction:</span>
          <span className="summary-value">
            {((restMetrics.payloadSize - grpcMetrics.payloadSize) / restMetrics.payloadSize * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonMetrics;