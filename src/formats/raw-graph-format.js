/**
 * Raw Graph Format Specification
 * 
 * Purpose: Direct knowledge graph queries and traversal
 * Use Case: Complex AI reasoning over product relationships
 */

export const RawGraphFormat = {
  // Graph structure definition
  graphStructure: {
    // Node types
    nodes: {
      product: {
        type: "product",
        properties: {
          id: "string",
          clientId: "string",
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
          createdAt: "date",
          updatedAt: "date"
        }
      },

      category: {
        type: "category",
        properties: {
          id: "string",
          clientId: "string",
          name: "string",
          description: "string",
          level: "number",
          parentId: "string",
          productCount: "number",
          averagePrice: "number",
          averageTrustScore: "number"
        }
      },

      manufacturer: {
        type: "manufacturer",
        properties: {
          id: "string",
          name: "string",
          officialUrl: "string",
          certifications: ["string"],
          verified: "boolean",
          trustScore: "number"
        }
      },

      trust: {
        type: "trust",
        properties: {
          id: "string",
          productId: "string",
          clientId: "string",
          type: "string",
          source: "string",
          value: "mixed",
          credibility: "number",
          date: "date",
          verified: "boolean"
        }
      },

      user: {
        type: "user",
        properties: {
          id: "string",
          clientId: "string",
          preferences: "object",
          history: "object",
          profile: "object"
        }
      }
    },

    // Edge types
    edges: {
      SIMILAR_TO: {
        type: "SIMILAR_TO",
        properties: {
          similarity: "number",
          reason: "string",
          algorithm: "string",
          confidence: "number"
        }
      },

      COMPLEMENTARY_TO: {
        type: "COMPLEMENTARY_TO",
        properties: {
          complementarity: "number",
          useCase: "string",
          confidence: "number"
        }
      },

      VARIATION_OF: {
        type: "VARIATION_OF",
        properties: {
          variationType: "string",
          confidence: "number"
        }
      },

      MANUFACTURED_BY: {
        type: "MANUFACTURED_BY",
        properties: {
          verified: "boolean",
          confidence: "number"
        }
      },

      BELONGS_TO_CATEGORY: {
        type: "BELONGS_TO_CATEGORY",
        properties: {
          confidence: "number",
          primary: "boolean"
        }
      },

      HAS_TRUST_INDICATOR: {
        type: "HAS_TRUST_INDICATOR",
        properties: {
          weight: "number",
          relevance: "number"
        }
      },

      PARENT_OF: {
        type: "PARENT_OF",
        properties: {
          level: "number"
        }
      },

      RELATED_TO: {
        type: "RELATED_TO",
        properties: {
          relationshipType: "string",
          strength: "number"
        }
      },

      PURCHASED: {
        type: "PURCHASED",
        properties: {
          date: "date",
          quantity: "number",
          rating: "number"
        }
      },

      VIEWED: {
        type: "VIEWED",
        properties: {
          date: "date",
          duration: "number"
        }
      },

      RECOMMENDED: {
        type: "RECOMMENDED",
        properties: {
          algorithm: "string",
          confidence: "number",
          reason: "string"
        }
      }
    }
  },

  // Query language specification
  queryLanguage: {
    // Cypher-like query syntax
    cypher: {
      // Basic node queries
      nodeQueries: {
        findProducts: "MATCH (p:product) WHERE p.clientId = $clientId RETURN p",
        findCategories: "MATCH (c:category) WHERE c.clientId = $clientId RETURN c",
        findManufacturers: "MATCH (m:manufacturer) RETURN m",
        findTrust: "MATCH (t:trust) WHERE t.clientId = $clientId RETURN t"
      },

      // Relationship queries
      relationshipQueries: {
        similarProducts: "MATCH (p1:product)-[r:SIMILAR_TO]->(p2:product) WHERE p1.id = $productId RETURN p2, r",
        complementaryProducts: "MATCH (p1:product)-[r:COMPLEMENTARY_TO]->(p2:product) WHERE p1.id = $productId RETURN p2, r",
        productVariations: "MATCH (p1:product)-[r:VARIATION_OF]->(p2:product) WHERE p1.id = $productId RETURN p2, r",
        manufacturerProducts: "MATCH (p:product)-[r:MANUFACTURED_BY]->(m:manufacturer) WHERE m.id = $manufacturerId RETURN p, r"
      },

      // Path queries
      pathQueries: {
        productPath: "MATCH path = (p1:product)-[*1..3]-(p2:product) WHERE p1.id = $productId1 AND p2.id = $productId2 RETURN path",
        categoryPath: "MATCH path = (c1:category)-[:PARENT_OF*]-(c2:category) WHERE c1.id = $categoryId1 AND c2.id = $categoryId2 RETURN path",
        trustPath: "MATCH path = (p:product)-[:HAS_TRUST_INDICATOR]->(t:trust) WHERE p.id = $productId RETURN path"
      },

      // Complex queries
      complexQueries: {
        recommendationQuery: `
          MATCH (u:user)-[:PURCHASED]->(p1:product)-[:SIMILAR_TO]->(p2:product)
          WHERE u.id = $userId AND p2.clientId = $clientId
          WITH p2, count(p1) as similarity
          MATCH (p2)-[:HAS_TRUST_INDICATOR]->(t:trust)
          RETURN p2, similarity, avg(t.credibility) as trustScore
          ORDER BY similarity DESC, trustScore DESC
          LIMIT 10
        `,
        
        categoryAnalysis: `
          MATCH (c:category)-[:PARENT_OF*]->(subc:category)
          WHERE c.clientId = $clientId
          WITH c, collect(subc) as subcategories
          MATCH (c)-[:BELONGS_TO_CATEGORY]-(p:product)
          RETURN c, subcategories, count(p) as productCount, avg(p.price) as avgPrice
        `
      }
    },

    // GraphQL-like queries
    graphql: {
      // Product query
      productQuery: `
        query GetProduct($id: ID!, $clientId: String!) {
          product(id: $id, clientId: $clientId) {
            id
            name
            description
            price
            category
            manufacturer
            specifications
            images
            tags
            availability
            trustScore
            similarProducts {
              id
              name
              similarity
            }
            complementaryProducts {
              id
              name
              complementarity
            }
            trustIndicators {
              type
              source
              value
              credibility
            }
          }
        }
      `,

      // Search query
      searchQuery: `
        query SearchProducts($query: String!, $clientId: String!, $filters: ProductFilters) {
          searchProducts(query: $query, clientId: $clientId, filters: $filters) {
            totalResults
            results {
              id
              name
              description
              price
              category
              similarity
              trustScore
            }
            facets {
              categories
              manufacturers
              priceRanges
            }
          }
        }
      `,

      // Category query
      categoryQuery: `
        query GetCategory($id: ID!, $clientId: String!) {
          category(id: $id, clientId: $clientId) {
            id
            name
            description
            level
            parentCategory {
              id
              name
            }
            subcategories {
              id
              name
              productCount
            }
            products {
              id
              name
              price
              trustScore
            }
          }
        }
      `
    }
  },

  // Traversal algorithms
  traversalAlgorithms: {
    // Breadth-first search
    bfs: {
      description: "Breadth-first traversal for finding related products",
      parameters: {
        startNode: "string",
        maxDepth: "number",
        relationshipTypes: ["string"],
        filters: "object"
      },
      useCase: "Finding products within N hops"
    },

    // Depth-first search
    dfs: {
      description: "Depth-first traversal for exploring product hierarchies",
      parameters: {
        startNode: "string",
        maxDepth: "number",
        relationshipTypes: ["string"],
        filters: "object"
      },
      useCase: "Exploring category hierarchies"
    },

    // Shortest path
    shortestPath: {
      description: "Finding shortest path between two products",
      parameters: {
        startNode: "string",
        endNode: "string",
        relationshipTypes: ["string"],
        maxPathLength: "number"
      },
      useCase: "Finding connection between products"
    },

    // PageRank
    pageRank: {
      description: "Calculating product importance based on relationships",
      parameters: {
        dampingFactor: "number",
        iterations: "number",
        tolerance: "number"
      },
      useCase: "Product popularity ranking"
    },

    // Community detection
    communityDetection: {
      description: "Finding product communities/clusters",
      parameters: {
        algorithm: "string", // "louvain", "label_propagation"
        minCommunitySize: "number"
      },
      useCase: "Product clustering"
    }
  },

  // Graph analytics
  graphAnalytics: {
    // Centrality measures
    centrality: {
      degree: "Product connectivity based on number of relationships",
      betweenness: "Product importance as bridge between other products",
      closeness: "Product centrality based on average distance to others",
      eigenvector: "Product importance based on importance of neighbors"
    },

    // Similarity measures
    similarity: {
      jaccard: "Similarity based on shared neighbors",
      cosine: "Similarity based on feature vectors",
      euclidean: "Distance-based similarity",
      pearson: "Correlation-based similarity"
    },

    // Clustering
    clustering: {
      modularity: "Quality of community structure",
      conductance: "Quality of graph partitioning",
      density: "Density of relationships within communities"
    }
  },

  // Performance optimization
  performance: {
    // Indexing strategies
    indexing: {
      nodeIndexes: [
        "product_id",
        "product_client_id",
        "product_category",
        "product_manufacturer",
        "category_id",
        "category_client_id",
        "trust_product_id",
        "trust_client_id"
      ],
      edgeIndexes: [
        "similarity_score",
        "complementarity_score",
        "trust_weight",
        "relationship_type"
      ]
    },

    // Caching strategies
    caching: {
      nodeCache: {
        ttl: 3600,
        maxSize: 10000,
        strategy: "lru"
      },
      queryCache: {
        ttl: 1800,
        maxSize: 5000,
        strategy: "lru"
      },
      pathCache: {
        ttl: 7200,
        maxSize: 2000,
        strategy: "lru"
      }
    },

    // Query optimization
    queryOptimization: {
      queryPlanner: "enabled",
      indexHints: "enabled",
      queryTimeout: 30000,
      maxResults: 1000
    }
  },

  // Response format
  responseFormat: {
    // Node response
    nodeResponse: {
      id: "string",
      type: "string",
      properties: "object",
      labels: ["string"],
      metadata: {
        createdAt: "date",
        updatedAt: "date",
        version: "number"
      }
    },

    // Edge response
    edgeResponse: {
      id: "string",
      type: "string",
      startNode: "string",
      endNode: "string",
      properties: "object",
      metadata: {
        createdAt: "date",
        confidence: "number"
      }
    },

    // Path response
    pathResponse: {
      nodes: ["object"],
      edges: ["object"],
      length: "number",
      cost: "number",
      metadata: {
        algorithm: "string",
        executionTime: "number"
      }
    },

    // Query result
    queryResult: {
      success: "boolean",
      query: "string",
      results: ["object"],
      metadata: {
        executionTime: "number",
        resultCount: "number",
        cacheHit: "boolean"
      }
    }
  }
};

export default RawGraphFormat; 