/**
 * Hybrid Controller - Reference Implementation
 * 
 * Demonstrates hybrid API patterns combining multiple data formats
 * and backward compatibility for AI-enhanced knowledge graphs.
 */

import { JSONLDFormat } from '../formats/json-ld-format.js';

export class HybridController {
  constructor() {
    // Initialize format handlers
    this.jsonLdFormat = JSONLDFormat;
  }

  /**
   * Register all hybrid endpoints
   * @param {Object} app - Express application
   */
  registerRoutes(app) {
    // Demo project compatibility endpoints
    this.registerCompatibilityRoutes(app);
    
    // AI-optimized endpoints
    this.registerAIOptimizedRoutes(app);
    
    // Data format endpoints
    this.registerFormatRoutes(app);
  }

  /**
   * Register compatibility routes
   */
  registerCompatibilityRoutes(app) {
    // LLM discovery file
    app.get('/.well-known/llms.txt', (req, res) => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const discoveryContent = this.jsonLdFormat.createLLMDiscoveryFile(baseUrl);
      res.set('Content-Type', 'text/plain');
      res.send(discoveryContent);
    });

    // Entities JSON-LD endpoint
    app.get('/entities.json', async (req, res) => {
      try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const entities = await this.getAllEntities();
        const jsonLdGraph = this.jsonLdFormat.formatEntityGraph(entities, baseUrl);
        res.json(jsonLdGraph);
      } catch (error) {
        console.error('Error serving entities.json:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Single entity by ID
    app.get('/entity/:id', async (req, res) => {
      try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const entity = await this.getEntityById(req.params.id);
        
        if (!entity) {
          return res.status(404).json({ error: 'Entity not found' });
        }
        
        const jsonLdEntity = this.jsonLdFormat.formatEntity(entity, baseUrl);
        res.json({
          "@context": "https://schema.org",
          ...jsonLdEntity
        });
      } catch (error) {
        console.error('Error serving entity:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Root endpoint with API documentation
    app.get('/', (req, res) => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      res.json({
        message: 'AI-Enhanced Knowledge Graph API',
        description: 'Hybrid API combining multiple formats with AI optimization',
        endpoints: {
          // Compatibility endpoints
          'entities.json': 'All entities in JSON-LD format',
          'entity/:id': 'Single entity by ID in JSON-LD format',
          '.well-known/llms.txt': 'LLM discovery file',
          
          // AI-optimized endpoints
          'api/enhanced/search': 'Enhanced search with RefKG, I40KG, DPP',
          'api/enhanced/entities/:id': 'Enhanced entity with all standards',
          'api/llm/entities/:id': 'LLM-optimized entity data',
          
          // Format endpoints
          'api/formats/vectorized': 'Vectorized data format',
          'api/formats/mcp': 'Model Context Protocol format',
          'api/formats/acp': 'AI Context Protocol format',
          'api/formats/graph': 'Raw graph format'
        },
        standards: ['RefKG', 'I40KG', 'DPP'],
        base_url: baseUrl
      });
    });
  }

  /**
   * Register AI-optimized routes
   */
  registerAIOptimizedRoutes(app) {
    // Enhanced search endpoint
    app.post('/api/enhanced/search', async (req, res) => {
      try {
        const { query, format = 'structured' } = req.body;
        
        if (!query) {
          return res.status(400).json({
            success: false,
            error: 'Query is required'
          });
        }

        const searchResults = await this.performEnhancedSearch(query);
        
        res.json({
          success: true,
          data: searchResults,
          metadata: {
            format: format,
            standards: ['RefKG', 'I40KG', 'DPP'],
            processing_time: Date.now() - req.startTime
          }
        });
      } catch (error) {
        console.error('Enhanced search error:', error);
        res.status(500).json({
          success: false,
          error: 'Enhanced search failed'
        });
      }
    });

    // Enhanced entity endpoint
    app.get('/api/enhanced/entities/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const entity = await this.getEnhancedEntity(id);
        
        if (!entity) {
          return res.status(404).json({
            success: false,
            error: 'Entity not found'
          });
        }
        
        res.json({
          success: true,
          data: entity,
          metadata: {
            standards: ['RefKG', 'I40KG', 'DPP'],
            enhanced: true
          }
        });
      } catch (error) {
        console.error('Enhanced entity error:', error);
        res.status(500).json({
          success: false,
          error: 'Enhanced entity retrieval failed'
        });
      }
    });
  }

  /**
   * Register format routes
   */
  registerFormatRoutes(app) {
    // Vectorized format endpoint
    app.get('/api/formats/vectorized/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const vectorizedData = await this.getVectorizedEntity(id);
        
        res.json({
          success: true,
          data: vectorizedData,
          format: 'vectorized'
        });
      } catch (error) {
        console.error('Vectorized format error:', error);
        res.status(500).json({
          success: false,
          error: 'Vectorized format retrieval failed'
        });
      }
    });

    // MCP format endpoint
    app.get('/api/formats/mcp/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const mcpData = await this.getMCPEntity(id);
        
        res.json({
          success: true,
          data: mcpData,
          format: 'mcp'
        });
      } catch (error) {
        console.error('MCP format error:', error);
        res.status(500).json({
          success: false,
          error: 'MCP format retrieval failed'
        });
      }
    });

    // ACP format endpoint
    app.get('/api/formats/acp/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const acpData = await this.getACPEntity(id);
        
        res.json({
          success: true,
          data: acpData,
          format: 'acp'
        });
      } catch (error) {
        console.error('ACP format error:', error);
        res.status(500).json({
          success: false,
          error: 'ACP format retrieval failed'
        });
      }
    });

    // Raw graph format endpoint
    app.get('/api/formats/graph/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const graphData = await this.getGraphEntity(id);
        
        res.json({
          success: true,
          data: graphData,
          format: 'graph'
        });
      } catch (error) {
        console.error('Graph format error:', error);
        res.status(500).json({
          success: false,
          error: 'Graph format retrieval failed'
        });
      }
    });
  }

  /**
   * Get all entities (implementation specific)
   */
  async getAllEntities() {
    // Implementation specific - replace with your data source
    return [
      { id: '1', name: 'Sample Entity 1', type: 'product' },
      { id: '2', name: 'Sample Entity 2', type: 'service' }
    ];
  }

  /**
   * Get entity by ID (implementation specific)
   */
  async getEntityById(id) {
    // Implementation specific - replace with your data source
    return {
      id: id,
      name: `Sample Entity ${id}`,
      type: 'product',
      description: 'Sample entity description'
    };
  }

  /**
   * Perform enhanced search (implementation specific)
   */
  async performEnhancedSearch(query) {
    // Implementation specific - replace with your search logic
    return {
      query: query,
      results: [
        { id: '1', name: 'Search Result 1', relevance: 0.95 },
        { id: '2', name: 'Search Result 2', relevance: 0.87 }
      ],
      metadata: {
        standards_used: ['RefKG', 'I40KG', 'DPP']
      }
    };
  }

  /**
   * Get enhanced entity (implementation specific)
   */
  async getEnhancedEntity(id) {
    // Implementation specific - replace with your enhanced entity logic
    return {
      id: id,
      name: `Enhanced Entity ${id}`,
      refkg_data: { query_decomposition: true },
      i40kg_data: { quality_certifications: ['ISO', 'CE'] },
      dpp_data: { authenticity_verified: true }
    };
  }

  /**
   * Get vectorized entity (implementation specific)
   */
  async getVectorizedEntity(id) {
    // Implementation specific - replace with your vectorization logic
    return {
      id: id,
      name: `Vectorized Entity ${id}`,
      vector: [0.1, 0.2, 0.3, 0.4, 0.5],
      metadata: { format: 'vectorized' }
    };
  }

  /**
   * Get MCP entity (implementation specific)
   */
  async getMCPEntity(id) {
    // Implementation specific - replace with your MCP format logic
    return {
      id: id,
      name: `MCP Entity ${id}`,
      context: 'Model Context Protocol data',
      metadata: { format: 'mcp' }
    };
  }

  /**
   * Get ACP entity (implementation specific)
   */
  async getACPEntity(id) {
    // Implementation specific - replace with your ACP format logic
    return {
      id: id,
      name: `ACP Entity ${id}`,
      context: 'AI Context Protocol data',
      metadata: { format: 'acp' }
    };
  }

  /**
   * Get graph entity (implementation specific)
   */
  async getGraphEntity(id) {
    // Implementation specific - replace with your graph format logic
    return {
      id: id,
      name: `Graph Entity ${id}`,
      nodes: [{ id: 'node1', type: 'entity' }],
      edges: [{ from: 'node1', to: 'node2', type: 'relationship' }],
      metadata: { format: 'graph' }
    };
  }
} 