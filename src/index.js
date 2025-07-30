/**
 * AI-Optimized Subdomain Server
 * 
 * Main server implementation for the AI-optimized subdomain project.
 * Provides APIs for products, search, categories, trust, and manufacturers
 * with client isolation and multiple data formats.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';

// Import schemas and formats
import KnowledgeGraphSchema from './schemas/knowledge-graph-schema.js';
import VectorizedFormat from './formats/vectorized-format.js';
import MCPProtocol from './formats/mcp-protocol.js';
import ACPProtocol from './formats/acp-protocol.js';
import RawGraphFormat from './formats/raw-graph-format.js';

// Import services
import { ClientService } from './services/client-service.js';
import { ProductService } from './services/product-service.js';
import { SearchService } from './services/search-service.js';
import { TrustService } from './services/trust-service.js';
import { ManufacturerService } from './services/manufacturer-service.js';
import { CategoryService } from './services/category-service.js';

// Import hybrid controller
import { HybridController } from './controllers/hybrid-controller.js';

// Import LLM-optimized controller
import { LLMOptimizedController } from './controllers/llm-optimized-controller.js';

// Import enhanced AI controller
import { EnhancedAIController } from './controllers/enhanced-ai-controller.js';

// Import middleware
import { authMiddleware } from './middleware/auth.js';
import { clientIsolationMiddleware } from './middleware/client-isolation.js';
import { rateLimitMiddleware } from './middleware/rate-limit.js';
import { validationMiddleware } from './middleware/validation.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize cache
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Initialize services
const clientService = new ClientService();
const productService = new ProductService();
const searchService = new SearchService();
const trustService = new TrustService();
const manufacturerService = new ManufacturerService();
const categoryService = new CategoryService();

// Initialize hybrid controller
const hybridController = new HybridController();

// Initialize LLM-optimized controller
const llmOptimizedController = new LLMOptimizedController();

// Initialize enhanced AI controller
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
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${requestId}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'AI-Optimized Subdomain'
  });
});

// Register hybrid routes (combines demo compatibility with AI optimization)
hybridController.registerRoutes(app);

// Register LLM-optimized routes (superior to website scraping)
llmOptimizedController.registerRoutes(app);

// Register enhanced AI routes (RefKG + I40KG + DPP integration)
enhancedAIController.registerRoutes(app);

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
  console.log(`AI-Optimized Subdomain Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/`);
});

export default app; 