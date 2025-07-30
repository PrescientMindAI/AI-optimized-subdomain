/**
 * Validation Middleware
 * 
 * Handles request validation using Joi schemas for the AI-optimized subdomain system.
 */

import Joi from 'joi';

/**
 * Generic validation middleware
 * @param {object} schema - Joi validation schema
 * @returns {function} - Express middleware function
 */
export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const dataToValidate = {
        body: req.body,
        query: req.query,
        params: req.params
      };

      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
      });

      if (error) {
        const validationErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          type: detail.type
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            requestId: req.requestId,
            details: validationErrors
          }
        });
      }

      // Update request with validated data
      req.body = value.body || req.body;
      req.query = value.query || req.query;
      req.params = value.params || req.params;

      next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation service error',
          requestId: req.requestId
        }
      });
    }
  };
};

/**
 * Product validation schemas
 */
export const productSchemas = {
  // Get product by ID
  getProduct: Joi.object({
    params: Joi.object({
      id: Joi.string().required().description('Product ID')
    }).required(),
    query: Joi.object({
      format: Joi.string().valid('json', 'vector', 'mcp', 'acp', 'graph').default('json'),
      includeTrust: Joi.boolean().default(false),
      includeManufacturer: Joi.boolean().default(false),
      includeRelationships: Joi.boolean().default(false)
    })
  }),

  // Search products
  searchProducts: Joi.object({
    body: Joi.object({
      query: Joi.string().required().min(1).max(500).description('Search query'),
      filters: Joi.object({
        category: Joi.string().optional(),
        priceRange: Joi.object({
          min: Joi.number().min(0).optional(),
          max: Joi.number().min(0).optional()
        }).optional(),
        manufacturer: Joi.string().optional(),
        availability: Joi.boolean().optional(),
        trustScore: Joi.number().min(0).max(1).optional()
      }).optional(),
      format: Joi.string().valid('json', 'vector', 'mcp', 'acp', 'graph').default('json'),
      limit: Joi.number().integer().min(1).max(100).default(20),
      offset: Joi.number().integer().min(0).default(0)
    }).required()
  })
};

/**
 * Search validation schemas
 */
export const searchSchemas = {
  // Vector similarity search
  vectorSimilarity: Joi.object({
    body: Joi.object({
      query: Joi.string().required().min(1).max(500).description('Vector similarity query'),
      filters: Joi.object({
        category: Joi.string().optional(),
        priceRange: Joi.object({
          min: Joi.number().min(0).optional(),
          max: Joi.number().min(0).optional()
        }).optional(),
        manufacturer: Joi.string().optional(),
        availability: Joi.boolean().optional(),
        trustScore: Joi.number().min(0).max(1).optional()
      }).optional(),
      limit: Joi.number().integer().min(1).max(50).default(10)
    }).required()
  }),

  // Graph query
  graphQuery: Joi.object({
    body: Joi.object({
      query: Joi.string().required().description('Graph query (Cypher/GraphQL)'),
      parameters: Joi.object().optional().description('Query parameters')
    }).required()
  })
};

/**
 * Category validation schemas
 */
export const categorySchemas = {
  // Get categories
  getCategories: Joi.object({
    query: Joi.object({
      parentId: Joi.string().optional().description('Parent category ID'),
      level: Joi.number().integer().min(0).max(10).optional().description('Category level'),
      includeProducts: Joi.boolean().default(false),
      includeStats: Joi.boolean().default(false)
    })
  })
};

/**
 * Trust validation schemas
 */
export const trustSchemas = {
  // Get trust data
  getTrustData: Joi.object({
    params: Joi.object({
      productId: Joi.string().required().description('Product ID')
    }).required()
  })
};

/**
 * Manufacturer validation schemas
 */
export const manufacturerSchemas = {
  // Get manufacturer data
  getManufacturerData: Joi.object({
    params: Joi.object({
      productId: Joi.string().required().description('Product ID')
    }).required()
  })
};

/**
 * MCP protocol validation schemas
 */
export const mcpSchemas = {
  // MCP search
  mcpSearch: Joi.object({
    body: Joi.object({
      query: Joi.string().required().min(1).max(1000).description('Natural language query'),
      context: Joi.object().optional().description('Additional context'),
      format: Joi.string().valid('json', 'text', 'structured').default('json'),
      maxResults: Joi.number().integer().min(1).max(100).default(20),
      filters: Joi.object({
        category: Joi.string().optional(),
        priceRange: Joi.object({
          min: Joi.number().min(0).optional(),
          max: Joi.number().min(0).optional()
        }).optional(),
        manufacturer: Joi.string().optional(),
        availability: Joi.boolean().optional(),
        trustScore: Joi.number().min(0).max(1).optional()
      }).optional(),
      includeVectors: Joi.boolean().default(false)
    }).required()
  })
};

/**
 * ACP protocol validation schemas
 */
export const acpSchemas = {
  // Agent registration
  agentRegistration: Joi.object({
    body: Joi.object({
      agentId: Joi.string().optional().description('Agent ID (auto-generated if not provided)'),
      agentType: Joi.string().valid('shopping', 'research', 'comparison', 'recommendation').required(),
      capabilities: Joi.array().items(Joi.string()).optional().default([]),
      clientId: Joi.string().required().description('Client ID'),
      preferences: Joi.object().optional().default({}),
      metadata: Joi.object().optional().default({})
    }).required()
  }),

  // Task distribution
  taskDistribution: Joi.object({
    body: Joi.object({
      taskId: Joi.string().required().description('Task ID'),
      taskType: Joi.string().valid('search', 'compare', 'recommend', 'research').required(),
      priority: Joi.number().integer().min(1).max(10).default(5),
      requirements: Joi.object().optional().default({}),
      agents: Joi.array().items(Joi.string()).optional().default([]),
      context: Joi.object().optional().default({})
    }).required()
  }),

  // Context creation
  contextCreation: Joi.object({
    body: Joi.object({
      sessionId: Joi.string().optional().description('Session ID (auto-generated if not provided)'),
      userQuery: Joi.string().required().description('User query'),
      userContext: Joi.object().optional().default({}),
      agentContext: Joi.object().optional().default({}),
      productContext: Joi.object().optional().default({}),
      trustContext: Joi.object().optional().default({}),
      ttl: Joi.number().integer().min(60).max(86400).default(3600).description('Time to live in seconds')
    }).required()
  })
};

/**
 * Custom validation functions
 */

/**
 * Validate client ID format
 * @param {string} clientId - Client ID to validate
 * @returns {boolean} - Whether client ID is valid
 */
export function validateClientId(clientId) {
  const schema = Joi.string().pattern(/^[a-z0-9-]+$/).min(1).max(50);
  const { error } = schema.validate(clientId);
  return !error;
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} - Whether API key is valid
 */
export function validateApiKey(apiKey) {
  const schema = Joi.string().pattern(/^api-key-[a-zA-Z0-9]+$/).min(20).max(100);
  const { error } = schema.validate(apiKey);
  return !error;
}

/**
 * Validate product ID format
 * @param {string} productId - Product ID to validate
 * @returns {boolean} - Whether product ID is valid
 */
export function validateProductId(productId) {
  const schema = Joi.string().pattern(/^[a-zA-Z0-9-_]+$/).min(1).max(100);
  const { error } = schema.validate(productId);
  return !error;
}

/**
 * Validate search query
 * @param {string} query - Search query to validate
 * @returns {boolean} - Whether query is valid
 */
export function validateSearchQuery(query) {
  const schema = Joi.string().min(1).max(500).trim();
  const { error } = schema.validate(query);
  return !error;
}

/**
 * Validate price range
 * @param {object} priceRange - Price range object
 * @returns {boolean} - Whether price range is valid
 */
export function validatePriceRange(priceRange) {
  const schema = Joi.object({
    min: Joi.number().min(0).optional(),
    max: Joi.number().min(0).optional()
  }).custom((value, helpers) => {
    if (value.min && value.max && value.min > value.max) {
      return helpers.error('any.invalid');
    }
    return value;
  });

  const { error } = schema.validate(priceRange);
  return !error;
}

/**
 * Sanitize input data
 * @param {object} data - Data to sanitize
 * @returns {object} - Sanitized data
 */
export function sanitizeInput(data) {
  if (typeof data === 'string') {
    return data.trim().replace(/[<>]/g, '');
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return data;
}

export default validationMiddleware; 