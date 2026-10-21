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

const modalPanel = modal.querySelector('.video-modal-panel');

function openVideoModal(videoSrc) {
  modalSource.src = videoSrc;
  modalPlayer.load();   // tells the browser to pick up the new source

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';

  // Force a reflow so the browser registers the starting (closed) state
  // before we add modal-open — otherwise it jumps straight to open
  // instead of transitioning smoothly, like an app launching in.
  void modal.offsetWidth;

  requestAnimationFrame(() => {
    modal.classList.add('modal-open');
  });

  modalPlayer.play();
}

function closeVideoModal() {
  modal.classList.remove('modal-open');
  modalPlayer.pause();

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    modalSource.src = '';
    modalPlayer.load();
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  // Wait for the closing animation to finish before actually hiding it,
  // with a fallback timeout in case the transition never fires.
  modalPanel.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, 400);
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

//open new tab function
(function initLinkConfirm() {
  const modal = document.getElementById('link-modal');
  if (!modal) return;

  const panel = modal.querySelector('.link-modal-panel');
  const targetLabel = document.getElementById('link-modal-target');
  const cancelBtn = document.getElementById('link-modal-cancel');
  const confirmBtn = document.getElementById('link-modal-confirm');

  let pendingUrl = null;

  function labelFor(url) {
    try {
      const parsed = new URL(url, window.location.href);
      if (parsed.origin === window.location.origin) {
        // Same-site file (e.g. résumé) — show the filename, not the domain.
        const file = decodeURIComponent(parsed.pathname.split('/').pop() || '');
        return file || parsed.hostname;
      }
      return parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      return url;
    }
  }

  function openLinkModal(url) {
    pendingUrl = url;
    targetLabel.textContent = labelFor(url);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Reflow before animating in, same trick as the video modal.
    void modal.offsetWidth;
    requestAnimationFrame(() => modal.classList.add('modal-open'));

    confirmBtn.focus();
  }

  function closeLinkModal() {
    modal.classList.remove('modal-open');

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      pendingUrl = null;
    };

    panel.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 350); // fallback in case transitionend doesn't fire
  }

  document.querySelectorAll('a.link-confirm').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openLinkModal(link.href);
    });
  });

  confirmBtn.addEventListener('click', () => {
    if (pendingUrl) window.open(pendingUrl, '_blank', 'noopener,noreferrer');
    closeLinkModal();
  });

  cancelBtn.addEventListener('click', closeLinkModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLinkModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeLinkModal();
    }
  });
})();


// Achievements & certifications — each title toggles a document card open
(function initCertPanels() {
  const toggles = document.querySelectorAll('.cert-toggle');
  if (!toggles.length) return;

  toggles.forEach((btn) => {
    const panelId = btn.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('is-open', !isOpen);
    });
  });
})();

//tap to zoom viewer function
(function initZoomViewer() {
  const viewer = document.getElementById('zoom-viewer');
  if (!viewer) return;

  const stage = document.getElementById('zoom-viewer-stage');
  const img = document.getElementById('zoom-viewer-img');
  const closeBtn = document.getElementById('zoom-viewer-close');
  const hint = viewer.querySelector('.zoom-viewer-hint');

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;

  let sourceEl = null;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isOpen = false;

  function applyTransform(animated) {
    stage.style.transition = animated
      ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      : 'none';
    stage.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function clampPan() {
    const rect = stage.getBoundingClientRect();
    const maxX = Math.max(0, (rect.width * scale - rect.width) / 2 / scale);
    const maxY = Math.max(0, (rect.height * scale - rect.height) / 2 / scale);
    panX = Math.min(maxX, Math.max(-maxX, panX));
    panY = Math.min(maxY, Math.max(-maxY, panY));
  }

  function resetZoom(animated) {
    scale = 1;
    panX = 0;
    panY = 0;
    applyTransform(animated);
  }

  function morphFrom(rectEl) {
    const from = rectEl.getBoundingClientRect();
    const to = stage.getBoundingClientRect();
    const scaleFactor = from.width / to.width;
    const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${scaleFactor})`;
  }

  //for document file zoom
  const pdfFrame = document.createElement('iframe');
  pdfFrame.className = 'zoom-viewer-pdf';
  pdfFrame.title = 'Document preview';
  viewer.insertBefore(pdfFrame, hint);

  function openPdf(frame) {
    const base = (frame.getAttribute('src') || '').split('#')[0];
    if (!base) return;

    sourceEl = null;
    viewer.dataset.mode = 'pdf';
    pdfFrame.title = frame.title || 'Document preview';
    pdfFrame.src = base + '#toolbar=1&navpanes=0&view=FitH';

    viewer.classList.remove('hidden');
    viewer.classList.add('flex');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    hint.textContent = 'Use the PDF controls to zoom · click outside to close';

    requestAnimationFrame(() => viewer.classList.add('zoom-open'));
    isOpen = true;
  }

  function openViewer(mediaEl) {
    const sourceImg = mediaEl.querySelector('img');
    if (!sourceImg){
      const frame = mediaEl.querySelector('iframe');
      if (frame) openPdf(frame);
      return;
    }

    viewer.dataset.mode = 'image';
    sourceEl = sourceImg;
    img.src = sourceImg.currentSrc || sourceImg.src;
    img.alt = sourceImg.alt || '';

    viewer.classList.remove('hidden');
    viewer.classList.add('flex');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    hint.textContent = ('ontouchstart' in window)
      ? 'Pinch to zoom · drag to pan · double-tap to reset'
      : 'Scroll to zoom · drag to pan · double-click to reset';

    resetZoom(false);

    // Measure the thumbnail and the viewer's centered/final layout, then
    // start the stage exactly on top of the thumbnail before animating it
    // out to the centered, full-size position.
    requestAnimationFrame(() => {
      stage.style.transition = 'none';
      stage.style.transform = morphFrom(sourceImg);
      viewer.classList.add('zoom-open');

      requestAnimationFrame(() => {
        stage.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
        stage.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });

    isOpen = true;
  }

  function closeViewer() {
    if (!isOpen) return;
    isOpen = false;

    if (sourceEl) {
      stage.style.transition = 'transform 0.32s cubic-bezier(0.4, 0, 1, 1)';
      stage.style.transform = morphFrom(sourceEl);
    }
    viewer.classList.remove('zoom-open');

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      viewer.classList.add('hidden');
      viewer.classList.remove('flex');
      viewer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      img.src = '';
      pdfFrame.removeAttribute('src');
      viewer.dataset.mode = '';
      stage.style.transition = 'none';
      stage.style.transform = 'translate(0px, 0px) scale(1)';
      scale = 1;
      panX = 0;
      panY = 0;
      sourceEl = null;
    };

    stage.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 380);
  }

  document.querySelectorAll('.cert-media').forEach((el) => {
    //invisible layer over any thumbnail that contains an iframe
    if (el.querySelector('iframe')) {
      const hit = document.createElement('span');
      hit.className = 'cert-media-hit';
      hit.setAttribute('aria-hidden', 'true');
      el.appendChild(hit);
    }
    el.addEventListener('click', () => openViewer(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openViewer(el);
      }
    });
  });

  closeBtn.addEventListener('click', closeViewer);
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) closeViewer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeViewer();
  });

  // Desktop: scroll to zoom, centered roughly on the viewport.
  viewer.addEventListener('wheel', (e) => {
    if (!isOpen) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.0016;
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta * scale));
    if (scale === MIN_SCALE) {
      panX = 0;
      panY = 0;
    }
    clampPan();
    applyTransform(false);
  }, { passive: false });

  // Double-click / double-tap toggles between fit and a comfortable zoom level.
  stage.addEventListener('dblclick', () => {
    if (scale > 1) {
      resetZoom(true);
    } else {
      scale = 2.4;
      applyTransform(true);
    }
  });

  // Pointer-based drag-to-pan and pinch-to-zoom, unified across mouse and touch.
  const pointers = new Map();
  let dragStart = null;
  let pinchStartDist = null;
  let pinchStartScale = 1;

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  stage.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1 && scale > 1) {
      dragStart = { x: e.clientX, y: e.clientY, panX, panY };
    } else if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      pinchStartDist = distance(pts[0], pts[1]);
      pinchStartScale = scale;
    }

    try {
      stage.setPointerCapture(e.pointerId);
    } catch (err) {
      // Pointer capture can fail harmlessly if the pointer already ended.
    }
  });

  stage.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinchStartDist) {
      const pts = Array.from(pointers.values());
      const dist = distance(pts[0], pts[1]);
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStartScale * (dist / pinchStartDist)));
      clampPan();
      applyTransform(false);
    } else if (pointers.size === 1 && dragStart) {
      const dxScreen = e.clientX - dragStart.x;
      const dyScreen = e.clientY - dragStart.y;
      panX = dragStart.panX + dxScreen / scale;
      panY = dragStart.panY + dyScreen / scale;
      clampPan();
      applyTransform(false);
    }
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStartDist = null;
    if (pointers.size === 0) dragStart = null;
    if (scale <= MIN_SCALE) resetZoom(true);
  }

  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
})();






//open new tab function
(function initLinkConfirm() {
  const modal = document.getElementById('link-modal');
  if (!modal) return;

  const panel = modal.querySelector('.link-modal-panel');
  const targetLabel = document.getElementById('link-modal-target');
  const cancelBtn = document.getElementById('link-modal-cancel');
  const confirmBtn = document.getElementById('link-modal-confirm');

  let pendingUrl = null;

  function labelFor(url) {
    try {
      const parsed = new URL(url, window.location.href);
      if (parsed.origin === window.location.origin) {
        // Same-site file (e.g. résumé) — show the filename, not the domain.
        const file = decodeURIComponent(parsed.pathname.split('/').pop() || '');
        return file || parsed.hostname;
      }
      return parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      return url;
    }
  }

  function openLinkModal(url) {
    pendingUrl = url;
    targetLabel.textContent = labelFor(url);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Reflow before animating in, same trick as the video modal.
    void modal.offsetWidth;
    requestAnimationFrame(() => modal.classList.add('modal-open'));

    confirmBtn.focus();
  }

  function closeLinkModal() {
    modal.classList.remove('modal-open');

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      pendingUrl = null;
    };

    panel.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 350); // fallback in case transitionend doesn't fire
  }

  document.querySelectorAll('a.link-confirm').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openLinkModal(link.href);
    });
  });

  confirmBtn.addEventListener('click', () => {
    if (pendingUrl) window.open(pendingUrl, '_blank', 'noopener,noreferrer');
    closeLinkModal();
  });

  cancelBtn.addEventListener('click', closeLinkModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLinkModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeLinkModal();
    }
  });
})();


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
// Arrow buttons + tabs (dots) switch between the three slides using a fast
// "Flash" style transition: the current slide blur-dashes off in the
// direction of travel while a lightning streak sweeps the panel, then
// the next slide dashes in from the opposite side.
(function initAboutCarousel() {
  const track = document.getElementById('about-track');
  if (!track) return;

  const carousel = track.closest('.about-carousel');

  
  const slides = Array.from(track.querySelectorAll('.about-slide'));
  const tabs = Array.from(document.querySelectorAll('.about-tab'));
  const indicator = document.querySelector('.about-tab-indicator');
  const prevBtn = document.getElementById('about-prev');
  const nextBtn = document.getElementById('about-next');
  const label = document.getElementById('about-panel-label');
  const streak = document.querySelector('.about-carousel .flash-streak');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let current = Math.max(0, slides.findIndex((s) => s.classList.contains('active')));
  let animating = false;

  // function setActiveDot(index) {
  //   dots.forEach((dot, i) => {
  //     const isActive = i === index;
  //     dot.classList.toggle('active', isActive);
  //     dot.setAttribute('aria-selected', String(isActive));
  //   });
  // }

  function moveIndicator(index) {
    const tab = tabs[index];
    if (!indicator || !tab) return;
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  }

  function setActiveTab(index) {
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    moveIndicator(index);
  }

  function finish(index) {
    current = index;
    //setActiveDot(index);
    //if (label) label.textContent = slides[index].dataset.label || '';
    animating = false;
    if (carousel) carousel.classList.add('is-flashing');
  }

  function goTo(index, direction) {
    if (animating || index === current || !slides[index]) return;
    animating = true;
    if (carousel) carousel.classList.remove('is-flashing');

    // Move the tab highlight and underline right away so the click
    // feels instant -- the content flash transition below is slower
    // and shouldn't gate the "did this register" feedback.
    setActiveTab(index);
    if (label) label.textContent = slides[index].dataset.label || '';

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

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = Number(tab.dataset.index);
      if (Number.isNaN(target) || target === current) return;
      goTo(target, target > current ? 'next' : 'prev');
    });
  });

  // Left/right arrow key support while the panel has focus
  if (carousel) {
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
  }


  // Keep the sliding indicator aligned with its tab if the layout reflows
  window.addEventListener('resize', () => moveIndicator(current));
  requestAnimationFrame(() => moveIndicator(current));
})();


(function initTooltipFlip() {
  var triggers = document.querySelectorAll('.group.relative.inline-block');

  triggers.forEach(function (trigger) {
    var tip = trigger.querySelector(':scope > .absolute');
    if (!tip) return;

    function placeTooltip() {
      // Reset to the default "open below" position first so we measure
      // the tooltip's natural size/location before deciding to flip it.
      tip.style.top = '';
      tip.style.bottom = '';
      tip.style.marginTop = '';
      tip.style.marginBottom = '';

      var triggerRect = trigger.getBoundingClientRect();
      var tipHeight = tip.offsetHeight;
      var spaceBelow = window.innerHeight - triggerRect.bottom;
      var spaceAbove = triggerRect.top;
      var GAP = 16; // ~ the mt-2/mb-2 spacing already used elsewhere

      if (spaceBelow < tipHeight + GAP && spaceAbove > spaceBelow) {
        tip.style.top = 'auto';
        tip.style.bottom = '100%';
        tip.style.marginBottom = '0.5rem';
        tip.style.marginTop = '0';
      }
    }

    trigger.addEventListener('mouseenter', placeTooltip);
    trigger.addEventListener('focus', placeTooltip);
  });
})();




// work showcase: swap the sticky image as each project scrolls into view
(function () {
  const items = Array.from(document.querySelectorAll('.work-item'));
  const imgs = document.querySelectorAll('.work-visual-img');
  const panel = document.querySelector('.work-visual');
  if (!items.length) return;

  let current = -1;
  function activate(index) {
    if (index === current) return;
    current = index;
    items.forEach((el, i) => el.classList.toggle('is-active', i === index));
    imgs.forEach((el, i) => el.classList.toggle('is-active', i === index));
  }

  function update() {
    // Reference line = vertical centre of the image panel (or screen centre on mobile)
    let line = window.innerHeight / 2;
    if (panel && panel.offsetParent !== null) {
      const r = panel.getBoundingClientRect();
      line = r.top + r.height / 2;
    }
    // Before the first project -> show 1, after the last -> show the last
    let index = line < items[0].getBoundingClientRect().top ? 0 : items.length - 1;
    for (let i = 0; i < items.length; i++) {
      const r = items[i].getBoundingClientRect();
      if (line >= r.top && line < r.bottom) { index = i; break; }
    }
    activate(index);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
})();



//Practicum portfolio book

//Renders the practicum PDF (PDF.js, loaded lazily) as paper leaves hinged on a spine.
//Drag / swipe a page, tap its half, use the arrows or the keyboard to turn it.
//Two-page spread on wide screens, single page on phones.
(function initPracticumBook() {
  const root = document.getElementById('practicum-book');
  if (!root) return;

  const stage   = root.querySelector('.book-stage');
  const shift   = root.querySelector('.book-shift');
  const book    = root.querySelector('.book');
  const shadowL = root.querySelector('.book-shadow-l');
  const shadowR = root.querySelector('.book-shadow-r');
  const prevBtn = root.querySelector('[data-book-prev]');
  const nextBtn = root.querySelector('[data-book-next]');
  const status  = root.querySelector('.book-status');
  const fsBtn   = root.querySelector('[data-book-fs]');
  const loading = root.querySelector('.book-loading');
  const toc      = root.querySelector('.book-toc');
  const tocTitle = root.querySelector('.book-toc-title');
  const tocSections = root.querySelector('.book-toc-sections');
  const tocPages = root.querySelector('.book-toc-pages');
  const tocBtn   = root.querySelector('[data-book-toc]');
  const resetBtn = root.querySelector('[data-book-reset]');
  const fsExitBtn = root.querySelector('[data-book-fs-exit]');
  const TOC_W = 190, TOC_GAP = 24;     // side panel width + gap (px) on wide screens

  const PDFJS  = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp  = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const easeOut   = (k) => 1 - Math.pow(1 - k, 3);

  let pdf = null, N = 0, ratio = 1.294; //page count + page height/width
  let spread = true, pageW = 0, pageH = 0;
  let L = 0, maxCur = 0, current = 0; //leaves, furthest allowed position, leaves turned so far
  let leaves = [], canvases = new Map();
  let busy = false, drag = null, peek = null, gen = 0, lastW = 0, lastDpr = 1, hasToc = false;
  let pxRatio = 1, pageDev = 0, pageHDev = 0;   // screen pixel ratio + page size in real screen pixels
  const rendered = new Set(); let queue = [], pumping = false;

  //load PDF.js + document
  function loadLib() {
    if (window.pdfjsLib) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = PDFJS + 'pdf.min.js';
      //s.onload = resolve; s.onerror = reject;
      s.onload = resolve;
      s.onerror = () => { s.remove(); reject(new Error('PDF.js failed to load')); };
      document.head.appendChild(s);
    });
  }


  //error handling for document not displaying
  let starting = false, observing = false;

  function showError() {
    loading.textContent = '';
    const box = document.createElement('div');
    box.className = 'book-error';
    const msg = document.createElement('p');
    msg.innerHTML = 'The portfolio preview could not load. Check your connection and try again, or <a href="' + root.dataset.pdf + '" target="_blank" rel="noopener noreferrer">open the PDF</a> directly.';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'about-arrow book-retry';
    btn.setAttribute('aria-label', 'Try loading the portfolio again');
    btn.title = 'Try again';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>';
    btn.addEventListener('click', () => {
      btn.disabled = true; btn.classList.add('is-spinning');
      msg.textContent = 'Trying again…';
      setTimeout(start, 350);
    });
    box.append(msg, btn);
    loading.appendChild(box);
  }


  async function start() {
    if (starting) return;
    starting = true;
    loading.textContent = 'Opening the portfolio…';
    try {
      await loadLib();
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
      pdf = await pdfjsLib.getDocument(root.dataset.pdf).promise;
      N = pdf.numPages;
      const v = (await pdf.getPage(1)).getViewport({ scale: 1 });
      ratio = v.height / v.width;
      layout();
      buildToc(); loadOutline();
      root.classList.add('is-ready');
      lastW = stage.clientWidth;
      if (!observing) { observing = true; new ResizeObserver(onResize).observe(stage); window.addEventListener('resize', onResize); }
      if (!reduce) setTimeout(introNudge, 700);
    } catch (err) {
      showError();
    } finally {
      starting = false;
    }
  }

  //Load only when the section is about to scroll into view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start(); }
    }, { rootMargin: '400px 0px' });
    io.observe(root);
  } else start();

  //layout
  function measure() {
    const avail = stage.clientWidth;
    const maxH = Math.max(650, window.innerHeight - (document.fullscreenElement ? 110 : 90));   // big pages first; a short window just scrolls a little
    const wantSpread = avail >= 640;
    const wide = avail >= 940;                                   // room for the page list beside the book
    const area = wide ? avail - TOC_W - TOC_GAP : avail;
    const w = Math.min(wantSpread ? area / 2 : Math.min(avail, 520), maxH / ratio);
    const dpr = window.devicePixelRatio || 1;
    // Size the page in whole, even numbers of SCREEN pixels so the canvas maps 1:1 onto the display (no resampling = sharp text)
    return { wantSpread, wide, dpr, wDev: Math.max(2, Math.floor(w * dpr / 2) * 2) };
  }

  function layout() {
    const m = measure();
    hasToc = m.wide;
    root.classList.toggle('has-toc', hasToc);
    root.style.setProperty('--toc-w', TOC_W + 'px');
    const pageIdx = leaves.length ? (spread ? current * 2 : current) : 0;   // page showing on the right/only slot
    const modeChanged = !leaves.length || m.wantSpread !== spread;
    spread = m.wantSpread; pxRatio = m.dpr;
    pageDev = m.wDev; pageHDev = Math.round(pageDev * ratio);
    pageW = pageDev / pxRatio; pageH = pageHDev / pxRatio;          // CSS size that equals exactly pageDev x pageHDev screen pixels
    lastDpr = pxRatio;
    root.style.setProperty('--pw', pageW.toFixed(4) + 'px');
    root.style.setProperty('--ph', pageH.toFixed(4) + 'px');
    root.style.setProperty('--cols', spread ? 2 : 1);
    root.style.setProperty('--spine', spread ? pageW.toFixed(4) + 'px' : '0px');
    gen++; rendered.clear();
    if (modeChanged) {
      build();
      current = clamp(spread ? Math.floor(pageIdx / 2) : pageIdx, 0, maxCur);
    }
    rest(); renderWindow(); updateUI();
  }

  function build() {
    book.textContent = ''; leaves = []; canvases = new Map(); queue = [];
    L = spread ? Math.ceil(N / 2) : N;
    maxCur = spread ? (N % 2 ? L - 1 : L) : N - 1;       // odd page counts end on a full spread
    for (let i = 0; i < L; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.append(makeFace('front', spread ? 2 * i : i), makeFace('back', spread ? 2 * i + 1 : -1));
      book.appendChild(leaf); leaves.push(leaf);
    }
  }

  function makeFace(side, p) {
    const f = document.createElement('div');
    f.className = 'face ' + side;
    if (p >= 0 && p < N) {
      const c = document.createElement('canvas');
      c.setAttribute('role', 'img'); c.setAttribute('aria-label', 'Page ' + (p + 1));
      f.appendChild(c); canvases.set(p, c);
    }
    return f;
  }

  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = stage.clientWidth;
      if (w === lastW && lastDpr === (window.devicePixelRatio || 1) && !document.fullscreenElement === !root.dataset.fs) return;
      lastW = w; root.dataset.fs = document.fullscreenElement ? '1' : '';
      if (!busy && !drag) layout();
    }, 150);
  }

  //painting
  const zFor = (i) => (i < current ? i + 1 : L - i);
  
  function paint(i, a, keep3d) {
    const l = leaves[i];
    // At rest (0° / 180°) leaves are drawn flat, with no 3D transform, so the page bitmap is never resampled = sharpest text.
    // Only while a page is actually turning does it use the 3D rotation.
    if (a === 0) { l.classList.remove('is-left'); l.style.transform = 'none'; }
    else if (a === 180 && !keep3d) { l.classList.add('is-left'); l.style.transform = 'translateX(-100%)'; }
    else { l.classList.remove('is-left'); l.style.transform = 'rotateY(' + -a + 'deg)'; }
    l.style.setProperty('--shade', Math.sin(a * Math.PI / 180).toFixed(3));
  }

  //Put every leaf at rest: flipped ones on the left, the rest stacked on the right
  function rest() {
    leaves.forEach((l, i) => {
      const flipped = i < current;
      l.classList.remove('peek');
      paint(i, flipped ? 180 : 0);
      l.style.zIndex = zFor(i);
      l.classList.toggle('is-gone', !spread && flipped);
    });
    peek = null; place(current);
  }

  //pf = how many leaves are turned (fractional while one is mid-turn); slides the book so a closed cover/back stays centred
  function place(pf) {
    let s = spread ? -pageW / 2 * clamp(1 - pf, 0, 1) + pageW / 2 * clamp(pf - (L - 1), 0, 1) : 0;
    if (hasToc) s += (TOC_W + TOC_GAP) / 2 * clamp(1 - pf, 0, 1);   // closed cover sits centred; the page list fades in once it opens
    shift.style.transform = 'translateX(' + Math.round(s * pxRatio) / pxRatio + 'px)';   // always a whole number of screen pixels
    shadowL.style.opacity = spread ? clamp(pf, 0, 1) : 0;
    shadowR.style.opacity = spread ? clamp(L - pf, 0, 1) : 1;
  }

  function tween(i, from, to, ms, ease, done) {
    busy = true; clearPeek();
    leaves[i].classList.remove('is-gone'); leaves[i].style.zIndex = L + 5;
    const t0 = performance.now(); if (reduce) ms = 0;
    (function step(now) {
      const k = ms ? clamp((now - t0) / ms, 0, 1) : 1;
      const a = from + (to - from) * ease(k);
      paint(i, a); place(i + a / 180);
      if (k < 1) requestAnimationFrame(step); else { busy = false; done(); }
    })(t0);
  }
  const duration = (from, to) => 220 + Math.abs(to - from) / 180 * 520;

  function go(dir) {
    if (busy || (dir > 0 ? current >= maxCur : current <= 0)) return;
    const i = dir > 0 ? current : current - 1;
    const from = dir > 0 ? 0 : 180, to = dir > 0 ? 180 : 0;
    tween(i, from, to, duration(from, to), easeInOut, () => { current += dir; rest(); renderWindow(); updateUI(); });
  }

  //page list (table of contents) + jump animation
  function buildToc() {
    tocPages.textContent = '';
    for (let p = 0; p < N; p++) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'book-toc-chip'; b.dataset.page = p; b.textContent = p + 1;
      b.setAttribute('aria-label', p === 0 ? 'Go to the cover, page 1' : 'Go to page ' + (p + 1));
      li.appendChild(b); tocPages.appendChild(li);
    }
    updateUI();
  }

  // If the PDF has bookmarks, list them as named sections above the page numbers
  async function loadOutline() {
    try {
      const out = await pdf.getOutline();
      if (!out || !out.length) return;
      const items = [];
      for (const o of out.slice(0, 24)) {
        let dest = o.dest;
        if (typeof dest === 'string') dest = await pdf.getDestination(dest);
        if (!Array.isArray(dest)) continue;
        const idx = typeof dest[0] === 'object' ? await pdf.getPageIndex(dest[0]) : dest[0];
        if (Number.isInteger(idx) && idx >= 0 && idx < N) items.push({ title: (o.title || '').trim(), page: idx });
      }
      if (!items.length) return;
      tocSections.textContent = '';
      items.forEach((it) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'book-toc-section'; b.dataset.page = it.page;
        const t = document.createElement('span'), n = document.createElement('span');
        t.textContent = it.title || 'Page ' + (it.page + 1); n.textContent = it.page + 1;
        b.append(t, n); tocSections.appendChild(b);
      });
      tocSections.hidden = false; tocTitle.textContent = 'Contents';
    } catch (e) { /* no bookmarks: the page numbers are enough */ }
  }

  function markToc(pages) {
    tocPages.querySelectorAll('.book-toc-chip').forEach((b) => {
      const on = pages.indexOf(+b.dataset.page) !== -1;
      b.classList.toggle('is-current', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    const act = tocPages.querySelector('.is-current');          // keep the active number in view inside the panel
    if (act && toc.scrollHeight > toc.clientHeight) toc.scrollTo({ top: act.offsetTop - toc.clientHeight / 2, behavior: reduce ? 'auto' : 'smooth' });
  }

  // Flip every leaf between here and the target in one quick, staggered flurry: farther pages = more leaves
  function jumpTo(page) {
    if (busy) return;
    const target = clamp(spread ? Math.ceil(page / 2) : page, 0, maxCur);
    if (target === current) return;
    clearPeek(); renderWindow(target);
    markToc(spread ? [target > 0 ? target * 2 - 1 : -1, target * 2 < N ? target * 2 : -1] : [target]);   // highlight the destination right away
    if (reduce) { current = target; rest(); renderWindow(); updateUI(); return; }
    const fwd = target > current, idxs = [];
    if (fwd) for (let i = current; i < target; i++) idxs.push(i);
    else for (let i = current - 1; i >= target; i--) idxs.push(i);
    const base = fwd ? current : target;
    const per = 380, gap = idxs.length > 1 ? clamp(1000 / (idxs.length - 1), 26, 130) : 0;
    const total = per + gap * (idxs.length - 1);
    busy = true;
    idxs.forEach((i) => leaves[i].classList.remove('is-gone'));
    const t0 = performance.now();
    (function step(now) {
      const el = now - t0; let sum = 0;
      idxs.forEach((i, k) => {
        const e = easeInOut(clamp((el - k * gap) / per, 0, 1));
        const a = fwd ? 180 * e : 180 - 180 * e;
        paint(i, a); sum += a / 180;
        leaves[i].style.zIndex = 1000 + (a < 90 ? L - i : i);   // leaves on the right stack low-to-high, on the left the reverse
      });
      place(base + sum);
      if (el < total) requestAnimationFrame(step);
      else { busy = false; current = target; rest(); renderWindow(); updateUI(); }
    })(t0);
  }

  function closeTocPopover() { root.classList.remove('toc-popped'); if (tocBtn) tocBtn.setAttribute('aria-expanded', 'false'); }

  toc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-page]');
    if (!b || busy) return;
    closeTocPopover();
    jumpTo(+b.dataset.page);
  });
  if (tocBtn) tocBtn.addEventListener('click', () => {
    const open = root.classList.toggle('toc-popped');
    tocBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (root.classList.contains('toc-popped') && !toc.contains(e.target) && !(tocBtn && tocBtn.contains(e.target))) closeTocPopover();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTocPopover(); });

  //rendering pages to canvas (only a window around the reader)
  function windowFor(cur) {
    const centre = spread ? cur * 2 - 0.5 : cur;
    const reach = spread ? 6 : 4;
    const want = [];
    for (let p = Math.max(0, Math.ceil(centre - reach)); p <= Math.min(N - 1, Math.floor(centre + reach + 1)); p++) want.push(p);
    return want.sort((a, b) => Math.abs(a - centre) - Math.abs(b - centre));
  }

  // extraCur: also prepare the pages around another position (used while jumping, so the landing spread is ready)
  function renderWindow(extraCur) {
    const want = (extraCur != null ? windowFor(extraCur) : []).concat(windowFor(current));
    const keep = new Set(want);
    rendered.forEach((p) => {                              // free memory for far-away pages
      if (!keep.has(p)) { const c = canvases.get(p); if (c) { c.width = c.height = 0; c.classList.remove('ready'); } rendered.delete(p); }
    });
    queue = Array.from(keep).filter((p) => !rendered.has(p));
    pump();
  }

  async function pump() {
    if (pumping) return;
    pumping = true; const g = gen;
    while (queue.length) {
      const p = queue.shift(), c = canvases.get(p);
      if (!c || rendered.has(p)) continue;
      try {
        const page = await pdf.getPage(p + 1);
        if (g !== gen) break;
        const v0 = page.getViewport({ scale: 1 });
        // Whole-number screens (100%, 200%, 300%): one canvas pixel per screen pixel, so PDF.js draws text at its final size.
        // Fractional screens (125%, 150%): draw at 2x so the browser shrinks it cleanly instead of stretching it awkwardly.
        const k = Number.isInteger(pxRatio) ? 1 : 2;
        const v = page.getViewport({ scale: Math.min(pageDev / v0.width, pageHDev / v0.height) * k });
        c.width = pageDev * k; c.height = pageHDev * k;
        await page.render({ canvasContext: c.getContext('2d'), viewport: v }).promise;
        if (g === gen) { rendered.add(p); c.classList.add('ready'); }
      } catch (e) { /* skip a page that fails to render */ }
    }
    pumping = false;
    if (g !== gen) pump();
  }

  //UI text
  function updateUI() {
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= maxCur;
    let txt;
    if (!spread) txt = 'Page ' + (current + 1) + ' of ' + N;
    else {
      const a = current > 0 ? current * 2 : 0, b = current * 2 + 1 <= N ? current * 2 + 1 : 0;
      txt = a && b ? 'Pages ' + a + '–' + b + ' of ' + N : 'Page ' + (a || b) + ' of ' + N;
      if (current === 0) txt = 'Cover';
    }
    status.textContent = txt;
    root.classList.toggle('toc-open', current > 0);              // page list appears once the cover is opened
    markToc(spread ? [current > 0 ? current * 2 - 1 : -1, current * 2 < N ? current * 2 : -1] : [current]);
  }

  //peek: pages lift slightly when the mouse nears an edge
  function setPeek(w) {
    if (peek && w && peek.i === w.i) return;
    if (peek) {
      const i = peek.i;
      paint(i, i < current ? 180 : 0, true);   // ease back to rest using the SAME rotateY form, so left pages animate like right ones
      setTimeout(() => {
        if (!peek || peek.i !== i) {
          leaves[i].classList.remove('peek'); leaves[i].style.zIndex = zFor(i);
          if (!busy && !drag) paint(i, i < current ? 180 : 0);   // then drop back to the flat, sharp resting state
        }
      }, 320);
    }
    peek = w;
    if (w) {
      const l = leaves[w.i];
      if (w.i < current && !l.classList.contains('peek')) { paint(w.i, 180, true); void l.offsetWidth; }   // left leaf: start from rotateY(-180deg) (looks identical to its flat rest) so the lift interpolates cleanly
      l.classList.add('peek'); l.style.zIndex = L + 5; paint(w.i, w.a);
    }
  }
  function clearPeek() {
    if (!peek) return;
    const i = peek.i; leaves[i].classList.remove('peek'); paint(i, i < current ? 180 : 0); leaves[i].style.zIndex = zFor(i); peek = null;
  }
  function introNudge() {
    if (current !== 0 || drag || busy || peek) return;
    setPeek({ i: 0, a: 16 }); setTimeout(() => { if (peek && peek.i === 0 && current === 0) setPeek(null); }, 1100);
  }
  function hover(e) {
    if (e.pointerType !== 'mouse' || busy || drag) return;
    const r = book.getBoundingClientRect(), x = e.clientX - r.left, edge = pageW * 0.18;
    const inside = e.clientY >= r.top && e.clientY <= r.bottom && x >= 0 && x <= r.width;
    let want = null;
    if (inside) {
      if (x > r.width - edge && current < maxCur) want = { i: current, a: 14 };
      else if (spread && x < edge && current > 0) want = { i: current - 1, a: 166 };
    }
    setPeek(want);
  }

  //pointer: drag / swipe / tap
  stage.addEventListener('pointerdown', (e) => {
    if (busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
    clearPeek();
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, active: false, samples: [[e.clientX, e.timeStamp]] };
  });

  stage.addEventListener('pointermove', (e) => {
    if (!drag) { hover(e); return; }
    if (e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.active) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      const fwd = dx < 0;
      if (fwd ? current >= maxCur : current <= 0) { drag = null; return; }
      Object.assign(drag, { active: true, fwd, i: fwd ? current : current - 1 });
      leaves[drag.i].classList.remove('is-gone'); leaves[drag.i].style.zIndex = L + 5;
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      stage.classList.add('is-dragging');
    }
    drag.prog = clamp((drag.fwd ? -dx : dx) / (pageW * (spread ? 1.5 : 1)), 0, 1);
    const a = drag.fwd ? drag.prog * 180 : 180 - drag.prog * 180;
    paint(drag.i, a); place(drag.i + a / 180);
    drag.samples.push([e.clientX, e.timeStamp]); if (drag.samples.length > 5) drag.samples.shift();
  });

  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null; stage.classList.remove('is-dragging');
    if (!d.active) { if (e.type === 'pointerup') tap(e); return; }
    const s = d.samples, a = s[0], b = s[s.length - 1];
    const vx = b[1] > a[1] ? (b[0] - a[0]) / (b[1] - a[1]) : 0;          // px per ms
    const toward = d.fwd ? -vx : vx;                                     // > 0 means still moving through the turn
    const complete = e.type === 'pointerup' && (toward > 0.35 || (d.prog > 0.35 && toward > -0.35));
    const from = d.fwd ? d.prog * 180 : 180 - d.prog * 180;
    const to = d.fwd === complete ? 180 : 0;
    tween(d.i, from, to, duration(from, to), easeOut, () => {
      if (complete) current += d.fwd ? 1 : -1;
      rest(); renderWindow(); updateUI();
    });
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !drag) setPeek(null); });

  function tap(e) {
    const r = book.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    const spineX = spread ? r.left + pageW : r.left + pageW * 0.35;
    go(e.clientX >= spineX ? 1 : -1);
  }



  //reset: put the book back on the cover and redraw it, without reloading the whole website
  let resetting = false;
  function resetBook() {
    if (resetting) return;
    if (!pdf) { if (!starting) start(); return; }       // never loaded (or failed): just try loading it again
    resetting = true;
    if (resetBtn) resetBtn.classList.add('is-spinning');
    const go = () => {
      if (busy || drag) { setTimeout(go, 60); return; } // wait for a page turn / drag to finish
      closeTocPopover(); clearPeek();
      root.classList.remove('is-ready');                // shows the "Opening…" state for a moment
      loading.textContent = 'Refreshing the portfolio…';
      current = 0; leaves = [];                         // forces a full rebuild from the cover
      toc.scrollTo({ top: 0 });
      setTimeout(() => {
        layout();
        loading.textContent = '';
        root.classList.add('is-ready');
        resetting = false;
        if (resetBtn) resetBtn.classList.remove('is-spinning');
        if (!reduce) setTimeout(introNudge, 500);
      }, reduce ? 0 : 250);
    };
    go();
  }
  if (resetBtn) resetBtn.addEventListener('click', resetBook);



  //buttons, keyboard, full screen
  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(1));
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  if (fsBtn) {
    if (!root.requestFullscreen) { fsBtn.hidden = true; if (fsExitBtn) fsExitBtn.hidden = true; }
    else {
      fsBtn.addEventListener('click', () => (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen()));
      if (fsExitBtn) fsExitBtn.addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); });
      document.addEventListener('fullscreenchange', () => {
        fsBtn.textContent = document.fullscreenElement === root ? 'Exit full screen' : 'Full screen';
        setTimeout(() => { if (pdf && !busy) layout(); }, 80);
      });
    }
  }
})();