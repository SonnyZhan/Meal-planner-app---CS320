from django.db import models
from django.contrib.auth.models import User

class DiningHall(models.Model):
    location_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=200)
    opening_hours = models.TimeField(null=True, blank=True)
    closing_hours = models.TimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class Menu(models.Model):
    dining_hall = models.ForeignKey(DiningHall, on_delete=models.CASCADE)
    meal_name = models.CharField(max_length=100)
    category_name = models.CharField(max_length=100)
    menu_date = models.DateField()  # New field added for the date of the menu

    class Meta:
        unique_together = ('dining_hall', 'meal_name', 'menu_date')

    def __str__(self):
        return f"{self.meal_name} - {self.menu_date}"



class Food(models.Model):
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    dish_name = models.CharField(max_length=200)
    healthfulness = models.IntegerField(null=True, blank=True)
    carbon_list = models.CharField(max_length=10, null=True, blank=True)
    ingredient_list = models.JSONField(default=list)
    allergens = models.JSONField(default=list)
    recipe_webcode = models.CharField(max_length=100, null=True, blank=True)
    diets = models.JSONField(default=list)
    serving_size = models.CharField(max_length=50, null=True, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    calories_from_fat = models.IntegerField(null=True, blank=True)
    total_fat = models.CharField(max_length=50, null=True, blank=True)
    sat_fat = models.CharField(max_length=50, null=True, blank=True)
    trans_fat = models.CharField(max_length=50, null=True, blank=True)
    cholesterol = models.CharField(max_length=50, null=True, blank=True)
    sodium = models.CharField(max_length=50, null=True, blank=True)
    total_carb = models.CharField(max_length=50, null=True, blank=True)
    dietary_fiber = models.CharField(max_length=50, null=True, blank=True)
    sugars = models.CharField(max_length=50, null=True, blank=True)
    protein = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.dish_name

class allergen(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    allergens = models.JSONField(default=list)

    def __str__(self):
        return f"Allergens for {self.user.username}"
    
class dietaryrestriction(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    restrictions = models.JSONField(default=list) 

    def __str__(self):
        return f"Dietary Restrictions for {self.user.username}"
