from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import Account, FriendList, Notification, BlackList
from datetime import datetime
import json

#TODO search abt wss

class NotifConsumer(AsyncWebsocketConsumer):
    # def __init__(self, *args, **kwargs):
    #     notif_types = {
    #         0: "offline",
    #         1: "online",
    #         2: "msg",
    #         3: "requested a friendship",
    #         4: "your request accepted"
    #     }

    @database_sync_to_async
    def get_all_friends(self):
        try:
            user = Account.objects.get(id=self.scope['user'].id)
            print(f'user {user.username} socket is on')
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
    def is_blocked(self, friend):
        fr_blk_obj, created = BlackList.objects.get_or_create(user=friend)
        my_blk_obj, created = BlackList.objects.get_or_create(user=self.scope['user'])
        if (self.scope['user'] in fr_blk_obj.blocked.all()):
            return True
        return (friend in my_blk_obj.blocked.all())
        

    @database_sync_to_async
    def updated_stats_on_db(self, id, is_online):
        Account.objects.filter(id=id).update(is_online=is_online)

    @database_sync_to_async
    def update_notif_on_db(self, receiver, notif_type, msg=''):
        Notification.objects.create(sender=self.scope['user'],
                                    receiver=receiver,
                                    notif_type=notif_type,
                                    msg=msg)

    @database_sync_to_async
    def get_user_by_id(self, id):
        try:
            return Account.objects.get(id=id)
        except:
            print('[WS] get_user_by_id() returned None')
            return None

    async def connect(self):
        if self.scope['user'].is_authenticated:
            auth_id = self.scope['user'].id
            self.grp_name = f"room_{auth_id}"
            await self.channel_layer.group_add(self.grp_name, self.channel_name)
            await self.notify_all_friends(1)
            await self.updated_stats_on_db(auth_id, True)
            await self.accept()

    async def disconnect(self, code):
        if self.scope['user'].is_authenticated:
            await self.channel_layer.group_discard(self.grp_name, self.channel_name)
            await self.updated_stats_on_db(self.scope['user'].id, False)
            await self.notify_all_friends(0)
        await self.close(code)


    async def notify_friend(self, friend, notif_type, msg=''):
        if (friend == self.scope['user']):
            print('[WS] you can not notify yourself')
        elif not (await self.is_blocked(friend)):
            await self.channel_layer.group_send(f"room_{friend.id}",
                {
                    "type": "user.status",
                    "username": self.scope['user'].username,
                    "id": self.scope['user'].id,
                    "notif_type": notif_type,
                    "msg": msg,
                    "timestamp": str(datetime.now()).split('.')[0]
                })
            await self.update_notif_on_db(friend, notif_type, msg=msg)
        else:
            print('[WS] blocked')


    async def notify_all_friends(self, notif_type, msg=''):
        friends = await self.get_all_friends()
        for friend in friends:
            await self.notify_friend(friend, notif_type)

    async def user_status(self, event):
        await self.send(text_data=json.dumps(
        {
            'notif_type': event['notif_type'],
            "username": event['username'],
            "id": event['id'],
            'msg': event['msg'],
            'timestamp': event['timestamp'],
        }))

    async def receive(self, text_data=None, bytes_data=None):
        try:
            json_data = json.loads(text_data)
            msg = json_data.get('message')
            friend_id = json_data.get('id')
        except:
            print('[WS] invalid JSON data')
            return
        
        friend_obj = await self.get_user_by_id(friend_id)
        if friend_obj:
            await self.notify_friend(friend_obj, 2, msg=msg)

    async def chat_msg(self, event):
        await self.send(text_data=json.dumps({
            'notif_type': event['notif_type'],
            "username": event["username"],
            "id": event['id'],
            "msg": event["msg"],
            'timestamp': event['timestamp'],
        }))