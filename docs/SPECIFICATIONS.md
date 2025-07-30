# 📋 Data Format Specifications

## **Overview**

This document provides detailed specifications for the four core data formats used in the AI-Optimized Subdomain system. Each format is designed for specific AI use cases and provides different levels of structure and flexibility.

---

## **1. Vectorized Data Format**

### **Purpose**
Enable semantic similarity search and efficient filtering for AI agents finding products based on natural language queries.

### **Use Case**
AI agents performing semantic search, recommendation systems, and similarity-based product discovery.

### **Specification**

#### **Format Structure**
```json
{
  "format": "vectorized",
  "version": "1.0.0",
  "metadata": {
    "client_id": "client-domain",
    "timestamp": "2024-01-01T00:00:00Z",
    "vector_dimensions": 768,
    "embedding_model": "all-MiniLM-L6-v2"
  },
  "products": [
    {
      "id": "product-123",
      "name": "iPhone 13 Pro",
      "description": "Latest iPhone with advanced camera system",
      "category": "Electronics > Smartphones",
      "brand": "Apple",
      "price": 999.00,
      "vector": [0.123, 0.456, 0.789, ...],
      "attributes": {
        "color": "Space Gray",
        "storage": "256GB",
        "screen_size": "6.1 inches"
      },
      "semantic_tags": [
        "smartphone",
        "camera",
        "5G",
        "photography",
        "premium"
      ],
      "similarity_scores": {
        "iphone-12-pro": 0.89,
        "samsung-galaxy-s21": 0.76,
        "google-pixel-6": 0.82
      },
      "trust_indicators": {
        "rating": 4.8,
        "review_count": 1250,
        "certified": true,
        "authenticity_verified": true
      }
    }
  ]
}
```

#### **API Endpoints**
```bash
# Get vectorized product data
GET /api/products/{id}?format=vectorized

# Vector similarity search
POST /api/vectors/similarity
{
  "query_vector": [0.123, 0.456, 0.789, ...],
  "limit": 10,
  "threshold": 0.7
}

# Semantic search with vectorization
POST /api/search?format=vectorized
{
  "query": "best smartphone for photography",
  "filters": {
    "price_range": [500, 1200],
    "brands": ["Apple", "Samsung"]
  }
}
```

#### **Vector Generation Process**
1. **Text Preprocessing**: Clean and normalize product descriptions
2. **Embedding Generation**: Use sentence-transformers for vector creation
3. **Semantic Tagging**: Extract relevant tags for similarity matching
4. **Similarity Calculation**: Compute cosine similarity between products
5. **Indexing**: Store vectors for fast retrieval

---

## **2. MCP (Model Context Protocol)**

### **Purpose**
Direct integration with AI models and language models for structured context provision.

### **Use Case**
LLMs accessing structured product data as context for reasoning and decision-making.

### **Specification**

#### **Format Structure**
```json
{
  "format": "mcp",
  "version": "1.0.0",
  "protocol": "model_context",
  "metadata": {
    "client_id": "client-domain",
    "timestamp": "2024-01-01T00:00:00Z",
    "context_type": "product_catalog",
    "model_compatibility": ["gpt-4", "claude-3", "llama-2"]
  },
  "context": {
    "products": [
      {
        "id": "product-123",
        "name": "iPhone 13 Pro",
        "description": "Latest iPhone with advanced camera system and A15 Bionic chip",
        "category": "Electronics > Smartphones",
        "brand": "Apple",
        "price": 999.00,
        "sale_price": 899.00,
        "availability": "in_stock",
        "specifications": {
          "screen_size": "6.1 inches",
          "storage": "256GB",
          "color": "Space Gray",
          "camera": "Triple 12MP camera system",
          "battery": "Up to 22 hours video playback"
        },
        "features": [
          "5G capable",
          "Face ID",
          "MagSafe compatible",
          "Pro camera system",
          "A15 Bionic chip"
        ],
        "reviews": {
          "average_rating": 4.8,
          "total_reviews": 1250,
          "positive_sentiment": 0.92
        },
        "certifications": [
          "ISO 9001",
          "CE Mark",
          "FCC Approved"
        ],
        "compatibility": [
          "iOS 15+",
          "MagSafe accessories",
          "Lightning cables"
        ]
      }
    ],
    "categories": {
      "Electronics": {
        "Smartphones": {
          "count": 45,
          "price_range": [299, 1499],
          "brands": ["Apple", "Samsung", "Google"]
        }
      }
    },
    "search_context": {
      "query": "best smartphone for photography under $1000",
      "decomposed_queries": [
        {"type": "product_category", "value": "smartphone", "priority": "high"},
        {"type": "price_constraint", "value": 1000, "operator": "under", "priority": "high"},
        {"type": "use_case", "value": "photography", "priority": "medium"}
      ],
      "relevant_products": ["product-123", "product-456", "product-789"]
    }
  }
}
```

#### **API Endpoints**
```bash
# Get MCP context for product
GET /api/products/{id}?format=mcp

# Get MCP context for search results
POST /api/search?format=mcp
{
  "query": "best smartphone for photography under $1000",
  "include_context": true,
  "context_depth": "detailed"
}

# Get MCP context for category
GET /api/categories/{category}?format=mcp
```

#### **Context Optimization**
1. **Token Efficiency**: Structured data reduces token consumption by 60-70%
2. **Semantic Clustering**: Group related products for better context
3. **Trust Integration**: Include reviews and certifications in context
4. **Relationship Mapping**: Show product relationships and compatibility

---

## **3. ACP (AI Context Protocol)**

### **Purpose**
Standardized communication between AI agents and data sources for multi-agent coordination.

### **Use Case**
Multi-agent systems coordinating product research, recommendations, and decision-making.

### **Specification**

#### **Format Structure**
```json
{
  "format": "acp",
  "version": "1.0.0",
  "protocol": "ai_context",
  "session": {
    "session_id": "session-abc123",
    "agent_id": "shopping-assistant-001",
    "client_id": "client-domain",
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "request": {
    "type": "product_search",
    "query": "best smartphone for photography under $1000",
    "filters": {
      "price_range": [500, 1000],
      "brands": ["Apple", "Samsung"],
      "features": ["camera", "5G"]
    },
    "context": {
      "user_preferences": {
        "budget": 1000,
        "use_case": "photography",
        "brand_preference": "Apple"
      },
      "previous_searches": [
        "iPhone camera quality",
        "smartphone photography"
      ]
    }
  },
  "response": {
    "status": "success",
    "products": [
      {
        "id": "product-123",
        "name": "iPhone 13 Pro",
        "relevance_score": 0.95,
        "match_reasons": [
          "Excellent camera system",
          "Within budget",
          "Preferred brand"
        ],
        "data": {
          "price": 999.00,
          "camera_specs": "Triple 12MP camera system",
          "photography_features": [
            "ProRAW",
            "Night mode",
            "Portrait mode"
          ],
          "trust_indicators": {
            "rating": 4.8,
            "photography_reviews": 450,
            "certified": true
          }
        }
      }
    ],
    "recommendations": {
      "primary": "iPhone 13 Pro - Best camera in budget",
      "alternatives": [
        "Samsung Galaxy S21 - Good camera, lower price",
        "Google Pixel 6 - Excellent photo processing"
      ],
      "accessories": [
        "Camera lens attachment",
        "Tripod for photography"
      ]
    },
    "next_actions": [
      "Compare camera specifications",
      "Check availability",
      "Read photography reviews"
    ]
  },
  "metadata": {
    "processing_time": 150,
    "sources_consulted": ["product_catalog", "reviews", "specifications"],
    "confidence_score": 0.92
  }
}
```

#### **API Endpoints**
```bash
# ACP product search
POST /api/acp/search
{
  "agent_id": "shopping-assistant-001",
  "query": "best smartphone for photography under $1000",
  "context": {...}
}

# ACP product comparison
POST /api/acp/compare
{
  "agent_id": "comparison-agent-002",
  "products": ["product-123", "product-456"],
  "criteria": ["camera", "price", "battery"]
}

# ACP recommendation request
POST /api/acp/recommend
{
  "agent_id": "recommendation-agent-003",
  "user_profile": {...},
  "preferences": {...}
}
```

#### **Agent Coordination Features**
1. **Session Management**: Track multi-agent conversations
2. **Context Sharing**: Share relevant data between agents
3. **Action Coordination**: Coordinate recommendations and decisions
4. **Trust Propagation**: Share trust indicators across agents

---

## **4. Raw Graph Format**

### **Purpose**
Direct knowledge graph queries and traversal for complex AI reasoning.

### **Use Case**
Complex AI reasoning over product relationships, compatibility analysis, and deep graph traversal.

### **Specification**

#### **Format Structure**
```json
{
  "format": "raw_graph",
  "version": "1.0.0",
  "protocol": "knowledge_graph",
  "metadata": {
    "client_id": "client-domain",
    "timestamp": "2024-01-01T00:00:00Z",
    "graph_type": "product_knowledge_graph",
    "node_count": 1250,
    "edge_count": 3400
  },
  "nodes": [
    {
      "id": "product-123",
      "type": "product",
      "labels": ["Smartphone", "Electronics", "Apple"],
      "properties": {
        "name": "iPhone 13 Pro",
        "brand": "Apple",
        "category": "Electronics > Smartphones",
        "price": 999.00,
        "release_date": "2021-09-24",
        "specifications": {
          "screen_size": "6.1 inches",
          "storage": "256GB",
          "color": "Space Gray"
        }
      }
    },
    {
      "id": "category-smartphones",
      "type": "category",
      "labels": ["Category", "Electronics"],
      "properties": {
        "name": "Smartphones",
        "parent": "Electronics",
        "product_count": 45
      }
    },
    {
      "id": "brand-apple",
      "type": "brand",
      "labels": ["Brand", "Manufacturer"],
      "properties": {
        "name": "Apple",
        "certifications": ["ISO 9001", "CE Mark"],
        "trust_score": 0.95
      }
    }
  ],
  "edges": [
    {
      "id": "edge-001",
      "source": "product-123",
      "target": "category-smartphones",
      "type": "BELONGS_TO",
      "properties": {
        "confidence": 1.0
      }
    },
    {
      "id": "edge-002",
      "source": "product-123",
      "target": "brand-apple",
      "type": "MANUFACTURED_BY",
      "properties": {
        "confidence": 1.0
      }
    },
    {
      "id": "edge-003",
      "source": "product-123",
      "target": "product-456",
      "type": "SIMILAR_TO",
      "properties": {
        "similarity_score": 0.89,
        "shared_features": ["camera", "5G", "premium"]
      }
    },
    {
      "id": "edge-004",
      "source": "product-123",
      "target": "accessory-789",
      "type": "COMPATIBLE_WITH",
      "properties": {
        "compatibility_type": "MagSafe",
        "confidence": 0.95
      }
    }
  ],
  "queries": {
    "cypher": "MATCH (p:Product)-[:BELONGS_TO]->(c:Category {name: 'Smartphones'}) RETURN p",
    "sparql": "SELECT ?product WHERE { ?product rdf:type :Smartphone }",
    "graphql": "query { products(category: 'Smartphones') { id name price } }"
  }
}
```

#### **API Endpoints**
```bash
# Raw graph query (Cypher)
POST /api/graph/query
{
  "query": "MATCH (p:Product)-[:BELONGS_TO]->(c:Category {name: 'Smartphones'}) RETURN p",
  "format": "cypher"
}

# Raw graph query (SPARQL)
POST /api/graph/query
{
  "query": "SELECT ?product WHERE { ?product rdf:type :Smartphone }",
  "format": "sparql"
}

# Raw graph traversal
POST /api/graph/traverse
{
  "start_node": "product-123",
  "max_depth": 3,
  "edge_types": ["SIMILAR_TO", "COMPATIBLE_WITH"]
}

# Raw graph analysis
POST /api/graph/analyze
{
  "analysis_type": "product_relationships",
  "focus_node": "product-123",
  "depth": 2
}
```

#### **Graph Features**
1. **Multi-label Nodes**: Products can belong to multiple categories
2. **Weighted Edges**: Relationship strength and confidence scores
3. **Property-rich**: Detailed attributes and specifications
4. **Query Flexibility**: Support for multiple query languages
5. **Traversal Capabilities**: Deep graph exploration

---

## **Format Comparison**

| Feature | Vectorized | MCP | ACP | Raw Graph |
|---------|------------|-----|-----|-----------|
| **Primary Use** | Semantic Search | LLM Context | Multi-agent | Complex Reasoning |
| **Token Efficiency** | High | Very High | Medium | Low |
| **Query Flexibility** | Medium | High | Very High | Very High |
| **Relationship Depth** | Low | Medium | High | Very High |
| **AI Compatibility** | Search AI | LLMs | Multi-agent | Reasoning AI |
| **Implementation Complexity** | Low | Medium | High | Very High |

---

## **Implementation Guidelines**

### **Format Selection**
- **Vectorized**: Use for semantic search and similarity matching
- **MCP**: Use for LLM context and reasoning
- **ACP**: Use for multi-agent coordination
- **Raw Graph**: Use for complex reasoning and deep analysis

### **Performance Optimization**
- **Caching**: Cache frequently accessed data
- **Indexing**: Index vectors and graph nodes
- **Compression**: Compress large datasets
- **Streaming**: Stream large graph traversals

### **Security Considerations**
- **Client Isolation**: Ensure data scoping per client
- **Access Control**: Implement proper authentication
- **Data Privacy**: Protect sensitive information
- **Rate Limiting**: Prevent abuse

---

**These specifications provide comprehensive data format definitions for the AI-Optimized Subdomain system, enabling efficient AI consumption of e-commerce data.** 