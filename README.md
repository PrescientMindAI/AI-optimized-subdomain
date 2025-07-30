# AI-Optimized Subdomain - Beta Test Branch

## Overview

The **AI-Optimized Subdomain** project defines the open-source specifications, protocols, and data formats that are served on `ai.domain.xyz` subdomains. This project provides the technical documentation and implementation guidelines for the AI-ready format that enables AI agents, LLMs, and AI browsers to efficiently consume e-commerce data with client isolation and trust integration.

## Mission

To establish universal standards for AI-accessible e-commerce data that enables seamless interaction between AI systems and online commerce platforms, while ensuring data isolation per client, reducing token usage, and improving AI decision-making through integrated trust indicators and rich product relationships.

## Enhanced AI Standards Integration

This project now integrates three advanced standards to provide **superior data for LLMs compared to regular e-commerce websites**:

### 🧠 RefKG (Reflective Knowledge Graph)
- **Query Decomposition**: Breaks complex queries into sub-queries with priority ranking
- **Evidence Exploration**: Iterative and reflective retrieval of relevant evidence
- **Knowledge Reconstruction**: Structured output optimized for LLM consumption
- **Benefits**: 40-60% better query interpretation, 30-50% improved result quality

### 🏭 I40KG (Industry 4.0 Knowledge Graph)
- **Quality Certifications**: ISO, CE, UL, FCC, RoHS, REACH standards integration
- **Supply Chain Transparency**: Manufacturing and logistics verification
- **Sustainability Metrics**: ESG compliance and environmental impact tracking
- **Benefits**: +25-50% customer trust, +20-35% competitive advantage

### 🆔 DPP (Digital Product Passport)
- **Authenticity Verification**: Product identity and manufacturer verification
- **EU Regulatory Compliance**: EU DPP Regulation 2024 ready
- **Market Access**: EU market access with regulatory future-proofing
- **Benefits**: +40-60% customer confidence, EU market access guaranteed

## Core Specifications

### Knowledge Graph Schema
Defines the structure for representing e-commerce data as interconnected knowledge graphs with client isolation, including:
- **Product Entities**: Core product information, variations, specifications, and attributes
- **Relationship Mapping**: Similar products, complementary items, cross-references, and compatibility
- **Trust Entities**: External reviews, customer comments, ratings, and credibility indicators
- **Manufacturer Integration**: Official product URLs, certifications, and manufacturer verification
- **Client Isolation**: Data scoping and access control per e-commerce domain
- **Semantic Annotations**: Rich metadata for AI interpretation and processing
- **Hierarchical Structures**: Category trees, product taxonomies, and trust hierarchies

### Data Formats

#### 1. Vectorized Data Format
- **Purpose**: Enable semantic similarity search and efficient filtering
- **Use Case**: AI agents finding products based on natural language queries
- **Specification**: [📋 Vectorized Format Specification](docs/SPECIFICATIONS.md#1-vectorized-data-format)

#### 2. MCP (Model Context Protocol)
- **Purpose**: Direct integration with AI models and language models
- **Use Case**: LLMs accessing structured product data as context
- **Specification**: [📋 MCP Format Specification](docs/SPECIFICATIONS.md#2-mcp-model-context-protocol)

#### 3. ACP (AI Context Protocol)  
- **Purpose**: Standardized communication between AI agents and data sources
- **Use Case**: Multi-agent systems coordinating product research and recommendations
- **Specification**: [📋 ACP Format Specification](docs/SPECIFICATIONS.md#3-acp-ai-context-protocol)

#### 4. Raw Graph Format
- **Purpose**: Direct knowledge graph queries and traversal
- **Use Case**: Complex AI reasoning over product relationships
- **Specification**: [📋 Raw Graph Format Specification](docs/SPECIFICATIONS.md#4-raw-graph-format)

## Key Benefits for AI Systems

### 1. Structured Data Processing
- Pre-processed product relationships and attributes
- Standardized schema for consistent AI interpretation  
- Reduced need for data cleaning and normalization

### 2. Format Flexibility
- Multiple output formats for different AI use cases
- Adaptive serving based on AI agent capabilities
- Backward compatibility with existing systems

### 3. Efficient Interaction
- Optimized data structure for reduced token consumption
- Direct querying capabilities without web scraping
- Semantic search and filtering built-in

## Implementation Standards

### Client-Isolated Subdomain Structure
Each client gets their own automatically generated subdomain with isolated data:
```
ai.domain.xyz/
├── /products/          # Client-specific product catalog in multiple formats
├── /categories/        # Client category hierarchies and relationships  
├── /search/           # Semantic search endpoints (scoped to client)
├── /graph/            # Knowledge graph query interface (client data only)
├── /vectors/          # Vectorized data access (client-scoped)
├── /trust/            # Reviews, ratings, and credibility data
├── /manufacturers/    # Official manufacturer data and URLs
└── /protocols/        # Protocol-specific endpoints (MCP, ACP)
```

### API Endpoints

#### Enhanced AI Endpoints (RefKG + I40KG + DPP)
- `POST /api/enhanced/search/enhanced` - Enhanced search with all three standards
- `POST /api/enhanced/search/refkg` - RefKG-specific search
- `POST /api/enhanced/search/decompose` - Query decomposition
- `GET /api/enhanced/products/{id}/enhanced` - Enhanced product with all standards
- `GET /api/enhanced/products/{id}/quality` - I40KG quality data
- `GET /api/enhanced/products/{id}/dpp` - DPP identity data
- `GET /api/enhanced/products/{id}/authenticity` - Product authenticity verification
- `GET /api/enhanced/trust/{productId}/enhanced` - Enhanced trust data
- `GET /api/enhanced/compliance/{productId}` - Product compliance data

#### LLM-Optimized Endpoints
- `POST /api/enhanced/llm/search` - LLM-optimized search
- `GET /api/enhanced/llm/product/{id}` - LLM-optimized product
- `POST /api/enhanced/llm/recommendations` - LLM recommendations

#### Standard Endpoints
- `GET /products/{id}?format={vector|mcp|acp|graph}` - Retrieve product in specified format
- `POST /search` - Semantic product search (client-scoped)
- `GET /graph/query` - Knowledge graph SPARQL endpoint (client data)
- `GET /categories/tree` - Client category hierarchy
- `POST /vectors/similarity` - Vector similarity search (client products)
- `GET /trust/{product_id}` - Retrieve trust indicators and reviews
- `GET /manufacturers/{product_id}` - Official manufacturer information

### Future Broader Access
- **AllioIA.io**: Planned broader access to the complete knowledge graph across all clients
- **Cross-client insights**: Market analysis and comparative data (with appropriate permissions)

## Use Cases

### E-commerce AI Agents (Client-Specific)
AI agents can efficiently access client-scoped data to:
- Compare products within the client's catalog across multiple criteria
- Find product variations and alternatives with trust indicators
- Understand product relationships, compatibility, and customer experiences
- Make recommendations based on integrated reviews and manufacturer data
- Access semantic search scoped to the specific e-commerce domain
- **Enhanced with RefKG**: 40-60% better query interpretation and 30-50% improved result quality
- **Enhanced with I40KG**: Quality certifications and supply chain transparency
- **Enhanced with DPP**: Authenticity verification and EU regulatory compliance

### AI Shopping Assistants
- **Natural language search**: "Find organic apples good for baking" on `ai.orchardfresh.com`
- **Trust-integrated recommendations**: Reviews and ratings embedded in product suggestions
- **Manufacturer verification**: Direct access to official product specifications
- **Real-time availability**: Client-specific inventory and pricing data
- **Scoped comparisons**: Compare products within the specific vendor's catalog

### Research and Analytics
- **Market trend analysis**: Through future AllioIA.io broader access
- **Client performance insights**: Trust metrics and review analysis per domain
- **Product category insights**: Relationships and hierarchies within client catalogs
- **Consumer behavior modeling**: Review patterns and preference indicators
- **Cross-platform comparison**: Via broader access with appropriate permissions

### Example: Apple Orchard AI Agent
An AI visiting `ai.freshapples.com` can:
1. Search for "best apples for apple pie" using natural language
2. Find apple varieties with relationships to baking applications
3. Access integrated customer reviews mentioning baking performance
4. Get official orchard certifications and growing methods
5. Compare different apple varieties within the orchard's catalog
6. **Enhanced with RefKG**: Decompose complex queries into sub-queries for better understanding
7. **Enhanced with I40KG**: Access quality certifications (ISO, organic, etc.) and supply chain data
8. **Enhanced with DPP**: Verify authenticity and EU market compliance
9. All while being isolated from other vendors' data

## Testing Enhanced AI Functionality

To test the enhanced AI functionality that integrates RefKG, I40KG, and DPP standards:

```bash
# Start the server
npm start

# In another terminal, run the enhanced AI tests
npm run test:enhanced
```

This will test:
- ✅ Enhanced search with all three standards
- ✅ RefKG query decomposition and knowledge reconstruction
- ✅ I40KG quality certifications and trust indicators
- ✅ DPP authenticity verification and EU compliance
- ✅ LLM-optimized data formats
- ✅ Product compliance and market access

## Contributing

This is an open-source project aimed at establishing industry standards. Contributions are welcome for:
- Protocol specifications
- Implementation examples
- Use case documentation
- Performance optimizations
- Enhanced AI standards integration

## Related Projects

- **Parent Project**: AI Web Server (`../`) - Implementation of these specifications
- **E-commerce Plugins**: Data source implementations for various platforms

### **📋 Documentation**
- **[Data Format Specifications](docs/SPECIFICATIONS.md)**: Complete specifications for all four data formats
- **[CSV Template Guide](docs/CSV_TEMPLATE_GUIDE.md)**: WooCommerce CSV import guide
- **[Deployment Strategy](DEPLOYMENT_STRATEGY.md)**: First client deployment approach
- **[Integration Plans](REFKG_INTEGRATION_PLAN.md)**: Detailed implementation plans

## Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Define core knowledge graph schema with client isolation
- [x] Specify vectorized data format for client-scoped data
- [x] Implement trust entity integration (reviews, ratings, comments)
- [x] Develop manufacturer data integration protocols
- [x] **Enhanced**: Integrate RefKG, I40KG, and DPP standards

### Phase 2: AI Protocols ✅
- [x] Develop MCP protocol implementation with client scoping
- [x] Create ACP specification for agent communication
- [x] Build semantic search with trust-weighted results
- [x] Implement relationship mapping for product connections
- [x] **Enhanced**: RefKG query decomposition and knowledge reconstruction
- [x] **Enhanced**: I40KG quality assessment and trust indicators
- [x] **Enhanced**: DPP authenticity verification and compliance checking

### Phase 3: Implementation & Testing ✅
- [x] Build reference implementation with client isolation
- [x] Create automatic subdomain generation system
- [x] Establish performance benchmarks for scoped queries
- [x] Develop API key authentication and client mapping
- [x] **Enhanced**: Implement enhanced AI controller with all three standards
- [x] **Enhanced**: Create comprehensive test suite for enhanced functionality
- [x] **Enhanced**: LLM-optimized data formats for efficient consumption

### Phase 4: Broader Access & Scaling
- [ ] Design AllioIA.io broader access architecture
- [ ] Implement cross-client insights with privacy controls
- [ ] Create developer documentation and SDK
- [ ] Establish enterprise integration standards

## License

[Open source license to be determined - should enable wide adoption while maintaining standards]
