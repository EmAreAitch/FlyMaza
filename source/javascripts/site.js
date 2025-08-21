// FlyMaza - Main JavaScript
// Optimized for performance on low-end mobile devices

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  // initScrollEffects();
  initSmoothScrolling();
  initLazyLoading();
  initStatsCounter();
  initFormHandling();
});

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!mobileMenuBtn || !mobileMenu) return;
  
  let isMenuOpen = false;
  
  mobileMenuBtn.addEventListener('click', function() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      mobileMenu.style.transform = 'translateY(0)';
      mobileMenu.style.opacity = '1';
      document.body.style.overflow = 'hidden'; // Prevent scroll
    } else {
      mobileMenu.style.transform = 'translateY(-100%)';
      mobileMenu.style.opacity = '0';
      document.body.style.overflow = ''; // Restore scroll
    }
  });
  
  // Close menu when clicking links
  mobileMenu.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      isMenuOpen = false;
      mobileMenu.style.transform = 'translateY(-100%)';
      mobileMenu.style.opacity = '0';
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on outside click
  document.addEventListener('click', function(e) {
    if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      isMenuOpen = false;
      mobileMenu.style.transform = 'translateY(-100%)';
      mobileMenu.style.opacity = '0';
      document.body.style.overflow = '';
    }
  });
}

// Header scroll effects
function initScrollEffects() {
  const header = document.querySelector('header');
  if (!header) return;
  
  let ticking = false;
  
  function updateHeader() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      header.classList.add('bg-white/98');
      header.classList.remove('bg-white/95');
    } else {
      header.classList.add('bg-white/95');
      header.classList.remove('bg-white/98');
    }
    
    ticking = false;
  }
  
  function requestHeaderUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Intersection Observer for animations and lazy loading
function initLazyLoading() {
  // Fade in animation observer
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
      fadeObserver.observe(el);
    });
  }
  
  // Slide in animation observer
  const slideElements = document.querySelectorAll('.slide-in-left, .slide-in-right');
  
  if (slideElements.length > 0) {
    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-x-0');
          entry.target.classList.remove('opacity-0');
          
          if (entry.target.classList.contains('slide-in-left')) {
            entry.target.classList.remove('-translate-x-8');
          } else {
            entry.target.classList.remove('translate-x-8');
          }
          
          slideObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });
    
    slideElements.forEach(el => {
      el.classList.add('opacity-0', 'transition-all', 'duration-700', 'ease-out');
      
      if (el.classList.contains('slide-in-left')) {
        el.classList.add('-translate-x-8');
      } else {
        el.classList.add('translate-x-8');
      }
      
      slideObserver.observe(el);
    });
  }
  
  // Card hover effects for destination cards
  const cards = document.querySelectorAll('.destination-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Utility function for debouncing
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Stats counter animation (for stats section)
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  if (stats.length === 0) return;
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        animateNumber(entry.target, 0, target, 2000, suffix);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => statsObserver.observe(stat));
}

function animateNumber(element, start, end, duration, suffix) {
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOutCubic);
    
    element.textContent = current + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

// Form handling utilities
function initFormHandling() {
  const forms = document.querySelectorAll('form[data-netlify]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Re-enable after 5 seconds as fallback
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }, 5000);
      }
    });
  });
}
