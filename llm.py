# pip install langchain
# pip install langchain-community
# pip install langchain-ollama

from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferMemory
from backend.storage import study_goals, tasks


# Memory
memory = ConversationBufferMemory(
    memory_key="chat_history", return_messages=True
)

# LLM
llm = ChatOllama(
    # model='llama3.1:8b',
    model='llama3.2:latest',
    temperature=0.1
)









def llm_chat(query: str):
    # System Prompt
    system_template = """
    You are an AI Trip Planner

    Resposibilities:
    - You will create a travel plan for the user by using user inputs such has name of the place and days available to visit
    - Don't hallucinate information, if you don't know the answer, say "I don't know" and stick to the information provided by the user
    """

    # Prompt Template
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_template),
        ("human", "{question}")
    ])

    # Context
    days_available = 5

    # memory
    history = memory.load_memory_variables({})["chat_history"]

    final_prompt = f"""
{days_available} days available

Conversation History:
{history}

User Question:
{query}
"""
    print("------------ Final Prompt ------------ \n", final_prompt)

    chain = prompt|llm

    # Generate the response using the LLM
    response = chain.invoke(
        {"question": final_prompt}
        )

    response_text = str(response.content)

    # add to meomory as a history
    memory.save_context(
        {"input": query},
        {"output": response_text}
        )

    return response_text


# while True:
#     user_input = input("User: ")
#     if user_input.lower() == "exit":
#         break
#     response = llm_chat(user_input)
#     print("AI Trip Planner:", response)

