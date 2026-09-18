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
// so the menu doesn't stay open once you've navigated.
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



// ============================================
// Video demo modal (local .mp4 files)
// ============================================
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


  /* =======================================================
    MASCOT CHANGE:
    Get the two sprite layers.
      */

  const directionSprite = mascot.querySelector(".mascot-direction");
  const reactionSprite = mascot.querySelector(".mascot-reaction");


  /* =======================================================
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


  /* =======================================================
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


  /* =======================================================
    MASCOT CHANGE:
    Expression/reaction handling.
      */

  let reactionTimeout = null;
  let clickCount = 0;
  let clickResetTimeout = null;


  /*
    Expression sprite-sheet positions.

    The exact expressions depend on how your
    "character expressions cursor portfolio.png"
    sheet is arranged.

    This assumes the common 3x3 arrangement used
    by page-mascot-style reaction sheets.

    You can change these positions later if your
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


  /* =======================================================
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