// ===================== ساعت و تاریخ زنده =====================
function toFa(n) {
  return String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function updateClock() {
  const now = new Date();
  const tehran = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tehran" }));

  const h = String(tehran.getHours()).padStart(2, "0");
  const m = String(tehran.getMinutes()).padStart(2, "0");
  const s = String(tehran.getSeconds()).padStart(2, "0");
  document.getElementById("clockTime").textContent = toFa(`${h}:${m}:${s}`);

  const gDate = tehran.toLocaleDateString("en-CA");
  document.getElementById("gregorianDate").textContent = gDate;

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
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => { playIcon.textContent = "⏸"; })
        .catch(() => {
          alert("صدا پخش نشد. مطمئن شوید فایل assets/voice.mp3 وجود دارد.");
        });
    }
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

document.querySelectorAll(".colors button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".colors button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentColor = btn.dataset.color;
    isEraser = false;
    brush.textContent = "🖌️";
    brush.style.fontSize = "24px";
  });
});

document.getElementById("eraserBtn").addEventListener("click", () => {
  isEraser = true;
  brush.textContent = "🧽";
  brush.style.fontSize = "26px";
});

document.getElementById("clearBtn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

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
  ctx.lineWidth = isEraser ? 22 : brushSize;
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
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseout", stopDraw);
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
canvas.addEventListener("touchmove", (e) => { e.preventDefault(); draw(e); }, { passive: false });
canvas.addEventListener("touchend", stopDraw);

// پاشیدن رنگ
const particles = [];
function spawnParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x, y,
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

// قلم‌مو / پاک‌کن
const brush = document.createElement("div");
brush.className = "brush-cursor";
brush.textContent = "🖌️";
document.body.appendChild(brush);
document.addEventListener("mousemove", (e) => {
  brush.style.left = e.clientX + "px";
  brush.style.top = e.clientY + "px";
});

// ===================== چندزبانه =====================
const translations = {
  fa: {
    subtitle: "دفترهای طراحی و نقاشی",
    title: "دفترهایی برای دیدن، کشیدن و ماندن",
    desc: "دفترهایی برای ثبت لحظه‌ها، تمرین خلاقیت و همراهی در مسیر ایده‌ها تا ماندگارترین شکل ممکن.",
    btn_channel: "کانال تلگرام",
    btn_bot: "ربات تلگرام",
    btn_manager: "ارتباط با مدیر",
    play: "شنیدن از نشر رف",
    hint: "با قلم‌مو روی صفحه نقاشی کن • هر کلیک رنگ می‌پاشد",
    credit: "مدیریت نشر رف — دکتر کیوان خلیل‌نژاد",
    dir: "rtl",
    langName: "فارسی"
  },
  en: {
    subtitle: "Design & Painting Notebooks",
    title: "Notebooks for seeing, drawing and lasting",
    desc: "Notebooks for capturing moments, practicing creativity, and walking with ideas until they take their most lasting form.",
    btn_channel: "Telegram Channel",
    btn_bot: "Telegram Bot",
    btn_manager: "Contact Manager",
    play: "Listen to Raf",
    hint: "Paint on the page with the brush • each click splatters color",
    credit: "Raf Publishing — Dr. Keyvan Khalilnejad",
    dir: "ltr",
    langName: "English"
  },
  ar: {
    subtitle: "دفاتر التصميم والرسم",
    title: "دفاتر للرؤية والرسم والبقاء",
    desc: "دفاتر لتسجيل اللحظات، وممارسة الإبداع، ومرافقة الأفكار حتى تأخذ أكثر أشكالها ديمومة.",
    btn_channel: "قناة تليجرام",
    btn_bot: "بوت تليجرام",
    btn_manager: "التواصل مع المدير",
    play: "الاستماع إلى رف",
    hint: "ارسم على الصفحة بالفرشاة • كل نقرة ترش اللون",
    credit: "إدارة نشر رف — الدكتور كيوان خليل نجاد",
    dir: "rtl",
    langName: "العربية"
  }
};

const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");

langBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  langMenu.classList.toggle("show");
});
document.addEventListener("click", () => {
  langMenu.classList.remove("show");
});
langMenu.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
    langMenu.classList.remove("show");
  });
});

function setLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  document.documentElement.lang = lang;
  document.documentElement.dir = t.dir;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
  langBtn.textContent = t.langName;
  localStorage.setItem("raf_lang", lang);
}

const savedLang = localStorage.getItem("raf_lang") || "fa";
setLanguage(savedLang);
