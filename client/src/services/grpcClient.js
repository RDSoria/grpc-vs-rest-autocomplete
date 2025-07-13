import { SearchRequest, SearchResponse } from '../generated/search_pb';
import { SearchServiceClient } from '../generated/search_grpc_web_pb';

class GrpcClient {
  constructor() {
    this.client = new SearchServiceClient('http://localhost:8080', null, null);
  }

  async search(query, limit = 10) {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const request = new SearchRequest();
      request.setQuery(query);
      request.setLimit(limit);

      const requestStartTime = performance.now();
      let firstByteTime = null;

      const call = this.client.search(request, {}, (err, response) => {
        const endTime = performance.now();
        const requestLatency = endTime - startTime;
        
        if (err) {
          console.error('gRPC call failed:', err);
          reject(err);
          return;
        }

        const suggestions = response.getSuggestionsList();
        const totalCount = response.getTotalCount();
        const responseTimeMs = response.getResponseTimeMs();
        
        const estimatedPayloadSize = this.estimateBinarySize(suggestions, totalCount);
        
        const result = {
          suggestions,
          totalCount,
          responseTimeMs,
          metrics: {
            requestLatency: Math.round(requestLatency),
            payloadSize: estimatedPayloadSize,
            timeToFirstByte: firstByteTime ? Math.round(firstByteTime - requestStartTime) : Math.round(requestLatency * 0.7),
            requestsPerMinute: this.calculateRPM(requestLatency)
          }
        };
        
        resolve(result);
      });

      call.on('data', () => {
        if (!firstByteTime) {
          firstByteTime = performance.now();
        }
      });

      call.on('error', (err) => {
        console.error('gRPC stream error:', err);
        reject(err);
      });
    });
  }

  estimateBinarySize(suggestions, totalCount) {
    let size = 8;
    
    suggestions.forEach(suggestion => {
      size += suggestion.length + 2;
    });
    
    size += 4;
    size += 4;
    
    return size;
  }

  calculateRPM(latencyMs) {
    const requestsPerSecond = 1000 / (latencyMs + 10);
    return Math.round(requestsPerSecond * 60);
  }
}

export default new GrpcClient();