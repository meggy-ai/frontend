"""
Notes models for Bruno's note-taking feature.
"""
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
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.entries.count()} entries)"
    
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
        ordering = ['position', 'created_at']
        indexes = [
            models.Index(fields=['note', 'position']),
        ]
        verbose_name_plural = 'Note entries'
    
    def __str__(self):
        return f"{self.note.name}: {self.content[:50]}"
