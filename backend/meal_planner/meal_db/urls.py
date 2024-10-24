from django.urls import path
from . import views

urlpatterns = [
    path('search_food_combinations/', views.search_food_combinations, name='search_food_combinations'),
]
