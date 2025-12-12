from django.contrib import admin
from .models import Agent

@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'llm_provider', 'model', 'is_default', 'is_active', 'created_at']
    list_filter = ['llm_provider', 'is_default', 'is_active']
    search_fields = ['name', 'user__email']
    ordering = ['-created_at']
