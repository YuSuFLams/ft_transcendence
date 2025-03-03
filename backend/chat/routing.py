from django.urls import re_path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/(?P<type>\w+)/(?P<id>\d+)/$', ChatConsumer.as_asgi()),
]

"""Please note that URLRouter nesting will not
 work properly with path() routes if inner routers
 are wrapped by additional middleware. See Issue #1428.
 """