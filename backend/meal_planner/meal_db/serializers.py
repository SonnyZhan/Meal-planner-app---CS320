from rest_framework import serializers
from .models import User, DiningHall, Menu, Food, MealCombination

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['userID', 'plannerID']


# DiningHall Serializer
class DiningHallSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiningHall
        fields = ['id', 'name']


# Menu Serializer
class MenuSerializer(serializers.ModelSerializer):
    dining_hall = serializers.PrimaryKeyRelatedField(queryset=DiningHall.objects.all())
    foods = serializers.PrimaryKeyRelatedField(many=True, queryset=Food.objects.all())

    class Meta:
        model = Menu
        fields = [
            'id', 'dining_hall', 'time_slot', 'day_of_week', 'date', 'foods', 
            'description', 'is_special'
        ]

# Food Serializer
class FoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Food
        fields = ['id', 'name', 'calories', 'carbs', 'proteins', 'fats',]

class MealCombinationSerializer(serializers.ModelSerializer):
    foods = FoodSerializer(many=True)  # Nesting FoodSerializer to show details of each food

    class Meta:
        model = MealCombination
        fields = ['id', 'menu', 'foods', 'calories', 'proteins', 'fats', 'carbs', 'created_at']
