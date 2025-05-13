window.showTestToast = function() {
  const successToast = document.getElementById('success-toast');
  successToast.classList.add('show');
  setTimeout(() => {
    successToast.classList.remove('show');
  }, 3000); // Hide after 3 seconds
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const successToast = document.getElementById("success-toast");
  const formFields = {
    firstName: document.getElementById("first-name"),
    lastName: document.getElementById("last-name"),
    email: document.getElementById("email"),
    queryGeneral: document.getElementById("query-general"),
    querySupport: document.getElementById("query-support"),
    message: document.getElementById("message"),
    consent: document.getElementById("consent"),
  };

  // Hide all error messages initially
  document.querySelectorAll(".form__error").forEach((error) => {
    error.style.display = "none";
  });
  
  // Improve keyboard navigation for radio buttons
  const radioButtons = [formFields.queryGeneral, formFields.querySupport];
  radioButtons.forEach((radio, index) => {
    if (!radio) return;
    
    radio.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (index - 1 + radioButtons.length) % radioButtons.length;
        radioButtons[prevIndex].focus();
        radioButtons[prevIndex].checked = true;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (index + 1) % radioButtons.length;
        radioButtons[nextIndex].focus();
        radioButtons[nextIndex].checked = true;
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    // Reset previous errors
    document
      .querySelectorAll(".form__field, .form__fieldset")
      .forEach((field) => {
        field.classList.remove("error");
      });
    document.querySelectorAll(".form__error").forEach((error) => {
      error.style.display = "none";
    });
    document.querySelectorAll(".form__radio-option").forEach((option) => {
      option.style.borderColor = "";
    });

    // Validate first name
    if (!formFields.firstName.value.trim()) {
      document.getElementById("first-name-error").style.display = "block";
      formFields.firstName.parentElement.classList.add("error");
      isValid = false;
    }

    // Validate last name
    if (!formFields.lastName.value.trim()) {
      document.getElementById("last-name-error").style.display = "block";
      formFields.lastName.parentElement.classList.add("error");
      isValid = false;
    }

    // Validate email
    if (!formFields.email.value.trim()) {
      document.getElementById("email-error").style.display = "block";
      document.getElementById("email-format-error").style.display = "none";
      formFields.email.parentElement.classList.add("error");
      isValid = false;
    } else if (!isValidEmail(formFields.email.value)) {
      document.getElementById("email-format-error").style.display = "block";
      document.getElementById("email-error").style.display = "none";
      formFields.email.parentElement.classList.add("error");
      isValid = false;
    }

    // Validate query type
    if (!formFields.queryGeneral.checked && !formFields.querySupport.checked) {
      document.getElementById("query-type-error").style.display = "block";
      document.querySelector(".form__fieldset").classList.add("error");

      // Add error class to radio options for red borders
      document.querySelectorAll(".form__radio-option").forEach((option) => {
        option.style.borderColor = "var(--color-red)";
      });

      isValid = false;
    }

    // Validate message
    if (!formFields.message.value.trim()) {
      document.getElementById("message-error").style.display = "block";
      formFields.message.parentElement.classList.add("error");
      isValid = false;
    }

    // Validate consent
    if (!formFields.consent.checked) {
      document.getElementById("consent-error").style.display = "block";
      formFields.consent.closest(".form__field").classList.add("error");
      isValid = false;
    }

    // If valid, show success toast and announce to screen readers
    if (isValid) {
      // Announce successful submission to screen readers
      announceToScreenReaders("Your form has been successfully submitted. Thank you!");
      
      // Show toast
      successToast.classList.add("show");

      // Hide toast after 5 seconds
      setTimeout(() => {
        successToast.classList.remove("show");
      }, 5000);

      // Reset form
      form.reset();
    } else {
      // Announce form errors to screen readers
      announceToScreenReaders("There are errors in the form that need to be corrected before submitting.");
    }
  });

  // Screen reader announcement helper
  function announceToScreenReaders(message) {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('role', 'status');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  // Email validation helper function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Real-time validation on blur
  Object.keys(formFields).forEach((key) => {
    const field = formFields[key];
    if (!field) return; // Skip if element doesn't exist

    field.addEventListener("blur", function () {
      validateField(key, field);
    });

    // For radio buttons, handle validation on change instead
    if (key.startsWith("query")) {
      field.addEventListener("change", function () {
        // Clear error when any radio is selected
        document.getElementById("query-type-error").style.display = "none";
        document.querySelector(".form__fieldset").classList.remove("error");
        // Reset border color for radio options
        document.querySelectorAll(".form__radio-option").forEach((option) => {
          option.style.borderColor = "";
        });
      });
    } else if (key === "consent") {
      field.addEventListener("change", function() {
        if (field.checked) {
          document.getElementById("consent-error").style.display = "none";
          field.closest(".form__field").classList.remove("error");
        }
      });
    } else {
      field.addEventListener("input", function () {
        // Remove error state when user starts typing again
        if (key === "email") {
          document.getElementById("email-error").style.display = "none";
          document.getElementById("email-format-error").style.display = "none";
        } else {
          const errorId = field.id + "-error";
          const errorElement = document.getElementById(errorId);
          if (errorElement) {
            errorElement.style.display = "none";
          }
        }
        field.parentElement.classList.remove("error");
      });
    }
  });

  function validateField(fieldName, field) {
    switch (fieldName) {
      case "firstName":
        if (!field.value.trim()) {
          document.getElementById("first-name-error").style.display = "block";
          field.parentElement.classList.add("error");
        }
        break;
      case "lastName":
        if (!field.value.trim()) {
          document.getElementById("last-name-error").style.display = "block";
          field.parentElement.classList.add("error");
        }
        break;
      case "email":
        if (!field.value.trim()) {
          document.getElementById("email-error").style.display = "block";
          document.getElementById("email-format-error").style.display = "none";
          field.parentElement.classList.add("error");
        } else if (!isValidEmail(field.value)) {
          document.getElementById("email-format-error").style.display = "block";
          document.getElementById("email-error").style.display = "none";
          field.parentElement.classList.add("error");
        }
        break;
      case "message":
        if (!field.value.trim()) {
          document.getElementById("message-error").style.display = "block";
          field.parentElement.classList.add("error");
        }
        break;
      case "consent":
        if (!field.checked) {
          document.getElementById("consent-error").style.display = "block";
          field.closest(".form__field").classList.add("error");
        }
        break;
    }
  }
});