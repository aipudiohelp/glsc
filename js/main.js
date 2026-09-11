/**
 * ==========================================================================
 * شركة قمة الريادة الخليجية - GLSC
 * Script: Main UI Interactions & Mobile Experience
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. التمرير السلس للروابط الداخلية (Smooth Scroll for Anchors)
  const internalNavLinks = document.querySelectorAll('a[href^="#"]');
  
  internalNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70; // ارتفاع الهيدر الثابت
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 2. تغيير مظهر الهيدر عند التمرير (Header Scroll Effect)
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.style.backgroundColor = 'rgba(14, 34, 56, 0.96)';
      header.style.backdropFilter = 'blur(8px)';
      header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
    } else {
      header.style.backgroundColor = 'var(--primary-navy)';
      header.style.backdropFilter = 'none';
      header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    }
  }, { passive: true });

  // 3. إدارة ظهور الشريط السفلي الثابت في الجوال (Sticky Bar Smart Visibility)
  // يتم إخفاء الشريط تلقائياً عند وصول المستخدم لقسم الوظائف والفوتر لعدم التشتيت
  const stickyBar = document.getElementById('stickyBar');
  const jobTrapSection = document.querySelector('.job-trap-section');

  if (stickyBar && jobTrapSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyBar.style.transform = 'translateY(100%)';
          stickyBar.style.transition = 'transform 0.3s ease';
        } else {
          stickyBar.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.2 });

    observer.observe(jobTrapSection);
  }

});
