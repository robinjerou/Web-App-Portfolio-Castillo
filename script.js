// ============================================
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


  /* 
    MASCOT CHANGE:
    Get the two sprite layers.
      */

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
    reactionSprite.style.opacity = "1";


    reactionTimeout = setTimeout(() => {

      reactionSprite.style.opacity = "0";

    }, duration);
  }


  /* 
    MASCOT CHANGE:
    Click/tap reaction.

    Each click gives the mascot a little squash.

    Rapid repeated clicks eventually trigger a
    different expression.
      */

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

  

  (() => {
  'use strict';

  //Settings
  const CONFIG = {
    timezone: 'Asia/Manila',
    latitude: 14.4081,          // Muntinlupa City
    longitude: 121.0415,
    refreshMinutes: 30,         // how often to ask the API again
    edgeEcho: 0.45,             // 0 = edge matches the centre, 1 = edge shows the fully opposite time
  };

  //Colours: soft, luminous, never harsh.
  //Each moment has 4 colours: [broad base, then three accents].
  //Edit freely, this is the only place that sets the mood.
  //The sunset is the "amber -> coral -> violet -> cobalt" of the
  //reference; the night stays a gentle indigo, never black.
  const PALETTES = {
    night:     ['#2f3585', '#5a52c4', '#7c6dd0', '#c99ac4'],
    predawn:   ['#3f4290', '#7a6cc4', '#c68fb8', '#f2b6a0'],
    sunrise:   ['#f4a58a', '#f7c6a3', '#c8a2d6', '#8fb4ee'],
    morning:   ['#a9d3f7', '#cfe6fb', '#f8e3c7', '#b7c8f0'],
    midday:    ['#7fb8f0', '#a9d6f5', '#c9e8ea', '#8fa6ee'],
    afternoon: ['#8fb6ee', '#b9d5f4', '#f5deb8', '#a89be0'],
    golden:    ['#f2b062', '#f39a76', '#e58aa5', '#8f8fe0'],
    sunset:    ['#ee8d6c', '#e0779a', '#a476cf', '#5b78d8'],
    dusk:      ['#5a55c4', '#8a62c0', '#d2809f', '#3f5fc7'],
  };

  // Small helpers
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const css = (c) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
  for (const k of Object.keys(PALETTES)) PALETTES[k] = PALETTES[k].map(hex);

  // Time in the Philippines 
  const zoneFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: CONFIG.timezone, hourCycle: 'h23',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  });

  function philippineNow() {
    const d = new Date();
    const p = {};
    for (const part of zoneFmt.formatToParts(d)) p[part.type] = part.value;
    const y = +p.year, mo = +p.month, day = +p.day;
    const h = +p.hour % 24, mi = +p.minute, s = +p.second;
    const offset = Math.round((Date.UTC(y, mo - 1, day, h, mi, s) - Math.floor(d.getTime() / 1000) * 1000) / 60000);
    return { y, mo, day, offset, minutes: h * 60 + mi + s / 60 };
  }
 
  // Backup sunrise/sunset calculation (NOAA), used until the API answers
  function solarTimes(now) {
    const doy = Math.floor((Date.UTC(now.y, now.mo - 1, now.day) - Date.UTC(now.y, 0, 0)) / 864e5);
    const g = (TAU / 365) * (doy - 1);
    const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
      - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
      - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
      - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const lat = (CONFIG.latitude * Math.PI) / 180;
    const cosH = Math.cos((90.833 * Math.PI) / 180) / (Math.cos(lat) * Math.cos(decl))
      - Math.tan(lat) * Math.tan(decl);
    const H = (Math.acos(clamp(cosH, -1, 1)) * 180) / Math.PI;
    const wrap = (v) => ((v % 1440) + 1440) % 1440;
    return {
      rise: wrap(720 - 4 * (CONFIG.longitude + H) - eq + now.offset),
      set: wrap(720 - 4 * (CONFIG.longitude - H) - eq + now.offset),
    };
  }

  // Real sun + sky from the Open-Meteo API
  let api = null;   // { rise, set, cloud (0-1), rain (0-1) } once loaded
  const params = new URLSearchParams(location.search);

  const parseHM = (str) => {
    const m = /T(\d\d):(\d\d)/.exec(str || '');
    return m ? +m[1] * 60 + +m[2] : null;
  };

  async function loadSky() {
    try {
      const q = new URLSearchParams({
        latitude: CONFIG.latitude,
        longitude: CONFIG.longitude,
        current: 'cloud_cover,precipitation,weather_code',
        daily: 'sunrise,sunset',
        timezone: CONFIG.timezone,
        forecast_days: 1,
      });
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const c = data.current || {};
      const code = c.weather_code || 0;
      const wet = (c.precipitation || 0) > 0 || (code >= 51 && code <= 99);
      api = {
        rise: parseHM(data.daily && data.daily.sunrise && data.daily.sunrise[0]),
        set: parseHM(data.daily && data.daily.sunset && data.daily.sunset[0]),
        cloud: clamp((c.cloud_cover || 0) / 100),
        rain: wet ? clamp(0.4 + (c.precipitation || 0) / 6, 0, 1) : 0,
      };
      refresh(3000);
    } catch (err) {
      console.warn('[side backgrounds] Could not reach the sky API, using the built-in sun calculation.', err);
    }
    setTimeout(loadSky, CONFIG.refreshMinutes * 60000);
  }
 
  // From "what time is it" to colours
  function paletteAt(t, rise, set) {
    const noon = (rise + set) / 2;
    const P = PALETTES;
    const line = [
      [rise - 100, P.night], [rise - 45, P.predawn], [rise + 5, P.sunrise], [rise + 90, P.morning],
      [noon, P.midday], [set - 120, P.afternoon], [set - 45, P.golden], [set + 5, P.sunset],
      [set + 45, P.dusk], [set + 100, P.night],
    ];
    if (t <= line[0][0] || t >= line[line.length - 1][0]) return P.night;
    let i = 0;
    while (i < line.length - 2 && t >= line[i + 1][0]) i++;
    const [t0, a] = line[i], [t1, b] = line[i + 1];
    const f = smooth(clamp((t - t0) / (t1 - t0)));
    return a.map((c, k) => mix(c, b[k], f));
  }

  // Grey or rainy skies calm the colours down and cool them a little
  function soften(c, cloud, rain) {
    const g = lum(c);
    c = mix(c, [g, g, g], cloud * 0.35);
    c = mix(c, [236, 239, 246], cloud * 0.12);
    return rain ? mix(c, [110, 130, 190], rain * 0.18) : c;
  }

  // 9 colours: 4 for next to the content, 4 for the screen edge, 1 for the blend between
  function targetColours(minutes, rise, set, cloud, rain) {
    const near = paletteAt(minutes, rise, set);
    const opposite = paletteAt((minutes + 720) % 1440, rise, set);
    const edge = near.map((c, i) => mix(c, opposite[i], CONFIG.edgeEcho));
    const soft = (c) => soften(c, cloud, rain);
    const n = near.map(soft), e = edge.map(soft);
    return [...n, ...e, mix(n[1], e[1], 0.5)];
  }

  //Painting (with a gentle fade between colours)
  const root = document.documentElement;
  const NAMES = ['--near-1', '--near-2', '--near-3', '--near-4',
                 '--edge-1', '--edge-2', '--edge-3', '--edge-4', '--side-mid'];
  let shown = null;
  let raf = 0;
 
  const apply = (cols) => cols.forEach((c, i) => root.style.setProperty(NAMES[i], css(c)));
 
  function goTo(next, ms) {
    cancelAnimationFrame(raf);
    if (!shown || !ms) { shown = next; apply(next); return; }
    const from = shown, t0 = performance.now();
    const step = (now) => {
      const f = smooth(clamp((now - t0) / ms));
      shown = from.map((c, i) => mix(c, next[i], f));
      apply(shown);
      if (f < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }


  //view options
  const fixed = /^(\d{1,2}):(\d\d)$/.exec(params.get('sidetime') || '');
  const fixedMinutes = fixed ? (+fixed[1] % 24) * 60 + +fixed[2] : null;
  const demo = params.has('sidedemo');
  const demoStart = performance.now();
  const wxPreview = { cloudy: { cloud: 0.9, rain: 0 }, rain: { cloud: 1, rain: 0.8 }, clear: { cloud: 0, rain: 0 } }[params.get('sidewx')];

  function refresh(ms) {
    const now = philippineNow();
    const sun = api && api.rise != null && api.set != null ? api : solarTimes(now);
    let minutes = now.minutes;
    if (fixedMinutes != null) minutes = fixedMinutes;
    if (demo) minutes = (((performance.now() - demoStart) / 1000) * 36) % 1440;   // 36 min per second
    const sky = wxPreview || api || { cloud: 0.15, rain: 0 };
    goTo(targetColours(minutes, sun.rise, sun.set, sky.cloud, sky.rain), demo ? 0 : ms);
  }

  //Go
  refresh(0);
  if (demo) {
    setInterval(() => refresh(0), 80);
  } else {
    // Light changes slowly, so a check every 30 seconds is plenty
    if (fixedMinutes == null) setInterval(() => refresh(2500), 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(1500); });
    if (!wxPreview) loadSky();
  }
})();