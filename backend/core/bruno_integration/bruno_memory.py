"""
Bruno Memory - Conversation memory management
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class MemoryManager:
    """Manages conversation history and context."""
    
    def __init__(self, db_backend=None):
        """
        Initialize memory manager.
        
        Args:
            db_backend: Database backend for persistent storage (optional)
        """
        self.db_backend = db_backend
        self.in_memory_cache: Dict[str, List[Dict]] = {}
        logger.info("Initialized MemoryManager")
    
    async def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Add a message to conversation history.
        
        Args:
            conversation_id: ID of the conversation
            role: Message role ('user', 'assistant', 'system')
            content: Message content
            metadata: Additional metadata (tokens, model, etc.)
        """
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": metadata or {}
        }
        
        # Add to in-memory cache
        if conversation_id not in self.in_memory_cache:
            self.in_memory_cache[conversation_id] = []
        self.in_memory_cache[conversation_id].append(message)
        
        # Persist to database if backend is available
        if self.db_backend:
            await self.db_backend.save_message(conversation_id, message)
        
        logger.debug(f"Added message to conversation {conversation_id}: {role}")
    
    async def get_history(
        self,
        conversation_id: str,
        limit: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve conversation history.
        
        Args:
            conversation_id: ID of the conversation
            limit: Maximum number of messages to return (most recent)
            
        Returns:
            List of message dicts
        """
        # Try to get from database first
        if self.db_backend:
            messages = await self.db_backend.get_messages(conversation_id, limit)
            if messages:
                return messages
        
        # Fallback to in-memory cache
        messages = self.in_memory_cache.get(conversation_id, [])
        
        if limit:
            messages = messages[-limit:]
        
        logger.debug(f"Retrieved {len(messages)} messages for conversation {conversation_id}")
        return messages
    
    async def clear_conversation(self, conversation_id: str) -> None:
        """Clear conversation history."""
        if conversation_id in self.in_memory_cache:
            del self.in_memory_cache[conversation_id]
        
        if self.db_backend:
            await self.db_backend.clear_conversation(conversation_id)
        
        logger.info(f"Cleared conversation {conversation_id}")
    
    async def get_summary(self, conversation_id: str) -> Dict[str, Any]:
        """Get conversation summary statistics."""
        messages = await self.get_history(conversation_id)
        
        user_messages = [m for m in messages if m["role"] == "user"]
        assistant_messages = [m for m in messages if m["role"] == "assistant"]
        
        total_tokens = sum(
            m.get("metadata", {}).get("tokens_used", 0)
            for m in messages
        )
        
        return {
            "total_messages": len(messages),
            "user_messages": len(user_messages),
            "assistant_messages": len(assistant_messages),
            "total_tokens": total_tokens,
            "conversation_id": conversation_id
        }


class DjangoMemoryBackend:
    """Django database backend for memory storage."""
    
    def __init__(self, message_model, conversation_model):
        """
        Initialize Django backend.
        
        Args:
            message_model: Django Message model class
            conversation_model: Django Conversation model class
        """
        self.message_model = message_model
        self.conversation_model = conversation_model
    
    async def save_message(
        self,
        conversation_id: str,
        message: Dict[str, Any]
    ) -> None:
        """Save message to Django database."""
        try:
            from asgiref.sync import sync_to_async
            
            @sync_to_async
            def _save():
                conversation = self.conversation_model.objects.get(id=conversation_id)
                self.message_model.objects.create(
                    conversation=conversation,
                    role=message["role"],
                    content=message["content"],
                    model=message.get("metadata", {}).get("model", ""),
                    tokens_used=message.get("metadata", {}).get("tokens_used")
                )
            
            await _save()
        except Exception as e:
            logger.error(f"Error saving message to database: {str(e)}", exc_info=True)
    
    async def get_messages(
        self,
        conversation_id: str,
        limit: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Retrieve messages from Django database."""
        try:
            from asgiref.sync import sync_to_async
            
            @sync_to_async
            def _get():
                queryset = self.message_model.objects.filter(
                    conversation_id=conversation_id
                ).order_by('created_at')
                
                if limit:
                    # Get the last N messages
                    queryset = queryset.reverse()[:limit]
                    messages = list(queryset)
                    messages.reverse()
                else:
                    messages = list(queryset)
                
                return [
                    {
                        "role": msg.role,
                        "content": msg.content,
                        "timestamp": msg.created_at.isoformat(),
                        "metadata": {
                            "model": msg.model,
                            "tokens_used": msg.tokens_used
                        }
                    }
                    for msg in messages
                ]
            
            return await _get()
        except Exception as e:
            logger.error(f"Error getting messages from database: {str(e)}", exc_info=True)
            return []
    
    async def clear_conversation(self, conversation_id: str) -> None:
        """Clear all messages for a conversation."""
        try:
            from asgiref.sync import sync_to_async
            
            @sync_to_async
            def _clear():
                self.message_model.objects.filter(
                    conversation_id=conversation_id
                ).delete()
            
            await _clear()
        except Exception as e:
            logger.error(f"Error clearing conversation: {str(e)}", exc_info=True)
