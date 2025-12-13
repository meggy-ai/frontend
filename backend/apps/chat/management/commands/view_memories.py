"""
Management command to view user memories
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.chat.models import UserMemory


User = get_user_model()


class Command(BaseCommand):
    help = 'View long-term memories for a user'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user',
            type=str,
            help='User email or ID',
        )
        parser.add_argument(
            '--type',
            type=str,
            help='Filter by memory type (personal, preference, goal, etc.)',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all memories for user',
        )

    def handle(self, *args, **options):
        user_filter = options.get('user')
        memory_type = options.get('type')
        clear = options.get('clear')
        
        if not user_filter:
            # Show memories for all users
            users = User.objects.all()
        else:
            # Try to find user by email or ID
            try:
                users = [User.objects.get(email=user_filter)]
            except User.DoesNotExist:
                try:
                    users = [User.objects.get(id=user_filter)]
                except User.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'User not found: {user_filter}'))
                    return
        
        for user in users:
            memories = UserMemory.objects.filter(user=user)
            
            if memory_type:
                memories = memories.filter(memory_type=memory_type)
            
            if clear:
                count = memories.count()
                memories.delete()
                self.stdout.write(self.style.SUCCESS(f'✓ Cleared {count} memories for {user.email}'))
                continue
            
            self.stdout.write('\n' + '='*60)
            self.stdout.write(f'Memories for: {user.email}')
            self.stdout.write('='*60)
            
            if not memories.exists():
                self.stdout.write(self.style.WARNING('No memories found.'))
                continue
            
            # Group by type
            by_type = {}
            for mem in memories.order_by('memory_type', '-importance'):
                if mem.memory_type not in by_type:
                    by_type[mem.memory_type] = []
                by_type[mem.memory_type].append(mem)
            
            type_icons = {
                'personal': '👤',
                'preference': '⭐',
                'relationship': '❤️',
                'goal': '🎯',
                'experience': '📅',
                'skill': '🛠️',
                'fact': '💡'
            }
            
            for mem_type, mems in by_type.items():
                icon = type_icons.get(mem_type, '📝')
                self.stdout.write(f'\n{icon} {mem_type.upper()}:')
                for mem in mems:
                    importance_bar = '█' * mem.importance
                    self.stdout.write(
                        f'  • {mem.key}: {mem.value} '
                        f'[{importance_bar}] '
                        f'(accessed {mem.access_count}x)'
                    )
            
            total = memories.count()
            self.stdout.write(f'\nTotal: {total} memories')
