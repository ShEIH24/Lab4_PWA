// pwa-install.js
// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker зарегистрирован:', registration);
            })
            .catch((error) => {
                console.log('Ошибка регистрации Service Worker:', error);
            });
    });
}

// Управление установкой PWA
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const closeInstallPrompt = document.getElementById('closeInstallPrompt');

// Перехватываем событие beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Предотвращаем автоматический показ prompt
    e.preventDefault();
    // Сохраняем событие для дальнейшего использования
    deferredPrompt = e;

    // Проверяем, не закрывал ли пользователь prompt ранее
    const promptClosed = localStorage.getItem('installPromptClosed');

    if (!promptClosed) {
        // Показываем наш кастомный prompt при первом заходе
        installPrompt.style.display = 'block';
    }
});

// Обработчик кнопки установки
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            return;
        }

        // Показываем системный prompt установки
        deferredPrompt.prompt();

        // Ждем выбора пользователя
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Результат установки: ${outcome}`);

        // Очищаем deferredPrompt
        deferredPrompt = null;

        // Скрываем наш prompt
        installPrompt.style.display = 'none';
    });
}

// Обработчик кнопки закрытия
if (closeInstallPrompt) {
    closeInstallPrompt.addEventListener('click', () => {
        installPrompt.style.display = 'none';
        localStorage.setItem('installPromptClosed', 'true');
    });
}

// Скрываем preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Обратный отсчет для акции
function initCountdown() {
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    if (!hours || !minutes || !seconds) return;

    // Устанавливаем конечную дату (например, через 24 часа)
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 24);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
            hours.textContent = '00';
            minutes.textContent = '00';
            seconds.textContent = '00';
            return;
        }

        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        hours.textContent = h.toString().padStart(2, '0');
        minutes.textContent = m.toString().padStart(2, '0');
        seconds.textContent = s.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();

    // Обработка формы обратной связи
    const contactForm = document.querySelector('.contact-form__form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Спасибо! Ваше сообщение отправлено.');
            contactForm.reset();
        });
    }
});