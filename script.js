// ==================== КОНФИГУРАЦИЯ ====================
// Установите дату и время юбилея (год, месяц (0-11), день, часы, минуты)
const EVENT_DATE = new Date(2026, 6, 11, 17, 0, 0); // 15 августа 2026, 18:00

// ==================== DOM-ЭЛЕМЕНТЫ ====================
const coverOverlay = document.getElementById('coverOverlay');
const openButton = document.getElementById('openButton');
const invitationWrapper = document.getElementById('invitationWrapper');
const coverParticles = document.getElementById('coverParticles');

// Элементы обратного отсчёта
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');

// ==================== ГЕНЕРАЦИЯ ЧАСТИЦ НА ОБЛОЖКЕ ====================
function createParticles() {
  if (!coverParticles) return;
  const particleCount = 35;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.classList.add('cover-particle');

    // Случайное расположение
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;

    // Случайный размер
    const size = 2 + Math.random() * 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Случайная задержка анимации
    const delay = Math.random() * 6;
    particle.style.animationDelay = `${delay}s`;

    // Случайная длительность
    const duration = 4 + Math.random() * 8;
    particle.style.animationDuration = `${duration}s`;

    // Случайный цвет (золотой или оливковый)
    const colors = [
      'rgba(212, 196, 138, 0.8)',
      'rgba(197, 165, 90, 0.7)',
      'rgba(184, 196, 138, 0.7)',
      'rgba(232, 220, 184, 0.6)',
      'rgba(255, 254, 249, 0.5)',
    ];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    coverParticles.appendChild(particle);
  }
}

// ==================== ОТКРЫТИЕ ПРИГЛАШЕНИЯ ====================
function openInvitation() {
  // Добавляем класс для анимации закрытия обложки
  coverOverlay.classList.add('opened');

  // Небольшая задержка перед показом основного контента
  setTimeout(() => {
    invitationWrapper.classList.add('visible');
    // Прокручиваем к началу приглашения
    invitationWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });


    showMusicButton();
    playMusic();

  }, 400);



  // Запускаем обратный отсчёт после открытия
  if (!countdownInterval) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  // Блокируем скролл body пока обложка анимируется
  document.body.style.overflow = '';
}

// ==================== ОБРАТНЫЙ ОТСЧЁТ ====================
let countdownInterval = null;

function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;

  if (diff <= 0) {
    // Событие уже наступило
    if (daysElement) daysElement.textContent = '00';
    if (hoursElement) hoursElement.textContent = '00';
    if (minutesElement) minutesElement.textContent = '00';
    if (secondsElement) secondsElement.textContent = '00';
    // Останавливаем интервал
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Форматируем с ведущим нулём
  const format = (num) => String(num).padStart(2, '0');

  if (daysElement) daysElement.textContent = format(days);
  if (hoursElement) hoursElement.textContent = format(hours);
  if (minutesElement) minutesElement.textContent = format(minutes);
  if (secondsElement) secondsElement.textContent = format(seconds);

  // Добавляем эффект "переворота" при смене секунд
  if (secondsElement) {
    secondsElement.style.animation = 'none';
    void secondsElement.offsetWidth; // форсируем reflow
    secondsElement.style.animation = 'flipIn 0.4s ease-out';
  }
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================
openButton.addEventListener('click', (e) => {
  // Эффект нажатия
  openButton.style.transform = 'scale(0.9)';
  setTimeout(() => {
    openButton.style.transform = '';
  }, 150);

  openInvitation();
});

// Поддержка клавиши Enter на кнопке
openButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openInvitation();
  }
});

// Закрытие обложки по нажатию Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !coverOverlay.classList.contains('opened')) {
    openInvitation();
  }
});

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
function init() {
  // Создаём частицы
  createParticles();

  // Блокируем скролл body пока обложка активна
  document.body.style.overflow = 'hidden';

  // После закрытия обложки разблокируем скролл
  const observer = new MutationObserver(() => {
    if (coverOverlay.classList.contains('opened')) {
      document.body.style.overflow = '';
      observer.disconnect();
    }
  });
  observer.observe(coverOverlay, { attributes: true, attributeFilter: ['class'] });

  // Предзапуск обратного отсчёта (будет показан после открытия)
  updateCountdown();

  // Фокус на кнопке для удобства навигации с клавиатуры
  setTimeout(() => {
    openButton.focus({ preventScroll: true });
  }, 800);
}

// ==================== ДОПОЛНИТЕЛЬНАЯ АНИМАЦИЯ ПРИ ЗАГРУЗКЕ ====================
// Добавляем класс для анимации появления обложки после загрузки страницы
window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden';
  init();
});

// ==================== ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ ====================
const locationPhoto = document.querySelector('.location-photo');
if (locationPhoto) {
  locationPhoto.addEventListener('error', () => {
    // Запасной вариант — градиентный фон
    locationPhoto.style.display = 'none';
    const wrapper = locationPhoto.parentElement;
    if (wrapper) {
      wrapper.style.background =
        'linear-gradient(135deg, #8a9a5b 0%, #556b2f 40%, #3d4a1a 100%)';
      const fallbackText = document.createElement('span');
      fallbackText.textContent = '🏛️ Банкетный зал';
      fallbackText.style.cssText =
        'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);' +
        'font-family:var(--font-serif);font-size:1.5rem;color:var(--gold-light);' +
        'text-align:center;pointer-events:none;';
      wrapper.appendChild(fallbackText);
    }
  });
}

// ==================== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРНЫХ ССЫЛОК ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

console.log('🌿 Приглашение на юбилей готово!');
console.log('📅 Дата события:', EVENT_DATE.toLocaleString('ru-RU'));
console.log('✨ Нажмите на печать, чтобы открыть приглашение.');

// ==================== МУЗЫКА ====================
const musicToggle = document.getElementById('musicToggle');
const musicIcon = musicToggle?.querySelector('.music-icon');

// Замените 'audio/music.mp3' на вашу прямую ссылку
const audio = new Audio('Billie Eilish - Ocean Eyes.mp3');
audio.loop = true;
audio.volume = 0.4;
let isMusicPlaying = false;

// Функция запуска музыки
function playMusic() {
  if (!isMusicPlaying) {
    audio.play().then(() => {
      isMusicPlaying = true;
      if (musicToggle) {
        musicToggle.classList.add('playing');
        if (musicIcon) musicIcon.textContent = '🎶';
      }
    }).catch(err => {
      console.warn('Не удалось запустить музыку:', err);
    });
  }
}

// Показать кнопку (вызывается при открытии приглашения)
function showMusicButton() {
  if (musicToggle) {
    musicToggle.style.display = 'flex';   // показываем
  }
}

// Обработчик нажатия на кнопку
if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
      audio.pause();
      musicToggle.classList.remove('playing');
      if (musicIcon) musicIcon.textContent = '🎵';
      isMusicPlaying = false;
    } else {
      playMusic();
    }
  });
}