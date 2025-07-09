# AI Optimized Web Server - Beta Test Branch

## Overview

The **AllioIA AI Web Server** is a data conversion and optimization platform that automatically transforms e-commerce data into AI-ready formats. It acts as a bridge between e-commerce platforms and AI agents, enabling seamless data access and processing for Large Language Models (LLMs), AI agents, AI bots, and AI browsers.

## Purpose

This project takes product and commerce data from AllioIA plugins installed on e-commerce websites and automatically converts it into the **AI-optimized-subdomain format**. This format is then served on automatically generated `ai.domain.xyz` subdomains, providing AI agents with optimized data access for each individual e-commerce site.

## Architecture

### Data Flow
1. **Source**: E-commerce plugins (e.g., WooCommerce, Shopify, Magento) installed on websites
2. **Data Push**: Plugins push data to the AI Web Server using API keys for authentication
3. **Processing**: AI Web Server converts and optimizes the data into knowledge graphs
4. **Client Isolation**: Each client's data is stored in their own section of the knowledge graph
5. **Output**: AI-optimized format served via automatically generated `ai.domain.xyz` subdomain
6. **Consumption**: AI agents access client-specific structured, vectorized, and graph-based data

### Key Components

- **Plugin Integration**: Receives data from e-commerce plugins via API key authentication
- **Data Conversion Engine**: Transforms raw e-commerce data into unified knowledge graphs
- **Client Isolation System**: Maintains separate data sections for each e-commerce client
- **Format Optimization**: Generates multiple AI-friendly formats (vectorized, MCP, ACP, etc.) from the same graph
- **Subdomain Service**: Automatically generates and serves `ai.domain.xyz` subdomains for each client

## Features

### Knowledge Graph Generation
The system creates comprehensive knowledge graphs that include:
- **Product Information**: Core details, variations, and specifications
- **Product Relationships**: Similar products, complementary items, and cross-references
- **Trust Entities**: External reviews, customer comments, and credibility indicators
- **Manufacturer Data**: Official product URLs and manufacturer information
- **Structured Metadata**: Optimized annotations for AI processing and understanding

### Multiple Output Formats
All formats are generated from the same underlying knowledge graph, providing flexibility for different AI use cases:
- **Vectorized Data**: For similarity search and filtering
- **MCP (Model Context Protocol)**: For AI model integration
- **ACP (AI Context Protocol)**: For agent communication
- **Raw Graph Data**: For direct knowledge graph queries

### Client Isolation & Access Control
- **Individual Subdomains**: Each e-commerce site gets its own `ai.domain.xyz` with isolated data
- **Scoped Data Access**: AI agents accessing `ai.appleseller.com` only see apple products
- **Future Expansion**: AllioIA.io will provide broader access to the complete knowledge graph

### AI-Optimized Benefits
1. **Structured Data Processing**: Enables AI to understand product relationships and trust indicators
2. **Format Flexibility**: AI can ingest the same data in its preferred format
3. **Direct Interaction**: AI can query and filter data efficiently with reduced token usage
4. **Trust Integration**: Built-in access to reviews, ratings, and manufacturer verification

## Real-World Example

**Scenario**: An AI agent visits an apple seller's website to find the best apples for baking.

**Traditional Approach**:
- Scraping product pages
- Using basic search functionality  
- Processing unstructured HTML
- No access to trust indicators or relationships

**With AI-Optimized Subdomain**:
- Access vectorized apple data via `ai.appleseller.com`
- Semantic search for "baking apples" using natural language
- Find apple varieties with relationships to baking recipes
- Access integrated reviews mentioning baking performance
- Get manufacturer specifications and certifications
- Complete the task with significantly fewer tokens and higher accuracy

## Related Projects

- **E-commerce Plugins**: Separate projects providing data access (e.g., `../Woocommerce-plugin/`)
- **AI-Optimized-Subdomain**: Open-source specifications and protocols (`./AI-optimized-subdomain/`)

## Getting Started

This project is currently in beta testing phase. The AI-optimized-subdomain specifications are being developed in the sub-project directory.

## License

[To be determined based on project requirements]
