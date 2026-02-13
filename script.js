/**
 * ЖИТОМИР RP - Оптимізований скрипт
 * Адаптовано для GitHub Pages
 */

const CONFIG = {
    PROXY_BASE: "https://api.allorigins.win/get?url=",
    THEME_KEY: "theme",
    SCROLL_OFFSET: 80,
    FALLBACK_IMAGE: "imgs/logo.png"
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initRobloxData();
});

/** 1. ТЕМНА ТЕМА (Логіка винесена в окрему функцію) */
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    const applyTheme = (isDark) => {
        document.body.classList.toggle("dark-mode", isDark);
        localStorage.setItem(CONFIG.THEME_KEY, isDark ? "dark" : "light");
    };

    // Початкова ініціалізація
    if (localStorage.getItem(CONFIG.THEME_KEY) === "dark") {
        applyTheme(true);
    }

    themeToggle.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark-mode");
        applyTheme(isDark);
    });
}

/** 2. МОБІЛЬНЕ МЕНЮ (Бургер) */
function initMobileMenu() {
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");
    if (!burger || !mobileMenu) return;

    const toggleMenu = () => mobileMenu.classList.toggle("show");
    const closeMenu = () => mobileMenu.classList.remove("show");

    burger.addEventListener("click", toggleMenu);
    
    // Закриття при кліку на посилання або поза меню
    mobileMenu.addEventListener("click", (e) => {
        if (e.target.tagName === 'A') closeMenu();
    });
}

/** 3. ПЛАВНА ПРОКРУТКА (Уніфікована логіка) */
function initSmoothScroll() {
    const scrollToTarget = (targetSelector) => {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        const top = target.getBoundingClientRect().top + window.scrollY - CONFIG.SCROLL_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
    };

    // Використовуємо делегування або загальний цикл
    document.addEventListener("click", (e) => {
        // Обробка якірних посилань
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor && anchor.getAttribute("href").length > 1) {
            e.preventDefault();
            scrollToTarget(anchor.getAttribute("href"));
        }

        // Обробка кнопок фракцій
        const factionBtn = e.target.closest(".faction-link");
        if (factionBtn && factionBtn.dataset.target) {
            e.preventDefault();
            scrollToTarget(`#${factionBtn.dataset.target}`);
        }
    });
}

/** 4. АНІМАЦІЇ (Intersection Observer + Parallax) */
function initAnimations() {
    // Поява секцій
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("show");
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".section").forEach(sec => observer.observe(sec));

    // Паралакс (Throttle не додаю для простоти, але можна через requestAnimationFrame)
    const hero = document.querySelector(".hero");
    if (hero) {
        window.addEventListener("scroll", () => {
            hero.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
        }, { passive: true });
    }
}

/** 5. ROBLOX API (Використання async/await для читабельності) */
async function fetchRobloxUser(userId) {
    const userUrl = `https://users.roblox.com/v1/users/${userId}`;
    try {
        const response = await fetch(`${CONFIG.PROXY_BASE}${encodeURIComponent(userUrl)}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        return JSON.parse(data.contents);
    } catch (err) {
        return null;
    }
}

async function initRobloxData() {
    const devBlocks = document.querySelectorAll('[data-rbx-id]');
    
    devBlocks.forEach(async (block) => {
        const userId = block.dataset.rbxId;
        if (!userId || userId === "YOUR_ID") return;

        const imgElement = block.querySelector('.rbx-avatar');
        const nameElement = block.querySelector('.rbx-name');

        // Аватарка (прямий запит)
        const thumbUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`;
        fetch(thumbUrl)
            .then(res => res.json())
            .then(data => {
                if (data?.data?.[0]) imgElement.src = data.data[0].imageUrl;
            })
            .catch(() => imgElement.src = CONFIG.FALLBACK_IMAGE);

        // Ім'я (через проксі)
        const userData = await fetchRobloxUser(userId);
        if (userData) {
            nameElement.textContent = userData.displayName || userData.name || "Unknown";
        } else {
            nameElement.textContent = "Помилка API";
        }
    });
}
