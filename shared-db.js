/**
 * MatheCoach CRM & Travelcalc — Shared Database Layer
 * Local-First (IndexedDB / LocalStorage) with Live Sync & Optional Cloud Sync (Supabase / Firebase)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MatheDB = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEYS = {
    STUDENTS: 'mathecoach_students',
    SESSIONS: 'mathecoach_sessions',
    TRIPS: 'mathecoach_trips',
    SETTINGS: 'mathecoach_settings',
    AUTH: 'mathecoach_auth_session'
  };

  const SYNC_CHANNEL_NAME = 'mathecoach_crm_sync_channel';
  let syncChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    }
  } catch (e) {
    console.warn('BroadcastChannel not supported, relying on storage events.');
  }

  // Event dispatchers for reactive updates
  const listeners = new Set();

  function notifyChange(type, payload) {
    const event = { type, payload, timestamp: Date.now() };
    listeners.forEach(cb => {
      try { cb(event); } catch (err) { console.error('Listener error', err); }
    });

    if (syncChannel) {
      try { syncChannel.postMessage(event); } catch (e) {}
    }
  }

  if (syncChannel) {
    syncChannel.onmessage = (msg) => {
      if (msg && msg.data) {
        listeners.forEach(cb => {
          try { cb(msg.data); } catch (err) {}
        });
      }
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
      notifyChange('STORAGE_MUTATED', { key: e.key });
    }
  });

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------
  function generateId(prefix = 'id') {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
  }

  function getRaw(key, defaultVal = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.error('Error reading localStorage for ' + key, e);
      return defaultVal;
    }
  }

  function setRaw(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing localStorage for ' + key, e);
      return false;
    }
  }

  // -------------------------------------------------------------
  // Default Settings & Sample Data Initialization
  // -------------------------------------------------------------
  const DEFAULT_SETTINGS = {
    adminPin: '1234', // Default PIN on fresh installation
    currency: '€',
    defaultHourlyRate: 60, // Euro pro 90 Minuten
    defaultRatePerKm: 0.50, // Euro pro Kilometer Anfahrt
    homeAddress: 'Dietzenbach',
    officeAddress: 'Dietzenbach (Büro)',
    cloudSync: {
      enabled: false,
      provider: 'supabase', // 'supabase' | 'custom'
      url: '',
      anonKey: '',
      lastSync: null
    }
  };

  const SAMPLE_STUDENTS = [
    {
      id: 'stud_1',
      name: 'Lars Müller',
      parentName: 'Familie Müller',
      phone: '+49 170 1234567',
      email: 'fam.mueller@example.com',
      address: 'Waldackerstr. 14, 63128 Dietzenbach',
      grade: '12 (Gymnasium)',
      school: 'Heinrich-Mann-Schule',
      subject: 'Mathematik (LK)',
      notes: 'Schwerpunkt Analysis & Kurvendiskussion. Sehr stark in geometrischer Vorstellung, braucht Zeit beim Rechnen.',
      neurodivergentNotes: 'Diagnostiziertes ADHS. Profitiert stark von 90-Min-Takt, visualisierten Rechenschritten und reizarmen Pausen.',
      billingType: 'session_90',
      rate: 70, // € pro 90 Min
      travelCostDefault: 10, // Pauschale falls vor Ort
      preferredLocation: 'home', // 'office' | 'home' | 'online'
      active: true,
      createdAt: '2026-09-01T10:00:00.000Z'
    },
    {
      id: 'stud_2',
      name: 'Sophie Klein',
      parentName: 'Sabine Klein',
      phone: '+49 176 9876543',
      email: 'sabine.klein@example.com',
      address: 'Lindenweg 5, 63128 Dietzenbach',
      grade: '11 (Gymnasium)',
      school: 'Gymnasium Dietzenbach',
      subject: 'Mathematik',
      notes: 'Vorbereitung auf die Einführungsphase der Oberstufe. Ableitungen und Funktionen.',
      neurodivergentNotes: 'Starke Prüfungsangst und Blackouts vor Arbeiten. Braucht psychologische Sicherheit und Notfallstrategien.',
      billingType: 'session_90',
      rate: 65,
      travelCostDefault: 0,
      preferredLocation: 'office',
      active: true,
      createdAt: '2026-09-05T14:30:00.000Z'
    },
    {
      id: 'stud_3',
      name: 'Maximilian Bach',
      parentName: 'Thomas Bach',
      phone: '+49 151 5554321',
      email: 't.bach@example.com',
      address: 'Goethestr. 22, 63110 Rodgau',
      grade: '10 (Realschule)',
      school: 'Geschwister-Scholl-Schule',
      subject: 'Mathematik',
      notes: 'Bruchrechnen, quadratische Gleichungen & MSA-Vorbereitung.',
      neurodivergentNotes: 'ADHS (eher unruhig). Lernt am besten mit interaktivem Whiteboard und klaren Etappenzielen.',
      billingType: 'session_90',
      rate: 60,
      travelCostDefault: 15,
      preferredLocation: 'home',
      active: true,
      createdAt: '2026-09-10T11:00:00.000Z'
    }
  ];

  const SAMPLE_SESSIONS = [
    {
      id: 'sess_1',
      studentId: 'stud_1',
      studentName: 'Lars Müller',
      date: '2026-09-21',
      time: '16:00',
      durationMinutes: 90,
      subject: 'Mathematik LK',
      topics: 'Kettenregel & Produktregel bei Exponentialfunktionen',
      locationType: 'home',
      address: 'Waldackerstr. 14, 63128 Dietzenbach',
      travelDistanceKm: 6.4,
      travelCost: 10,
      sessionFee: 70,
      totalAmount: 80,
      status: 'paid', // 'planned' | 'completed' | 'paid'
      notes: 'Super mitgearbeitet. Knoten bei e-Funktionen ist geplatzt!',
      createdAt: '2026-09-21T17:40:00.000Z'
    },
    {
      id: 'sess_2',
      studentId: 'stud_2',
      studentName: 'Sophie Klein',
      date: '2026-09-22',
      time: '15:30',
      durationMinutes: 90,
      subject: 'Mathematik',
      topics: 'Nullstellenberechnung & pq-Formel visuell herleiten',
      locationType: 'office',
      address: 'Dietzenbach (Büro)',
      travelDistanceKm: 0,
      travelCost: 0,
      sessionFee: 65,
      totalAmount: 65,
      status: 'paid',
      notes: 'Gelernt im reizarmen Raum. Sehr konzentriert gearbeitet.',
      createdAt: '2026-09-22T17:00:00.000Z'
    },
    {
      id: 'sess_3',
      studentId: 'stud_1',
      studentName: 'Lars Müller',
      date: '2026-09-28',
      time: '16:00',
      durationMinutes: 90,
      subject: 'Mathematik LK',
      topics: 'Kurvendiskussion & Vorbereitung Klausur 1',
      locationType: 'home',
      address: 'Waldackerstr. 14, 63128 Dietzenbach',
      travelDistanceKm: 6.4,
      travelCost: 10,
      sessionFee: 70,
      totalAmount: 80,
      status: 'completed',
      notes: 'Übungsaufgaben gerechnet, Notfallstrategien besprochen.',
      createdAt: '2026-09-28T17:35:00.000Z'
    }
  ];

  const SAMPLE_TRIPS = [
    {
      id: 'trip_1',
      sessionId: 'sess_1',
      studentId: 'stud_1',
      studentName: 'Lars Müller',
      date: '2026-09-21',
      purpose: 'Mathe-Nachhilfe Lars Müller',
      origin: 'Dietzenbach',
      destination: 'Waldackerstr. 14, 63128 Dietzenbach',
      distanceKm: 6.4,
      isRoundTrip: true,
      ratePerKm: 0.50,
      totalCost: 10.00,
      createdAt: '2026-09-21T18:00:00.000Z'
    },
    {
      id: 'trip_2',
      sessionId: 'sess_3',
      studentId: 'stud_1',
      studentName: 'Lars Müller',
      date: '2026-09-28',
      purpose: 'Mathe-Nachhilfe Lars Müller',
      origin: 'Dietzenbach',
      destination: 'Waldackerstr. 14, 63128 Dietzenbach',
      distanceKm: 6.4,
      isRoundTrip: true,
      ratePerKm: 0.50,
      totalCost: 10.00,
      createdAt: '2026-09-28T18:00:00.000Z'
    }
  ];

  function ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      setRaw(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      setRaw(STORAGE_KEYS.STUDENTS, SAMPLE_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      setRaw(STORAGE_KEYS.SESSIONS, SAMPLE_SESSIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRIPS)) {
      setRaw(STORAGE_KEYS.TRIPS, SAMPLE_TRIPS);
    }
  }

  ensureInitialized();

  // -------------------------------------------------------------
  // Authentication (PIN / Password Gate)
  // -------------------------------------------------------------
  const Auth = {
    isAuthenticated() {
      try {
        const session = sessionStorage.getItem(STORAGE_KEYS.AUTH);
        if (!session) return false;
        const parsed = JSON.parse(session);
        return parsed && parsed.authenticated === true;
      } catch (e) {
        return false;
      }
    },
    login(pinOrPassword) {
      const settings = Settings.get();
      const validPin = settings.adminPin || '1234';
      if (String(pinOrPassword).trim() === String(validPin).trim()) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
          authenticated: true,
          loginTime: Date.now()
        }));
        notifyChange('AUTH_STATE_CHANGED', { authenticated: true });
        return true;
      }
      return false;
    },
    logout() {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
      notifyChange('AUTH_STATE_CHANGED', { authenticated: false });
    },
    setNewPin(oldPin, newPin) {
      const settings = Settings.get();
      if (String(oldPin).trim() !== String(settings.adminPin).trim()) {
        return { success: false, message: 'Alte PIN ist nicht korrekt.' };
      }
      if (!newPin || String(newPin).trim().length < 4) {
        return { success: false, message: 'Neue PIN muss mindestens 4 Zeichen lang sein.' };
      }
      settings.adminPin = String(newPin).trim();
      Settings.save(settings);
      return { success: true };
    }
  };

  // -------------------------------------------------------------
  // Students CRM Operations
  // -------------------------------------------------------------
  const Students = {
    getAll(filter = {}) {
      let list = getRaw(STORAGE_KEYS.STUDENTS, []);
      if (filter.activeOnly) {
        list = list.filter(s => s.active !== false);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase().trim();
        list = list.filter(s => 
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.parentName && s.parentName.toLowerCase().includes(q)) ||
          (s.grade && s.grade.toLowerCase().includes(q)) ||
          (s.address && s.address.toLowerCase().includes(q))
        );
      }
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    },
    getById(id) {
      const list = getRaw(STORAGE_KEYS.STUDENTS, []);
      return list.find(s => s.id === id) || null;
    },
    save(studentData) {
      const list = getRaw(STORAGE_KEYS.STUDENTS, []);
      let updated;
      if (studentData.id) {
        const idx = list.findIndex(s => s.id === studentData.id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...studentData, updatedAt: new Date().toISOString() };
          updated = list[idx];
        } else {
          updated = { ...studentData, updatedAt: new Date().toISOString() };
          list.push(updated);
        }
      } else {
        updated = {
          ...studentData,
          id: generateId('stud'),
          createdAt: new Date().toISOString()
        };
        list.push(updated);
      }
      setRaw(STORAGE_KEYS.STUDENTS, list);
      notifyChange('STUDENTS_UPDATED', updated);
      CloudSync.triggerAutoSync();
      return updated;
    },
    delete(id) {
      let list = getRaw(STORAGE_KEYS.STUDENTS, []);
      list = list.filter(s => s.id !== id);
      setRaw(STORAGE_KEYS.STUDENTS, list);
      notifyChange('STUDENTS_DELETED', { id });
      CloudSync.triggerAutoSync();
      return true;
    }
  };

  // -------------------------------------------------------------
  // Sessions & Lessons Operations
  // -------------------------------------------------------------
  const Sessions = {
    getAll(filter = {}) {
      let list = getRaw(STORAGE_KEYS.SESSIONS, []);
      if (filter.studentId) {
        list = list.filter(s => s.studentId === filter.studentId);
      }
      if (filter.status) {
        list = list.filter(s => s.status === filter.status);
      }
      if (filter.month) {
        // format YYYY-MM
        list = list.filter(s => s.date && s.date.startsWith(filter.month));
      }
      return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    },
    getById(id) {
      const list = getRaw(STORAGE_KEYS.SESSIONS, []);
      return list.find(s => s.id === id) || null;
    },
    save(sessionData) {
      const list = getRaw(STORAGE_KEYS.SESSIONS, []);
      let updated;
      
      // Auto-fill student name if missing
      if (sessionData.studentId && !sessionData.studentName) {
        const student = Students.getById(sessionData.studentId);
        if (student) sessionData.studentName = student.name;
      }

      // Calculate total
      const fee = parseFloat(sessionData.sessionFee) || 0;
      const travel = parseFloat(sessionData.travelCost) || 0;
      sessionData.totalAmount = fee + travel;

      if (sessionData.id) {
        const idx = list.findIndex(s => s.id === sessionData.id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...sessionData, updatedAt: new Date().toISOString() };
          updated = list[idx];
        } else {
          updated = { ...sessionData, updatedAt: new Date().toISOString() };
          list.push(updated);
        }
      } else {
        updated = {
          ...sessionData,
          id: generateId('sess'),
          createdAt: new Date().toISOString()
        };
        list.push(updated);
      }

      setRaw(STORAGE_KEYS.SESSIONS, list);
      notifyChange('SESSIONS_UPDATED', updated);
      CloudSync.triggerAutoSync();
      return updated;
    },
    updateStatus(id, newStatus) {
      const session = this.getById(id);
      if (session) {
        session.status = newStatus;
        return this.save(session);
      }
      return null;
    },
    delete(id) {
      let list = getRaw(STORAGE_KEYS.SESSIONS, []);
      list = list.filter(s => s.id !== id);
      setRaw(STORAGE_KEYS.SESSIONS, list);
      notifyChange('SESSIONS_DELETED', { id });
      CloudSync.triggerAutoSync();
      return true;
    }
  };

  // -------------------------------------------------------------
  // Travelcalc Integration (Trips)
  // -------------------------------------------------------------
  const Trips = {
    getAll(filter = {}) {
      let list = getRaw(STORAGE_KEYS.TRIPS, []);
      if (filter.studentId) {
        list = list.filter(t => t.studentId === filter.studentId);
      }
      if (filter.month) {
        list = list.filter(t => t.date && t.date.startsWith(filter.month));
      }
      return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    },
    save(tripData) {
      const list = getRaw(STORAGE_KEYS.TRIPS, []);
      let updated;
      if (tripData.id) {
        const idx = list.findIndex(t => t.id === tripData.id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...tripData, updatedAt: new Date().toISOString() };
          updated = list[idx];
        } else {
          updated = { ...tripData, updatedAt: new Date().toISOString() };
          list.push(updated);
        }
      } else {
        updated = {
          ...tripData,
          id: generateId('trip'),
          createdAt: new Date().toISOString()
        };
        list.push(updated);
      }

      setRaw(STORAGE_KEYS.TRIPS, list);
      notifyChange('TRIPS_UPDATED', updated);
      CloudSync.triggerAutoSync();
      return updated;
    },
    delete(id) {
      let list = getRaw(STORAGE_KEYS.TRIPS, []);
      list = list.filter(t => t.id !== id);
      setRaw(STORAGE_KEYS.TRIPS, list);
      notifyChange('TRIPS_DELETED', { id });
      CloudSync.triggerAutoSync();
      return true;
    }
  };

  // -------------------------------------------------------------
  // Settings & Configuration
  // -------------------------------------------------------------
  const Settings = {
    get() {
      return getRaw(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    },
    save(newSettings) {
      const merged = { ...DEFAULT_SETTINGS, ...newSettings };
      setRaw(STORAGE_KEYS.SETTINGS, merged);
      notifyChange('SETTINGS_UPDATED', merged);
      return merged;
    }
  };

  // -------------------------------------------------------------
  // KPI Analytics & Summaries
  // -------------------------------------------------------------
  const Analytics = {
    getSummary(monthFilter = null) {
      const now = new Date();
      const currentMonth = monthFilter || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const students = Students.getAll({ activeOnly: true });
      const allSessions = Sessions.getAll();
      const monthSessions = allSessions.filter(s => s.date && s.date.startsWith(currentMonth));
      const monthTrips = Trips.getAll({ month: currentMonth });

      const totalRevenue = monthSessions.reduce((sum, s) => sum + (parseFloat(s.totalAmount) || 0), 0);
      const paidRevenue = monthSessions.filter(s => s.status === 'paid').reduce((sum, s) => sum + (parseFloat(s.totalAmount) || 0), 0);
      const openRevenue = totalRevenue - paidRevenue;

      const totalHours = monthSessions.reduce((sum, s) => sum + ((parseFloat(s.durationMinutes) || 90) / 60), 0);
      const totalKm = monthTrips.reduce((sum, t) => sum + (parseFloat(t.distanceKm) || 0), 0);
      const totalTravelCosts = monthTrips.reduce((sum, t) => sum + (parseFloat(t.totalCost) || 0), 0);

      return {
        month: currentMonth,
        activeStudentsCount: students.length,
        sessionCount: monthSessions.length,
        totalHours: Math.round(totalHours * 10) / 10,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        paidRevenue: Math.round(paidRevenue * 100) / 100,
        openRevenue: Math.round(openRevenue * 100) / 100,
        tripCount: monthTrips.length,
        totalKm: Math.round(totalKm * 10) / 10,
        totalTravelCosts: Math.round(totalTravelCosts * 100) / 100
      };
    }
  };

  // -------------------------------------------------------------
  // Data Backup & Export / Import
  // -------------------------------------------------------------
  const Backup = {
    exportJSON() {
      const dump = {
        meta: {
          app: 'MatheCoach CRM & Travelcalc',
          version: '1.0',
          exportedAt: new Date().toISOString()
        },
        students: getRaw(STORAGE_KEYS.STUDENTS, []),
        sessions: getRaw(STORAGE_KEYS.SESSIONS, []),
        trips: getRaw(STORAGE_KEYS.TRIPS, []),
        settings: Settings.get()
      };
      return JSON.stringify(dump, null, 2);
    },
    importJSON(jsonString) {
      try {
        const data = JSON.parse(jsonString);
        if (!data || typeof data !== 'object') throw new Error('Ungültiges Datenformat');

        if (Array.isArray(data.students)) setRaw(STORAGE_KEYS.STUDENTS, data.students);
        if (Array.isArray(data.sessions)) setRaw(STORAGE_KEYS.SESSIONS, data.sessions);
        if (Array.isArray(data.trips)) setRaw(STORAGE_KEYS.TRIPS, data.trips);
        if (data.settings && typeof data.settings === 'object') {
          const current = Settings.get();
          setRaw(STORAGE_KEYS.SETTINGS, { ...current, ...data.settings });
        }

        notifyChange('BACKUP_RESTORED', { timestamp: Date.now() });
        return { success: true };
      } catch (err) {
        console.error('Import error', err);
        return { success: false, error: err.message };
      }
    },
    resetAllData() {
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.TRIPS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      ensureInitialized();
      notifyChange('DATA_RESET', {});
      return true;
    }
  };

  // -------------------------------------------------------------
  // Cloud Sync (Supabase / Firebase REST Connector)
  // -------------------------------------------------------------
  const CloudSync = {
    async triggerAutoSync() {
      const settings = Settings.get();
      if (!settings.cloudSync || !settings.cloudSync.enabled || !settings.cloudSync.url || !settings.cloudSync.anonKey) {
        return; // Cloud sync disabled
      }
      try {
        await this.sync();
      } catch (err) {
        console.warn('Auto cloud sync failed:', err);
      }
    },
    async sync() {
      const settings = Settings.get();
      if (!settings.cloudSync || !settings.cloudSync.url || !settings.cloudSync.anonKey) {
        throw new Error('Supabase URL und Anon Key sind nicht konfiguriert.');
      }

      const baseUrl = settings.cloudSync.url.replace(/\/$/, '');
      const key = settings.cloudSync.anonKey;

      const headers = {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      };

      // 1. Sync Students
      const localStudents = Students.getAll();
      const res = await fetch(`${baseUrl}/rest/v1/students?select=*`, { headers });
      if (res.ok) {
        const remoteStudents = await res.json();
        // Merge strategy: remote + local
        const mergedMap = new Map();
        localStudents.forEach(s => mergedMap.set(s.id, s));
        remoteStudents.forEach(s => mergedMap.set(s.id, s));
        const mergedList = Array.from(mergedMap.values());
        setRaw(STORAGE_KEYS.STUDENTS, mergedList);
      }

      // Update sync timestamp
      settings.cloudSync.lastSync = new Date().toISOString();
      Settings.save(settings);
      notifyChange('CLOUD_SYNC_COMPLETED', { timestamp: settings.cloudSync.lastSync });
      return { success: true, timestamp: settings.cloudSync.lastSync };
    }
  };

  return {
    Auth,
    Students,
    Sessions,
    Trips,
    Settings,
    Analytics,
    Backup,
    CloudSync,
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    }
  };
}));
