/**
 * React Query Hooks for API calls
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  agentsService,
  conversationsService,
  Agent,
  Conversation,
  Message,
  CreateAgentRequest,
  UpdateAgentRequest,
  CreateConversationRequest,
  UpdateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
} from '@/services/api';

// Query Keys
export const queryKeys = {
  agents: ['agents'] as const,
  agent: (id: string) => ['agents', id] as const,
  defaultAgent: ['agents', 'default'] as const,
  conversations: ['conversations'] as const,
  conversation: (id: string) => ['conversations', id] as const,
  messages: (conversationId: string) => ['messages', conversationId] as const,
};

// ============================================================================
// AGENTS HOOKS
// ============================================================================

/**
 * Get all agents
 */
export const useAgents = (options?: UseQueryOptions<Agent[], Error>) => {
  return useQuery<Agent[], Error>({
    queryKey: queryKeys.agents,
    queryFn: () => agentsService.getAgents(),
    ...options,
  });
};

/**
 * Get a specific agent
 */
export const useAgent = (id: string, options?: UseQueryOptions<Agent, Error>) => {
  return useQuery<Agent, Error>({
    queryKey: queryKeys.agent(id),
    queryFn: () => agentsService.getAgent(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Get default agent
 */
export const useDefaultAgent = (options?: UseQueryOptions<Agent, Error>) => {
  return useQuery<Agent, Error>({
    queryKey: queryKeys.defaultAgent,
    queryFn: () => agentsService.getDefaultAgent(),
    ...options,
  });
};

/**
 * Create agent mutation
 */
export const useCreateAgent = (options?: UseMutationOptions<Agent, Error, CreateAgentRequest>) => {
  const queryClient = useQueryClient();

  return useMutation<Agent, Error, CreateAgentRequest>({
    mutationFn: (data) => agentsService.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents });
    },
    ...options,
  });
};

/**
 * Update agent mutation
 */
export const useUpdateAgent = (options?: UseMutationOptions<Agent, Error, { id: string; data: UpdateAgentRequest }>) => {
  const queryClient = useQueryClient();

  return useMutation<Agent, Error, { id: string; data: UpdateAgentRequest }>({
    mutationFn: ({ id, data }) => agentsService.updateAgent(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents });
      queryClient.invalidateQueries({ queryKey: queryKeys.agent(variables.id) });
    },
    ...options,
  });
};

/**
 * Delete agent mutation
 */
export const useDeleteAgent = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => agentsService.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents });
    },
    ...options,
  });
};

// ============================================================================
// CONVERSATIONS HOOKS
// ============================================================================

/**
 * Get all conversations
 */
export const useConversations = (options?: UseQueryOptions<Conversation[], Error>) => {
  return useQuery<Conversation[], Error>({
    queryKey: queryKeys.conversations,
    queryFn: () => conversationsService.getConversations(),
    ...options,
  });
};

/**
 * Get a specific conversation with messages
 */
export const useConversation = (id: string, options?: UseQueryOptions<Conversation, Error>) => {
  return useQuery<Conversation, Error>({
    queryKey: queryKeys.conversation(id),
    queryFn: () => conversationsService.getConversation(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Create conversation mutation
 */
export const useCreateConversation = (
  options?: UseMutationOptions<Conversation, Error, CreateConversationRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, CreateConversationRequest>({
    mutationFn: (data) => conversationsService.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
    ...options,
  });
};

/**
 * Update conversation mutation
 */
export const useUpdateConversation = (
  options?: UseMutationOptions<Conversation, Error, { id: string; data: UpdateConversationRequest }>
) => {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, { id: string; data: UpdateConversationRequest }>({
    mutationFn: ({ id, data }) => conversationsService.updateConversation(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversation(variables.id) });
    },
    ...options,
  });
};

/**
 * Delete conversation mutation
 */
export const useDeleteConversation = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => conversationsService.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
    ...options,
  });
};

/**
 * Send message mutation
 */
export const useSendMessage = (
  options?: UseMutationOptions<SendMessageResponse, Error, { conversationId: string; data: SendMessageRequest }>
) => {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, Error, { conversationId: string; data: SendMessageRequest }>({
    mutationFn: ({ conversationId, data }) => conversationsService.sendMessage(conversationId, data),
    onSuccess: (data, variables) => {
      // Invalidate conversation to refresh messages
      queryClient.invalidateQueries({ queryKey: queryKeys.conversation(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
    ...options,
  });
};
