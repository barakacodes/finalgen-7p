from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/trading/(?P<room_name>\w+)/$', consumers.TradingConsumer.as_asgi()),
    re_path(r'ws/user/trading/$', consumers.UserTradingConsumer.as_asgi()),
]