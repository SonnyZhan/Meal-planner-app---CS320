from rest_framework import serializers
from .models import User, DiningHall, Menu, Food
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['userID', 'plannerID']


# Custom Token Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims to the JWT token
        token['userID'] = user.userID  # Assuming userID exists in the User model
        token['plannerID'] = user.plannerID  # Assuming plannerID exists in the User model
        token['email'] = user.email  # You can include more fields as needed
        
        return token


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

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
