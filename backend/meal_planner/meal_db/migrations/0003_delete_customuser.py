# Generated by Django 5.1.2 on 2024-12-05 17:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("meal_db", "0002_customuser_delete_user"),
    ]

    operations = [
        migrations.DeleteModel(
            name="CustomUser",
        ),
    ]