from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import TradingStrategy, Exchange, Trade, MarketData
from .serializers import (
    UserSerializer, TradingStrategySerializer, 
    ExchangeSerializer, TradeSerializer, MarketDataSerializer
)
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class TradingStrategyViewSet(viewsets.ModelViewSet):
    serializer_class = TradingStrategySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return TradingStrategy.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExchangeViewSet(viewsets.ModelViewSet):
    serializer_class = ExchangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Exchange.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TradeViewSet(viewsets.ModelViewSet):
    serializer_class = TradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Trade.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MarketDataViewSet(viewsets.ModelViewSet):
    serializer_class = MarketDataSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        exchange_id = self.request.query_params.get('exchange')
        symbol = self.request.query_params.get('symbol')
        data_type = self.request.query_params.get('data_type')
        
        queryset = MarketData.objects.all()
        
        if exchange_id:
            queryset = queryset.filter(exchange_id=exchange_id)
        if symbol:
            queryset = queryset.filter(symbol=symbol)
        if data_type:
            queryset = queryset.filter(data_type=data_type)
            
        return queryset.order_by('-timestamp')[:100]

class SimulatedMarketDataAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        symbol = request.query_params.get('symbol', 'BTC/USDT')
        data_type = request.query_params.get('data_type', 'TICKER')
        
        if data_type == 'TICKER':
            # Generate simulated ticker data
            base_price = 50000.0  # Base price for BTC/USDT
            if symbol == 'ETH/USDT':
                base_price = 3000.0
            elif symbol == 'SOL/USDT':
                base_price = 100.0
                
            # Add some randomness to the price
            price_change = base_price * (random.uniform(-0.005, 0.005))
            current_price = base_price + price_change
            
            data = {
                'symbol': symbol,
                'price': round(current_price, 2),
                'volume': round(random.uniform(100, 1000), 2),
                'high': round(current_price * 1.01, 2),
                'low': round(current_price * 0.99, 2),
                'timestamp': datetime.now().isoformat()
            }
            
            return Response(data)
            
        elif data_type == 'ORDERBOOK':
            # Generate simulated order book
            base_price = 50000.0
            if symbol == 'ETH/USDT':
                base_price = 3000.0
            elif symbol == 'SOL/USDT':
                base_price = 100.0
                
            bids = []
            asks = []
            
            # Generate 10 bid levels
            for i in range(10):
                price = base_price * (1 - 0.001 * (i + 1))
                size = random.uniform(0.1, 2.0)
                bids.append([round(price, 2), round(size, 4)])
                
            # Generate 10 ask levels
            for i in range(10):
                price = base_price * (1 + 0.001 * (i + 1))
                size = random.uniform(0.1, 2.0)
                asks.append([round(price, 2), round(size, 4)])
                
            data = {
                'symbol': symbol,
                'bids': bids,
                'asks': asks,
                'timestamp': datetime.now().isoformat()
            }
            
            return Response(data)
            
        elif data_type == 'CANDLE':
            # Generate simulated candle data
            timeframe = request.query_params.get('timeframe', '1h')
            limit = int(request.query_params.get('limit', 24))
            
            base_price = 50000.0
            if symbol == 'ETH/USDT':
                base_price = 3000.0
            elif symbol == 'SOL/USDT':
                base_price = 100.0
                
            candles = []
            current_time = datetime.now()
            
            for i in range(limit):
                if timeframe == '1h':
                    candle_time = current_time - timedelta(hours=i)
                elif timeframe == '1d':
                    candle_time = current_time - timedelta(days=i)
                else:
                    candle_time = current_time - timedelta(minutes=i)
                    
                # Generate OHLC data with some randomness
                price_change = base_price * random.uniform(-0.02, 0.02)
                open_price = base_price + price_change
                high_price = open_price * (1 + random.uniform(0, 0.01))
                low_price = open_price * (1 - random.uniform(0, 0.01))
                close_price = open_price * (1 + random.uniform(-0.005, 0.005))
                volume = random.uniform(10, 100)
                
                candle = {
                    'timestamp': candle_time.isoformat(),
                    'open': round(open_price, 2),
                    'high': round(high_price, 2),
                    'low': round(low_price, 2),
                    'close': round(close_price, 2),
                    'volume': round(volume, 2)
                }
                
                candles.append(candle)
                
            return Response(candles)
            
        return Response({'error': 'Invalid data type'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def execute_trade(request):
    """
    Execute a trade based on the provided parameters
    """
    try:
        data = request.data
        symbol = data.get('symbol')
        trade_type = data.get('trade_type')
        quantity = float(data.get('quantity'))
        exchange_id = data.get('exchange_id')
        strategy_id = data.get('strategy_id', None)
        
        if not all([symbol, trade_type, quantity, exchange_id]):
            return Response(
                {'error': 'Missing required parameters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get the current market price (simulated)
        base_price = 50000.0  # Base price for BTC/USDT
        if symbol == 'ETH/USDT':
            base_price = 3000.0
        elif symbol == 'SOL/USDT':
            base_price = 100.0
            
        # Add some randomness to the price
        price_change = base_price * (random.uniform(-0.005, 0.005))
        current_price = base_price + price_change
        
        # Create a new trade
        trade_data = {
            'user': request.user.id,
            'symbol': symbol,
            'trade_type': trade_type,
            'quantity': quantity,
            'price': current_price,
            'exchange': exchange_id,
            'status': 'EXECUTED',
            'executed_at': datetime.now(),
            'order_id': f"sim-{random.randint(10000, 99999)}"
        }
        
        if strategy_id:
            trade_data['strategy'] = strategy_id
            
        serializer = TradeSerializer(data=trade_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_portfolio(request):
    """
    Get the user's portfolio summary
    """
    try:
        # Get all executed trades for the user
        trades = Trade.objects.filter(
            user=request.user,
            status='EXECUTED'
        )
        
        # Calculate portfolio value
        portfolio = {}
        
        for trade in trades:
            symbol = trade.symbol
            quantity = float(trade.quantity)
            
            if trade.trade_type == 'BUY':
                if symbol not in portfolio:
                    portfolio[symbol] = 0
                portfolio[symbol] += quantity
            else:  # SELL
                if symbol not in portfolio:
                    portfolio[symbol] = 0
                portfolio[symbol] -= quantity
        
        # Calculate current value
        portfolio_value = 0
        portfolio_items = []
        
        for symbol, quantity in portfolio.items():
            # Get current price (simulated)
            base_price = 50000.0  # Base price for BTC/USDT
            if symbol == 'ETH/USDT':
                base_price = 3000.0
            elif symbol == 'SOL/USDT':
                base_price = 100.0
                
            # Add some randomness to the price
            price_change = base_price * (random.uniform(-0.005, 0.005))
            current_price = base_price + price_change
            
            value = quantity * current_price
            portfolio_value += value
            
            portfolio_items.append({
                'symbol': symbol,
                'quantity': quantity,
                'price': current_price,
                'value': value
            })
            
        return Response({
            'total_value': portfolio_value,
            'items': portfolio_items
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
