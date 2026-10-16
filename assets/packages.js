'use strict';
(() => {
  document.querySelectorAll('[data-package-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const scope = button.closest('[data-packages]');
      if (!scope) return;
      const selected = button.dataset.packageFilter;
      scope.querySelectorAll('[data-package-filter]').forEach(tab => {
        tab.setAttribute('aria-pressed', String(tab === button));
      });
      let visible = 0;
      scope.querySelectorAll('[data-category]').forEach(card => {
        card.hidden = selected !== 'all' && card.dataset.category !== selected;
        if (!card.hidden) visible += 1;
      });
      const status = scope.querySelector('[data-package-status]');
      if (status) status.textContent = `عدد الباقات المعروضة: ${visible}`;
    });
  });
  const form = document.querySelector('[data-booking-form]');
  if (form) {
    const date = form.querySelector('[name=date]');
    const now = new Date();
    const localToday = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    if (date) date.min = localToday;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const message = ['السلام عليكم، أرغب في الاستفسار عن حجز لدى القهوة الملكية.',
        `المدينة: ${values.get('city')}`, `الخدمة: ${values.get('service')}`,
        values.get('guests') ? `عدد الضيوف التقريبي: ${values.get('guests')}` : '',
        values.get('date') ? `تاريخ المناسبة: ${values.get('date')}` : '',
        values.get('venue') ? `الحي أو القاعة: ${values.get('venue')}` : '',
        values.get('notes') ? `تفاصيل إضافية: ${values.get('notes')}` : '',
        'أرجو تأكيد التوفر وتفاصيل الخدمة والسعر النهائي.'].filter(Boolean).join('\n');
      const link = document.createElement('a');
      link.href = 'https://wa.me/966536895975?text=' + encodeURIComponent(message);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.append(link);
      link.click();
      link.remove();
      const status = form.querySelector('[role=status]');
      if (status) status.textContent = 'جهّزنا تفاصيل طلبك في واتساب. يُؤكد الحجز بعد الاتفاق مع فريقنا.';
    });
  }
})();
