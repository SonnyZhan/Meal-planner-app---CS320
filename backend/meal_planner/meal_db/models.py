from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    # Use email as the username for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Include 'username' as a required field for migration

    # Customize related_name to avoid clashes with Django's default User model
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='meal_db_users',  # Custom related name to avoid clash
        blank=True,
        help_text='The groups this user belongs to.',
        related_query_name='meal_db_user',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='meal_db_users',  # Custom related name to avoid clash
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='meal_db_user',
    )

    def __str__(self):
        return self.email  # Return email when displaying user instances


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=1000)
    bio = models.CharField(max_length=100)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Profile of {self.user.username}"


# Signal to create a profile when a user is created
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


# Signal to save the profile whenever the user is saved
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


# Connect the signals
post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)


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
    menu_date = models.DateField()

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


class MealPlanner(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_planner')
    dining_hall = models.ForeignKey(DiningHall, on_delete=models.CASCADE, null=True, blank=True)
    meal_time = models.CharField(max_length=50, choices=[
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner'),
    ])
    date = models.DateField()
    foods = models.ManyToManyField(Food)

    class Meta:
        unique_together = ('user', 'meal_time', 'date')

    def __str__(self):
        return f"{self.user} - {self.meal_time} on {self.date}"
