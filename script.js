(function () {
  'use strict';

  function initApp() {
    initNavigation();
    initHeroCarousel();
    initContactValidation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  /* NAVBAR*/
  function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', function () {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
        mainNav.classList.toggle('open');
      });
    }

    dropdownToggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const parent = btn.closest('.nav-dropdown');
        if (!parent) return;
        const isOpen = parent.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.nav-dropdown.open').forEach(function (dropdown) {
        dropdown.classList.remove('open');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /*CARRUSEL*/
  function initHeroCarousel() {
    const carouselSection = document.querySelector('.hero-carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const counterEl = document.getElementById('carousel-counter');
    const captionEl = document.getElementById('carousel-caption');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

   
    if (!carouselSection || slides.length === 0) return;

    const slideCaptions = [
      'La esencia de nuestra cocina',
      'El calor de nuestra casa en el Monte do Gozo',
      'Vinos con origen para acompañar sin prisa'
    ];

    let currentIndex = 0;
    let autoPlayTimer = null;
    const SLIDE_INTERVAL = 3500; 

    function showSlide(targetIndex) {
      slides.forEach(function (slide) {
        slide.classList.remove('active');
      });
      indicators.forEach(function (ind) {
        ind.classList.remove('active');
      });

     
      currentIndex = (targetIndex + slides.length) % slides.length;

      slides[currentIndex].classList.add('active');
      if (indicators[currentIndex]) {
        indicators[currentIndex].classList.add('active');
      }

      
      if (counterEl) {
        const currentFormatted = String(currentIndex + 1).padStart(2, '0');
        const totalFormatted = String(slides.length).padStart(2, '0');
        counterEl.textContent = currentFormatted + ' / ' + totalFormatted;
      }

      if (captionEl && slideCaptions[currentIndex]) {
        captionEl.textContent = slideCaptions[currentIndex];
      }
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = window.setInterval(nextSlide, SLIDE_INTERVAL);
    }

    function stopAutoPlay() {
      if (autoPlayTimer !== null) {
        window.clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoPlay();
      });
    }

   
    indicators.forEach(function (indicator, index) {
      indicator.addEventListener('click', function () {
        showSlide(index);
        startAutoPlay();
      });
    });

    
    const controlsBar = document.querySelector('.carousel-controls-bar');
    if (controlsBar) {
      controlsBar.addEventListener('mouseenter', stopAutoPlay);
      controlsBar.addEventListener('mouseleave', startAutoPlay);
    }
    let touchStartX = 0;
    carouselSection.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselSection.addEventListener('touchend', function (e) {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoPlay();
      }
    }, { passive: true });

    showSlide(0);
    startAutoPlay();
  }

  /*VALIDACIÓN DEL FORMULARIO*/
  function initContactValidation() {
    const form = document.getElementById('reservation-form');
    if (!form) return;

    const fields = {
      nombre: document.getElementById('nombre'),
      email: document.getElementById('email'),
      telefono: document.getElementById('telefono'),
      fecha: document.getElementById('fecha'),
      hora: document.getElementById('hora'),
      personas: document.getElementById('personas'),
      privacidad: document.getElementById('privacidad')
    };

    const summaryError = document.getElementById('form-summary-error');
    const summarySuccess = document.getElementById('form-summary-success');
    const pendingNote = document.getElementById('form-pending-note');

    const validHours = [
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
      '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
    ];

    function toggleError(inputEl, errorId, message, hasError) {
      const errorEl = document.getElementById(errorId);
      if (!inputEl || !errorEl) return;

      if (hasError) {
        inputEl.classList.add('input-error');
        inputEl.setAttribute('aria-invalid', 'true');
        if (message) errorEl.textContent = message;
        errorEl.hidden = false;
        errorEl.style.display = 'block';
      } else {
        inputEl.classList.remove('input-error');
        inputEl.setAttribute('aria-invalid', 'false');
        errorEl.hidden = true;
        errorEl.style.display = 'none';
      }
    }

  
    function validateNombre() {
      const val = fields.nombre.value.trim();
      const hasError = val.length < 2;
      toggleError(
        fields.nombre,
        'error-nombre',
        'Error: Escribe tu nombre y apellidos.',
        hasError
      );
      return !hasError;
    }

    function validateEmail() {
      const val = fields.email.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const hasError = !emailRegex.test(val);
      toggleError(
        fields.email,
        'error-email',
        'Error: Introduce un email válido, como ana.ejemplo@correo.com.',
        hasError
      );
      return !hasError;
    }

    function validateTelefono() {
      const digits = fields.telefono.value.replace(/\D/g, '');
      const hasError = digits.length < 9;
      toggleError(
        fields.telefono,
        'error-telefono',
        'Error: Introduce un número de teléfono válido.',
        hasError
      );
      return !hasError;
    }

    function validateFecha() {
      const val = fields.fecha.value;
      let hasError = false;

      if (!val) {
        hasError = true;
      } else {
        const parts = val.split('-');
        const selectedDate = new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10)
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          hasError = true;
        }
      }

      toggleError(
        fields.fecha,
        'error-fecha',
        'Error: La fecha ya ha pasado. Elige hoy o una fecha futura.',
        hasError
      );
      return !hasError;
    }

    function validateHora() {
      const val = fields.hora.value;
      const hasError = !validHours.includes(val);
      toggleError(
        fields.hora,
        'error-hora',
        'Error: Elige entre 13:00 y 16:00 o entre 20:00 y 23:00.',
        hasError
      );
      return !hasError;
    }

    function validatePersonas() {
      const val = fields.personas.value;
      const hasError = !val;
      toggleError(
        fields.personas,
        'error-personas',
        'Error: Selecciona el número de personas para la visita.',
        hasError
      );
      return !hasError;
    }

    function validatePrivacidad() {
      const hasError = !fields.privacidad.checked;
      toggleError(
        fields.privacidad,
        'error-privacidad',
        'Error: Debes aceptar la política de privacidad para enviar la solicitud.',
        hasError
      );
      return !hasError;
    }

    fields.nombre?.addEventListener('input', validateNombre);
    fields.email?.addEventListener('input', validateEmail);
    fields.telefono?.addEventListener('input', validateTelefono);
    fields.fecha?.addEventListener('change', validateFecha);
    fields.hora?.addEventListener('change', validateHora);
    fields.personas?.addEventListener('change', validatePersonas);
    fields.privacidad?.addEventListener('change', validatePrivacidad);

  
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const vNombre = validateNombre();
      const vEmail = validateEmail();
      const vTelefono = validateTelefono();
      const vFecha = validateFecha();
      const vHora = validateHora();
      const vPersonas = validatePersonas();
      const vPrivacidad = validatePrivacidad();

      const isFormValid =
        vNombre &&
        vEmail &&
        vTelefono &&
        vFecha &&
        vHora &&
        vPersonas &&
        vPrivacidad;

      if (!isFormValid) {
        if (summaryError) {
          summaryError.textContent = 'Vista de validaciones · Revisa los campos marcados. La solicitud no se envió.';
          summaryError.hidden = false;
          summaryError.style.display = 'block';
        }
        if (summarySuccess) {
          summarySuccess.hidden = true;
          summarySuccess.style.display = 'none';
        }
        if (pendingNote) {
          pendingNote.hidden = false;
          pendingNote.style.display = 'block';
        }

      
        const firstInvalid = form.querySelector('.input-error');
        if (firstInvalid) firstInvalid.focus();
      } else {
        if (summaryError) {
          summaryError.hidden = true;
          summaryError.style.display = 'none';
        }
        if (summarySuccess) {
          summarySuccess.hidden = false;
          summarySuccess.style.display = 'block';
        }
        if (pendingNote) {
          pendingNote.hidden = false;
          pendingNote.style.display = 'block';
        }
        form.reset();
      }
    });
  }
})();