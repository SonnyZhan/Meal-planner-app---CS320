from email.utils import parsedate
from django.http import JsonResponse
import re
from itertools import combinations
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Food, Menu, DiningHall, User, MealPlanner, Food
import datetime
from .serializers import FoodSerializer, MenuSerializer, DiningHallSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import User
from django.db.utils import IntegrityError

from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this endpoint
def register_user(request):
    """
    Register a new user and return a token for authentication.
    """
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()  # Save the user instance created by the serializer
            token, _ = Token.objects.get_or_create(user=user)  # Generate a token for the user

            return Response({
                "message": "User registered successfully",
                "token": token.key
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_user(request):
    """
    API endpoint to authenticate a user.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Both email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=email, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "message": "Login successful",
            "token": token.key
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def get_all_foods(request):
    # Retrieve all food items from the database
    foods = Food.objects.all()
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_food(request):
    serializer = FoodSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_menu(request):
    serializer = MenuSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Endpoint for adding a food item to an existing menu
@api_view(['POST'])
def add_food(request):
    serializer = FoodSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_menus(request):
    menus = Menu.objects.all()
    serializer = MenuSerializer(menus, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def dining_hall_list_create(request):
    if request.method == 'GET':
        dining_halls = DiningHall.objects.all()
        serializer = DiningHallSerializer(dining_halls, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = DiningHallSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_menu_with_foods(request):
    serializer = MenuSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_menu_with_foods(request, menu_id):
    try:
        menu = Menu.objects.get(id=menu_id)
    except Menu.DoesNotExist:
        return Response({"error": "Menu not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = MenuSerializer(menu, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def parse_nutritional_value(value):
    """Helper function to parse numerical values from strings like '7.7 gram'."""
    try:
        # Extract the first numerical value using regex
        return float(re.search(r"[-+]?\d*\.\d+|\d+", value).group())
    except (AttributeError, TypeError, ValueError):
        return 0.0

@api_view(['GET'])
def find_food_combination(request):
    # Get input parameters from the request
    try:
        dining_hall_name = request.GET.get('dining_hall')
        date_str = request.GET.get('date')
        meal_name = request.GET.get('meal')
        target_calories = int(request.GET.get('calories'))
        target_carbs = float(request.GET.get('total_carbs'))
        target_protein = float(request.GET.get('protein'))
        allergens = request.GET.getlist('allergens')  # List of allergens to exclude

        # Parse the date from the input
        menu_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    except (TypeError, ValueError):
        return Response({'error': 'Invalid input parameters'}, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve the specified dining hall
    try:
        dining_hall = DiningHall.objects.get(name__iexact=dining_hall_name)
    except DiningHall.DoesNotExist:
        return Response({'error': 'Dining hall not found'}, status=status.HTTP_404_NOT_FOUND)

    # Retrieve the menu for the given dining hall, date, and meal name
    try:
        menu = Menu.objects.get(dining_hall=dining_hall, meal_name__iexact=meal_name, menu_date=menu_date)
    except Menu.DoesNotExist:
        return Response({'error': 'Menu not found for the specified dining hall, date, and meal'}, status=status.HTTP_404_NOT_FOUND)

    # Get all food items for the menu, excluding items with specified allergens
    food_items = Food.objects.filter(menu=menu)
    filtered_foods = []

    for food in food_items:
        try:
            # Skip items containing any of the specified allergens
            food_allergens = food.allergens or []
            if any(allergen in food_allergens for allergen in allergens):
                continue

            # Directly use the integer value for calories
            calories = food.calories if food.calories is not None else 0

            # Parse nutritional values for total_carbs and protein
            total_carbs = parse_nutritional_value(food.total_carb)
            protein = parse_nutritional_value(food.protein)

            filtered_foods.append({
                'dish_name': food.dish_name,
                'calories': calories,
                'total_carbs': total_carbs,
                'protein': protein,
            })
        except ValueError:
            continue

    # If there are less than 3 valid food items, return an error
    if len(filtered_foods) < 3:
        return Response({'error': 'Not enough food items to form a combination'}, status=status.HTTP_404_NOT_FOUND)

    exact_matches = []
    closest_combinations = []
    closest_diff = float('inf')

    # Iterate through all combinations of three food items
    for combo in combinations(filtered_foods, 3):
        total_calories = sum(item['calories'] for item in combo)
        total_carbs = sum(item['total_carbs'] for item in combo)
        total_protein = sum(item['protein'] for item in combo)

        # Check for exact match
        if (total_calories == target_calories and
            total_carbs == target_carbs and
            total_protein == target_protein):
            exact_matches.append(combo)
            continue

        # Calculate the difference from the target values
        diff = (
            abs(total_calories - target_calories) +
            abs(total_carbs - target_carbs) +
            abs(total_protein - target_protein)
        )

        # Store the combination and its difference
        closest_combinations.append((combo, diff))

    # If there are exact matches, return all of them
    if exact_matches:
        return Response({'exact_matches': exact_matches}, status=status.HTTP_200_OK)

    # If no exact match, sort by difference and return the top 5 closest combinations
    closest_combinations.sort(key=lambda x: x[1])
    top_5_closest = [combo for combo, diff in closest_combinations[:5]]

    return Response({'closest_combinations': top_5_closest}, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_meal_to_planner(request):
    """
    API endpoint to add a meal to the MealPlanner.
    """
    try:
        # Parse the request data
        user_id = request.data.get('user_id')
        meal_time = request.data.get('meal_time')
        date = parsedate(request.data.get('date'))
        dining_hall_name = request.data.get('dining_hall')
        foods_data = request.data.get('foods', [])

        # Validate user
        user = User.objects.get(user_id=user_id)

        # Validate dining hall
        dining_hall = DiningHall.objects.get(name__iexact=dining_hall_name)

        # Create or get the meal planner entry
        meal_planner, created = MealPlanner.objects.get_or_create(
            user=user,
            meal_time=meal_time,
            date=date,
            dining_hall=dining_hall,
        )

        # Link the food items to the meal planner
        for food_item in foods_data:
            food, _ = Food.objects.get_or_create(dish_name=food_item['dish_name'])
            meal_planner.foods.add(food)

        return Response({"message": "Meal successfully added to the planner!"}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except DiningHall.DoesNotExist:
        return Response({"error": "Dining hall not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_meal_planner(request, user_id):
    """
    Retrieve all meals from the MealPlanner for a specific user.
    """
    try:
        # Retrieve the user's meal planner
        meal_plans = MealPlanner.objects.filter(user__user_id=user_id).select_related('dining_hall').prefetch_related('foods')

        # Format the response
        data = []
        for plan in meal_plans:
            foods = plan.foods.all()
            food_data = [
                {
                    "dish_name": food.dish_name,
                    "calories": food.calories,
                    "protein": food.protein,
                    "total_carb": food.total_carb,
                }
                for food in foods
            ]

            data.append({
                "meal_time": plan.meal_time,
                "date": plan.date,
                "dining_hall": plan.dining_hall.name if plan.dining_hall else None,
                "foods": food_data,
            })

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
