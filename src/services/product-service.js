/**
 * Product Service
 * 
 * Handles product data operations for the AI-optimized subdomain system.
 */

export class ProductService {
  constructor() {
    // Initialize with mock product data
    this.products = new Map();
    this.initializeMockProducts();
  }

  /**
   * Initialize mock product data for testing
   */
  initializeMockProducts() {
    const mockProducts = [
      {
        id: 'apple-gala-001',
        clientId: 'freshapples',
        name: 'Gala Apples',
        description: 'Sweet and crisp Gala apples, perfect for eating fresh or baking. Grown organically in the Pacific Northwest.',
        category: 'fruits',
        price: 4.99,
        currency: 'USD',
        availability: true,
        manufacturer: 'Fresh Apples Orchard',
        model: 'Gala-2024',
        specifications: {
          weight: '2 lbs',
          origin: 'Pacific Northwest',
          organic: true,
          harvestDate: '2024-09-15'
        },
        images: [
          'https://example.com/images/gala-apples-1.jpg',
          'https://example.com/images/gala-apples-2.jpg'
        ],
        tags: ['organic', 'sweet', 'crisp', 'baking', 'fresh-eating'],
        trustScore: 0.92,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'apple-fuji-002',
        clientId: 'freshapples',
        name: 'Fuji Apples',
        description: 'Sweet and juicy Fuji apples with a perfect balance of sweetness and tartness. Excellent for fresh eating.',
        category: 'fruits',
        price: 5.49,
        currency: 'USD',
        availability: true,
        manufacturer: 'Fresh Apples Orchard',
        model: 'Fuji-2024',
        specifications: {
          weight: '2 lbs',
          origin: 'Pacific Northwest',
          organic: true,
          harvestDate: '2024-09-20'
        },
        images: [
          'https://example.com/images/fuji-apples-1.jpg'
        ],
        tags: ['organic', 'sweet', 'juicy', 'fresh-eating'],
        trustScore: 0.89,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'apple-granny-003',
        clientId: 'freshapples',
        name: 'Granny Smith Apples',
        description: 'Tart and crisp Granny Smith apples, perfect for baking pies and making cider. Classic green apple.',
        category: 'fruits',
        price: 4.79,
        currency: 'USD',
        availability: true,
        manufacturer: 'Fresh Apples Orchard',
        model: 'GrannySmith-2024',
        specifications: {
          weight: '2 lbs',
          origin: 'Pacific Northwest',
          organic: true,
          harvestDate: '2024-10-01'
        },
        images: [
          'https://example.com/images/granny-smith-1.jpg'
        ],
        tags: ['organic', 'tart', 'crisp', 'baking', 'cider'],
        trustScore: 0.87,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'laptop-macbook-001',
        clientId: 'techstore',
        name: 'MacBook Pro 14-inch',
        description: 'Powerful 14-inch MacBook Pro with M3 chip, perfect for professionals and creatives.',
        category: 'computers',
        price: 1999.99,
        currency: 'USD',
        availability: true,
        manufacturer: 'Apple Inc.',
        model: 'MacBookPro-14-M3',
        specifications: {
          processor: 'M3 Chip',
          memory: '16GB RAM',
          storage: '512GB SSD',
          display: '14-inch Retina',
          weight: '3.5 lbs'
        },
        images: [
          'https://example.com/images/macbook-pro-1.jpg'
        ],
        tags: ['laptop', 'macbook', 'professional', 'creative', 'apple'],
        trustScore: 0.95,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'phone-iphone-001',
        clientId: 'techstore',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system.',
        category: 'phones',
        price: 999.99,
        currency: 'USD',
        availability: true,
        manufacturer: 'Apple Inc.',
        model: 'iPhone-15-Pro',
        specifications: {
          processor: 'A17 Pro',
          storage: '128GB',
          display: '6.1-inch Super Retina',
          camera: '48MP Main Camera',
          weight: '187g'
        },
        images: [
          'https://example.com/images/iphone-15-pro-1.jpg'
        ],
        tags: ['iphone', 'smartphone', 'camera', 'titanium', 'apple'],
        trustScore: 0.93,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'book-fiction-001',
        clientId: 'bookstore',
        name: 'The Great Gatsby',
        description: 'F. Scott Fitzgerald\'s masterpiece about the Jazz Age and the American Dream.',
        category: 'books',
        price: 12.99,
        currency: 'USD',
        availability: true,
        manufacturer: 'Scribner',
        model: 'Paperback-2024',
        specifications: {
          pages: 180,
          language: 'English',
          format: 'Paperback',
          isbn: '978-0743273565'
        },
        images: [
          'https://example.com/images/great-gatsby-1.jpg'
        ],
        tags: ['fiction', 'classic', 'jazz-age', 'american-dream'],
        trustScore: 0.91,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    mockProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @param {string} clientId - Client ID for isolation
   * @param {object} options - Options for data retrieval
   * @returns {object|null} - Product data or null if not found
   */
  async getProduct(productId, clientId, options = {}) {
    const product = this.products.get(productId);
    
    if (!product || product.clientId !== clientId) {
      return null;
    }

    const result = {
      product: { ...product }
    };

    // Include trust data if requested
    if (options.includeTrust) {
      result.trust = await this.getTrustData(productId, clientId);
    }

    // Include manufacturer data if requested
    if (options.includeManufacturer) {
      result.manufacturer = await this.getManufacturerData(productId, clientId);
    }

    // Include relationships if requested
    if (options.includeRelationships) {
      result.relationships = await this.getProductRelationships(productId, clientId);
    }

    // Format response based on requested format
    return this.formatProductResponse(result, options.format);
  }

  /**
   * Get trust data for a product
   * @param {string} productId - Product ID
   * @param {string} clientId - Client ID
   * @returns {object} - Trust data
   */
  async getTrustData(productId, clientId) {
    // Mock trust data
    const trustData = {
      reviews: [
        {
          id: 'review-001',
          rating: 5,
          comment: 'Excellent quality apples, very fresh and sweet!',
          author: 'John D.',
          date: new Date('2024-01-10'),
          verified: true
        },
        {
          id: 'review-002',
          rating: 4,
          comment: 'Great apples, perfect for baking.',
          author: 'Sarah M.',
          date: new Date('2024-01-08'),
          verified: true
        }
      ],
      ratings: {
        average: 4.5,
        total: 127,
        distribution: {
          5: 89,
          4: 25,
          3: 8,
          2: 3,
          1: 2
        }
      },
      certifications: [
        {
          type: 'organic',
          issuer: 'USDA',
          verified: true,
          date: new Date('2024-01-01')
        }
      ],
      credibility: 0.92
    };

    return trustData;
  }

  /**
   * Get manufacturer data for a product
   * @param {string} productId - Product ID
   * @param {string} clientId - Client ID
   * @returns {object} - Manufacturer data
   */
  async getManufacturerData(productId, clientId) {
    const product = this.products.get(productId);
    if (!product) return null;

    // Mock manufacturer data
    const manufacturerData = {
      name: product.manufacturer,
      officialUrl: 'https://example.com/manufacturer',
      certifications: [
        'ISO 9001',
        'Organic Certification',
        'Fair Trade Certified'
      ],
      verified: true,
      trustScore: 0.95
    };

    return manufacturerData;
  }

  /**
   * Get product relationships
   * @param {string} productId - Product ID
   * @param {string} clientId - Client ID
   * @returns {object} - Product relationships
   */
  async getProductRelationships(productId, clientId) {
    // Mock relationships
    const relationships = {
      similar: [
        {
          id: 'apple-fuji-002',
          name: 'Fuji Apples',
          similarity: 0.85,
          reason: 'Same category and similar characteristics'
        }
      ],
      complementary: [
        {
          id: 'apple-pie-mix-001',
          name: 'Apple Pie Mix',
          complementarity: 0.92,
          useCase: 'Perfect for making apple pie'
        }
      ],
      variations: [
        {
          id: 'apple-gala-large-001',
          name: 'Gala Apples (Large)',
          variationType: 'size',
          price: 6.99
        }
      ]
    };

    return relationships;
  }

  /**
   * Format product response based on requested format
   * @param {object} data - Product data
   * @param {string} format - Requested format
   * @returns {object} - Formatted response
   */
  formatProductResponse(data, format = 'json') {
    switch (format) {
      case 'vector':
        return this.formatVectorResponse(data);
      case 'mcp':
        return this.formatMCPResponse(data);
      case 'acp':
        return this.formatACPResponse(data);
      case 'graph':
        return this.formatGraphResponse(data);
      default:
        return data;
    }
  }

  /**
   * Format vector response
   * @param {object} data - Product data
   * @returns {object} - Vector formatted response
   */
  formatVectorResponse(data) {
    return {
      vector: {
        id: data.product.id,
        vector: this.generateMockVector(768), // Mock 768-dimensional vector
        metadata: {
          clientId: data.product.clientId,
          productId: data.product.id,
          price: data.product.price,
          category: data.product.category,
          trustScore: data.product.trustScore
        }
      }
    };
  }

  /**
   * Format MCP response
   * @param {object} data - Product data
   * @returns {object} - MCP formatted response
   */
  formatMCPResponse(data) {
    return {
      product: data.product,
      trust: data.trust,
      manufacturer: data.manufacturer,
      relationships: data.relationships,
      context: {
        format: 'mcp',
        maxTokens: 4000,
        includeMetadata: true
      }
    };
  }

  /**
   * Format ACP response
   * @param {object} data - Product data
   * @returns {object} - ACP formatted response
   */
  formatACPResponse(data) {
    return {
      sessionId: 'mock-session-id',
      data: {
        product: data.product,
        trust: data.trust,
        manufacturer: data.manufacturer,
        relationships: data.relationships
      },
      metadata: {
        agentId: 'mock-agent-id',
        sessionId: 'mock-session-id',
        processingTime: 150
      }
    };
  }

  /**
   * Format graph response
   * @param {object} data - Product data
   * @returns {object} - Graph formatted response
   */
  formatGraphResponse(data) {
    return {
      nodes: [
        {
          id: data.product.id,
          type: 'product',
          properties: data.product
        }
      ],
      edges: [
        {
          type: 'MANUFACTURED_BY',
          startNode: data.product.id,
          endNode: data.manufacturer?.name,
          properties: {
            verified: data.manufacturer?.verified
          }
        }
      ]
    };
  }

  /**
   * Generate mock vector for testing
   * @param {number} dimensions - Vector dimensions
   * @returns {array} - Mock vector
   */
  generateMockVector(dimensions) {
    return Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @param {string} clientId - Client ID
   * @param {object} options - Search options
   * @returns {object} - Search results
   */
  async searchProducts(query, clientId, options = {}) {
    const { filters = {}, limit = 20, offset = 0 } = options;

    // Filter products by client
    let results = Array.from(this.products.values())
      .filter(product => product.clientId === clientId);

    // Apply filters
    if (filters.category) {
      results = results.filter(product => product.category === filters.category);
    }

    if (filters.priceRange) {
      results = results.filter(product => {
        if (filters.priceRange.min && product.price < filters.priceRange.min) return false;
        if (filters.priceRange.max && product.price > filters.priceRange.max) return false;
        return true;
      });
    }

    if (filters.manufacturer) {
      results = results.filter(product => 
        product.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase())
      );
    }

    if (filters.availability !== undefined) {
      results = results.filter(product => product.availability === filters.availability);
    }

    if (filters.trustScore) {
      results = results.filter(product => product.trustScore >= filters.trustScore);
    }

    // Simple text search
    if (query) {
      const queryLower = query.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(queryLower))
      );
    }

    // Sort by relevance (mock implementation)
    results.sort((a, b) => b.trustScore - a.trustScore);

    // Apply pagination
    const totalResults = results.length;
    const paginatedResults = results.slice(offset, offset + limit);

    return {
      query,
      totalResults,
      results: paginatedResults,
      facets: this.generateFacets(results),
      suggestions: this.generateSuggestions(query)
    };
  }

  /**
   * Generate search facets
   * @param {array} results - Search results
   * @returns {object} - Facets
   */
  generateFacets(results) {
    const categories = {};
    const manufacturers = {};
    const priceRanges = {};
    const trustLevels = {};

    results.forEach(product => {
      // Categories
      categories[product.category] = (categories[product.category] || 0) + 1;

      // Manufacturers
      manufacturers[product.manufacturer] = (manufacturers[product.manufacturer] || 0) + 1;

      // Price ranges
      const priceRange = this.getPriceRange(product.price);
      priceRanges[priceRange] = (priceRanges[priceRange] || 0) + 1;

      // Trust levels
      const trustLevel = this.getTrustLevel(product.trustScore);
      trustLevels[trustLevel] = (trustLevels[trustLevel] || 0) + 1;
    });

    return {
      categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
      manufacturers: Object.entries(manufacturers).map(([name, count]) => ({ name, count })),
      priceRanges: Object.entries(priceRanges).map(([range, count]) => ({ range, count })),
      trustLevels: Object.entries(trustLevels).map(([level, count]) => ({ level, count }))
    };
  }

  /**
   * Get price range for a price
   * @param {number} price - Product price
   * @returns {string} - Price range
   */
  getPriceRange(price) {
    if (price < 10) return '$0-$10';
    if (price < 50) return '$10-$50';
    if (price < 100) return '$50-$100';
    if (price < 500) return '$100-$500';
    return '$500+';
  }

  /**
   * Get trust level for a trust score
   * @param {number} trustScore - Trust score
   * @returns {string} - Trust level
   */
  getTrustLevel(trustScore) {
    if (trustScore >= 0.9) return 'Excellent';
    if (trustScore >= 0.8) return 'Good';
    if (trustScore >= 0.7) return 'Fair';
    return 'Poor';
  }

  /**
   * Generate search suggestions
   * @param {string} query - Search query
   * @returns {array} - Suggestions
   */
  generateSuggestions(query) {
    const suggestions = [];
    
    if (query.toLowerCase().includes('apple')) {
      suggestions.push('Gala Apples', 'Fuji Apples', 'Granny Smith Apples');
    }
    
    if (query.toLowerCase().includes('laptop')) {
      suggestions.push('MacBook Pro', 'Dell XPS', 'Lenovo ThinkPad');
    }
    
    if (query.toLowerCase().includes('book')) {
      suggestions.push('The Great Gatsby', 'To Kill a Mockingbird', '1984');
    }

    return suggestions.slice(0, 5);
  }
}

export default ProductService; 