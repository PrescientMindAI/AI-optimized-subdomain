/**
 * CSV Validation Script
 * 
 * Validates WooCommerce CSV export format before import.
 * Helps clients ensure their CSV is compatible with our system.
 */

import fs from 'fs';
import csv from 'csv-parser';

class CSVValidator {
  constructor() {
    this.requiredFields = [
      'Product ID',
      'Product Name', 
      'Description',
      'Regular Price',
      'SKU',
      'Category'
    ];
    
    this.recommendedFields = [
      'Short Description',
      'Sale Price',
      'Stock',
      'Images',
      'Brand',
      'Model',
      'Weight',
      'Length',
      'Width',
      'Height',
      'Tags'
    ];
    
    this.validationResults = {
      isValid: true,
      errors: [],
      warnings: [],
      statistics: {}
    };
  }

  /**
   * Validate CSV file
   */
  async validateCSV(csvFilePath) {
    console.log('🔍 Validating CSV file...\n');
    
    if (!fs.existsSync(csvFilePath)) {
      this.validationResults.errors.push(`CSV file not found: ${csvFilePath}`);
      this.validationResults.isValid = false;
      return this.validationResults;
    }

    try {
      const csvData = await this.parseCSV(csvFilePath);
      const headers = Object.keys(csvData[0] || {});
      
      console.log(`📊 Found ${csvData.length} products with ${headers.length} fields\n`);
      
      // Validate headers
      this.validateHeaders(headers);
      
      // Validate data
      this.validateData(csvData);
      
      // Generate statistics
      this.generateStatistics(csvData);
      
      // Print results
      this.printResults();
      
      return this.validationResults;
      
    } catch (error) {
      this.validationResults.errors.push(`CSV parsing error: ${error.message}`);
      this.validationResults.isValid = false;
      return this.validationResults;
    }
  }

  /**
   * Parse CSV file
   */
  async parseCSV(csvFilePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', reject);
    });
  }

  /**
   * Validate CSV headers
   */
  validateHeaders(headers) {
    console.log('📋 Validating headers...\n');
    
    // Check required fields
    for (const requiredField of this.requiredFields) {
      if (!headers.includes(requiredField)) {
        this.validationResults.errors.push(`Missing required field: ${requiredField}`);
        this.validationResults.isValid = false;
      }
    }
    
    // Check recommended fields
    for (const recommendedField of this.recommendedFields) {
      if (!headers.includes(recommendedField)) {
        this.validationResults.warnings.push(`Missing recommended field: ${recommendedField}`);
      }
    }
    
    // Check for extra fields
    const extraFields = headers.filter(header => 
      !this.requiredFields.includes(header) && 
      !this.recommendedFields.includes(header)
    );
    
    if (extraFields.length > 0) {
      console.log(`ℹ️  Extra fields found: ${extraFields.join(', ')}`);
    }
  }

  /**
   * Validate CSV data
   */
  validateData(csvData) {
    console.log('📊 Validating data...\n');
    
    let rowNumber = 1;
    
    for (const row of csvData) {
      rowNumber++;
      
      // Check required fields have values
      for (const requiredField of this.requiredFields) {
        if (!row[requiredField] || row[requiredField].trim() === '') {
          this.validationResults.errors.push(`Row ${rowNumber}: Empty required field '${requiredField}'`);
          this.validationResults.isValid = false;
        }
      }
      
      // Validate price format
      if (row['Regular Price']) {
        const price = parseFloat(row['Regular Price']);
        if (isNaN(price) || price < 0) {
          this.validationResults.errors.push(`Row ${rowNumber}: Invalid price format '${row['Regular Price']}'`);
          this.validationResults.isValid = false;
        }
      }
      
      // Validate SKU uniqueness (basic check)
      if (row['SKU']) {
        const duplicateSKUs = csvData.filter(r => r['SKU'] === row['SKU']);
        if (duplicateSKUs.length > 1) {
          this.validationResults.warnings.push(`Row ${rowNumber}: Duplicate SKU '${row['SKU']}'`);
        }
      }
      
      // Validate stock quantity
      if (row['Stock']) {
        const stock = parseInt(row['Stock']);
        if (isNaN(stock) || stock < 0) {
          this.validationResults.warnings.push(`Row ${rowNumber}: Invalid stock quantity '${row['Stock']}'`);
        }
      }
    }
  }

  /**
   * Generate statistics
   */
  generateStatistics(csvData) {
    const stats = {
      totalProducts: csvData.length,
      categories: new Set(),
      brands: new Set(),
      priceRange: { min: Infinity, max: 0 },
      hasImages: 0,
      hasTags: 0,
      hasBrand: 0
    };
    
    for (const row of csvData) {
      // Categories
      if (row['Category']) {
        stats.categories.add(row['Category']);
      }
      
      // Brands
      if (row['Brand']) {
        stats.brands.add(row['Brand']);
        stats.hasBrand++;
      }
      
      // Price range
      if (row['Regular Price']) {
        const price = parseFloat(row['Regular Price']);
        if (!isNaN(price)) {
          stats.priceRange.min = Math.min(stats.priceRange.min, price);
          stats.priceRange.max = Math.max(stats.priceRange.max, price);
        }
      }
      
      // Images
      if (row['Images'] && row['Images'].trim() !== '') {
        stats.hasImages++;
      }
      
      // Tags
      if (row['Tags'] && row['Tags'].trim() !== '') {
        stats.hasTags++;
      }
    }
    
    this.validationResults.statistics = {
      totalProducts: stats.totalProducts,
      uniqueCategories: stats.categories.size,
      uniqueBrands: stats.brands.size,
      priceRange: {
        min: stats.priceRange.min === Infinity ? 0 : stats.priceRange.min,
        max: stats.priceRange.max === 0 ? 0 : stats.priceRange.max
      },
      productsWithImages: stats.hasImages,
      productsWithTags: stats.hasTags,
      productsWithBrand: stats.hasBrand
    };
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('📋 Validation Results:');
    console.log('=====================\n');
    
    // Print errors
    if (this.validationResults.errors.length > 0) {
      console.log('❌ Errors:');
      this.validationResults.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
      console.log('');
    }
    
    // Print warnings
    if (this.validationResults.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.validationResults.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
      console.log('');
    }
    
    // Print statistics
    console.log('📊 Statistics:');
    console.log(`   - Total Products: ${this.validationResults.statistics.totalProducts}`);
    console.log(`   - Unique Categories: ${this.validationResults.statistics.uniqueCategories}`);
    console.log(`   - Unique Brands: ${this.validationResults.statistics.uniqueBrands}`);
    console.log(`   - Price Range: $${this.validationResults.statistics.priceRange.min} - $${this.validationResults.statistics.priceRange.max}`);
    console.log(`   - Products with Images: ${this.validationResults.statistics.productsWithImages}`);
    console.log(`   - Products with Tags: ${this.validationResults.statistics.productsWithTags}`);
    console.log(`   - Products with Brand: ${this.validationResults.statistics.productsWithBrand}`);
    console.log('');
    
    // Print final result
    if (this.validationResults.isValid) {
      console.log('✅ CSV file is valid and ready for import!');
      console.log('🚀 You can now run: npm run deploy:first-client');
    } else {
      console.log('❌ CSV file has errors that must be fixed before import.');
      console.log('📋 Please review the errors above and update your CSV file.');
    }
    
    console.log('');
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const report = {
      validation_date: new Date().toISOString(),
      is_valid: this.validationResults.isValid,
      errors: this.validationResults.errors,
      warnings: this.validationResults.warnings,
      statistics: this.validationResults.statistics,
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.validationResults.statistics.productsWithImages < this.validationResults.statistics.totalProducts * 0.8) {
      recommendations.push('Add product images to improve AI enhancement quality');
    }
    
    if (this.validationResults.statistics.productsWithTags < this.validationResults.statistics.totalProducts * 0.6) {
      recommendations.push('Add product tags to improve search and categorization');
    }
    
    if (this.validationResults.statistics.productsWithBrand < this.validationResults.statistics.totalProducts * 0.7) {
      recommendations.push('Add brand information to improve trust and authenticity');
    }
    
    if (this.validationResults.statistics.uniqueCategories < 3) {
      recommendations.push('Consider adding more product categories for better organization');
    }
    
    return recommendations;
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new CSVValidator();
  const csvPath = process.argv[2] || './data/woocommerce-products.csv';
  
  validator.validateCSV(csvPath)
    .then(() => {
      const report = validator.generateReport();
      
      // Save validation report
      const reportPath = './data/csv-validation-report.json';
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Validation report saved to: ${reportPath}`);
    })
    .catch(console.error);
}

export default CSVValidator; 