"""Custom authentication backend for JWT."""
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from .jwt import get_user_from_token

User = get_user_model()


class JWTAuthenticationBackend(BaseBackend):
    """Authenticate users using JWT tokens."""
    
    def authenticate(self, request, token=None, **kwargs):
        if token is None:
            return None
        
        user = get_user_from_token(token)
        if user and user.is_active:
            return user
        return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
