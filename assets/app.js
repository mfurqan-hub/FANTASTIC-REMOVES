function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function currentPath() {
  const p = window.location.pathname.replace(/\\/g, "/");
  const file = p.split("/").pop() || "index.html";
  return file === "" ? "index.html" : file;
}

function setActiveNav() {
  const file = currentPath();
  qsa("[data-nav]").forEach((a) => {
    const target = a.getAttribute("href") || "";
    const targetFile = (target.split("/").pop() || "").trim();
    if (!targetFile) return;
    a.classList.toggle("active", targetFile === file);
  });
}

function setupSmoothScroll() {
  qsa("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-scroll-to");
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupFaq() {
  qsa(".faq-item button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (!item) return;
      item.classList.toggle("open");
    });
  });
}

function ensureToastWrap() {
  let wrap = qs(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  return wrap;
}

function toast(title, description) {
  const wrap = ensureToastWrap();
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<b>${escapeHtml(title)}</b><small>${escapeHtml(description)}</small>`;
  wrap.appendChild(el);
  window.setTimeout(() => {
    el.remove();
  }, 4200);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return c;
    }
  });
}

function setYear() {
  qsa("[data-year]").forEach((n) => (n.textContent = String(new Date().getFullYear())));
}

function validateQuoteForm(form) {
  const fields = [
    { name: "name", label: "Full Name", required: true, min: 2 },
    { name: "phone", label: "Phone Number", required: true, min: 10 },
    { name: "email", label: "Email Address", required: true, email: true },
    { name: "moveType", label: "Type of Move", required: true },
    { name: "fromPostcode", label: "Moving From", required: true, min: 2 },
    { name: "toPostcode", label: "Moving To", required: true, min: 2 },
    { name: "date", label: "Est. Date", required: true },
  ];

  let ok = true;

  fields.forEach((f) => {
    const input = form.elements.namedItem(f.name);
    const errorEl = qs(`[data-error-for="${f.name}"]`, form);
    if (errorEl) errorEl.textContent = "";

    const value = input && "value" in input ? String(input.value || "").trim() : "";

    let msg = "";
    if (f.required && value.length === 0) msg = `${f.label} is required.`;
    if (!msg && f.min && value.length < f.min) msg = `${f.label} must be at least ${f.min} characters.`;
    if (!msg && f.email) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!emailOk) msg = "Invalid email address.";
    }

    if (msg) {
      ok = false;
      if (errorEl) errorEl.textContent = msg;
    }
  });

  return ok;
}

function setupQuoteForm() {
  const form = qs('form[data-quote-form="true"]');
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateQuoteForm(form)) return;

    const data = Object.fromEntries(new FormData(form).entries());
    // For now we just show a confirmation toast like the React demo.
    console.log("Quote request", data);

    toast("Quote Request Received!", "We'll be in touch within 30 minutes with your estimate.");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  setActiveNav();
  setupSmoothScroll();
  setupFaq();
  setupQuoteForm();
});

