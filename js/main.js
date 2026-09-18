/* ==========================================================================
   Vedic Astrologer & Hindu Priest in Norway - Pandit Dinesh Shastri
   Interactive Application Logic & i18n
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Current active language: default 'en', or check localStorage
  let currentLang = localStorage.getItem("preferred_lang") || "en";

  // Cache elements
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

  // Phone and WhatsApp number constants
  const PANDIT_PHONE = "+47 97335299";
  const PANDIT_WA_CLEAN = "4797335299";
  const PANDIT_EMAIL = "dineshshashtri82@gmail.com";

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

    // Re-render Sanskars with current language
    renderSanskars(getActiveSanskarFilter());

    // Update html lang attribute
    document.documentElement.lang = lang;
  }

  // Language button event listeners
  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      applyLanguage(lang);
    });
  });

  /* --------------------------------------------------------------------------
     2. Mobile Menu Toggle & Navigation Smooth Scroll
     -------------------------------------------------------------------------- */
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      mobileNavToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      mobileNavToggle.innerHTML = isOpen ? "✕" : "☰";
    });

    // Close menu when clicking outside or clicking any nav link
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileNavToggle.setAttribute("aria-expanded", "false");
        mobileNavToggle.innerHTML = "☰";
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. 16 Sanskars Rendering & Filtering
     -------------------------------------------------------------------------- */
  function getActiveSanskarFilter() {
    const activeBtn = document.querySelector(".sanskar-tab-btn.active");
    return activeBtn ? activeBtn.getAttribute("data-filter") : "all";
  }

  function renderSanskars(filter = "all") {
    if (!sanskarGrid) return;

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

  // Filter Tabs Event Listeners
  sanskarTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      sanskarTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderSanskars(tab.getAttribute("data-filter"));
    });
  });

  /* --------------------------------------------------------------------------
     4. 16 Sanskars Modal Details
     -------------------------------------------------------------------------- */
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

    // Hook the modal book button to preselect the service and close modal
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
     5. Dynamic Form Interactions & Birth Details Toggling
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

  /* --------------------------------------------------------------------------
     6. Booking Inquiry Form Submission (FormSubmit AJAX + WhatsApp Fallback)
     -------------------------------------------------------------------------- */
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector("button[type='submit']");
      const originalBtnText = submitBtn.innerHTML;

      // Extract form values
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

  // Quick "Send via WhatsApp" Button
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
     7. FAQ Accordion Interactivity
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    if (questionBtn) {
      questionBtn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        // Close others
        faqItems.forEach(other => other.classList.remove("active"));
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  // Initialize page with preferred language
  applyLanguage(currentLang);
});
