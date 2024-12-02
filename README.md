# Meal-planner-app---CS320
Our Meal Planner app uses Django, React, and Postgres to create a meal planner that accesses the UMASS Amherst Menus Database and saves a week's worth of menus to
our database. Using that data, inputs for calories, proteins, and fats, and a selection of allergens our algorithm filters out at most 5 meals with 3 foods each
that most closely satisfy the inputs (foods with allergens will never show).

# REMINDERS: 
We are not nutritionists, before making any dietary decision please contact a professional.
Make sure to double-check any allergens and talk to the Umass Staff in case of any questions.
Special thanks to https://github.com/simon-andrews/umass-toolkit for providing the API endpoints to access UMASS Dining Hall and Food information.

# Getting Started
- Clone the Repository
- Install all npm packages in the frontend
- Install all the pips in requirements.txt
- In backend -> meal planner -> meal planner -> settings.py, Change:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'dbname', 
        'USER': 'your_user_name',
        'PASSWORD': 'your_password',
        'HOST': '127.0.0.1', 
        'PORT': '5432',
    }

}
- Run python manage.py makemigrations
- Run python manage.py get_locations
- Run python manage.py get_menus
- In the backend run python manage.py runserver
- In the frontend run npm start
- To update the database run python manage.py get_menus.

Special Thanks to https://github.com/simon-andrews/umass-toolkit for finding the API endpoints this project scrapes.





