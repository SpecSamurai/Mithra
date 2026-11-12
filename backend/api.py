from collections.abc import AsyncIterable

from fastapi import FastAPI
from fastapi.sse import EventSourceResponse
from pydantic import BaseModel


app = FastAPI()

app.frontend("/", directory="dist")


class Item(BaseModel):
    name: str
    price: float

items = [
    Item(name="1", price=3.00),
    Item(name="2", price=4.00),
    Item(name="3", price=4.00),
]


@app.get("/api/chat", response_class=EventSourceResponse)
async def chat()-> AsyncIterable[Item]:
    for item in items:
        yield item