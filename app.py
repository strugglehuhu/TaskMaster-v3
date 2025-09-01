# app.py
from __future__ import annotations
from flask import Flask, request, jsonify, render_template
import itertools, os, json, re, traceback, logging
from dotenv import load_dotenv
from typing import Any

# Optional CORS (off by default for same-origin)
USE_CORS = os.getenv("USE_CORS", "0") == "1"
if USE_CORS:
    from flask_cors import CORS  # type: ignore

# OpenAI client
try:
    from openai import OpenAI
except Exception:
    OpenAI = None

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0"))

app = Flask(__name__)
if USE_CORS:
    CORS(app)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("taskmaster")

# In-memory tasks
tasks: list[dict] = []
id_counter = itertools.count(1)

def find_task(task_id: int) -> dict | None:
    for t in tasks:
        if t["id"] == task_id:
            return t
    return None

def api_error(msg: str, code: int = 400):
    return jsonify({"ok": False, "error": msg}), code

def safe_json() -> dict:
    return request.get_json(silent=True) or {}

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/api/tasks")
def get_tasks():
    return jsonify(tasks), 200

@app.post("/api/tasks")
def add_task():
    data = safe_json()
    desc = data.get("description")
    if not isinstance(desc, str) or not desc.strip():
        return api_error("Description must be a non-empty string.", 400)
    task = {"id": next(id_counter), "description": desc.strip(), "completed": False}
    tasks.append(task)
    return jsonify(task), 201

@app.patch("/api/tasks/<int:task_id>/complete")
def complete_task(task_id: int):
    task = find_task(task_id)
    if not task:
        return api_error("Task not found.", 404)
    task["completed"] = True
    return jsonify(task), 200

@app.delete("/api/tasks/<int:task_id>")
def delete_task(task_id: int):
    task = find_task(task_id)
    if not task:
        return api_error("Task not found.", 404)
    tasks.remove(task)
    return jsonify(task), 200

# ---------------- Johnny Silverhand router ----------------
SYSTEM_PROMPT = """
You are Johnny Silverhand (from Cyberpunk 2077) acting as an AI router for a To-Do List app.
Stay true to Johnny's personality (rebellious, sarcastic, witty), BUT your output must be
ONLY a single JSON object describing the function call—no extra words, no markdown.

Function calls:
- addTask(description: string)
- viewTasks()
- completeTask(task_id: int)
- deleteTask(task_id: int)

Rules:
1) Return ONLY JSON with this schema:
   {"function": string, "parameters": object}
2) Map intents:
   Add → addTask
   Show/List/What’s on → viewTasks
   Done/Finish/Check off → completeTask
   Delete/Remove/Trash → deleteTask
3) Extract numbers and ordinals ("third" → 3).
4) For addTask, include the description (strip quotes).
5) If unclear, default to viewTasks.
6) Do not include Johnny’s voice in the output. The frontend handles voice. Output JSON only.
"""

def robust_json_parse(s: str) -> dict:
    s = s.strip()
    if s.startswith("```"):
        s = re.sub(r"^```(?:json)?\s*", "", s)
        s = re.sub(r"\s*```$", "", s)
        s = s.strip()
    try:
        return json.loads(s)
    except Exception:
        pass
    m = re.search(r"\{.*\}", s, flags=re.S)
    if m:
        return json.loads(m.group(0))
    raise ValueError("Model did not return valid JSON.")

_client: Any = None
def get_openai_client() -> Any:
    global _client
    if _client is None:
        if OpenAI is None:
            raise RuntimeError("openai package not installed.")
        if not OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY missing (set it in .env).")
        _client = OpenAI(api_key=OPENAI_API_KEY)
    return _client

@app.post("/api/ai")
def ai_route():
    data = safe_json()
    text = (data.get("text") or "").strip()
    if not text:
        return api_error("text required", 400)

    try:
        client = get_openai_client()
        completion = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "system", "content": SYSTEM_PROMPT},
                      {"role": "user", "content": text}],
            temperature=OPENAI_TEMPERATURE,
        )
        content = completion.choices[0].message.content
        call = robust_json_parse(content or "")
    except Exception as e:
        log.error("AI error: %s", e)
        traceback.print_exc()
        return api_error(f"AI error: {e}", 500)

    fn = call.get("function")
    params = call.get("parameters", {}) or {}
    try:
        if fn == "addTask":
            desc = str(params.get("description", "")).strip()
            if not desc:
                return api_error("description required", 400)
            task = {"id": next(id_counter), "description": desc, "completed": False}
            tasks.append(task)
            result = task
        elif fn == "viewTasks":
            result = tasks
        elif fn == "completeTask":
            tid = int(params.get("task_id", 0))
            task = find_task(tid)
            if not task:
                return api_error("task not found", 404)
            task["completed"] = True
            result = task
        elif fn == "deleteTask":
            tid = int(params.get("task_id", 0))
            task = find_task(tid)
            if not task:
                return api_error("task not found", 404)
            tasks.remove(task)
            result = task
        else:
            return api_error(f"unknown function: {fn}", 400)

        return jsonify({"call": call, "result": result, "tasks": tasks}), 200

    except Exception as e:
        log.error("Execution error: %s", e)
        traceback.print_exc()
        return api_error(f"execution error: {e}", 500)

if __name__ == "__main__":
    app.run(debug=True)
