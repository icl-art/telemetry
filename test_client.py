import asyncio
import websockets

IP = "35.229.97.111"

async def hello():
    uri = f"ws://{IP}"
    async with websockets.connect(uri) as websocket:
        while True:
            frame = await websocket.recv()
            if frame == "END":
                print("Done")
                break
            print(frame)

asyncio.get_event_loop().run_until_complete(hello())
