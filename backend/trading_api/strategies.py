import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import json
from .models import TradingStrategy, Trade, MarketData

class StrategyExecutor:
    """Base class for executing trading strategies"""
    
    def __init__(self, strategy, exchange, symbol):
        self.strategy = strategy
        self.exchange = exchange
        self.symbol = symbol
        self.parameters = strategy.parameters
        
    def get_market_data(self, data_type='CANDLE', timeframe='1h', limit=24):
        """Get market data for strategy execution"""
        # In a real system, this would fetch from the database or exchange API
        # For now, we'll generate simulated data
        
        base_price = 50000.0  # Base price for BTC/USDT
        if self.symbol == 'ETH/USDT':
            base_price = 3000.0
        elif self.symbol == 'SOL/USDT':
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
            
        # Convert to pandas DataFrame for easier analysis
        df = pd.DataFrame(candles)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        return df
    
    def execute(self):
        """Execute the strategy and return trade signals"""
        # This should be implemented by subclasses
        raise NotImplementedError("Subclasses must implement execute()")
    
    def generate_trade_signal(self, signal_type, price, quantity, reason=""):
        """Generate a trade signal based on strategy execution"""
        return {
            'strategy_id': str(self.strategy.id),
            'exchange_id': str(self.exchange.id),
            'symbol': self.symbol,
            'signal_type': signal_type,  # 'BUY' or 'SELL'
            'price': price,
            'quantity': quantity,
            'timestamp': datetime.now().isoformat(),
            'reason': reason
        }

class MomentumStrategy(StrategyExecutor):
    """Momentum trading strategy implementation"""
    
    def execute(self):
        # Get market data
        df = self.get_market_data(timeframe='1h', limit=24)
        
        # Get strategy parameters
        lookback_period = self.parameters.get('lookback_period', 12)
        threshold = self.parameters.get('threshold', 0.02)
        
        # Calculate momentum
        df['returns'] = df['close'].pct_change()
        df['momentum'] = df['returns'].rolling(window=lookback_period).sum()
        
        # Generate signals based on momentum
        current_momentum = df['momentum'].iloc[-1]
        current_price = df['close'].iloc[-1]
        
        # Determine position size based on momentum strength
        position_size = abs(current_momentum) * 0.1  # Scale position size with momentum
        position_size = max(0.01, min(1.0, position_size))  # Limit between 0.01 and 1.0
        
        if current_momentum > threshold:
            return self.generate_trade_signal(
                'BUY', 
                current_price, 
                position_size,
                f"Momentum ({current_momentum:.4f}) above threshold ({threshold})"
            )
        elif current_momentum < -threshold:
            return self.generate_trade_signal(
                'SELL', 
                current_price, 
                position_size,
                f"Momentum ({current_momentum:.4f}) below negative threshold ({-threshold})"
            )
        
        return None  # No signal

class MeanReversionStrategy(StrategyExecutor):
    """Mean reversion trading strategy implementation"""
    
    def execute(self):
        # Get market data
        df = self.get_market_data(timeframe='1h', limit=48)
        
        # Get strategy parameters
        window = self.parameters.get('window', 20)
        std_dev = self.parameters.get('std_dev', 2.0)
        
        # Calculate moving average and standard deviation
        df['ma'] = df['close'].rolling(window=window).mean()
        df['std'] = df['close'].rolling(window=window).std()
        df['upper_band'] = df['ma'] + (df['std'] * std_dev)
        df['lower_band'] = df['ma'] - (df['std'] * std_dev)
        
        # Generate signals based on price relative to bands
        current_price = df['close'].iloc[-1]
        upper_band = df['upper_band'].iloc[-1]
        lower_band = df['lower_band'].iloc[-1]
        
        # Determine position size based on distance from mean
        distance_from_mean = abs(current_price - df['ma'].iloc[-1]) / df['std'].iloc[-1]
        position_size = min(1.0, distance_from_mean * 0.2)  # Scale with distance from mean
        position_size = max(0.01, position_size)  # Minimum position size
        
        if current_price > upper_band:
            return self.generate_trade_signal(
                'SELL', 
                current_price, 
                position_size,
                f"Price ({current_price:.2f}) above upper band ({upper_band:.2f})"
            )
        elif current_price < lower_band:
            return self.generate_trade_signal(
                'BUY', 
                current_price, 
                position_size,
                f"Price ({current_price:.2f}) below lower band ({lower_band:.2f})"
            )
        
        return None  # No signal

class BreakoutStrategy(StrategyExecutor):
    """Breakout trading strategy implementation"""
    
    def execute(self):
        # Get market data
        df = self.get_market_data(timeframe='1h', limit=48)
        
        # Get strategy parameters
        lookback = self.parameters.get('lookback', 20)
        
        # Calculate highest high and lowest low
        df['highest_high'] = df['high'].rolling(window=lookback).max()
        df['lowest_low'] = df['low'].rolling(window=lookback).min()
        
        # Previous values (one period ago)
        prev_highest = df['highest_high'].iloc[-2]
        prev_lowest = df['lowest_low'].iloc[-2]
        
        # Current price
        current_price = df['close'].iloc[-1]
        
        # Fixed position size for breakout strategy
        position_size = 0.1
        
        # Check for breakouts
        if current_price > prev_highest:
            return self.generate_trade_signal(
                'BUY', 
                current_price, 
                position_size,
                f"Breakout above previous high ({prev_highest:.2f})"
            )
        elif current_price < prev_lowest:
            return self.generate_trade_signal(
                'SELL', 
                current_price, 
                position_size,
                f"Breakdown below previous low ({prev_lowest:.2f})"
            )
        
        return None  # No signal

class TrendFollowingStrategy(StrategyExecutor):
    """Trend following strategy implementation"""
    
    def execute(self):
        # Get market data
        df = self.get_market_data(timeframe='1h', limit=72)
        
        # Get strategy parameters
        fast_period = self.parameters.get('fast_period', 9)
        slow_period = self.parameters.get('slow_period', 21)
        
        # Calculate moving averages
        df['fast_ma'] = df['close'].rolling(window=fast_period).mean()
        df['slow_ma'] = df['close'].rolling(window=slow_period).mean()
        
        # Calculate previous moving averages
        prev_fast_ma = df['fast_ma'].iloc[-2]
        prev_slow_ma = df['slow_ma'].iloc[-2]
        
        # Current moving averages
        current_fast_ma = df['fast_ma'].iloc[-1]
        current_slow_ma = df['slow_ma'].iloc[-1]
        
        # Current price
        current_price = df['close'].iloc[-1]
        
        # Position size based on trend strength
        trend_strength = abs(current_fast_ma - current_slow_ma) / current_slow_ma
        position_size = min(1.0, trend_strength * 5)  # Scale with trend strength
        position_size = max(0.01, position_size)  # Minimum position size
        
        # Check for crossovers
        if prev_fast_ma <= prev_slow_ma and current_fast_ma > current_slow_ma:
            return self.generate_trade_signal(
                'BUY', 
                current_price, 
                position_size,
                f"Bullish crossover (Fast MA: {current_fast_ma:.2f}, Slow MA: {current_slow_ma:.2f})"
            )
        elif prev_fast_ma >= prev_slow_ma and current_fast_ma < current_slow_ma:
            return self.generate_trade_signal(
                'SELL', 
                current_price, 
                position_size,
                f"Bearish crossover (Fast MA: {current_fast_ma:.2f}, Slow MA: {current_slow_ma:.2f})"
            )
        
        return None  # No signal

def get_strategy_executor(strategy, exchange, symbol):
    """Factory function to get the appropriate strategy executor"""
    strategy_type = strategy.strategy_type
    
    if strategy_type == 'MOMENTUM':
        return MomentumStrategy(strategy, exchange, symbol)
    elif strategy_type == 'MEAN_REVERSION':
        return MeanReversionStrategy(strategy, exchange, symbol)
    elif strategy_type == 'BREAKOUT':
        return BreakoutStrategy(strategy, exchange, symbol)
    elif strategy_type == 'TREND_FOLLOWING':
        return TrendFollowingStrategy(strategy, exchange, symbol)
    else:
        # Default to momentum strategy
        return MomentumStrategy(strategy, exchange, symbol)