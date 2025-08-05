/**
 * Zoho Inventory CSV Importer
 * 
 * Handles Zoho Inventory CSV exports with French field names
 * Supports: Item ID, Item Name, Sales Description, Selling Price, etc.
 * French fields: Nom de catégorie, Catégorie parente, Poids du colis, etc.
 */

import fs from 'fs';
import csv from 'csv-parser';
import { DataIngestionService } from './data-ingestion-service.js';

export class ZohoInventoryImporter {
  constructor(dataIngestionService) {
    this.dataIngestionService = dataIngestionService;
  }

  /**
   * Import Zoho Inventory CSV data
   * @param {string} csvFilePath - Path to the CSV file
   * @param {string} clientId - Client identifier
   * @returns {Object} Import results with statistics
   */
  async importZohoCSV(csvFilePath, clientId) {
    const results = {
      products: 0,
      categories: 0,
      manufacturers: 0,
      errors: [],
      warnings: [],
      summary: {
        totalRows: 0,
        processedRows: 0,
        skippedRows: 0
      }
    };

    try {
      console.log(`Starting Zoho Inventory CSV import for client: ${clientId}`);
      console.log(`CSV file: ${csvFilePath}`);

      const csvData = await this.parseCSV(csvFilePath);
      results.summary.totalRows = csvData.length;

      console.log(`Found ${csvData.length} rows in CSV file`);

      for (const [index, row] of csvData.entries()) {
        try {
          // Skip empty rows
          if (!row['Item ID'] && !row['Item Name']) {
            results.summary.skippedRows++;
            continue;
          }

          // Transform product
          const product = this.transformZohoProduct(row, clientId);
          this.dataIngestionService.productService.createProduct(product);
          results.products++;

          // Extract and create category
          const categoryName = row['Nom de catégorie'];
          const parentCategory = row['Catégorie parente'];
          
          if (categoryName) {
            const category = this.extractCategoryFromZoho(categoryName, parentCategory, clientId);
            this.dataIngestionService.categoryService.createCategory(category);
            results.categories++;
          }

          // Extract and create manufacturer
          const manufacturer = this.extractManufacturerFromZoho(
            row['Manufacturer'], 
            row['Brand'], 
            clientId
          );
          
          if (manufacturer) {
            this.dataIngestionService.manufacturerService.createManufacturer(manufacturer);
            results.manufacturers++;
          }

          results.summary.processedRows++;

          // Progress indicator
          if ((index + 1) % 100 === 0) {
            console.log(`Processed ${index + 1}/${csvData.length} rows...`);
          }

        } catch (error) {
          results.errors.push({
            row: index + 1,
            item: row['Item Name'] || row['Item ID'] || `Row ${index + 1}`,
            error: error.message
          });
        }
      }

      // Generate data quality warnings
      this.generateDataQualityWarnings(csvData, results);

      console.log(`Import completed successfully!`);
      console.log(`Products: ${results.products}`);
      console.log(`Categories: ${results.categories}`);
      console.log(`Manufacturers: ${results.manufacturers}`);
      console.log(`Errors: ${results.errors.length}`);
      console.log(`Warnings: ${results.warnings.length}`);

    } catch (error) {
      results.errors.push(`Import failed: ${error.message}`);
      console.error(`Import failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Transform Zoho Inventory CSV row to our product format
   */
  transformZohoProduct(zohoRow, clientId) {
    // Helper function to safely parse numbers
    const parseNumber = (value) => {
      if (!value) return 0;
      // Remove currency prefix (CAD, USD, etc.) and parse
      const cleanValue = value.toString().replace(/^[A-Z]{3}\s*/, '').replace(',', '.');
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Helper function to clean text fields
    const cleanText = (value) => {
      return value ? value.toString().trim() : '';
    };

    // Helper function to parse boolean
    const parseBoolean = (value) => {
      return value === 'true' || value === '1' || value === 'yes';
    };

    // Create product ID
    const productId = zohoRow['SKU'] || zohoRow['Item ID'] || `${clientId}-${Date.now()}`;

    return {
      id: `${clientId}-${productId}`,
      clientId: clientId,
      name: cleanText(zohoRow['Item Name']),
      description: cleanText(zohoRow['Sales Description']),
      category: cleanText(zohoRow['Nom de catégorie']), // French: Category name
      price: parseNumber(zohoRow['Selling Price']),
      currency: this.detectCurrency(zohoRow['Selling Price']), // Detect currency from price
      availability: zohoRow['Status'] === 'Active',
      manufacturer: cleanText(zohoRow['Manufacturer'] || zohoRow['Brand']),
      model: cleanText(zohoRow['SKU']),
      specifications: {
        // Package dimensions (French fields)
        weight: cleanText(zohoRow['Poids du colis']), // Package weight
        length: cleanText(zohoRow['Longueur du colis']), // Package length
        width: cleanText(zohoRow['Largeur du colis']), // Package width
        height: cleanText(zohoRow['Hauteur du colis']), // Package height
        dimensionUnit: cleanText(zohoRow['Dimension Unit']),
        weightUnit: cleanText(zohoRow['Weight Unit']),
        
        // Product codes
        upc: cleanText(zohoRow['UPC']),
        ean: cleanText(zohoRow['EAN']),
        isbn: cleanText(zohoRow['ISBN']),
        partNumber: cleanText(zohoRow['Part Number']),
        
        // Additional info
        unit: cleanText(zohoRow['Unit']),
        unitName: cleanText(zohoRow['Unit Name']),
        productType: cleanText(zohoRow['Product Type']),
        isService: parseBoolean(zohoRow['Is Receivable Service'])
      },
      images: [], // No images in CSV, will need to be added separately
      tags: [
        cleanText(zohoRow['Brand']),
        cleanText(zohoRow['Product Type']),
        cleanText(zohoRow['Nom de catégorie'])
      ].filter(Boolean),
      trustScore: 0.85, // Default trust score
      createdAt: new Date(zohoRow['Created Time'] || Date.now()),
      updatedAt: new Date(zohoRow['Last Modified Time'] || Date.now()),
      metadata: {
        source: 'zoho_inventory',
        zohoItemId: zohoRow['Item ID'],
        referenceId: zohoRow['Reference ID'],
        lastSyncTime: zohoRow['Last Sync Time'],
        sourceSystem: zohoRow['Source'],
        aliasName: cleanText(zohoRow['Nom d\'alias']), // French: Alias name
        parentCategory: cleanText(zohoRow['Catégorie parente']), // French: Parent category
        groupName: cleanText(zohoRow['CF.Group Name']),
        
        // Tax information
        purchaseTaxName: cleanText(zohoRow['Purchase Tax Name']),
        purchaseTaxPercentage: parseNumber(zohoRow['Purchase Tax Percentage']),
        taxable: parseBoolean(zohoRow['Taxable']),
        exemptionReason: cleanText(zohoRow['Exemption Reason']),
        
        // Account information
        salesAccount: cleanText(zohoRow['Sales Account']),
        purchaseAccount: cleanText(zohoRow['Purchase Account']),
        inventoryAccount: cleanText(zohoRow['Inventory Account']),
        
        // Additional fields
        isRefundable: parseBoolean(zohoRow['Est un article remboursable']), // French: Is refundable item
        purchaseTaxType: cleanText(zohoRow['Purchase Tax Type']),
        
        importDate: new Date().toISOString()
      }
    };
  }

  /**
   * Extract category from Zoho data (French fields)
   */
  extractCategoryFromZoho(categoryName, parentCategory, clientId) {
    const categoryId = `${clientId}-category-${categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    
    return {
      id: categoryId,
      clientId: clientId,
      name: categoryName,
      description: `Catégorie ${categoryName}`,
      level: parentCategory ? 2 : 1,
      parentId: parentCategory ? `${clientId}-category-${parentCategory.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` : null,
      tags: [categoryName.toLowerCase()],
      metadata: {
        source: 'zoho_inventory',
        originalName: categoryName,
        parentCategory: parentCategory
      }
    };
  }

  /**
   * Extract manufacturer from Zoho data
   */
  extractManufacturerFromZoho(manufacturerName, brand, clientId) {
    const name = manufacturerName || brand;
    if (!name) return null;
    
    const manufacturerId = `${clientId}-manufacturer-${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    
    return {
      id: manufacturerId,
      name: name,
      officialUrl: null,
      certifications: [],
      verified: false,
      trustScore: 0.8,
      metadata: {
        source: 'zoho_inventory',
        brand: brand,
        manufacturer: manufacturerName
      }
    };
  }

  /**
   * Parse CSV file
   */
  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      if (!fs.existsSync(filePath)) {
        reject(new Error(`CSV file not found: ${filePath}`));
        return;
      }

      fs.createReadStream(filePath)
        .pipe(csv({ 
          separator: ',', // Comma-separated based on the actual CSV format
          headers: true,
          skipEmptyLines: true
        }))
        .on('data', (data) => {
          // Convert numeric keys to actual field names
          const convertedData = {};
          Object.keys(data).forEach(key => {
            if (key.startsWith('_')) {
              const index = parseInt(key.substring(1));
              const fieldNames = [
                'Item ID', 'Created Time', 'Last Modified Time', 'Item Name', 'Sales Description',
                'Selling Price', 'Sales Account', 'Est un article remboursable', 'Brand', 'Manufacturer',
                'Poids du colis', 'Longueur du colis', 'Largeur du colis', 'Hauteur du colis',
                'Dimension Unit', 'Weight Unit', 'Is Receivable Service', 'Purchase Tax Name',
                'Purchase Tax Percentage', 'Purchase Tax Type', 'Taxable', 'Exemption Reason',
                'Product Type', 'Source', 'Reference ID', 'Last Sync Time', 'Status', 'Unit',
                'Unit Name', 'SKU', 'Nom d\'alias', 'UPC', 'EAN', 'ISBN', 'Part Number',
                'Purchase Account', 'Purchase Description', 'Inventory Account', 'Nom de catégorie',
                'Catégorie parente', 'CF.Group Name'
              ];
              if (fieldNames[index] !== undefined) {
                convertedData[fieldNames[index]] = data[key];
              }
            } else {
              convertedData[key] = data[key];
            }
          });
          results.push(convertedData);
        })
        .on('end', () => {
          console.log(`Successfully parsed ${results.length} rows from CSV`);
          resolve(results);
        })
        .on('error', (error) => {
          console.error(`Error parsing CSV: ${error.message}`);
          reject(error);
        });
    });
  }

  /**
   * Generate data quality warnings
   */
  generateDataQualityWarnings(csvData, results) {
    let missingPrices = 0;
    let missingDescriptions = 0;
    let missingCategories = 0;
    let missingSKUs = 0;
    let zeroPrices = 0;

    csvData.forEach((row, index) => {
      // Skip header row if it exists
      if (index === 0 && row['Item ID'] === 'Item ID') {
        return;
      }

      if (!row['Selling Price'] || parseFloat(row['Selling Price']) === 0) {
        if (!row['Selling Price']) {
          missingPrices++;
        } else {
          zeroPrices++;
        }
      }
      if (!row['Sales Description']) {
        missingDescriptions++;
      }
      if (!row['Nom de catégorie']) {
        missingCategories++;
      }
      if (!row['SKU']) {
        missingSKUs++;
      }
    });

    if (missingPrices > 0) {
      results.warnings.push(`${missingPrices} products have missing prices`);
    }
    if (zeroPrices > 0) {
      results.warnings.push(`${zeroPrices} products have zero prices`);
    }
    if (missingDescriptions > 0) {
      results.warnings.push(`${missingDescriptions} products have missing descriptions`);
    }
    if (missingCategories > 0) {
      results.warnings.push(`${missingCategories} products have missing categories`);
    }
    if (missingSKUs > 0) {
      results.warnings.push(`${missingSKUs} products have missing SKUs`);
    }
  }

  /**
   * Detect currency from price string
   */
  detectCurrency(priceString) {
    if (!priceString) return 'USD';
    
    const currencyMatch = priceString.toString().match(/^([A-Z]{3})\s*/);
    if (currencyMatch) {
      return currencyMatch[1];
    }
    
    return 'USD'; // Default currency
  }

  /**
   * Validate CSV structure
   */
  validateCSVStructure(csvData) {
    const requiredFields = ['Item ID', 'Item Name'];
    const expectedFields = [
      'Item ID', 'Item Name', 'Sales Description', 'Selling Price',
      'Nom de catégorie', 'Brand', 'Manufacturer', 'SKU'
    ];

    if (csvData.length === 0) {
      throw new Error('CSV file is empty');
    }

    const firstRow = csvData[0];
    const missingRequired = requiredFields.filter(field => !firstRow[field]);
    
    if (missingRequired.length > 0) {
      throw new Error(`Missing required fields: ${missingRequired.join(', ')}`);
    }

    const foundFields = Object.keys(firstRow);
    const unexpectedFields = foundFields.filter(field => !expectedFields.includes(field));
    
    if (unexpectedFields.length > 0) {
      console.warn(`Unexpected fields found: ${unexpectedFields.join(', ')}`);
    }

    return true;
  }
} 