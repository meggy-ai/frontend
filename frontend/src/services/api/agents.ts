/**
 * Agents API Service
 */

import apiClient from './client';

export interface Agent {
  id: string;
  name: string;
  description: string;
  llm_provider: 'openai' | 'ollama';
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentRequest {
  name: string;
  description?: string;
  llm_provider?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system_prompt?: string;
  is_default?: boolean;
}

export interface UpdateAgentRequest extends Partial<CreateAgentRequest> {
  is_active?: boolean;
}

export const agentsService = {
  /**
   * Get all agents for the current user
   */
  async getAgents(): Promise<Agent[]> {
    const response = await apiClient.get<{ results: Agent[] }>('/agents/');
    return response.data.results || response.data;
  },

  /**
   * Get a specific agent by ID
   */
  async getAgent(id: string): Promise<Agent> {
    const response = await apiClient.get<Agent>(`/agents/${id}/`);
    return response.data;
  },

  /**
   * Get or create the default agent
   */
  async getDefaultAgent(): Promise<Agent> {
    const response = await apiClient.get<Agent>('/agents/default/');
    return response.data;
  },

  /**
   * Create a new agent
   */
  async createAgent(data: CreateAgentRequest): Promise<Agent> {
    const response = await apiClient.post<Agent>('/agents/', data);
    return response.data;
  },

  /**
   * Update an existing agent
   */
  async updateAgent(id: string, data: UpdateAgentRequest): Promise<Agent> {
    const response = await apiClient.patch<Agent>(`/agents/${id}/`, data);
    return response.data;
  },

  /**
   * Delete an agent
   */
  async deleteAgent(id: string): Promise<void> {
    await apiClient.delete(`/agents/${id}/`);
  },
};

export default agentsService;
