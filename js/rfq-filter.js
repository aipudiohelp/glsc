/**
 * ==========================================================================
 * شركة قمة الريادة الخليجية - GLSC
 * Script: RFQ Filter & WhatsApp Lead Generator (B2B Conversion Engine)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. الإعدادات العامة (قم بتعديل رقم الواتساب المخصص للمبيعات هنا)
  const RFQ_CONFIG = {
    // رقم الواتساب الرسمي بصيغة دولية بدون علامة + (مثال: 9665xxxxxxxx)
    salesWhatsAppNumber: "966541544639",
    companyName: "شركة قمة الريادة الخليجية",
    salesOfficeCity: "المنطقة الشرقية"
  };

  // 2. تحديد عناصر واجهة المستخدم
  const rfqForm = document.getElementById('rfqForm');
  const materialSelect = document.getElementById('materialType');
  const volumeSelect = document.getElementById('orderVolume');
  const locationInput = document.getElementById('projectLocation');
  const companyInput = document.getElementById('companyName');
  const rfqFunnelSection = document.getElementById('rfq-funnel');
  const stickyWhatsAppBtn = document.getElementById('stickyWhatsAppBtn');
  const cardQuoteButtons = document.querySelectorAll('.btn-card-quote');

  // ==========================================================================
  // 3. ربط أزرار بطاقات الكتالوج بالنموذج التفاعلي (Direct Catalog Linkage)
  // ==========================================================================
  // عند ضغط المقاول على زر "طلب تسعير هذه المادة" في الكتالوج:
  // يتم نقله تلقائياً للنموذج وتحديد المادة المطلوبة مسبقاً
  if (cardQuoteButtons.length > 0) {
    cardQuoteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedMaterial = btn.getAttribute('data-material');

        if (materialSelect && selectedMaterial) {
          // محاولة اختيار القيمة المتطابقة في القائمة المنسدلة
          let optionFound = false;
          for (let i = 0; i < materialSelect.options.length; i++) {
            if (materialSelect.options[i].value.includes(selectedMaterial) || selectedMaterial.includes(materialSelect.options[i].value)) {
              materialSelect.selectedIndex = i;
              optionFound = true;
              break;
            }
          }

          // إذا لم يجد تطابقاً حرفياً، يضع القيمة مباشرة
          if (!optionFound) {
            materialSelect.value = selectedMaterial;
          }
        }

        // تمرير سلس ومريح إلى نموذج التسعير
        if (rfqFunnelSection) {
          rfqFunnelSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // تركيز وتنبيه بصري على حقل اختيار المادة
          setTimeout(() => {
            if (materialSelect) {
              materialSelect.focus();
              materialSelect.style.borderColor = 'var(--accent-gold)';
              setTimeout(() => {
                materialSelect.style.borderColor = '';
              }, 1500);
            }
          }, 600);
        }
      });
    });
  }

  // ==========================================================================
  // 4. معالجة وتوليد رسالة التسعير الرسمية عند إرسال النموذج (Form Submit)
  // ==========================================================================
  if (rfqForm) {
    rfqForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // استخراج وتنظيف المدخلات
      const material = materialSelect ? materialSelect.value.trim() : '';
      const volume = volumeSelect ? volumeSelect.value.trim() : '';
      const location = locationInput ? locationInput.value.trim() : '';
      const company = companyInput && companyInput.value.trim() !== '' 
        ? companyInput.value.trim() 
        : 'مشروع مقاولات / عميل B2B';

      // التحقق من الحقول الأساسية
      if (!material || !volume || !location) {
        alert('فضلاً اختر نوع المادة، حجم التوريد التقديري، وموقع المشروع لمتابعة التسعير.');
        return;
      }

      // بناء قالب رسالة الواتساب المهنية (Saudi B2B Format)
      // الرسالة مصممة لتفرض نمط محادثة تجارية وتلغي أي طابع للدردشة العشوائية أو التوظيف
      const messageBody = 
`السلام عليكم ورحمة الله وبركاته
إدارة المبيعات - ${RFQ_CONFIG.companyName}

طلب تسعير رسمي لتوريد مواد دفان (${RFQ_CONFIG.salesOfficeCity}):
━━━━━━━━━━━━━━━━━━━━━
• نوع المادة: ${material}
• حجم الطلب التقديري: ${volume}
• موقع المشروع: ${location}
• اسم الجهة / المقاول: ${company}
━━━━━━━━━━━━━━━━━━━━━
نأمل تزويدنا بسعر الرد شامل التوصيل للموقع المذكور وجدول التوريد المتاح لديكم.`;

      // تشفير النص ليكون متوافقاً مع روابط الويب
      const encodedMessage = encodeURIComponent(messageBody);
      const whatsappUrl = `https://wa.me/${RFQ_CONFIG.salesWhatsAppNumber}?text=${encodedMessage}`;

      // إطلاق حدث التتبع للمنصات الإعلانية (Meta Pixel / Google Ads)
      triggerLeadTracking({
        leadType: 'RFQ_Form_Submission',
        material: material,
        volume: volume,
        location: location
      });

      // توجيه العميل فوراً إلى تطبيق واتساب
      window.open(whatsappUrl, '_blank');
    });
  }

  // ==========================================================================
  // 5. إدارة زر الواتساب في الشريط السفلي الثابت (Sticky Mobile WhatsApp)
  // ==========================================================================
  if (stickyWhatsAppBtn) {
    stickyWhatsAppBtn.addEventListener('click', () => {
      // فحص ما إذا كان العميل قد أدخل بيانات في النموذج بالفعل
      const hasEnteredData = locationInput && locationInput.value.trim() !== '';

      if (!hasEnteredData && rfqFunnelSection) {
        // توجيهه للنموذج أولاً لفلترة طلبه قبل فتح الواتساب
        rfqFunnelSection.scrollIntoView({ behavior: 'smooth' });
        if (locationInput) {
          setTimeout(() => locationInput.focus(), 600);
        }
      } else if (rfqForm) {
        // إذا كانت البيانات مكتملة، يتم إرسال النموذج تلقائياً
        rfqForm.requestSubmit();
      } else {
        // توجيه مباشر برسالة افتتاحية محددة لقطاع المقاولات فقط
        const defaultMessage = encodeURIComponent(
`السلام عليكم، مطلوب تسعير توريد مواد دفان لمشروع بالمنطقة الشرقية.
يرجى توضيح أسعار التريلات ومواعيد التوريد المتاحة.`
        );
        window.open(`https://wa.me/${RFQ_CONFIG.salesWhatsAppNumber}?text=${defaultMessage}`, '_blank');
      }
    });
  }

  // ==========================================================================
  // 6. دالة استدعاء التتبع الآمن (Tracking Dispatcher)
  // ==========================================================================
  function triggerLeadTracking(data) {
    // التحقق من وجود دالة التتبع المعرفة في ملف tracker.js
    if (typeof window.trackB2BConversion === 'function') {
      window.trackB2BConversion('Lead', data);
    } else {
      // إرسال مباشر إلى Meta Pixel في حال كان مفعّلاً ومحقوناً
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: data.material,
          content_category: 'Backfill Supply',
          value: 1.00,
          currency: 'SAR'
        });
      }
      // إرسال إلى Google Analytics / Ads إذا كان مفعّلاً
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'B2B RFQ',
          event_label: data.material
        });
      }
    }
  }

});
