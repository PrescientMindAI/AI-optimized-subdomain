# AI-Optimized Subdomain - Beta Test Branch

## Overview

The **AI-Optimized Subdomain** project defines the open-source specifications, protocols, and data formats that are served on `ai.domain.xyz` subdomains. This project provides the technical documentation and implementation guidelines for the AI-ready format that enables AI agents, LLMs, and AI browsers to efficiently consume e-commerce data with client isolation and trust integration.

## Mission

To establish universal standards for AI-accessible e-commerce data that enables seamless interaction between AI systems and online commerce platforms, while ensuring data isolation per client, reducing token usage, and improving AI decision-making through integrated trust indicators and rich product relationships.

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
- **Specification**: [To be documented]

#### 2. MCP (Model Context Protocol)
- **Purpose**: Direct integration with AI models and language models
- **Use Case**: LLMs accessing structured product data as context
- **Specification**: [To be documented]

#### 3. ACP (AI Context Protocol)  
- **Purpose**: Standardized communication between AI agents and data sources
- **Use Case**: Multi-agent systems coordinating product research and recommendations
- **Specification**: [To be documented]

#### 4. Raw Graph Format
- **Purpose**: Direct knowledge graph queries and traversal
- **Use Case**: Complex AI reasoning over product relationships
- **Specification**: [To be documented]

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

### API Endpoints (Proposed)
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
6. All while being isolated from other vendors' data

## Contributing

This is an open-source project aimed at establishing industry standards. Contributions are welcome for:
- Protocol specifications
- Implementation examples
- Use case documentation
- Performance optimizations

## Related Projects

- **Parent Project**: AI Web Server (`../`) - Implementation of these specifications
- **E-commerce Plugins**: Data source implementations for various platforms

## Roadmap

### Phase 1: Core Infrastructure
- [ ] Define core knowledge graph schema with client isolation
- [ ] Specify vectorized data format for client-scoped data
- [ ] Implement trust entity integration (reviews, ratings, comments)
- [ ] Develop manufacturer data integration protocols

### Phase 2: AI Protocols
- [ ] Develop MCP protocol implementation with client scoping
- [ ] Create ACP specification for agent communication
- [ ] Build semantic search with trust-weighted results
- [ ] Implement relationship mapping for product connections

### Phase 3: Implementation & Testing
- [ ] Build reference implementation with client isolation
- [ ] Create automatic subdomain generation system
- [ ] Establish performance benchmarks for scoped queries
- [ ] Develop API key authentication and client mapping

### Phase 4: Broader Access & Scaling
- [ ] Design AllioIA.io broader access architecture
- [ ] Implement cross-client insights with privacy controls
- [ ] Create developer documentation and SDK
- [ ] Establish enterprise integration standards

## License

[Open source license to be determined - should enable wide adoption while maintaining standards]
