#!/bin/bash
export PORT=12001
python manage.py migrate
daphne -b 0.0.0.0 -p 12001 trading_backend.asgi:application