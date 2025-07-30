/**
 * JSON-LD Format
 * 
 * Provides JSON-LD (JSON for Linked Data) format compatibility
 * while maintaining AI optimization features from our knowledge graph.
 */

export const JSONLDFormat = {
  /**
   * Convert our knowledge graph product to JSON-LD format
   * @param {Object} product - Our knowledge graph product
   * @param {string} baseUrl - Base URL for the subdomain
   * @returns {Object} JSON-LD formatted product
   */
  formatProduct(product, baseUrl = 'https://ai.example.com') {
    // Helper function to create offers from our product data
    const createOffers = (product) => {
      if (!product.offers || product.offers.length === 0) {
        // Create default offer from main product data
        return [{
          "@type": "Offer",
          "name": product.name,
          "price": product.price,
          "priceCurrency": product.currency,
          "availability": product.availability ? 
            "https://schema.org/InStock" : 
            "https://schema.org/OutOfStock",
          "sku": product.model,
          "itemCondition": "https://schema.org/NewCondition",
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          "seller": {
            "@type": "Organization",
            "name": product.manufacturer
          }
        }];
      }

      return product.offers.map(offer => ({
        "@type": "Offer",
        "name": `${product.name} - ${offer.sku}`,
        "price": offer.price,
        "priceCurrency": offer.currency,
        "availability": offer.availability ? 
          "https://schema.org/InStock" : 
          "https://schema.org/OutOfStock",
        "sku": offer.sku,
        "itemCondition": "https://schema.org/NewCondition",
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "seller": {
          "@type": "Organization",
          "name": product.manufacturer
        },
        ...(offer.weight && { "weight": offer.weight }),
        ...(offer.weightUnit && { "weightUnit": offer.weightUnit })
      }));
    };

    // Helper function to create additional properties
    const createAdditionalProperties = (product) => {
      const properties = [
        {
          "@type": "PropertyValue",
          "name": "trustScore",
          "value": product.trustScore
        },
        {
          "@type": "PropertyValue",
          "name": "category",
          "value": product.category
        },
        {
          "@type": "PropertyValue",
          "name": "clientId",
          "value": product.clientId
        }
      ];

      // Add tags as additional properties
      if (product.tags && product.tags.length > 0) {
        properties.push({
          "@type": "PropertyValue",
          "name": "tags",
          "value": product.tags.join(', ')
        });
      }

      // Add specifications as additional properties
      if (product.specifications) {
        Object.entries(product.specifications).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            properties.push({
              "@type": "PropertyValue",
              "name": key,
              "value": value.toString()
            });
          }
        });
      }

      return properties;
    };

    // Create product slug for URLs
    const productSlug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return {
      "@type": "Product",
      "@id": `${baseUrl}/products/${productSlug}#product`,
      "name": product.name,
      "description": product.description,
      "image": product.images,
      "brand": {
        "@type": "Brand",
        "name": product.manufacturer
      },
      "sku": product.model,
      "url": `${baseUrl}/products/${productSlug}`,
      "offers": createOffers(product),
      "additionalProperty": createAdditionalProperties(product),
      // AI-optimized properties
      "aiOptimized": {
        "vectorEmbedding": product.vectorEmbedding || null,
        "semanticTags": product.tags || [],
        "trustScore": product.trustScore,
        "relationships": product.relationships || [],
        "knowledgeGraphId": product.id
      }
    };
  },

  /**
   * Convert multiple products to JSON-LD graph format
   * @param {Array} products - Array of our knowledge graph products
   * @param {string} baseUrl - Base URL for the subdomain
   * @returns {Object} JSON-LD graph with all products
   */
  formatProductGraph(products, baseUrl = 'https://ai.example.com') {
    return {
      "@context": "https://schema.org",
      "@graph": products.map(product => this.formatProduct(product, baseUrl))
    };
  },

  /**
   * Convert our knowledge graph to JSON-LD format
   * @param {Object} knowledgeGraph - Our knowledge graph data
   * @param {string} baseUrl - Base URL for the subdomain
   * @returns {Object} Complete JSON-LD knowledge graph
   */
  formatKnowledgeGraph(knowledgeGraph, baseUrl = 'https://ai.example.com') {
    const graph = [];

    // Add products
    if (knowledgeGraph.products) {
      knowledgeGraph.products.forEach(product => {
        graph.push(this.formatProduct(product, baseUrl));
      });
    }

    // Add manufacturers
    if (knowledgeGraph.manufacturers) {
      knowledgeGraph.manufacturers.forEach(manufacturer => {
        graph.push({
          "@type": "Organization",
          "@id": `${baseUrl}/manufacturers/${manufacturer.id}#manufacturer`,
          "name": manufacturer.name,
          "url": manufacturer.officialUrl,
          "trustScore": manufacturer.trustScore,
          "verified": manufacturer.verified,
          "certifications": manufacturer.certifications
        });
      });
    }

    // Add categories
    if (knowledgeGraph.categories) {
      knowledgeGraph.categories.forEach(category => {
        graph.push({
          "@type": "CategoryCode",
          "@id": `${baseUrl}/categories/${category.id}#category`,
          "name": category.name,
          "description": category.description,
          "parentCategory": category.parentId ? 
            `${baseUrl}/categories/${category.parentId}#category` : null,
          "level": category.level
        });
      });
    }

    // Add trust data
    if (knowledgeGraph.trustData) {
      knowledgeGraph.trustData.forEach(trust => {
        graph.push({
          "@type": "Review",
          "@id": `${baseUrl}/trust/${trust.id}#review`,
          "itemReviewed": `${baseUrl}/products/${trust.productId}#product`,
          "reviewBody": trust.value,
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": trust.credibility * 5, // Convert 0-1 to 0-5 scale
            "bestRating": 5
          },
          "author": {
            "@type": "Organization",
            "name": trust.source
          },
          "datePublished": trust.date,
          "verified": trust.verified
        });
      });
    }

    return {
      "@context": "https://schema.org",
      "@graph": graph
    };
  },

  /**
   * Create LLM discovery file content
   * @param {string} baseUrl - Base URL for the subdomain
   * @returns {string} LLM discovery file content
   */
  createLLMDiscoveryFile(baseUrl = 'https://ai.example.com') {
    return `llm-graph: ${baseUrl}/products.json
llm-vectors: ${baseUrl}/api/vectors
llm-mcp: ${baseUrl}/api/mcp
llm-acp: ${baseUrl}/api/acp
llm-graphql: ${baseUrl}/api/graphql`;
  }
}; 