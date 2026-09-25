/**
 * ==========================================================================
 * شركة قمة الريادة الخليجية - GLSC
 * Script: RFQ Filter & Instant Material/Service Auto-Selector
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  const RFQ_CONFIG = {
    salesWhatsAppNumber: "966541544639",
    companyName: "شركة قمة الريادة الخليجية",
    salesOfficeCity: "المنطقة الشرقية"
  };

  const rfqForm = document.getElementById('rfqForm');
  const materialSelect = document.getElementById('materialType');
  const volumeSelect = document.getElementById('orderVolume');
  const locationInput = document.getElementById('projectLocation');
  const companyInput = document.getElementById('companyName');
  const rfqFunnelSection = document.getElementById('rfq-funnel');
  const stickyWhatsAppBtn = document.getElementById('stickyWhatsAppBtn');
  const cardQuoteButtons = document.querySelectorAll('.btn-card-quote');

  // ==========================================================================
  // الاختيار التلقائي الصارم للمادة/الخدمة والانتقال لحقل الكمية/المساحة مباشرة
  // ==========================================================================
  if (cardQuoteButtons.length > 0 && materialSelect) {
    cardQuoteButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const selectedItem = this.getAttribute('data-material');
        if (!selectedItem) return;

        // 1. تثبيت اختيار الخدمة أو المادة في القائمة المنسدلة بدقة
        let isSelected = false;
        for (let i = 0; i < materialSelect.options.length; i++) {
          if (materialSelect.options[i].value.trim() === selectedItem.trim()) {
            materialSelect.selectedIndex = i;
            isSelected = true;
            break;
          }
        }

        if (!isSelected) {
          materialSelect.value = selectedItem;
        }

        // إشعار المتصفح بحدوث تغيير فعلي في القائمة
        materialSelect.dispatchEvent(new Event('change', { bubbles: true }));

        // 2. تمييز الحقل بلون أخضر تأكيدي
        materialSelect.style.border = '2px solid #27ae60';
        materialSelect.style.backgroundColor = '#f0fdf4';

        // 3. التمرير السلس إلى نموذج التسعير
        if (rfqFunnelSection) {
          const headerOffset = 80;
          const elementPosition = rfqFunnelSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // 4. نقل التركيز تلقائياً للخانة التالية (حجم التوريد أو المساحة)
          setTimeout(() => {
            if (volumeSelect) {
              volumeSelect.focus();
              volumeSelect.style.border = '2px solid var(--accent-gold)';
              setTimeout(() => {
                volumeSelect.style.border = '';
              }, 2000);
            }
          }, 600);
        }
      });
    });
  }

  // ==========================================================================
  // معالجة وإرسال رسالة الواتساب الرسمية
  // ==========================================================================
  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const itemChosen = materialSelect ? materialSelect.value.trim() : '';
      const volumeOrArea = volumeSelect ? volumeSelect.value.trim() : '';
      const location = locationInput ? locationInput.value.trim() : '';
      const company = (companyInput && companyInput.value.trim() !== '') 
        ? companyInput.value.trim() 
        : 'مشروع مقاولات / عميل B2B';

      if (!itemChosen) {
        alert('فضلاً اختر نوع الخدمة أو مادة الدفان المطلوبة.');
        materialSelect.focus();
        return;
      }
      if (!volumeOrArea) {
        alert('فضلاً اختر حجم التوريد أو المساحة التقديرية لمشروعك.');
        volumeSelect.focus();
        return;
      }
      if (!location) {
        alert('فضلاً حدد موقع المشروع في المنطقة الشرقية.');
        locationInput.focus();
        return;
      }

      // تجهيز نص رسالة الواتساب الرسمية الشاملة للدفان والتشطيب
      const messageText = 
`السلام عليكم ورحمة الله وبركاته
إدارة المشاريع والمبيعات - ${RFQ_CONFIG.companyName}

طلب تسعير رسمي (${RFQ_CONFIG.salesOfficeCity}):
━━━━━━━━━━━━━━━━━━━━━
• الخدمة / المادة: ${itemChosen}
• الحجم / المساحة: ${volumeOrArea}
• موقع المشروع: ${location}
• اسم الجهة / المقاول: ${company}
━━━━━━━━━━━━━━━━━━━━━
نأمل تزويدنا بعرض السعر وجدول التوريد/التنفيذ المتاح.`;

      const whatsappUrl = `https://wa.me/${RFQ_CONFIG.salesWhatsAppNumber}?text=${encodeURIComponent(messageText)}`;

      // تتبع الحدث في Meta Pixel
      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: itemChosen,
          content_category: volumeOrArea,
          status: 'Direct_WhatsApp_RFQ'
        });
      }

      // تتبع الحدث المخصص إن وجد
      if (typeof window.trackB2BConversion === 'function') {
        window.trackB2BConversion('Lead', { itemChosen, volumeOrArea, location });
      }

      window.open(whatsappUrl, '_blank');
    });
  }

  // ==========================================================================
  // زر الواتساب في الشريط السفلي للجوال
  // ==========================================================================
  if (stickyWhatsAppBtn) {
    stickyWhatsAppBtn.addEventListener('click', () => {
      const isItemChosen = materialSelect && materialSelect.value !== '';
      const isLocationEntered = locationInput && locationInput.value.trim() !== '';

      if ((!isItemChosen || !isLocationEntered) && rfqFunnelSection) {
        rfqFunnelSection.scrollIntoView({ behavior: 'smooth' });
        if (!isItemChosen) {
          materialSelect.focus();
        } else {
          locationInput.focus();
        }
      } else if (rfqForm) {
        rfqForm.requestSubmit();
      }
    });
  }

});
