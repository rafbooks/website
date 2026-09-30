const translations={
fa:{eyebrow:"دفترها و لوازم طراحی و نقاشی",title:"نشر رف",lead:"بیشتر از یک دفتر ساده...<br>جایی برای فکرها، ایده‌ها و<br>تمام آنچه در ذهن زیباتان می‌گذرد.",bot:"بات تلگرام",botSub:"با ما در ارتباط باشید",channel:"کانال تلگرام",channelSub:"به کانال ما بپیوندید",musicTitle:"معرفی کوتاه نشر رف",musicSub:"برای آشنایی بیشتر با ما",footer:"با هر صفحه، یک قدم به سمت ایده‌های بزرگ‌تر",notes:"دفترهای یادداشت",design:"دفترهای طراحی",drawing:"دفترهای نقاشی",love:"با عشق برای رویاهایتان ♡"},
ar:{eyebrow:"دفاتر وأدوات التصميم والرسم",title:"نشر رف",lead:"أكثر من مجرد دفتر...<br>مساحة لأفكارك، إلهامك،<br>وكل ما هو جميل في ذهنك.",bot:"بوت تيليجرام",botSub:"تواصل معنا",channel:"قناة تيليجرام",channelSub:"انضم إلى قناتنا",musicTitle:"تعريف قصير بنشر رف",musicSub:"للتعرّف أكثر علينا",footer:"مع كل صفحة، خطوة نحو أفكار أكبر",notes:"دفاتر الملاحظات",design:"دفاتر التصميم",drawing:"دفاتر الرسم",love:"بكل حب لأحلامكم ♡"},
en:{eyebrow:"Notebooks & Art Supplies",title:"Nashr Raf",lead:"More than just a notebook...<br>A place for your thoughts, ideas,<br>and everything beautiful in your mind.",bot:"Telegram Bot",botSub:"Get in touch with us",channel:"Telegram Channel",channelSub:"Join our channel",musicTitle:"A Short Introduction",musicSub:"Get to know Nashr Raf",footer:"With every page, one step toward bigger ideas",notes:"Notebooks",design:"Design Books",drawing:"Sketchbooks",love:"Made with love for your dreams ♡"}
};

const root=document.documentElement;
const toast=document.getElementById("toast");
function setLang(lang){
  const t=translations[lang];
  root.lang=lang; root.dir=lang==="en"?"ltr":"rtl";
  document.querySelectorAll("[data-i18n]").forEach(el=>{if(t[el.dataset.i18n]!=null)el.innerHTML=t[el.dataset.i18n]});
  document.querySelectorAll(".lang").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
  localStorage.setItem("siteLang",lang);
}
document.querySelectorAll(".lang").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
setLang(localStorage.getItem("siteLang")||"fa");

const audio=document.getElementById("audio"), toggle=document.getElementById("musicToggle"), progress=document.getElementById("musicProgress");
let hasVoice=true, autoStarted=false;

audio.addEventListener("error",()=>{hasVoice=false});

async function startVoice(){
  if(!hasVoice || autoStarted) return;
  try{
    await audio.play();
    autoStarted=true;
    toggle.textContent="Ⅱ";
  }catch(e){
    // Some browsers block audible autoplay until the visitor interacts with the page.
  }
}

toggle.addEventListener("click",async()=>{
  if(!hasVoice){
    toast.textContent="فایل voice.mp3 را داخل پوشه assets قرار دهید.";
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),2600);
    return;
  }
  try{
    if(audio.paused){
      await audio.play();
      toggle.textContent="Ⅱ";
    }else{
      audio.pause();
      toggle.textContent="▶";
    }
  }catch(e){}
});

audio.addEventListener("play",()=>toggle.textContent="Ⅱ");
audio.addEventListener("pause",()=>toggle.textContent="▶");
audio.addEventListener("ended",()=>toggle.textContent="▶");
audio.addEventListener("timeupdate",()=>{
  if(audio.duration) progress.style.width=(audio.currentTime/audio.duration*100)+"%";
});

// Start the promotional voice about 4.5 seconds after page load.
// It keeps playing until the visitor pauses it or the voice reaches its natural end.
window.addEventListener("load",()=>setTimeout(startVoice,4500));

