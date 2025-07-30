/**
 * Vectorized Data Format Specification
 * 
 * Purpose: Enable semantic similarity search and efficient filtering
 * Use Case: AI agents finding products based on natural language queries
 */

export const VectorizedFormat = {
  // Product vector representation
  productVector: {
    // Core product vector (768 dimensions)
    vector: {
      type: "array",
      dimensions: 768,
      description: "Semantic embedding of product features",
      features: {
        name: "string_embedding", // Product name embedding
        description: "string_embedding", // Product description embedding
        category: "string_embedding", // Category embedding
        tags: "string_embedding", // Combined tags embedding
        specifications: "string_embedding", // Specs embedding
        manufacturer: "string_embedding", // Manufacturer embedding
        useCase: "string_embedding", // Use case embedding
        targetAudience: "string_embedding" // Target audience embedding
      }
    },

    // Metadata for efficient filtering
    metadata: {
      clientId: "string",
      productId: "string",
      price: "number",
      currency: "string",
      availability: "boolean",
      category: "string",
      manufacturer: "string",
      tags: ["string"],
      trustScore: "number", // Aggregated trust score
      popularity: "number", // Popularity metric
      createdAt: "date",
      updatedAt: "date"
    },

    // Trust vector (256 dimensions)
    trustVector: {
      type: "array", 
      dimensions: 256,
      description: "Trust and credibility embedding",
      features: {
        sentiment: "sentiment_embedding",
        credibility: "credibility_embedding",
        source: "source_embedding",
        recency: "recency_embedding"
      }
    },

    // Manufacturer vector (128 dimensions)
    manufacturerVector: {
      type: "array",
      dimensions: 128,
      description: "Manufacturer reputation embedding",
      features: {
        name: "string_embedding",
        reputation: "reputation_embedding",
        certifications: "certification_embedding"
      }
    }
  },

  // Category vector representation
  categoryVector: {
    vector: {
      type: "array",
      dimensions: 512,
      description: "Category hierarchy and semantic embedding",
      features: {
        name: "string_embedding",
        description: "string_embedding",
        hierarchy: "hierarchy_embedding", // Position in category tree
        products: "products_embedding" // Aggregated product embeddings
      }
    },
    metadata: {
      clientId: "string",
      categoryId: "string",
      name: "string",
      parentId: "string",
      level: "number",
      productCount: "number",
      averagePrice: "number",
      averageTrustScore: "number"
    }
  },

  // Search query vectorization
  queryVector: {
    // Natural language query vectorization
    naturalLanguage: {
      type: "array",
      dimensions: 768,
      description: "Query embedding for semantic search",
      features: {
        intent: "intent_embedding", // User intent embedding
        context: "context_embedding", // Context embedding
        constraints: "constraints_embedding" // Filter constraints embedding
      }
    },

    // Structured query vectorization
    structured: {
      type: "array", 
      dimensions: 512,
      description: "Structured query embedding",
      features: {
        category: "category_embedding",
        priceRange: "price_embedding",
        manufacturer: "manufacturer_embedding",
        trustLevel: "trust_embedding"
      }
    }
  },

  // Similarity calculation methods
  similarityMethods: {
    // Cosine similarity for semantic search
    cosine: {
      method: "cosine_similarity",
      description: "Standard cosine similarity for vector comparison",
      threshold: 0.7,
      useCase: "semantic_search"
    },

    // Euclidean distance for exact matching
    euclidean: {
      method: "euclidean_distance",
      description: "Euclidean distance for exact feature matching",
      threshold: 0.3,
      useCase: "exact_search"
    },

    // Weighted similarity for multi-criteria search
    weighted: {
      method: "weighted_similarity",
      description: "Weighted combination of multiple similarity metrics",
      weights: {
        semantic: 0.5,
        trust: 0.3,
        price: 0.1,
        availability: 0.1
      },
      useCase: "multi_criteria_search"
    }
  },

  // Indexing configuration
  indexing: {
    // Vector database configuration
    vectorDB: {
      type: "pinecone|weaviate|qdrant", // Vector database type
      dimensions: 768,
      metric: "cosine",
      indexType: "hnsw", // Hierarchical Navigable Small World
      efConstruction: 200,
      efSearch: 100
    },

    // Metadata indexing
    metadataIndex: {
      type: "elasticsearch|redis",
      fields: [
        "clientId",
        "category", 
        "manufacturer",
        "price",
        "availability",
        "trustScore",
        "tags"
      ],
      analyzers: {
        text: "standard",
        tags: "keyword"
      }
    },

    // Hybrid search configuration
    hybridSearch: {
      vectorWeight: 0.7,
      metadataWeight: 0.3,
      boostFields: {
        trustScore: 1.2,
        popularity: 1.1,
        recency: 1.05
      }
    }
  },

  // Response format
  responseFormat: {
    // Search results structure
    searchResults: {
      query: "string",
      totalResults: "number",
      results: [{
        productId: "string",
        similarity: "number",
        vector: "array", // Optional: include vector for further processing
        metadata: "object",
        trustData: "object",
        manufacturerData: "object"
      }],
      facets: {
        categories: ["object"],
        manufacturers: ["object"],
        priceRanges: ["object"],
        trustLevels: ["object"]
      },
      suggestions: ["string"] // Query suggestions
    },

    // Batch processing format
    batchResults: {
      batchId: "string",
      totalProcessed: "number",
      results: ["object"],
      errors: ["object"],
      processingTime: "number"
    }
  },

  // Performance optimization
  optimization: {
    // Caching strategy
    caching: {
      queryCache: {
        ttl: 3600, // 1 hour
        maxSize: 10000,
        strategy: "lru"
      },
      vectorCache: {
        ttl: 86400, // 24 hours
        maxSize: 100000,
        strategy: "lru"
      }
    },

    // Batch processing
    batchProcessing: {
      maxBatchSize: 100,
      parallelWorkers: 4,
      timeout: 30000 // 30 seconds
    },

    // Compression
    compression: {
      vectorCompression: "pq", // Product Quantization
      metadataCompression: "gzip",
      compressionRatio: 0.8
    }
  }
};

export default VectorizedFormat; 