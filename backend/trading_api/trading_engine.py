import asyncio
import json
import logging
import random
from datetime import datetime, timedelta
from decimal import Decimal

from django.db import transaction
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import TradingStrategy, Exchange, Trade, MarketData
from .strategies import get_strategy_executor

logger = logging.getLogger(__name__)

class TradingEngine:
    """Trading engine for executing strategies and managing trades"""
    
    def __init__(self):
        self.channel_layer = get_channel_layer()
        self.active_strategies = {}  # Map of strategy_id to last execution time
        
    def execute_strategies(self, user=None):
        """Execute all active strategies for a user or all users if not specified"""
        try:
            # Get active strategies
            strategies_query = TradingStrategy.objects.filter(is_active=True)
            if user:
                strategies_query = strategies_query.filter(user=user)
                
            strategies = strategies_query.select_related('user')
            
            signals = []
            for strategy in strategies:
                # Check if we should execute this strategy (not executed in the last 5 minutes)
                last_execution = self.active_strategies.get(str(strategy.id))
                now = datetime.now()
                
                if last_execution and (now - last_execution).total_seconds() < 300:
                    # Skip if executed recently
                    continue
                    
                # Update last execution time
                self.active_strategies[str(strategy.id)] = now
                
                # Get user's exchanges
                exchanges = Exchange.objects.filter(user=strategy.user, is_active=True)
                
                for exchange in exchanges:
                    # For now, we'll use a fixed set of symbols
                    symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
                    
                    for symbol in symbols:
                        # Get strategy executor
                        executor = get_strategy_executor(strategy, exchange, symbol)
                        
                        # Execute strategy
                        signal = executor.execute()
                        
                        if signal:
                            # Add user to signal
                            signal['user_id'] = strategy.user.id
                            signals.append(signal)
                            
                            # Process the signal
                            self._process_signal(signal)
            
            return signals
                
        except Exception as e:
            logger.error(f"Error executing strategies: {str(e)}")
            return []
    
    def _process_signal(self, signal):
        """Process a trading signal by creating a trade and notifying via WebSocket"""
        try:
            with transaction.atomic():
                # Create trade record
                trade = Trade(
                    user_id=signal['user_id'],
                    strategy_id=signal['strategy_id'],
                    exchange_id=signal['exchange_id'],
                    symbol=signal['symbol'],
                    trade_type=signal['signal_type'],
                    quantity=Decimal(str(signal['quantity'])),
                    price=Decimal(str(signal['price'])),
                    status='EXECUTED',
                    executed_at=datetime.now(),
                    order_id=f"auto-{random.randint(10000, 99999)}"
                )
                trade.save()
                
                # Send WebSocket notification
                room_group_name = f"trading_user_{signal['user_id']}"
                
                async_to_sync(self.channel_layer.group_send)(
                    room_group_name,
                    {
                        'type': 'trade_message',
                        'trade': {
                            'id': str(trade.id),
                            'symbol': trade.symbol,
                            'trade_type': trade.trade_type,
                            'quantity': float(trade.quantity),
                            'price': float(trade.price),
                            'status': trade.status,
                            'executed_at': trade.executed_at.isoformat() if trade.executed_at else None,
                            'reason': signal.get('reason', '')
                        }
                    }
                )
                
                return trade
                
        except Exception as e:
            logger.error(f"Error processing signal: {str(e)}")
            return None
    
    def backtest_strategy(self, strategy, exchange, symbol, start_date, end_date):
        """Backtest a strategy over a historical period"""
        try:
            # Get strategy executor
            executor = get_strategy_executor(strategy, exchange, symbol)
            
            # In a real system, we would use historical data from the database
            # For this demo, we'll generate simulated data
            
            # Generate daily candles for the period
            days = (end_date - start_date).days
            
            # Base price and random walk
            base_price = 50000.0  # Base price for BTC/USDT
            if symbol == 'ETH/USDT':
                base_price = 3000.0
            elif symbol == 'SOL/USDT':
                base_price = 100.0
                
            # Generate price series with random walk
            prices = [base_price]
            for _ in range(days):
                # Random daily change between -3% and +3%
                daily_change = prices[-1] * random.uniform(-0.03, 0.03)
                prices.append(prices[-1] + daily_change)
            
            # Generate OHLC data
            candles = []
            current_date = start_date
            
            for i in range(days):
                # Generate OHLC data with some randomness around the price
                price = prices[i]
                open_price = price * (1 + random.uniform(-0.01, 0.01))
                high_price = price * (1 + random.uniform(0, 0.02))
                low_price = price * (1 - random.uniform(0, 0.02))
                close_price = price * (1 + random.uniform(-0.01, 0.01))
                volume = random.uniform(100, 1000)
                
                candle = {
                    'timestamp': current_date.isoformat(),
                    'open': round(open_price, 2),
                    'high': round(high_price, 2),
                    'low': round(low_price, 2),
                    'close': round(close_price, 2),
                    'volume': round(volume, 2)
                }
                
                candles.append(candle)
                current_date += timedelta(days=1)
            
            # Simulate strategy execution on historical data
            trades = []
            portfolio_value = 10000.0  # Starting with $10,000
            position = 0.0  # Current position size
            
            for i in range(len(candles) - 1):
                # Override the get_market_data method to use our historical data
                executor.get_market_data = lambda *args, **kwargs: candles[:i+1]
                
                # Execute strategy
                signal = executor.execute()
                
                if signal:
                    # Process trade
                    price = candles[i]['close']
                    quantity = signal['quantity']
                    trade_type = signal['signal_type']
                    
                    if trade_type == 'BUY':
                        # Buy logic
                        cost = price * quantity
                        if cost <= portfolio_value:
                            portfolio_value -= cost
                            position += quantity
                    else:
                        # Sell logic
                        if position >= quantity:
                            portfolio_value += price * quantity
                            position -= quantity
                    
                    trades.append({
                        'date': candles[i]['timestamp'],
                        'price': price,
                        'type': trade_type,
                        'quantity': quantity,
                        'portfolio_value': portfolio_value,
                        'position': position
                    })
            
            # Calculate final portfolio value including current position
            final_price = candles[-1]['close']
            final_portfolio_value = portfolio_value + (position * final_price)
            
            # Calculate performance metrics
            initial_value = 10000.0
            profit_loss = final_portfolio_value - initial_value
            profit_loss_pct = (profit_loss / initial_value) * 100
            
            # Calculate drawdown
            peak_value = initial_value
            max_drawdown = 0.0
            
            for trade in trades:
                current_value = trade['portfolio_value'] + (trade['position'] * trade['price'])
                if current_value > peak_value:
                    peak_value = current_value
                
                drawdown = (peak_value - current_value) / peak_value * 100
                max_drawdown = max(max_drawdown, drawdown)
            
            return {
                'trades': trades,
                'initial_value': initial_value,
                'final_value': final_portfolio_value,
                'profit_loss': profit_loss,
                'profit_loss_pct': profit_loss_pct,
                'max_drawdown': max_drawdown,
                'trade_count': len(trades)
            }
            
        except Exception as e:
            logger.error(f"Error backtesting strategy: {str(e)}")
            return {
                'error': str(e),
                'trades': [],
                'profit_loss': 0,
                'profit_loss_pct': 0
            }

# Singleton instance
trading_engine = TradingEngine()