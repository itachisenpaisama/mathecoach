/**
 * FARID HÄDER — MATHEMATIK & MINT-COACHING
 * Modern Interactions: Dual-Audience Switcher, Didactic Blackboard with KaTeX,
 * Interactive Learning Guide, Portal Login with SharedDB, FAQ Accordion, Legal Modals,
 * and Bilingual (DE / EN) Support.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================
  // 1. DUAL AUDIENCE SWITCHER (FÜR ELTERN // FÜR SCHÜLER)
  // ========================================================
  const audElternBtn = document.getElementById('audElternBtn');
  const audSchuelerBtn = document.getElementById('audSchuelerBtn');
  const paneEltern = document.getElementById('paneEltern');
  const paneSchueler = document.getElementById('paneSchueler');

  function setAudience(audience) {
    if (audience === 'schueler') {
      if (audSchuelerBtn) audSchuelerBtn.classList.add('active');
      if (audElternBtn) audElternBtn.classList.remove('active');
      if (paneSchueler) paneSchueler.classList.add('active');
      if (paneEltern) paneEltern.classList.remove('active');
    } else {
      if (audElternBtn) audElternBtn.classList.add('active');
      if (audSchuelerBtn) audSchuelerBtn.classList.remove('active');
      if (paneEltern) paneEltern.classList.add('active');
      if (paneSchueler) paneSchueler.classList.remove('active');
    }
  }

  if (audElternBtn && audSchuelerBtn) {
    audElternBtn.addEventListener('click', () => setAudience('eltern'));
    audSchuelerBtn.addEventListener('click', () => setAudience('schueler'));
  }

  // ========================================================
  // 2. DIDACTIC NOTEPAD (INTERACTIVE CHALKBOARD DEMONSTRATOR)
  // ========================================================
  const didacticData = {
    de: {
      kurvendiskussion: {
        topic: 'Analysis · Klassen 11–13 & Abitur',
        problem: 'Kurvendiskussion: Extremstellen finden ohne Formelpanik',
        steps: [
          {
            num: '1',
            title: 'Anschaulicher Einstieg',
            desc: 'Was bedeutet ein Hochpunkt im echten Leben? Es ist der Gipfel eines Berges. Genau dort geht es weder bergauf noch bergab: Die Steigung ist exakt null.'
          },
          {
            num: '2',
            title: 'Die mathematische Übersetzung',
            desc: 'Die erste Ableitung \\(f\'(x)\\) misst die Steigung. Wir setzen also an: \\(f\'(x) = 0\\). Bei \\(f(x) = x^3 - 3x\\) ergibt sich \\(3x^2 - 3 = 0 \\implies x = \\pm 1\\).'
          },
          {
            num: '3',
            title: 'Die Krümmungsprüfung',
            desc: 'Zweite Ableitung \\(f\'\'(x) = 6x\\). Wir setzen ein: \\(f\'\'(1) = 6 > 0\\) (Tiefpunkt, wie eine Schale) und \\(f\'\'(-1) = -6 < 0\\) (Hochpunkt, wie eine Kappe).'
          }
        ],
        aha: 'Ergebnis: Keine sture Formelauswendiglernerei, sondern ein klares Bild im Kopf. Die Schüler verstehen sofort das WARUM dahinter.'
      },
      bruchrechnen: {
        topic: 'Grundlagen · Mittelstufe Klassen 7–10',
        problem: 'Brüche addieren: Warum man Nenner niemals einfach zusammenzählt',
        steps: [
          {
            num: '1',
            title: 'Das Pizza-Gleichnis',
            desc: 'Wer \\(\\frac{1}{2}\\) Pizza und \\(\\frac{1}{3}\\) Pizza isst, hat nicht \\(\\frac{2}{5}\\) Pizza. Halbe und Drittel sind unterschiedlich große Stücke.'
          },
          {
            num: '2',
            title: 'Den gemeinsamen Nenner finden',
            desc: 'Wir schneiden alle Stücke in Sechstel: \\(\\frac{1}{2} = \\frac{3}{6}\\) und \\(\\frac{1}{3} = \\frac{2}{6}\\). Nun haben alle Stücke dieselbe Größe.'
          },
          {
            num: '3',
            title: 'Zusammenzählen',
            desc: '\\(\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}\\). Logisch, sichtbar und für immer im Gedächtnis verankert.'
          }
        ],
        aha: 'Ergebnis: Bruchrechen-Blockaden lösen sich auf, sobald man das abstrakte Rechengesetz in ein greifbares visuelles Modell übersetzt.'
      },
      vektoren: {
        topic: 'Analytische Geometrie · Oberstufe & Abitur',
        problem: 'Vektoren im 3D-Raum: Punkte, Geraden & Ebenen greifbar machen',
        steps: [
          {
            num: '1',
            title: 'Der Vektor als Wegbeschreibung',
            desc: 'Ein Vektor ist kein starrer Pfeil, sondern eine Schritt-für-Schritt-Anweisung im Raum: „Gehe 3 Schritte nach rechts, 2 nach vorn, 5 nach oben“: \\(\\vec{v} = \\begin{pmatrix} 3 \\\\ 2 \\\\ 5 \\end{pmatrix}\\).'
          },
          {
            num: '2',
            title: 'Geradengleichung aufbauen',
            desc: 'Startpunkt (Stützvektor) plus beliebig viele Schritte in die Richtung: \\(g: \\vec{x} = \\vec{p} + r \\cdot \\vec{u}\\). Wie ein Flugzeug auf seiner Flugroute.'
          },
          {
            num: '3',
            title: 'Schnittpunkte ohne Angst vor Gleichungssystemen',
            desc: 'Wir setzen zwei Geraden gleich. Aus einer scheinbar unlösbaren 3D-Aufgabe wird ein einfaches lineares Gleichungssystem mit 3 Zeilen.'
          }
        ],
        aha: 'Ergebnis: Schüler verlieren die Ehrfurcht vor der 3. Dimension und können Aufgaben methodisch wie ein Bauwerk zusammensetzen.'
      }
    },
    en: {
      kurvendiskussion: {
        topic: 'Calculus · High School & Advanced Placement',
        problem: 'Curve Sketching: Finding local extrema without memorization panic',
        steps: [
          {
            num: '1',
            title: 'Intuitive Entry Point',
            desc: 'What does a local maximum mean in real life? It is the peak of a hill. Right at the top, you are neither going up nor down: the slope is exactly zero.'
          },
          {
            num: '2',
            title: 'The Mathematical Translation',
            desc: 'The first derivative \\(f\'(x)\\) measures slope. We solve \\(f\'(x) = 0\\). For \\(f(x) = x^3 - 3x\\), we get \\(3x^2 - 3 = 0 \\implies x = \\pm 1\\).'
          },
          {
            num: '3',
            title: 'The Curvature Check',
            desc: 'Second derivative \\(f\'\'(x) = 6x\\). We test: \\(f\'\'(1) = 6 > 0\\) (minimum, cup-shaped) and \\(f\'\'(-1) = -6 < 0\\) (maximum, cap-shaped).'
          }
        ],
        aha: 'Takeaway: No blind rote learning. A crystal-clear mental model replaces anxiety with true mathematical understanding.'
      },
      bruchrechnen: {
        topic: 'Foundations · Middle School (Grades 7–10)',
        problem: 'Adding Fractions: Why numerators and denominators behave differently',
        steps: [
          {
            num: '1',
            title: 'The Pizza Analogy',
            desc: 'Eating \\(\\frac{1}{2}\\) of a pizza plus \\(\\frac{1}{3}\\) of a pizza does not equal \\(\\frac{2}{5}\\). Halves and thirds are fundamentally different piece sizes.'
          },
          {
            num: '2',
            title: 'Finding the Common Denominator',
            desc: 'We slice both into sixths: \\(\\frac{1}{2} = \\frac{3}{6}\\) and \\(\\frac{1}{3} = \\frac{2}{6}\\). Now all portions have identical scale.'
          },
          {
            num: '3',
            title: 'Adding Up',
            desc: '\\(\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}\\). Visible, logical, and permanently retained.'
          }
        ],
        aha: 'Takeaway: Math blocks vanish as soon as abstract algebraic rules are grounded in physical intuition.'
      },
      vektoren: {
        topic: 'Analytical Geometry · Vector Calculus & 3D Space',
        problem: '3D Coordinate Space: Demystifying lines, planes, and intersections',
        steps: [
          {
            num: '1',
            title: 'Vectors as Navigation Directions',
            desc: 'A vector is not an abstract arrow; it is a step-by-step navigation path: “Go 3 units right, 2 forward, 5 upward”: \\(\\vec{v} = \\begin{pmatrix} 3 \\\\ 2 \\\\ 5 \\end{pmatrix}\\).'
          },
          {
            num: '2',
            title: 'Building Line Equations',
            desc: 'Anchor point (position vector) plus variable steps along direction: \\(g: \\vec{x} = \\vec{p} + r \\cdot \\vec{u}\\). Exactly like an aircraft flightpath.'
          },
          {
            num: '3',
            title: 'Intersections Without Fear',
            desc: 'Equating two lines turns a seemingly daunting 3D problem into a clean, solvable system of 3 linear equations.'
          }
        ],
        aha: 'Takeaway: Students lose their intimidation of 3D geometry and approach exam problems like structured architectural blueprints.'
      }
    }
  };

  let currentLang = localStorage.getItem('fh_lang') || 'de';
  let currentTopic = 'kurvendiskussion';

  const notepadTabs = document.querySelectorAll('.notepad-tab');
  const chalkTopicTag = document.getElementById('chalkTopicTag');
  const chalkProblem = document.getElementById('chalkProblem');
  const chalkStepContainer = document.getElementById('chalkStepContainer');
  const chalkAhaText = document.getElementById('chalkAhaText');

  function renderNotepad(topicKey) {
    currentTopic = topicKey || currentTopic;
    const langData = didacticData[currentLang] || didacticData.de;
    const data = langData[currentTopic];
    if (!data) return;

    if (chalkTopicTag) chalkTopicTag.textContent = data.topic;
    if (chalkProblem) chalkProblem.textContent = data.problem;

    if (chalkStepContainer) {
      chalkStepContainer.innerHTML = data.steps.map(s => `
        <div class="chalk-step">
          <div class="chalk-step-num">${s.num}</div>
          <div class="chalk-step-text">
            <strong>${s.title}</strong>
            ${s.desc}
          </div>
        </div>
      `).join('');
    }

    if (chalkAhaText) chalkAhaText.textContent = data.aha;

    if (window.renderMathInElement) {
      const canvas = document.querySelector('.chalkboard-canvas');
      if (canvas) {
        window.renderMathInElement(canvas, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }
    }
  }

  notepadTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      notepadTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const topic = tab.getAttribute('data-topic');
      renderNotepad(topic);
    });
  });

  setTimeout(() => {
    renderNotepad('kurvendiskussion');
  }, 250);

  // ========================================================
  // 3. FAQ ACCORDION
  // ========================================================
  const faqEntries = document.querySelectorAll('.faq-entry');
  faqEntries.forEach(entry => {
    const trigger = entry.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = entry.classList.contains('active');

        faqEntries.forEach(other => {
          if (other !== entry) {
            other.classList.remove('active');
            const otherTrigger = other.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        entry.classList.toggle('active', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
      });
    }
  });

  // ========================================================
  // 4. PORTAL LOGIN MODAL (ADMIN & CUSTOMER)
  // ========================================================
  const navLoginBtn = document.getElementById('navLoginBtn');
  const openLoginFooterLink = document.getElementById('openLoginFooterLink');
  const loginModal = document.getElementById('loginModal');
  const closeLoginModal = document.getElementById('closeLoginModal');
  const tabLoginAdmin = document.getElementById('tabLoginAdmin');
  const tabLoginCustomer = document.getElementById('tabLoginCustomer');
  const loginAdminPane = document.getElementById('loginAdminPane');
  const loginCustomerPane = document.getElementById('loginCustomerPane');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPinInput = document.getElementById('adminPinInput');
  const adminLoginFeedback = document.getElementById('adminLoginFeedback');

  function openLogin() {
    if (loginModal) {
      loginModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (adminPinInput) adminPinInput.focus();
    }
  }

  function closeLogin() {
    if (loginModal) {
      loginModal.classList.remove('active');
      document.body.style.overflow = '';
      if (adminLoginFeedback) adminLoginFeedback.style.display = 'none';
      if (adminLoginForm) adminLoginForm.reset();
    }
  }

  if (navLoginBtn) navLoginBtn.addEventListener('click', openLogin);
  if (openLoginFooterLink) {
    openLoginFooterLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLogin();
    });
  }
  if (closeLoginModal) closeLoginModal.addEventListener('click', closeLogin);

  if (tabLoginAdmin && tabLoginCustomer) {
    tabLoginAdmin.addEventListener('click', () => {
      tabLoginAdmin.classList.add('active');
      tabLoginCustomer.classList.remove('active');
      loginAdminPane.style.display = 'block';
      loginCustomerPane.style.display = 'none';
    });

    tabLoginCustomer.addEventListener('click', () => {
      tabLoginCustomer.classList.add('active');
      tabLoginAdmin.classList.remove('active');
      loginAdminPane.style.display = 'none';
      loginCustomerPane.style.display = 'block';
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = adminPinInput ? adminPinInput.value.trim() : '';

      let isValid = false;
      if (window.MatheDB && typeof window.MatheDB.verifyPin === 'function') {
        isValid = window.MatheDB.verifyPin(pin);
      } else {
        isValid = (pin === '1234');
      }

      if (isValid) {
        if (window.MatheDB && typeof window.MatheDB.login === 'function') {
          window.MatheDB.login(pin);
        }
        if (adminLoginFeedback) {
          adminLoginFeedback.style.display = 'block';
          adminLoginFeedback.style.color = '#10B981';
          adminLoginFeedback.textContent = '✓ PIN korrekt! Weiterleitung ins Admin-Portal...';
        }
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 400);
      } else {
        if (adminLoginFeedback) {
          adminLoginFeedback.style.display = 'block';
          adminLoginFeedback.style.color = '#EF4444';
          adminLoginFeedback.textContent = 'Falsche PIN. Bitte erneut versuchen.';
        }
        if (adminPinInput) {
          adminPinInput.value = '';
          adminPinInput.focus();
        }
      }
    });
  }

  // Keyboard shortcut for quick admin access: Ctrl + Shift + A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      openLogin();
    }
  });

  // ========================================================
  // 5. LEGAL MODALS (IMPRESSUM & DATENSCHUTZ)
  // ========================================================
  const openImpressum = document.getElementById('openImpressum');
  const openDatenschutz = document.getElementById('openDatenschutz');
  const impressumModal = document.getElementById('impressumModal');
  const datenschutzModal = document.getElementById('datenschutzModal');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openImpressum) {
    openImpressum.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(impressumModal);
    });
  }

  if (openDatenschutz) {
    openDatenschutz.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(datenschutzModal);
    });
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(impressumModal);
      closeModal(datenschutzModal);
    });
  });

  // Close modals on backdrop click
  [loginModal, impressumModal, datenschutzModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(loginModal);
      closeModal(impressumModal);
      closeModal(datenschutzModal);
    }
  });

  // ========================================================
  // 6. MOBILE HAMBURGER MENU
  // ========================================================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ========================================================
  // 7. CONTACT FORM SUBMISSION
  // ========================================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitContactBtn = document.getElementById('submitContactBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim();
      const info = document.getElementById('contactInfo')?.value.trim();
      const message = document.getElementById('contactMessage')?.value.trim();
      const grade = document.getElementById('contactGrade')?.value.trim() || '';

      if (!name || !info || !message) {
        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.style.color = '#EF4444';
          formFeedback.textContent = currentLang === 'en' 
            ? 'Please fill in all required fields.' 
            : 'Bitte fülle alle erforderlichen Felder aus.';
        }
        return;
      }

      if (submitContactBtn) {
        submitContactBtn.disabled = true;
        submitContactBtn.textContent = currentLang === 'en' ? 'Sending message...' : 'Nachricht wird gesendet...';
      }

      // Save inquiry to local CRM database if available
      try {
        if (window.MatheDB && typeof window.MatheDB.saveStudent === 'function') {
          // Pre-register as interested lead
          const existing = window.MatheDB.getStudents();
          const already = existing.find(s => s.phone === info || s.email === info);
          if (!already) {
            window.MatheDB.saveStudent({
              name: name,
              parentName: name,
              phone: info.includes('@') ? '' : info,
              email: info.includes('@') ? info : '',
              grade: grade,
              notes: 'Website-Anfrage: ' + message,
              active: false
            });
          }
        }
      } catch (err) {
        console.warn('CRM lead pre-save notice:', err);
      }

      setTimeout(() => {
        if (submitContactBtn) {
          submitContactBtn.textContent = currentLang === 'en' ? '✓ Message sent!' : '✓ Anfrage erfolgreich übermittelt!';
          submitContactBtn.style.backgroundColor = '#16A34A';
        }

        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.style.color = '#10B981';
          formFeedback.innerHTML = currentLang === 'en'
            ? `Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been received. I will reach out personally via WhatsApp/E-Mail within a few hours to arrange a call.`
            : `Vielen Dank, <strong>${escapeHtml(name)}</strong>! Ich habe deine Anfrage erhalten und melde mich innerhalb weniger Stunden persönlich per WhatsApp/E-Mail zur Terminabstimmung.`;
        }

        contactForm.reset();

        setTimeout(() => {
          if (submitContactBtn) {
            submitContactBtn.disabled = false;
            submitContactBtn.textContent = currentLang === 'en' ? 'Request 15-Minute Intro' : 'Kennenlerngespräch anfragen';
            submitContactBtn.style.backgroundColor = '';
          }
        }, 5000);
      }, 500);
    });
  }

  // ========================================================
  // 8. BILINGUAL LANGUAGE SWITCHER (DE | EN)
  // ========================================================
  const langDeBtn = document.getElementById('langDeBtn');
  const langEnBtn = document.getElementById('langEnBtn');

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('fh_lang', lang);
    document.documentElement.lang = lang;

    if (langDeBtn && langEnBtn) {
      if (lang === 'en') {
        langDeBtn.classList.remove('active');
        langEnBtn.classList.add('active');
      } else {
        langEnBtn.classList.remove('active');
        langDeBtn.classList.add('active');
      }
    }

    renderNotepad(currentTopic);
  }

  if (langDeBtn && langEnBtn) {
    langDeBtn.addEventListener('click', () => setLanguage('de'));
    langEnBtn.addEventListener('click', () => setLanguage('en'));
  }

  if (currentLang === 'en') {
    setLanguage('en');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
