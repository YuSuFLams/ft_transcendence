from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import Account, FriendList

class NotifConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def get_all_friends(self):
        try:
            user = Account.objects.get(id=self.scope['user'].id)
            return list(FriendList.objects.filter(user=user))
        except:
            return None
        
    async def connect(self):
        if self.scope['user'].is_authenticated:
            auth_id = self.scope['user'].id
            self.grp_name = f"room_{auth_id}"
            await self.channel_layer.group_add(self.grp_name, self.channel_name)
            await self.notify_online()
            #notify online
            await self.accept()

    async def disconnect(self, code):
        if self.scope['user'].is_authenticated:
            await self.channel_layer.group_discard(self.grp_name, self.channel_name)
            #notify offline
        await self.close(code)

    async def notify_online(self):
        friends = await self.get_all_friends()
        for friend in friends:
            # await self.channel_layer.group_add(, self.channel_name)
            await self.channel_layer.group_send(f"room_{friend.id}",
                                                {
                                                    "type": "user_status",
                                                    "username": self.scope['user'].username,
                                                    "msg": f"{self.scope['user'].username} is online",
                                                })



