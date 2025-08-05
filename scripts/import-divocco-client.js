/**
 * Import Divocco Inc. Client Data
 * 
 * Imports real client data from Divocco Medical's Zoho Inventory CSV
 * Sets up the first production client entry for divoccomedical.com
 */

import { DataIngestionService } from '../src/ingestion/data-ingestion-service.js';
import { ZohoInventoryImporter } from '../src/ingestion/zoho-inventory-importer.js';
import { ClientService } from '../src/services/client-service.js';
import fs from 'fs';
import path from 'path';

async function importDivoccoClient() {
  console.log('🏥 Importing Divocco Inc. Client Data');
  console.log('=====================================\n');

  try {
    // Initialize services
    const dataIngestionService = new DataIngestionService();
    const clientService = new ClientService();
    const zohoImporter = new ZohoInventoryImporter(dataIngestionService);

    // Client configuration for Divocco Inc.
    const clientConfig = {
      id: 'divocco-inc',
      name: 'Divocco Inc.',
      domain: 'divoccomedical.com',
      subdomain: 'divoccomedical.com',
      apiKey: 'api-key-divocco-' + Date.now(),
      status: 'active',
      features: [
        'refkg',
        'i40kg', 
        'dpp'
      ],
      deployment_date: new Date().toISOString(),
      metadata: {
        industry: 'medical_supplies',
        region: 'CA',
        productTypes: [
          'medical_gloves',
          'dental_supplies',
          'sterilization_products'
        ],
        business: {
          registrationNumber: 'CA123456789',
          validationStatus: 'verified',
          validationDate: '2024-01-01',
          trustScore: 0.95
        },
        primaryDomain: 'divoccomedical.com',
        aiSubdomain: 'ai.divoccomedical.com',
        relatedDomains: [
          {
            domain: 'divocco.ca',
            region: 'CA',
            relationship: 'regional-variant'
          }
        ]
      }
    };

    // Register the client
    console.log('📝 Registering Divocco Inc. client...');
    const registeredClient = clientService.registerClient(clientConfig);
    console.log(`✅ Client registered: ${registeredClient.name} (${registeredClient.id})`);

    // Import Zoho Inventory data
    const csvFilePath = path.join(process.cwd(), 'data', 'Divocco_Medical.com - Item.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }

    console.log('\n📥 Starting Divocco Medical CSV import...');
    const importResults = await zohoImporter.importZohoCSV(csvFilePath, clientConfig.id);

    // Display import results
    console.log('\n📊 Import Results:');
    console.log('==================');
    console.log(`✅ Products imported: ${importResults.products}`);
    console.log(`✅ Categories created: ${importResults.categories}`);
    console.log(`✅ Manufacturers created: ${importResults.manufacturers}`);
    console.log(`❌ Errors: ${importResults.errors.length}`);
    console.log(`⚠️  Warnings: ${importResults.warnings.length}`);

    if (importResults.errors.length > 0) {
      console.log('\n❌ Errors:');
      importResults.errors.forEach(error => {
        console.log(`  - ${error.item}: ${error.error}`);
      });
    }

    if (importResults.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      importResults.warnings.forEach(warning => {
        console.log(`  - ${warning}`);
      });
    }

    // Test data retrieval
    console.log('\n🔍 Testing data retrieval...');
    await testDivoccoData(clientConfig.id, dataIngestionService);

    // Generate client summary
    console.log('\n📋 Client Summary:');
    console.log('==================');
    console.log(`🏢 Company: ${clientConfig.name}`);
    console.log(`🌐 Domain: ${clientConfig.domain}`);
    console.log(`🤖 AI Subdomain: ${clientConfig.metadata.aiSubdomain}`);
    console.log(`🏥 Industry: ${clientConfig.metadata.industry}`);
    console.log(`🇨🇦 Region: ${clientConfig.metadata.region}`);
    console.log(`📦 Product Types: ${clientConfig.metadata.productTypes.join(', ')}`);
    console.log(`🔑 API Key: ${clientConfig.apiKey}`);

    // Save client configuration
    const clientConfigPath = path.join(process.cwd(), 'data', 'divocco-client-config.json');
    fs.writeFileSync(clientConfigPath, JSON.stringify(clientConfig, null, 2));
    console.log(`\n💾 Client configuration saved to: ${clientConfigPath}`);

    console.log('\n✅ Divocco Inc. client import completed successfully!');
    console.log('\n🎯 Next Steps:');
    console.log('  1. Configure DNS for ai.divoccomedical.com');
    console.log('  2. Set up bot detection and redirection');
    console.log('  3. Implement trust validation for medical products');
    console.log('  4. Configure regional variants (divocco.ca)');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

/**
 * Test Divocco data retrieval
 */
async function testDivoccoData(clientId, dataIngestionService) {
  // Test product retrieval
  const products = await dataIngestionService.productService.getProducts(clientId);
  console.log(`  📱 Found ${products.products?.length || 0} products`);

  // Test category retrieval
  const categories = await dataIngestionService.categoryService.getCategories(clientId);
  console.log(`  📂 Found ${categories.categories?.length || 0} categories`);

  // Test manufacturer retrieval
  const manufacturers = await dataIngestionService.manufacturerService.getManufacturers();
  console.log(`  🏭 Found ${manufacturers.manufacturers?.length || 0} manufacturers`);

  // Show sample medical products
  if (products.products && products.products.length > 0) {
    console.log('\n  🏥 Sample Medical Products:');
    
    // Show first 5 products
    products.products.slice(0, 5).forEach((product, index) => {
      console.log(`    ${index + 1}. ${product.name}`);
      console.log(`       Price: ${product.price} ${product.currency}`);
      console.log(`       Category: ${product.category}`);
      console.log(`       Manufacturer: ${product.manufacturer}`);
      console.log(`       UPC: ${product.specifications?.upc || 'N/A'}`);
      console.log('');
    });
  }

  // Show category breakdown
  if (categories.categories && categories.categories.length > 0) {
    console.log('  📂 Medical Categories:');
    categories.categories.forEach(category => {
      console.log(`    - ${category.name} (Level ${category.level})`);
    });
  }
}

// Run the import
importDivoccoClient().catch(console.error); 