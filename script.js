(() => {
  "use strict";

  const config = window.CLINIC_CONFIG || {};
  const readSetting = (key) => typeof config[key] === "string" ? config[key].trim() : "";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const menuToggle = document.querySelector("#menu-toggle");
  const mainNav = document.querySelector("#main-nav");
  const header = document.querySelector(".site-header");

  function installPageTransition() {
    if (!document.body || document.querySelector("#page-transition")) return;

    const transition = document.createElement("div");
    transition.id = "page-transition";
    transition.className = "page-transition is-active";
    transition.setAttribute("aria-hidden", "true");
    transition.innerHTML = `
      <div class="page-transition-mark">
        <span class="page-transition-orbit"></span>
        <svg viewBox="0 0 128 148" focusable="false">
          <path class="page-transition-tooth" d="M64 20C51 20 42 10 28 17C8 27 17 56 23 74C31 98 34 132 47 132C59 132 53 91 64 91C75 91 69 132 81 132C94 132 97 98 105 74C111 56 120 27 100 17C86 10 77 20 64 20Z"/>
          <path class="page-transition-shine" d="M34 30C44 23 51 29 59 31"/>
          <g class="page-transition-mini-tooth" transform="translate(54 26) scale(.42)">
            <path d="M24 10c-5 0-7-5-13-3C3 10 7 23 10 30c2 6 3 12 7 12s3-13 7-13 3 13 7 13 5-6 7-12c3-7 7-20-1-23-6-2-8 3-13 3Z"/>
          </g>
          <text class="page-transition-word" x="64" y="67">Hello</text>
          <text class="page-transition-word page-transition-word-strong" x="64" y="82">Teeth</text>
        </svg>
      </div>`;
    document.body.prepend(transition);
    document.body.classList.add("page-is-transitioning");

    let hideTimer;
    let navigationTimer;
    const hideTransition = (immediate = false) => {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        transition.classList.remove("is-active", "is-leaving");
        transition.classList.add("is-hidden");
        document.body.classList.remove("page-is-transitioning", "page-is-leaving");
      }, immediate || reducedMotion.matches ? 40 : 480);
    };

    if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", () => hideTransition(), { once: true });
    else hideTransition();
    window.addEventListener("pageshow", (event) => hideTransition(event.persisted));

    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      if (!link || link.hasAttribute("download") || link.dataset.noPageTransition !== undefined || link.target === "_blank") return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (destination.protocol !== window.location.protocol || destination.host !== window.location.host) return;

      const currentDocument = new URL(window.location.href);
      const nextDocument = new URL(destination.href);
      currentDocument.hash = "";
      nextDocument.hash = "";
      if (currentDocument.href === nextDocument.href) return;

      event.preventDefault();
      window.clearTimeout(hideTimer);
      window.clearTimeout(navigationTimer);
      transition.classList.remove("is-hidden");
      void transition.offsetWidth;
      transition.classList.add("is-active", "is-leaving");
      document.body.classList.add("page-is-transitioning", "page-is-leaving");
      navigationTimer = window.setTimeout(() => window.location.assign(destination.href), reducedMotion.matches ? 70 : 430);
    });
  }

  installPageTransition();

  function setMenuOpen(open, returnFocus = false) {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mainNav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (returnFocus) menuToggle.focus();
  }

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, true);
    }
  });

  document.addEventListener("click", (event) => {
    if (menuToggle?.getAttribute("aria-expanded") === "true" &&
        !mainNav?.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (menuToggle && window.getComputedStyle(menuToggle).display === "none") {
      setMenuOpen(false);
    }
  }, { passive: true });

  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealElements.forEach((element) => {
      element.classList.add("reveal-ready");
      observer.observe(element);
    });
    reducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        observer.disconnect();
        revealElements.forEach((element) => element.classList.add("is-visible"));
      }
    });
  }

  const treatmentContent = {
    general: {
      title: "General dentistry",
      description: "A thoughtful starting point for looking after your smile, with time to talk about your concerns and everyday care.",
      details: ["Discuss check-ups and routine dental care.", "Ask about cleaning and preventive care.", "Share any concerns you would like a dentist to assess."]
    },
    cosmetic: {
      title: "Cosmetic dentistry",
      description: "Explore the changes you would like to make to your smile and the options to discuss at a consultation.",
      details: ["Talk about your smile goals and preferences.", "Ask about whitening, veneers, and cosmetic options.", "Discuss suitability, maintenance, and expected costs with the dentist."]
    },
    implants: {
      title: "Dental implants",
      description: "Start a conversation about replacing missing teeth and the assessment needed to understand your options.",
      details: ["Ask about an individual assessment and treatment options.", "Discuss the number of visits, costs, and follow-up care.", "If travelling, confirm your care plan before booking flights."]
    },
    aligners: {
      title: "Clear aligners",
      description: "Find out whether clear aligners could be an option for the changes you would like to make to your smile.",
      details: ["Describe your goals at an initial consultation.", "Ask about assessment, wearing schedules, and review visits.", "Discuss your proposed treatment timeline and retention plan."]
    },
    restorative: {
      title: "Restorative dentistry",
      description: "Discuss concerns about damaged or missing teeth and understand the options available after an assessment.",
      details: ["Ask about fillings, crowns, bridges, and other restorative options.", "Discuss your priorities, comfort, and ongoing care.", "Request a clear explanation of the recommended plan and costs."]
    },
    children: {
      title: "Children’s dentistry",
      description: "A welcoming introduction to dental care, with space for children and parents to ask questions.",
      details: ["Ask about a first visit or a routine check-up.", "Discuss everyday brushing and age-appropriate dental care.", "Let the team know what would help your child feel comfortable."]
    }
  };

  const dialog = document.querySelector("#treatment-dialog");
  const dialogTitle = document.querySelector("#treatment-title");
  const dialogDescription = document.querySelector("#treatment-description");
  const dialogDetails = document.querySelector("#treatment-details");
  const privacyDialog = document.querySelector("#privacy-dialog");

  function openDialog(target) {
    if (!target || target.open || typeof target.showModal !== "function") return;
    setMenuOpen(false);
    target.showModal();
    document.body.classList.add("dialog-open");
  }

  const closeDialog = (target) => {
    if (target?.open) target.close();
  };

  document.querySelectorAll("[data-treatment]").forEach((button) => {
    button.addEventListener("click", () => {
      const treatment = treatmentContent[button.dataset.treatment];
      if (!treatment || !dialog || !dialogTitle || !dialogDescription || !dialogDetails) return;
      if (typeof dialog.showModal !== "function") {
        document.querySelector("#inquiry")?.scrollIntoView();
        return;
      }
      dialogTitle.textContent = treatment.title;
      dialogDescription.textContent = treatment.description;
      dialogDetails.replaceChildren(...treatment.details.map((detail) => {
        const item = document.createElement("li");
        item.textContent = detail;
        return item;
      }));
      openDialog(dialog);
    });
  });

  document.querySelectorAll("[data-open-privacy]").forEach((button) => {
    button.addEventListener("click", () => openDialog(privacyDialog));
  });

  const teamCategoryButtons = [...document.querySelectorAll(".team-category-card[data-team-category]")];
  const teamGalleryItems = [...document.querySelectorAll("[data-team-member]")];
  const teamGalleryDialog = document.querySelector("#team-gallery-dialog");
  const teamGalleryImage = document.querySelector("#team-gallery-image");
  const teamGalleryCaption = document.querySelector("#team-gallery-caption");
  const teamPreviousButton = document.querySelector("[data-team-previous]");
  const teamNextButton = document.querySelector("[data-team-next]");
  let activeTeamItems = [];
  let activeTeamPhoto = 0;

  function showTeamPhoto(index) {
    if (!activeTeamItems.length || !teamGalleryImage || !teamGalleryCaption) return;
    activeTeamPhoto = (index + activeTeamItems.length) % activeTeamItems.length;
    const item = activeTeamItems[activeTeamPhoto];
    teamGalleryImage.src = item.dataset.teamSrc || "";
    teamGalleryImage.alt = item.dataset.teamAlt || "Hello Teeth team member";
    teamGalleryCaption.textContent = item.dataset.teamCaption || teamGalleryImage.alt;
  }

  teamCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTeamItems = teamGalleryItems.filter((item) => item.dataset.teamCategory === button.dataset.teamCategory);
      const hasMultiplePhotos = activeTeamItems.length > 1;
      teamPreviousButton?.toggleAttribute("hidden", !hasMultiplePhotos);
      teamNextButton?.toggleAttribute("hidden", !hasMultiplePhotos);
      teamGalleryDialog?.classList.toggle("has-single-photo", !hasMultiplePhotos);
      showTeamPhoto(0);
      openDialog(teamGalleryDialog);
    });
  });

  teamPreviousButton?.addEventListener("click", () => showTeamPhoto(activeTeamPhoto - 1));
  teamNextButton?.addEventListener("click", () => showTeamPhoto(activeTeamPhoto + 1));
  teamGalleryDialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showTeamPhoto(activeTeamPhoto - 1);
    if (event.key === "ArrowRight") showTeamPhoto(activeTeamPhoto + 1);
  });

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(button.closest("dialog")));
  });

  document.querySelectorAll("dialog").forEach((modal) => {
    // Native dialogs handle Escape, focus trapping, and focus restoration.
    modal.addEventListener("close", () => {
      document.body.classList.toggle("dialog-open", Boolean(document.querySelector("dialog[open]")));
    });
    modal.addEventListener("click", (event) => {
      if (event.target !== modal) return;
      const bounds = modal.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(modal);
    });
  });

  document.querySelector("#treatment-inquire")?.addEventListener("click", () => {
    closeDialog(dialog);
    window.requestAnimationFrame(() => {
      const inquiry = document.querySelector("#inquiry");
      if (!inquiry) return;
      inquiry.setAttribute("tabindex", "-1");
      inquiry.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll("[data-year], #current-year").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll("[data-clinic-address]").forEach((element) => {
    element.textContent = readSetting("address") || "1/346, Virat Khand, Gomti Nagar, near Sani Temple or Samudaik Kendra (LDA Office), Lucknow, Uttar Pradesh 226010, India";
  });

  document.querySelectorAll("[data-clinic-dentist]").forEach((element) => {
    const name = readSetting("dentistName");
    element.hidden = !name;
    if (name) element.textContent = name;
  });

  function configureContact(selector, href, label) {
    document.querySelectorAll(selector).forEach((link) => {
      link.hidden = !href;
      if (!href) {
        link.removeAttribute("href");
        return;
      }
      link.href = href;
      const labelElement = link.querySelector("[data-contact-label]");
      if (labelElement) labelElement.textContent = label;
      else if (!link.textContent.trim()) link.append(document.createTextNode(label));
    });
  }

  const phone = readSetting("phone");
  const phoneDigits = phone.replace(/[\s().-]/g, "");
  configureContact("[data-contact-phone]", /^\+?\d{7,15}$/.test(phoneDigits) ? `tel:${phoneDigits}` : "", phone);

  const email = readSetting("email");
  configureContact("[data-contact-email]", /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email) ? `mailto:${email}` : "", email);

  const whatsappNumber = readSetting("whatsappNumber").replace(/[\s()+.-]/g, "");
  configureContact("[data-whatsapp]", /^[1-9]\d{6,14}$/.test(whatsappNumber) ? `https://wa.me/${whatsappNumber}` : "", "Chat on WhatsApp");

  // Use Google's hosted responder forms. This site never receives, saves, or
  // pretends to submit patient information, and never exposes response sheets.
  function configureGoogleForm({ setting, placeholderSelector, frameSelector, openSelector, statusSelector, label }) {
    const placeholder = document.querySelector(placeholderSelector);
    const formFrame = document.querySelector(frameSelector);
    const formOpen = document.querySelector(openSelector);
    const formStatus = document.querySelector(statusSelector);

    if (!placeholder && !formFrame && !formOpen && !formStatus) return;
    if (placeholder) placeholder.hidden = false;
    if (formFrame) {
      formFrame.hidden = true;
      formFrame.removeAttribute("src");
    }
    if (formOpen) {
      formOpen.hidden = true;
      formOpen.removeAttribute("href");
    }
    if (formStatus) formStatus.hidden = true;

    const rawFormUrl = readSetting(setting);
    if (!rawFormUrl) return;

    let formUrl;
    try {
      formUrl = new URL(rawFormUrl);
    } catch {
      return;
    }

    if (formUrl.protocol !== "https:" || formUrl.username || formUrl.password || formUrl.port) return;
    const isGoogleForm = formUrl.hostname === "docs.google.com" &&
      /^\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform\/?$/.test(formUrl.pathname);
    const isShortFormLink = formUrl.hostname === "forms.gle" && /^\/[A-Za-z0-9_-]+\/?$/.test(formUrl.pathname);
    if (!isGoogleForm && !isShortFormLink) return;

    formUrl.hash = "";
    formUrl.searchParams.delete("embedded");
    if (formOpen) {
      formOpen.href = formUrl.href;
      formOpen.target = "_blank";
      formOpen.rel = "noopener noreferrer";
      formOpen.hidden = false;
    }

    if (isGoogleForm && formFrame) {
      formUrl.searchParams.set("embedded", "true");
      formFrame.src = formUrl.href;
      formFrame.hidden = false;
      if (placeholder) placeholder.hidden = true;
      if (formStatus) {
        formStatus.textContent = `Complete the Google Form below to send your ${label}. If it does not load, open the form in a new tab.`;
        formStatus.hidden = false;
      }
    } else if (formOpen) {
      if (placeholder) placeholder.hidden = true;
      if (formStatus) {
        formStatus.textContent = `Our ${label} form opens in a new tab. Your response will be sent through Google Forms.`;
        formStatus.hidden = false;
      }
    }
  }

  configureGoogleForm({
    setting: "googleFormUrl",
    placeholderSelector: "#google-form-placeholder",
    frameSelector: "#google-form-frame",
    openSelector: "#google-form-open",
    statusSelector: "#inquiry-status",
    label: "appointment inquiry"
  });

  configureGoogleForm({
    setting: "consultationFormUrl",
    placeholderSelector: "#consultation-form-placeholder",
    frameSelector: "#consultation-form-frame",
    openSelector: "#consultation-form-open",
    statusSelector: "#consultation-status",
    label: "online consultation request"
  });
})();
