from django.urls import path, include
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
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path('allergens/', views.get_allergens, name='get_allergens'),
    path('allergens/update/', views.update_allergens, name='update_allergens'),
    path('update_allergens_and_restrictions/', views.update_allergens_and_restrictions, name='update_allergens_and_restrictions'),
    path('user_meal_combinations/', views.get_user_meal_combinations, name='get_user_meal_combinations'),
    path('save_user_meal_combinations/', views.save_user_meal_combinations, name='save_user_meal_combinations'),
    path('delete_user_meal_combination/<int:combination_id>/', views.delete_user_meal_combination, name='delete_user_meal_combination'),
]




