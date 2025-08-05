/**
 * AI-Enhanced Knowledge Graph Server - Reference Implementation
 * 
 * Main server implementation demonstrating AI-enhanced knowledge graph
 * specifications with RefKG, I40KG, and DPP standards integration.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Import schemas and formats
import KnowledgeGraphSchema from './schemas/knowledge-graph-schema.js';
import VectorizedFormat from './formats/vectorized-format.js';
import MCPProtocol from './formats/mcp-protocol.js';
import ACPProtocol from './formats/acp-protocol.js';
import RawGraphFormat from './formats/raw-graph-format.js';

// Import controllers
import { HybridController } from './controllers/hybrid-controller.js';
import { LLMOptimizedController } from './controllers/llm-optimized-controller.js';
import { EnhancedAIController } from './controllers/enhanced-ai-controller.js';

// Import middleware
import { authMiddleware } from './middleware/auth.js';
import { validationMiddleware } from './middleware/validation.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize controllers
const hybridController = new HybridController();
const llmOptimizedController = new LLMOptimizedController();
const enhancedAIController = new EnhancedAIController();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const requestId = uuidv4();
  req.requestId = requestId;
  req.startTime = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${requestId}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'AI-Enhanced Knowledge Graph',
    standards: ['RefKG', 'I40KG', 'DPP']
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'AI-Enhanced Knowledge Graph API',
    description: 'Reference implementation of AI-enhanced knowledge graph specifications',
    version: '1.0.0',
    standards: {
      refkg: 'Reflective Knowledge Graph - Query decomposition and knowledge reconstruction',
      i40kg: 'Industry 4.0 Knowledge Graph - Quality certifications and supply chain transparency',
      dpp: 'Digital Product Passport - Authenticity verification and EU compliance'
    },
    endpoints: {
      '/': 'API documentation and discovery',
      '/health': 'Health check',
      '/entities.json': 'All entities in JSON-LD format',
      '/entity/:id': 'Single entity in JSON-LD format',
      '/api/enhanced/*': 'Enhanced endpoints with all three standards',
      '/api/llm/*': 'LLM-optimized endpoints',
      '/api/formats/*': 'Multiple data format endpoints'
    },
    formats: ['json-ld', 'vectorized', 'mcp', 'acp', 'graph'],
    allioia_integration: 'Endpoints for contributing to AllioIA.io ecosystem'
  });
});

// Register hybrid routes (compatibility + AI optimization)
hybridController.registerRoutes(app);

// Register LLM-optimized routes
llmOptimizedController.registerRoutes(app);

// Register enhanced AI routes (RefKG + I40KG + DPP integration)
enhancedAIController.registerRoutes(app);

// AllioIA.io integration endpoints
app.post('/api/allioia/contribute', async (req, res) => {
  try {
    const { entityData, permissions } = req.body;
    
    // Implementation specific - replace with your AllioIA.io integration
    const contributionResult = {
      id: 'contribution-' + Date.now(),
      status: 'success',
      entity_count: 1,
      permissions: permissions
    };
    
    res.json({
      success: true,
      data: contributionResult,
      message: 'Data contributed to AllioIA.io ecosystem'
    });
  } catch (error) {
    console.error('AllioIA contribution error:', error);
    res.status(500).json({
      success: false,
      error: 'AllioIA contribution failed'
    });
  }
});

app.get('/api/allioia/status', async (req, res) => {
  try {
    // Implementation specific - replace with your AllioIA.io status check
    const status = {
      connected: true,
      last_sync: new Date().toISOString(),
      data_contributed: 0,
      ecosystem_health: 'healthy'
    };
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('AllioIA status error:', error);
    res.status(500).json({
      success: false,
      error: 'AllioIA status retrieval failed'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      requestId: req.requestId
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: 'Endpoint not found',
      requestId: req.requestId
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`AI-Enhanced Knowledge Graph Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/api`);
  console.log(`Standards: RefKG, I40KG, DPP`);
});

export default app; 