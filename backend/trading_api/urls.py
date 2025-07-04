from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'strategies', views.TradingStrategyViewSet, basename='strategy')
router.register(r'exchanges', views.ExchangeViewSet, basename='exchange')
router.register(r'trades', views.TradeViewSet, basename='trade')
router.register(r'market-data', views.MarketDataViewSet, basename='market-data')

urlpatterns = [
    path('', include(router.urls)),
    path('market/simulated/', views.SimulatedMarketDataAPI.as_view(), name='simulated-market-data'),
    path('trade/execute/', views.execute_trade, name='execute-trade'),
    path('portfolio/', views.get_portfolio, name='portfolio'),
]