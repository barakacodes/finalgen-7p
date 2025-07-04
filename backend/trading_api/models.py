from django.db import models
from django.contrib.auth.models import User
import uuid

class TradingStrategy(models.Model):
    STRATEGY_TYPES = (
        ('MOMENTUM', 'Momentum'),
        ('MEAN_REVERSION', 'Mean Reversion'),
        ('BREAKOUT', 'Breakout'),
        ('TREND_FOLLOWING', 'Trend Following'),
        ('CUSTOM', 'Custom'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    strategy_type = models.CharField(max_length=20, choices=STRATEGY_TYPES)
    parameters = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='strategies')
    is_active = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class Exchange(models.Model):
    EXCHANGE_TYPES = (
        ('BINANCE', 'Binance'),
        ('COINBASE', 'Coinbase'),
        ('KRAKEN', 'Kraken'),
        ('KUCOIN', 'KuCoin'),
        ('BYBIT', 'Bybit'),
        ('SIMULATED', 'Simulated'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    exchange_type = models.CharField(max_length=20, choices=EXCHANGE_TYPES)
    api_key = models.CharField(max_length=255, blank=True, null=True)
    api_secret = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exchanges')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s {self.name}"

class Trade(models.Model):
    TRADE_TYPES = (
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    )
    
    TRADE_STATUS = (
        ('PENDING', 'Pending'),
        ('EXECUTED', 'Executed'),
        ('CANCELLED', 'Cancelled'),
        ('FAILED', 'Failed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trades')
    strategy = models.ForeignKey(TradingStrategy, on_delete=models.SET_NULL, null=True, related_name='trades')
    exchange = models.ForeignKey(Exchange, on_delete=models.CASCADE, related_name='trades')
    symbol = models.CharField(max_length=20)
    trade_type = models.CharField(max_length=10, choices=TRADE_TYPES)
    quantity = models.DecimalField(max_digits=18, decimal_places=8)
    price = models.DecimalField(max_digits=18, decimal_places=8)
    status = models.CharField(max_length=10, choices=TRADE_STATUS, default='PENDING')
    executed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    order_id = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.trade_type} {self.quantity} {self.symbol} at {self.price}"

class MarketData(models.Model):
    DATA_TYPES = (
        ('TICKER', 'Ticker'),
        ('ORDERBOOK', 'Order Book'),
        ('TRADE', 'Trade'),
        ('CANDLE', 'Candle'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exchange = models.ForeignKey(Exchange, on_delete=models.CASCADE, related_name='market_data')
    symbol = models.CharField(max_length=20)
    data_type = models.CharField(max_length=10, choices=DATA_TYPES)
    data = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['exchange', 'symbol', 'data_type', 'timestamp']),
        ]
