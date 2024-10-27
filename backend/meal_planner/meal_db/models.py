from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class User(models.Model):
    userID = models.IntegerField()
    plannerID = models.IntegerField()

class DiningHall(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name


class Food(models.Model):
    name = models.CharField(max_length=100)
    calories = models.FloatField(validators=[MinValueValidator(0)])
    proteins = models.FloatField(validators=[MinValueValidator(0)])
    fats = models.FloatField(validators=[MinValueValidator(0)])
    carbs = models.FloatField(validators=[MinValueValidator(0)])

    def __str__(self):
        return self.name

class Menu(models.Model):
   # Enum for time slots
    BREAKFAST = 'breakfast'
    LUNCH = 'lunch'
    BRUNCH = 'brunch'
    DINNER = 'dinner'
    LATE_NIGHT = 'late night'

    TIME_SLOTS = [
        (BREAKFAST, 'Breakfast'),
        (LUNCH, 'Lunch'),
        (BRUNCH, 'Brunch'),
        (DINNER, 'Dinner'),
        (LATE_NIGHT, 'Late Night'),
    ]

    # Enum for days of the week
    MONDAY = 'monday'
    TUESDAY = 'tuesday'
    WEDNESDAY = 'wednesday'
    THURSDAY = 'thursday'
    FRIDAY = 'friday'
    SATURDAY = 'saturday'
    SUNDAY = 'sunday'

    DAYS_OF_WEEK = [
        (MONDAY, 'Monday'),
        (TUESDAY, 'Tuesday'),
        (WEDNESDAY, 'Wednesday'),
        (THURSDAY, 'Thursday'),
        (FRIDAY, 'Friday'),
        (SATURDAY, 'Saturday'),
        (SUNDAY, 'Sunday'),
    ]

    dining_hall = models.ForeignKey(DiningHall, related_name='menus', on_delete=models.CASCADE)
    time_slot = models.CharField(max_length=10, choices=TIME_SLOTS)
    day_of_week = models.CharField(max_length=9, choices=DAYS_OF_WEEK, null=True, blank=True)
    date = models.DateField(null=True, blank=True)  # Specific date for the menu
    foods = models.ManyToManyField(Food, related_name='menus')  # Many-to-many relationship with foods
    description = models.TextField(null=True, blank=True)  # Optional description
    is_special = models.BooleanField(default=False)  # Flag for special menus

    class Meta:
        unique_together = ['dining_hall', 'time_slot', 'date', 'day_of_week']

    def __str__(self):
        return f"{self.dining_hall.name} - {self.get_time_slot_display()} ({self.date or self.get_day_of_week_display()})"

class MealCombination(models.Model):
    menu = models.ForeignKey('Menu', related_name='meal_combinations', on_delete=models.CASCADE)
    foods = models.ManyToManyField('Food', related_name='meal_combinations')
    calories = models.FloatField()
    proteins = models.FloatField()
    fats = models.FloatField()
    carbs = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Combination for {self.menu} with {self.foods.count()} items"