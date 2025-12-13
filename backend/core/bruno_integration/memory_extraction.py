"""
Memory extraction and management for long-term user memory.
"""
from typing import Dict, List, Optional, Any
import logging
import re
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)


class MemoryExtractor:
    """Extracts and manages long-term memories from conversations."""
    
    def __init__(self):
        from apps.chat.models import UserMemory
        self.UserMemory = UserMemory
        logger.info("Initialized MemoryExtractor")
    
    async def extract_memories_from_conversation(
        self,
        user_id: str,
        conversation_text: str,
        message_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Extract memorable facts from conversation text.
        This is a simple pattern-based extraction. In production, you'd use an LLM.
        
        Args:
            user_id: User's ID
            conversation_text: Text to extract memories from
            message_id: Source message ID
            
        Returns:
            List of extracted memories
        """
        memories = []
        text_lower = conversation_text.lower()
        
        # Personal information patterns
        if match := re.search(r"my name is (\w+)", text_lower):
            memories.append({
                'key': 'user_name',
                'value': match.group(1).title(),
                'memory_type': 'personal',
                'importance': 10
            })
        
        if match := re.search(r"i live in ([\w\s]+?)(?:\.|,|$)", text_lower):
            memories.append({
                'key': 'location',
                'value': match.group(1).strip().title(),
                'memory_type': 'personal',
                'importance': 8
            })
        
        if match := re.search(r"i am (\d+) years old", text_lower):
            memories.append({
                'key': 'age',
                'value': match.group(1),
                'memory_type': 'personal',
                'importance': 7
            })
        
        # Preferences
        if match := re.search(r"i (?:love|like|enjoy) ([\w\s]+?)(?:\.|,|$)", text_lower):
            preference = match.group(1).strip()
            memories.append({
                'key': f'likes_{preference.replace(" ", "_")}',
                'value': f"Likes {preference}",
                'memory_type': 'preference',
                'importance': 6
            })
        
        if match := re.search(r"i (?:hate|dislike|don't like) ([\w\s]+?)(?:\.|,|$)", text_lower):
            dislike = match.group(1).strip()
            memories.append({
                'key': f'dislikes_{dislike.replace(" ", "_")}',
                'value': f"Dislikes {dislike}",
                'memory_type': 'preference',
                'importance': 6
            })
        
        if match := re.search(r"my favorite ([\w\s]+?) is ([\w\s]+?)(?:\.|,|$)", text_lower):
            category = match.group(1).strip()
            favorite = match.group(2).strip()
            memories.append({
                'key': f'favorite_{category.replace(" ", "_")}',
                'value': favorite.title(),
                'memory_type': 'preference',
                'importance': 7
            })
        
        # Goals
        if match := re.search(r"i want to ([\w\s]+?)(?:\.|,|$)", text_lower):
            goal = match.group(1).strip()
            memories.append({
                'key': f'goal_{goal[:30].replace(" ", "_")}',
                'value': f"Wants to {goal}",
                'memory_type': 'goal',
                'importance': 8
            })
        
        if match := re.search(r"my goal is to ([\w\s]+?)(?:\.|,|$)", text_lower):
            goal = match.group(1).strip()
            memories.append({
                'key': f'goal_{goal[:30].replace(" ", "_")}',
                'value': f"Goal: {goal}",
                'memory_type': 'goal',
                'importance': 9
            })
        
        # Skills
        if match := re.search(r"i (?:am|am a) ([\w\s]+?)(?:\.|,|$)", text_lower):
            skill_or_role = match.group(1).strip()
            if any(word in skill_or_role for word in ['developer', 'designer', 'engineer', 'teacher', 'student', 'artist']):
                memories.append({
                    'key': 'profession',
                    'value': skill_or_role.title(),
                    'memory_type': 'skill',
                    'importance': 8
                })
        
        # Relationships
        if match := re.search(r"my (?:wife|husband|partner|spouse) is ([\w\s]+?)(?:\.|,|$)", text_lower):
            name = match.group(1).strip()
            memories.append({
                'key': 'partner_name',
                'value': name.title(),
                'memory_type': 'relationship',
                'importance': 10
            })
        
        # Save extracted memories
        if memories:
            saved = await self.save_memories(user_id, memories, message_id)
            logger.info(f"Extracted and saved {len(saved)} memories for user {user_id}")
            return saved
        
        return []
    
    async def save_memories(
        self,
        user_id: str,
        memories: List[Dict[str, Any]],
        source_message_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Save extracted memories to database.
        
        Args:
            user_id: User's ID
            memories: List of memory dicts
            source_message_id: Source message ID
            
        Returns:
            List of saved memories
        """
        @sync_to_async
        def save():
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(id=user_id)
            saved_memories = []
            
            for mem in memories:
                # Update or create memory
                memory, created = self.UserMemory.objects.update_or_create(
                    user=user,
                    key=mem['key'],
                    defaults={
                        'value': mem['value'],
                        'memory_type': mem.get('memory_type', 'fact'),
                        'importance': mem.get('importance', 5),
                        'confidence': mem.get('confidence', 1.0),
                        'source_message_id': source_message_id
                    }
                )
                
                if not created:
                    # If updating, increment access count
                    memory.access_count += 1
                    memory.save(update_fields=['access_count', 'last_accessed'])
                
                saved_memories.append({
                    'id': str(memory.id),
                    'key': memory.key,
                    'value': memory.value,
                    'type': memory.memory_type,
                    'created': created
                })
            
            return saved_memories
        
        return await save()
    
    async def get_relevant_memories(
        self,
        user_id: str,
        query: Optional[str] = None,
        memory_types: Optional[List[str]] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant memories for context.
        
        Args:
            user_id: User's ID
            query: Optional query to filter relevant memories
            memory_types: Optional list of memory types to filter
            limit: Maximum number of memories to return
            
        Returns:
            List of relevant memories
        """
        @sync_to_async
        def get():
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(id=user_id)
            
            queryset = self.UserMemory.objects.filter(user=user)
            
            if memory_types:
                queryset = queryset.filter(memory_type__in=memory_types)
            
            # Order by importance and recency
            queryset = queryset.order_by('-importance', '-last_accessed')[:limit]
            
            memories = []
            for mem in queryset:
                # Update access tracking
                mem.access()
                
                memories.append({
                    'id': str(mem.id),
                    'key': mem.key,
                    'value': mem.value,
                    'type': mem.memory_type,
                    'importance': mem.importance,
                    'access_count': mem.access_count
                })
            
            return memories
        
        return await get()
    
    async def format_memories_for_context(
        self,
        user_id: str,
        limit: int = 10
    ) -> str:
        """
        Format memories as context string for LLM.
        
        Args:
            user_id: User's ID
            limit: Maximum memories to include
            
        Returns:
            Formatted string of memories
        """
        memories = await self.get_relevant_memories(user_id, limit=limit)
        
        if not memories:
            return ""
        
        # Group by type
        by_type = {}
        for mem in memories:
            mem_type = mem['type']
            if mem_type not in by_type:
                by_type[mem_type] = []
            by_type[mem_type].append(mem)
        
        # Format as context
        lines = ["=== What I Remember About You ==="]
        
        type_labels = {
            'personal': '👤 Personal',
            'preference': '⭐ Preferences',
            'relationship': '❤️ Relationships',
            'goal': '🎯 Goals',
            'experience': '📅 Experiences',
            'skill': '🛠️ Skills',
            'fact': '💡 Facts'
        }
        
        for mem_type, mems in by_type.items():
            label = type_labels.get(mem_type, mem_type.title())
            lines.append(f"\n{label}:")
            for mem in mems:
                lines.append(f"  • {mem['value']}")
        
        lines.append("\n=== End of Memories ===\n")
        
        return "\n".join(lines)


# Global memory extractor instance
memory_extractor = MemoryExtractor()
