/**
 * Migration Script: Demo Project to Hybrid System
 * 
 * This script migrates data from the demo project to our hybrid AI-optimized system.
 * It reads the demo project's Shopify data and transforms it into our knowledge graph format.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataIngestionService } from '../src/ingestion/data-ingestion-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DemoMigrationService {
  constructor() {
    this.ingestionService = new DataIngestionService();
  }

  /**
   * Migrate demo project data to hybrid system
   * @param {string} clientId - Target client ID for the migrated data
   * @returns {Object} Migration results
   */
  async migrateDemoData(clientId = 'demo-migration') {
    console.log('🚀 Starting demo project migration...');
    
    try {
      // Read demo project's Shopify data
      const demoDataPath = path.join(__dirname, '../demo/ai-optimized-web/modules/products/samples/shopify.json');
      const shopifyData = await this.readShopifyData(demoDataPath);
      
      console.log(`📊 Found ${shopifyData.length} products in demo data`);
      
      // Ingest the data using our hybrid system
      const results = await this.ingestionService.ingestShopifyData(shopifyData, clientId);
      
      console.log('✅ Migration completed successfully!');
      console.log('📈 Migration Results:');
      console.log(`   - Products: ${results.products}`);
      console.log(`   - Manufacturers: ${results.manufacturers}`);
      console.log(`   - Categories: ${results.categories}`);
      console.log(`   - Trust Data: ${results.trustData}`);
      
      if (results.errors.length > 0) {
        console.log('⚠️  Errors encountered:');
        results.errors.forEach(error => console.log(`   - ${error}`));
      }
      
      return {
        success: true,
        clientId,
        results,
        message: 'Demo data successfully migrated to hybrid system'
      };
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to migrate demo data'
      };
    }
  }

  /**
   * Read Shopify data from demo project
   * @param {string} filePath - Path to the Shopify JSON file
   * @returns {Array} Shopify products data
   */
  async readShopifyData(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read Shopify data: ${error.message}`);
    }
  }

  /**
   * Validate migrated data
   * @param {string} clientId - Client ID to validate
   * @returns {Object} Validation results
   */
  async validateMigration(clientId) {
    console.log('🔍 Validating migrated data...');
    
    try {
      // Test JSON-LD compatibility endpoints
      const jsonLdTest = await this.testJSONLDEndpoints();
      
      // Test AI-optimized endpoints
      const aiTest = await this.testAIOptimizedEndpoints(clientId);
      
      const results = {
        jsonLdCompatibility: jsonLdTest,
        aiOptimization: aiTest,
        overall: jsonLdTest.success && aiTest.success
      };
      
      console.log('✅ Validation completed!');
      console.log(`   - JSON-LD Compatibility: ${jsonLdTest.success ? '✅' : '❌'}`);
      console.log(`   - AI Optimization: ${aiTest.success ? '✅' : '❌'}`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test JSON-LD compatibility endpoints
   * @returns {Object} Test results
   */
  async testJSONLDEndpoints() {
    try {
      // Test products.json endpoint
      const response = await fetch('http://localhost:3000/products.json');
      const data = await response.json();
      
      if (!data['@context'] || !data['@graph']) {
        throw new Error('Invalid JSON-LD format');
      }
      
      return {
        success: true,
        productCount: data['@graph'].length,
        message: 'JSON-LD compatibility verified'
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test AI-optimized endpoints
   * @param {string} clientId - Client ID for testing
   * @returns {Object} Test results
   */
  async testAIOptimizedEndpoints(clientId) {
    try {
      // Test AI-optimized products endpoint
      const response = await fetch('http://localhost:3000/api/products', {
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`AI endpoint test failed: ${response.status}`);
      }
      
      return {
        success: true,
        message: 'AI-optimized endpoints verified'
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate migration report
   * @param {Object} migrationResults - Results from migration
   * @param {Object} validationResults - Results from validation
   * @returns {string} Migration report
   */
  generateMigrationReport(migrationResults, validationResults) {
    const report = `
# Demo Project Migration Report

## Migration Summary
- **Status**: ${migrationResults.success ? '✅ Success' : '❌ Failed'}
- **Client ID**: ${migrationResults.clientId}
- **Timestamp**: ${new Date().toISOString()}

## Data Migration Results
- **Products**: ${migrationResults.results?.products || 0}
- **Manufacturers**: ${migrationResults.results?.manufacturers || 0}
- **Categories**: ${migrationResults.results?.categories || 0}
- **Trust Data**: ${migrationResults.results?.trustData || 0}

## Compatibility Validation
- **JSON-LD Compatibility**: ${validationResults.jsonLdCompatibility?.success ? '✅' : '❌'}
- **AI Optimization**: ${validationResults.aiOptimization?.success ? '✅' : '❌'}
- **Overall Success**: ${validationResults.overall ? '✅' : '❌'}

## Available Endpoints

### Demo Project Compatibility
- \`GET /products.json\` - All products in JSON-LD format
- \`GET /product/:sku\` - Single product by SKU
- \`GET /.well-known/llms.txt\` - LLM discovery file

### AI-Optimized Features
- \`GET /api/products\` - AI-optimized products (requires auth)
- \`POST /api/search\` - Semantic search
- \`POST /api/vectors\` - Vector similarity search
- \`POST /api/mcp\` - Model Context Protocol
- \`POST /api/acp\` - AI Context Protocol
- \`POST /api/graph\` - Knowledge graph queries

## Next Steps
1. Configure production database
2. Set up proper authentication
3. Deploy to production environment
4. Monitor performance and usage
`;

    return report;
  }
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const migrationService = new DemoMigrationService();
  
  async function runMigration() {
    const clientId = process.argv[2] || 'demo-migration';
    
    console.log('🔄 Starting demo project migration...');
    console.log(`📋 Target Client ID: ${clientId}`);
    
    const migrationResults = await migrationService.migrateDemoData(clientId);
    
    if (migrationResults.success) {
      console.log('🔍 Validating migration...');
      const validationResults = await migrationService.validateMigration(clientId);
      
      console.log('📄 Generating migration report...');
      const report = migrationService.generateMigrationReport(migrationResults, validationResults);
      
      // Save report to file
      const reportPath = path.join(__dirname, `../migration-report-${Date.now()}.md`);
      await fs.writeFile(reportPath, report);
      
      console.log(`📄 Migration report saved to: ${reportPath}`);
      console.log(report);
    } else {
      console.error('❌ Migration failed:', migrationResults.error);
      process.exit(1);
    }
  }
  
  runMigration().catch(console.error);
} 