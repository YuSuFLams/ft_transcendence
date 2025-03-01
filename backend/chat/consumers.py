from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import msgModel
from users.models import Account
import json

class ChatConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def save_msg(self, msg, sender, channel_name):
        try:
            msgModel.objects.create(sender=Account.objects.get(username=sender),
                                    msg=msg,
                                    channel_name=channel_name)
        except:
            print('[-] Failed to save a msg')
            pass

    async def connect(self):
        auth_id = self.scope['user'].id
        other_id = self.scope['url_route']['kwargs']['id']
        if not (isinstance(auth_id, int) and isinstance(other_id, int)):
            print("[-] did not found int type")
            await self.close()
            return

        if (auth_id == other_id):
            print("[-] You can not send a msg to yourself")
            await self.close()
            return
        
        self.room_name = str(other_id) + "_" + str(auth_id)
        if (auth_id > other_id):
            self.room_name = str(auth_id) + "_" + str(other_id)

        self.room_group_name = "chat_" + self.room_name
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print(f'[+] I am inside |{self.room_group_name}|')

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.close(close_code)
        

    async def receive(self, text_data=None, bytes_data=None):
        try:
            json_data = json.loads(text_data)
            msg = json_data.get('message')
            username = self.scope['user'].username
        except:
            print('invalid JSON data')
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.msg',
                'message': msg,
                'username': username,
            })
        print(f'[+] Sending {msg} from {username} in grp {self.room_group_name}, channel {self.channel_layer}')
    
        await self.save_msg(msg, username, self.channel_name)

    async def chat_msg(self, event):
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "message": event["message"],
        }))