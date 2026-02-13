/**
 * ЖИТОМИР RP - Офіційний скрипт сайту
 * Адаптовано для GitHub Pages
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ТЕМНА ТЕМА ---
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";

    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("theme", theme);
    });

    // --- 2. МОБІЛЬНЕ МЕНЮ (БУРГЕР) ---
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (burger && mobileMenu) {
        burger.addEventListener("click", () => {
            mobileMenu.classList.toggle("show");
        });

        // Закриття меню при кліку на посилання
        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("show");
            });
        });
    }

    // --- 3. ПЛАВНА ПРОКРУТКА (SMOOTH SCROLL) ---
    function performSmoothScroll(targetId, offset = -80) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY + offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    }

    // Обробка всіх якірних посилань (href="#...")
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href");
            if (id.length > 1) {
                e.preventDefault();
                performSmoothScroll(id);
            }
        });
    });

    // Обробка кнопок фракцій (data-target)
    document.querySelectorAll(".faction-link").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetId = btn.dataset.target;
            if (targetId) {
                e.preventDefault();
                performSmoothScroll(`#${targetId}`);
            }
        });
    });

    // --- 4. АНІМАЦІЯ ПОЯВИ СЕКЦІЙ ---
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".section").forEach(sec => sectionObserver.observe(sec));

    // --- 5. ПАРАЛАКС ЕФЕКТ ДЛЯ HERO ---
    window.addEventListener("scroll", () => {
        const hero = document.querySelector(".hero");
        if (hero) {
            hero.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
        }
    });

    // --- 6. ЗАВАНТАЖЕННЯ ДАНИХ ROBLOX (БЕЗ NETLIFY) ---
    const devBlocks = document.querySelectorAll('[data-rbx-id]');
    
    // Використовуємо AllOrigins як безкоштовний проксі для обходу CORS на GitHub Pages
    const proxyBase = "https://api.allorigins.win/get?url=";

    devBlocks.forEach(block => {
        const userId = block.getAttribute('data-rbx-id');
        const imgElement = block.querySelector('.rbx-avatar');
        const nameElement = block.querySelector('.rbx-name');

        if (userId && userId !== "YOUR_ID") {
            
            // А. Завантаження аватарки (прямий запит зазвичай працює)
            const thumbUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`;
            
            fetch(thumbUrl)
                .then(res => res.json())
                .then(data => {
                    if (data.data && data.data[0]) {
                        imgElement.src = data.data[0].imageUrl;
                    }
                })
                .catch(() => { imgElement.src = "imgs/logo.png"; });

            // Б. Завантаження імені (через проксі)
            const userUrl = `https://users.roblox.com/v1/users/${userId}`;
            
            fetch(`${proxyBase}${encodeURIComponent(userUrl)}`)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Proxy error');
                })
                .then(data => {
                    // AllOrigins повертає дані в полі .contents як рядок JSON
                    const userData = JSON.parse(data.contents);
                    if (userData.displayName) {
                        nameElement.textContent = userData.displayName;
                    } else if (userData.name) {
                        nameElement.textContent = userData.name;
                    }
                })
                .catch(err => {
                    console.error("Roblox API Error:", err);
                    nameElement.textContent = "Не знайдено";
                });
        }
    });
});
