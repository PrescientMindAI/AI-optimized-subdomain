/**
 * Client Service
 * 
 * Manages client isolation, authentication, and agent registration
 * for the AI-optimized subdomain system.
 */

import { v4 as uuidv4 } from 'uuid';

export class ClientService {
  constructor() {
    // In-memory storage for clients (in production, use database)
    this.clients = new Map();
    this.agents = new Map();
    this.sessions = new Map();
    
    // Initialize with some test clients
    this.initializeTestClients();
  }

  /**
   * Initialize test clients for development
   */
  initializeTestClients() {
    const testClients = [
      {
        id: 'freshapples',
        name: 'Fresh Apples Orchard',
        domain: 'freshapples.com',
        apiKey: 'test-api-key-freshapples',
        status: 'active',
        createdAt: new Date(),
        metadata: {
          industry: 'agriculture',
          region: 'pacific-northwest',
          productTypes: ['fruits', 'vegetables', 'organic']
        }
      },
      {
        id: 'techstore',
        name: 'Tech Store',
        domain: 'techstore.com',
        apiKey: 'test-api-key-techstore',
        status: 'active',
        createdAt: new Date(),
        metadata: {
          industry: 'electronics',
          region: 'global',
          productTypes: ['computers', 'phones', 'accessories']
        }
      },
      {
        id: 'bookstore',
        name: 'Online Bookstore',
        domain: 'bookstore.com',
        apiKey: 'test-api-key-bookstore',
        status: 'active',
        createdAt: new Date(),
        metadata: {
          industry: 'publishing',
          region: 'global',
          productTypes: ['books', 'ebooks', 'audiobooks']
        }
      }
    ];

    testClients.forEach(client => {
      this.clients.set(client.id, client);
    });
  }

  /**
   * Authenticate client by API key
   * @param {string} apiKey - The API key to authenticate
   * @returns {object|null} - Client object if authenticated, null otherwise
   */
  authenticateClient(apiKey) {
    for (const [clientId, client] of this.clients) {
      if (client.apiKey === apiKey && client.status === 'active') {
        return client;
      }
    }
    return null;
  }

  /**
   * Get client by ID
   * @param {string} clientId - The client ID
   * @returns {object|null} - Client object if found, null otherwise
   */
  getClient(clientId) {
    return this.clients.get(clientId) || null;
  }

  /**
   * Register a new client
   * @param {object} clientData - Client registration data
   * @returns {object} - Registered client object
   */
  registerClient(clientData) {
    const clientId = clientData.id || this.generateClientId(clientData.domain);
    
    const client = {
      id: clientId,
      name: clientData.name,
      domain: clientData.domain,
      apiKey: this.generateApiKey(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: clientData.metadata || {}
    };

    this.clients.set(clientId, client);
    return client;
  }

  /**
   * Register an AI agent
   * @param {object} agentData - Agent registration data
   * @returns {object} - Registered agent object
   */
  registerAgent(agentData) {
    const agentId = agentData.agentId || uuidv4();
    
    const agent = {
      id: agentId,
      type: agentData.agentType,
      capabilities: agentData.capabilities || [],
      clientId: agentData.clientId,
      preferences: agentData.preferences || {},
      metadata: agentData.metadata || {},
      status: 'active',
      registeredAt: new Date(),
      lastSeen: new Date()
    };

    this.agents.set(agentId, agent);
    return agent;
  }

  /**
   * Get agent by ID
   * @param {string} agentId - The agent ID
   * @returns {object|null} - Agent object if found, null otherwise
   */
  getAgent(agentId) {
    return this.agents.get(agentId) || null;
  }

  /**
   * Update agent status
   * @param {string} agentId - The agent ID
   * @param {string} status - New status
   * @param {object} currentTask - Current task information
   * @returns {object} - Updated agent object
   */
  updateAgentStatus(agentId, status, currentTask = null) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    agent.status = status;
    agent.currentTask = currentTask;
    agent.lastSeen = new Date();
    agent.updatedAt = new Date();

    this.agents.set(agentId, agent);
    return agent;
  }

  /**
   * Discover agents by criteria
   * @param {object} criteria - Search criteria
   * @returns {array} - Array of matching agents
   */
  discoverAgents(criteria) {
    const { agentType, clientId, capabilities, availability } = criteria;
    
    return Array.from(this.agents.values()).filter(agent => {
      if (agentType && agent.type !== agentType) return false;
      if (clientId && agent.clientId !== clientId) return false;
      if (capabilities && !capabilities.every(cap => agent.capabilities.includes(cap))) return false;
      if (availability !== undefined && (agent.status === 'active') !== availability) return false;
      return true;
    });
  }

  /**
   * Create a session for client isolation
   * @param {string} clientId - The client ID
   * @param {object} sessionData - Session data
   * @returns {object} - Created session object
   */
  createSession(clientId, sessionData) {
    const sessionId = uuidv4();
    
    const session = {
      id: sessionId,
      clientId,
      userQuery: sessionData.userQuery,
      userContext: sessionData.userContext || {},
      agentContext: sessionData.agentContext || {},
      productContext: sessionData.productContext || {},
      trustContext: sessionData.trustContext || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      ttl: sessionData.ttl || 3600 // 1 hour default
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get session by ID
   * @param {string} sessionId - The session ID
   * @returns {object|null} - Session object if found, null otherwise
   */
  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check if session has expired
    const now = new Date();
    const sessionAge = (now - session.createdAt) / 1000;
    if (sessionAge > session.ttl) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Update session
   * @param {string} sessionId - The session ID
   * @param {object} updates - Updates to apply
   * @returns {object} - Updated session object
   */
  updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    Object.assign(session, updates);
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Validate client access to data
   * @param {string} clientId - The client ID
   * @param {string} dataType - Type of data being accessed
   * @param {string} targetClientId - Target client ID for cross-client access
   * @returns {boolean} - Whether access is allowed
   */
  validateAccess(clientId, dataType, targetClientId = null) {
    const client = this.getClient(clientId);
    if (!client || client.status !== 'active') {
      return false;
    }

    // Client-scoped data access
    if (targetClientId && targetClientId !== clientId) {
      // Check if cross-client access is allowed
      const publicDataTypes = ['manufacturers', 'categories'];
      if (!publicDataTypes.includes(dataType)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Generate client ID from domain
   * @param {string} domain - The domain name
   * @returns {string} - Generated client ID
   */
  generateClientId(domain) {
    return domain.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  /**
   * Generate API key
   * @returns {string} - Generated API key
   */
  generateApiKey() {
    return `api-key-${uuidv4().replace(/-/g, '')}`;
  }

  /**
   * Get client statistics
   * @param {string} clientId - The client ID
   * @returns {object} - Client statistics
   */
  getClientStats(clientId) {
    const client = this.getClient(clientId);
    if (!client) return null;

    const agents = Array.from(this.agents.values()).filter(agent => agent.clientId === clientId);
    const sessions = Array.from(this.sessions.values()).filter(session => session.clientId === clientId);

    return {
      clientId,
      totalAgents: agents.length,
      activeAgents: agents.filter(agent => agent.status === 'active').length,
      totalSessions: sessions.length,
      activeSessions: sessions.filter(session => {
        const now = new Date();
        const sessionAge = (now - session.createdAt) / 1000;
        return sessionAge <= session.ttl;
      }).length,
      createdAt: client.createdAt,
      lastActivity: client.updatedAt
    };
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of this.sessions) {
      const sessionAge = (now - session.createdAt) / 1000;
      if (sessionAge > session.ttl) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

export default ClientService; 