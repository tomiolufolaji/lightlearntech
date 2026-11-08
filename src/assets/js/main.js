/* LightLearnTech – progressive enhancement only. The site works without JavaScript. */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      toggle.querySelector(".nav-toggle__label").textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    window.matchMedia("(min-width: 1120px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- Forms ---------- */
  var THROTTLE_MS = 30000; // one submission per form every 30 seconds per visitor
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function labelText(field) {
    var label = field.type === "radio"
      ? field.closest("fieldset").querySelector("legend")
      : field.form.querySelector('label[for="' + field.id + '"]');
    return label ? label.textContent.replace(/\*|\(required\)/g, "").trim() : field.name;
  }

  function validateField(field) {
    var v = (field.value || "").trim();
    var name = labelText(field);
    if (field.type === "radio") {
      var group = field.form.querySelectorAll('input[name="' + field.name + '"]');
      var checked = Array.prototype.some.call(group, function (r) { return r.checked; });
      return field.required && !checked ? "Choose your " + name.toLowerCase() + "." : "";
    }
    if (field.required && !v) {
      return field.tagName === "SELECT"
        ? "Choose an option for " + name.toLowerCase() + "."
        : "Enter your " + name.toLowerCase() + ".";
    }
    if (v && field.type === "email" && !EMAIL_RE.test(v)) {
      return "Enter an email address in the correct format, like name@example.com.";
    }
    if (v && field.type === "tel" && !/^[0-9+()\-\s]{7,20}$/.test(v)) {
      return "Enter a phone number using digits only, like 0801 234 5678.";
    }
    return "";
  }

  function showError(field, message) {
    var holder = field.type === "radio" ? field.closest("fieldset") : field.closest(".field");
    var err = holder && holder.querySelector(".field__error");
    if (!err) return;
    err.textContent = message;
    err.hidden = !message;
    if (field.type === "radio") {
      holder.querySelectorAll("input").forEach(function (r) {
        message ? r.setAttribute("aria-invalid", "true") : r.removeAttribute("aria-invalid");
      });
    } else if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function fieldsOf(form) {
    var seen = {};
    return Array.prototype.filter.call(form.elements, function (el) {
      if (!el.name || el.type === "hidden" || el.name === "bot-field" || el.tagName === "BUTTON") return false;
      if (el.type === "radio") {
        if (seen[el.name]) return false;
        seen[el.name] = true;
      }
      return true;
    });
  }

  function enhance(form) {
    var wrap = form.closest("[data-form-wrap]");
    var summary = form.querySelector("[data-error-summary]");
    var status = form.querySelector("[data-status]");
    var submit = form.querySelector("[data-submit]");
    var success = wrap.querySelector("[data-success]");
    var subject = form.querySelector("[data-subject]");
    var baseSubject = subject ? subject.value : "";
    var submitText = submit.textContent;

    form.setAttribute("novalidate", "");

    // Pre-select an option from the URL, e.g. /contact/?enquiry=Support
    var params = new URLSearchParams(window.location.search);
    form.querySelectorAll("[data-prefill]").forEach(function (select) {
      var wanted = (params.get(select.getAttribute("data-prefill")) || "").toLowerCase();
      if (!wanted) return;
      Array.prototype.forEach.call(select.options, function (opt) {
        if (opt.value.toLowerCase() === wanted) select.value = opt.value;
      });
    });

    // Re-check a field once the visitor leaves it (only after a first error)
    form.addEventListener("change", function (e) {
      var f = e.target;
      if (f.getAttribute("aria-invalid") === "true" || (f.type === "radio")) showError(f, validateField(f));
    });
    form.addEventListener("focusout", function (e) {
      var f = e.target;
      if (f.getAttribute("aria-invalid") === "true") showError(f, validateField(f));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.classList.remove("is-error");

      var errors = [];
      fieldsOf(form).forEach(function (f) {
        var msg = validateField(f);
        showError(f, msg);
        if (msg) errors.push({ field: f, msg: msg });
      });

      var list = summary.querySelector("ul");
      list.innerHTML = "";
      if (errors.length) {
        errors.forEach(function (er) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          var target = er.field.type === "radio" ? er.field.closest("fieldset").querySelector("input") : er.field;
          a.href = "#" + (target.id || er.field.closest("fieldset").id);
          a.textContent = er.msg;
          a.addEventListener("click", function (ev) { ev.preventDefault(); target.focus(); });
          li.appendChild(a);
          list.appendChild(li);
        });
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;

      // Light client-side rate limit (spam is also filtered server-side by Netlify)
      var key = "llt-sent-" + form.name;
      var last = 0;
      try { last = Number(sessionStorage.getItem(key)) || 0; } catch (err) { /* storage blocked */ }
      if (Date.now() - last < THROTTLE_MS) {
        status.textContent = "You have just sent a message. Please wait a moment before sending another.";
        status.classList.add("is-error");
        return;
      }

      // Put the enquiry type in the email subject line, e.g. "Contact form – … (Support)"
      var type = form.querySelector('[name="enquiry_type"], [name="partnership_type"], [name="area_of_interest"]');
      if (subject && type && type.value) subject.value = baseSubject + " (" + type.value + ")";

      submit.disabled = true;
      submit.textContent = "Sending…";

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          try { sessionStorage.setItem(key, String(Date.now())); } catch (err) { /* ignore */ }
          form.reset();
          form.hidden = true;
          success.hidden = false;
          success.focus();
        })
        .catch(function () {
          var email = document.querySelector('a[href^="mailto:"]');
          status.textContent = "Sorry, your message could not be sent. Please try again" +
            (email ? ", or email us at " + email.textContent.trim() : "") + ".";
          status.classList.add("is-error");
        })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = submitText;
        });
    });
  }

  document.querySelectorAll("form[data-enhanced-form]").forEach(enhance);
})();
