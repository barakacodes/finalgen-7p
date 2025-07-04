#!/bin/bash
# Start the Django backend server in the background
cd /app/backend
python manage.py migrate
python manage.py runserver 0.0.0.0:12001 &

# Start the Next.js frontend
cd /app
export PORT=12000
npm start -- -p 12000 -H 0.0.0.0