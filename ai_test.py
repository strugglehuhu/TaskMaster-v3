# ai_test.py
import os, json
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM = "Return ONLY this JSON exactly: {\"ok\": true}"

resp = client.chat.completions.create(
    model="gpt-3.5-turbo",  # switch to a model you have access to
    messages=[
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": "hi"}
    ],
    temperature=0
)

print("RAW:", resp.choices[0].message.content)
print("PARSED:", json.loads(resp.choices[0].message.content))
print("✅ OpenAI connectivity OK")
