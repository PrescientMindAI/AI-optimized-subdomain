/**
 * Authentication Middleware
 * 
 * Handles API key validation and client identification
 * for the AI-optimized subdomain system.
 */

import { ClientService } from '../services/client-service.js';

const clientService = new ClientService();

/**
 * Authentication middleware
 * Validates API key and sets client information in request
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Get API key from headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_API_KEY',
          message: 'API key is required',
          requestId: req.requestId
        }
      });
    }

    // Extract API key from Bearer token
    const apiKey = authHeader.replace('Bearer ', '');
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid API key format',
          requestId: req.requestId
        }
      });
    }

    // Authenticate client
    const client = clientService.authenticateClient(apiKey);
    if (!client) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid or inactive API key',
          requestId: req.requestId
        }
      });
    }

    // Set client information in request
    req.client = client;
    req.clientId = client.id;
    req.startTime = Date.now();

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication service error',
        requestId: req.requestId
      }
    });
  }
};

/**
 * Optional authentication middleware
 * Validates API key if provided, but doesn't require it
 */
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const apiKey = authHeader.replace('Bearer ', '');
      const client = clientService.authenticateClient(apiKey);
      
      if (client) {
        req.client = client;
        req.clientId = client.id;
      }
    }

    req.startTime = Date.now();
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    req.startTime = Date.now();
    next();
  }
};

/**
 * Admin authentication middleware
 * Requires admin API key for administrative operations
 */
export const adminAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_ADMIN_KEY',
          message: 'Admin API key is required',
          requestId: req.requestId
        }
      });
    }

    const apiKey = authHeader.replace('Bearer ', '');
    const client = clientService.authenticateClient(apiKey);
    
    if (!client || !client.metadata?.isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin permissions required',
          requestId: req.requestId
        }
      });
    }

    req.client = client;
    req.clientId = client.id;
    req.isAdmin = true;
    req.startTime = Date.now();

    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication service error',
        requestId: req.requestId
      }
    });
  }
};

export default authMiddleware; 