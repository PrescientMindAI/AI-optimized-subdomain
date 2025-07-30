/**
 * AI-Optimized Subdomain Knowledge Graph Schema
 * 
 * This schema defines the structure for representing e-commerce data as interconnected 
 * knowledge graphs with client isolation, trust integration, and semantic annotations.
 */

export const KnowledgeGraphSchema = {
  // Core entity types
  entities: {
    // Product entity with all variations and specifications
    product: {
      id: "string", // Unique product identifier
      clientId: "string", // Client isolation - which e-commerce domain this belongs to
      name: "string",
      description: "string",
      category: "string",
      price: "number",
      currency: "string",
      availability: "boolean",
      manufacturer: "string",
      model: "string",
      specifications: "object", // Flexible spec object
      images: ["string"], // Array of image URLs
      tags: ["string"], // Semantic tags for AI processing
      createdAt: "date",
      updatedAt: "date",
      metadata: "object" // Additional flexible metadata
    },

    // Trust entity for reviews, ratings, and credibility
    trust: {
      id: "string",
      productId: "string", // Reference to product
      clientId: "string",
      type: "string", // "review", "rating", "certification", "award"
      source: "string", // External source (e.g., "trustpilot", "amazon")
      value: "mixed", // Rating number, review text, certification name
      credibility: "number", // 0-1 credibility score
      date: "date",
      verified: "boolean", // Whether this trust indicator is verified
      metadata: "object"
    },

    // Manufacturer entity for official data
    manufacturer: {
      id: "string",
      name: "string",
      officialUrl: "string",
      certifications: ["string"],
      verified: "boolean",
      trustScore: "number", // 0-1 manufacturer trust score
      metadata: "object"
    },

    // Category entity for hierarchical organization
    category: {
      id: "string",
      clientId: "string",
      name: "string",
      parentId: "string", // For hierarchical structure
      level: "number", // Depth in hierarchy
      description: "string",
      tags: ["string"],
      metadata: "object"
    }
  },

  // Relationship types for connecting entities
  relationships: {
    // Product relationships
    SIMILAR_TO: {
      type: "string",
      sourceProductId: "string",
      targetProductId: "string",
      similarity: "number", // 0-1 similarity score
      reason: "string", // Why they're similar
      metadata: "object"
    },

    COMPLEMENTARY_TO: {
      type: "string",
      sourceProductId: "string", 
      targetProductId: "string",
      complementarity: "number", // 0-1 how well they work together
      useCase: "string", // How they complement each other
      metadata: "object"
    },

    VARIATION_OF: {
      type: "string",
      baseProductId: "string",
      variationProductId: "string",
      variationType: "string", // "color", "size", "model", etc.
      metadata: "object"
    },

    MANUFACTURED_BY: {
      type: "string",
      productId: "string",
      manufacturerId: "string",
      verified: "boolean",
      metadata: "object"
    },

    BELONGS_TO_CATEGORY: {
      type: "string",
      productId: "string",
      categoryId: "string",
      confidence: "number", // 0-1 confidence in categorization
      metadata: "object"
    },

    HAS_TRUST_INDICATOR: {
      type: "string",
      productId: "string",
      trustId: "string",
      weight: "number", // 0-1 importance of this trust indicator
      metadata: "object"
    },

    // Category relationships
    PARENT_OF: {
      type: "string",
      parentCategoryId: "string",
      childCategoryId: "string",
      metadata: "object"
    },

    RELATED_TO: {
      type: "string",
      categoryId1: "string",
      categoryId2: "string",
      relationshipType: "string", // "cross-sell", "upsell", "alternative"
      strength: "number", // 0-1 relationship strength
      metadata: "object"
    }
  },

  // Semantic annotations for AI processing
  semanticAnnotations: {
    // Product semantic features
    productFeatures: {
      useCase: ["string"], // What the product is used for
      targetAudience: ["string"], // Who the product is for
      quality: "string", // "premium", "standard", "budget"
      sustainability: "string", // "eco-friendly", "organic", "fair-trade"
      seasonality: "string", // "seasonal", "year-round"
      complexity: "string", // "simple", "moderate", "complex"
      urgency: "string", // "essential", "nice-to-have", "luxury"
      metadata: "object"
    },

    // Trust semantic features
    trustFeatures: {
      sentiment: "string", // "positive", "negative", "neutral"
      credibility: "string", // "verified", "unverified", "suspicious"
      recency: "string", // "recent", "older", "outdated"
      volume: "string", // "high", "medium", "low" (number of reviews)
      consensus: "string", // "strong", "mixed", "weak" (agreement among reviews)
      metadata: "object"
    },

    // Category semantic features
    categoryFeatures: {
      popularity: "string", // "trending", "stable", "declining"
      seasonality: "string", // "seasonal", "year-round"
      priceRange: "string", // "budget", "mid-range", "premium"
      complexity: "string", // "simple", "moderate", "complex"
      metadata: "object"
    }
  },

  // Client isolation rules
  clientIsolation: {
    // Data scoping rules
    dataScope: {
      products: "client-scoped", // Only products from this client
      categories: "client-scoped", // Only categories from this client
      trust: "client-scoped", // Only trust data for this client's products
      manufacturers: "global", // Manufacturers can be shared across clients
      relationships: "client-scoped" // Only relationships within client data
    },

    // Access control rules
    accessControl: {
      defaultAccess: "client-scoped",
      crossClientAccess: "restricted", // Requires special permissions
      publicData: ["manufacturers", "categories"], // Data that can be shared
      privateData: ["products", "trust", "relationships"] // Client-specific data
    }
  },

  // Vector representation schema for semantic search
  vectorSchema: {
    productVector: {
      dimensions: 768, // Standard embedding dimensions
      features: [
        "name_embedding",
        "description_embedding", 
        "category_embedding",
        "tag_embedding",
        "specification_embedding"
      ],
      metadata: "object"
    },

    categoryVector: {
      dimensions: 512,
      features: [
        "name_embedding",
        "description_embedding",
        "hierarchy_embedding"
      ],
      metadata: "object"
    },

    trustVector: {
      dimensions: 256,
      features: [
        "sentiment_embedding",
        "credibility_embedding",
        "source_embedding"
      ],
      metadata: "object"
    }
  },

  // Indexing and search configuration
  searchConfig: {
    // Semantic search settings
    semanticSearch: {
      similarityThreshold: 0.7,
      maxResults: 50,
      includeTrust: true,
      includeManufacturer: true,
      weightTrust: 0.3,
      weightManufacturer: 0.2,
      weightProduct: 0.5
    },

    // Filter settings
    filters: {
      priceRange: "object",
      category: "string",
      manufacturer: "string",
      availability: "boolean",
      trustScore: "number",
      dateRange: "object"
    },

    // Sorting options
    sorting: {
      relevance: "semantic_similarity",
      price: "asc|desc",
      rating: "desc",
      date: "desc",
      popularity: "desc"
    }
  }
};

export default KnowledgeGraphSchema; 