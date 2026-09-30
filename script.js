document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     MOBILE MENU
  ===================================================== */

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


  /* =====================================================
     AUDIO PLAYER
  ===================================================== */

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

      if (audio.duration && progress) {
        progress.style.width =
          `${(audio.currentTime / audio.duration) * 100}%`;
      }

    });

    audio.addEventListener("ended", () => {

      play.textContent = "▶";

      if (progress) {
        progress.style.width = "0%";
      }

    });
  }


  /* =====================================================
     REVEAL ANIMATION
  ===================================================== */

  const revealItems = document.querySelectorAll(
    ".product-card, .manifesto-grid, .sound-content, .contact-grid"
  );

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver((entries, obs) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);

      });

    }, {
      threshold: 0.12
    });

    revealItems.forEach(el => {

      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition =
        "opacity .7s ease, transform .7s ease";

      observer.observe(el);

    });

    const style = document.createElement("style");

    style.textContent = `
      .revealed{
        opacity:1!important;
        transform:translateY(0)!important;
      }
    `;

    document.head.appendChild(style);

  } else {

    revealItems.forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });

  }


  /* =====================================================
     TEHRAN DATE / TIME
  ===================================================== */

  const persianDateEl = document.getElementById("rafPersianDate");
  const gregorianDateEl = document.getElementById("rafGregorianDate");
  const tehranTimeEl = document.getElementById("rafTehranTime");

  function updateRafDateTime() {

    const now = new Date();

    try {

      const persianDate = new Intl.DateTimeFormat(
        "fa-IR-u-ca-persian",
        {
          timeZone: "Asia/Tehran",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      ).format(now);

      const gregorianDate = new Intl.DateTimeFormat(
        "en-GB",
        {
          timeZone: "Asia/Tehran",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      ).format(now);

      const tehranTime = new Intl.DateTimeFormat(
        "fa-IR",
        {
          timeZone: "Asia/Tehran",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }
      ).format(now);

      if (persianDateEl) {
        persianDateEl.textContent = persianDate;
      }

      if (gregorianDateEl) {
        gregorianDateEl.textContent = gregorianDate;
      }

      if (tehranTimeEl) {
        tehranTimeEl.textContent = tehranTime;
      }

    } catch (error) {

      if (tehranTimeEl) {
        tehranTimeEl.textContent =
          now.toLocaleTimeString("fa-IR");
      }

    }
  }

  updateRafDateTime();

  setInterval(updateRafDateTime, 1000);


  /* =====================================================
     COLOR SPLASH ON CLICK
  ===================================================== */

  const splashColors = [
    "#e53935",
    "#f4c20d",
    "#1976d2",
    "#43a047",
    "#8e44ad",
    "#ec407a",
    "#17130f",
    "#e67e22"
  ];

  let lastSplashTime = 0;

  function createColorSplash(x, y) {

    const now = performance.now();

    /*
      محدود کردن تعداد افکت‌ها برای سبک ماندن سایت
    */
    if (now - lastSplashTime < 90) {
      return;
    }

    lastSplashTime = now;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 9; i++) {

      const particle = document.createElement("span");

      particle.className = "color-splash";

      const angle =
        Math.random() * Math.PI * 2;

      const distance =
        18 + Math.random() * 48;

      const size =
        3 + Math.random() * 6;

      particle.style.left =
        `${x - size / 2}px`;

      particle.style.top =
        `${y - size / 2}px`;

      particle.style.width =
        `${size}px`;

      particle.style.height =
        `${size}px`;

      particle.style.background =
        splashColors[
          Math.floor(
            Math.random() * splashColors.length
          )
        ];

      particle.style.setProperty(
        "--dx",
        `${Math.cos(angle) * distance}px`
      );

      particle.style.setProperty(
        "--dy",
        `${Math.sin(angle) * distance}px`
      );

      fragment.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 700);
    }

    document.body.appendChild(fragment);
  }


  /*
    افکت روی کلیک‌های معمول صفحه
    اما روی دکمه‌های ابزار نقاشی اجرا نمی‌شود.
  */

  document.addEventListener("click", event => {

    if (
      event.target.closest(
        ".paint-panel, .paint-launcher, .menu-toggle"
      )
    ) {
      return;
    }

    createColorSplash(
      event.clientX,
      event.clientY
    );

  });


  /* =====================================================
     SUBTLE BRUSH TRAIL
  ===================================================== */

  let lastTrailTime = 0;

  document.addEventListener("mousemove", event => {

    /*
      روی موبایل mousemove نداریم.
      همچنین افکت هر چند میلی‌ثانیه یک بار ساخته می‌شود
      تا تعداد المان‌ها زیاد نشود.
    */

    const now = performance.now();

    if (now - lastTrailTime < 55) {
      return;
    }

    lastTrailTime = now;

    /*
      وقتی پنل نقاشی باز است، رد قلم‌مو بیرون آن ساخته شود
      تا مزاحم نقاشی نباشد.
    */

    const paintPanel =
      document.getElementById("paintPanel");

    if (
      paintPanel &&
      paintPanel.classList.contains("open") &&
      event.target.closest(".paint-panel")
    ) {
      return;
    }

    const trail =
      document.createElement("span");

    trail.className = "brush-trail";

    trail.style.left =
      `${event.clientX - 2}px`;

    trail.style.top =
      `${event.clientY - 2}px`;

    trail.style.setProperty(
      "--trail-color",
      splashColors[
        Math.floor(
          Math.random() * splashColors.length
        )
      ]
    );

    document.body.appendChild(trail);

    setTimeout(() => {
      trail.remove();
    }, 500);

  });


  /* =====================================================
     PAINTING NOTEBOOK
  ===================================================== */

  const paintLauncher =
    document.getElementById("paintLauncher");

  const paintPanel =
    document.getElementById("paintPanel");

  const paintClose =
    document.getElementById("paintClose");

  const canvas =
    document.getElementById("paintCanvas");

  const canvasWrap =
    document.querySelector(".canvas-wrap");

  const brushSize =
    document.getElementById("brushSize");

  const eraserBtn =
    document.getElementById("eraserBtn");

  const clearCanvas =
    document.getElementById("clearCanvas");

  const colorButtons =
    document.querySelectorAll(".paint-color");


  if (
    paintLauncher &&
    paintPanel &&
    paintClose &&
    canvas &&
    canvasWrap
  ) {

    const ctx = canvas.getContext("2d", {
      alpha: false
    });

    let currentColor = "#e53935";
    let currentSize = 6;
    let erasing = false;
    let drawing = false;

    let lastX = 0;
    let lastY = 0;


    /* -----------------------------------------------
       CANVAS SIZE
    ----------------------------------------------- */

    function resizeCanvas(keepDrawing = true) {

      const rect =
        canvasWrap.getBoundingClientRect();

      if (
        rect.width <= 0 ||
        rect.height <= 0
      ) {
        return;
      }

      let oldCanvas = null;

      if (
        keepDrawing &&
        canvas.width > 0 &&
        canvas.height > 0
      ) {

        oldCanvas =
          document.createElement("canvas");

        oldCanvas.width =
          canvas.width;

        oldCanvas.height =
          canvas.height;

        const oldCtx =
          oldCanvas.getContext("2d");

        oldCtx.drawImage(
          canvas,
          0,
          0
        );
      }

      const ratio =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );

      canvas.width =
        Math.floor(rect.width * ratio);

      canvas.height =
        Math.floor(rect.height * ratio);

      canvas.style.width =
        `${rect.width}px`;

      canvas.style.height =
        `${rect.height}px`;

      ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
      );

      ctx.fillStyle = "#ffffff";

      ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
      );

      if (oldCanvas) {

        ctx.drawImage(
          oldCanvas,
          0,
          0,
          oldCanvas.width,
          oldCanvas.height,
          0,
          0,
          rect.width,
          rect.height
        );
      }
    }


    /* -----------------------------------------------
       OPEN / CLOSE
    ----------------------------------------------- */

    function openPaintPanel() {

      paintPanel.classList.add("open");

      paintPanel.setAttribute(
        "aria-hidden",
        "false"
      );

      setTimeout(() => {
        resizeCanvas(true);
      }, 80);
    }


    function closePaintPanel() {

      paintPanel.classList.remove("open");

      paintPanel.setAttribute(
        "aria-hidden",
        "true"
      );
    }


    paintLauncher.addEventListener(
      "click",
      openPaintPanel
    );

    paintClose.addEventListener(
      "click",
      closePaintPanel
    );


    /* -----------------------------------------------
       COLORS
    ----------------------------------------------- */

    colorButtons.forEach(button => {

      button.addEventListener("click", () => {

        currentColor =
          button.dataset.color ||
          "#17130f";

        erasing = false;

        if (eraserBtn) {
          eraserBtn.classList.remove("active");
        }

        colorButtons.forEach(btn => {
          btn.classList.remove("active");
        });

        button.classList.add("active");

      });

    });


    /* -----------------------------------------------
       BRUSH SIZE
    ----------------------------------------------- */

    if (brushSize) {

      brushSize.addEventListener(
        "input",
        () => {

          currentSize =
            Number(brushSize.value) || 6;

        }
      );

    }


    /* -----------------------------------------------
       ERASER
    ----------------------------------------------- */

    if (eraserBtn) {

      eraserBtn.addEventListener(
        "click",
        () => {

          erasing = !erasing;

          eraserBtn.classList.toggle(
            "active",
            erasing
          );

        }
      );

    }


    /* -----------------------------------------------
       CLEAR CANVAS
    ----------------------------------------------- */

    if (clearCanvas) {

      clearCanvas.addEventListener(
        "click",
        () => {

          const rect =
            canvas.getBoundingClientRect();

          ctx.save();

          ctx.fillStyle = "#ffffff";

          ctx.fillRect(
            0,
            0,
            rect.width,
            rect.height
          );

          ctx.restore();

        }
      );

    }


    /* -----------------------------------------------
       DRAWING FUNCTIONS
    ----------------------------------------------- */

    function getCanvasPosition(event) {

      const rect =
        canvas.getBoundingClientRect();

      let clientX;
      let clientY;

      if (
        event.touches &&
        event.touches.length
      ) {

        clientX =
          event.touches[0].clientX;

        clientY =
          event.touches[0].clientY;

      } else {

        clientX =
          event.clientX;

        clientY =
          event.clientY;

      }

      return {
        x:clientX - rect.left,
        y:clientY - rect.top
      };
    }


    function startDrawing(event) {

      event.preventDefault();

      drawing = true;

      const position =
        getCanvasPosition(event);

      lastX = position.x;
      lastY = position.y;

      /*
        برای یک کلیک/ضربه بدون حرکت هم
        یک نقطه کوچک رسم می‌کنیم.
      */

      drawDot(
        lastX,
        lastY
      );
    }


    function drawDot(x, y) {

      ctx.save();

      ctx.globalCompositeOperation =
        erasing
          ? "destination-out"
          : "source-over";

      ctx.fillStyle =
        currentColor;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        currentSize / 2,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }


    function draw(event) {

      if (!drawing) {
        return;
      }

      event.preventDefault();

      const position =
        getCanvasPosition(event);

      const x = position.x;
      const y = position.y;

      ctx.save();

      ctx.globalCompositeOperation =
        erasing
          ? "destination-out"
          : "source-over";

      ctx.strokeStyle =
        currentColor;

      ctx.lineWidth =
        currentSize;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();

      ctx.moveTo(
        lastX,
        lastY
      );

      ctx.lineTo(
        x,
        y
      );

      ctx.stroke();

      ctx.restore();

      lastX = x;
      lastY = y;
    }


    function stopDrawing() {

      drawing = false;

    }


    /* -----------------------------------------------
       MOUSE
    ----------------------------------------------- */

    canvas.addEventListener(
      "mousedown",
      startDrawing
    );

    canvas.addEventListener(
      "mousemove",
      draw
    );

    canvas.addEventListener(
      "mouseup",
      stopDrawing
    );

    canvas.addEventListener(
      "mouseleave",
      stopDrawing
    );


    /* -----------------------------------------------
       TOUCH
    ----------------------------------------------- */

    canvas.addEventListener(
      "touchstart",
      startDrawing,
      { passive:false }
    );

    canvas.addEventListener(
      "touchmove",
      draw,
      { passive:false }
    );

    canvas.addEventListener(
      "touchend",
      stopDrawing,
      { passive:false }
    );


    /* -----------------------------------------------
       RESIZE
    ----------------------------------------------- */

    let resizeTimer;

    window.addEventListener(
      "resize",
      () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

          if (
            paintPanel.classList.contains("open")
          ) {
            resizeCanvas(true);
          }

        }, 150);

      }
    );

  }

});
