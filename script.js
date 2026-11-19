document.addEventListener("DOMContentLoaded", () => {
  const config = window.OMNI_CONFIG || {};
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  // Mobile navigation
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Current year in footer
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
        const shouldShow = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // Prefill service when a service card enquiry link is clicked
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const serviceSelect = document.getElementById("serviceType");
      if (serviceSelect) {
        const wanted = link.dataset.service;
        const matchingOption = Array.from(serviceSelect.options).find(option => option.text === wanted);
        if (matchingOption) serviceSelect.value = matchingOption.value;
      }
    });
  });

  // WhatsApp enquiry form
  const form = document.getElementById("quoteForm");
  const note = document.getElementById("formNote");
  const whatsapp = String(config.whatsappNumber || "").replace(/\D/g, "");
  const validWhatsApp = /^\d{10,15}$/.test(whatsapp) && !whatsapp.includes("XXXXXXXX");

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!validWhatsApp) {
        if (note) {
          note.textContent = "Before launch, add your real WhatsApp number in config.js (international format, e.g. 2567XXXXXXXX).";
          note.classList.add("form-error");
        }
        alert("The website owner needs to add the business WhatsApp number in config.js before enquiries can be sent.");
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

      const url = "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener,noreferrer");
      if (note) {
        note.textContent = "WhatsApp has opened with your enquiry. Review the message and press Send.";
        note.classList.remove("form-error");
      }
    });
  }


  // Display business contact details from config.js when they are configured
  const phoneLink = document.getElementById("businessPhone");
  if (phoneLink && validWhatsApp) {
    phoneLink.href = "https://wa.me/" + whatsapp;
    phoneLink.target = "_blank";
    phoneLink.rel = "noopener noreferrer";
    phoneLink.textContent = "WhatsApp: +" + whatsapp;
  }

  const emailLink = document.getElementById("businessEmail");
  const email = String(config.emailAddress || "").trim();
  if (emailLink && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) && !email.includes("example.com")) {
    emailLink.href = "mailto:" + email;
    emailLink.textContent = email;
  }

  // Business contact details from config.js
  const phoneLink = document.getElementById("businessPhone");
  const phoneNumbers = Array.isArray(config.phoneNumbers) ? config.phoneNumbers : [];
  if (phoneLink && phoneNumbers.length) {
    phoneLink.href = "tel:" + phoneNumbers[0].replace(/[^+\\d]/g, "");
    phoneLink.textContent = "Contacts: " + phoneNumbers.join(" · ");
  }
  const emailLink = document.getElementById("businessEmail");
  if (emailLink && config.emailAddress) {
    emailLink.href = "mailto:" + config.emailAddress;
    emailLink.textContent = config.emailAddress;
  }

  // Floating WhatsApp shortcut
  const floatingWhatsApp = document.getElementById("floatingWhatsApp");
  if (floatingWhatsApp) {
    if (validWhatsApp) {
      floatingWhatsApp.href = "https://wa.me/" + whatsapp;
      floatingWhatsApp.target = "_blank";
      floatingWhatsApp.rel = "noopener noreferrer";
    } else {
      floatingWhatsApp.href = "#quote";
      floatingWhatsApp.addEventListener("click", event => {
        event.preventDefault();
        document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }
});
