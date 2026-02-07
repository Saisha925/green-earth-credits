import os
from dotenv import load_dotenv
from groq import Groq

# Load .env file
load_dotenv()

print("KEY VALUE:", repr(os.getenv("GROQ_API_KEY")))

try:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": "Hello from hackathon"}
        ],
    )

    print("SUCCESS")
    print(response.choices[0].message.content)

except Exception as e:
    import traceback
    print("ERROR TYPE:", type(e))
    print("ERROR MESSAGE:", str(e))
    traceback.print_exc()
