from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TradingStrategy, Exchange, Trade, MarketData

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class TradingStrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = TradingStrategy
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class ExchangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exchange
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'api_key': {'write_only': True},
            'api_secret': {'write_only': True},
        }

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'executed_at']

class MarketDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketData
        fields = '__all__'
        read_only_fields = ['id', 'timestamp']