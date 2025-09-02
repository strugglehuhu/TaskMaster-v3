const API_BASE = "/api/tasks";
const PG_MODE = false; // set true for cleaner Johnny lines

const els = {
  list: document.getElementById("taskList"),
  count: document.getElementById("count"),
  input: document.getElementById("newTask"),
  add: document.getElementById("addBtn"),
  chatInput: document.getElementById("chatInput"),
  chatSend: document.getElementById("chatSend"),
  chatWindow: document.getElementById("chatWindow"),
  chatLog: document.getElementById("chatLog"),
  err: document.getElementById("err"),
  devToggle: document.getElementById("devToggle"),
  consoleWrap: document.getElementById("consoleWrap"),
};

// Dev console toggle
els.devToggle.addEventListener("change", () => {
  els.consoleWrap.classList.toggle("show", els.devToggle.checked);
});

const json = async (res) => {
  if (!res.ok) {
    let msg = "Request failed";
    try { const d = await res.json(); msg = d.error || JSON.stringify(d); } catch {}
    throw new Error(msg);
  }
  return res.json();
};

let lastRendered = "";
function renderTasks(tasks){
  const snap = JSON.stringify(tasks);
  if (snap === lastRendered) return;
  lastRendered = snap;

  els.count.textContent = tasks.length;
  els.list.innerHTML = "";
  if (!tasks.length){
    els.list.innerHTML = `<div class="muted" style="padding:8px;">No tasks yet — add your first one!</div>`;
    return;
  }
  for (const t of tasks){
    const li = document.createElement("li");
    li.className = t.completed ? "completed" : "";
    li.innerHTML = `
      <input type="checkbox" ${t.completed ? "checked disabled" : ""} data-id="${t.id}">
      <span class="desc"></span>
      <button class="btn-del" data-id="${t.id}">Delete</button>
    `;
    li.querySelector(".desc").textContent = t.description;
    els.list.appendChild(li);
  }
}

async function loadTasks(){
  try{
    const data = await fetch(API_BASE).then(json);
    renderTasks(data);
    els.err.textContent = "";
  }catch(e){ els.err.textContent = e.message; }
}

async function addTask(desc){
  const body = { description: String(desc||"").trim() };
  if(!body.description) return;
  els.input.value = "";
  try{
    await fetch(API_BASE, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(body)
    }).then(json);
    await loadTasks();
  }catch(e){ els.err.textContent = e.message; }
}

async function completeTask(id){
  try{ await fetch(`${API_BASE}/${id}/complete`, { method:"PATCH" }).then(json); await loadTasks(); }
  catch(e){ els.err.textContent = e.message; }
}

async function deleteTask(id){
  try{ await fetch(`${API_BASE}/${id}`, { method:"DELETE" }).then(json); await loadTasks(); }
  catch(e){ els.err.textContent = e.message; }
}

// Task list events
els.add.addEventListener("click", () => addTask(els.input.value));
els.input.addEventListener("keydown", e => { if(e.key==="Enter") addTask(els.input.value); });
els.list.addEventListener("click", e => {
  const btn = e.target.closest(".btn-del");
  if (btn) return deleteTask(btn.dataset.id);
  if (e.target.type === "checkbox" && !e.target.disabled) return completeTask(e.target.dataset.id);
});

// Chat UI helpers
function nowTime(){
  const d = new Date();
  return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
function appendMsg(text, who="bot"){
  const wrap = document.createElement("div");
  wrap.className = `msg ${who}`;
  const avatar = document.createElement("div");
  avatar.className = `avatar ${who==="bot"?"bot":""}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = nowTime();

  wrap.appendChild(avatar);
  const col = document.createElement("div");
  col.style.maxWidth = "100%";
  col.appendChild(bubble);
  col.appendChild(meta);
  wrap.appendChild(col);

  if (who === "user") wrap.style.marginLeft = "auto";
  els.chatWindow.appendChild(wrap);
  els.chatWindow.scrollTop = els.chatWindow.scrollHeight;
}
let typingRow = null;
function showTyping(){
  typingRow = document.createElement("div");
  typingRow.className = "msg";
  const avatar = document.createElement("div");
  avatar.className = "avatar bot";
  const bubble = document.createElement("div");
  bubble.className = "bubble typing";
  bubble.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  typingRow.appendChild(avatar);
  const col = document.createElement("div");
  col.appendChild(bubble);
  typingRow.appendChild(col);
  els.chatWindow.appendChild(typingRow);
  els.chatWindow.scrollTop = els.chatWindow.scrollHeight;
}
function hideTyping(){
  if (typingRow && typingRow.parentNode) typingRow.parentNode.removeChild(typingRow);
  typingRow = null;
}

function silverhandQuip(){
  const clean = [
    "Rock 'n' roll. Let's move.",
    "Consider it done, rebel.",
    "Chrome up your act, choom.",
    "Another contract burned."
  ];
  const spicy = [
    "Another day, another corpo chore torched.",
    "Alright, samurai — let’s burn this list.",
    "Marked it. Try not to flatline this time.",
    "Gone. Like Arasaka’s ethics."
  ];
  const pool = PG_MODE ? clean : spicy;
  return pool[Math.floor(Math.random() * pool.length)];
}

function johnnyLine(call, tasks){
  if (!call || !call.function) return "Router glitched. Showing your docket.";
  const fn = call.function;
  const p  = call.parameters || {};
  if (fn === "addTask")       return `Added “${p.description}”. ${silverhandQuip()}`;
  if (fn === "completeTask")  return `Checked off task #${p.task_id}. ${silverhandQuip()}`;
  if (fn === "deleteTask")    return `Deleted task #${p.task_id}. ${silverhandQuip()}`;
  if (fn === "viewTasks") {
    const n = Array.isArray(tasks) ? tasks.length : 0;
    return n === 0
      ? `Your list’s emptier than a corpo promise.`
      : `You’ve got ${n} contract${n>1?"s":""} left. ${silverhandQuip()}`;
  }
  return `Done. ${silverhandQuip()}`;
}

async function chatSend(){
  const text = els.chatInput.value.trim();
  if(!text) return;
  els.chatInput.value = "";
  appendMsg(text, "user");
  showTyping();
  try{
    const data = await fetch("/api/ai", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ text })
    }).then(json);

    if (els.devToggle.checked) {
      els.chatLog.textContent = JSON.stringify(data.call, null, 2) + "\n\n" + (els.chatLog.textContent || "");
    }

    renderTasks(data.tasks || []);
    hideTyping();
    appendMsg(johnnyLine(data.call, data.tasks), "bot");
    els.err.textContent = "";
  }catch(err){
    hideTyping();
    appendMsg("⚠️ AI call failed. Check your key or server logs.", "bot");
    els.err.textContent = err.message || "AI call failed";
  }
}

// Chat events
els.chatSend.addEventListener("click", chatSend);
els.chatInput.addEventListener("keydown", e => { if(e.key==="Enter") chatSend(); });

// Boot
loadTasks();
