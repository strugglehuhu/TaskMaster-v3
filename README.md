Perfect — here’s a **ready-to-drop README.md** for your GitHub repo.
I’ll include install/run instructions, grading highlights, screenshots placeholders, and portfolio polish.

---

## 📄 `README.md`

```markdown
# 🦾 TaskMaster: A Cyberpunk To-Do App with Johnny Silverhand

Welcome to **TaskMaster**, a full-stack AI-powered To-Do List manager.  
It’s built with **Flask + Vanilla JS**, styled with a **Cyberpunk 2077 aesthetic**, and features a chatbot powered by **OpenAI** — voiced in the persona of *Johnny Silverhand*.

---

## ✨ Features
- ✅ **CRUD To-Dos** — Add, view, complete, and delete tasks.
- 🤖 **AI Chatbot** — Natural language commands routed through OpenAI (`/api/ai`).
- 🎭 **Johnny Silverhand Persona** — Chatbot responses rephrased as snarky Silverhand quips.
- 🎨 **Cyberpunk Theme** — Neon yellow + cyan, glitch logo, dark synthwave UI.
- 🧑‍💻 **Dev Mode Toggle** — Show raw JSON function calls for debugging.
- 🔒 **Environment Setup** — API key stored securely in `.env`.

---

## 📂 Project Structure
```

TASKMASTER/
├─ app.py                # Flask backend
├─ requirements.txt      # Python deps
├─ .env                  # Holds OPENAI\_API\_KEY
├─ .gitignore
├─ templates/
│  └─ index.html         # Frontend template
└─ static/
├─ css/
│  └─ style.css       # Cyberpunk styling
└─ js/
└─ app.js          # Chat + task logic

````

---

## 🚀 Getting Started

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/taskmaster.git
cd taskmaster
````

### 2. Create Virtual Env

```bash
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
.venv\Scripts\activate      # Windows
```

### 3. Install Requirements

```bash
pip install -r requirements.txt
```

### 4. Add Environment Key

Create a `.env` file in the project root:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ Must be a **user secret key** (`sk-...`), not a project key.

### 5. Run the App

```bash
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

---

## 🕹️ Usage

### Johnny Chat Examples

* `Add "buy cyberware"`
* `Delete the third one`
* `I’m done with task 2`
* `Show me what’s left`

---

## 📸 Screenshots

> *(Add screenshots of your app running)*
<img width="1055" height="893" alt="image" src="https://github.com/user-attachments/assets/01f3c8e5-76ca-4cb7-bbad-b36be0cfa6cd" />

* Home Screen
* Chatbot in Action


---

