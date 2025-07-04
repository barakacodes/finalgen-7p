# Trading Bot Application

A full-stack trading bot application with a Next.js frontend and Django backend.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/barakamapundah-3777s-projects/v0-trading-bot-enhancements)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/39vtidM30mh)

## Architecture

- **Frontend**: Next.js with React, deployed on port 12000
- **Backend**: Django with REST API and WebSocket support, deployed on port 12001

## Features

- Real-time market data visualization
- Trading strategy management
- Portfolio tracking
- Exchange integration
- WebSocket-based real-time updates
- Simulated trading environment

## Frontend

The frontend is built with Next.js and includes:

- Dashboard for market overview
- Trading interface
- Portfolio management
- Strategy builder
- Exchange connector
- Real-time market data feed

## Backend

The backend is built with Django and includes:

- REST API for trading operations
- WebSocket support for real-time data
- User authentication
- Trading strategy models
- Exchange integration
- Market data processing

## API Endpoints

- `/api/strategies/` - Trading strategies management
- `/api/exchanges/` - Exchange connections management
- `/api/trades/` - Trade history and execution
- `/api/market-data/` - Market data access
- `/api/market/simulated/` - Simulated market data
- `/api/trade/execute/` - Execute trades
- `/api/portfolio/` - Portfolio summary

## WebSocket

- WebSocket endpoint: `ws://localhost:12001/ws/trading/{room_name}/`
- Supports real-time market data updates
- Enables trade execution notifications

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Django 5.2+

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   cd /workspace/finalgen-7p
   npm install --legacy-peer-deps
   ```

3. Install backend dependencies:
   ```
   cd /workspace/finalgen-7p/backend
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

### Running the Application

1. Start the frontend:
   ```
   cd /workspace/finalgen-7p
   npm run dev -- -p 12000 -H 0.0.0.0
   ```

2. Start the backend:
   ```
   cd /workspace/finalgen-7p/backend
   ./start_backend.sh
   ```

## Testing

- Frontend: Access at https://work-1-wotnfeandwedtvkw.prod-runtime.all-hands.dev
- Backend API: Access at https://work-2-wotnfeandwedtvkw.prod-runtime.all-hands.dev/api/
- Admin interface: Access at https://work-2-wotnfeandwedtvkw.prod-runtime.all-hands.dev/admin/
  - Username: admin
  - Password: admin123

## License

This project is licensed under the MIT License.
