/**
 * FARID HÄDER — MATHEMATIK & MINT-COACHING
 * Interactions: Interactive blackboard, FAQ accordion, modals for legal notices,
 * and seamless bilingual switching (DE | EN).
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // 1. DIDACTIC NOTEPAD (INTERACTIVE CHALKBOARD DEMONSTRATION)
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

    // Render KaTeX formulas
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

  // Initial render
  setTimeout(() => {
    renderNotepad('kurvendiskussion');
  }, 250);

  // ========================================================
  // 2. FAQ ACCORDION
  // ========================================================
  const faqEntries = document.querySelectorAll('.faq-entry');
  faqEntries.forEach(entry => {
    const trigger = entry.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = entry.classList.contains('active');

        // Single-active accordion to maintain visual serenity
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
  // 3. LEGAL MODALS (IMPRESSUM & DATENSCHUTZ)
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

  // Close on backdrop click
  [impressumModal, datenschutzModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(impressumModal);
      closeModal(datenschutzModal);
    }
  });

  // ========================================================
  // 4. MOBILE HAMBURGER MENU
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
  // 5. CONTACT FORM SUBMISSION
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

      if (!name || !info || !message) {
        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.style.color = '#DC2626';
          formFeedback.textContent = currentLang === 'en' 
            ? 'Please fill in all required fields.' 
            : 'Bitte fülle alle markierten Felder aus.';
        }
        return;
      }

      if (submitContactBtn) {
        submitContactBtn.disabled = true;
        submitContactBtn.textContent = currentLang === 'en' ? 'Sending message...' : 'Nachricht wird gesendet...';
      }

      setTimeout(() => {
        if (submitContactBtn) {
          submitContactBtn.textContent = currentLang === 'en' ? '✓ Message sent!' : '✓ Nachricht übermittelt!';
          submitContactBtn.style.backgroundColor = '#16A34A';
          submitContactBtn.style.borderColor = '#16A34A';
        }

        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.style.color = '#15803D';
          formFeedback.innerHTML = currentLang === 'en'
            ? `Thank you, <strong>${escapeHtml(name)}</strong>! Your inquiry has been received. I will reach out personally within 24 hours.`
            : `Vielen Dank, <strong>${escapeHtml(name)}</strong>! Ich habe deine Anfrage erhalten und melde mich innerhalb von 24 Stunden persönlich bei dir.`;
        }

        contactForm.reset();

        setTimeout(() => {
          if (submitContactBtn) {
            submitContactBtn.disabled = false;
            submitContactBtn.textContent = currentLang === 'en' ? 'Request 15-Minute Intro' : 'Kennenlerngespräch anfragen';
            submitContactBtn.style.backgroundColor = '';
            submitContactBtn.style.borderColor = '';
          }
        }, 5000);
      }, 600);
    });
  }

  // ========================================================
  // 6. FREE SUCCESS GUIDE DOWNLOAD HANDLER
  // ========================================================
  const guideDownloadForm = document.getElementById('guideDownloadForm');
  const guideFeedback = document.getElementById('guideFeedback');

  if (guideDownloadForm) {
    guideDownloadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('guideEmail')?.value.trim();

      if (email) {
        try {
          const subscribers = JSON.parse(localStorage.getItem('fh_guide_subscribers') || '[]');
          subscribers.push({ email, timestamp: new Date().toISOString() });
          localStorage.setItem('fh_guide_subscribers', JSON.stringify(subscribers));
        } catch (err) {
          console.warn('Storage warning', err);
        }
      }

      if (guideFeedback) {
        guideFeedback.style.display = 'block';
        guideFeedback.style.color = '#15803D';
        guideFeedback.textContent = currentLang === 'en'
          ? '✓ Download started! Enjoy reading the guide.'
          : '✓ Download gestartet! Viel Erfolg beim Lesen des Leitfadens.';
      }

      window.open('Dokumente/Nachhilfe_Erfolgsguide.pdf', '_blank');
      guideDownloadForm.reset();
    });
  }

  // ========================================================
  // 7. BILINGUAL LANGUAGE SWITCHER (DE | EN)
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

    // Update dynamic text
    renderNotepad(currentTopic);

    // Update main hero and navigation when in English
    const heroTitle = document.querySelector('.hero-title');
    const heroLead = document.querySelector('.hero-lead');
    const heroBadge = document.querySelector('.hero-badge');
    const navCtaBtn = document.getElementById('navCtaBtn');

    if (lang === 'en') {
      if (heroTitle) {
        heroTitle.innerHTML = 'Mathematics is not a talent contest. It is a <em>logical language</em> anyone can master.';
      }
      if (heroLead) {
        heroLead.textContent = 'Patient 1-on-1 math coaching for middle school, high school, and Abitur exams. We address old gaps from the foundation up, remove homework stress from family life, and give unconventional minds (including ADHD) the time standard classrooms lack.';
      }
      if (heroBadge) {
        heroBadge.innerHTML = '<span class="hero-badge-dot"></span> School Year 2026/27 · 1-on-1 Sessions in Dietzenbach & Online';
      }
      if (navCtaBtn) {
        navCtaBtn.textContent = 'Book 15-Min. Call';
      }
    } else {
      if (heroTitle) {
        heroTitle.innerHTML = 'Mathematik ist kein Talentwettbewerb. Es ist eine <em>logische Sprache</em>, die jeder lernen kann.';
      }
      if (heroLead) {
        heroLead.textContent = 'Geduldiges 1-zu-1 Coaching für Mittelstufe, Oberstufe und Abitur. Wir schließen alte Wissenslücken von Grund auf, nehmen den Leistungsdruck aus dem Familienalltag und geben unkonventionellen Denkern (auch bei ADHS) die Zeit, die das normale Schulsystem nicht hat.';
      }
      if (heroBadge) {
        heroBadge.innerHTML = '<span class="hero-badge-dot"></span> Schuljahr 2026/27 · 1-zu-1 Plätze in Dietzenbach & Online';
      }
      if (navCtaBtn) {
        navCtaBtn.textContent = '15 Min. Kennenlernen';
      }
    }
  }

  if (langDeBtn && langEnBtn) {
    langDeBtn.addEventListener('click', () => setLanguage('de'));
    langEnBtn.addEventListener('click', () => setLanguage('en'));
  }

  // Restore saved language
  if (currentLang === 'en') {
    setLanguage('en');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
