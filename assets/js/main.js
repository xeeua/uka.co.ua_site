document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', () => header.classList.toggle('nav-open'));
  }

  // Highlight active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .footer-nav a').forEach((a) => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Phone input mask — formats to +38 (0XX) XXX XX XX as the user types
  const phoneInput = document.querySelector('#phone');
  if (phoneInput) {
    const formatPhone = (raw) => {
      let digits = raw.replace(/\D/g, '');
      if (digits.startsWith('0')) digits = '38' + digits;
      else if (digits && !digits.startsWith('38')) digits = '38' + digits;
      digits = digits.slice(0, 12);
      if (!digits) return '';
      let out = '+' + digits.slice(0, 2);
      const rest = digits.slice(2);
      if (rest.length) out += ' (' + rest.slice(0, 3);
      if (rest.length >= 3) out += ')';
      if (rest.length > 3) out += ' ' + rest.slice(3, 6);
      if (rest.length > 6) out += ' ' + rest.slice(6, 8);
      if (rest.length > 8) out += ' ' + rest.slice(8, 10);
      return out;
    };
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '+38 (0';
    });
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhone(phoneInput.value);
    });
  }

  // Accordion
  document.querySelectorAll('.accordion-item').forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach((el) => {
        el.classList.remove('open');
        el.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Contact form — no backend, opens a pre-filled mailto to the association's inbox
  const CONTACT_EMAIL = 'uka.org.ua@gmail.com';
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const lines = [
        `ПІБ: ${data.get('fullname') || ''}`,
        `Посада: ${data.get('position') || ''}`,
        `Підприємство: ${data.get('company') || ''}`,
        `Місто: ${data.get('city') || ''}`,
        `Телефон: ${data.get('phone') || ''}`,
        `E-mail: ${data.get('email') || '-'}`,
        '',
        data.get('message') || ''
      ];
      const subject = encodeURIComponent(`Заявка з сайту УКА — ${data.get('fullname') || ''}`);
      const body = encodeURIComponent(lines.join('\n'));
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      form.style.display = 'none';
      document.querySelector('.form-success').classList.add('visible');
    });
  }

  // Brands table
  const brandsBody = document.querySelector('#brands-body');
  if (brandsBody && typeof BRANDS !== 'undefined') {
    const countEl = document.querySelector('.brands-count');
    const searchEl = document.querySelector('#brands-search');

    const render = (list) => {
      brandsBody.innerHTML = list.map(([name, type, comment, source]) => `
        <tr>
          <td>${name}</td>
          <td>${type}</td>
          <td>${comment}</td>
          <td><a href="${source}" target="_blank" rel="noopener">${source}</a></td>
        </tr>
      `).join('');
      countEl.textContent = `Знайдено брендів: ${list.length}`;
    };

    render(BRANDS);

    searchEl.addEventListener('input', () => {
      const q = searchEl.value.trim().toLowerCase();
      const filtered = BRANDS.filter((row) => row.join(' ').toLowerCase().includes(q));
      render(filtered);
    });
  }

  // Footer year
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
