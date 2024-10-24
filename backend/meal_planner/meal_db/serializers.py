from rest_framework import serializers
from .models import User, DiningHall, Menu, Food

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
    dining_hall = DiningHallSerializer(read_only=True)  # Nested serializer to show dining hall info

    class Meta:
        model = Menu
        fields = ['id', 'dining_hall', 'time_slot']


# Alternative MenuSerializer (to allow selecting dining hall by ID)
class MenuSerializer(serializers.ModelSerializer):
    dining_hall = serializers.PrimaryKeyRelatedField(queryset=DiningHall.objects.all())  # Allows selecting dining hall by ID

    class Meta:
        model = Menu
        fields = ['id', 'dining_hall', 'time_slot']


# Food Serializer
class FoodSerializer(serializers.ModelSerializer):
    menu = MenuSerializer(read_only=True)  # Nested serializer to show menu details

    class Meta:
        model = Food
        fields = ['id', 'menu', 'name', 'calories', 'carbs', 'proteins', 'fats', 'calcium']


# Alternative FoodSerializer (to allow selecting menu by ID)
class FoodSerializer(serializers.ModelSerializer):
    menu = serializers.PrimaryKeyRelatedField(queryset=Menu.objects.all())  # Allows selecting menu by ID

    class Meta:
        model = Food
        fields = ['id', 'menu', 'name', 'calories', 'carbs', 'proteins', 'fats', 'calcium']
