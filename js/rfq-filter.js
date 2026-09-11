/**
 * ==========================================================================
 * شركة قمة الريادة الخليجية - GLSC
 * Script: RFQ Filter & Instant Material Auto-Selector
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  const RFQ_CONFIG = {
    salesWhatsAppNumber: "966541544639", // ضع رقم المبيعات الفعلي هنا
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
  // الاختيار التلقائي الصارم للمادة والانتقال لحقل الكمية مباشرة
  // ==========================================================================
  if (cardQuoteButtons.length > 0 && materialSelect) {
    cardQuoteButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const selectedMaterial = this.getAttribute('data-material');
        if (!selectedMaterial) return;

        // 1. تثبيت اختيار المادة في القائمة المنسدلة بدقة
        let isSelected = false;
        for (let i = 0; i < materialSelect.options.length; i++) {
          if (materialSelect.options[i].value.trim() === selectedMaterial.trim()) {
            materialSelect.selectedIndex = i;
            isSelected = true;
            break;
          }
        }

        if (!isSelected) {
          materialSelect.value = selectedMaterial;
        }

        // إشعار المتصفح بحدوث تغيير فعلي في القائمة
        materialSelect.dispatchEvent(new Event('change', { bubbles: true }));

        // 2. تمييز الحقل بلون أخضر تأكيدي للعميل أن المادة تم تحديدها
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

          // 4. نقل التركيز تلقائياً للخانة التالية (حجم التوريد) بعد انتهاء التمرير
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

      const material = materialSelect ? materialSelect.value.trim() : '';
      const volume = volumeSelect ? volumeSelect.value.trim() : '';
      const location = locationInput ? locationInput.value.trim() : '';
      const company = (companyInput && companyInput.value.trim() !== '') 
        ? companyInput.value.trim() 
        : 'مشروع مقاولات / عميل B2B';

      if (!material) {
        alert('فضلاً اختر نوع مادة الدفان المطلوبة.');
        materialSelect.focus();
        return;
      }
      if (!volume) {
        alert('فضلاً اختر حجم التوريد التقديري (بالردود).');
        volumeSelect.focus();
        return;
      }
      if (!location) {
        alert('فضلاً حدد موقع المشروع في المنطقة الشرقية.');
        locationInput.focus();
        return;
      }

      const messageText = 
`السلام عليكم ورحمة الله وبركاته
إدارة المبيعات - ${RFQ_CONFIG.companyName}

طلب تسعير رسمي لتوريد مواد دفان (${RFQ_CONFIG.salesOfficeCity}):
━━━━━━━━━━━━━━━━━━━━━
• نوع المادة: ${material}
• حجم الطلب التقديري: ${volume}
• موقع المشروع: ${location}
• اسم الجهة / المقاول: ${company}
━━━━━━━━━━━━━━━━━━━━━
نأمل تزويدنا بسعر الرد شامل التوصيل لموقع العمل وجدول التوريد المتاح.`;

      const whatsappUrl = `https://wa.me/${RFQ_CONFIG.salesWhatsAppNumber}?text=${encodeURIComponent(messageText)}`;

      if (typeof window.trackB2BConversion === 'function') {
        window.trackB2BConversion('Lead', { material, volume, location });
      }

      window.open(whatsappUrl, '_blank');
    });
  }

  // ==========================================================================
  // زر الواتساب في الشريط السفلي للجوال
  // ==========================================================================
  if (stickyWhatsAppBtn) {
    stickyWhatsAppBtn.addEventListener('click', () => {
      const isMaterialChosen = materialSelect && materialSelect.value !== '';
      const isLocationEntered = locationInput && locationInput.value.trim() !== '';

      if ((!isMaterialChosen || !isLocationEntered) && rfqFunnelSection) {
        rfqFunnelSection.scrollIntoView({ behavior: 'smooth' });
        if (!isMaterialChosen) {
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
