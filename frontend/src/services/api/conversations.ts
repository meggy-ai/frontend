/**
 * Conversations API Service
 */

import apiClient from './client';

export interface Message {
  id: string;
  conversation: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used?: number;
  model?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  agent: string;
  title: string;
  messages?: Message[];
  message_count?: number;
  last_message?: {
    role: string;
    content: string;
    created_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateConversationRequest {
  agent: string;
  title?: string;
}

export interface UpdateConversationRequest {
  title?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  user_message: Message;
  assistant_message: Message;
}

export const conversationsService = {
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<{ results: Conversation[] }>('/conversations/');
    return response.data.results || response.data;
  },

  /**
   * Get a specific conversation by ID with messages
   */
  async getConversation(id: string): Promise<Conversation> {
    const response = await apiClient.get<Conversation>(`/conversations/${id}/`);
    return response.data;
  },

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    const response = await apiClient.post<Conversation>('/conversations/', data);
    return response.data;
  },

  /**
   * Update a conversation
   */
  async updateConversation(id: string, data: UpdateConversationRequest): Promise<Conversation> {
    const response = await apiClient.patch<Conversation>(`/conversations/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/conversations/${id}/`);
  },

  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId: string, data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>(
      `/conversations/${conversationId}/send_message/`,
      data
    );
    return response.data;
  },

  /**
   * Get all messages for a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiClient.get<{ results: Message[] }>(`/messages/?conversation=${conversationId}`);
    return response.data.results || response.data;
  },
};

export default conversationsService;
