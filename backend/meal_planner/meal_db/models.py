from django.db import models

# Create your models here.

class User(models.Model):
    userID = models.IntegerField()
    plannerID = models.IntegerField()

class DiningHall(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Menu(models.Model):
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

    dining_hall = models.ForeignKey(DiningHall, related_name='menus', on_delete=models.CASCADE)
    time_slot = models.CharField(
        max_length=10,
        choices=TIME_SLOTS,
    )
    def __str__(self):
        return f"{self.dining_hall.name} - {self.time_slot}"

class Food(models.Model):
    menu = models.ForeignKey(Menu, related_name='foods', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    calories = models.IntegerField()
    carbs = models.FloatField()
    proteins = models.FloatField()
    fats = models.FloatField()
    calcium = models.FloatField()
    def __str__(self):
        return self.name



