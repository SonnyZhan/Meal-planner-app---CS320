


# Create your views here.
from itertools import combinations
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Food
from .serializers import FoodSerializer

# Helper function to check if a combination of foods satisfies the user's macronutrient requirements
def satisfies_macros(foods, required_calories, required_proteins, required_fats, required_carbs):
    total_calories = sum([food.calories for food in foods])
    total_proteins = sum([food.proteins for food in foods])
    total_fats = sum([food.fats for food in foods])
    total_carbs = sum([food.carbs for food in foods])

    return (total_calories >= required_calories and
            total_proteins >= required_proteins and
            total_fats >= required_fats and
            total_carbs >= required_carbs)

# View to handle finding a combination of foods that satisfy macronutrient requirements
@api_view(['POST'])
def search_food_combinations(request):
    # Get the required macronutrients from the request
    required_calories = request.data.get('calories')
    required_proteins = request.data.get('proteins')
    required_fats = request.data.get('fats')
    required_carbs = request.data.get('carbs')

    # Ensure all required macros are provided
    if not (required_calories and required_proteins and required_fats and required_carbs):
        return Response({"error": "All macro fields (calories, proteins, fats, carbs) are required."},
                        status=status.HTTP_400_BAD_REQUEST)

    # Retrieve all available food items from the database
    all_foods = Food.objects.all()

    # Start looking for combinations of foods
    for r in range(1, len(all_foods) + 1):  # r is the number of food items in each combination
        for food_combination in combinations(all_foods, r):
            if satisfies_macros(food_combination, required_calories, required_proteins, required_fats, required_carbs):
                # If the combination satisfies the macros, serialize the combination and return
                serializer = FoodSerializer(food_combination, many=True)
                return Response(serializer.data)

    # If no combination found
    return Response({"message": "No combination of foods satisfies the given requirements."},
                    status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})
