from django.core.management.base import BaseCommand
from meal_db.models import DiningHall, Menu, Food
from meal_db.dining_utils import category_html_to_dict
import requests
import datetime
import urllib.parse
import json

class Command(BaseCommand):
    help = 'Fetch and save menu data from the UMass Dining API for all dining halls (IDs 1-4) for the next 7 days'

    def handle(self, *args, **options):
        dining_hall_ids = [1, 2, 3, 4]
        today = datetime.date.today()
        next_week_dates = [today + datetime.timedelta(days=i) for i in range(7)]

        self.stdout.write("Starting menu update for the next 7 days for dining halls 1-4.")

        # Delete old menu data
        self.delete_old_menus()

        # Fetch and save menu data for each dining hall and date
        for location_id in dining_hall_ids:
            for date in next_week_dates:
                self.stdout.write(f"Fetching menu for location ID {location_id} on {date.strftime('%m/%d/%Y')}")
                menu_data = self.get_menu(location_id, date)

                if not menu_data:
                    self.stdout.write(self.style.WARNING(f"No menu data found for location {location_id} on {date.strftime('%m/%d/%Y')}"))
                    continue

                # Process and save the combined menu data
                self.save_combined_menu_data(location_id, date, menu_data)
                self.stdout.write(self.style.SUCCESS(f"Menu data saved for location {location_id} on {date.strftime('%m/%d/%Y')}"))

        self.stdout.write("Menu update completed.")

    def get_menu(self, location_id, date):
        query_params = {'tid': location_id, 'date': date.strftime('%m/%d/%Y')}
        request_url = 'https://umassdining.com/foodpro-menu-ajax?' + urllib.parse.urlencode(query_params)

        try:
            response = requests.get(request_url)
            response.raise_for_status()
            menu_data = response.json()
            return menu_data
        except (requests.RequestException, json.JSONDecodeError) as e:
            self.stderr.write(str(e))
            return None

    def delete_old_menus(self):
        """Delete all existing menu data."""
        self.stdout.write("Deleting old menu data...")
        deleted_count, _ = Menu.objects.all().delete()
        Food.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f"Deleted {deleted_count} old menu entries."))

    def save_combined_menu_data(self, location_id, date, menu_data):
        try:
            dining_hall = DiningHall.objects.get(location_id=location_id)
        except DiningHall.DoesNotExist:
            self.stderr.write(f"No dining hall found with ID {location_id}")
            return

        # Iterate through each meal (e.g., Breakfast, Lunch)
        for meal_name, categories in menu_data.items():
            # Create or get a Menu object for the entire meal (ignoring categories)
            menu, _ = Menu.objects.get_or_create(
                dining_hall=dining_hall,
                meal_name=meal_name,
                category_name="Combined Items",
                menu_date=date,
            )

            # Combine all items across all categories
            combined_items = []
            for category_name, items in categories.items():
                # Convert and extend the combined list with items from each category
                food_items = category_html_to_dict(items, meal_name, category_name)
                combined_items.extend(food_items)

            # Save all combined items to the database
            for item in combined_items:
                self.save_food_item(menu, item)

    def save_food_item(self, menu, item):
        Food.objects.update_or_create(
            menu=menu,
            dish_name=item.get('dish-name'),
            defaults={
                'healthfulness': int(item.get('healthfulness', 0)),
                'carbon_list': item.get('carbon-list', ''),
                'ingredient_list': item.get('ingredient-list', []),
                'allergens': item.get('allergens', []),
                'recipe_webcode': item.get('recipe-webcode', ''),
                'diets': item.get('diets', []),
                'serving_size': item.get('serving-size', ''),
                'calories': item.get('calories', 0),
                'calories_from_fat': item.get('calories-from-fat', 0),
                'total_fat': item.get('total-fat', '0 gram'),
                'sat_fat': item.get('sat-fat', '0 gram'),
                'trans_fat': item.get('trans-fat', '0 gram'),
                'cholesterol': item.get('cholesterol', '0 milligram'),
                'sodium': item.get('sodium', '0 milligram'),
                'total_carb': item.get('total-carb', '0 gram'),
                'dietary_fiber': item.get('dietary-fiber', '0 gram'),
                'sugars': item.get('sugars', '0 gram'),
                'protein': item.get('protein', '0 gram'),
            }
        )
