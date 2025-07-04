import json
import asyncio
import random
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from datetime import datetime
from django.contrib.auth.models import User
from .models import TradingStrategy, Exchange, Trade, MarketData
from .trading_engine import trading_engine

class TradingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'trading_{self.room_name}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # If authenticated, also join user-specific group
        if self.scope['user'].is_authenticated:
            self.user_group_name = f'trading_user_{self.scope["user"].id}'
            await self.channel_layer.group_add(
                self.user_group_name,
                self.channel_name
            )
        
        await self.accept()
        
        # Start sending market data
        self.market_data_task = asyncio.create_task(self.send_market_data())
    
    async def disconnect(self, close_code):
        # Cancel the market data task
        if hasattr(self, 'market_data_task'):
            self.market_data_task.cancel()
            
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # If authenticated, also leave user-specific group
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type', '')
        
        if message_type == 'subscribe':
            symbol = text_data_json.get('symbol', 'BTC/USDT')
            self.symbol = symbol  # Store the subscribed symbol
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'subscription_message',
                    'message': f'Subscribed to {symbol}'
                }
            )
        elif message_type == 'trade':
            # Process trade request
            if self.scope['user'].is_authenticated:
                trade_data = text_data_json.get('trade', {})
                trade_data['user_id'] = self.scope['user'].id
                
                # Execute trade
                trade_result = await self.execute_trade(trade_data)
                
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'trade_message',
                        'trade': trade_result
                    }
                )
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Authentication required for trading'
                }))
        elif message_type == 'run_strategy':
            # Run a specific strategy
            if self.scope['user'].is_authenticated:
                strategy_id = text_data_json.get('strategy_id')
                
                if strategy_id:
                    # Execute strategy
                    signals = await self.run_strategy(strategy_id)
                    
                    await self.send(text_data=json.dumps({
                        'type': 'strategy_result',
                        'signals': signals
                    }))
                else:
                    await self.send(text_data=json.dumps({
                        'type': 'error',
                        'message': 'Strategy ID is required'
                    }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Authentication required for running strategies'
                }))
        elif message_type == 'backtest':
            # Run backtest for a strategy
            if self.scope['user'].is_authenticated:
                backtest_data = text_data_json.get('backtest', {})
                strategy_id = backtest_data.get('strategy_id')
                
                if strategy_id:
                    # Run backtest
                    result = await self.run_backtest(backtest_data)
                    
                    await self.send(text_data=json.dumps({
                        'type': 'backtest_result',
                        'result': result
                    }))
                else:
                    await self.send(text_data=json.dumps({
                        'type': 'error',
                        'message': 'Strategy ID is required for backtesting'
                    }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Authentication required for backtesting'
                }))
    
    @database_sync_to_async
    def execute_trade(self, trade_data):
        """Execute a trade and return the result"""
        try:
            # Get user
            user = User.objects.get(id=trade_data['user_id'])
            
            # Get exchange
            exchange_id = trade_data.get('exchange_id')
            if not exchange_id:
                # Use the first active exchange for the user
                exchange = Exchange.objects.filter(user=user, is_active=True).first()
                if not exchange:
                    return {
                        'error': 'No active exchange found for user',
                        'status': 'failed'
                    }
            else:
                exchange = Exchange.objects.get(id=exchange_id, user=user)
            
            # Create trade
            symbol = trade_data.get('symbol', 'BTC/USDT')
            trade_type = trade_data.get('trade_type', 'BUY')
            quantity = float(trade_data.get('quantity', 0.01))
            
            # Get current price (simulated)
            base_price = 50000.0  # Base price for BTC/USDT
            if symbol == 'ETH/USDT':
                base_price = 3000.0
            elif symbol == 'SOL/USDT':
                base_price = 100.0
                
            # Add some randomness to the price
            price_change = base_price * (random.uniform(-0.005, 0.005))
            current_price = base_price + price_change
            
            # Create trade record
            trade = Trade(
                user=user,
                exchange=exchange,
                symbol=symbol,
                trade_type=trade_type,
                quantity=quantity,
                price=current_price,
                status='EXECUTED',
                executed_at=datetime.now(),
                order_id=f"ws-{random.randint(10000, 99999)}"
            )
            
            # Add strategy if provided
            strategy_id = trade_data.get('strategy_id')
            if strategy_id:
                strategy = TradingStrategy.objects.get(id=strategy_id, user=user)
                trade.strategy = strategy
            
            trade.save()
            
            return {
                'id': str(trade.id),
                'symbol': trade.symbol,
                'trade_type': trade.trade_type,
                'quantity': float(trade.quantity),
                'price': float(trade.price),
                'status': trade.status,
                'executed_at': trade.executed_at.isoformat() if trade.executed_at else None,
                'order_id': trade.order_id
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'status': 'failed'
            }
    
    @database_sync_to_async
    def run_strategy(self, strategy_id):
        """Run a specific strategy and return the signals"""
        try:
            # Get strategy
            strategy = TradingStrategy.objects.get(id=strategy_id)
            
            # Get user's exchanges
            exchanges = Exchange.objects.filter(user=strategy.user, is_active=True)
            
            signals = []
            for exchange in exchanges:
                # For now, we'll use a fixed set of symbols
                symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
                
                for symbol in symbols:
                    # Get strategy executor
                    from .strategies import get_strategy_executor
                    executor = get_strategy_executor(strategy, exchange, symbol)
                    
                    # Execute strategy
                    signal = executor.execute()
                    
                    if signal:
                        # Add user to signal
                        signal['user_id'] = strategy.user.id
                        signals.append(signal)
                        
                        # Process the signal
                        trading_engine._process_signal(signal)
            
            return signals
            
        except Exception as e:
            return [{'error': str(e)}]
    
    @database_sync_to_async
    def run_backtest(self, backtest_data):
        """Run a backtest for a strategy"""
        try:
            # Get strategy
            strategy_id = backtest_data.get('strategy_id')
            strategy = TradingStrategy.objects.get(id=strategy_id)
            
            # Get exchange
            exchange_id = backtest_data.get('exchange_id')
            if not exchange_id:
                # Use the first active exchange for the user
                exchange = Exchange.objects.filter(user=strategy.user, is_active=True).first()
                if not exchange:
                    return {
                        'error': 'No active exchange found for user'
                    }
            else:
                exchange = Exchange.objects.get(id=exchange_id, user=strategy.user)
            
            # Get symbol
            symbol = backtest_data.get('symbol', 'BTC/USDT')
            
            # Get date range
            from datetime import datetime, timedelta
            end_date = datetime.now()
            days = int(backtest_data.get('days', 30))
            start_date = end_date - timedelta(days=days)
            
            # Run backtest
            result = trading_engine.backtest_strategy(
                strategy, exchange, symbol, start_date, end_date
            )
            
            return result
            
        except Exception as e:
            return {'error': str(e)}
    
    # Send market data periodically
    async def send_market_data(self):
        symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
        
        try:
            while True:
                for symbol in symbols:
                    # Only send data for the subscribed symbol if set
                    if hasattr(self, 'symbol') and self.symbol != symbol:
                        continue
                        
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
                    
                    # Send message to room group
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'market_data_message',
                            'data': data
                        }
                    )
                
                # Wait for 1 second before sending the next update
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            # Task was cancelled, clean up
            pass
    
    # Receive message from room group
    async def market_data_message(self, event):
        data = event['data']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'market_data',
            'data': data
        }))
    
    # Receive subscription message from room group
    async def subscription_message(self, event):
        message = event['message']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'subscription',
            'message': message
        }))
    
    # Receive trade message from room group
    async def trade_message(self, event):
        trade = event['trade']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'trade_response',
            'trade': trade
        }))
        
class UserTradingConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for user-specific trading notifications"""
    
    async def connect(self):
        if not self.scope['user'].is_authenticated:
            # Reject connection if not authenticated
            await self.close()
            return
            
        self.user_id = self.scope['user'].id
        self.room_group_name = f'trading_user_{self.user_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send initial message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f'Connected to user trading channel for user {self.user_id}'
        }))
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type', '')
        
        if message_type == 'get_trades':
            # Get recent trades for the user
            trades = await self.get_user_trades()
            
            await self.send(text_data=json.dumps({
                'type': 'trades_list',
                'trades': trades
            }))
        elif message_type == 'get_portfolio':
            # Get portfolio for the user
            portfolio = await self.get_user_portfolio()
            
            await self.send(text_data=json.dumps({
                'type': 'portfolio_data',
                'portfolio': portfolio
            }))
    
    @database_sync_to_async
    def get_user_trades(self):
        """Get recent trades for the user"""
        try:
            # Get recent trades
            trades = Trade.objects.filter(
                user_id=self.user_id
            ).order_by('-executed_at')[:20]
            
            return [
                {
                    'id': str(trade.id),
                    'symbol': trade.symbol,
                    'trade_type': trade.trade_type,
                    'quantity': float(trade.quantity),
                    'price': float(trade.price),
                    'status': trade.status,
                    'executed_at': trade.executed_at.isoformat() if trade.executed_at else None,
                    'order_id': trade.order_id
                }
                for trade in trades
            ]
            
        except Exception as e:
            return [{'error': str(e)}]
    
    @database_sync_to_async
    def get_user_portfolio(self):
        """Get portfolio for the user"""
        try:
            # Get all executed trades for the user
            trades = Trade.objects.filter(
                user_id=self.user_id,
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
                
            return {
                'total_value': portfolio_value,
                'items': portfolio_items
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    # Receive trade message from room group
    async def trade_message(self, event):
        trade = event['trade']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'trade_executed',
            'trade': trade
        }))