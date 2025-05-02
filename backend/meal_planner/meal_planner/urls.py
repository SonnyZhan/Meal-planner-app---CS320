"""
URL configuration for meal_planner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'dining_halls': reverse('dining_hall_list_create', request=request, format=format),
        'menus': reverse('get_menus', request=request, format=format),
        'foods': reverse('get_all_foods', request=request, format=format),
        'allergens': reverse('get_allergens', request=request, format=format),
        'user_info': reverse('get_user_info', request=request, format=format),
        'user_preferences': reverse('get_user_preferences', request=request, format=format),
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root'),
    path('api/', include('meal_db.urls')),
]
    
