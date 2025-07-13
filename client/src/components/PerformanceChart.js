import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import './PerformanceChart.css';

const PerformanceChart = ({ data }) => {
  const [chartType, setChartType] = useState('line');
  const [metric, setMetric] = useState('requestLatency');

  const chartData = data.map((entry, index) => ({
    search: index + 1,
    query: entry.query.substring(0, 10) + (entry.query.length > 10 ? '...' : ''),
    restLatency: entry.rest?.requestLatency || 0,
    grpcLatency: entry.grpc?.requestLatency || 0,
    restSize: entry.rest?.payloadSize || 0,
    grpcSize: entry.grpc?.payloadSize || 0,
    restTTFB: entry.rest?.timeToFirstByte || 0,
    grpcTTFB: entry.grpc?.timeToFirstByte || 0,
    timestamp: new Date(entry.timestamp).toLocaleTimeString()
  }));

  const getMetricConfig = () => {
    switch (metric) {
      case 'requestLatency':
        return {
          title: 'Request Latency (ms)',
          restKey: 'restLatency',
          grpcKey: 'grpcLatency',
          unit: 'ms'
        };
      case 'payloadSize':
        return {
          title: 'Payload Size (bytes)',
          restKey: 'restSize',
          grpcKey: 'grpcSize',
          unit: 'bytes'
        };
      case 'timeToFirstByte':
        return {
          title: 'Time to First Byte (ms)',
          restKey: 'restTTFB',
          grpcKey: 'grpcTTFB',
          unit: 'ms'
        };
      default:
        return {
          title: 'Request Latency (ms)',
          restKey: 'restLatency',
          grpcKey: 'grpcLatency',
          unit: 'ms'
        };
    }
  };

  const config = getMetricConfig();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Search #${label}: "${data.query}"`}</p>
          <p className="tooltip-time">{data.timestamp}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${config.unit}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="search" 
            stroke="#666"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fontSize: 12 }}
            label={{ value: config.title, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={config.restKey} 
            stroke="#ff6b6b" 
            strokeWidth={3}
            dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
            name="REST"
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey={config.grpcKey} 
            stroke="#4ecdc4" 
            strokeWidth={3}
            dot={{ fill: '#4ecdc4', strokeWidth: 2, r: 4 }}
            name="gRPC"
            connectNulls={false}
          />
        </LineChart>
      );
    } else {
      return (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="search" 
            stroke="#666"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fontSize: 12 }}
            label={{ value: config.title, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey={config.restKey} 
            fill="#ff6b6b" 
            name="REST"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey={config.grpcKey} 
            fill="#4ecdc4" 
            name="gRPC"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      );
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>📈 Performance charts will appear after you perform some searches</p>
      </div>
    );
  }

  return (
    <div className="performance-chart">
      <div className="chart-controls">
        <div className="control-group">
          <label>Chart Type:</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="chart-select"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Metric:</label>
          <select 
            value={metric} 
            onChange={(e) => setMetric(e.target.value)}
            className="chart-select"
          >
            <option value="requestLatency">Request Latency</option>
            <option value="payloadSize">Payload Size</option>
            <option value="timeToFirstByte">Time to First Byte</option>
          </select>
        </div>
      </div>
      
      <div className="chart-container">
        <h4>{config.title} Comparison</h4>
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      <div className="chart-summary">
        <div className="summary-stats">
          <div className="stat-item rest-stat">
            <span className="stat-label">REST Average:</span>
            <span className="stat-value">
              {(chartData.reduce((sum, item) => sum + (item[config.restKey] || 0), 0) / chartData.length).toFixed(1)}{config.unit}
            </span>
          </div>
          <div className="stat-item grpc-stat">
            <span className="stat-label">gRPC Average:</span>
            <span className="stat-value">
              {(chartData.reduce((sum, item) => sum + (item[config.grpcKey] || 0), 0) / chartData.length).toFixed(1)}{config.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;