// ===================== ساعت و تاریخ زنده =====================
function toFa(n) {
  return String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function updateClock() {
  const now = new Date();
  const tehran = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tehran" }));

  // ساعت
  const h = String(tehran.getHours()).padStart(2, "0");
  const m = String(tehran.getMinutes()).padStart(2, "0");
  const s = String(tehran.getSeconds()).padStart(2, "0");
  document.getElementById("clockTime").textContent = toFa(`${h}:${m}:${s}`);

  // تاریخ میلادی
  const gOptions = { year: "numeric", month: "numeric", day: "numeric" };
  const gDate = tehran.toLocaleDateString("en-CA", gOptions); // 2025-09-30
  document.getElementById("gregorianDate").textContent = gDate;

  // تاریخ شمسی
  try {
    const jDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(tehran);
    document.getElementById("jalaliDate").textContent = jDate;
  } catch {
    document.getElementById("jalaliDate").textContent = "—";
  }
}

updateClock();
setInterval(updateClock, 1000);

// ===================== پخش صدا =====================
const audio = document.getElementById("rafAudio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playIcon.textContent = "⏸";
  } else {
    audio.pause();
    playIcon.textContent = "▶";
  }
});

audio.addEventListener("ended", () => {
  playIcon.textContent = "▶";
});

// ===================== نقاشی =====================
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
const fxCanvas = document.getElementById("fxCanvas");
const fxCtx = fxCanvas.getContext("2d");

let drawing = false;
let currentColor = "#e74c3c";
let isEraser = false;
let brushSize = 4;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// انتخاب رنگ
document.querySelectorAll(".colors button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".colors button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentColor = btn.dataset.color;
    isEraser = false;
  });
});

document.getElementById("eraserBtn").addEventListener("click", () => {
  isEraser = true;
});

document.getElementById("clearBtn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// شروع نقاشی
function startDraw(e) {
  drawing = true;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  spawnParticles(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  const pos = getPos(e);
  ctx.lineWidth = isEraser ? 20 : brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = isEraser ? "#fdf8f3" : currentColor;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function stopDraw() {
  drawing = false;
  ctx.beginPath();
}

function getPos(e) {
  if (e.touches) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseout", stopDraw);

canvas.addEventListener("touchstart", (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
canvas.addEventListener("touchmove", (e) => { e.preventDefault(); draw(e); }, { passive: false });
canvas.addEventListener("touchend", stopDraw);

// ===================== پاشیدن رنگ =====================
const particles = [];

function spawnParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1,
      color: ["#e74c3c", "#f39c12", "#3498db", "#27ae60", "#9b59b6", "#e91e63"][Math.floor(Math.random() * 6)],
      size: 2 + Math.random() * 4
    });
  }
}

function animateParticles() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.life -= 0.02;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    fxCtx.globalAlpha = p.life;
    fxCtx.fillStyle = p.color;
    fxCtx.beginPath();
    fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fxCtx.fill();
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===================== قلم‌موی موس =====================
const brush = document.createElement("div");
brush.className = "brush-cursor";
brush.textContent = "🖌️";
document.body.appendChild(brush);

document.addEventListener("mousemove", (e) => {
  brush.style.left = e.clientX + "px";
  brush.style.top = e.clientY + "px";
});
