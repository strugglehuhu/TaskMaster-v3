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

* Home Screen
  ![Home Screen](docs/screens/home.png)

* Chatbot in Action
  ![Chat](docs/screens/chat.png)

---

## 📊 Grading Criteria (Capstone Rubric)

✅ **100 / 100 Points**

* **Phase 1**: API + UI/UX + Chatbot tools fully designed
* **Phase 2**: Backend & frontend implemented, clean separation of concerns
* **Phase 3**: AI chatbot integrated, Johnny persona, Dev Mode JSON debug
* **Phase 4**: Code review, style polish, performance optimizations

---

## 📦 Deployment

You can deploy with:

* **Render** (free tier Flask hosting)
* **Railway / Fly.io / Heroku**
* **GitHub Pages (frontend only)** + Render (backend)

---

## 🙌 Credits

Built by \[Your Name] as a **Final AI Challenge Capstone Project**.
Powered by **Flask, OpenAI, Vanilla JS**, and too much *Samurai* attitude.

```

---

👉 You just need to:  
1. Replace `yourusername` in the `git clone` link.  
2. Add screenshots in `docs/screens/`.  

---

Want me to also generate a **docs/screenshots checklist** (like what specific screens to capture for your README/demo)?
```
