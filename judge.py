from langchain_core.messages import AnyMessage
from pydantic import BaseModel
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
import operator


class TestState(TypedDict):
    text: Annotated[list[AnyMessage], operator.add]


def mock_llm(state: TestState):
    return {"text": "hello world"}


builder = StateGraph(TestState)
builder.add_node(mock_llm)
builder.add_edge(START, "mock_llm")
builder.add_edge("mock_llm", END)
graph = builder.compile()

result = graph.invoke(
    {
        "text": "LangGraph lets you build stateful, multi-step LLM applications as graphs."
    }
)

print(result)
