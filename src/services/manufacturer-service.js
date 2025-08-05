/**
 * Manufacturer Service
 * 
 * Handles manufacturer data and verification for the AI-optimized subdomain system.
 */

export class ManufacturerService {
  constructor() {
    // Initialize with empty manufacturer storage - manufacturers will be added dynamically
    this.manufacturers = new Map();
  }

  /**
   * Create a new manufacturer
   * @param {object} manufacturerData - Manufacturer data
   * @returns {object} - Created manufacturer object
   */
  createManufacturer(manufacturerData) {
    const manufacturer = {
      id: manufacturerData.id,
      name: manufacturerData.name,
      officialUrl: manufacturerData.officialUrl || null,
      certifications: manufacturerData.certifications || [],
      verified: manufacturerData.verified || false,
      trustScore: manufacturerData.trustScore || 0.8,
      createdAt: manufacturerData.createdAt || new Date(),
      updatedAt: new Date(),
      metadata: manufacturerData.metadata || {}
    };

    this.manufacturers.set(manufacturer.id, manufacturer);
    return manufacturer;
  }

  /**
   * Get manufacturer by ID
   * @param {string} manufacturerId - Manufacturer ID
   * @returns {object|null} - Manufacturer data or null if not found
   */
  async getManufacturer(manufacturerId) {
    return this.manufacturers.get(manufacturerId) || null;
  }

  /**
   * Get manufacturer by name
   * @param {string} name - Manufacturer name
   * @returns {object|null} - Manufacturer data or null if not found
   */
  async getManufacturerByName(name) {
    for (const [id, manufacturer] of this.manufacturers) {
      if (manufacturer.name.toLowerCase() === name.toLowerCase()) {
        return manufacturer;
      }
    }
    return null;
  }

  /**
   * Update manufacturer
   * @param {string} manufacturerId - Manufacturer ID
   * @param {object} updates - Updates to apply
   * @returns {object|null} - Updated manufacturer or null if not found
   */
  async updateManufacturer(manufacturerId, updates) {
    const manufacturer = this.manufacturers.get(manufacturerId);
    
    if (!manufacturer) {
      return null;
    }
    
    Object.assign(manufacturer, updates);
    manufacturer.updatedAt = new Date();
    
    this.manufacturers.set(manufacturerId, manufacturer);
    return manufacturer;
  }

  /**
   * Delete manufacturer
   * @param {string} manufacturerId - Manufacturer ID
   * @returns {boolean} - Success status
   */
  async deleteManufacturer(manufacturerId) {
    if (!this.manufacturers.has(manufacturerId)) {
      return false;
    }
    
    this.manufacturers.delete(manufacturerId);
    return true;
  }

  /**
   * Get all manufacturers
   * @param {object} options - Options for retrieval
   * @returns {object} - Manufacturers data
   */
  async getManufacturers(options = {}) {
    const { limit = 50, offset = 0, verified, search, sortBy = 'name', sortOrder = 'asc' } = options;
    
    let manufacturers = Array.from(this.manufacturers.values());
    
    // Apply verified filter
    if (verified !== undefined) {
      manufacturers = manufacturers.filter(m => m.verified === verified);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      manufacturers = manufacturers.filter(m => 
        m.name.toLowerCase().includes(searchLower) ||
        m.certifications.some(cert => cert.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    manufacturers.sort((a, b) => {
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
    const total = manufacturers.length;
    manufacturers = manufacturers.slice(offset, offset + limit);
    
    return {
      manufacturers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
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
    // In a real implementation, this would look up the manufacturer from the product
    // For now, return basic manufacturer data
    return {
      name: 'Unknown Manufacturer',
      officialUrl: null,
      certifications: [],
      verified: false,
      trustScore: 0.8,
      metadata: {
        source: 'manufacturer_service',
        clientId: clientId,
        productId: productId
      }
    };
  }

  /**
   * Verify manufacturer
   * @param {string} manufacturerId - Manufacturer ID
   * @param {object} verificationData - Verification data
   * @returns {object} - Verification result
   */
  async verifyManufacturer(manufacturerId, verificationData) {
    const manufacturer = this.manufacturers.get(manufacturerId);
    
    if (!manufacturer) {
      throw new Error('Manufacturer not found');
    }
    
    const verification = {
      verified: verificationData.verified || false,
      verificationDate: new Date(),
      verificationMethod: verificationData.method || 'manual',
      verifier: verificationData.verifier || 'system',
      notes: verificationData.notes || '',
      trustScore: verificationData.trustScore || manufacturer.trustScore
    };
    
    manufacturer.verified = verification.verified;
    manufacturer.trustScore = verification.trustScore;
    manufacturer.verification = verification;
    manufacturer.updatedAt = new Date();
    
    this.manufacturers.set(manufacturerId, manufacturer);
    
    return {
      manufacturer,
      verification
    };
  }

  /**
   * Add certification to manufacturer
   * @param {string} manufacturerId - Manufacturer ID
   * @param {object} certification - Certification data
   * @returns {object} - Updated manufacturer
   */
  async addCertification(manufacturerId, certification) {
    const manufacturer = this.manufacturers.get(manufacturerId);
    
    if (!manufacturer) {
      throw new Error('Manufacturer not found');
    }
    
    const newCertification = {
      name: certification.name,
      issuer: certification.issuer,
      issueDate: certification.issueDate || new Date(),
      expiryDate: certification.expiryDate,
      verified: certification.verified || false,
      certificateId: certification.certificateId
    };
    
    manufacturer.certifications.push(newCertification);
    manufacturer.updatedAt = new Date();
    
    this.manufacturers.set(manufacturerId, manufacturer);
    return manufacturer;
  }

  /**
   * Bulk import manufacturers
   * @param {Array} manufacturersData - Array of manufacturer data
   * @returns {object} - Import results
   */
  async bulkImportManufacturers(manufacturersData) {
    const results = {
      imported: 0,
      updated: 0,
      errors: [],
      total: manufacturersData.length
    };
    
    for (const manufacturerData of manufacturersData) {
      try {
        const manufacturerId = manufacturerData.id || `manufacturer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        if (this.manufacturers.has(manufacturerId)) {
          await this.updateManufacturer(manufacturerId, manufacturerData);
          results.updated++;
        } else {
          this.createManufacturer({
            ...manufacturerData,
            id: manufacturerId
          });
          results.imported++;
        }
      } catch (error) {
        results.errors.push({
          manufacturer: manufacturerData.name || manufacturerData.id,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Get manufacturer statistics
   * @returns {object} - Manufacturer statistics
   */
  async getManufacturerStats() {
    const manufacturers = Array.from(this.manufacturers.values());
    
    const totalManufacturers = manufacturers.length;
    const verifiedManufacturers = manufacturers.filter(m => m.verified).length;
    const averageTrustScore = manufacturers.length > 0 ? 
      manufacturers.reduce((sum, m) => sum + m.trustScore, 0) / manufacturers.length : 0;
    
    const certifications = manufacturers.reduce((acc, m) => {
      m.certifications.forEach(cert => {
        acc[cert.name] = (acc[cert.name] || 0) + 1;
      });
      return acc;
    }, {});
    
    return {
      totalManufacturers,
      verifiedManufacturers,
      averageTrustScore,
      topCertifications: Object.entries(certifications)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))
    };
  }
}

export default ManufacturerService; 