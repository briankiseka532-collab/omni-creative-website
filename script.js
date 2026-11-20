document.addEventListener("DOMContentLoaded", () => {
  const config = window.OMNI_CONFIG || {};

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Footer year
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Portfolio filters
  const filterButtons = document.querySelectorAll(".filter-button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      portfolioItems.forEach(item => {
        const show =
          filter === "all" || item.dataset.category === filter;

        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  // Service enquiry links
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const serviceSelect = document.getElementById("serviceType");

      if (serviceSelect) {
        const wanted = link.dataset.service;

        const option = Array.from(serviceSelect.options).find(
          item => item.text.trim() === wanted.trim()
        );

        if (option) serviceSelect.value = option.value;
      }
    });
  });

  // WhatsApp configuration
  const whatsapp = String(config.whatsappNumber || "").replace(/\D/g, "");
  const validWhatsApp = /^\d{10,15}$/.test(whatsapp);

  // Enquiry form
  const form = document.getElementById("quoteForm");
  const note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!validWhatsApp) {
        if (note) {
          note.textContent =
            "The business WhatsApp number is not configured correctly.";
          note.classList.add("form-error");
        }

        alert("Please contact the website owner about the WhatsApp number.");
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);

      const message = [
        "Hello Omni Creative Print and Branding Limited,",
        "",
        "I would like to make a project enquiry.",
        "Name: " + data.get("name"),
        "Phone / Email: " + data.get("contact"),
        "Service: " + data.get("service"),
        "Project details: " + data.get("details"),
        "",
        "Thank you."
      ].join("\n");

      const whatsappURL =
        "https://wa.me/" + whatsapp + "?text=" +
        encodeURIComponent(message);

      if (note) {
        note.textContent =
          "Opening WhatsApp. Please review your enquiry and press Send.";
        note.classList.remove("form-error");
      }

      // Navigate directly to WhatsApp to avoid mobile popup blocking
      window.location.href = whatsappURL;
    });
  }

  // Business phone / WhatsApp link
  const phoneLink = document.getElementById("businessPhone");
  const phoneNumbers = Array.isArray(config.phoneNumbers)
    ? config.phoneNumbers
    : [];

  if (phoneLink && validWhatsApp) {
    phoneLink.href = "https://wa.me/" + whatsapp;
    phoneLink.target = "_blank";
    phoneLink.rel = "noopener noreferrer";
    phoneLink.textContent =
      "WhatsApp: +" + whatsapp;
  }

  // Business email link
  const emailLink = document.getElementById("businessEmail");
  const email = String(config.emailAddress || "").trim();

  if (
    emailLink &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    emailLink.href = "mailto:" + email;
    emailLink.textContent = email;
  }

  // Display contact numbers
  if (phoneLink && phoneNumbers.length) {
    phoneLink.href = "https://wa.me/" + whatsapp;
    phoneLink.textContent =
      "Contacts: " + phoneNumbers.join(" · ");
  }

  // Floating WhatsApp button
  const floatingWhatsApp =
    document.getElementById("floatingWhatsApp");

  if (floatingWhatsApp) {
    if (validWhatsApp) {
      floatingWhatsApp.href =
        "https://wa.me/" + whatsapp;

      floatingWhatsApp.target = "_blank";
      floatingWhatsApp.rel = "noopener noreferrer";
    } else {
      floatingWhatsApp.href = "#quote";
    }
  }
});
