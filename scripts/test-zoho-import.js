/**
 * Test Zoho Inventory CSV Import
 * 
 * Demonstrates the Zoho Inventory CSV import functionality
 * with French field names and specific structure handling
 */

import { DataIngestionService } from '../src/ingestion/data-ingestion-service.js';
import { ZohoInventoryImporter } from '../src/ingestion/zoho-inventory-importer.js';
import fs from 'fs';
import path from 'path';

async function testZohoImport() {
  console.log('🧪 Testing Zoho Inventory CSV Import');
  console.log('=====================================\n');

  try {
    // Initialize services
    const dataIngestionService = new DataIngestionService();
    const zohoImporter = new ZohoInventoryImporter(dataIngestionService);

    // Test client ID
    const clientId = 'test-zoho-client';

    // Create a sample CSV file for testing
    const sampleCSVPath = await createSampleZohoCSV();
    console.log(`✅ Created sample CSV file: ${sampleCSVPath}`);

    // Test the import
    console.log('\n📥 Starting Zoho CSV import...');
    const results = await zohoImporter.importZohoCSV(sampleCSVPath, clientId);

    // Display results
    console.log('\n📊 Import Results:');
    console.log('==================');
    console.log(`✅ Products imported: ${results.products}`);
    console.log(`✅ Categories created: ${results.categories}`);
    console.log(`✅ Manufacturers created: ${results.manufacturers}`);
    console.log(`❌ Errors: ${results.errors.length}`);
    console.log(`⚠️  Warnings: ${results.warnings.length}`);

    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(error => {
        console.log(`  - ${error.item}: ${error.error}`);
      });
    }

    if (results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      results.warnings.forEach(warning => {
        console.log(`  - ${warning}`);
      });
    }

      // Test data retrieval
  console.log('\n🔍 Testing data retrieval...');
  await testDataRetrieval(clientId, dataIngestionService);

    // Cleanup
    fs.unlinkSync(sampleCSVPath);
    console.log(`\n🧹 Cleaned up sample CSV file`);

    console.log('\n✅ Zoho import test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

/**
 * Create a sample Zoho CSV file for testing
 */
async function createSampleZohoCSV() {
  const sampleData = [
    {
      'Item ID': 'ITEM001',
      'Created Time': '2024-01-15 10:30:00',
      'Last Modified Time': '2024-01-15 10:30:00',
      'Item Name': 'iPhone 15 Pro',
      'Sales Description': 'Latest iPhone with advanced camera system',
      'Selling Price': '999.99',
      'Sales Account': 'Sales Revenue',
      'Est un article remboursable': 'true',
      'Brand': 'Apple',
      'Manufacturer': 'Apple Inc.',
      'Poids du colis': '0.5',
      'Longueur du colis': '15',
      'Largeur du colis': '8',
      'Hauteur du colis': '2',
      'Dimension Unit': 'cm',
      'Weight Unit': 'kg',
      'Is Receivable Service': 'false',
      'Purchase Tax Name': 'VAT',
      'Purchase Tax Percentage': '20',
      'Purchase Tax Type': 'Percentage',
      'Taxable': 'true',
      'Exemption Reason': '',
      'Product Type': 'Electronics',
      'Source': 'Zoho Inventory',
      'Reference ID': 'REF001',
      'Last Sync Time': '2024-01-15 10:30:00',
      'Status': 'Active',
      'Unit': '1',
      'Unit Name': 'Piece',
      'SKU': 'IPHONE15PRO',
      'Nom d\'alias': 'iPhone 15 Pro Max',
      'UPC': '123456789012',
      'EAN': '1234567890123',
      'ISBN': '',
      'Part Number': 'A2849',
      'Purchase Account': 'Cost of Goods Sold',
      'Purchase Description': 'iPhone 15 Pro purchase',
      'Inventory Account': 'Inventory',
      'Nom de catégorie': 'Smartphones',
      'Catégorie parente': 'Electronics',
      'CF.Group Name': 'Premium Products'
    },
    {
      'Item ID': 'ITEM002',
      'Created Time': '2024-01-15 11:00:00',
      'Last Modified Time': '2024-01-15 11:00:00',
      'Item Name': 'Samsung Galaxy S24',
      'Sales Description': 'Android flagship with AI features',
      'Selling Price': '899.99',
      'Sales Account': 'Sales Revenue',
      'Est un article remboursable': 'true',
      'Brand': 'Samsung',
      'Manufacturer': 'Samsung Electronics',
      'Poids du colis': '0.4',
      'Longueur du colis': '14',
      'Largeur du colis': '7',
      'Hauteur du colis': '1.8',
      'Dimension Unit': 'cm',
      'Weight Unit': 'kg',
      'Is Receivable Service': 'false',
      'Purchase Tax Name': 'VAT',
      'Purchase Tax Percentage': '20',
      'Purchase Tax Type': 'Percentage',
      'Taxable': 'true',
      'Exemption Reason': '',
      'Product Type': 'Electronics',
      'Source': 'Zoho Inventory',
      'Reference ID': 'REF002',
      'Last Sync Time': '2024-01-15 11:00:00',
      'Status': 'Active',
      'Unit': '1',
      'Unit Name': 'Piece',
      'SKU': 'SAMSUNG-S24',
      'Nom d\'alias': 'Galaxy S24 Ultra',
      'UPC': '987654321098',
      'EAN': '9876543210987',
      'ISBN': '',
      'Part Number': 'SM-S921B',
      'Purchase Account': 'Cost of Goods Sold',
      'Purchase Description': 'Samsung Galaxy S24 purchase',
      'Inventory Account': 'Inventory',
      'Nom de catégorie': 'Smartphones',
      'Catégorie parente': 'Electronics',
      'CF.Group Name': 'Premium Products'
    },
    {
      'Item ID': 'ITEM003',
      'Created Time': '2024-01-15 11:30:00',
      'Last Modified Time': '2024-01-15 11:30:00',
      'Item Name': 'MacBook Pro M3',
      'Sales Description': 'Professional laptop with M3 chip',
      'Selling Price': '1999.99',
      'Sales Account': 'Sales Revenue',
      'Est un article remboursable': 'true',
      'Brand': 'Apple',
      'Manufacturer': 'Apple Inc.',
      'Poids du colis': '2.1',
      'Longueur du colis': '30',
      'Largeur du colis': '21',
      'Hauteur du colis': '1.5',
      'Dimension Unit': 'cm',
      'Weight Unit': 'kg',
      'Is Receivable Service': 'false',
      'Purchase Tax Name': 'VAT',
      'Purchase Tax Percentage': '20',
      'Purchase Tax Type': 'Percentage',
      'Taxable': 'true',
      'Exemption Reason': '',
      'Product Type': 'Computers',
      'Source': 'Zoho Inventory',
      'Reference ID': 'REF003',
      'Last Sync Time': '2024-01-15 11:30:00',
      'Status': 'Active',
      'Unit': '1',
      'Unit Name': 'Piece',
      'SKU': 'MACBOOK-M3',
      'Nom d\'alias': 'MacBook Pro 14" M3',
      'UPC': '456789123456',
      'EAN': '4567891234567',
      'ISBN': '',
      'Part Number': 'A2992',
      'Purchase Account': 'Cost of Goods Sold',
      'Purchase Description': 'MacBook Pro M3 purchase',
      'Inventory Account': 'Inventory',
      'Nom de catégorie': 'Laptops',
      'Catégorie parente': 'Computers',
      'CF.Group Name': 'Premium Products'
    }
  ];

  const csvPath = path.join(process.cwd(), 'data', 'sample-zoho-inventory.csv');
  
  // Ensure data directory exists
  const dataDir = path.dirname(csvPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Create CSV content with tab separator
  const headers = Object.keys(sampleData[0]);
  const csvContent = [
    headers.join('\t'),
    ...sampleData.map(row => headers.map(header => row[header] || '').join('\t'))
  ].join('\n');

  fs.writeFileSync(csvPath, csvContent, 'utf8');
  return csvPath;
}

/**
 * Test data retrieval after import
 */
async function testDataRetrieval(clientId, dataIngestionService) {

  // Test product retrieval
  const products = await dataIngestionService.productService.getProducts(clientId);
  console.log(`  📱 Found ${products.products?.length || 0} products`);

  // Test category retrieval
  const categories = await dataIngestionService.categoryService.getCategories(clientId);
  console.log(`  📂 Found ${categories.categories?.length || 0} categories`);

  // Test manufacturer retrieval
  const manufacturers = await dataIngestionService.manufacturerService.getManufacturers();
  console.log(`  🏭 Found ${manufacturers.manufacturers?.length || 0} manufacturers`);

  // Show sample data
  if (products.products && products.products.length > 0) {
    const product = products.products[0];
    console.log('\n  📋 Sample Product:');
    console.log(`    Name: ${product.name}`);
    console.log(`    Price: ${product.price} ${product.currency}`);
    console.log(`    Category: ${product.category}`);
    console.log(`    Manufacturer: ${product.manufacturer}`);
    console.log(`    UPC: ${product.specifications?.upc || 'N/A'}`);
    console.log(`    Source: ${product.metadata?.source || 'N/A'}`);
  }
}

// Run the test
testZohoImport().catch(console.error); 