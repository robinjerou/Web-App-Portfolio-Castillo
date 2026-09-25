// Dark mode feature
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

if (themeToggle) {
  // Sync the button's state with whatever the <head> script already set,
  // then let clicks flip it from there.
  applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // If the visitor hasn't made an explicit choice yet, keep following
  // their OS-level light/dark setting live.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-explicit')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
 
  // Mark the choice as explicit once the visitor actually clicks the button,
  // so it stops following OS changes after that.
  themeToggle.addEventListener('click', () => {
    localStorage.setItem('theme-explicit', 'true');
  });
}










// Mobile navigation menu toggle
// Opens/closes the nav links on small screens
// where there isn't room for the full menu bar.

const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

// Close the mobile menu automatically after tapping a link,
// so the menu doesn't stay open once navigated.
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});


// Email copy-to-clipboard with "Copied" popup
// ============================================
/*document.querySelectorAll('.email-copy').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // stop it from opening a mail client
    const email = link.dataset.email;
    const popup = link.parentElement.querySelector('.copied-popup');

    navigator.clipboard.writeText(email).then(() => {
      popup.classList.add('show');
      setTimeout(() => {
        popup.classList.remove('show');
      }, 1500);
    });
  });
});*/

// Email tooltip toggle + copy-to-clipboard
/*document.querySelectorAll('.email-copy').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // stop it from opening a mail client

    const email = link.dataset.email;
    const wrapper = link.parentElement;
    const tooltip = wrapper.querySelector('.email-tooltip');
    const popup = wrapper.querySelector('.copied-popup');

    const isActive = tooltip.classList.toggle('show');

    // Only copy + show "Copied" when turning the tooltip ON
    if (isActive) {
      navigator.clipboard.writeText(email).then(() => {
        popup.classList.add('show');
        setTimeout(() => {
          popup.classList.remove('show');
        }, 1500);
      });
    }
  });
});

// Click-to-copy toggle (used for email + phone)
document.querySelectorAll('.copy-toggle').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // stop it from opening mail/dialer app

    const value = link.dataset.copy;
    const wrapper = link.parentElement;
    const tooltip = wrapper.querySelector('.copy-tooltip');
    const popup = wrapper.querySelector('.copied-popup');

    const isActive = tooltip.classList.toggle('show');

    if (isActive) {
      navigator.clipboard.writeText(value).then(() => {
        popup.classList.add('show');
        setTimeout(() => {
          popup.classList.remove('show');
        }, 1500);
      });
    }
  });
});*/

// Click-to-copy toggle (used for email + phone)
// Only one tooltip can be open at a time.
document.querySelectorAll('.copy-toggle').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // stop it from opening mail/dialer app

    const wrapper = link.parentElement;
    const tooltip = wrapper.querySelector('.copy-tooltip');
    const popup = wrapper.querySelector('.copied-popup');
    const wasActive = tooltip.classList.contains('show');

    // Close every other open tooltip/popup first
    document.querySelectorAll('.copy-tooltip.show').forEach((el) => {
      if (el !== tooltip) el.classList.remove('show');
    });
    document.querySelectorAll('.copied-popup.show').forEach((el) => {
      el.classList.remove('show');
    });

    // Now toggle this one based on its state before we touched anything
    if (wasActive) {
      tooltip.classList.remove('show');
    } else {
      tooltip.classList.add('show');
      const value = link.dataset.copy;
      navigator.clipboard.writeText(value).then(() => {
        popup.classList.add('show');
        setTimeout(() => {
          popup.classList.remove('show');
        }, 1500);
      });
    }
  });
});




// Video demo modal (local .mp4 files)
const modal = document.getElementById('video-modal');
const modalPlayer = document.getElementById('video-modal-player');
const modalSource = modalPlayer.querySelector('source');
const modalClose = document.getElementById('video-modal-close');

function openVideoModal(videoSrc) {
  modalSource.src = videoSrc;
  modalPlayer.load();   // tells the browser to pick up the new source
  modalPlayer.play();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  modalPlayer.pause();
  modalSource.src = '';
  modalPlayer.load();
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

document.querySelectorAll('.video-trigger').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openVideoModal(link.dataset.video);
  });
});

modalClose.addEventListener('click', closeVideoModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeVideoModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeVideoModal();
  }
});

// scroll progress bar function
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;

  const scrollPercentage =
    (scrollTop / (documentHeight - windowHeight)) * 100;

  document.getElementById("scroll-progress").style.width =
    scrollPercentage + "%";
});


// flip function
document.querySelectorAll('.flip-toggle').forEach((button) => {
  const card = button.closest('.flip-card');
  const front = card.querySelector('.flip-card-front');
  const back = card.querySelector('.flip-card-back');

  button.addEventListener('click', () => {
    const isFlipped = card.classList.toggle('flipped');
    button.setAttribute('aria-pressed', String(isFlipped));
    button.setAttribute(
      'aria-label',
      isFlipped ? 'Show project details' : 'Show project preview image'
    );

    // Keep whichever face is turned away from the viewer
    // out of the tab order and off screen readers' radar.
    if ('inert' in front) {
      front.inert = isFlipped;
      back.inert = !isFlipped;
    }
  });
});

// If a preview image hasn't been added yet, show a friendly
// placeholder instead of a broken image icon.
document.querySelectorAll('.flip-preview-img').forEach((img) => {
  img.addEventListener(
    'error',
    () => {
      img.classList.add('hidden');
      const placeholder = img.nextElementSibling;
      if (placeholder) placeholder.classList.remove('hidden');
    },
    { once: true }
  );
});





/* mascot function

  MASCOT CHANGE:
  Interactive 3x3 sprite-sheet mascot.


  Features:
  - Follows the cursor with its head
  - Uses the 3x3 direction sprite sheet
  - Click/tap reactions
  - Uses the expression sprite sheet
  - Supports keyboard interaction
  - Respects reduced-motion preferences
  */

(function initPortfolioMascot() {

  const mascot = document.getElementById("portfolio-mascot");

  // If the mascot isn't on the page, don't run anything.
  if (!mascot) return;


  //MASCOT CHANGE: Get the two sprite layers.
  const directionSprite = mascot.querySelector(".mascot-direction");
  const reactionSprite = mascot.querySelector(".mascot-reaction");


  /* 
    MASCOT CHANGE:
    3x3 sprite-sheet positions.

    The sheet is:

      [ NW ] [ N ] [ NE ]
      [  W ] [ C ] [ E  ]
      [ SW ] [ S ] [ SE ]

    Each number is the background-position percentage.
     */

  const directions = {
    NW: "0% 0%",
    N: "50% 0%",
    NE: "100% 0%",

    W: "0% 50%",
    C: "50% 50%",
    E: "100% 50%",

    SW: "0% 100%",
    S: "50% 100%",
    SE: "100% 100%"
  };


  /* 
    MASCOT CHANGE:
    Start with the center-facing sprite.
      */

  directionSprite.style.backgroundPosition = directions.C;


  /* 
    MASCOT CHANGE:
    Convert cursor position into one of 8 directions.

    We compare the cursor position with the center
    of the mascot and determine which direction
    the character should look.
     */

  function updateMascotDirection(event) {

    // Respect devices that don't have a precise pointer.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const rect = mascot.getBoundingClientRect();

    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height / 2;

    const dx = event.clientX - mascotCenterX;
    const dy = event.clientY - mascotCenterY;


    /*
      Ignore tiny cursor movements directly over
      the center of the mascot.
    */
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 15) {
      directionSprite.style.backgroundPosition = directions.C;
      return;
    }


    /*
      Math.atan2 gives us the angle from the mascot
      toward the cursor.

      Convert radians to degrees.
    */
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    /*
      Convert the angle into one of 8 directions.

      Because screen Y increases downward:

        90° = North
        0° = East
        90° = South
        180° = West
    */

    if (angle >= -22.5 && angle < 22.5) {
      directionSprite.style.backgroundPosition = directions.E;

    } else if (angle >= 22.5 && angle < 67.5) {
      directionSprite.style.backgroundPosition = directions.SE;

    } else if (angle >= 67.5 && angle < 112.5) {
      directionSprite.style.backgroundPosition = directions.S;

    } else if (angle >= 112.5 && angle < 157.5) {
      directionSprite.style.backgroundPosition = directions.SW;

    } else if (angle >= 157.5 || angle < -157.5) {
      directionSprite.style.backgroundPosition = directions.W;

    } else if (angle >= -157.5 && angle < -112.5) {
      directionSprite.style.backgroundPosition = directions.NW;

    } else if (angle >= -112.5 && angle < -67.5) {
      directionSprite.style.backgroundPosition = directions.N;

    } else {
      directionSprite.style.backgroundPosition = directions.NE;
    }
  }


  /* 
    MASCOT CHANGE:
    Follow the cursor.

    We use document-level mouse movement so the mascot
    can look toward the cursor even when the cursor is
    outside the mascot itself.
    */

  document.addEventListener("mousemove", updateMascotDirection);


  /* 
    MASCOT CHANGE:
    Expression/reaction handling.
      */

  let reactionTimeout = null;
  let clickCount = 0;
  let clickResetTimeout = null;


  /*
    Expression sprite-sheet positions.

    The exact expressions depend on how the
    "character expressions cursor portfolio.png"
    sheet is arranged.

    This assumes the common 3x3 arrangement used
    by page-mascot-style reaction sheets.

    Able to change these positions later if
    expression sheet has a different arrangement.
  */
  const reactions = {
    CENTER: "50% 50%",

    TOP_LEFT: "0% 0%",
    TOP: "50% 0%",
    TOP_RIGHT: "100% 0%",

    LEFT: "0% 50%",
    RIGHT: "100% 50%",

    BOTTOM_LEFT: "0% 100%",
    BOTTOM: "50% 100%",
    BOTTOM_RIGHT: "100% 100%"
  };


  /* 
    MASCOT CHANGE:
    Show one expression temporarily.
     */

  function showReaction(position, duration = 700) {

    clearTimeout(reactionTimeout);

    reactionSprite.style.backgroundPosition = position;
  

    mascot.classList.add("mascot-reacting");


    reactionTimeout = setTimeout(() => {

      // Switch back to direction sprite
      mascot.classList.remove("mascot-reacting");

    }, duration);
  }


  /* 
    MASCOT CHANGE:
    Click/tap reaction.

    Each click gives the mascot a little squash.

    Rapid repeated clicks eventually trigger a
    different expression.
      */



    /*
    Sound effects (Web Audio API, no audio files needed)
    plus a mute toggle that is remembered between visits.
  */

  let audioCtx = null;
  let soundMuted = false;

  // Load the saved mute choice (wrapped in try/catch in case
  // storage is blocked, e.g. private browsing).
  try {
    soundMuted = localStorage.getItem("mascotMuted") === "true";
  } catch (e) {}

  const soundToggle = document.getElementById("mascot-sound-toggle");

  // Update the icon + accessible label to match the current state.
  function syncSoundButton() {
    if (!soundToggle) return;

    soundToggle.classList.toggle("is-muted", soundMuted);
    soundToggle.setAttribute(
      "aria-label",
      soundMuted ? "Unmute mascot sounds" : "Mute mascot sounds"
    );
  }

  // Browsers keep audio "suspended" until a user gesture,
  // so create/resume the context lazily on first click.
  function getAudioContext() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }

    if (audioCtx.state === "suspended") audioCtx.resume();

    return audioCtx;
  }

  /*
    Play one short tone that slides from freqStart to freqEnd (Hz).

      duration – length in seconds
      type     – "sine" (soft), "triangle" (mellow), "square" (buzzy)
      volume   – 0 to 1 (keep low!)
      delay    – seconds to wait before playing (for multi-note sounds)
  */
  function playTone(freqStart, freqEnd, duration, type = "sine", volume = 0.15, delay = 0) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, start);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, start + duration);

    // Quick fade in/out so it doesn't "click" or pop
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  // One sound per click tier, matching the expressions below.
  function playMascotSound(count) {
    if (soundMuted) return;

    if (count === 1) {
      // soft "boop"
      playTone(520, 780, 0.12, "sine");

    } else if (count === 2) {
      // two-note chirp
      playTone(600, 900, 0.10, "triangle");
      playTone(900, 1200, 0.12, "triangle", 0.15, 0.09);

    } else {
      // silly "bonk" for spam-clicking
      playTone(300, 120, 0.25, "square", 0.08);
    }
  }

  // Mute / unmute button
  if (soundToggle) {
    soundToggle.addEventListener("click", function () {

      soundMuted = !soundMuted;

      try {
        localStorage.setItem("mascotMuted", String(soundMuted));
      } catch (e) {}

      syncSoundButton();

      // Tiny blip when turning sound back on, so you can hear it worked
      if (!soundMuted) playTone(700, 1000, 0.08, "sine", 0.1);
    });
  }

  syncSoundButton();

  function mascotClicked() {

    /*
      Respect reduced-motion settings.
    */
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


    /*
      Squash animation.
    */
    if (!reducedMotion) {

      mascot.classList.remove("mascot-clicked");

      /*
        Force the browser to restart the animation
        when the mascot is clicked repeatedly.
      */
      void mascot.offsetWidth;

      mascot.classList.add("mascot-clicked");
    }


    /*
      Count rapid clicks.
    */
    clickCount++;

    clearTimeout(clickResetTimeout);

    clickResetTimeout = setTimeout(() => {
      clickCount = 0;
    }, 1200);


    playMascotSound(clickCount);


    /*
      Normal click:
      show a center reaction.
    */
    if (clickCount === 1) {

      showReaction(reactions.CENTER, 650);

    /*
      Second quick click:
      show a different expression.
    */
    } else if (clickCount === 2) {

      showReaction(reactions.TOP_RIGHT, 750);

    /*
      Three or more quick clicks:
      use another expression.
    */
    } else {

      showReaction(reactions.BOTTOM_RIGHT, 900);

    }
  }


  /* 
    MASCOT CHANGE:
    Mouse click interaction.
     */

  mascot.addEventListener("click", mascotClicked);


  /* 
    MASCOT CHANGE:
    Keyboard accessibility.

    Enter and Space activate the mascot just like
    clicking it.
    */

  mascot.addEventListener("keydown", function(event) {

    if (event.key === "Enter" || event.key === " ") {

      event.preventDefault();

      mascotClicked();
    }

  });


  /* 
    MASCOT CHANGE:
    When the mouse leaves the browser window,
    return the character to its neutral direction.
     */

  document.addEventListener("mouseleave", function() {

    directionSprite.style.backgroundPosition = directions.C;

  });


  /* 
    MASCOT CHANGE:
    Clean up the click animation class after it ends.
     */

  mascot.addEventListener("animationend", function() {

    mascot.classList.remove("mascot-clicked");

  });

})();


//back-to-top function
const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.remove("hidden");
    } else {
      backToTop.classList.add("hidden");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  
// side bar effect particles function
(function initSideFx() {
 
  const canvas = document.getElementById('side-fx-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const main = document.querySelector('main');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  //CONFIG
  const CONFIG = {
    // Particle colors (R, G, B). Matches the site's blue accent + a touch of cyan.
    colors: [
      [81, 112, 255],
      [63, 92, 224],
      [56, 189, 248]
    ],
    density: 12,        // one particle per this many px of screen height (lower = more)
    minCount: 36,
    maxCount: 120,
    speed: [28, 95],    // px per second (slowest, fastest)
    size: [1.1, 3],     // dot radius range in px
    mobileScale: 0.5,   // fraction of particles on phones
    mobileAlpha: 0.6    // overall opacity on phones
  };
 
  let w = 0, h = 0, dpr = 1;
  let maxTravel = 0;        // how far a particle may drift inward
  let isMobile = false;
  let particles = [];
  let rafId = null;
  let lastTime = 0;
  let clock = 0;

  //Pre-rendered sprites (much cheaper than shadowBlur)
  function makeGlowSprite(rgb) {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(' + rgb + ', 1)');
    grad.addColorStop(0.25, 'rgba(' + rgb + ', 0.55)');
    grad.addColorStop(1, 'rgba(' + rgb + ', 0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  }

  function makeTrailSprite(rgb) {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 4;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 128, 0);
    grad.addColorStop(0, 'rgba(' + rgb + ', 0)');
    grad.addColorStop(1, 'rgba(' + rgb + ', 0.9)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 4);
    return c;
  }

  const glowSprites = CONFIG.colors.map(makeGlowSprite);
  const trailSprites = CONFIG.colors.map(makeTrailSprite);


  //Helpers
  const rand = (min, max) => min + Math.random() * (max - min);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    isMobile = w < 640;

    // Empty space between the screen edge and the content column.
    // Particles fade out by the time they reach the content.
    const gutter = main ? main.getBoundingClientRect().left + 16 : w * 0.25;
    maxTravel = isMobile ? w * 0.22 : Math.max(gutter, w * 0.15);

    // Rebuild the particle pool for the new size
    let count = Math.round(h / CONFIG.density);
    count = Math.max(CONFIG.minCount, Math.min(CONFIG.maxCount, count));
    if (isMobile) count = Math.round(count * CONFIG.mobileScale);

    particles = [];
    for (let i = 0; i < count; i++) {
      const p = {};
      spawn(p, true);
      particles.push(p);
    }

    // With reduced motion, draw one still frame instead of animating
    if (reducedMotion.matches) render();
  }

  // Give a particle fresh starting values.
  // initial = true spreads them along their path so the screen isn't empty at load.
  function spawn(p, initial) {
    const fromLeft = Math.random() < 0.5;
    const r = Math.random();

    p.dir = fromLeft ? 1 : -1;                        // +1 moves right, -1 moves left
    p.startX = fromLeft ? rand(-4, 14) : w - rand(-4, 14);
    p.y = rand(0, h);
    p.travel = maxTravel * rand(0.35, 1);
    p.speed = rand(CONFIG.speed[0], CONFIG.speed[1]);
    p.drift = rand(-9, 5);                            // slight upward bias
    p.amp = rand(0, 9);                               // gentle sideways wobble
    p.freq = rand(0.8, 2.2);
    p.phase = rand(0, Math.PI * 2);
    p.size = rand(CONFIG.size[0], CONFIG.size[1]);
    p.color = Math.floor(Math.random() * CONFIG.colors.length);
    p.kind = r < 0.6 ? 'dot' : r < 0.85 ? 'streak' : 'square';
    p.trail = rand(30, 90);
    p.baseAlpha = rand(0.7, 1);
    p.dist = initial ? rand(0, p.travel) : 0;
  }


  /* ---------- Draw ---------- */
  function render() {
    ctx.clearRect(0, 0, w, h);
    const globalAlpha = isMobile ? CONFIG.mobileAlpha : 1;

    for (const p of particles) {
      const t = p.dist / p.travel;                     // 0 at the edge -> 1 at the end
      const age = p.dist / p.speed;

      const fadeIn = Math.min(1, p.dist / 24);
      // Stay bright for the first third of the trip, then fade out toward the center
      const fadeOut = t < 0.3 ? 1 : Math.pow(1 - (t - 0.3) / 0.7, 1.4);
      const twinkle = 0.78 + 0.22 * Math.sin(clock * 3 + p.phase);
      const alpha = fadeIn * fadeOut * twinkle * p.baseAlpha * globalAlpha;
      if (alpha <= 0.01) continue;

      const x = p.startX + p.dir * p.dist;
      const y = p.y + p.drift * age + Math.sin(age * p.freq + p.phase) * p.amp;

      const glow = glowSprites[p.color];
      const rgb = CONFIG.colors[p.color].join(',');

      if (p.kind === 'streak') {
        // Tron-style light trail behind the head
        const len = p.trail * (0.5 + 0.5 * fadeOut);
        ctx.globalAlpha = alpha * 0.8;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(p.dir, 1);                           // flips the trail for the right side
        ctx.drawImage(trailSprites[p.color], -len, -1, len, 2);
        ctx.restore();
      }

      // Soft glow around the particle
      const gs = p.size * 9;
      ctx.globalAlpha = alpha * 0.9;
      ctx.drawImage(glow, x - gs / 2, y - gs / 2, gs, gs);

      // Solid core
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgb(' + rgb + ')';
      if (p.kind === 'square') {
        const s = p.size * 1.3;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }


  //Animate
  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);   // cap so tab switches don't cause jumps
    lastTime = now;
    clock += dt;

    for (const p of particles) {
      p.dist += p.speed * dt;
      if (p.dist >= p.travel) spawn(p, false);             // recycle at the end of its path
    }

    render();
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId !== null || reducedMotion.matches) return;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }


  //Wire up
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { stop(); render(); } else { start(); }
  });

  resize();
  start();

})();


//Last updated date in footer function
// (function () {
//   var el = document.getElementById('last-updated');
//   if (!el) return;

//   var owner = 'robinjerou';
//   var repo = 'Web-App-Portfolio-Castillo'; // change to the actual repo name if different

//   fetch('https://api.github.com/repos/' + owner + '/' + repo + '/commits?per_page=1')
//     .then(function (res) {
//       if (!res.ok) throw new Error('GitHub API error');
//       return res.json();
//     })
//     .then(function (data) {
//       var dateStr = data[0].commit.committer.date;
//       var date = new Date(dateStr);
//       el.textContent = date.toLocaleDateString('en-US', {
//         year: 'numeric', month: 'long', day: 'numeric'
//       });
//     })
//     .catch(function () {
//       el.textContent = 'recently';
//     });
// })();

(function () {
  var trigger = document.getElementById('last-updated');
  var tooltip = document.getElementById('last-updated-tooltip');
  var list = document.getElementById('last-updated-list');
  if (!trigger || !tooltip || !list) return;

  var owner = 'robinjerou';
  var repo = 'Web-App-Portfolio-Castillo'; // change to the actual repo name if different
  var HISTORY_COUNT = 5; // how many recent commit dates to list in the tooltip

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  fetch('https://api.github.com/repos/' + owner + '/' + repo + '/commits?per_page=' + HISTORY_COUNT)
    .then(function (res) {
      if (!res.ok) throw new Error('GitHub API error');
      return res.json();
    })
    .then(function (data) {
      if (!data.length) throw new Error('No commits found');

      trigger.textContent = formatDate(data[0].commit.committer.date);

      list.innerHTML = '';
      data.forEach(function (commitEntry) {
        var li = document.createElement('li');
        li.textContent = formatDate(commitEntry.commit.committer.date);
        list.appendChild(li);
      });
    })
    .catch(function () {
      trigger.textContent = 'recently';
      list.innerHTML = '<li>No update history available.</li>';
    });

  // Show on hover (desktop) and toggle on click/tap (works everywhere,
  // including touch devices that can't hover)
  function showTooltip() { tooltip.classList.add('show'); }
  function hideTooltip() { tooltip.classList.remove('show'); }

  trigger.addEventListener('mouseenter', showTooltip);
  trigger.addEventListener('mouseleave', hideTooltip);
  trigger.addEventListener('focus', showTooltip);
  trigger.addEventListener('blur', hideTooltip);

  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    tooltip.classList.toggle('show');
  });

  document.addEventListener('click', function (e) {
    if (!tooltip.contains(e.target) && e.target !== trigger) {
      hideTooltip();
    }
  });
})();

// About / Achievements / Certifications carousel
// Arrow buttons + dots switch between the three slides using a fast
// "Flash" style transition: the current slide blur-dashes off in the
// direction of travel while a lightning streak sweeps the panel, then
// the next slide dashes in from the opposite side.
(function initAboutCarousel() {
  const track = document.getElementById('about-track');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.about-slide'));
  const dots = Array.from(document.querySelectorAll('.about-dot'));
  const prevBtn = document.getElementById('about-prev');
  const nextBtn = document.getElementById('about-next');
  const label = document.getElementById('about-panel-label');
  const streak = document.querySelector('.about-carousel .flash-streak');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let current = Math.max(0, slides.findIndex((s) => s.classList.contains('active')));
  let animating = false;

  function setActiveDot(index) {
    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  }

  function finish(index) {
    current = index;
    setActiveDot(index);
    if (label) label.textContent = slides[index].dataset.label || '';
    animating = false;
  }

  function goTo(index, direction) {
    if (animating || index === current || !slides[index]) return;
    animating = true;

    const outgoing = slides[current];
    const incoming = slides[index];
    const outClass = direction === 'next' ? 'flash-out-next' : 'flash-out-prev';
    const inClass = direction === 'next' ? 'flash-in-next' : 'flash-in-prev';

    if (streak) {
      streak.classList.remove('run-next', 'run-prev');
      void streak.offsetWidth; // restart the sweep animation if triggered again quickly
      streak.classList.add(direction === 'next' ? 'run-next' : 'run-prev');
    }

    if (reducedMotion.matches) {
      outgoing.classList.remove('active');
      incoming.classList.add('active');
      finish(index);
      return;
    }

    outgoing.classList.add(outClass);
    outgoing.addEventListener('animationend', function onOut() {
      outgoing.removeEventListener('animationend', onOut);
      outgoing.classList.remove('active', outClass);

      incoming.classList.add('active', inClass);
      incoming.addEventListener('animationend', function onIn() {
        incoming.removeEventListener('animationend', onIn);
        incoming.classList.remove(inClass);
        finish(index);
      }, { once: true });
    }, { once: true });
  }

  function step(delta) {
    const total = slides.length;
    const nextIndex = (current + delta + total) % total;
    goTo(nextIndex, delta > 0 ? 'next' : 'prev');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => step(1));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = Number(dot.dataset.index);
      if (Number.isNaN(target) || target === current) return;
      goTo(target, target > current ? 'next' : 'prev');
    });
  });

  // Left/right arrow key support while the panel has focus
  const carousel = document.querySelector('.about-carousel');
  if (carousel) {
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
  }
})();