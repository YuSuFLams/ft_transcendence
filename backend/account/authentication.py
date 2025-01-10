from rest_framework_simplejwt.authentication import JWTAuthentication

class MyJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        
        if (access_token is None):
            return (None)
        
        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
        except:
            return (None)
        return (user, validated_token)
        

"""Overriding authenticate method on JWTAuthentication

    def authenticate(self, request: Request) -> Optional[Tuple[AuthUser, Token]]:
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)

        return self.get_user(validated_token), validated_token
"""
