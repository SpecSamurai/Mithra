import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_groq import ChatGroq

load_dotenv()

GROQ_API_KEY=os.getenv("GROQ_API_KEY")
model = ChatGroq(model="openai/gpt-oss-120b", temperature=0.7, api_key=GROQ_API_KEY)

agent = create_agent(model=model)

agent.invoke({"messages": "test"})

if __name__ == "__main__":
    print("Hello world")
