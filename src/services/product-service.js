/**
 * Product Service
 * 
 * Manages product data and operations for the AI-optimized subdomain system.
 */

export class ProductService {
  constructor() {
    // Initialize with empty product storage - products will be added dynamically
    this.products = new Map();
  }

  /**
   * Create a new product
   * @param {object} productData - Product data
   * @returns {object} - Created product object
   */
  createProduct(productData) {
    const product = {
      id: productData.id,
      clientId: productData.clientId,
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: productData.price,
      currency: productData.currency || 'USD',
      availability: productData.availability !== false,
      manufacturer: productData.manufacturer,
      model: productData.model,
      specifications: productData.specifications || {},
      images: productData.images || [],
      tags: productData.tags || [],
      trustScore: productData.trustScore || 0.8,
      createdAt: productData.createdAt || new Date(),
      updatedAt: new Date(),
      metadata: productData.metadata || {}
    };

    this.products.set(product.id, product);
    return product;
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

    return product;
  }

  /**
   * Get products for a client
   * @param {string} clientId - Client ID
   * @param {object} options - Options for data retrieval
   * @returns {object} - Products data
   */
  async getProducts(clientId, options = {}) {
    const { limit = 50, offset = 0, category, search, sortBy = 'name', sortOrder = 'asc' } = options;
    
    let products = Array.from(this.products.values()).filter(product => product.clientId === clientId);
    
    // Apply category filter
    if (category) {
      products = products.filter(product => product.category === category);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    products.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        [aValue, bValue] = [bValue, aValue];
      }
      
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
    
    // Apply pagination
    const total = products.length;
    products = products.slice(offset, offset + limit);
    
    return {
      products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  /**
   * Update product
   * @param {string} productId - Product ID
   * @param {object} updates - Updates to apply
   * @param {string} clientId - Client ID for isolation
   * @returns {object|null} - Updated product or null if not found
   */
  async updateProduct(productId, updates, clientId) {
    const product = this.products.get(productId);
    
    if (!product || product.clientId !== clientId) {
      return null;
    }
    
    Object.assign(product, updates);
    product.updatedAt = new Date();
    
    this.products.set(productId, product);
    return product;
  }

  /**
   * Delete product
   * @param {string} productId - Product ID
   * @param {string} clientId - Client ID for isolation
   * @returns {boolean} - Success status
   */
  async deleteProduct(productId, clientId) {
    const product = this.products.get(productId);
    
    if (!product || product.clientId !== clientId) {
      return false;
    }
    
    this.products.delete(productId);
    return true;
  }

  /**
   * Get product statistics
   * @param {string} clientId - Client ID
   * @returns {object} - Product statistics
   */
  async getProductStats(clientId) {
    const products = Array.from(this.products.values()).filter(product => product.clientId === clientId);
    
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.availability).length;
    const averagePrice = products.length > 0 ? 
      products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length : 0;
    const averageTrustScore = products.length > 0 ? 
      products.reduce((sum, p) => sum + (p.trustScore || 0), 0) / products.length : 0;
    
    const categories = [...new Set(products.map(p => p.category))];
    const manufacturers = [...new Set(products.map(p => p.manufacturer).filter(Boolean))];
    
    return {
      totalProducts,
      availableProducts,
      averagePrice,
      averageTrustScore,
      categoryCount: categories.length,
      manufacturerCount: manufacturers.length,
      categories,
      manufacturers
    };
  }

  /**
   * Bulk import products
   * @param {Array} productsData - Array of product data
   * @param {string} clientId - Client ID
   * @returns {object} - Import results
   */
  async bulkImportProducts(productsData, clientId) {
    const results = {
      imported: 0,
      updated: 0,
      errors: [],
      total: productsData.length
    };
    
    for (const productData of productsData) {
      try {
        const productId = productData.id || `${clientId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        if (this.products.has(productId)) {
          await this.updateProduct(productId, productData, clientId);
          results.updated++;
        } else {
          this.createProduct({
            ...productData,
            id: productId,
            clientId
          });
          results.imported++;
        }
      } catch (error) {
        results.errors.push({
          product: productData.name || productData.id,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Get trust data for a product
   * @param {string} productId - Product ID
   * @param {string} clientId - Client ID
   * @returns {object} - Trust data
   */
  async getTrustData(productId, clientId) {
    const product = this.products.get(productId);
    if (!product || product.clientId !== clientId) {
      return null;
    }

    // In a real implementation, this would fetch from a trust service
    // For now, return basic trust data
    return {
      productId,
      clientId,
      trustScore: product.trustScore || 0.8,
      credibility: 0.85,
      lastUpdated: new Date(),
      sources: ['product_data', 'manufacturer_verification'],
      metadata: {
        source: 'product_service',
        clientId: clientId
      }
    };
  }

  /**
   * Get manufacturer data for a product
   * @param {string} productId - Product ID
   * @param {string} clientId - Client ID
   * @returns {object} - Manufacturer data
   */
  async getManufacturerData(productId, clientId) {
    const product = this.products.get(productId);
    if (!product || product.clientId !== clientId) {
      return null;
    }

    // In a real implementation, this would fetch from a manufacturer service
    return {
      name: product.manufacturer,
      officialUrl: null,
      certifications: [],
      verified: false,
      trustScore: 0.8,
      metadata: {
        source: 'product_data',
        clientId: clientId
      }
    };
  }

  /**
   * Get product relationships
   * @param {string} productId - Product ID
   * @param {string} clientId - Client ID
   * @returns {object} - Product relationships
   */
  async getProductRelationships(productId, clientId) {
    const product = this.products.get(productId);
    if (!product || product.clientId !== clientId) {
      return null;
    }

    // Find related products (same category, manufacturer, or similar tags)
    const relatedProducts = Array.from(this.products.values())
      .filter(p => p.clientId === clientId && p.id !== productId)
      .filter(p => 
        p.category === product.category ||
        p.manufacturer === product.manufacturer ||
        p.tags.some(tag => product.tags.includes(tag))
      )
      .slice(0, 5);

    return {
      productId,
      relatedProducts,
      category: product.category,
      manufacturer: product.manufacturer,
      tags: product.tags
    };
  }
}

export default ProductService; 