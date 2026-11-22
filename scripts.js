const themeSwitch = document.querySelector('.theme-switch');
const themeIcon = document.querySelector('.theme-icon');
const savedTheme = localStorage.getItem('theme');

function setTheme(isDark) {
  document.body.dataset.theme = isDark ? 'dark' : 'light';
  themeSwitch.setAttribute('aria-checked', String(isDark));
  themeIcon.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

setTheme(savedTheme === 'dark');
themeSwitch.addEventListener('click', () => {
  setTheme(document.body.dataset.theme !== 'dark');
});

const copyEmailLinks = document.querySelectorAll('.copy-email');
const copyNotice = document.querySelector('.copy-notice');
let noticeTimeout;

function showCopyNotice() {
  copyNotice.classList.add('visible');
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => {
    copyNotice.classList.remove('visible');
  }, 1800);
}

function copyWithFallback(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand('copy');
  textArea.remove();
  return copied;
}

copyEmailLinks.forEach((link) => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = link.dataset.email;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else if (!copyWithFallback(email)) {
        return;
      }
      showCopyNotice();
    } catch {
      if (copyWithFallback(email)) {
        showCopyNotice();
      }
    }
  });
});

const courseTabs = document.querySelectorAll('.course-tab');
const coursePanels = document.querySelectorAll('.course-panel');
const courseSelector = document.querySelector('.course-selector');
const homeControl = document.querySelector('[data-home-control]');
const navLinks = document.querySelector('.nav-links');

function showCourse(courseName, updateHash = true) {
  document.body.classList.add('course-selected');
  courseSelector.classList.remove('course-choice', 'entering');
  navLinks.removeAttribute('aria-hidden');

  courseTabs.forEach((tab) => {
    const isActive = tab.dataset.course === courseName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  coursePanels.forEach((panel) => {
    const isActive = panel.dataset.panel === courseName;
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
    panel.classList.remove('entering');

    if (isActive) {
      void panel.offsetWidth;
      panel.classList.add('entering');
      panel.addEventListener('animationend', () => {
        panel.classList.remove('entering');
      }, { once: true });
    }
  });

  navLinks.querySelectorAll('[data-nav]').forEach((link) => {
    const navName = link.dataset.nav;
    const beginnerTargets = {
      beneficios: '#panel-desde-cero',
      'sobre-mi': '#panel-desde-cero',
      temario: '#beginner-temario',
      contacto: '#beginner-contacto'
    };
    const accountantTargets = {
      beneficios: '#beneficios',
      'sobre-mi': '#sobre-mi',
      temario: '#temario',
      contacto: '#contacto'
    };
    link.setAttribute(
      'href',
      courseName === 'desde-cero' ? beginnerTargets[navName] : accountantTargets[navName]
    );
  });

  document.title = courseName === 'desde-cero'
    ? 'Inversiones desde 0 | Paola Lorca'
    : 'Curso de Inversiones para Contadores | Paola Lorca';

  if (updateHash) {
    history.replaceState(null, '', courseName === 'desde-cero' ? '#desde-cero' : '#contadores');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCourseChoice(updateUrl = true) {
  document.body.classList.remove('course-selected');
  courseSelector.classList.add('course-choice');
  courseSelector.classList.remove('entering');
  navLinks.setAttribute('aria-hidden', 'true');

  courseTabs.forEach((tab) => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  coursePanels.forEach((panel) => {
    panel.hidden = true;
    panel.classList.remove('active', 'entering');
  });

  if (updateUrl) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }

  document.title = 'Elegí tu curso | Paola Lorca';
  void courseSelector.offsetWidth;
  courseSelector.classList.add('entering');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

courseTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    showCourse(tab.dataset.course);
  });
});

homeControl.addEventListener('click', (event) => {
  event.preventDefault();
  showCourseChoice();
});

const courseByHash = {
  '#desde-cero': 'desde-cero',
  '#panel-desde-cero': 'desde-cero',
  '#beginner-temario': 'desde-cero',
  '#beginner-contacto': 'desde-cero',
  '#contadores': 'contadores',
  '#beneficios': 'contadores',
  '#sobre-mi': 'contadores',
  '#temario': 'contadores',
  '#contacto': 'contadores'
};
const initialCourse = courseByHash[window.location.hash];

if (initialCourse) {
  showCourse(initialCourse, false);
} else {
  showCourseChoice(false);
}