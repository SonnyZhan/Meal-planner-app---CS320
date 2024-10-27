
from itertools import combinations
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Food, Menu
from .serializers import FoodSerializer

# Helper function to check if a combination of foods satisfies the nutritional requirements
def satisfies_macros(foods, required_calories, required_proteins, required_fats, required_carbs):
    total_calories = sum([food.calories for food in foods])
    total_proteins = sum([food.proteins for food in foods])
    total_fats = sum([food.fats for food in foods])
    total_carbs = sum([food.carbs for food in foods])

    return (total_calories >= required_calories and
            total_proteins >= required_proteins and
            total_fats >= required_fats and
            total_carbs >= required_carbs)

@api_view(['POST'])
def search_food_combinations(request):
    # Get the required macronutrients and the menu ID from the request
    required_calories = request.data.get('calories')
    required_proteins = request.data.get('proteins')
    required_fats = request.data.get('fats')
    required_carbs = request.data.get('carbs')
    menu_id = request.data.get('menu_id')  # Get menu ID from the request

    # Ensure all required fields are provided
    if not (required_calories and required_proteins and required_fats and required_carbs and menu_id):
        return Response({"error": "All fields (menu_id, calories, proteins, fats, carbs) are required."},
                        status=status.HTTP_400_BAD_REQUEST)

    # Get the menu object, return error if it doesn't exist
    try:
        menu = Menu.objects.get(id=menu_id)
    except Menu.DoesNotExist:
        return Response({"error": "Menu not found."}, status=status.HTTP_404_NOT_FOUND)

    # Retrieve foods only from the specified menu
    foods_from_menu = Food.objects.filter(menu=menu)

    # Start looking for combinations of foods within the menu
    for r in range(1, len(foods_from_menu) + 1):  # r is the number of food items in each combination
        for food_combination in combinations(foods_from_menu, r):
            if satisfies_macros(food_combination, required_calories, required_proteins, required_fats, required_carbs):
                # If the combination satisfies the macros, serialize the combination and return
                serializer = FoodSerializer(food_combination, many=True)
                return Response(serializer.data)

    # If no combination is found
    return Response({"message": "No combination of foods in the selected menu satisfies the given requirements."},
                    status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})
