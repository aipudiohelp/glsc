/**
 * ==========================================================================
 * شركة قمة الريادة الخليجية - GLSC
 * Script: Unified RFQ Filter & WhatsApp Dispatcher
 * (يدعم صفحة التوريدات materials.html وصفحة التشطيبات finishing.html)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  const RFQ_CONFIG = {
    salesWhatsAppNumber: "966541544639",
    companyName: "شركة قمة الريادة الخليجية",
    salesOfficeCity: "المنطقة الشرقية"
  };

  // ==========================================================================
  // 1. معالجة نموذج توريد مواد الدفان (materials.html)
  // ==========================================================================
  const rfqForm = document.getElementById('rfqForm');
  const materialSelect = document.getElementById('materialType');
  const volumeSelect = document.getElementById('orderVolume');
  const locationInput = document.getElementById('projectLocation');
  const companyInput = document.getElementById('companyName');
  const rfqFunnelSection = document.getElementById('rfq-funnel');
  const stickyWhatsAppBtn = document.getElementById('stickyWhatsAppBtn');
  const cardQuoteButtons = document.querySelectorAll('.btn-card-quote[data-material]');

  // الاختيار التلقائي لمادة الدفان عند الضغط على كرت المادة
  if (cardQuoteButtons.length > 0 && materialSelect) {
    cardQuoteButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const selectedMaterial = this.getAttribute('data-material');
        if (!selectedMaterial) return;

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

        materialSelect.dispatchEvent(new Event('change', { bubbles: true }));
        materialSelect.style.border = '2px solid #27ae60';
        materialSelect.style.backgroundColor = '#f0fdf4';

        if (rfqFunnelSection) {
          const headerOffset = 80;
          const elementPosition = rfqFunnelSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

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

  // إرسال طلب تسعير الدفان للواتساب
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
إدارة المبيعات والتوريد - ${RFQ_CONFIG.companyName}

طلب تسعير رسمي لتوريد مواد دفان (${RFQ_CONFIG.salesOfficeCity}):
━━━━━━━━━━━━━━━━━━━━━
• نوع المادة: ${material}
• حجم الطلب التقديري: ${volume}
• موقع المشروع: ${location}
• اسم الجهة / المقاول: ${company}
━━━━━━━━━━━━━━━━━━━━━
نأمل تزويدنا بسعر الرد شامل التوصيل لموقع العمل وجدول التوريد المتاح.`;

      const whatsappUrl = `https://wa.me/${RFQ_CONFIG.salesWhatsAppNumber}?text=${encodeURIComponent(messageText)}`;

      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: material,
          content_category: volume,
          status: 'Direct_WhatsApp_Materials_RFQ'
        });
      }

      if (typeof window.trackB2BConversion === 'function') {
        window.trackB2BConversion('Lead', { material, volume, location });
      }

      window.open(whatsappUrl, '_blank');
    });
  }

  // زر الواتساب الثابت للجوال في صفحة التوريدات
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

  // ==========================================================================
  // 2. معالجة نموذج مقاولات التشطيبات والمخططات (finishing.html)
  // ==========================================================================
  const finishingForm = document.getElementById('finishingRfqForm');
  const serviceSelect = document.getElementById('finishingService');
  const areaSelect = document.getElementById('projectArea');
  const finishLocationInput = finishingForm ? finishingForm.querySelector('#projectLocation') : null;
  const finishCompanyInput = finishingForm ? finishingForm.querySelector('#companyName') : null;
  const fileInput = document.getElementById('projectDocument');
  const fileStatus = document.getElementById('fileStatus');
  const fileLabelText = document.getElementById('fileLabelText');
  const finishQuoteButtons = document.querySelectorAll('.btn-card-quote[data-service]');
  const stickyFinishingBtn = document.getElementById('stickyFinishingWhatsAppBtn');

  // الاختيار التلقائي لخدمة التشطيب عند الضغط على الكرت
  if (finishQuoteButtons.length > 0 && serviceSelect) {
    finishQuoteButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const selectedService = this.getAttribute('data-service');
        if (!selectedService) return;

        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.trim() === selectedService.trim()) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }

        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        serviceSelect.style.border = '2px solid #27ae60';
        serviceSelect.style.backgroundColor = '#f0fdf4';

        if (rfqFunnelSection) {
          rfqFunnelSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            if (areaSelect) areaSelect.focus();
          }, 600);
        }
      });
    });
  }

  // التفاعل البصري عند اختيار ملف المخطط (PDF)
  if (fileInput && fileStatus && fileLabelText) {
    fileInput.addEventListener('change', function() {
      if (this.files && this.files.length > 0) {
        fileStatus.style.display = 'inline-block';
        fileLabelText.innerHTML = `📄 <strong>تم تجهيز الملف:</strong> ${this.files[0].name}`;
      } else {
        fileStatus.style.display = 'none';
      }
    });
  }

  // إرسال طلب تسعير مقاولة التشطيب للواتساب
  if (finishingForm) {
    finishingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = serviceSelect ? serviceSelect.value.trim() : '';
      const area = areaSelect ? areaSelect.value.trim() : '';
      const location = finishLocationInput ? finishLocationInput.value.trim() : '';
      const company = (finishCompanyInput && finishCompanyInput.value.trim() !== '') 
        ? finishCompanyInput.value.trim() 
        : 'مشروع مقاولات / عميل B2B';

      let fileNotice = "لا يوجد ملف مرفق (طلب تسعير مباشر)";
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        fileNotice = `📎 مرفق مخطط/جدول كميات: [اسم الملف: ${fileInput.files[0].name}] - سأقوم بإرساله في المحادثة الآن.`;
      }

      if (!service) {
        alert('فضلاً اختر نوع العمل المطلوب.');
        serviceSelect.focus();
        return;
      }
      if (!area) {
        alert('فضلاً اختر المساحة التقديرية للعمل.');
        areaSelect.focus();
        return;
      }
      if (!location) {
        alert('فضلاً حدد موقع المشروع بالمنطقة الشرقية.');
        finishLocationInput.focus();
        return;
      }

      const messageText = 
`السلام عليكم ورحمة الله وبركاته
إدارة المشاريع والمقاولات - ${RFQ_CONFIG.companyName}

طلب دراسة كميات وتسعير مقاولة تشطيب (${RFQ_CONFIG.salesOfficeCity}):
━━━━━━━━━━━━━━━━━━━━━
• نوع العمل: ${service}
• المساحة التقديرية: ${area}
• موقع المشروع: ${location}
• اسم الجهة / المشرف: ${company}
• المخططات وجداول الكميات: ${fileNotice}
━━━━━━━━━━━━━━━━━━━━━
نأمل تزويدنا بالعرض الفني والمالي والجدول الزمني المتاح للتنفيذ.`;

      const whatsappUrl = `https://wa.me/${RFQ_CONFIG.salesWhatsAppNumber}?text=${encodeURIComponent(messageText)}`;

      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: service,
          content_category: area,
          status: 'Direct_WhatsApp_Finishing_RFQ'
        });
      }

      window.open(whatsappUrl, '_blank');
    });
  }

  // زر الواتساب الثابت للجوال في صفحة التشطيبات
  if (stickyFinishingBtn && finishingForm) {
    stickyFinishingBtn.addEventListener('click', () => {
      const isServiceChosen = serviceSelect && serviceSelect.value !== '';
      const isLocationEntered = finishLocationInput && finishLocationInput.value.trim() !== '';

      if ((!isServiceChosen || !isLocationEntered) && rfqFunnelSection) {
        rfqFunnelSection.scrollIntoView({ behavior: 'smooth' });
        if (!isServiceChosen) {
          serviceSelect.focus();
        } else {
          finishLocationInput.focus();
        }
      } else {
        finishingForm.requestSubmit();
      }
    });
  }

});
