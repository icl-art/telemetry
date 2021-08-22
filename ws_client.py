import asyncio
import pathlib
import ssl
import websockets


async def hello():
    uri = "wss://35.229.97.111:8082"
    async with websockets.connect(uri, ssl = True) as websocket:
        name = input("Message: ")

        await websocket.send(name)
        print(f"> {name}")

        # greeting = await websocket.recv()
        # print(f"< {greeting}")

asyncio.get_event_loop().run_until_complete(hello())