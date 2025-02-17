from django.http import JsonResponse
import re
from itertools import combinations
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Food, Menu, DiningHall, allergen, dietaryrestriction, UserMealCombination
import datetime
from .serializers import FoodSerializer, MenuSerializer, DiningHallSerializer
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .models import allergen, dietaryrestriction

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
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access
def find_food_combination(request):
    user = request.user  # Get the authenticated user

    # Get input parameters from the request
    try:
        dining_hall_name = request.GET.get('dining_hall')
        date_str = request.GET.get('date')
        meal_name = request.GET.get('meal')
        target_calories = int(request.GET.get('calories'))
        target_carbs = float(request.GET.get('total_carbs'))
        target_protein = float(request.GET.get('protein'))
        extra_allergens = request.GET.getlist('allergens')  # Additional allergens to exclude

        # Prioritization parameters
        prioritize = request.GET.getlist('prioritize', [])  # e.g., ['calories', 'protein']

        # Parse the date from the input
        menu_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    except (TypeError, ValueError):
        return Response({'error': 'Invalid input parameters'}, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve the user's saved allergens and dietary restrictions
    try:
        user_allergens = allergen.objects.get(user=user).allergens
    except allergen.DoesNotExist:
        user_allergens = []

    try:
        user_dietary_restrictions = dietaryrestriction.objects.get(user=user).restrictions
    except dietaryrestriction.DoesNotExist:
        user_dietary_restrictions = []

    # Combine user-saved allergens with additional allergens from the request
    allergens_to_exclude = set(user_allergens + extra_allergens)

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

    # Get all food items for the menu, excluding items with specified allergens or dietary restrictions
    food_items = Food.objects.filter(menu=menu)
    filtered_foods = []

    for food in food_items:
        try:
            # Skip items containing any of the specified allergens
            food_allergens = food.allergens or []
            if any(allergen in allergens_to_exclude for allergen in food_allergens):
                continue

            # Skip items that do not comply with the user's dietary restrictions
            food_diets = food.diets or []
            if user_dietary_restrictions and not any(diet in user_dietary_restrictions for diet in food_diets):
                continue

            # Parse nutritional values
            calories = food.calories if food.calories is not None else 0
            total_carbs = parse_nutritional_value(food.total_carb)
            protein = parse_nutritional_value(food.protein)

            filtered_foods.append({
                'id': food.id,
                'dish_name': food.dish_name,
                'calories': calories,
                'total_carbs': total_carbs,
                'protein': protein,
                'menu_id': menu.id,
            })
        except ValueError:
            continue

    # If there are less than 3 valid food items, return an error
    if len(filtered_foods) < 3:
        return Response({'error': 'Not enough food items to form a combination'}, status=status.HTTP_404_NOT_FOUND)

    exact_matches = []
    closest_combinations = []
    closest_diff = float('inf')

    # Assign weights based on prioritization
    weights = {'calories': 1, 'total_carbs': 1, 'protein': 1}
    for priority in prioritize:
        if priority in weights:
            weights[priority] = 20  # Increase weight for prioritized nutrients

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

        # Calculate the weighted difference from the target values
        diff = (
            weights['calories'] * abs(total_calories - target_calories) +
            weights['total_carbs'] * abs(total_carbs - target_carbs) +
            weights['protein'] * abs(total_protein - target_protein)
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


@api_view(["POST"])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Authenticate the user
    user = authenticate(username=email, password=password)
    if user is not None:
        # Generate or retrieve the user's token
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.get_full_name(),
            },
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
def register_view(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=email, password=password, first_name=name)
    return Response({"message": "Registration successful."}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_allergens(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    allergens = request.user.allergens
    return Response({'allergens': allergens}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_allergens(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    allergens = request.data.get('allergens', [])
    if not isinstance(allergens, list):
        return Response({'error': 'Allergens should be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

    request.user.allergens = allergens
    request.user.save()
    return Response({'message': 'Allergens updated successfully'}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_allergens_and_restrictions(request):
    user = request.user  # TokenAuthentication will populate the user
    if not user.is_authenticated:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    allergens = request.data.get('allergens', [])
    restrictions = request.data.get('restrictions', [])

    if not isinstance(allergens, list) or not isinstance(restrictions, list):
        return Response(
            {'error': 'Allergens and restrictions should be lists of strings'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Update user's allergens and dietary restrictions
    allergen_obj, created = allergen.objects.get_or_create(user=user)
    allergen_obj.allergens = allergens
    allergen_obj.save()

    dietary_obj, created = dietaryrestriction.objects.get_or_create(user=user)
    dietary_obj.restrictions = restrictions
    dietary_obj.save()

    return Response({'message': 'Preferences updated successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_meal_combinations(request):
    user = request.user
    date_range = request.GET.get('date_range', 7)  # Default to next 7 days
    today = datetime.date.today()

    combinations = UserMealCombination.objects.filter(
        user=user,
        date__range=(today, today + datetime.timedelta(days=int(date_range)))
    ).select_related('menu').prefetch_related('food_items')

    data = []
    for combination in combinations:
        data.append({
            'id': combination.id, 
            'date': combination.date,
            'meal_type': combination.meal_type,
            'menu': combination.menu.id,
            'food_items': [
                {
                    'name': food.dish_name,
                    'calories': food.calories,
                    'protein': food.protein,
                    'carbs': food.total_carb,
                }
                for food in combination.food_items.all()
            ]
        })

    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_user_meal_combinations(request):
    user = request.user
    combinations = request.data.get('combinations', [])

    if not isinstance(combinations, list):
        return Response({'error': 'Invalid data format'}, status=status.HTTP_400_BAD_REQUEST)

    for combo in combinations:
        menu_id = combo.get('menu')
        meal_type = combo.get('meal_type')
        date = combo.get('date')
        food_ids = combo.get('food_items', [])

        try:
            menu = Menu.objects.get(id=menu_id)
            user_combination, created = UserMealCombination.objects.get_or_create(
                user=user,
                menu=menu,
                meal_type=meal_type,
                date=date
            )
            user_combination.food_items.set(Food.objects.filter(id__in=food_ids))
            user_combination.save()
        except Menu.DoesNotExist:
            return Response({'error': f'Menu with ID {menu_id} not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'message': 'Meal combinations saved successfully'}, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import UserMealCombination

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_meal_combination(request, combination_id):
    try:
        # Fetch the combination by ID and ensure it belongs to the authenticated user
        combination = UserMealCombination.objects.get(id=combination_id, user=request.user)
        combination.delete()
        return Response({'message': 'Meal combination deleted successfully.'}, status=status.HTTP_200_OK)
    except UserMealCombination.DoesNotExist:
        return Response({'error': 'Meal combination not found or does not belong to you.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        "name": user.first_name,
        "email": user.username,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_preferences(request):
    """Fetch both allergens and dietary restrictions in a single API call."""
    try:
        try:
            user_allergens = allergen.objects.get(user=request.user).allergens
        except allergen.DoesNotExist:
            user_allergens = []

        try:
            user_dietary_restrictions = dietaryrestriction.objects.get(user=request.user).restrictions
        except dietaryrestriction.DoesNotExist:
            user_dietary_restrictions = []

        return Response({
            "allergens": user_allergens,
            "dietary_restrictions": user_dietary_restrictions,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
