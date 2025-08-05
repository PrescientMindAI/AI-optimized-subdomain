/**
 * Client Configuration Management
 * 
 * Handles dynamic client configuration loading and management
 */

import fs from 'fs/promises';
import path from 'path';

export class ClientConfigManager {
  constructor() {
    this.configPath = path.join(process.cwd(), 'data', 'client-config.json');
    this.config = null;
    this.clients = new Map();
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      
      // Initialize clients map
      if (this.config.clients) {
        this.config.clients.forEach(client => {
          this.clients.set(client.id, client);
        });
      }
      
      return this.config;
    } catch (error) {
      console.error('Error loading client configuration:', error);
      // Return default configuration if file doesn't exist
      return this.getDefaultConfig();
    }
  }

  /**
   * Save configuration to file
   */
  async saveConfig() {
    try {
      const configData = {
        clients: Array.from(this.clients.values()),
        defaults: this.config?.defaults || this.getDefaultConfig().defaults
      };
      
      await fs.writeFile(this.configPath, JSON.stringify(configData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving client configuration:', error);
      return false;
    }
  }

  /**
   * Get default configuration
   */
  getDefaultConfig() {
    return {
      clients: [],
      defaults: {
        features: ['refkg', 'i40kg', 'dpp'],
        status: 'active',
        trustScore: 0.8,
        currency: 'USD'
      }
    };
  }

  /**
   * Get client by ID
   */
  getClient(clientId) {
    return this.clients.get(clientId) || null;
  }

  /**
   * Get all clients
   */
  getAllClients() {
    return Array.from(this.clients.values());
  }

  /**
   * Add new client
   */
  async addClient(clientData) {
    const client = {
      id: clientData.id,
      name: clientData.name,
      domain: clientData.domain,
      subdomain: clientData.subdomain || clientData.domain,
      apiKey: clientData.apiKey,
      status: clientData.status || 'active',
      features: clientData.features || this.config?.defaults?.features || ['refkg', 'i40kg', 'dpp'],
      deployment_date: new Date().toISOString(),
      metadata: clientData.metadata || {}
    };

    this.clients.set(client.id, client);
    await this.saveConfig();
    return client;
  }

  /**
   * Update client
   */
  async updateClient(clientId, updates) {
    const client = this.clients.get(clientId);
    if (!client) {
      return null;
    }

    Object.assign(client, updates);
    client.updatedAt = new Date().toISOString();
    
    this.clients.set(clientId, client);
    await this.saveConfig();
    return client;
  }

  /**
   * Remove client
   */
  async removeClient(clientId) {
    const removed = this.clients.delete(clientId);
    if (removed) {
      await this.saveConfig();
    }
    return removed;
  }

  /**
   * Get client configuration
   */
  getClientConfig(clientId) {
    const client = this.getClient(clientId);
    if (!client) {
      return null;
    }

    return {
      ...client,
      defaults: this.config?.defaults || this.getDefaultConfig().defaults
    };
  }

  /**
   * Validate client configuration
   */
  validateClientConfig(clientData) {
    const required = ['id', 'name', 'domain', 'apiKey'];
    const missing = required.filter(field => !clientData[field]);
    
    if (missing.length > 0) {
      return {
        valid: false,
        errors: missing.map(field => `${field} is required`)
      };
    }

    return {
      valid: true,
      errors: []
    };
  }

  /**
   * Get configuration defaults
   */
  getDefaults() {
    return this.config?.defaults || this.getDefaultConfig().defaults;
  }
}

export default ClientConfigManager; 