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
    manifesto: "ما نسل تازه‌ایم.\nدیگر همه‌چیز قرار نیست پشت ویترین یک سایت بماند.\n\nما دفترهای طراحی‌مان را جایی می‌بریم که زنده‌تر است،\nنزدیک‌تر است و هر روز با ما نفس می‌کشد.\n\nدر کانال تلگرام نشر رف می‌توانی دفترها را از نزدیک ببینی؛\nصفحه‌ها، کاغذ، رنگ‌ها، جزئیات و حال‌وهوای واقعی هر طراحی را ورق بزنی؛\nحتی قبل از اینکه تصمیم به خرید بگیری.\n\nو وقتی دفتر مورد علاقه‌ات را پیدا کردی،\nلازم نیست از اینجا به جای دیگری بروی.\n\nربات تلگرامی نشر رف برای همینجاست؛\nبرای دیدن محصولات، انتخاب، سفارش و خرید،\nساده و مستقیم، درست در همان جایی که دفترهایت را پیدا کرده‌ای.\n\nما فقط کتاب و دفتر طراحی نمی‌فروشیم؛\nداریم شیوه‌ی تازه‌ای برای دیدن، انتخاب کردن و خریدن می‌سازیم.\n\nسایت، ویترین ماست.\nکانال، دفتر طراحی ماست.\nو ربات، راه خرید شماست.\n\nبه دنیای تازه‌ی نشر رف خوش آمدید.",
    btn_channel: "کانال تلگرام",
    btn_bot: "ربات تلگرام",
    btn_manager: "ارتباط با مدیر",
    play: "شنیدن از نشر رف",
    eraser: "پاک‌کن",
    clear: "پاک کردن همه",
    hint: "با قلم‌مو روی صفحه نقاشی کن • هر کلیک رنگ می‌پاشد",
    credit: "مدیریت نشر رف — دکتر کیوان خلیل‌نژاد",
    dir: "rtl",
    langName: "فارسی",
    whatsappMsg: "با سلام و احترام\nاز طریق وب‌سایت رسمی نشر رف (rafbooks.ir) با شما در ارتباط هستم.\nپیام بنده در خصوص محصولات دفتر طراحی و نقاشی می‌باشد."
  },
  en: {
    subtitle: "Design & Painting Notebooks",
    title: "Notebooks for seeing, drawing and lasting",
    desc: "Notebooks for capturing moments, practicing creativity, and walking with ideas until they take their most lasting form.",
    manifesto: "We are a new generation.\nNot everything is meant to stay behind a website showcase.\n\nWe take our design notebooks somewhere more alive,\ncloser, and breathing with us every day.\n\nIn the Raf Publishing Telegram channel, you can see the notebooks up close;\nflip through the pages, the paper, the colors, the details and the real atmosphere of each design;\neven before you decide to buy.\n\nAnd when you find the notebook you love,\nyou don’t need to go anywhere else.\n\nThe Raf Publishing Telegram bot is right here;\nfor browsing products, choosing, ordering and buying,\nsimple and direct, exactly where you discovered your notebooks.\n\nWe don’t just sell books and design notebooks;\nwe are creating a new way of seeing, choosing and buying.\n\nThe website is our showcase.\nThe channel is our design studio.\nAnd the bot is your path to purchase.\n\nWelcome to the new world of Raf Publishing.",
    btn_channel: "Telegram Channel",
    btn_bot: "Telegram Bot",
    btn_manager: "Contact Manager",
    play: "Listen to Raf",
    eraser: "Eraser",
    clear: "Clear All",
    hint: "Paint on the page with the brush • each click splatters color",
    credit: "Raf Publishing — Dr. Keyvan Khalilnejad",
    dir: "ltr",
    langName: "English",
    whatsappMsg: "Hello\nI am contacting you via the official website of Raf Publishing (rafbooks.ir).\nMy message is regarding your design and painting notebooks."
  },
  ar: {
    subtitle: "دفاتر التصميم والرسم",
    title: "دفاتر للرؤية والرسم والبقاء",
    desc: "دفاتر لتسجيل اللحظات، وممارسة الإبداع، ومرافقة الأفكار حتى تأخذ أكثر أشكالها ديمومة.",
    manifesto: "نحن جيل جديد.\nلم يعد كل شيء مضطراً أن يبقى خلف واجهة موقع إلكتروني.\n\nنأخذ دفاتر التصميم الخاصة بنا إلى مكان أكثر حياةً،\nأقرب إلينا، ويتنفس معنا كل يوم.\n\nفي قناة تليجرام نشر رف يمكنك رؤية الدفاتر عن قرب؛\nتصفح الصفحات، والورق، والألوان، والتفاصيل، والأجواء الحقيقية لكل تصميم؛\nحتى قبل أن تقرر الشراء.\n\nوعندما تجد الدفتر الذي تحبه،\nلست بحاجة إلى الذهاب إلى مكان آخر.\n\nبوت تليجرام نشر رف موجود لهذا الغرض؛\nلتصفح المنتجات، والاختيار، والطلب، والشراء،\nببساطة ومباشرة، في نفس المكان الذي اكتشفت فيه دفاترك.\n\nنحن لا نبيع الكتب ودفاتر التصميم فحسب؛\nبل نصنع طريقة جديدة للرؤية والاختيار والشراء.\n\nالموقع هو واجهتنا.\nالقناة هي مرسمنا.\nوالبوت هو طريقك للشراء.\n\nمرحباً بكم في عالم نشر رف الجديد.",
    btn_channel: "قناة تليجرام",
    btn_bot: "بوت تليجرام",
    btn_manager: "التواصل مع المدير",
    play: "الاستماع إلى رف",
    eraser: "ممحاة",
    clear: "مسح الكل",
    hint: "ارسم على الصفحة بالفرشاة • كل نقرة ترش اللون",
    credit: "إدارة نشر رف — الدكتور كيوان خليل نجاد",
    dir: "rtl",
    langName: "العربية",
    whatsappMsg: "السلام عليكم ورحمة الله\nأتواصل معكم عبر الموقع الرسمي لنشر رف (rafbooks.ir).\nرسالتي بخصوص منتجات دفاتر التصميم والرسم."
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
    if (t[key]) {
      el.innerText = t[key];
    }
  });

  langBtn.textContent = t.langName;
  localStorage.setItem("raf_lang", lang);

  // آپدیت لینک واتساپ
  const managerBtn = document.querySelector(".btn-manager");
  if (managerBtn) {
    const phone = "989121455751";
    const encodedMsg = encodeURIComponent(t.whatsappMsg);
    managerBtn.href = `https://wa.me/${phone}?text=${encodedMsg}`;
  }
}

const savedLang = localStorage.getItem("raf_lang") || "fa";
setLanguage(savedLang);
