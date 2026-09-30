document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  const audio = document.getElementById("rafAudio");
  const play = document.querySelector(".play-button");
  const progress = document.querySelector(".audio-progress i");

  if (audio && play) {
    play.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          await audio.play();
          play.textContent = "Ⅱ";
        } catch (_) {
          play.textContent = "▶";
        }
      } else {
        audio.pause();
        play.textContent = "▶";
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      }
    });

    audio.addEventListener("ended", () => {
      play.textContent = "▶";
      progress.style.width = "0%";
    });
  }

  // Subtle reveal animation without a library.
  const revealItems = document.querySelectorAll(".product-card, .manifesto-grid, .sound-content, .contact-grid");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity .7s ease, transform .7s ease";
    observer.observe(el);
  });

  const style = document.createElement("style");
  style.textContent = ".revealed{opacity:1!important;transform:translateY(0)!important}";
  document.head.appendChild(style);
});
