from django.db import models
from django.conf import settings
import uuid


class Note(models.Model):
    """A note collection that contains multiple entries."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    name = models.CharField(max_length=100, default='Untitled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.entry_count} entries)"
    
    @property
    def entry_count(self):
        """Get count of entries in this note."""
        return self.entries.count()


class NoteEntry(models.Model):
    """An individual entry within a note."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name='entries'
    )
    content = models.TextField()
    position = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'note_entries'
        ordering = ['position', 'created_at']
        indexes = [
            models.Index(fields=['note', 'position']),
        ]
        verbose_name_plural = 'Note entries'
    
    def __str__(self):
        return f"{self.note.name}: {self.content[:50]}"


class UserMemory(models.Model):
    """
    Long-term memory storage for user information.
    Stores facts, preferences, and knowledge about the user that Meggy learns over time.
    """
    
    MEMORY_TYPES = [
        ('personal', 'Personal Information'),  # Name, age, location, etc.
        ('preference', 'Preference'),  # Likes, dislikes, habits
        ('relationship', 'Relationship'),  # People in user's life
        ('goal', 'Goal/Aspiration'),  # User's goals and dreams
        ('experience', 'Past Experience'),  # Important past events
        ('skill', 'Skill/Ability'),  # What user can do
        ('fact', 'General Fact'),  # Any other factual information
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='memories'
    )
    memory_type = models.CharField(max_length=20, choices=MEMORY_TYPES, default='fact')
    key = models.CharField(max_length=200, help_text='Memory key/topic (e.g., "favorite_food", "hometown")')
    value = models.TextField(help_text='The actual memory content')
    confidence = models.FloatField(default=1.0, help_text='Confidence score 0-1')
    importance = models.IntegerField(default=5, help_text='Importance score 1-10')
    
    # When was this memory formed/last accessed
    first_mentioned = models.DateTimeField(auto_now_add=True)
    last_accessed = models.DateTimeField(auto_now=True)
    access_count = models.IntegerField(default=0)
    
    # Source tracking
    source_message_id = models.UUIDField(null=True, blank=True, help_text='Message that created this memory')
    
    class Meta:
        db_table = 'user_memories'
        ordering = ['-importance', '-last_accessed']
        indexes = [
            models.Index(fields=['user', 'memory_type']),
            models.Index(fields=['user', '-importance']),
            models.Index(fields=['user', 'key']),
        ]
        unique_together = [['user', 'key']]
    
    def __str__(self):
        return f"{self.user.email}: {self.key} = {self.value[:50]}"
    
    def access(self):
        """Increment access count and update last accessed time."""
        self.access_count += 1
        self.save(update_fields=['access_count', 'last_accessed'])


class Conversation(models.Model):
    """
    Single continuous conversation timeline between user and Meggy AI.
    Each user has ONE conversation - this represents their ongoing relationship with Meggy.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversation')
    agent = models.ForeignKey('agents.Agent', on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=200, default='Chat with Meggy')
    
    # Proactive agent settings
    is_active = models.BooleanField(default=True, help_text='Whether Meggy is actively monitoring and can proactively engage')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'conversations'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Meggy & {self.user.email}"
    
    @classmethod
    def get_or_create_for_user(cls, user):
        """
        Get or create the single conversation for a user.
        Each user has exactly one conversation with Meggy.
        """
        # Get or create default agent for user
        from apps.agents.models import Agent
        agent = user.agents.filter(is_default=True).first() or user.agents.first()
        
        if not agent:
            # Create a default Meggy agent for this user
            agent = Agent.objects.create(
                user=user,
                name='Meggy',
                description='Your proactive AI companion',
                llm_provider='ollama',
                model='llama3.2:latest',
                temperature=0.7,
                max_tokens=2000,
                system_prompt=(
                    'You are Meggy, a friendly and proactive AI companion who learns about your user over time. '
                    'You have access to long-term memories about the user (their name, preferences, goals, relationships, etc.) '
                    'which will be provided at the start of each conversation. Use these memories to personalize your responses. '
                    '\n\n'
                    'You provide clear, concise responses while maintaining a warm, conversational tone. '
                    '\n\n'
                    'BUILT-IN FEATURES:\n'
                    '• Notes System: Users can say "show notes" to access their notes, create new notes, add entries, and manage their collection.\n'
                    '• Memory: You automatically remember important facts about the user (name, preferences, goals, etc.) and can reference them naturally.\n'
                    '\n'
                    'When users share personal information, acknowledge it naturally - you\'ll remember it for future conversations. '
                    'Be proactive and caring, like a good friend who pays attention and remembers what matters.'
                ),
                is_default=True,
                is_active=True
            )
        
        conversation, created = cls.objects.get_or_create(
            user=user,
            defaults={
                'agent': agent,
                'title': 'Chat with Meggy',
                'is_active': True
            }
        )
        return conversation, created


class Message(models.Model):
    """Individual message in a conversation."""
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    
    # Metadata
    tokens_used = models.IntegerField(null=True, blank=True)
    model = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'messages'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."
