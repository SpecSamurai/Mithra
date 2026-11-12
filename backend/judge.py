from typing import Final, TypedDict

from langgraph.graph import END, START, StateGraph


class State(TypedDict):
    values: list[int]
    name: str
    message: str


def greeting_node(state: State) -> dict:
    """
    Simple node that adds a greeting message to the state
    """

    return {
        "message": f"Hey {state['name']}, how are you",
    }

def process_values(state: State) -> State:
    """This function handles multiple different inputs"""

    return state


builder = StateGraph(State)  # ty: ignore[invalid-argument-type]

GREETER_NODE: Final = "greeter"
builder.add_node(GREETER_NODE, greeting_node)
builder.add_edge(START, GREETER_NODE)
builder.add_edge(GREETER_NODE, END)

graph = builder.compile()

if __name__ == "__main__":
    print(graph.get_graph().draw_ascii(), "\n", "-" * 20)

    result = graph.invoke({"name": "David"})
    print(result)
