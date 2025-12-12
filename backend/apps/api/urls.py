from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AgentViewSet, ConversationViewSet, MessageViewSet
from .auth_views import register, login, refresh_token, logout

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/refresh/', refresh_token, name='refresh_token'),
    path('auth/logout/', logout, name='logout'),
    
    # API endpoints
    path('', include(router.urls)),
]
