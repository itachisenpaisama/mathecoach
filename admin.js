/**
 * MatheCoach Admin CRM & Dashboard Logic
 * Fully reactive with shared-db.js (Local-First + Live Sync)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const authScreen = document.getElementById('authScreen');
  const appLayout = document.getElementById('appLayout');
  const authForm = document.getElementById('authForm');
  const pinInput = document.getElementById('pinInput');
  const authError = document.getElementById('authError');
  const logoutBtn = document.getElementById('logoutBtn');
  const tabTitle = document.getElementById('tabTitle');
  const sidebar = document.getElementById('appSidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const themeToggleBtn = document.getElementById('adminThemeToggleBtn');
  const themeIcon = document.getElementById('adminThemeIcon');

  let currentTab = 'dashboard';

  // -------------------------------------------------------------
  // 1. AUTHENTICATION FLOW
  // -------------------------------------------------------------
  function checkAuth() {
    if (window.MatheDB && MatheDB.Auth.isAuthenticated()) {
      authScreen.style.display = 'none';
      appLayout.style.display = 'flex';
      initApp();
    } else {
      authScreen.style.display = 'flex';
      appLayout.style.display = 'none';
      setTimeout(() => pinInput && pinInput.focus(), 100);
    }
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = pinInput.value.trim();
      if (MatheDB.Auth.login(pin)) {
        authError.style.display = 'none';
        pinInput.value = '';
        checkAuth();
      } else {
        authError.style.display = 'block';
        pinInput.value = '';
        pinInput.focus();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Möchtest du dich wirklich abmelden?')) {
        MatheDB.Auth.logout();
        checkAuth();
      }
    });
  }

  // -------------------------------------------------------------
  // 2. THEME CONTROLLER
  // -------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem('mathecoach_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.innerHTML = '<use href="#icon-sun"/>';
    } else {
      themeIcon.innerHTML = '<use href="#icon-moon"/>';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('mathecoach_theme', next);
      updateThemeIcon(next);
    });
  }

  // -------------------------------------------------------------
  // 3. NAVIGATION & TABS
  // -------------------------------------------------------------
  const tabTitles = {
    dashboard: 'Übersicht & KPIs',
    students: 'Schülerkartei & Betreuung',
    sessions: 'Unterrichtsstunden & Termine',
    trips: 'Fahrtkosten & Travelcalc-Protokoll',
    invoices: 'Monatsabrechnung & Belege',
    settings: 'CRM-Einstellungen & Cloud-Sync'
  };

  const navItems = document.querySelectorAll('.sidebar-menu .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      switchTab(tab);
      // Close sidebar on mobile
      if (window.innerWidth <= 992 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });

  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  function switchTab(tabId) {
    currentTab = tabId;
    navItems.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.style.display = 'none';
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(`pane-${tabId}`);
    if (activePane) {
      activePane.style.display = 'block';
      activePane.classList.add('active');
    }

    if (tabTitle) {
      tabTitle.textContent = tabTitles[tabId] || 'MatheCoach CRM';
    }

    // Refresh content for that tab
    renderCurrentTab();
  }

  function renderCurrentTab() {
    switch (currentTab) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'students':
        renderStudentsTable();
        break;
      case 'sessions':
        renderSessionsTable();
        break;
      case 'trips':
        renderTripsTable();
        break;
      case 'invoices':
        initInvoiceSelectors();
        break;
      case 'settings':
        loadSettingsForm();
        break;
    }
  }

  // -------------------------------------------------------------
  // 4. DASHBOARD VIEW
  // -------------------------------------------------------------
  function renderDashboard() {
    const summary = MatheDB.Analytics.getSummary();

    // KPIs
    const kpiRevenue = document.getElementById('kpiRevenue');
    const kpiRevenueSub = document.getElementById('kpiRevenueSub');
    const kpiHours = document.getElementById('kpiHours');
    const kpiSessionsCount = document.getElementById('kpiSessionsCount');
    const kpiStudents = document.getElementById('kpiStudents');
    const kpiTravelCosts = document.getElementById('kpiTravelCosts');
    const kpiTravelKm = document.getElementById('kpiTravelKm');

    if (kpiRevenue) kpiRevenue.textContent = `${summary.totalRevenue.toFixed(2)} €`;
    if (kpiRevenueSub) kpiRevenueSub.textContent = `Bezahlt: ${summary.paidRevenue.toFixed(2)} € · Offen: ${summary.openRevenue.toFixed(2)} €`;
    if (kpiHours) kpiHours.textContent = `${summary.totalHours} h`;
    if (kpiSessionsCount) kpiSessionsCount.textContent = `${summary.sessionCount} Einheiten erfasst`;
    if (kpiStudents) kpiStudents.textContent = summary.activeStudentsCount;
    if (kpiTravelCosts) kpiTravelCosts.textContent = `${summary.totalTravelCosts.toFixed(2)} €`;
    if (kpiTravelKm) kpiTravelKm.textContent = `${summary.totalKm} km (${summary.tripCount} Fahrten)`;

    // Recent Sessions
    const recentTbody = document.getElementById('recentSessionsTbody');
    if (recentTbody) {
      const recent = MatheDB.Sessions.getAll().slice(0, 5);
      if (recent.length === 0) {
        recentTbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 1.5rem; color: var(--text-muted);">Noch keine Stunden erfasst.</td></tr>`;
      } else {
        recentTbody.innerHTML = recent.map(sess => {
          const statusBadge = getStatusBadge(sess.status);
          const formattedDate = formatDate(sess.date);
          return `
            <tr>
              <td><strong>${formattedDate}</strong><div style="font-size:0.78rem;color:var(--text-muted);">${sess.time || ''}</div></td>
              <td><strong>${escapeHtml(sess.studentName || '—')}</strong></td>
              <td>
                <div style="font-weight: 500;">${escapeHtml(sess.topics || 'Allgemeine Förderung')}</div>
                <div style="font-size:0.78rem;color:var(--text-muted);">${getLocationLabel(sess.locationType)}</div>
              </td>
              <td><strong>${(parseFloat(sess.totalAmount) || 0).toFixed(2)} €</strong></td>
              <td>${statusBadge}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="window.editSession('${sess.id}')" title="Bearbeiten">
                  <svg class="icon" style="width:0.9rem;height:0.9rem;"><use href="#icon-edit"/></svg>
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Quick Students List
    const quickList = document.getElementById('quickStudentsList');
    if (quickList) {
      const students = MatheDB.Students.getAll({ activeOnly: true }).slice(0, 6);
      if (students.length === 0) {
        quickList.innerHTML = `<div style="color:var(--text-muted); font-size:0.88rem;">Noch keine aktiven Schüler vorhanden.</div>`;
      } else {
        quickList.innerHTML = students.map(st => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--border);">
            <div>
              <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">${escapeHtml(st.name)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(st.grade || '—')} · ${st.rate || 65} €/90min</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.quickLogSessionFor('${st.id}')" title="Stunde für ${escapeHtml(st.name)} eintragen">
              <svg class="icon" style="width:0.85rem;height:0.85rem;"><use href="#icon-plus"/></svg> Stunde
            </button>
          </div>
        `).join('');
      }
    }
  }

  // -------------------------------------------------------------
  // 5. STUDENTS MANAGEMENT
  // -------------------------------------------------------------
  const studentSearchInput = document.getElementById('studentSearchInput');
  if (studentSearchInput) {
    studentSearchInput.addEventListener('input', () => {
      renderStudentsTable();
    });
  }

  function renderStudentsTable() {
    const tbody = document.getElementById('studentsTableTbody');
    if (!tbody) return;

    const query = studentSearchInput ? studentSearchInput.value : '';
    const students = MatheDB.Students.getAll({ search: query });

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-muted);">Keine Schüler gefunden.</td></tr>`;
      return;
    }

    tbody.innerHTML = students.map(st => {
      const adhsBadge = st.neurodivergentNotes 
        ? `<span class="badge badge-adhs" title="${escapeHtml(st.neurodivergentNotes)}">ADHS / Fokus</span>`
        : `<span style="color:var(--text-muted); font-size:0.8rem;">—</span>`;

      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--text-main); font-size: 0.92rem;">
              ${escapeHtml(st.name)}
              ${!st.active ? `<span class="badge badge-inactive" style="margin-left:0.35rem; font-size: 0.68rem; padding: 0.12rem 0.45rem;">Inaktiv</span>` : ''}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
              ${escapeHtml(st.grade || '—')}${st.school ? ` · ${escapeHtml(st.school)}` : ''}
            </div>
          </td>
          <td>
            ${st.parentName ? `<div style="font-weight: 500; font-size: 0.85rem; color: var(--text-main);">${escapeHtml(st.parentName)}</div>` : ''}
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.78rem; margin-top: 0.15rem;">
              ${st.phone ? `<a href="tel:${escapeHtml(st.phone)}" style="color:var(--primary); text-decoration:none; font-weight: 500;">📞 ${escapeHtml(st.phone)}</a>` : ''}
              ${st.email ? `<span style="color:var(--text-muted);">${escapeHtml(st.email)}</span>` : ''}
              ${!st.parentName && !st.phone && !st.email ? '<span style="color:var(--text-muted);">—</span>' : ''}
            </div>
          </td>
          <td>
            <div style="margin-bottom: 0.2rem;">
              <span class="badge badge-location" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">${getLocationLabel(st.preferredLocation)}</span>
            </div>
            <div style="max-width: 170px; font-size: 0.78rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(st.address || '')}">
              ${escapeHtml(st.address || '—')}
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${st.rate || 65} € <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">/ 90m</span></div>
            ${st.travelCostDefault ? `<div style="font-size:0.75rem; color:var(--text-muted);">+ ${st.travelCostDefault} € Anfahrt</div>` : ''}
          </td>
          <td>${adhsBadge}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.35rem; justify-content: flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="window.editStudent('${st.id}')" title="Bearbeiten" style="padding: 0.35rem 0.55rem;">
                <svg class="icon" style="width:0.85rem;height:0.85rem;"><use href="#icon-edit"/></svg>
              </button>
              <button class="btn btn-danger btn-sm" onclick="window.deleteStudent('${st.id}')" title="Löschen" style="padding: 0.35rem 0.55rem;">
                <svg class="icon" style="width:0.85rem;height:0.85rem;"><use href="#icon-trash"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Student Modal Logic
  const studentModal = document.getElementById('studentModal');
  const studentForm = document.getElementById('studentForm');
  const studentModalTitle = document.getElementById('studentModalTitle');

  function openStudentModal(studentId = null) {
    if (!studentForm) return;
    studentForm.reset();
    document.getElementById('studentEditId').value = '';

    if (studentId) {
      const student = MatheDB.Students.getById(studentId);
      if (student) {
        studentModalTitle.textContent = 'Schüler bearbeiten';
        document.getElementById('studentEditId').value = student.id;
        document.getElementById('studName').value = student.name || '';
        document.getElementById('studParent').value = student.parentName || '';
        document.getElementById('studPhone').value = student.phone || '';
        document.getElementById('studEmail').value = student.email || '';
        document.getElementById('studAddress').value = student.address || '';
        document.getElementById('studGrade').value = student.grade || '';
        document.getElementById('studSubject').value = student.subject || 'Mathematik';
        document.getElementById('studRate').value = student.rate || 65;
        document.getElementById('studTravelDefault').value = student.travelCostDefault || 0;
        document.getElementById('studLocationPref').value = student.preferredLocation || 'office';
        document.getElementById('studNeuroNotes').value = student.neurodivergentNotes || '';
        document.getElementById('studNotes').value = student.notes || '';
        document.getElementById('studActive').checked = student.active !== false;
      }
    } else {
      studentModalTitle.textContent = 'Neuen Schüler anlegen';
      const settings = MatheDB.Settings.get();
      document.getElementById('studRate').value = settings.defaultHourlyRate || 60;
      document.getElementById('studSubject').value = 'Mathematik';
      document.getElementById('studActive').checked = true;
    }

    if (studentModal) studentModal.classList.remove('hidden');
  }

  if (studentForm) {
    studentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('studentEditId').value.trim();
      const data = {
        name: document.getElementById('studName').value.trim(),
        parentName: document.getElementById('studParent').value.trim(),
        phone: document.getElementById('studPhone').value.trim(),
        email: document.getElementById('studEmail').value.trim(),
        address: document.getElementById('studAddress').value.trim(),
        grade: document.getElementById('studGrade').value.trim(),
        subject: document.getElementById('studSubject').value.trim(),
        rate: parseFloat(document.getElementById('studRate').value) || 60,
        travelCostDefault: parseFloat(document.getElementById('studTravelDefault').value) || 0,
        preferredLocation: document.getElementById('studLocationPref').value,
        neurodivergentNotes: document.getElementById('studNeuroNotes').value.trim(),
        notes: document.getElementById('studNotes').value.trim(),
        active: document.getElementById('studActive').checked
      };

      if (id) data.id = id;

      MatheDB.Students.save(data);
      if (studentModal) studentModal.classList.add('hidden');
      renderStudentsTable();
      renderDashboard();
      initInvoiceSelectors();
    });
  }

  window.editStudent = (id) => openStudentModal(id);
  window.deleteStudent = (id) => {
    const student = MatheDB.Students.getById(id);
    if (!student) return;
    if (confirm(`Möchtest du Schüler "${student.name}" wirklich löschen? Alle zugehörigen Stunden bleiben im Archiv.`)) {
      MatheDB.Students.delete(id);
      renderStudentsTable();
      renderDashboard();
    }
  };

  // -------------------------------------------------------------
  // 6. SESSIONS MANAGEMENT
  // -------------------------------------------------------------
  const sessionMonthFilter = document.getElementById('sessionMonthFilter');
  const sessionStudentFilter = document.getElementById('sessionStudentFilter');

  function initSessionFilters() {
    if (!sessionMonthFilter || !sessionStudentFilter) return;

    // Populate students filter
    const students = MatheDB.Students.getAll();
    const currentStudentVal = sessionStudentFilter.value;
    sessionStudentFilter.innerHTML = '<option value="">Alle Schüler</option>' +
      students.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
    if (currentStudentVal) sessionStudentFilter.value = currentStudentVal;

    // Populate months filter
    const months = new Set();
    const now = new Date();
    const curYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    months.add(curYm);

    MatheDB.Sessions.getAll().forEach(s => {
      if (s.date && s.date.length >= 7) {
        months.add(s.date.substring(0, 7));
      }
    });

    const sortedMonths = Array.from(months).sort().reverse();
    const curMonthVal = sessionMonthFilter.value;
    sessionMonthFilter.innerHTML = '<option value="">Alle Monate</option>' +
      sortedMonths.map(ym => `<option value="${ym}">${formatYearMonth(ym)}</option>`).join('');
    if (curMonthVal) {
      sessionMonthFilter.value = curMonthVal;
    } else {
      sessionMonthFilter.value = curYm; // Default to current month
    }
  }

  if (sessionMonthFilter) sessionMonthFilter.addEventListener('change', () => renderSessionsTable());
  if (sessionStudentFilter) sessionStudentFilter.addEventListener('change', () => renderSessionsTable());

  function renderSessionsTable() {
    const tbody = document.getElementById('sessionsTableTbody');
    if (!tbody) return;

    initSessionFilters();

    const month = sessionMonthFilter ? sessionMonthFilter.value : '';
    const studentId = sessionStudentFilter ? sessionStudentFilter.value : '';

    const sessions = MatheDB.Sessions.getAll({ month, studentId });

    if (sessions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-muted);">Keine Stunden für diesen Zeitraum gefunden.</td></tr>`;
      return;
    }

    tbody.innerHTML = sessions.map(sess => {
      const statusBadge = getStatusBadge(sess.status, sess.id);
      const formattedDate = formatDate(sess.date);
      const fee = parseFloat(sess.sessionFee) || 0;
      const travel = parseFloat(sess.travelCost) || 0;
      const total = fee + travel;
      const duration = sess.durationMinutes || 90;

      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--text-main); font-size: 0.92rem;">${formattedDate}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top: 0.1rem;">${sess.time || '16:00'} Uhr · ${duration} Min.</div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(sess.studentName || '—')}</div>
            <div style="margin-top: 0.2rem;">
              <span class="badge badge-location" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">${getLocationLabel(sess.locationType)}</span>
            </div>
          </td>
          <td>
            <div style="font-weight: 500; color: var(--text-main); font-size: 0.88rem;">${escapeHtml(sess.topics || 'Unterricht')}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(sess.subject || 'Mathematik')}</div>
          </td>
          <td style="text-align: right;">
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${total.toFixed(2)} €</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${fee.toFixed(0)} €${travel > 0 ? ` + ${travel.toFixed(0)} € F.` : ''}</div>
          </td>
          <td style="text-align: center;">${statusBadge}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.35rem; justify-content: flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="window.editSession('${sess.id}')" title="Bearbeiten" style="padding: 0.35rem 0.55rem;">
                <svg class="icon" style="width:0.85rem;height:0.85rem;"><use href="#icon-edit"/></svg>
              </button>
              <button class="btn btn-danger btn-sm" onclick="window.deleteSession('${sess.id}')" title="Löschen" style="padding: 0.35rem 0.55rem;">
                <svg class="icon" style="width:0.85rem;height:0.85rem;"><use href="#icon-trash"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Session Modal Logic
  const sessionModal = document.getElementById('sessionModal');
  const sessionForm = document.getElementById('sessionForm');
  const sessionModalTitle = document.getElementById('sessionModalTitle');
  const sessStudentSelect = document.getElementById('sessStudentSelect');

  function openSessionModal(sessionId = null, prefilledStudentId = null) {
    if (!sessionForm) return;
    sessionForm.reset();
    document.getElementById('sessionEditId').value = '';

    // Populate student select
    const students = MatheDB.Students.getAll({ activeOnly: true });
    sessStudentSelect.innerHTML = '<option value="">Schüler wählen...</option>' +
      students.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${s.grade || 'Schüler'})</option>`).join('');

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    document.getElementById('sessDate').value = today;
    document.getElementById('sessTime').value = '16:00';
    document.getElementById('sessDuration').value = '90';
    document.getElementById('sessSubject').value = 'Mathematik';
    document.getElementById('sessStatus').value = 'completed';

    if (sessionId) {
      const session = MatheDB.Sessions.getById(sessionId);
      if (session) {
        sessionModalTitle.textContent = 'Unterrichtsstunde bearbeiten';
        document.getElementById('sessionEditId').value = session.id;
        sessStudentSelect.value = session.studentId || '';
        document.getElementById('sessDate').value = session.date || today;
        document.getElementById('sessTime').value = session.time || '16:00';
        document.getElementById('sessDuration').value = String(session.durationMinutes || 90);
        document.getElementById('sessSubject').value = session.subject || 'Mathematik';
        document.getElementById('sessTopics').value = session.topics || '';
        document.getElementById('sessLocationType').value = session.locationType || 'office';
        document.getElementById('sessTravelCost').value = session.travelCost || 0;
        document.getElementById('sessFee').value = session.sessionFee || 65;
        document.getElementById('sessStatus').value = session.status || 'completed';
        document.getElementById('sessNotes').value = session.notes || '';
      }
    } else if (prefilledStudentId) {
      sessionModalTitle.textContent = 'Neue Unterrichtsstunde erfassen';
      sessStudentSelect.value = prefilledStudentId;
      applyStudentDefaultsToSession(prefilledStudentId);
    } else {
      sessionModalTitle.textContent = 'Neue Unterrichtsstunde erfassen';
      const settings = MatheDB.Settings.get();
      document.getElementById('sessFee').value = settings.defaultHourlyRate || 60;
    }

    if (sessionModal) sessionModal.classList.remove('hidden');
  }

  function applyStudentDefaultsToSession(studentId) {
    if (!studentId) return;
    const student = MatheDB.Students.getById(studentId);
    if (!student) return;

    if (student.rate) {
      document.getElementById('sessFee').value = student.rate;
    }
    if (student.preferredLocation) {
      document.getElementById('sessLocationType').value = student.preferredLocation;
    }
    if (student.preferredLocation === 'home' && student.travelCostDefault) {
      document.getElementById('sessTravelCost').value = student.travelCostDefault;
    } else {
      document.getElementById('sessTravelCost').value = 0;
    }
    if (student.subject) {
      document.getElementById('sessSubject').value = student.subject;
    }
  }

  if (sessStudentSelect) {
    sessStudentSelect.addEventListener('change', () => {
      applyStudentDefaultsToSession(sessStudentSelect.value);
    });
  }

  if (sessionForm) {
    sessionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('sessionEditId').value.trim();
      const studentId = sessStudentSelect.value;
      const student = MatheDB.Students.getById(studentId);

      const fee = parseFloat(document.getElementById('sessFee').value) || 0;
      const travel = parseFloat(document.getElementById('sessTravelCost').value) || 0;

      const data = {
        studentId: studentId,
        studentName: student ? student.name : '',
        date: document.getElementById('sessDate').value,
        time: document.getElementById('sessTime').value,
        durationMinutes: parseInt(document.getElementById('sessDuration').value, 10) || 90,
        subject: document.getElementById('sessSubject').value.trim(),
        topics: document.getElementById('sessTopics').value.trim(),
        locationType: document.getElementById('sessLocationType').value,
        address: student ? student.address : '',
        travelCost: travel,
        sessionFee: fee,
        totalAmount: fee + travel,
        status: document.getElementById('sessStatus').value,
        notes: document.getElementById('sessNotes').value.trim()
      };

      if (id) data.id = id;

      MatheDB.Sessions.save(data);
      if (sessionModal) sessionModal.classList.add('hidden');
      renderSessionsTable();
      renderDashboard();
    });
  }

  window.editSession = (id) => openSessionModal(id);
  window.quickLogSessionFor = (studentId) => {
    switchTab('sessions');
    openSessionModal(null, studentId);
  };
  window.deleteSession = (id) => {
    if (confirm('Möchtest du diese Unterrichtseinheit wirklich löschen?')) {
      MatheDB.Sessions.delete(id);
      renderSessionsTable();
      renderDashboard();
    }
  };
  window.toggleSessionStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'paid' ? 'completed' : 'paid';
    MatheDB.Sessions.updateStatus(id, nextStatus);
    renderSessionsTable();
    renderDashboard();
  };

  // -------------------------------------------------------------
  // 7. TRIPS & TRAVELCALC LOGBOOK VIEW
  // -------------------------------------------------------------
  function renderTripsTable() {
    const tbody = document.getElementById('tripsTableTbody');
    if (!tbody) return;

    const trips = MatheDB.Trips.getAll();

    if (trips.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center" style="padding: 2rem; color: var(--text-muted);">
            Noch keine Fahrten synchronisiert. Starte die <a href="App/Travelcalc/index.html" target="_blank" style="color:var(--primary); font-weight:600;">Travelcalc App</a>, um Strecken zu berechnen.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = trips.map(t => {
      const formattedDate = formatDate(t.date);
      const km = parseFloat(t.distanceKm) || 0;
      const cost = parseFloat(t.totalCost) || 0;

      return `
        <tr>
          <td><strong>${formattedDate}</strong></td>
          <td>
            <strong>${escapeHtml(t.studentName || t.purpose || 'Fahrt zu Schüler')}</strong>
            ${t.sessionId ? `<div style="font-size:0.78rem;color:var(--primary);">Verknüpft mit Stunde</div>` : ''}
          </td>
          <td><span style="font-size:0.85rem;color:var(--text-muted);">${escapeHtml(t.origin || 'Dietzenbach')}</span></td>
          <td><span style="font-size:0.85rem;font-weight:500;">${escapeHtml(t.destination || '—')}</span></td>
          <td><strong>${km.toFixed(1)} km</strong></td>
          <td>${t.isRoundTrip !== false ? '<span class="badge badge-roundtrip">Hin & Rück</span>' : '<span class="badge badge-subtle">Einfach</span>'}</td>
          <td><strong style="color:var(--text-main); font-size:1.05rem;">${cost.toFixed(2)} €</strong></td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="window.deleteTrip('${t.id}')" title="Fahrt löschen">
              <svg class="icon" style="width:0.9rem;height:0.9rem;"><use href="#icon-trash"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.deleteTrip = (id) => {
    if (confirm('Fahrt wirklich aus dem Protokoll entfernen?')) {
      MatheDB.Trips.delete(id);
      renderTripsTable();
      renderDashboard();
    }
  };

  // -------------------------------------------------------------
  // 8. INVOICE GENERATOR & PRINT VIEW
  // -------------------------------------------------------------
  const invoiceStudentSelect = document.getElementById('invoiceStudentSelect');
  const invoiceMonthSelect = document.getElementById('invoiceMonthSelect');
  const btnGenerateInvoice = document.getElementById('btnGenerateInvoice');
  const invoicePreviewArea = document.getElementById('invoicePreviewArea');

  function initInvoiceSelectors() {
    if (!invoiceStudentSelect) return;
    const students = MatheDB.Students.getAll();
    invoiceStudentSelect.innerHTML = '<option value="">-- Schüler auswählen --</option>' +
      students.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');

    if (invoiceMonthSelect && !invoiceMonthSelect.value) {
      const now = new Date();
      invoiceMonthSelect.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
  }

  if (btnGenerateInvoice) {
    btnGenerateInvoice.addEventListener('click', () => {
      const studentId = invoiceStudentSelect.value;
      const month = invoiceMonthSelect.value;

      if (!studentId) {
        alert('Bitte wähle zuerst einen Schüler aus.');
        return;
      }
      if (!month) {
        alert('Bitte wähle einen Monat aus.');
        return;
      }

      generateInvoicePreview(studentId, month);
    });
  }

  function generateInvoicePreview(studentId, month) {
    const student = MatheDB.Students.getById(studentId);
    if (!student) return;

    const sessions = MatheDB.Sessions.getAll({ studentId, month });
    const trips = MatheDB.Trips.getAll({ studentId, month });

    const totalSessionFee = sessions.reduce((sum, s) => sum + (parseFloat(s.sessionFee) || 0), 0);
    const totalTravelFee = sessions.reduce((sum, s) => sum + (parseFloat(s.travelCost) || 0), 0);
    const grandTotal = totalSessionFee + totalTravelFee;

    const invDate = new Date().toLocaleDateString('de-DE');
    const invNumber = `MC-${month.replace('-', '')}-${student.name.replace(/\s+/g, '').substring(0, 4).toUpperCase()}`;

    let sessionsRowsHtml = '';
    if (sessions.length === 0) {
      sessionsRowsHtml = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:#64748b;">In diesem Monat wurden keine Stunden für ${escapeHtml(student.name)} erfasst.</td></tr>`;
    } else {
      sessionsRowsHtml = sessions.map((s, idx) => {
        const fee = parseFloat(s.sessionFee) || 0;
        const travel = parseFloat(s.travelCost) || 0;
        return `
          <tr>
            <td style="padding: 10px; width: 32px;">${idx + 1}</td>
            <td style="padding: 10px; width: 150px;">
              <strong>${formatDate(s.date)}</strong> (${s.time || '16:00'})<br>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${getLocationLabel(s.locationType)}</span>
            </td>
            <td style="padding: 10px;">
              <div style="font-weight: 600;">${escapeHtml(s.subject || 'Mathematik')}</div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(s.topics || 'Individuelle Förderung')}</div>
            </td>
            <td style="padding: 10px; text-align: center; width: 90px;">${s.durationMinutes || 90} Min.</td>
            <td style="padding: 10px; text-align: right; width: 120px; font-weight: 600;">
              ${fee.toFixed(2)} €
              ${travel > 0 ? `<div style="font-size:0.75rem; color:var(--text-muted); font-weight: normal;">+ ${travel.toFixed(2)} € Fahrt</div>` : ''}
            </td>
          </tr>
        `;
      }).join('');
    }

    const html = `
      <div class="printable-invoice">
        <!-- Header -->
        <div class="invoice-header">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 0.4rem;">
              <span style="font-size:1.55rem; font-weight:800; color:var(--primary); font-family:var(--font-heading);">∑ MatheCoach</span>
            </div>
            <div style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.45;">
              Farid — Individuelle Mathematikförderung & ADHS-Coaching<br>
              Dietzenbach & Rhein-Main-Gebiet
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="font-size: 1.35rem; margin: 0; font-family:var(--font-heading);">MONATSABRECHNUNG</h2>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">Beleg-Nr.: <strong style="color:var(--text-main);">${invNumber}</strong></div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Datum: <span style="color:var(--text-sec);">${invDate}</span></div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Abrechnungsmonat: <strong style="color:var(--primary);">${formatYearMonth(month)}</strong></div>
          </div>
        </div>

        <!-- Recipient & Details -->
        <div class="invoice-boxes-grid">
          <div class="invoice-box">
            <div style="font-size: 0.74rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 0.35rem; letter-spacing: 0.05em;">Schüler / Empfänger</div>
            <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">${escapeHtml(student.name)}</div>
            ${student.parentName ? `<div style="font-size: 0.9rem; color: var(--text-sec);">${escapeHtml(student.parentName)}</div>` : ''}
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">${escapeHtml(student.address || 'Dietzenbach')}</div>
            ${student.phone ? `<div style="font-size: 0.82rem; color: var(--primary); margin-top: 0.2rem;">Tel: ${escapeHtml(student.phone)}</div>` : ''}
          </div>

          <div class="invoice-box" style="display:flex; flex-direction:column; justify-content:center; gap:0.35rem;">
            <div style="font-size: 0.85rem; color: var(--text-muted);">Gehaltene Einheiten: <strong style="color:var(--text-main);">${sessions.length}</strong></div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Unterrichtszeit gesamt: <strong style="color:var(--text-main);">${(sessions.length * 1.5).toFixed(1)} Stunden</strong></div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Fahrtpauschalen erfasst: <strong style="color:var(--text-main);">${totalTravelFee.toFixed(2)} €</strong></div>
          </div>
        </div>

        <!-- Sessions Table -->
        <div class="table-responsive" style="margin-bottom: 1.75rem;">
          <table class="data-table invoice-table">
            <thead>
              <tr>
                <th style="width: 32px;">#</th>
                <th style="width: 150px;">Datum & Ort</th>
                <th>Fach & Behandelte Themen</th>
                <th style="text-align: center; width: 90px;">Dauer</th>
                <th style="text-align: right; width: 120px;">Betrag</th>
              </tr>
            </thead>
            <tbody>
              ${sessionsRowsHtml}
            </tbody>
          </table>
        </div>

        <!-- Totals Calculation -->
        <div style="display:flex; justify-content:flex-end; margin-bottom: 1.75rem;">
          <div class="invoice-totals-box">
            <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem; font-size: 0.9rem; color: var(--text-muted);">
              <span>Zwischensumme Unterricht:</span>
              <span style="font-weight:600; color:var(--text-main);">${totalSessionFee.toFixed(2)} €</span>
            </div>
            ${totalTravelFee > 0 ? `
              <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem; font-size: 0.9rem; color: var(--text-muted);">
                <span>Fahrtkosten / Anfahrt:</span>
                <span style="font-weight:600; color:var(--text-main);">${totalTravelFee.toFixed(2)} €</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; padding-top: 0.65rem; border-top: 2px solid var(--border); font-size: 1.18rem; font-weight: 800; color: var(--text-main); margin-top:0.4rem;">
              <span>Gesamtbetrag:</span>
              <span style="color: var(--primary);">${grandTotal.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <!-- Tax / Note Footer -->
        <div class="invoice-footer-notes">
          <p style="margin: 0 0 0.35rem 0;">
            Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung) bzw. steuerfreie Nachhilfe-/Unterrichtsleistung nach § 4 Nr. 21 UStG.
          </p>
          <p style="margin: 0;">
            Vielen Dank für die angenehme und vertrauensvolle Zusammenarbeit! Bei Rückfragen oder Anpassungen stehe ich jederzeit gerne zur Verfügung.
          </p>
        </div>

        <!-- Action Print Button inside Preview (Hidden on print) -->
        <div class="no-print" style="margin-top: 1.75rem; display: flex; gap: 0.8rem; justify-content: flex-end;">
          <button class="btn btn-primary" onclick="window.print()">
            <svg class="icon" style="width: 1rem; height: 1rem;"><use href="#icon-file-text"/></svg> Jetzt Drucken / Als PDF speichern
          </button>
        </div>

      </div>
    `;

    invoicePreviewArea.innerHTML = html;
    invoicePreviewArea.style.display = 'block';
    invoicePreviewArea.scrollIntoView({ behavior: 'smooth' });
  }

  // -------------------------------------------------------------
  // 9. SETTINGS & CLOUD SYNC & BACKUP
  // -------------------------------------------------------------
  function loadSettingsForm() {
    const settings = MatheDB.Settings.get();
    const defaultRateInput = document.getElementById('settingDefaultRate');
    const defaultKmRateInput = document.getElementById('settingDefaultKmRate');
    const cloudSyncCheck = document.getElementById('cloudSyncEnabled');
    const supabaseUrl = document.getElementById('supabaseUrlInput');
    const supabaseKey = document.getElementById('supabaseKeyInput');

    if (defaultRateInput) defaultRateInput.value = settings.defaultHourlyRate || 60;
    if (defaultKmRateInput) defaultKmRateInput.value = settings.defaultRatePerKm || 0.50;

    if (cloudSyncCheck && settings.cloudSync) {
      cloudSyncCheck.checked = !!settings.cloudSync.enabled;
    }
    if (supabaseUrl && settings.cloudSync) {
      supabaseUrl.value = settings.cloudSync.url || '';
    }
    if (supabaseKey && settings.cloudSync) {
      supabaseKey.value = settings.cloudSync.anonKey || '';
    }
  }

  // Change PIN
  const btnChangePin = document.getElementById('btnChangePin');
  if (btnChangePin) {
    btnChangePin.addEventListener('click', () => {
      const oldPin = document.getElementById('oldPinInput').value;
      const newPin = document.getElementById('newPinInput').value;
      const status = document.getElementById('pinStatusMsg');

      const result = MatheDB.Auth.setNewPin(oldPin, newPin);
      if (result.success) {
        status.style.color = 'var(--primary)';
        status.textContent = '✓ PIN erfolgreich aktualisiert!';
        document.getElementById('oldPinInput').value = '';
        document.getElementById('newPinInput').value = '';
      } else {
        status.style.color = 'var(--danger)';
        status.textContent = result.message || 'Fehler beim Ändern der PIN.';
      }
    });
  }

  // Save Default Rates
  const btnSaveRates = document.getElementById('btnSaveRates');
  if (btnSaveRates) {
    btnSaveRates.addEventListener('click', () => {
      const settings = MatheDB.Settings.get();
      settings.defaultHourlyRate = parseFloat(document.getElementById('settingDefaultRate').value) || 60;
      settings.defaultRatePerKm = parseFloat(document.getElementById('settingDefaultKmRate').value) || 0.50;
      MatheDB.Settings.save(settings);
      alert('Standard-Konditionen wurden gespeichert!');
    });
  }

  // Save Cloud Sync
  const btnSaveCloudSync = document.getElementById('btnSaveCloudSync');
  if (btnSaveCloudSync) {
    btnSaveCloudSync.addEventListener('click', async () => {
      const status = document.getElementById('cloudSyncStatusMsg');
      const settings = MatheDB.Settings.get();
      settings.cloudSync = settings.cloudSync || {};
      settings.cloudSync.enabled = document.getElementById('cloudSyncEnabled').checked;
      settings.cloudSync.url = document.getElementById('supabaseUrlInput').value.trim();
      settings.cloudSync.anonKey = document.getElementById('supabaseKeyInput').value.trim();

      MatheDB.Settings.save(settings);

      if (settings.cloudSync.enabled) {
        status.style.color = 'var(--primary)';
        status.textContent = 'Verbindung wird getestet...';
        try {
          await MatheDB.CloudSync.sync();
          status.textContent = '✓ Cloud-Sync erfolgreich verbunden!';
        } catch (err) {
          status.style.color = 'var(--danger)';
          status.textContent = 'Warnung: ' + err.message;
        }
      } else {
        status.style.color = 'var(--text-muted)';
        status.textContent = 'Cloud-Synchronisation ist deaktiviert (Local-First Modus aktiv).';
      }
    });
  }

  // Backup Export
  const btnExportBackup = document.getElementById('btnExportBackup');
  if (btnExportBackup) {
    btnExportBackup.addEventListener('click', () => {
      const json = MatheDB.Backup.exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mathecoach_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Backup Import
  const importBackupFile = document.getElementById('importBackupFile');
  if (importBackupFile) {
    importBackupFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = MatheDB.Backup.importJSON(evt.target.result);
        if (result.success) {
          alert('✓ Backup erfolgreich eingespielt!');
          renderCurrentTab();
        } else {
          alert('Fehler beim Einspielen des Backups: ' + result.error);
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset Database
  const btnResetDatabase = document.getElementById('btnResetDatabase');
  if (btnResetDatabase) {
    btnResetDatabase.addEventListener('click', () => {
      if (confirm('ACHTUNG: Möchtest du wirklich alle CRM-Daten auf den Standard-Zustand zurücksetzen? Dies kann nicht rückgängig gemacht werden.')) {
        MatheDB.Backup.resetAllData();
        alert('Datenbank wurde zurückgesetzt.');
        renderCurrentTab();
      }
    });
  }

  // -------------------------------------------------------------
  // 10. MODAL UTILITIES & EVENT BINDINGS
  // -------------------------------------------------------------
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const target = document.getElementById(modalId);
      if (target) target.classList.add('hidden');
    });
  });

  // Modal backdrop click to close
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // Quick Action Buttons in Topbar / Dashboard
  const btnQuickAddSession = document.getElementById('btnQuickAddSession');
  const btnQuickAddStudent = document.getElementById('btnQuickAddStudent');
  const btnDashNewSession = document.getElementById('btnDashNewSession');
  const btnDashNewStudent = document.getElementById('btnDashNewStudent');
  const btnAddStudentModalOpen = document.getElementById('btnAddStudentModalOpen');
  const btnAddSessionModalOpen = document.getElementById('btnAddSessionModalOpen');

  if (btnQuickAddSession) btnQuickAddSession.addEventListener('click', () => openSessionModal());
  if (btnQuickAddStudent) btnQuickAddStudent.addEventListener('click', () => openStudentModal());
  if (btnDashNewSession) btnDashNewSession.addEventListener('click', () => openSessionModal());
  if (btnDashNewStudent) btnDashNewStudent.addEventListener('click', () => openStudentModal());
  if (btnAddStudentModalOpen) btnAddStudentModalOpen.addEventListener('click', () => openStudentModal());
  if (btnAddSessionModalOpen) btnAddSessionModalOpen.addEventListener('click', () => openSessionModal());

  // -------------------------------------------------------------
  // 11. REACTIVE DATABASE SYNC
  // -------------------------------------------------------------
  MatheDB.subscribe((event) => {
    // Refresh current view when database changes anywhere
    renderCurrentTab();
  });

  // -------------------------------------------------------------
  // 12. HELPER FUNCTIONS
  // -------------------------------------------------------------
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  function formatYearMonth(ymStr) {
    if (!ymStr) return '';
    const parts = ymStr.split('-');
    if (parts.length === 2) {
      const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
      const mIdx = parseInt(parts[1], 10) - 1;
      return `${months[mIdx] || parts[1]} ${parts[0]}`;
    }
    return ymStr;
  }

  function getLocationLabel(type) {
    switch (type) {
      case 'home': return '🏠 Schüler Zuhause';
      case 'office': return '🏢 Büroraum Dietzenbach';
      case 'online': return '💻 Online (Tablet)';
      default: return '📍 Vor Ort';
    }
  }

  function getStatusBadge(status, sessionId = null) {
    const clickable = sessionId ? `onclick="window.toggleSessionStatus('${sessionId}', '${status}')" style="cursor:pointer;" title="Klicken zum Umschalten"` : '';
    switch (status) {
      case 'paid':
        return `<span class="badge badge-paid" ${clickable}>✓ Bezahlt</span>`;
      case 'completed':
        return `<span class="badge badge-completed" ${clickable}>Gehalten (Offen)</span>`;
      case 'planned':
        return `<span class="badge badge-planned" ${clickable}>Geplant</span>`;
      default:
        return `<span class="badge badge-completed" ${clickable}>${escapeHtml(status || '—')}</span>`;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // -------------------------------------------------------------
  // 13. INITIALIZE APP
  // -------------------------------------------------------------
  function initApp() {
    initTheme();

    // Adjust Travelcalc links if running on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
      document.querySelectorAll('a[href*="Travelcalc"]').forEach((a) => {
        a.href = 'https://itachisenpaisama.github.io/travelcalc/';
      });
    }

    switchTab('dashboard');
  }

  // Check auth on load
  checkAuth();
});
