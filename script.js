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