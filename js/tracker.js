/**
 * ==========================================================================
 * شركة قمة الريادة الخليجية - GLSC
 * Script: Meta Pixel & Google Ads Event Tracking Engine (B2B Conversion API)
 * ==========================================================================
 */

// 1. تعريف دالة التتبع الموحدة على مستوى النافذة
window.trackB2BConversion = function(eventName, customParams = {}) {
  const payload = {
    currency: 'SAR',
    country: 'SA',
    region: 'Eastern Province',
    business_vertical: 'Construction Materials Supply',
    ...customParams
  };

  // إرسال لـ Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, payload);
    console.log(`[Meta Pixel Tracked]: ${eventName}`, payload);
  }

  // إرسال لـ Google Analytics / Ads (gtag)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
    console.log(`[Google Tag Tracked]: ${eventName}`, payload);
  }
};

document.addEventListener('DOMContentLoaded', () => {

  // 2. تتبع النقر على أرقام الهواتف (Phone Call Conversion)
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      window.trackB2BConversion('Contact', {
        contact_type: 'Direct Phone Call',
        button_location: link.classList.contains('btn-sticky-call') ? 'Sticky Mobile Bar' : 'Header/Hero'
      });
    });
  });

  // 3. تتبع النقر على رابط استمارة التوظيف (Job Seeker Click Filter)
  // هذا الحدث يمكنك استخدامه في ميتا لإنشاء (Exclusion Audience) لاستبعادهم تماماً من الإعلانات
  const recruitmentLink = document.querySelector('.btn-recruitment-redirect');
  if (recruitmentLink) {
    recruitmentLink.addEventListener('click', () => {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'JobSeekerRedirect', {
          user_type: 'Job Applicant',
          action: 'Redirected to Google Form'
        });
      }
    });
  }

  // 4. تتبع النقر على بطاقات الكتالوج لمشاهدة تفاصيل المواد
  const catalogQuoteButtons = document.querySelectorAll('.btn-card-quote');
  catalogQuoteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const materialName = btn.getAttribute('data-material') || 'General Material';
      window.trackB2BConversion('ViewContent', {
        content_name: materialName,
        content_category: 'Backfill Materials'
      });
    });
  });

});
