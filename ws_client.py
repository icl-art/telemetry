import asyncio
import pathlib
import ssl
import websockets


async def hello():
    uri = "wss://shreybohra.com:2053/"
    async with websockets.connect(uri, ssl = True) as websocket:
        name = input("Message: ")

        await websocket.send(name)
        print(f"> {name}")

        # greeting = await websocket.recv()
        # print(f"< {greeting}")

asyncio.get_event_loop().run_until_complete(hello())