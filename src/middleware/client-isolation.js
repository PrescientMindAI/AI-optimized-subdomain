/**
 * Client Isolation Middleware
 * 
 * Ensures data scoping and access control for client isolation
 * in the AI-optimized subdomain system.
 */

import { ClientService } from '../services/client-service.js';

const clientService = new ClientService();

/**
 * Client isolation middleware
 * Validates client access to data and enforces isolation
 */
export const clientIsolationMiddleware = (req, res, next) => {
  try {
    // Skip if no client is authenticated (for public endpoints)
    if (!req.clientId) {
      return next();
    }

    // Get target client ID from query parameters or body
    const targetClientId = req.query.targetClientId || req.body.targetClientId;
    
    // Determine data type being accessed
    const dataType = getDataTypeFromPath(req.path);
    
    // Validate access
    const hasAccess = clientService.validateAccess(req.clientId, dataType, targetClientId);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Access denied for this data type',
          requestId: req.requestId,
          details: {
            clientId: req.clientId,
            dataType,
            targetClientId
          }
        }
      });
    }

    // Set target client ID for data scoping
    req.targetClientId = targetClientId || req.clientId;
    
    next();
  } catch (error) {
    console.error('Client isolation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ISOLATION_ERROR',
        message: 'Client isolation service error',
        requestId: req.requestId
      }
    });
  }
};

/**
 * Determine data type from request path
 * @param {string} path - Request path
 * @returns {string} - Data type
 */
function getDataTypeFromPath(path) {
  if (path.includes('/products')) return 'products';
  if (path.includes('/categories')) return 'categories';
  if (path.includes('/trust')) return 'trust';
  if (path.includes('/manufacturers')) return 'manufacturers';
  if (path.includes('/vectors')) return 'vectors';
  if (path.includes('/graph')) return 'graph';
  if (path.includes('/search')) return 'search';
  if (path.includes('/mcp')) return 'mcp';
  if (path.includes('/acp')) return 'acp';
  
  return 'general';
}

/**
 * Cross-client access middleware
 * Allows access to shared data across clients
 */
export const crossClientAccessMiddleware = (req, res, next) => {
  try {
    if (!req.clientId) {
      return next();
    }

    // Check if this is a cross-client request
    const targetClientId = req.query.targetClientId || req.body.targetClientId;
    
    if (targetClientId && targetClientId !== req.clientId) {
      // Validate cross-client access permissions
      const hasCrossClientAccess = validateCrossClientAccess(req.clientId, targetClientId);
      
      if (!hasCrossClientAccess) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'CROSS_CLIENT_ACCESS_DENIED',
            message: 'Cross-client access not allowed',
            requestId: req.requestId,
            details: {
              clientId: req.clientId,
              targetClientId
            }
          }
        });
      }
    }

    next();
  } catch (error) {
    console.error('Cross-client access error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CROSS_CLIENT_ERROR',
        message: 'Cross-client access service error',
        requestId: req.requestId
      }
    });
  }
};

/**
 * Validate cross-client access permissions
 * @param {string} clientId - Source client ID
 * @param {string} targetClientId - Target client ID
 * @returns {boolean} - Whether access is allowed
 */
function validateCrossClientAccess(clientId, targetClientId) {
  // In a real implementation, this would check permissions from a database
  // For now, we'll allow access to shared data types
  const sharedDataTypes = ['manufacturers', 'categories'];
  
  // Check if the request is for shared data
  const requestPath = req.path;
  const isSharedData = sharedDataTypes.some(type => requestPath.includes(type));
  
  return isSharedData;
}

/**
 * Data scoping middleware
 * Ensures all data queries are scoped to the appropriate client
 */
export const dataScopingMiddleware = (req, res, next) => {
  try {
    // Set default client scope
    if (!req.targetClientId) {
      req.targetClientId = req.clientId;
    }

    // Add client scope to query parameters
    if (req.method === 'GET') {
      req.query.clientId = req.targetClientId;
    } else if (req.method === 'POST') {
      req.body.clientId = req.targetClientId;
    }

    // Log data access for audit
    logDataAccess(req);

    next();
  } catch (error) {
    console.error('Data scoping error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SCOPING_ERROR',
        message: 'Data scoping service error',
        requestId: req.requestId
      }
    });
  }
};

/**
 * Log data access for audit purposes
 * @param {object} req - Express request object
 */
function logDataAccess(req) {
  const auditLog = {
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    clientId: req.clientId,
    targetClientId: req.targetClientId,
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress
  };

  // In production, this would be logged to a database or audit service
  console.log('Data access audit:', auditLog);
}

/**
 * Privacy enforcement middleware
 * Ensures sensitive data is not exposed across clients
 */
export const privacyEnforcementMiddleware = (req, res, next) => {
  try {
    // Check for sensitive data in response
    const originalSend = res.send;
    
    res.send = function(data) {
      try {
        // Parse response data
        const responseData = typeof data === 'string' ? JSON.parse(data) : data;
        
        // Sanitize sensitive information
        const sanitizedData = sanitizeResponse(responseData, req.clientId, req.targetClientId);
        
        // Send sanitized response
        originalSend.call(this, JSON.stringify(sanitizedData));
      } catch (error) {
        // If parsing fails, send original data
        originalSend.call(this, data);
      }
    };

    next();
  } catch (error) {
    console.error('Privacy enforcement error:', error);
    next();
  }
};

/**
 * Sanitize response data to remove sensitive information
 * @param {object} data - Response data
 * @param {string} clientId - Source client ID
 * @param {string} targetClientId - Target client ID
 * @returns {object} - Sanitized data
 */
function sanitizeResponse(data, clientId, targetClientId) {
  // If accessing own data, no sanitization needed
  if (clientId === targetClientId) {
    return data;
  }

  // For cross-client access, remove sensitive fields
  const sensitiveFields = [
    'internalId',
    'cost',
    'profit',
    'supplier',
    'internalNotes',
    'customerData'
  ];

  // Recursively remove sensitive fields
  return removeSensitiveFields(data, sensitiveFields);
}

/**
 * Recursively remove sensitive fields from object
 * @param {object} obj - Object to sanitize
 * @param {array} sensitiveFields - Array of sensitive field names
 * @returns {object} - Sanitized object
 */
function removeSensitiveFields(obj, sensitiveFields) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeSensitiveFields(item, sensitiveFields));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!sensitiveFields.includes(key)) {
      sanitized[key] = removeSensitiveFields(value, sensitiveFields);
    }
  }

  return sanitized;
}

export default clientIsolationMiddleware; 