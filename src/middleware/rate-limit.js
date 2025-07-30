/**
 * Rate Limiting Middleware
 * 
 * Controls API usage and prevents abuse in the AI-optimized subdomain system.
 */

import NodeCache from 'node-cache';

// Initialize rate limit cache
const rateLimitCache = new NodeCache({ stdTTL: 60, checkperiod: 30 });

/**
 * Rate limiting middleware
 * Limits requests per client based on different tiers
 */
export const rateLimitMiddleware = (req, res, next) => {
  try {
    const clientId = req.clientId || 'anonymous';
    const endpoint = req.path;
    const method = req.method;

    // Get rate limit configuration
    const rateLimitConfig = getRateLimitConfig(clientId, endpoint, method);
    
    // Check current usage
    const usage = getCurrentUsage(clientId, endpoint, method);
    
    // Check if limit exceeded
    if (usage.count >= rateLimitConfig.limit) {
      const resetTime = usage.resetTime;
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Rate limit exceeded',
          requestId: req.requestId,
          details: {
            limit: rateLimitConfig.limit,
            window: rateLimitConfig.window,
            retryAfter,
            resetTime: new Date(resetTime).toISOString()
          }
        }
      });
    }

    // Increment usage counter
    incrementUsage(clientId, endpoint, method);
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': rateLimitConfig.limit,
      'X-RateLimit-Remaining': rateLimitConfig.limit - usage.count - 1,
      'X-RateLimit-Reset': new Date(usage.resetTime).toISOString()
    });

    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue without rate limiting if there's an error
    next();
  }
};

/**
 * Get rate limit configuration based on client and endpoint
 * @param {string} clientId - Client ID
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @returns {object} - Rate limit configuration
 */
function getRateLimitConfig(clientId, endpoint, method) {
  // Default rate limits
  const defaultLimits = {
    // General API limits
    general: {
      limit: 100,
      window: 60 // 1 minute
    },
    
    // Search-specific limits (more expensive)
    search: {
      limit: 50,
      window: 60
    },
    
    // Vector operations (very expensive)
    vectors: {
      limit: 20,
      window: 60
    },
    
    // Graph queries (very expensive)
    graph: {
      limit: 10,
      window: 60
    },
    
    // MCP/ACP protocols
    protocols: {
      limit: 30,
      window: 60
    }
  };

  // Determine endpoint type
  let endpointType = 'general';
  if (endpoint.includes('/search')) endpointType = 'search';
  else if (endpoint.includes('/vectors')) endpointType = 'vectors';
  else if (endpoint.includes('/graph')) endpointType = 'graph';
  else if (endpoint.includes('/mcp') || endpoint.includes('/acp')) endpointType = 'protocols';

  // Get base configuration
  const baseConfig = defaultLimits[endpointType];

  // Apply client-specific adjustments
  const clientConfig = getClientRateLimit(clientId);
  
  return {
    limit: baseConfig.limit * (clientConfig.multiplier || 1),
    window: baseConfig.window,
    tier: clientConfig.tier || 'standard'
  };
}

/**
 * Get client-specific rate limit configuration
 * @param {string} clientId - Client ID
 * @returns {object} - Client rate limit configuration
 */
function getClientRateLimit(clientId) {
  // In a real implementation, this would come from a database
  // For now, we'll use a simple mapping
  const clientTiers = {
    'freshapples': { tier: 'premium', multiplier: 2 },
    'techstore': { tier: 'standard', multiplier: 1 },
    'bookstore': { tier: 'standard', multiplier: 1 },
    'anonymous': { tier: 'basic', multiplier: 0.5 }
  };

  return clientTiers[clientId] || { tier: 'basic', multiplier: 0.5 };
}

/**
 * Get current usage for a client and endpoint
 * @param {string} clientId - Client ID
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @returns {object} - Current usage information
 */
function getCurrentUsage(clientId, endpoint, method) {
  const key = `${clientId}:${endpoint}:${method}`;
  const usage = rateLimitCache.get(key);
  
  if (!usage) {
    return {
      count: 0,
      resetTime: Date.now() + (60 * 1000) // 1 minute window
    };
  }

  // Check if window has expired
  if (Date.now() > usage.resetTime) {
    return {
      count: 0,
      resetTime: Date.now() + (60 * 1000)
    };
  }

  return usage;
}

/**
 * Increment usage counter for a client and endpoint
 * @param {string} clientId - Client ID
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 */
function incrementUsage(clientId, endpoint, method) {
  const key = `${clientId}:${endpoint}:${method}`;
  const currentUsage = getCurrentUsage(clientId, endpoint, method);
  
  const newUsage = {
    count: currentUsage.count + 1,
    resetTime: currentUsage.resetTime
  };
  
  rateLimitCache.set(key, newUsage);
}

/**
 * Burst rate limiting middleware
 * Allows short bursts of requests above the normal limit
 */
export const burstRateLimitMiddleware = (req, res, next) => {
  try {
    const clientId = req.clientId || 'anonymous';
    const endpoint = req.path;
    const method = req.method;

    // Get burst configuration
    const burstConfig = getBurstConfig(clientId);
    
    // Check burst usage
    const burstUsage = getBurstUsage(clientId, endpoint, method);
    
    if (burstUsage.count >= burstConfig.limit) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'BURST_LIMIT_EXCEEDED',
          message: 'Burst rate limit exceeded',
          requestId: req.requestId,
          details: {
            burstLimit: burstConfig.limit,
            burstWindow: burstConfig.window
          }
        }
      });
    }

    // Increment burst counter
    incrementBurstUsage(clientId, endpoint, method);
    
    next();
  } catch (error) {
    console.error('Burst rate limiting error:', error);
    next();
  }
};

/**
 * Get burst configuration for a client
 * @param {string} clientId - Client ID
 * @returns {object} - Burst configuration
 */
function getBurstConfig(clientId) {
  const burstTiers = {
    'premium': { limit: 20, window: 10 }, // 20 requests in 10 seconds
    'standard': { limit: 10, window: 10 }, // 10 requests in 10 seconds
    'basic': { limit: 5, window: 10 }      // 5 requests in 10 seconds
  };

  const clientTier = getClientRateLimit(clientId).tier;
  return burstTiers[clientTier] || burstTiers.basic;
}

/**
 * Get burst usage for a client and endpoint
 * @param {string} clientId - Client ID
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @returns {object} - Burst usage information
 */
function getBurstUsage(clientId, endpoint, method) {
  const key = `burst:${clientId}:${endpoint}:${method}`;
  const usage = rateLimitCache.get(key);
  
  if (!usage) {
    return {
      count: 0,
      resetTime: Date.now() + (10 * 1000) // 10 second window
    };
  }

  // Check if window has expired
  if (Date.now() > usage.resetTime) {
    return {
      count: 0,
      resetTime: Date.now() + (10 * 1000)
    };
  }

  return usage;
}

/**
 * Increment burst usage counter
 * @param {string} clientId - Client ID
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 */
function incrementBurstUsage(clientId, endpoint, method) {
  const key = `burst:${clientId}:${endpoint}:${method}`;
  const currentUsage = getBurstUsage(clientId, endpoint, method);
  
  const newUsage = {
    count: currentUsage.count + 1,
    resetTime: currentUsage.resetTime
  };
  
  rateLimitCache.set(key, newUsage);
}

/**
 * Quota tracking middleware
 * Tracks daily and monthly usage quotas
 */
export const quotaTrackingMiddleware = (req, res, next) => {
  try {
    const clientId = req.clientId;
    if (!clientId) {
      return next();
    }

    // Track request for quota
    trackQuotaUsage(clientId, req.path, req.method);
    
    next();
  } catch (error) {
    console.error('Quota tracking error:', error);
    next();
  }
};

/**
 * Track quota usage for a client
 * @param {string} clientId - Client ID
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 */
function trackQuotaUsage(clientId, endpoint, method) {
  const today = new Date().toISOString().split('T')[0];
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  // Daily quota
  const dailyKey = `quota:daily:${clientId}:${today}`;
  const dailyUsage = rateLimitCache.get(dailyKey) || 0;
  rateLimitCache.set(dailyKey, dailyUsage + 1, 86400); // 24 hours TTL
  
  // Monthly quota
  const monthlyKey = `quota:monthly:${clientId}:${month}`;
  const monthlyUsage = rateLimitCache.get(monthlyKey) || 0;
  rateLimitCache.set(monthlyKey, monthlyUsage + 1, 2592000); // 30 days TTL
}

/**
 * Get quota usage for a client
 * @param {string} clientId - Client ID
 * @returns {object} - Quota usage information
 */
export function getQuotaUsage(clientId) {
  const today = new Date().toISOString().split('T')[0];
  const month = new Date().toISOString().slice(0, 7);
  
  const dailyKey = `quota:daily:${clientId}:${today}`;
  const monthlyKey = `quota:monthly:${clientId}:${month}`;
  
  return {
    daily: rateLimitCache.get(dailyKey) || 0,
    monthly: rateLimitCache.get(monthlyKey) || 0,
    date: today,
    month: month
  };
}

export default rateLimitMiddleware; 