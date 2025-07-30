/**
 * ACP (AI Context Protocol) Specification
 * 
 * Purpose: Standardized communication between AI agents and data sources
 * Use Case: Multi-agent systems coordinating product research and recommendations
 */

export const ACPProtocol = {
  // Protocol version and metadata
  protocol: {
    version: "1.0.0",
    name: "AI-Optimized Subdomain ACP",
    description: "AI Context Protocol for multi-agent e-commerce systems",
    baseUrl: "ai.domain.xyz",
    endpoints: {
      agents: "/acp/agents",
      coordination: "/acp/coordination",
      context: "/acp/context",
      recommendations: "/acp/recommendations",
      research: "/acp/research"
    }
  },

  // Agent registration and management
  agentManagement: {
    // Agent registration
    registration: {
      endpoint: "/acp/agents/register",
      method: "POST",
      body: {
        agentId: "string",
        agentType: "string", // "shopping", "research", "comparison", "recommendation"
        capabilities: ["string"],
        clientId: "string",
        preferences: "object",
        metadata: "object"
      }
    },

    // Agent discovery
    discovery: {
      endpoint: "/acp/agents/discover",
      method: "GET",
      queryParams: {
        agentType: "string",
        clientId: "string",
        capabilities: "string",
        availability: "boolean"
      }
    },

    // Agent status
    status: {
      endpoint: "/acp/agents/{agent_id}/status",
      method: "GET",
      response: {
        agentId: "string",
        status: "string", // "active", "busy", "idle", "offline"
        currentTask: "object",
        capabilities: ["string"],
        performance: "object"
      }
    }
  },

  // Multi-agent coordination
  coordination: {
    // Task distribution
    taskDistribution: {
      endpoint: "/acp/coordination/tasks",
      method: "POST",
      body: {
        taskId: "string",
        taskType: "string", // "search", "compare", "recommend", "research"
        priority: "number", // 1-10
        requirements: "object",
        agents: ["string"], // Agent IDs to involve
        context: "object"
      }
    },

    // Context sharing
    contextSharing: {
      endpoint: "/acp/coordination/context",
      method: "POST",
      body: {
        sessionId: "string",
        agentId: "string",
        context: "object",
        timestamp: "date",
        ttl: "number" // Time to live in seconds
      }
    },

    // Result aggregation
    resultAggregation: {
      endpoint: "/acp/coordination/results",
      method: "POST",
      body: {
        taskId: "string",
        agentId: "string",
        results: "object",
        confidence: "number",
        metadata: "object"
      }
    }
  },

  // Context management
  contextManagement: {
    // Context creation
    contextCreation: {
      endpoint: "/acp/context/create",
      method: "POST",
      body: {
        sessionId: "string",
        userQuery: "string",
        userContext: "object",
        agentContext: "object",
        productContext: "object",
        trustContext: "object"
      }
    },

    // Context retrieval
    contextRetrieval: {
      endpoint: "/acp/context/{session_id}",
      method: "GET",
      queryParams: {
        includeHistory: "boolean",
        includeTrust: "boolean",
        includeRelationships: "boolean"
      }
    },

    // Context update
    contextUpdate: {
      endpoint: "/acp/context/{session_id}",
      method: "PUT",
      body: {
        updates: "object",
        timestamp: "date",
        agentId: "string"
      }
    }
  },

  // Research coordination
  research: {
    // Research task creation
    researchTask: {
      endpoint: "/acp/research/task",
      method: "POST",
      body: {
        researchId: "string",
        query: "string",
        scope: "string", // "product", "category", "manufacturer", "trust"
        depth: "string", // "shallow", "moderate", "deep"
        agents: ["string"],
        constraints: "object"
      }
    },

    // Research result submission
    researchResult: {
      endpoint: "/acp/research/result",
      method: "POST",
      body: {
        researchId: "string",
        agentId: "string",
        findings: "object",
        sources: ["object"],
        confidence: "number",
        metadata: "object"
      }
    },

    // Research synthesis
    researchSynthesis: {
      endpoint: "/acp/research/synthesize",
      method: "POST",
      body: {
        researchId: "string",
        synthesis: "object",
        recommendations: ["object"],
        nextSteps: ["object"]
      }
    }
  },

  // Recommendation system
  recommendations: {
    // Recommendation request
    recommendationRequest: {
      endpoint: "/acp/recommendations/request",
      method: "POST",
      body: {
        sessionId: "string",
        userProfile: "object",
        currentContext: "object",
        constraints: "object",
        preferences: "object"
      }
    },

    // Multi-agent recommendation
    multiAgentRecommendation: {
      endpoint: "/acp/recommendations/multi-agent",
      method: "POST",
      body: {
        sessionId: "string",
        agents: ["string"],
        strategy: "string", // "consensus", "weighted", "specialized"
        weights: "object",
        context: "object"
      }
    },

    // Recommendation feedback
    recommendationFeedback: {
      endpoint: "/acp/recommendations/feedback",
      method: "POST",
      body: {
        sessionId: "string",
        recommendationId: "string",
        feedback: "object",
        userRating: "number",
        agentId: "string"
      }
    }
  },

  // Communication patterns
  communication: {
    // Direct agent communication
    directCommunication: {
      endpoint: "/acp/communication/direct",
      method: "POST",
      body: {
        fromAgentId: "string",
        toAgentId: "string",
        message: "object",
        priority: "string", // "low", "normal", "high", "urgent"
        ttl: "number"
      }
    },

    // Broadcast communication
    broadcast: {
      endpoint: "/acp/communication/broadcast",
      method: "POST",
      body: {
        fromAgentId: "string",
        message: "object",
        targetAgents: ["string"], // Empty for all agents
        priority: "string",
        ttl: "number"
      }
    },

    // Message retrieval
    messageRetrieval: {
      endpoint: "/acp/communication/messages",
      method: "GET",
      queryParams: {
        agentId: "string",
        priority: "string",
        limit: "number",
        offset: "number"
      }
    }
  },

  // Response formats
  responseFormats: {
    // Standard ACP response
    standard: {
      success: "boolean",
      requestId: "string",
      timestamp: "date",
      data: "object",
      metadata: {
        agentId: "string",
        sessionId: "string",
        processingTime: "number"
      }
    },

    // Multi-agent response
    multiAgent: {
      sessionId: "string",
      taskId: "string",
      results: [{
        agentId: "string",
        result: "object",
        confidence: "number",
        processingTime: "number"
      }],
      consensus: "object",
      recommendations: ["object"]
    },

    // Research response
    research: {
      researchId: "string",
      query: "string",
      findings: ["object"],
      synthesis: "object",
      recommendations: ["object"],
      nextSteps: ["object"],
      confidence: "number"
    }
  },

  // Error handling
  errorHandling: {
    // Error response format
    errorResponse: {
      success: false,
      error: {
        code: "string",
        message: "string",
        agentId: "string",
        sessionId: "string",
        details: "object"
      }
    },

    // Error codes
    errorCodes: {
      "AGENT_NOT_FOUND": "Agent not found or unavailable",
      "SESSION_EXPIRED": "Session has expired",
      "TASK_FAILED": "Task execution failed",
      "CONTEXT_INVALID": "Invalid context provided",
      "COORDINATION_FAILED": "Agent coordination failed",
      "RESEARCH_TIMEOUT": "Research task timed out"
    }
  },

  // Performance and monitoring
  performance: {
    // Performance metrics
    metrics: {
      responseTime: {
        agentRegistration: "< 50ms",
        contextRetrieval: "< 100ms",
        taskDistribution: "< 200ms",
        resultAggregation: "< 300ms"
      },
      throughput: {
        concurrentAgents: 100,
        messagesPerSecond: 1000,
        researchTasksPerMinute: 60
      }
    },

    // Monitoring
    monitoring: {
      agentHealth: "continuous",
      sessionTracking: "enabled",
      performanceMetrics: "enabled",
      errorTracking: "enabled"
    }
  },

  // Security and privacy
  security: {
    // Authentication
    authentication: {
      agentAuthentication: "required",
      sessionAuthentication: "required",
      apiKeyValidation: "required"
    },

    // Data privacy
    privacy: {
      clientIsolation: true,
      sessionIsolation: true,
      dataEncryption: true,
      auditLogging: true
    }
  }
};

export default ACPProtocol; 