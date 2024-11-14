from django.core.management.base import BaseCommand
from meal_db.models import DiningHall
import requests
import datetime

class Command(BaseCommand):
    help = 'Fetch and save dining hall locations from the UMass Dining API'

    def handle(self, *args, **options):
        self.stdout.write("Fetching dining hall locations...")

        # Fetch the locations data
        locations = self.get_locations()

        if not locations:
            self.stdout.write(self.style.WARNING("No locations data found"))
            return

        # Process and save the locations data
        self.save_locations_data(locations)
        self.stdout.write(self.style.SUCCESS("Dining hall locations saved successfully"))

    def get_locations(self):
        try:
            response = requests.get('https://www.umassdining.com/uapp/get_infov2')
            response.raise_for_status()
            locations = response.json()
            return locations
        except requests.RequestException as e:
            self.stderr.write(f"Error fetching locations data: {str(e)}")
            return []

    def save_locations_data(self, locations):
        for location in locations:
            # Handle "Closed" hours gracefully
            if location['opening_hours'] == 'Closed' or location['closing_hours'] == 'Closed':
                opening_hours = None
                closing_hours = None
            else:
                try:
                    opening_hours = datetime.datetime.strptime(location['opening_hours'], '%I:%M %p').time()
                    closing_hours = datetime.datetime.strptime(location['closing_hours'], '%I:%M %p').time()
                except ValueError:
                    self.stderr.write(f"Invalid time format for location {location['location_title']}")
                    opening_hours = None
                    closing_hours = None

            # Save or update the DiningHall record
            DiningHall.objects.update_or_create(
                location_id=location['location_id'],
                defaults={
                    'name': location['location_title'],
                    'opening_hours': opening_hours,
                    'closing_hours': closing_hours,
                }
            )
