"""
Management command to update agent to use Meggy personality with notes feature
"""
from django.core.management.base import BaseCommand
from apps.agents.models import Agent


class Command(BaseCommand):
    help = 'Update default agent to Meggy with notes feature'

    def handle(self, *args, **options):
        agent = Agent.objects.filter(is_default=True).first()
        
        if not agent:
            self.stdout.write(self.style.ERROR('No default agent found!'))
            return
        
        agent.name = 'Meggy'
        agent.system_prompt = (
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
        )
        agent.save()
        
        self.stdout.write(self.style.SUCCESS(f'✓ Updated agent "{agent.name}" with notes functionality!'))
