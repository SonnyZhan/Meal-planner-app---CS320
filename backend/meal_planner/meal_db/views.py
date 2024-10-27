
from itertools import combinations
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Food, Menu, DiningHall, MealCombination
from .serializers import FoodSerializer, MenuSerializer, DiningHallSerializer, MealCombinationSerializer

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



@api_view(['POST'])
def satisfies_macros(foods, required_calories, required_proteins, required_fats, required_carbs):
    """
    Helper function to check if a combination of foods meets the required macronutrients.
    """
    total_calories = sum(food.calories for food in foods)
    total_proteins = sum(food.proteins for food in foods)
    total_fats = sum(food.fats for food in foods)
    total_carbs = sum(food.carbs for food in foods)

    return (
        total_calories >= required_calories and
        total_proteins >= required_proteins and
        total_fats >= required_fats and
        total_carbs >= required_carbs
    )

@api_view(['POST'])
def search_food_combinations(request):
    try:
        required_calories = float(request.data.get('calories'))
        required_proteins = float(request.data.get('proteins'))
        required_fats = float(request.data.get('fats'))
        required_carbs = float(request.data.get('carbs'))
        menu_id = request.data.get('menu_id')
    except (TypeError, ValueError):
        return Response({"error": "Invalid or missing nutritional requirements or menu_id."},
                        status=status.HTTP_400_BAD_REQUEST)

    if not all([required_calories, required_proteins, required_fats, required_carbs, menu_id]):
        return Response({"error": "All fields (menu_id, calories, proteins, fats, carbs) are required."},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        menu = Menu.objects.get(id=menu_id)
    except Menu.DoesNotExist:
        return Response({"error": "Menu not found."}, status=status.HTTP_404_NOT_FOUND)

    foods_from_menu = menu.foods.all()
    satisfying_combinations = []

    for r in range(1, len(foods_from_menu) + 1):
        for food_combination in combinations(foods_from_menu, r):
            if satisfies_macros(food_combination, required_calories, required_proteins, required_fats, required_carbs):
                total_calories = sum(food.calories for food in food_combination)
                total_proteins = sum(food.proteins for food in food_combination)
                total_fats = sum(food.fats for food in food_combination)
                total_carbs = sum(food.carbs for food in food_combination)

                meal_combination = MealCombination.objects.create(
                    menu=menu,
                    calories=total_calories,
                    proteins=total_proteins,
                    fats=total_fats,
                    carbs=total_carbs
                )
                meal_combination.foods.set(food_combination)
                satisfying_combinations.append(meal_combination)

    if not satisfying_combinations:
        return Response({"message": "No combination of foods in the selected menu satisfies the given requirements."},
                        status=status.HTTP_404_NOT_FOUND)

    serializer = MealCombinationSerializer(satisfying_combinations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_meal_combinations(request):
    combinations = MealCombination.objects.all()
    serializer = MealCombinationSerializer(combinations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)