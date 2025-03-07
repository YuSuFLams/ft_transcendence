from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import Account, FriendList
import json


class NotifConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def get_all_friends(self):
        try:
            user = Account.objects.get(id=self.scope['user'].id)
            print(f'user {user.username} is logged on get all frs')
            fr_list =  FriendList.objects.get(user=user)

            return list(fr_list.friends.all())
        except Account.DoesNotExist:
            print('Account does not exist')
            return []
        except FriendList.DoesNotExist:
            print('Fr list does not exit')
            return []
        except Exception as e:
            print(e)
            return []

    @database_sync_to_async
    def updated_stats_on_db(self, id, is_online):
        Account.objects.filter(id=id).update(is_online=is_online)

    async def connect(self):
        if self.scope['user'].is_authenticated:
            auth_id = self.scope['user'].id
            self.grp_name = f"room_{auth_id}"
            await self.channel_layer.group_add(self.grp_name, self.channel_name)
            await self.notify_online(True)
            await self.updated_stats_on_db(auth_id, True)
            await self.accept()

    async def disconnect(self, code):
        if self.scope['user'].is_authenticated:
            await self.channel_layer.group_discard(self.grp_name, self.channel_name)
            await self.updated_stats_on_db(self.scope['user'].id, False)
            await self.notify_online(False)
        await self.close(code)

    async def notify_online(self, is_online):
        friends = await self.get_all_friends()
        for friend in friends:
            print(f'Notify id={friend.id}')
            await self.channel_layer.group_send(f"room_{friend.id}",
                                                {
                                                    "type": "user.status",
                                                    "username": self.scope['user'].username,
                                                    "id": self.scope['user'].id,
                                                    "is_msg":'',
                                                    "msg": f"{self.scope['user'].username} is online",
                                                    'is_online': is_online,
                                                })
    async def user_status(self, event):
        print(f'sent to {event["username"]}')
        await self.send(text_data=json.dumps(
            {
                "username":event['username'],
                'is_online':event['is_online'],
                'msg':event['msg'],
            }))

# online state
# unread msg
# friend accepted
# a friend declined