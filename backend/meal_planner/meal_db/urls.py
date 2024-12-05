from django.urls import path
from . import views

urlpatterns = [
    path('dining_halls/', views.dining_hall_list_create, name='dining_hall_list_create'),
    path('menus/', views.get_menus, name='get_menus'),
    path('create_menu/', views.create_menu, name='create_menu'),
    path('update_menu_with_foods/<int:menu_id>/', views.update_menu_with_foods, name='update_menu_with_foods'),
    path('add_food/', views.add_food, name='add_food'),
    path('create_food/', views.create_food, name='create_food'),
    path('foods/', views.get_all_foods, name='get_all_foods'),  # Endpoint to retrieve all foods
    path('find_food_combination/', views.find_food_combination, name='find_food_combination'),
    path('register_user/', views.register_user, name='register_user'),
    path('login_user/', views.login_user, name='login_user'),
]
