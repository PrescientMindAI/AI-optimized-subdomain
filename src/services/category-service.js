/**
 * Category Service
 * 
 * Handles category hierarchies and relationships for the AI-optimized subdomain system.
 */

export class CategoryService {
  constructor() {
    // Initialize mock category data
    this.categories = new Map();
    this.initializeMockCategories();
  }

  /**
   * Initialize mock category data
   */
  initializeMockCategories() {
    const mockCategories = [
      // Fresh Apples categories
      {
        id: 'fruits',
        clientId: 'freshapples',
        name: 'Fruits',
        description: 'Fresh fruits and berries',
        level: 1,
        parentId: null,
        productCount: 3,
        averagePrice: 5.09,
        averageTrustScore: 0.89,
        tags: ['fresh', 'organic', 'seasonal']
      },
      {
        id: 'vegetables',
        clientId: 'freshapples',
        name: 'Vegetables',
        description: 'Fresh vegetables and greens',
        level: 1,
        parentId: null,
        productCount: 0,
        averagePrice: 0,
        averageTrustScore: 0,
        tags: ['fresh', 'organic', 'local']
      },
      {
        id: 'apples',
        clientId: 'freshapples',
        name: 'Apples',
        description: 'Fresh apples in various varieties',
        level: 2,
        parentId: 'fruits',
        productCount: 3,
        averagePrice: 5.09,
        averageTrustScore: 0.89,
        tags: ['sweet', 'crisp', 'baking']
      },

      // Tech Store categories
      {
        id: 'computers',
        clientId: 'techstore',
        name: 'Computers',
        description: 'Laptops, desktops, and accessories',
        level: 1,
        parentId: null,
        productCount: 1,
        averagePrice: 1999.99,
        averageTrustScore: 0.95,
        tags: ['professional', 'gaming', 'business']
      },
      {
        id: 'phones',
        clientId: 'techstore',
        name: 'Phones',
        description: 'Smartphones and mobile devices',
        level: 1,
        parentId: null,
        productCount: 1,
        averagePrice: 999.99,
        averageTrustScore: 0.93,
        tags: ['mobile', 'camera', '5g']
      },
      {
        id: 'laptops',
        clientId: 'techstore',
        name: 'Laptops',
        description: 'Portable computers and notebooks',
        level: 2,
        parentId: 'computers',
        productCount: 1,
        averagePrice: 1999.99,
        averageTrustScore: 0.95,
        tags: ['portable', 'professional', 'creative']
      },

      // Bookstore categories
      {
        id: 'books',
        clientId: 'bookstore',
        name: 'Books',
        description: 'Books in various formats',
        level: 1,
        parentId: null,
        productCount: 1,
        averagePrice: 12.99,
        averageTrustScore: 0.91,
        tags: ['reading', 'knowledge', 'entertainment']
      },
      {
        id: 'fiction',
        clientId: 'bookstore',
        name: 'Fiction',
        description: 'Fiction books and novels',
        level: 2,
        parentId: 'books',
        productCount: 1,
        averagePrice: 12.99,
        averageTrustScore: 0.91,
        tags: ['stories', 'imagination', 'classics']
      }
    ];

    mockCategories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  /**
   * Get categories for a client
   * @param {string} clientId - Client ID
   * @param {object} options - Options for category retrieval
   * @returns {object} - Categories data
   */
  async getCategories(clientId, options = {}) {
    const { parentId, level, includeProducts, includeStats } = options;

    // Filter categories by client
    let categories = Array.from(this.categories.values())
      .filter(category => category.clientId === clientId);

    // Filter by parent ID if specified
    if (parentId) {
      categories = categories.filter(category => category.parentId === parentId);
    }

    // Filter by level if specified
    if (level !== undefined) {
      categories = categories.filter(category => category.level === level);
    }

    // Include products if requested
    if (includeProducts) {
      categories = categories.map(category => ({
        ...category,
        products: this.getProductsForCategory(category.id, clientId)
      }));
    }

    // Include stats if requested
    if (includeStats) {
      categories = categories.map(category => ({
        ...category,
        stats: this.getCategoryStats(category.id, clientId)
      }));
    }

    // Build hierarchy if no specific parent is requested
    if (!parentId) {
      return {
        categories,
        hierarchy: this.buildHierarchy(categories)
      };
    }

    return {
      categories
    };
  }

  /**
   * Get products for a category
   * @param {string} categoryId - Category ID
   * @param {string} clientId - Client ID
   * @returns {array} - Products array
   */
  getProductsForCategory(categoryId, clientId) {
    // Mock product data - in real implementation, this would query the product service
    const categoryProducts = {
      'fruits': [
        { id: 'apple-gala-001', name: 'Gala Apples', price: 4.99 },
        { id: 'apple-fuji-002', name: 'Fuji Apples', price: 5.49 },
        { id: 'apple-granny-003', name: 'Granny Smith Apples', price: 4.79 }
      ],
      'apples': [
        { id: 'apple-gala-001', name: 'Gala Apples', price: 4.99 },
        { id: 'apple-fuji-002', name: 'Fuji Apples', price: 5.49 },
        { id: 'apple-granny-003', name: 'Granny Smith Apples', price: 4.79 }
      ],
      'computers': [
        { id: 'laptop-macbook-001', name: 'MacBook Pro 14-inch', price: 1999.99 }
      ],
      'laptops': [
        { id: 'laptop-macbook-001', name: 'MacBook Pro 14-inch', price: 1999.99 }
      ],
      'phones': [
        { id: 'phone-iphone-001', name: 'iPhone 15 Pro', price: 999.99 }
      ],
      'books': [
        { id: 'book-fiction-001', name: 'The Great Gatsby', price: 12.99 }
      ],
      'fiction': [
        { id: 'book-fiction-001', name: 'The Great Gatsby', price: 12.99 }
      ]
    };

    return categoryProducts[categoryId] || [];
  }

  /**
   * Get category statistics
   * @param {string} categoryId - Category ID
   * @param {string} clientId - Client ID
   * @returns {object} - Category statistics
   */
  getCategoryStats(categoryId, clientId) {
    const category = this.categories.get(categoryId);
    if (!category || category.clientId !== clientId) {
      return {
        productCount: 0,
        averagePrice: 0,
        averageTrustScore: 0,
        subcategories: 0
      };
    }

    // Count subcategories
    const subcategories = Array.from(this.categories.values())
      .filter(cat => cat.parentId === categoryId && cat.clientId === clientId)
      .length;

    return {
      productCount: category.productCount,
      averagePrice: category.averagePrice,
      averageTrustScore: category.averageTrustScore,
      subcategories
    };
  }

  /**
   * Build category hierarchy
   * @param {array} categories - Categories array
   * @returns {object} - Hierarchy tree
   */
  buildHierarchy(categories) {
    const hierarchy = {};
    const categoryMap = new Map();

    // Create a map for easy lookup
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree
    categories.forEach(category => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        hierarchy[category.id] = categoryMap.get(category.id);
      }
    });

    return hierarchy;
  }

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @param {string} clientId - Client ID
   * @returns {object|null} - Category data or null
   */
  async getCategory(categoryId, clientId) {
    const category = this.categories.get(categoryId);
    
    if (!category || category.clientId !== clientId) {
      return null;
    }

    return category;
  }

  /**
   * Get category path (breadcrumb)
   * @param {string} categoryId - Category ID
   * @param {string} clientId - Client ID
   * @returns {array} - Category path
   */
  async getCategoryPath(categoryId, clientId) {
    const path = [];
    let currentCategory = this.categories.get(categoryId);

    while (currentCategory && currentCategory.clientId === clientId) {
      path.unshift(currentCategory);
      currentCategory = currentCategory.parentId ? 
        this.categories.get(currentCategory.parentId) : null;
    }

    return path;
  }

  /**
   * Search categories
   * @param {string} query - Search query
   * @param {string} clientId - Client ID
   * @param {object} options - Search options
   * @returns {array} - Search results
   */
  async searchCategories(query, clientId, options = {}) {
    const { limit = 20, level = null } = options;

    let categories = Array.from(this.categories.values())
      .filter(category => category.clientId === clientId);

    // Filter by level if specified
    if (level !== null) {
      categories = categories.filter(category => category.level === level);
    }

    // Apply search query
    if (query) {
      const queryLower = query.toLowerCase();
      categories = categories.filter(category => 
        category.name.toLowerCase().includes(queryLower) ||
        category.description.toLowerCase().includes(queryLower) ||
        category.tags.some(tag => tag.toLowerCase().includes(queryLower))
      );
    }

    // Sort by relevance (mock implementation)
    categories.sort((a, b) => b.productCount - a.productCount);

    return categories.slice(0, limit);
  }

  /**
   * Get category suggestions
   * @param {string} query - Search query
   * @param {string} clientId - Client ID
   * @returns {array} - Category suggestions
   */
  async getCategorySuggestions(query, clientId) {
    const categories = await this.searchCategories(query, clientId, { limit: 5 });
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      level: category.level
    }));
  }
}

export default CategoryService; 