/**
 * MCP (Model Context Protocol) Specification
 * 
 * Purpose: Direct integration with AI models and language models
 * Use Case: LLMs accessing structured product data as context
 */

export const MCPProtocol = {
  // Protocol version and metadata
  protocol: {
    version: "1.0.0",
    name: "AI-Optimized Subdomain MCP",
    description: "Model Context Protocol for e-commerce knowledge graphs",
    baseUrl: "ai.domain.xyz",
    endpoints: {
      products: "/mcp/products",
      search: "/mcp/search", 
      categories: "/mcp/categories",
      trust: "/mcp/trust",
      manufacturers: "/mcp/manufacturers",
      graph: "/mcp/graph"
    }
  },

  // Request format for MCP
  request: {
    // Standard MCP request structure
    standard: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer {api_key}",
        "X-Client-ID": "string", // Client isolation
        "X-Request-ID": "string" // Request tracking
      },
      body: {
        query: "string", // Natural language query
        context: "object", // Additional context
        format: "string", // "json", "text", "structured"
        maxResults: "number",
        filters: "object",
        includeVectors: "boolean"
      }
    },

    // Product retrieval request
    productRequest: {
      endpoint: "/mcp/products/{product_id}",
      method: "GET",
      queryParams: {
        format: "string", // "full", "summary", "vector"
        includeTrust: "boolean",
        includeManufacturer: "boolean",
        includeRelationships: "boolean"
      }
    },

    // Search request
    searchRequest: {
      endpoint: "/mcp/search",
      method: "POST",
      body: {
        query: "string", // Natural language search query
        filters: {
          category: "string",
          priceRange: "object",
          manufacturer: "string",
          availability: "boolean",
          trustScore: "number"
        },
        sortBy: "string", // "relevance", "price", "rating", "date"
        limit: "number",
        offset: "number"
      }
    },

    // Category request
    categoryRequest: {
      endpoint: "/mcp/categories",
      method: "GET",
      queryParams: {
        parentId: "string",
        level: "number",
        includeProducts: "boolean",
        includeStats: "boolean"
      }
    }
  },

  // Response format for MCP
  response: {
    // Standard MCP response structure
    standard: {
      success: "boolean",
      requestId: "string",
      timestamp: "date",
      data: "object",
      metadata: {
        totalResults: "number",
        processingTime: "number",
        clientId: "string",
        format: "string"
      }
    },

    // Product response format
    productResponse: {
      product: {
        id: "string",
        name: "string",
        description: "string",
        price: "number",
        currency: "string",
        category: "string",
        manufacturer: "string",
        specifications: "object",
        images: ["string"],
        tags: ["string"],
        availability: "boolean",
        trustScore: "number",
        vector: "array" // Optional: if includeVectors=true
      },
      trust: {
        reviews: ["object"],
        ratings: "object",
        certifications: ["object"],
        credibility: "number"
      },
      manufacturer: {
        name: "string",
        officialUrl: "string",
        certifications: ["string"],
        trustScore: "number"
      },
      relationships: {
        similar: ["object"],
        complementary: ["object"],
        variations: ["object"]
      }
    },

    // Search response format
    searchResponse: {
      query: "string",
      totalResults: "number",
      results: [{
        productId: "string",
        name: "string",
        description: "string",
        price: "number",
        category: "string",
        similarity: "number",
        trustScore: "number",
        manufacturer: "string"
      }],
      facets: {
        categories: ["object"],
        manufacturers: ["object"],
        priceRanges: ["object"],
        trustLevels: ["object"]
      },
      suggestions: ["string"]
    },

    // Category response format
    categoryResponse: {
      categories: [{
        id: "string",
        name: "string",
        description: "string",
        level: "number",
        parentId: "string",
        productCount: "number",
        averagePrice: "number",
        averageTrustScore: "number"
      }],
      hierarchy: "object" // Tree structure
    }
  },

  // Context integration for LLMs
  contextIntegration: {
    // Context injection methods
    injection: {
      // Direct context injection
      direct: {
        method: "context_injection",
        format: "json",
        maxTokens: 4000,
        includeMetadata: true
      },

      // Summarized context
      summary: {
        method: "context_summary",
        format: "text",
        maxTokens: 1000,
        includeKeyPoints: true
      },

      // Structured context
      structured: {
        method: "structured_context",
        format: "json",
        schema: "predefined",
        includeRelationships: true
      }
    },

    // Context optimization
    optimization: {
      // Token optimization
      tokenOptimization: {
        maxTokens: 4000,
        compressionRatio: 0.8,
        priorityFields: [
          "name",
          "description", 
          "price",
          "trustScore",
          "manufacturer"
        ]
      },

      // Relevance optimization
      relevanceOptimization: {
        similarityThreshold: 0.7,
        trustWeight: 0.3,
        recencyWeight: 0.2,
        popularityWeight: 0.1
      }
    }
  },

  // Error handling
  errorHandling: {
    // Error response format
    errorResponse: {
      success: false,
      error: {
        code: "string",
        message: "string",
        details: "object",
        requestId: "string"
      }
    },

    // Error codes
    errorCodes: {
      "INVALID_QUERY": "Invalid search query",
      "CLIENT_NOT_FOUND": "Client not found or unauthorized",
      "PRODUCT_NOT_FOUND": "Product not found",
      "RATE_LIMIT_EXCEEDED": "Rate limit exceeded",
      "INVALID_FORMAT": "Invalid response format requested",
      "VECTOR_NOT_AVAILABLE": "Vector data not available",
      "TRUST_DATA_UNAVAILABLE": "Trust data not available"
    }
  },

  // Rate limiting and quotas
  rateLimiting: {
    // Rate limit configuration
    limits: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      maxConcurrentRequests: 10,
      maxTokensPerRequest: 4000
    },

    // Quota management
    quotas: {
      dailyRequests: 10000,
      monthlyRequests: 300000,
      maxVectorOperations: 1000,
      maxTrustQueries: 500
    }
  },

  // Security and authentication
  security: {
    // Authentication methods
    authentication: {
      apiKey: "required",
      clientId: "required",
      ipWhitelist: "optional",
      rateLimit: "enabled"
    },

    // Data isolation
    isolation: {
      clientScoped: true,
      crossClientAccess: false,
      dataEncryption: true,
      auditLogging: true
    }
  },

  // Performance metrics
  performance: {
    // Response time targets
    responseTime: {
      productQuery: "< 100ms",
      searchQuery: "< 200ms",
      categoryQuery: "< 50ms",
      vectorQuery: "< 150ms"
    },

    // Throughput targets
    throughput: {
      requestsPerSecond: 100,
      concurrentUsers: 1000,
      maxLatency: 500
    }
  }
};

export default MCPProtocol; 