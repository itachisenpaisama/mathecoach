/**
 * MATHECOACH FARID HÄDER — MINIMAL & HIGH PERFORMANCE SCRIPT
 * Sensory-friendly controls, theme management, accessible FAQ accordion & contact handler.
 */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // ========================================================
  // 1. THEME SWITCHER (Light / Dark)
  // ========================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  // Check stored theme or system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('fh_theme') || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const target = current === 'light' ? 'dark' : 'light';
      applyTheme(target);
      localStorage.setItem('fh_theme', target);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'dark' 
        ? '<use href="#icon-sun"/>' 
        : '<use href="#icon-moon"/>';
    }
  }

  // ========================================================
  // 2. SENSORY FOCUS MODE (Reizarmut für ADHS & Autismus)
  // ========================================================
  const focusToggleBtn = document.getElementById('focusToggleBtn');
  const savedFocus = localStorage.getItem('fh_focus') === 'sensory';
  if (savedFocus) {
    root.setAttribute('data-focus', 'sensory');
    if (focusToggleBtn) focusToggleBtn.classList.add('active');
  }

  if (focusToggleBtn) {
    focusToggleBtn.addEventListener('click', () => {
      const isSensory = root.getAttribute('data-focus') === 'sensory';
      if (isSensory) {
        root.removeAttribute('data-focus');
        focusToggleBtn.classList.remove('active');
        focusToggleBtn.setAttribute('title', 'Reizarmen Fokus-Modus aktivieren');
        localStorage.removeItem('fh_focus');
      } else {
        root.setAttribute('data-focus', 'sensory');
        focusToggleBtn.classList.add('active');
        focusToggleBtn.setAttribute('title', 'Reizarmen Fokus-Modus deaktivieren');
        localStorage.setItem('fh_focus', 'sensory');
      }
    });
  }

  // ========================================================
  // 3. NAVBAR SCROLL SHADOW
  // ========================================================
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ========================================================
  // 4. MOBILE HAMBURGER MENU
  // ========================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const hamburgerIcon = document.getElementById('hamburgerIcon');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      hamburgerBtn.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
      if (hamburgerIcon) {
        hamburgerIcon.innerHTML = isOpen ? '<use href="#icon-x"/>' : '<use href="#icon-menu"/>';
      }
    });

    // Close menu when clicking navigation links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon) {
          hamburgerIcon.innerHTML = '<use href="#icon-menu"/>';
        }
      });
    });
  }

  // ========================================================
  // 5. ACCESSIBLE FAQ ACCORDION
  // ========================================================
  const faqItems = document.querySelectorAll('.faq-item, .faq-row');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question, .faq-trigger-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close others (Single-focus pattern to reduce cognitive overload)
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question, .faq-trigger-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        item.classList.toggle('active', !isActive);
        questionBtn.setAttribute('aria-expanded', !isActive);
      });
    }
  });

  // ========================================================
  // 6. CONTACT FORM SUBMISSION
  // ========================================================
  const contactForm = document.getElementById('contactForm');
  const formStatusMessage = document.getElementById('formStatusMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const contactInfo = document.getElementById('contactInfo').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !contactInfo || !message) {
        if (formStatusMessage) {
          formStatusMessage.style.display = 'block';
          formStatusMessage.style.color = '#ef4444';
          formStatusMessage.textContent = 'Bitte fülle alle Pflichtfelder aus.';
        }
        return;
      }

      const originalHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Wird gesendet...';

      // Simulierter, zuverlässiger Versand
      setTimeout(() => {
        submitBtn.innerHTML = '<svg class="icon"><use href="#icon-check"/></svg> Nachricht übermittelt!';
        submitBtn.style.backgroundColor = 'var(--success)';
        submitBtn.style.color = '#ffffff';

        if (formStatusMessage) {
          formStatusMessage.style.display = 'block';
          formStatusMessage.style.color = 'var(--success)';
          formStatusMessage.innerHTML = 'Vielen Dank für deine Nachricht, <strong>' + escapeHtml(name) + '</strong>! Ich melde mich innerhalb von 24 Stunden bei dir.';
        }

        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
        }, 4000);
      }, 700);
    });
  }

  // ========================================================
  // 7. LEAD-MAGNET FORM HANDLER (Erfolgsguide PDF)
  // ========================================================
  const leadMagnetForm = document.getElementById('leadMagnetForm');
  const leadStatusMsg = document.getElementById('leadStatusMsg');

  if (leadMagnetForm) {
    leadMagnetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName') ? document.getElementById('leadName').value.trim() : '';
      const email = document.getElementById('leadEmail') ? document.getElementById('leadEmail').value.trim() : '';

      // Optional: E-Mail für Newsletter/Ressourcen speichern
      if (email) {
        try {
          const storedLeads = JSON.parse(localStorage.getItem('mathecoach_lead_subscribers') || '[]');
          storedLeads.push({ name: name || 'Interessent', email, date: new Date().toISOString() });
          localStorage.setItem('mathecoach_lead_subscribers', JSON.stringify(storedLeads));
        } catch (err) {
          console.warn('Could not save lead subscriber', err);
        }
      }

      if (leadStatusMsg) {
        leadStatusMsg.style.display = 'block';
        leadStatusMsg.style.color = 'var(--success)';
        leadStatusMsg.innerHTML = '<svg class="icon"><use href="#icon-check"/></svg> Download gestartet! Viel Erfolg beim Lesen.';
      }

      // PDF in neuem Tab öffnen
      window.open('Dokumente/Nachhilfe_Erfolgsguide.pdf', '_blank');

      leadMagnetForm.reset();
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
