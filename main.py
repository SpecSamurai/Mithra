from fastapi import FastAPI

app = FastAPI()

app.frontend("/", directory="dist")

# @app.get("/")
# async def root():
#     return {"Hello": "World"}
