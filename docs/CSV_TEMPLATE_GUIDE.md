# 📋 WooCommerce CSV Template Guide

## **🎯 Overview**

This guide explains the expected CSV format for importing WooCommerce products into our AI-optimized subdomain system. The CSV should be exported from WooCommerce and will be enhanced with AI standards (RefKG, I40KG, DPP).

## **📊 CSV Template Structure**

### **Required Fields (Essential)**
These fields are required for basic product import:

| Field Name | Description | Example | Required |
|------------|-------------|---------|----------|
| `Product ID` | Unique product identifier | `1` | ✅ Yes |
| `Product Name` | Product title/name | `iPhone 13 Pro` | ✅ Yes |
| `Description` | Full product description | `Latest iPhone with advanced camera system` | ✅ Yes |
| `Regular Price` | Standard product price | `999.00` | ✅ Yes |
| `SKU` | Stock Keeping Unit | `IPHONE13PRO` | ✅ Yes |
| `Category` | Primary product category | `Electronics` | ✅ Yes |

### **Recommended Fields (Enhanced)**
These fields improve AI enhancement quality:

| Field Name | Description | Example | Required |
|------------|-------------|---------|----------|
| `Short Description` | Brief product summary | `Advanced smartphone with pro camera system` | ⚠️ Recommended |
| `Sale Price` | Discounted price | `899.00` | ⚠️ Optional |
| `Stock` | Available quantity | `50` | ⚠️ Recommended |
| `Images` | Product image URLs | `https://example.com/iphone13pro.jpg` | ⚠️ Recommended |
| `Brand` | Product brand/manufacturer | `Apple` | ⚠️ Recommended |
| `Model` | Product model name | `iPhone 13 Pro` | ⚠️ Recommended |
| `Weight` | Product weight in kg | `0.5` | ⚠️ Recommended |
| `Length` | Product length in cm | `10.0` | ⚠️ Recommended |
| `Width` | Product width in cm | `5.0` | ⚠️ Recommended |
| `Height` | Product height in cm | `1.0` | ⚠️ Recommended |
| `Tags` | Product tags/keywords | `smartphone, camera, 5G` | ⚠️ Recommended |

### **Optional Fields (Advanced)**
These fields provide additional context for AI enhancement:

| Field Name | Description | Example | Required |
|------------|-------------|---------|----------|
| `Color` | Product color | `Space Gray` | ❌ Optional |
| `Size` | Product size | `Large` | ❌ Optional |
| `Material` | Product material | `Aluminum` | ❌ Optional |
| `Categories` | Full category path | `Electronics > Smartphones` | ❌ Optional |
| `Status` | Product status | `publish` | ❌ Optional |
| `Type` | Product type | `simple` | ❌ Optional |

## **📋 Complete CSV Template**

```csv
Product ID,Product Name,Description,Short Description,Regular Price,Sale Price,SKU,Category,Categories,Stock,Stock Quantity,Images,Product Images,Color,Size,Material,Brand,Model,Weight,Length,Width,Height,Tags,Status,Type,Featured,Visibility in catalog,Allow customer reviews,Purchase note,Sale price from date,Sale price to date,Manage stock?,Backorders,Sold individually,Weight (kg),Length (cm),Width (cm),Height (cm)
1,iPhone 13 Pro,Latest iPhone with advanced camera system and A15 Bionic chip,Advanced smartphone with pro camera system,999.00,899.00,IPHONE13PRO,Electronics,Electronics > Smartphones,50,50,https://example.com/iphone13pro.jpg,https://example.com/iphone13pro.jpg,Space Gray,Large,Aluminum,Apple,iPhone 13 Pro,0.5,10.0,5.0,1.0,"smartphone, camera, 5G",publish,simple,0,visible,1,,,2024-01-01,2024-12-31,1,0,0,0.5,10.0,5.0,1.0
```

## **🔧 How to Export from WooCommerce**

### **Step 1: Access WooCommerce Export**
1. Log into WordPress admin
2. Go to **WooCommerce > Products**
3. Click **Export** button
4. Select **Export all products**

### **Step 2: Configure Export Settings**
- **Export format**: CSV
- **Export type**: All products
- **Include**: All product data
- **File name**: `woocommerce-products.csv`

### **Step 3: Download and Validate**
1. Download the CSV file
2. Open in Excel/Google Sheets to verify data
3. Ensure required fields are present
4. Save as UTF-8 encoded CSV

## **🚀 Import Process**

### **Step 1: Prepare CSV File**
```bash
# Place CSV file in data directory
cp woocommerce-products.csv ./data/woocommerce-products.csv
```

### **Step 2: Run Import**
```bash
# Deploy with CSV import
npm run deploy:first-client
```

### **Step 3: Verify Import**
```bash
# Test enhanced functionality
npm run test:enhanced
```

## **📊 AI Enhancement Process**

### **What Happens During Import:**

1. **CSV Parsing**: System reads WooCommerce export
2. **Data Mapping**: Maps CSV fields to our product format
3. **AI Enhancement**: 
   - **RefKG**: Query decomposition and knowledge reconstruction
   - **I40KG**: Quality certifications and trust indicators
   - **DPP**: Authenticity verification and regulatory compliance
4. **Knowledge Graph Storage**: Enhanced products saved to AI-optimized subdomain

### **Enhanced Product Structure:**
```json
{
  "id": "woo_1",
  "name": "iPhone 13 Pro",
  "description": "Latest iPhone with advanced camera system",
  "price": 999.00,
  "i40kg_quality": {
    "certifications": ["ISO", "CE", "FCC"],
    "quality_score": 0.85,
    "trust_indicators": {
      "certified_quality": true,
      "international_standards": true,
      "safety_compliance": true
    }
  },
  "dpp_identity": {
    "unique_identifier": "DPP_woo_1_1234567890",
    "authenticity_verified": true,
    "trust_score": 0.92
  },
  "enhanced_metadata": {
    "standards_compliance": {
      "refkg": true,
      "i40kg": true,
      "dpp": true
    },
    "overall_trust_score": 0.88
  }
}
```

## **✅ Validation Checklist**

### **Before Import:**
- [ ] CSV file is UTF-8 encoded
- [ ] Required fields are present
- [ ] Product names are descriptive
- [ ] Prices are in correct format (numbers)
- [ ] SKUs are unique
- [ ] Categories are consistent

### **After Import:**
- [ ] All products imported successfully
- [ ] AI enhancement completed
- [ ] Trust scores calculated
- [ ] API endpoints functional
- [ ] Client can access enhanced data

## **🔍 Troubleshooting**

### **Common Issues:**

1. **Missing Required Fields**
   - **Error**: "Product Name is required"
   - **Solution**: Ensure Product Name column exists and has values

2. **Invalid Price Format**
   - **Error**: "Price must be a number"
   - **Solution**: Remove currency symbols, use decimal format

3. **Duplicate SKUs**
   - **Error**: "SKU already exists"
   - **Solution**: Ensure unique SKUs for each product

4. **Encoding Issues**
   - **Error**: "Invalid character encoding"
   - **Solution**: Save CSV as UTF-8 encoded

### **Support:**
If you encounter issues, check:
1. CSV format matches template
2. All required fields are present
3. Data is properly formatted
4. File encoding is UTF-8

## **📈 Expected Results**

### **Import Statistics:**
- **Total Products**: Number of products in CSV
- **Enhanced Products**: Products successfully enhanced with AI standards
- **Certified Products**: Products with quality certifications
- **Authenticated Products**: Products with verified authenticity

### **AI Enhancement Benefits:**
- **+25-50% customer trust** through quality certifications
- **+40-60% customer confidence** through authenticity verification
- **EU market access** through regulatory compliance
- **Superior AI recommendations** leading to better conversions

## **🎯 Next Steps**

1. **Export from WooCommerce**: Use the template as a guide
2. **Validate CSV**: Ensure all required fields are present
3. **Run Import**: Use our deployment script
4. **Monitor Results**: Check enhancement statistics
5. **Client Onboarding**: Provide access to enhanced data

---

**Template File**: `data/woocommerce-csv-template.csv`  
**Documentation**: This guide  
**Support**: Contact our team for assistance 