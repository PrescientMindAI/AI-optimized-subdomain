/**
 * Category Service
 * 
 * Manages category data and operations for the AI-optimized subdomain system.
 */

export class CategoryService {
  constructor() {
    // Initialize with empty category storage - categories will be added dynamically
    this.categories = new Map();
  }

  /**
   * Create a new category
   * @param {object} categoryData - Category data
   * @returns {object} - Created category object
   */
  createCategory(categoryData) {
    const category = {
      id: categoryData.id,
      clientId: categoryData.clientId,
      name: categoryData.name,
      description: categoryData.description || '',
      level: categoryData.level || 1,
      parentId: categoryData.parentId || null,
      productCount: categoryData.productCount || 0,
      averagePrice: categoryData.averagePrice || 0,
      averageTrustScore: categoryData.averageTrustScore || 0,
      tags: categoryData.tags || [],
      createdAt: categoryData.createdAt || new Date(),
      updatedAt: new Date(),
      metadata: categoryData.metadata || {}
    };

    this.categories.set(category.id, category);
    return category;
  }

  /**
   * Get categories for a client
   * @param {string} clientId - Client ID
   * @param {object} options - Options for category retrieval
   * @returns {object} - Categories data
   */
  async getCategories(clientId, options = {}) {
    const { level, parentId, includeStats = false } = options;
    
    let categories = Array.from(this.categories.values()).filter(category => category.clientId === clientId);
    
    // Apply level filter
    if (level !== undefined) {
      categories = categories.filter(category => category.level === level);
    }
    
    // Apply parent filter
    if (parentId !== undefined) {
      categories = categories.filter(category => category.parentId === parentId);
    }
    
    // Sort by level, then by name
    categories.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });
    
    // Include statistics if requested
    if (includeStats) {
      categories = categories.map(category => ({
        ...category,
        stats: this.calculateCategoryStats(category.id, clientId)
      }));
    }
    
    return {
      categories,
      total: categories.length,
      levels: [...new Set(categories.map(c => c.level))].sort()
    };
  }

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @param {string} clientId - Client ID for isolation
   * @returns {object|null} - Category data or null if not found
   */
  async getCategory(categoryId, clientId) {
    const category = this.categories.get(categoryId);
    
    if (!category || category.clientId !== clientId) {
      return null;
    }
    
    return category;
  }

  /**
   * Update category
   * @param {string} categoryId - Category ID
   * @param {object} updates - Updates to apply
   * @param {string} clientId - Client ID for isolation
   * @returns {object|null} - Updated category or null if not found
   */
  async updateCategory(categoryId, updates, clientId) {
    const category = this.categories.get(categoryId);
    
    if (!category || category.clientId !== clientId) {
      return null;
    }
    
    Object.assign(category, updates);
    category.updatedAt = new Date();
    
    this.categories.set(categoryId, category);
    return category;
  }

  /**
   * Delete category
   * @param {string} categoryId - Category ID
   * @param {string} clientId - Client ID for isolation
   * @returns {boolean} - Success status
   */
  async deleteCategory(categoryId, clientId) {
    const category = this.categories.get(categoryId);
    
    if (!category || category.clientId !== clientId) {
      return false;
    }
    
    // Check if category has children
    const hasChildren = Array.from(this.categories.values()).some(c => 
      c.clientId === clientId && c.parentId === categoryId
    );
    
    if (hasChildren) {
      throw new Error('Cannot delete category with subcategories');
    }
    
    this.categories.delete(categoryId);
    return true;
  }

  /**
   * Get category hierarchy
   * @param {string} clientId - Client ID
   * @returns {object} - Category hierarchy
   */
  async getCategoryHierarchy(clientId) {
    const categories = Array.from(this.categories.values()).filter(c => c.clientId === clientId);
    
    const buildHierarchy = (parentId = null) => {
      return categories
        .filter(c => c.parentId === parentId)
        .map(category => ({
          ...category,
          children: buildHierarchy(category.id)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    };
    
    return buildHierarchy();
  }

  /**
   * Get products for a category
   * @param {string} categoryId - Category ID
   * @param {string} clientId - Client ID
   * @returns {array} - Products array
   */
  getProductsForCategory(categoryId, clientId) {
    // In a real implementation, this would query the product service
    // For now, return empty array - products will be managed by product service
    return [];
  }

  /**
   * Calculate category statistics
   * @param {string} categoryId - Category ID
   * @param {string} clientId - Client ID
   * @returns {object} - Category statistics
   */
  calculateCategoryStats(categoryId, clientId) {
    const category = this.categories.get(categoryId);
    if (!category || category.clientId !== clientId) {
      return null;
    }
    
    // Get all subcategories
    const subcategories = Array.from(this.categories.values()).filter(c => 
      c.clientId === clientId && this.isDescendant(c.id, categoryId, clientId)
    );
    
    return {
      totalCategories: subcategories.length + 1,
      totalProducts: category.productCount,
      averagePrice: category.averagePrice,
      averageTrustScore: category.averageTrustScore,
      level: category.level,
      hasChildren: subcategories.length > 0
    };
  }

  /**
   * Check if a category is a descendant of another
   * @param {string} categoryId - Category ID to check
   * @param {string} ancestorId - Ancestor category ID
   * @param {string} clientId - Client ID
   * @returns {boolean} - Whether category is descendant
   */
  isDescendant(categoryId, ancestorId, clientId) {
    const category = this.categories.get(categoryId);
    if (!category || category.clientId !== clientId) {
      return false;
    }
    
    if (category.parentId === ancestorId) {
      return true;
    }
    
    if (category.parentId) {
      return this.isDescendant(category.parentId, ancestorId, clientId);
    }
    
    return false;
  }

  /**
   * Bulk import categories
   * @param {Array} categoriesData - Array of category data
   * @param {string} clientId - Client ID
   * @returns {object} - Import results
   */
  async bulkImportCategories(categoriesData, clientId) {
    const results = {
      imported: 0,
      updated: 0,
      errors: [],
      total: categoriesData.length
    };
    
    for (const categoryData of categoriesData) {
      try {
        const categoryId = categoryData.id || `${clientId}-category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        if (this.categories.has(categoryId)) {
          await this.updateCategory(categoryId, categoryData, clientId);
          results.updated++;
        } else {
          this.createCategory({
            ...categoryData,
            id: categoryId,
            clientId
          });
          results.imported++;
        }
      } catch (error) {
        results.errors.push({
          category: categoryData.name || categoryData.id,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Get category statistics
   * @param {string} clientId - Client ID
   * @returns {object} - Category statistics
   */
  async getCategoryStats(clientId) {
    const categories = Array.from(this.categories.values()).filter(c => c.clientId === clientId);
    
    const totalCategories = categories.length;
    const levels = [...new Set(categories.map(c => c.level))];
    const averageProducts = categories.length > 0 ? 
      categories.reduce((sum, c) => sum + c.productCount, 0) / categories.length : 0;
    const averageTrustScore = categories.length > 0 ? 
      categories.reduce((sum, c) => sum + c.averageTrustScore, 0) / categories.length : 0;
    
    return {
      totalCategories,
      levels: levels.sort(),
      averageProducts,
      averageTrustScore,
      topCategories: categories
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, 5)
        .map(c => ({ id: c.id, name: c.name, productCount: c.productCount }))
    };
  }
}

export default CategoryService; 