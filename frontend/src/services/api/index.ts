/**
 * API Services Index
 * Exports all API service modules
 */

export { default as apiClient } from './client';
export { authService } from './auth';
export { agentsService } from './agents';
export { conversationsService } from './conversations';

export type { User, LoginRequest, RegisterRequest, AuthResponse } from './auth';
export type { Agent, CreateAgentRequest, UpdateAgentRequest } from './agents';
export type {
  Message,
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
} from './conversations';
