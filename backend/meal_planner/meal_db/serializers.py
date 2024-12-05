from rest_framework import serializers
from .models import DiningHall, Menu, Food

# DiningHall Serializer
class DiningHallSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiningHall
        fields = ['id', 'location_id', 'name', 'opening_hours', 'closing_hours']

# Menu Serializer
class MenuSerializer(serializers.ModelSerializer):
    dining_hall = serializers.StringRelatedField()

    class Meta:
        model = Menu
        fields = ['id', 'dining_hall', 'meal_name', 'category_name', 'menu_date']

# Food Serializer
class FoodSerializer(serializers.ModelSerializer):
    menu = serializers.StringRelatedField()

    class Meta:
        model = Food
        fields = [
            'id', 'menu', 'dish_name', 'healthfulness', 'carbon_list', 'ingredient_list', 'allergens',
            'recipe_webcode', 'diets', 'serving_size', 'calories', 'calories_from_fat',
            'total_fat', 'sat_fat', 'trans_fat', 'cholesterol', 'sodium', 'total_carb',
            'dietary_fiber', 'sugars', 'protein'
        ]
