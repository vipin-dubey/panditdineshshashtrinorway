/* ==========================================================================
   Vedic Astrologer & Hindu Priest in Norway - Pandit Dinesh Shastri
   Master Application Logic, Vedic Algorithms & Multilingual Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Active language state
  let currentLang = localStorage.getItem("preferred_lang") || "en";

  // Phone & Contact Constants
  const PANDIT_PHONE = "+47 97335299";
  const PANDIT_WA_CLEAN = "4797335299";
  const PANDIT_EMAIL = "dineshshastri82@gmail.com";

  // Cache core DOM elements
  const langButtons = document.querySelectorAll(".lang-btn");
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const sanskarGrid = document.querySelector(".sanskar-grid");
  const sanskarTabs = document.querySelectorAll(".sanskar-tab-btn");
  const sanskarModal = document.getElementById("sanskarDetailModal");
  const modalCloseBtn = document.querySelector(".modal-close-btn");
  const modalDismissBtn = document.querySelector(".modal-dismiss-btn");
  const bookingForm = document.getElementById("bookingForm");
  const serviceSelect = document.getElementById("serviceSelect");
  const birthDetailsBox = document.querySelector(".birth-details-box");
  const whatsappSendBtn = document.getElementById("whatsappSendBtn");
  const formFeedback = document.getElementById("formFeedback");

  /* --------------------------------------------------------------------------
     1. Language Translation Engine
     -------------------------------------------------------------------------- */
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("preferred_lang", lang);

    // Update switcher buttons UI
    langButtons.forEach(btn => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const dict = translations[lang] || translations.en;

    // Translate all standard text nodes
    document.querySelectorAll("[data-i18n]").forEach(elem => {
      const key = elem.getAttribute("data-i18n");
      if (dict[key]) {
        elem.innerHTML = dict[key];
      }
    });

    // Translate form placeholders
    document.querySelectorAll("[data-i18n-ph]").forEach(elem => {
      const key = elem.getAttribute("data-i18n-ph");
      if (dict[key]) {
        elem.setAttribute("placeholder", dict[key]);
      }
    });

    // Re-render Dynamic Modules with current language
    renderDailyPanchang();
    renderRashifal();
    renderAnnualPanchang();
    renderGemstones();
    renderAuspiciousDays();
    renderShubhMuhurat();
    renderVivahMuhurat();
    renderSanskars(getActiveSanskarFilter());

    // Update html lang attribute
    document.documentElement.lang = lang;
  }

  // Language button event listeners
  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  /* --------------------------------------------------------------------------
     2. Mobile Drawer Navigation & Backdrop Interactivity
     -------------------------------------------------------------------------- */
  const mobileNavDrawer = document.getElementById("mobileNavDrawer");
  const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
  const mobileDrawerClose = document.getElementById("mobileDrawerClose");

  function openMobileDrawer() {
    if (mobileNavDrawer) mobileNavDrawer.classList.add("open");
    if (mobileNavBackdrop) mobileNavBackdrop.classList.add("open");
    if (mobileNavToggle) mobileNavToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileDrawer() {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove("open");
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove("open");
    if (mobileNavToggle) mobileNavToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", () => {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains("open")) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener("click", closeMobileDrawer);
  }
  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener("click", closeMobileDrawer);
  }

  // Close mobile drawer when clicking any nav link inside it
  document.querySelectorAll(".mobile-nav-link, .mobile-nav-sublink, .mobile-drawer-footer a").forEach(link => {
    link.addEventListener("click", () => {
      closeMobileDrawer();
    });
  });

  // Desktop dropdown toggle and outside-click handler
  document.querySelectorAll(".nav-item-dropdown").forEach(dropdown => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        // Prevent default hash jump if clicking dropdown trigger
        e.preventDefault();
        const isOpen = dropdown.classList.contains("is-open");
        document.querySelectorAll(".nav-item-dropdown").forEach(d => {
          d.classList.remove("is-open");
          const t = d.querySelector(".dropdown-toggle");
          if (t) t.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          dropdown.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    }
  });

  // Close dropdown when clicking outside or clicking any dropdown link
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-item-dropdown")) {
      document.querySelectorAll(".nav-item-dropdown").forEach(d => {
        d.classList.remove("is-open");
        const t = d.querySelector(".dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.querySelectorAll(".dropdown-link").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-item-dropdown").forEach(d => {
        d.classList.remove("is-open");
        const t = d.querySelector(".dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    });
  });

  /* --------------------------------------------------------------------------
     3. High-Priority Vedic Hub Tabs Switching
     -------------------------------------------------------------------------- */
  const hubTabButtons = document.querySelectorAll(".hub-tab-btn");
  const hubTabPanels = document.querySelectorAll(".hub-tab-panel");

  function switchHubTab(targetTabId) {
    hubTabButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === targetTabId);
    });
    hubTabPanels.forEach(panel => {
      panel.classList.toggle("active", panel.id === targetTabId);
    });
  }

  hubTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");
      switchHubTab(targetId);
    });
  });

  // Handle direct hash navigation to any of the 8 features
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");
    const matchingPanel = document.getElementById(hash);
    if (matchingPanel && matchingPanel.classList.contains("hub-tab-panel")) {
      switchHubTab(hash);
      matchingPanel.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Initial check on load for hash
  if (window.location.hash) {
    const initialHash = window.location.hash.replace("#", "");
    const matchingPanel = document.getElementById(initialHash);
    if (matchingPanel && matchingPanel.classList.contains("hub-tab-panel")) {
      switchHubTab(initialHash);
    }
  }

  /* --------------------------------------------------------------------------
     4. Feature 1: Dynamic Daily Panchang Engine (Adjusted for Norway Latitudes)
     -------------------------------------------------------------------------- */
  const panchangDateInput = document.getElementById("panchangDate");
  const panchangCitySelect = document.getElementById("panchangCity");

  // Set default date to today
  if (panchangDateInput) {
    const today = new Date().toISOString().split("T")[0];
    panchangDateInput.value = today;
    panchangDateInput.addEventListener("change", () => renderDailyPanchang());
  }
  if (panchangCitySelect) {
    panchangCitySelect.addEventListener("change", () => renderDailyPanchang());
  }

  // Astronomical lookup data
  const tithis = [
    { en: "Shukla Pratipada", hi: "शुक्ल प्रतिपदा" },
    { en: "Shukla Dwitiya", hi: "शुक्ल द्वितीया" },
    { en: "Shukla Tritiya", hi: "शुक्ल तृतीया" },
    { en: "Shukla Chaturthi", hi: "शुक्ल चतुर्थी" },
    { en: "Shukla Panchami", hi: "शुक्ल पंचमी" },
    { en: "Shukla Shashthi", hi: "शुक्ल षष्ठी" },
    { en: "Shukla Saptami", hi: "शुक्ल सप्तमी" },
    { en: "Shukla Ashtami", hi: "शुक्ल अष्टमी" },
    { en: "Shukla Navami", hi: "शुक्ल नवमी" },
    { en: "Shukla Dashami", hi: "शुक्ल दशमी" },
    { en: "Shukla Ekadashi", hi: "शुक्ल एकादशी" },
    { en: "Shukla Dwadashi", hi: "शुक्ल द्वादशी" },
    { en: "Shukla Trayodashi", hi: "शुक्ल त्रयोदशी" },
    { en: "Shukla Chaturdashi", hi: "शुक्ल चतुर्दशी" },
    { en: "Purnima (Full Moon)", hi: "पूर्णिमा" },
    { en: "Krishna Pratipada", hi: "कृष्ण प्रतिपदा" },
    { en: "Krishna Dwitiya", hi: "कृष्ण द्वितीया" },
    { en: "Krishna Tritiya", hi: "कृष्ण तृतीया" },
    { en: "Krishna Chaturthi", hi: "कृष्ण चतुर्थी" },
    { en: "Krishna Panchami", hi: "कृष्ण पंचमी" },
    { en: "Krishna Shashthi", hi: "कृष्ण षष्ठी" },
    { en: "Krishna Saptami", hi: "कृष्ण सप्तमी" },
    { en: "Krishna Ashtami", hi: "कृष्ण अष्टमी" },
    { en: "Krishna Navami", hi: "कृष्ण नवमी" },
    { en: "Krishna Dashami", hi: "कृष्ण दशमी" },
    { en: "Krishna Ekadashi", hi: "कृष्ण एकादशी" },
    { en: "Krishna Dwadashi", hi: "कृष्ण द्वादशी" },
    { en: "Krishna Trayodashi", hi: "कृष्ण त्रयोदशी" },
    { en: "Krishna Chaturdashi", hi: "कृष्ण चतुर्दशी" },
    { en: "Amavasya (New Moon)", hi: "अमावस्या" }
  ];

  const nakshatras = [
    { en: "Ashwini (Ketu)", hi: "अश्विनी (केतु)" },
    { en: "Bharani (Venus)", hi: "भरणी (शुक्र)" },
    { en: "Krittika (Sun)", hi: "कृत्तिका (सूर्य)" },
    { en: "Rohini (Moon)", hi: "रोहिणी (चन्द्र)" },
    { en: "Mrigashirsha (Mars)", hi: "मृगशिरा (मंगल)" },
    { en: "Ardra (Rahu)", hi: "आर्द्रा (राहु)" },
    { en: "Punarvasu (Jupiter)", hi: "पुनर्वसु (बृहस्पति)" },
    { en: "Pushya (Saturn)", hi: "पुष्य (शनि)" },
    { en: "Ashlesha (Mercury)", hi: "आश्लेषा (बुध)" },
    { en: "Magha (Ketu)", hi: "मघा (केतु)" },
    { en: "Purva Phalguni (Venus)", hi: "पूर्वाफाल्गुनी (शुक्र)" },
    { en: "Uttara Phalguni (Sun)", hi: "उत्तराफाल्गुनी (सूर्य)" },
    { en: "Hasta (Moon)", hi: "हस्त (चन्द्र)" },
    { en: "Chitra (Mars)", hi: "चित्रा (मंगल)" },
    { en: "Swati (Rahu)", hi: "स्वाति (राहु)" },
    { en: "Vishakha (Jupiter)", hi: "विशाखा (बृहस्पति)" },
    { en: "Anuradha (Saturn)", hi: "अनुराधा (शनि)" },
    { en: "Jyeshtha (Mercury)", hi: "ज्येष्ठा (बुध)" },
    { en: "Mula (Ketu)", hi: "मूल (केतु)" },
    { en: "Purva Ashadha (Venus)", hi: "पूर्वाषाढ़ा (शुक्र)" },
    { en: "Uttara Ashadha (Sun)", hi: "उत्तराषाढ़ा (सूर्य)" },
    { en: "Shravana (Moon)", hi: "श्रवण (चन्द्र)" },
    { en: "Dhanishta (Mars)", hi: "धनिष्ठा (मंगल)" },
    { en: "Shatabhisha (Rahu)", hi: "शतभिषा (राहु)" },
    { en: "Purva Bhadrapada (Jupiter)", hi: "पूर्वाभाद्रपद (बृहस्पति)" },
    { en: "Uttara Bhadrapada (Saturn)", hi: "उत्तराभाद्रपद (शनि)" },
    { en: "Revati (Mercury)", hi: "रेवती (बुध)" }
  ];

  const yogas = [
    { en: "Vishkumbha", hi: "विष्कुम्भ" }, { en: "Priti", hi: "प्रीति" }, { en: "Ayushman", hi: "आयुष्मान्" },
    { en: "Saubhagya", hi: "सौभाग्य" }, { en: "Shobhana", hi: "शोभन" }, { en: "Atiganda", hi: "अतिगण्ड" },
    { en: "Sukarma", hi: "सुकर्मा" }, { en: "Dhriti", hi: "धृति" }, { en: "Shula", hi: "शूल" },
    { en: "Ganda", hi: "गण्ड" }, { en: "Vriddhi", hi: "वृद्धि" }, { en: "Dhruva", hi: "ध्रुव" },
    { en: "Vyaghata", hi: "व्याघात" }, { en: "Harshana", hi: "हर्षण" }, { en: "Vajra", hi: "वज्र" },
    { en: "Siddhi", hi: "सिद्धि" }, { en: "Vyatipata", hi: "व्यतीपात" }, { en: "Variyana", hi: "वरीयान्" },
    { en: "Parigha", hi: "परिघ" }, { en: "Shiva", hi: "शिव" }, { en: "Siddha", hi: "सिद्ध" },
    { en: "Sadhya", hi: "साध्य" }, { en: "Shubha", hi: "शुभ" }, { en: "Shukla", hi: "शुक्ल" },
    { en: "Brahma", hi: "ब्रह्म" }, { en: "Indra", hi: "इन्द्र" }, { en: "Vaidhriti", hi: "वैधृति" }
  ];

  const karanas = [
    { en: "Bava (Lion)", hi: "बव (सिंह)" }, { en: "Balava (Leopard)", hi: "बालव (चीता)" },
    { en: "Kaulava (Pig)", hi: "कौलव (वराह)" }, { en: "Taitila (Donkey)", hi: "तैतिल (गर्दभ)" },
    { en: "Garija (Elephant)", hi: "गरिज (गज)" }, { en: "Vanija (Bull)", hi: "वणिज (वृषभ)" },
    { en: "Vishti / Bhadra (Vishti)", hi: "विष्टि (भद्रा)" }
  ];

  const vaars = [
    { en: "Ravivar (Sunday)", hi: "रविवार (भानुवार)" },
    { en: "Somvar (Monday)", hi: "सोमवार (इन्दुवार)" },
    { en: "Mangalvar (Tuesday)", hi: "मंगलवार (भौमवार)" },
    { en: "Budhvar (Wednesday)", hi: "बुधवार (सौम्यवार)" },
    { en: "Guruvar (Thursday)", hi: "गुरुवार (बृहस्पतिवार)" },
    { en: "Shukravar (Friday)", hi: "शुक्रवार (भृगुवार)" },
    { en: "Shanivar (Saturday)", hi: "शनिवार (स्थिरवार)" }
  ];

  function renderDailyPanchang() {
    const panchangContainer = document.getElementById("panchangDynamicGrid");
    if (!panchangContainer) return;

    const dateVal = panchangDateInput ? panchangDateInput.value : new Date().toISOString().split("T")[0];
    const city = panchangCitySelect ? panchangCitySelect.value : "oslo";
    const targetDate = new Date(dateVal + "T12:00:00Z");

    // Astronomical seed based on Julian-style day offset
    const epoch = new Date("2026-01-01T00:00:00Z");
    const dayOffset = Math.floor((targetDate - epoch) / (1000 * 60 * 60 * 24));

    const dayOfWeek = targetDate.getUTCDay();
    const tithiIdx = Math.abs((dayOffset + 12) % 30);
    const nakshatraIdx = Math.abs((dayOffset + 6) % 27);
    const yogaIdx = Math.abs((dayOffset + 18) % 27);
    const karanaIdx = Math.abs((dayOffset * 2 + 1) % 7);

    // High-latitude solar calculation for Norway
    // Oslo latitude: ~60°N. Day length varies widely from 6h in Dec to 19h in June.
    const dayOfYear = Math.floor((targetDate - new Date(targetDate.getUTCFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const solDeclination = -23.44 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
    
    // Approximate local sunrise & sunset for Oslo (60°N)
    let approxSunriseHr = 6 - (solDeclination / 10);
    let approxSunsetHr = 18 + (solDeclination / 10);
    if (city === "tromso") {
      // Extreme arctic variation
      approxSunriseHr = 6 - (solDeclination / 7);
      approxSunsetHr = 18 + (solDeclination / 7);
    }
    // Clamp
    approxSunriseHr = Math.max(3.5, Math.min(9.2, approxSunriseHr));
    approxSunsetHr = Math.max(15.2, Math.min(22.8, approxSunsetHr));

    function formatHrMin(decimalHr) {
      const h = Math.floor(decimalHr);
      const m = Math.floor((decimalHr - h) * 60);
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }

    const sunriseStr = formatHrMin(approxSunriseHr);
    const sunsetStr = formatHrMin(approxSunsetHr);
    const dayLength = approxSunsetHr - approxSunriseHr;
    const partOfEight = dayLength / 8;

    // Rahu Kaal standard segment (1 to 8): Sun:8, Mon:2, Tue:7, Wed:5, Thu:6, Fri:4, Sat:3
    const rahuSegments = [8, 2, 7, 5, 6, 4, 3];
    const rahuSeg = rahuSegments[dayOfWeek];
    const rahuStart = approxSunriseHr + (rahuSeg - 1) * partOfEight;
    const rahuEnd = approxSunriseHr + rahuSeg * partOfEight;

    // Abhijit Muhurat is mid-day (around 12:00 LMT)
    const midday = (approxSunriseHr + approxSunsetHr) / 2;
    const abhijitStart = midday - 0.4;
    const abhijitEnd = midday + 0.4;

    // Brahma Muhurat: ~96 min before sunrise
    const brahmaStart = approxSunriseHr - 1.6;
    const brahmaEnd = approxSunriseHr - 0.8;

    // Solar Rashi based on month
    const sunSigns = [
      { en: "Capricorn (मकर)", hi: "मकर" }, // Jan
      { en: "Aquarius (कुम्भ)", hi: "कुम्भ" }, // Feb
      { en: "Pisces (मीन)", hi: "मीन" }, // Mar
      { en: "Aries (मेष)", hi: "मेष" }, // Apr
      { en: "Taurus (वृषभ)", hi: "वृषभ" }, // May
      { en: "Gemini (मिथुन)", hi: "मिथुन" }, // Jun
      { en: "Cancer (कर्क)", hi: "कर्क" }, // Jul
      { en: "Leo (सिंह)", hi: "सिंह" }, // Aug
      { en: "Virgo (कन्या)", hi: "कन्या" }, // Sep
      { en: "Libra (तुला)", hi: "तुला" }, // Oct
      { en: "Scorpio (वृश्चिक)", hi: "वृश्चिक" }, // Nov
      { en: "Sagittarius (धनु)", hi: "धनु" } // Dec
    ];
    const monthIdx = targetDate.getUTCMonth();
    const sunSign = sunSigns[monthIdx];
    const moonSign = rashifalData[(nakshatraIdx * 4) % 12];

    const tithiName = currentLang === "hi" ? tithis[tithiIdx].hi : tithis[tithiIdx].en;
    const nakshatraName = currentLang === "hi" ? nakshatras[nakshatraIdx].hi : nakshatras[nakshatraIdx].en;
    const yogaName = currentLang === "hi" ? yogas[yogaIdx].hi : yogas[yogaIdx].en;
    const karanaName = currentLang === "hi" ? karanas[karanaIdx].hi : karanas[karanaIdx].en;
    const vaarName = currentLang === "hi" ? vaars[dayOfWeek].hi : vaars[dayOfWeek].en;
    const sunSignName = currentLang === "hi" ? sunSign.hi : sunSign.en;
    const moonSignName = currentLang === "hi" ? moonSign.name_hi : moonSign.name_en;

    panchangContainer.innerHTML = `
      <div class="panchang-card panchang-primary-card">
        <div class="panchang-card-header">
          <span class="panchang-badge">॥ पञ्चाङ्गम् ॥</span>
          <h3>${(currentLang === "hi") ? "मुख्य पंचांग तत्व (5 Sacred Angas)" : "Primary 5 Panchang Angas"}</h3>
          <span style="font-size: 0.85rem; color: var(--gold-400);">${targetDate.toLocaleDateString(currentLang === "hi" ? "hi-IN" : "en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="panchang-grid-2col">
          <div class="panchang-cell">
            <span class="cell-label">${(currentLang === "hi") ? "तिथि (Tithi):" : "Tithi (Lunar Day):"}</span>
            <strong class="cell-value">${tithiName}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">${(currentLang === "hi") ? "नक्षत्र (Nakshatra):" : "Nakshatra (Star):"}</span>
            <strong class="cell-value">${nakshatraName}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">${(currentLang === "hi") ? "वार (Vaar / Day):" : "Vaar (Weekday):"}</span>
            <strong class="cell-value">${vaarName}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">${(currentLang === "hi") ? "योग (Yoga):" : "Yoga:"}</span>
            <strong class="cell-value">${yogaName}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">${(currentLang === "hi") ? "करण (Karana):" : "Karana:"}</span>
            <strong class="cell-value">${karanaName}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">${(currentLang === "hi") ? "सूर्य / चन्द्र राशि:" : "Sun / Moon Sign:"}</span>
            <strong class="cell-value">☉ ${sunSignName} | ☽ ${moonSignName}</strong>
          </div>
        </div>
      </div>

      <div class="panchang-card">
        <div class="panchang-card-header">
          <span class="panchang-badge">☀️ ☽</span>
          <h3>${(currentLang === "hi") ? "स्कैंडिनेविया सौर एवं चंद्र काल" : "Nordic Solar & Lunar Timings"}</h3>
          <span style="font-size: 0.85rem; color: var(--text-light-muted);">${city.toUpperCase()} (${(currentLang === "hi") ? "स्थानीय समय" : "Local Time"})</span>
        </div>
        <div class="panchang-grid-2col">
          <div class="panchang-cell">
            <span class="cell-label">🌅 ${(currentLang === "hi") ? "सूर्योदय (Sunrise):" : "Sunrise:"}</span>
            <strong class="cell-value">${sunriseStr} LMT</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">🌇 ${(currentLang === "hi") ? "सूर्यास्त (Sunset):" : "Sunset:"}</span>
            <strong class="cell-value">${sunsetStr} LMT</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">✨ ${(currentLang === "hi") ? "ब्रह्म मुहूर्त:" : "Brahma Muhurat:"}</span>
            <strong class="cell-value">${formatHrMin(brahmaStart)} - ${formatHrMin(brahmaEnd)}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">🌟 ${(currentLang === "hi") ? "अभिजीत मुहूर्त:" : "Abhijit Muhurat:"}</span>
            <strong class="cell-value" style="color: #4CAF50;">${formatHrMin(abhijitStart)} - ${formatHrMin(abhijitEnd)}</strong>
          </div>
        </div>
      </div>

      <div class="panchang-card panchang-alert-card">
        <div class="panchang-card-header">
          <span class="panchang-badge" style="background: rgba(220, 53, 69, 0.2); color: #FF6B6B;">⚠️</span>
          <h3>${(currentLang === "hi") ? "अशुभ काल (त्यागने योग्य समय)" : "Inauspicious Windows (Rahu Kaal)"}</h3>
          <span style="font-size: 0.82rem; color: #FFA8A8;">${(currentLang === "hi") ? "शुभ कार्यों में इसका त्याग करें" : "Avoid starting sacred deeds during this time"}</span>
        </div>
        <div class="panchang-grid-2col">
          <div class="panchang-cell">
            <span class="cell-label">🌑 ${(currentLang === "hi") ? "राहु काल (Rahu Kaal):" : "Rahu Kaal:"}</span>
            <strong class="cell-value" style="color: #FF6B6B;">${formatHrMin(rahuStart)} - ${formatHrMin(rahuEnd)}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">⚔️ ${(currentLang === "hi") ? "यमगण्ड काल:" : "Yamaganda:"}</span>
            <strong class="cell-value">${formatHrMin(approxSunriseHr + 3)} - ${formatHrMin(approxSunriseHr + 4.5)}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">⏳ ${(currentLang === "hi") ? "गुलिक काल:" : "Gulika Kaal:"}</span>
            <strong class="cell-value">${formatHrMin(approxSunriseHr + 1.5)} - ${formatHrMin(approxSunriseHr + 3)}</strong>
          </div>
          <div class="panchang-cell">
            <span class="cell-label">🚫 ${(currentLang === "hi") ? "दुर्मुहूर्त:" : "Durmuhurat:"}</span>
            <strong class="cell-value">${formatHrMin(approxSunriseHr + 4.8)} - ${formatHrMin(approxSunriseHr + 5.6)}</strong>
          </div>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     5. Feature 2: Daily, Weekly & Monthly Rashifal (Horoscope) Engine
     -------------------------------------------------------------------------- */
  let activeRashiId = "aries";
  let activeRashifalTimeframe = "daily";

  function renderRashifal() {
    const rashiSelector = document.getElementById("rashiSelectorPills");
    const rashifalCard = document.getElementById("rashifalDetailsCard");
    const timeframeButtons = document.querySelectorAll(".rashifal-time-btn");

    if (!rashiSelector || !rashifalCard) return;

    // Render Rashi Selector Pills
    rashiSelector.innerHTML = "";
    rashifalData.forEach(r => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `rashi-pill ${r.id === activeRashiId ? "active" : ""}`;
      const name = currentLang === "hi" ? r.name_hi : r.name_en;
      btn.innerHTML = `<span class="rashi-glyph">${r.symbol}</span> <span>${name}</span>`;
      btn.addEventListener("click", () => {
        activeRashiId = r.id;
        renderRashifal();
      });
      rashiSelector.appendChild(btn);
    });

    // Timeframe listeners
    timeframeButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-time") === activeRashifalTimeframe);
      btn.onclick = () => {
        activeRashifalTimeframe = btn.getAttribute("data-time");
        renderRashifal();
      };
    });

    const activeRashi = rashifalData.find(r => r.id === activeRashiId) || rashifalData[0];
    const rashiName = currentLang === "hi" ? activeRashi.name_hi : activeRashi.name_en;
    const rulerName = currentLang === "hi" ? activeRashi.ruler_hi : activeRashi.ruler;
    const luckyColor = currentLang === "hi" ? activeRashi.lucky_color_hi : activeRashi.lucky_color_en;
    const luckyDir = currentLang === "hi" ? activeRashi.lucky_dir_hi : activeRashi.lucky_dir_en;

    let predictionText = "";
    let timeframeLabel = "";
    if (activeRashifalTimeframe === "daily") {
      predictionText = currentLang === "hi" ? activeRashi.daily_hi : activeRashi.daily_en;
      timeframeLabel = currentLang === "hi" ? "दैनिक भविष्यफल (Today's Prediction)" : "Daily Forecast";
    } else if (activeRashifalTimeframe === "weekly") {
      predictionText = currentLang === "hi" ? activeRashi.weekly_hi : activeRashi.weekly_en;
      timeframeLabel = currentLang === "hi" ? "साप्ताहिक भविष्यफल (Weekly Forecast)" : "Weekly Forecast";
    } else {
      predictionText = currentLang === "hi" ? activeRashi.monthly_hi : activeRashi.monthly_en;
      timeframeLabel = currentLang === "hi" ? "मासिक भविष्यफल (Monthly Forecast)" : "Monthly Forecast";
    }

    rashifalCard.innerHTML = `
      <div class="rashifal-card-header">
        <div class="rashi-hero-badge">
          <span class="rashi-big-glyph">${activeRashi.symbol}</span>
          <div>
            <h3>${rashiName} (${activeRashi.name_en})</h3>
            <span class="rashi-ruler">${(currentLang === "hi") ? "स्वामी ग्रह:" : "Ruling Planet:"} <strong>${rulerName}</strong></span>
          </div>
        </div>
        <span class="timeframe-tag">${timeframeLabel}</span>
      </div>

      <div class="rashifal-prediction-box">
        <p class="rashifal-main-text">“${predictionText}”</p>
      </div>

      <div class="rashifal-metrics-strip">
        <div class="metric-item">
          <span class="metric-lbl">${(currentLang === "hi") ? "शुभ अंक" : "Lucky Number"}</span>
          <span class="metric-val">${activeRashi.lucky_num}</span>
        </div>
        <div class="metric-item">
          <span class="metric-lbl">${(currentLang === "hi") ? "शुभ रंग" : "Lucky Color"}</span>
          <span class="metric-val">${luckyColor}</span>
        </div>
        <div class="metric-item">
          <span class="metric-lbl">${(currentLang === "hi") ? "शुभ दिशा" : "Lucky Direction"}</span>
          <span class="metric-val">${luckyDir}</span>
        </div>
      </div>

      <div class="rashifal-mantra-box">
        <span class="mantra-title">${(currentLang === "hi") ? "स्वामी ग्रह कल्याणकारी मंत्र (Sacred Ruling Mantra):" : "Sacred Ruling Planetary Beej Mantra:"}</span>
        <div class="sacred-devanagari-mantra">${activeRashi.mantra}</div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     5. Marriage Proposals & Matrimonial Platform (Guided by Pandit Ji)
     -------------------------------------------------------------------------- */

  // Matrimonial Profile Submission Form
  const matrimonialForm = document.getElementById("matrimonialForm");
  if (matrimonialForm) {
    matrimonialForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = matrimonialForm;
      const candidateName = form.querySelector("[name='candidate_name']").value.trim();
      const gender = form.querySelector("[name='candidate_gender']").value;
      const dob = form.querySelector("[name='candidate_dob']").value;
      const city = form.querySelector("[name='candidate_city']").value.trim();
      const edu = form.querySelector("[name='candidate_education']").value.trim();
      const prof = form.querySelector("[name='candidate_profession']").value.trim();
      const expectations = form.querySelector("[name='candidate_expectations']").value.trim();
      const phone = form.querySelector("[name='contact_phone']").value.trim();

      let text = `*Namaste Pandit Dinesh Shastri Ji,*\n\n`;
      text += `*New Matrimonial Proposal / Marriage Matching Registration:*\n`;
      text += `• *Candidate Name:* ${candidateName}\n`;
      text += `• *Gender:* ${gender}\n`;
      text += `• *DOB:* ${dob}\n`;
      text += `• *Location / Norway City:* ${city}\n`;
      text += `• *Education:* ${edu}\n`;
      text += `• *Profession:* ${prof}\n`;
      text += `• *Contact Phone:* ${phone}\n`;
      if (expectations) text += `• *Preferences / Expectations:* ${expectations}\n`;

      const waUrl = `https://wa.me/${PANDIT_WA_CLEAN}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      const feedback = document.getElementById("matrimonialFeedback");
      if (feedback) {
        feedback.className = "form-feedback success";
        feedback.textContent = currentLang === "hi"
          ? "धन्यवाद! आपका विवाह प्रस्ताव विवरण पंडित दिनेश शास्त्री जी को भेज दिया गया है।"
          : "Thank you! Your matrimonial inquiry has been sent to Pandit Dinesh Shastri for confidential guidance.";
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. Feature 4: Annual Panchang & Hindu Calendar
     -------------------------------------------------------------------------- */
  function renderAnnualPanchang(filter = "all") {
    const listContainer = document.getElementById("annualFestivalList");
    const filterButtons = document.querySelectorAll(".festival-filter-btn");

    if (!listContainer) return;

    filterButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-filter") === filter);
      btn.onclick = () => renderAnnualPanchang(btn.getAttribute("data-filter"));
    });

    listContainer.innerHTML = "";
    const filtered = (filter === "all")
      ? annualPanchangData
      : annualPanchangData.filter(f => f.category === filter);

    filtered.forEach(f => {
      const card = document.createElement("div");
      card.className = "festival-card";
      const name = currentLang === "hi" ? f.name_hi : f.name_en;
      const tithi = currentLang === "hi" ? f.month_vedic_hi : f.month_vedic_en;
      const desc = currentLang === "hi" ? f.desc_hi : f.desc_en;

      card.innerHTML = `
        <div class="festival-date-badge">
          <span class="fest-calendar-icon">📅</span>
          <strong>${f.display_date}</strong>
        </div>
        <div class="festival-details">
          <span class="festival-tithi-pill">${tithi}</span>
          <h4 class="festival-name">${name}</h4>
          <p class="festival-desc">${desc}</p>
        </div>
      `;
      listContainer.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     8. Feature 5: Gemstone Recommendations by Zodiac Sign
     -------------------------------------------------------------------------- */
  let activeGemstoneRashi = "aries";

  function renderGemstones() {
    const selector = document.getElementById("gemstoneRashiSelector");
    const displayCard = document.getElementById("gemstoneDisplayCard");
    if (!selector || !displayCard) return;

    // Render selector pills
    selector.innerHTML = "";
    gemstonesData.forEach(g => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `rashi-pill ${g.rashi_id === activeGemstoneRashi ? "active" : ""}`;
      const rashi = rashifalData.find(r => r.id === g.rashi_id);
      const glyph = rashi ? rashi.symbol : "💎";
      const name = currentLang === "hi" ? g.rashi_hi : g.rashi_en;
      btn.innerHTML = `<span>${glyph}</span> <span>${name}</span>`;
      btn.addEventListener("click", () => {
        activeGemstoneRashi = g.rashi_id;
        renderGemstones();
      });
      selector.appendChild(btn);
    });

    const gem = gemstonesData.find(g => g.rashi_id === activeGemstoneRashi) || gemstonesData[0];
    const rashiName = currentLang === "hi" ? gem.rashi_hi : gem.rashi_en;
    const primaryGem = currentLang === "hi" ? gem.primary_gem_hi : gem.primary_gem_en;
    const secondaryGem = currentLang === "hi" ? gem.secondary_gem_hi : gem.secondary_gem_en;
    const planet = currentLang === "hi" ? gem.planet_hi : gem.planet_en;
    const metal = currentLang === "hi" ? gem.metal_hi : gem.metal_en;
    const finger = currentLang === "hi" ? gem.finger_hi : gem.finger_en;
    const muhurat = currentLang === "hi" ? gem.muhurat_hi : gem.muhurat_en;
    const precautions = currentLang === "hi" ? gem.precautions_hi : gem.precautions_en;
    const benefits = currentLang === "hi" ? gem.benefits_hi : gem.benefits_en;

    displayCard.innerHTML = `
      <div class="gemstone-header-strip">
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <span style="font-size: 2.2rem;">💎</span>
          <div>
            <h3>${rashiName} — ${(currentLang === "hi") ? "रत्न परामर्श" : "Gemstone Prescription"}</h3>
            <span style="color: var(--gold-600); font-size: 0.95rem;">${(currentLang === "hi") ? "स्वामी ग्रह:" : "Ruling Planet:"} <strong>${planet}</strong></span>
          </div>
        </div>
        <a href="https://wa.me/${PANDIT_WA_CLEAN}?text=${encodeURIComponent(`Namaste Pandit Ji, I would like to consult on wearing gemstones for ${rashiName} based on my Janam Kundali.`)}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;">
          Consult Pandit Ji on WhatsApp
        </a>
      </div>

      <div class="gemstone-grid-info">
        <div class="gem-info-box primary-gem">
          <span class="gem-tag">${(currentLang === "hi") ? "जीवन / भाग्य रत्न (Primary Stone)" : "Primary Life Gemstone"}</span>
          <strong class="gem-title">${primaryGem}</strong>
          <p class="gem-benefits">${benefits}</p>
        </div>

        <div class="gem-info-box secondary-gem">
          <span class="gem-tag">${(currentLang === "hi") ? "सहायक / कारक रत्न (Secondary)" : "Secondary Lucky Gemstone"}</span>
          <strong class="gem-title">${secondaryGem}</strong>
          <p class="gem-benefits">${(currentLang === "hi") ? "दशा-अंतर्दशा में विशेष लाभ हेतु धारण किया जा सकता है।" : "Recommended during specific planetary Mahadashas and Antardashas."}</p>
        </div>
      </div>

      <div class="gemstone-vidhi-table">
        <div class="vidhi-row">
          <span class="vidhi-lbl">${(currentLang === "hi") ? "शुभ धातु (Auspicious Metal):" : "Setting Metal:"}</span>
          <strong class="vidhi-val">${metal}</strong>
        </div>
        <div class="vidhi-row">
          <span class="vidhi-lbl">${(currentLang === "hi") ? "धारण करने की अंगुली (Finger):" : "Wearing Finger:"}</span>
          <strong class="vidhi-val">${finger}</strong>
        </div>
        <div class="vidhi-row">
          <span class="vidhi-lbl">${(currentLang === "hi") ? "धारण का शुभ दिन व समय (Muhurat):" : "Auspicious Day & Muhurat:"}</span>
          <strong class="vidhi-val">${muhurat}</strong>
        </div>
        <div class="vidhi-row">
          <span class="vidhi-lbl">${(currentLang === "hi") ? "सावधानियां एवं शत्रु रत्न (Caution):" : "Incompatible Stones:"}</span>
          <strong class="vidhi-val" style="color: #D32F2F;">${precautions}</strong>
        </div>
      </div>

      <div class="rashifal-mantra-box" style="margin-top: 1.5rem;">
        <span class="mantra-title">${(currentLang === "hi") ? "प्राण प्रतिष्ठा एवं धारण मन्त्र (Chanting Mantra):" : "Consecration (Prana Pratishtha) Mantra:"}</span>
        <div class="sacred-devanagari-mantra">${gem.mantra}</div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     9. Feature 6: Auspicious Days & Vrat Engine
     -------------------------------------------------------------------------- */
  function renderAuspiciousDays() {
    // Detailed tables removed in favor of consultative guidance with Pandit Ji
  }

  /* --------------------------------------------------------------------------
     10. Feature 7: Shubh Muhurat Module
     -------------------------------------------------------------------------- */
  function renderShubhMuhurat() {
    // Detailed tables replaced by sacred categories overview & direct consultation with Pandit Ji
  }

  /* --------------------------------------------------------------------------
     11. Feature 8: Auspicious Marriage Dates (Vivah Muhurat 2026 - 2027)
     -------------------------------------------------------------------------- */
  function renderVivahMuhurat() {
    // Detailed tables replaced by Tribala & Lagna Shuddhi guidance & direct consultation with Pandit Ji
  }

  /* --------------------------------------------------------------------------
     12. 16 Sanskars Rendering & Modal Interactivity
     -------------------------------------------------------------------------- */
  function getActiveSanskarFilter() {
    const activeBtn = document.querySelector(".sanskar-tab-btn.active");
    return activeBtn ? activeBtn.getAttribute("data-filter") : "all";
  }

  function renderSanskars(filter = "all") {
    if (!sanskarGrid || typeof sanskarsData === "undefined") return;

    sanskarGrid.innerHTML = "";
    const filtered = (filter === "all") 
      ? sanskarsData 
      : sanskarsData.filter(s => s.phase === filter);

    filtered.forEach(s => {
      const card = document.createElement("div");
      card.className = "sanskar-item";
      card.setAttribute("data-id", s.id);

      const name = currentLang === "hi" ? s.name_hi : s.name_en;
      const subName = currentLang === "hi" ? s.name_en : s.name_hi;
      const phase = currentLang === "hi" ? s.phase_hi : s.phase_en;
      const desc = currentLang === "hi" ? s.desc_hi : s.desc_en;
      const btnText = currentLang === "hi" ? "विधान एवं महत्व देखें →" : "View Details & Vidhi →";

      card.innerHTML = `
        <span class="sanskar-number">${s.id}</span>
        <span class="sanskar-phase">${phase}</span>
        <h3 class="sanskar-name">${name}</h3>
        <span class="sanskar-name-hi">${subName}</span>
        <p class="sanskar-desc">${desc}</p>
        <span class="sanskar-view-btn">${btnText}</span>
      `;

      card.addEventListener("click", () => openSanskarModal(s));
      sanskarGrid.appendChild(card);
    });
  }

  sanskarTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      sanskarTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderSanskars(tab.getAttribute("data-filter"));
    });
  });

  function openSanskarModal(item) {
    if (!sanskarModal) return;

    const modalTitle = document.getElementById("modalSanskarTitle");
    const modalContent = document.getElementById("modalSanskarContent");

    const name = currentLang === "hi" ? item.name_hi : item.name_en;
    const subName = currentLang === "hi" ? item.name_en : item.name_hi;
    const phase = currentLang === "hi" ? item.phase_hi : item.phase_en;
    const desc = currentLang === "hi" ? item.desc_hi : item.desc_en;
    const significance = currentLang === "hi" ? item.significance_hi : item.significance_en;

    const headingVidhi = currentLang === "hi" ? "शास्त्रोक्त विधान एवं महत्व:" : "Sacred Vedic Significance & Vidhi:";
    const bookThisSanskar = currentLang === "hi" ? "यह संस्कार बुक करें" : "Book This Sanskar";

    modalTitle.textContent = `${item.id}. ${name} (${subName})`;
    modalContent.innerHTML = `
      <div class="modal-highlight-box">
        <span class="sanskar-phase">${phase}</span>
        <p style="margin-top: 0.5rem; font-weight: 600;">${desc}</p>
      </div>
      <h4 style="color: var(--maroon-800); margin-bottom: 0.5rem;">${headingVidhi}</h4>
      <p>${significance}</p>
      <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="#booking" class="btn btn-primary modal-book-action" style="font-size: 0.88rem; padding: 0.5rem 1.2rem;">
          ${bookThisSanskar}
        </a>
        <a href="https://wa.me/${PANDIT_WA_CLEAN}?text=${encodeURIComponent(`Namaste Pandit Ji, I would like to inquire about booking Sanskar #${item.id}: ${name} in Norway.`)}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="font-size: 0.88rem; padding: 0.5rem 1.2rem;">
          WhatsApp Inquiry
        </a>
      </div>
    `;

    const bookBtn = modalContent.querySelector(".modal-book-action");
    if (bookBtn) {
      bookBtn.addEventListener("click", () => {
        sanskarModal.close();
        if (serviceSelect) {
          serviceSelect.value = "Karmkand - 16 Sanskar";
        }
      });
    }

    if (typeof sanskarModal.showModal === "function") {
      sanskarModal.showModal();
    } else {
      sanskarModal.setAttribute("open", "true");
    }
  }

  if (modalCloseBtn && sanskarModal) {
    modalCloseBtn.addEventListener("click", () => sanskarModal.close());
  }
  if (modalDismissBtn && sanskarModal) {
    modalDismissBtn.addEventListener("click", () => sanskarModal.close());
  }
  if (sanskarModal) {
    sanskarModal.addEventListener("click", (e) => {
      if (e.target === sanskarModal) sanskarModal.close();
    });
  }

  /* --------------------------------------------------------------------------
     13. Dynamic Booking Form Interactions & Submission
     -------------------------------------------------------------------------- */
  if (serviceSelect && birthDetailsBox) {
    serviceSelect.addEventListener("change", () => {
      const val = serviceSelect.value.toLowerCase();
      if (val.includes("astrology") || val.includes("kundali") || val.includes("ज्योतिष")) {
        birthDetailsBox.classList.add("show");
      } else {
        birthDetailsBox.classList.remove("show");
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector("button[type='submit']");
      const originalBtnText = submitBtn.innerHTML;

      const formData = new FormData(bookingForm);
      const dataObj = Object.fromEntries(formData.entries());

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${PANDIT_EMAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(dataObj)
        });

        const result = await response.json();

        if (response.ok && (result.success === "true" || result.success === true)) {
          formFeedback.className = "form-feedback success";
          formFeedback.textContent = (currentLang === "hi")
            ? translations.hi.form_success_msg
            : translations.en.form_success_msg;
          bookingForm.reset();
          if (birthDetailsBox) birthDetailsBox.classList.remove("show");
        } else {
          throw new Error("FormSubmit submission unconfirmed");
        }
      } catch (err) {
        console.warn("FormSubmit notice:", err);
        formFeedback.className = "form-feedback error";
        formFeedback.innerHTML = `
          <p>${(currentLang === "hi") ? translations.hi.form_error_msg : translations.en.form_error_msg}</p>
        `;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  if (whatsappSendBtn && bookingForm) {
    whatsappSendBtn.addEventListener("click", () => {
      const name = document.getElementById("userName") ? document.getElementById("userName").value.trim() : "";
      const phone = document.getElementById("userPhone") ? document.getElementById("userPhone").value.trim() : "";
      const service = serviceSelect ? serviceSelect.value : "";
      const city = document.getElementById("userCity") ? document.getElementById("userCity").value.trim() : "";
      const date = document.getElementById("userDate") ? document.getElementById("userDate").value : "";
      const message = document.getElementById("userMessage") ? document.getElementById("userMessage").value.trim() : "";

      const dob = document.getElementById("userDob") ? document.getElementById("userDob").value : "";
      const tob = document.getElementById("userTob") ? document.getElementById("userTob").value : "";
      const pob = document.getElementById("userPob") ? document.getElementById("userPob").value.trim() : "";

      let waText = `*Namaste Pandit Dinesh Shastri Ji,*\n\n`;
      waText += `I would like to inquire about booking a Vedic Puja / Astrology consultation in Norway.\n\n`;
      if (name) waText += `• *Name:* ${name}\n`;
      if (phone) waText += `• *Phone:* ${phone}\n`;
      if (service) waText += `• *Service Required:* ${service}\n`;
      if (city) waText += `• *Location/City:* ${city}\n`;
      if (date) waText += `• *Preferred Date:* ${date}\n`;

      if (dob || tob || pob) {
        waText += `\n*Birth Details for Kundali:*\n`;
        if (dob) waText += `• *DOB:* ${dob}\n`;
        if (tob) waText += `• *Time of Birth:* ${tob}\n`;
        if (pob) waText += `• *Place of Birth:* ${pob}\n`;
      }

      if (message) waText += `\n• *Details:* ${message}\n`;

      const waUrl = `https://wa.me/${PANDIT_WA_CLEAN}?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  /* --------------------------------------------------------------------------
     14. FAQ Accordion Interactivity
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    if (questionBtn) {
      questionBtn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach(other => other.classList.remove("active"));
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  // Initialize all sections with current language
  applyLanguage(currentLang);
});
