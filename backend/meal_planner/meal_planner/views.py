from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def msal_auth_callback(request):
    try:
        # Get the MSAL user info from the request
        msal_user_id = request.data.get('msal_user_id')
        email = request.data.get('email')
        display_name = request.data.get('display_name')

        if not msal_user_id:
            return Response({'error': 'MSAL user ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Try to find existing user with this MSAL ID
        try:
            user = User.objects.get(username=msal_user_id)
        except User.DoesNotExist:
            # Create new user if doesn't exist
            username = email if email else msal_user_id
            user = User.objects.create_user(
                username=msal_user_id,
                email=email,
                first_name=display_name if display_name else '',
                password=None  # No password needed as we're using MSAL
            )

        # Log the user in
        login(request, user)

        return Response({
            'message': 'Authentication successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name
            }
        })

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 