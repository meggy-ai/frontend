"""JWT authentication for Django REST Framework."""
from rest_framework import authentication, exceptions
from apps.accounts.jwt import get_user_from_token


class JWTAuthentication(authentication.BaseAuthentication):
    """JWT token authentication for DRF."""
    
    def authenticate(self, request):
        # Get token from Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        user = get_user_from_token(token)
        
        if user is None:
            raise exceptions.AuthenticationFailed('Invalid or expired token')
        
        if not user.is_active:
            raise exceptions.AuthenticationFailed('User account is disabled')
        
        return (user, token)
    
    def authenticate_header(self, request):
        return 'Bearer'
