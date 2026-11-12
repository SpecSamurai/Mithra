import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_groq import ChatGroq

from backend.config import settings

load_dotenv()

model = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.7,
    api_key=settings.groq_api_key.get_secret_value(),
)

agent = create_agent(model=model)

agent.invoke({"messages": "test"})

if __name__ == "__main__":
    print("Hello world")
