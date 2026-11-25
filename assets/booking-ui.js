'use strict';
const menu = document.querySelector('#mobileMenu');
if (menu) {
  const toggle = document.querySelector('.menu-toggle');
  const close = menu.querySelector('.close-menu');
  const overlay = document.querySelector('#mobileOverlay');
  function showMenu(open) {
    menu.inert = !open;
    menu.classList.toggle('active', open);
    overlay.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) close.focus(); else toggle.focus();
  }
  document.documentElement.classList.add('rc-menu-ready');
  toggle.addEventListener('click', () => showMenu(true));
  close.addEventListener('click', () => showMenu(false));
  overlay.addEventListener('click', () => showMenu(false));
  menu.addEventListener('click', event => {
    if (event.target.closest('a[href^="#"]')) showMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (menu.inert) return;
    if (event.key === 'Escape') showMenu(false);
    if (event.key !== 'Tab') return;
    const last = [...menu.querySelectorAll('a[href]')].pop();
    if (event.shiftKey && document.activeElement === close) {event.preventDefault(); last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); close.focus();}
  });
  window.addEventListener('resize', () => {if (!menu.inert && !toggle.getClientRects().length) showMenu(false);});
}
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
dots.forEach((button, index) => button.addEventListener('click', () => {
  slides.forEach((slide,i) => slide.classList.toggle('active', i === index));
  dots.forEach((dot,i) => {dot.classList.toggle('active',i === index);dot.setAttribute('aria-pressed',String(i === index));});
}));
const cities = {jeddah:'جدة',riyadh:'الرياض',makkah:'مكة المكرمة',madinah:'المدينة المنورة',dammam:'الدمام',taif:'الطائف',turaba:'تربة'};
const params = new URLSearchParams(location.search);
const city = params.get('city');
if (location.pathname.endsWith('/packages.html') && Object.hasOwn(cities,city)) {
  const label = cities[city];
  const context = document.querySelector('[data-city-context]');
  context.hidden = false;
  context.querySelector('strong').textContent = 'طلب باقة في '+label+' · يُؤكد التوفر عند الحجز';
  context.querySelector('a').href = city+'.html';
  if (city !== 'jeddah') document.querySelectorAll('[data-jeddah-info]').forEach(el => {el.hidden=true;});
  const category = params.get('category');
  const tab = [...document.querySelectorAll('[data-package-filter]')].find(el=>el.dataset.packageFilter === category);
  if (tab) tab.click();
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.href);
    if (url.hostname === 'wa.me') {
      const message = (url.searchParams.get('text') || '').split('\nالمدينة:')[0] || 'السلام عليكم، أرغب في الاستفسار عن باقات الضيافة.';
      url.searchParams.set('text',message+'\nمدينة المناسبة: '+label+'\nالتاريخ: \nعدد الضيوف: ');
      link.href=url.href;
    } else if(url.origin===location.origin) {
      const page=url.pathname.split('/').pop();
      const filters={'men.html':'men','women.html':'women','popular-food.html':'food'};
      if(Object.hasOwn(filters,page)) link.href='packages.html?city='+city+'&category='+filters[page]+'#packages';
      else if(['menu.html','equipment.html','zamzam.html'].includes(page) && city!=='jeddah') link.href=city+'.html#service-'+page.split('.')[0];
      else if(page==='packages.html' && !url.search) link.href='packages.html?city='+city+'#packages';
    }
  }
}

if (document.body.classList.contains('rc-service-page') && city === 'jeddah') {
  const catalogPages = ['men.html','women.html','equipment.html','menu.html','zamzam.html','popular-food.html','packages.html'];
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.href);
    if (url.hostname === 'wa.me') {
      const message = url.searchParams.get('text') || 'السلام عليكم، أستفسر عن الخدمة.';
      if (!message.includes('جدة')) {
        url.searchParams.set('text',message.includes('المدينة:') ? message.replace('المدينة:', 'المدينة: جدة') : message+'\nالمدينة: جدة');
        link.href=url.href;
      }
    } else if (url.origin===location.origin && catalogPages.includes(url.pathname.split('/').pop())) {
      url.searchParams.set('city','jeddah');link.href=url.href;
    }
  }
}
