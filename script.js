const themeToggle = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
});

document.querySelectorAll(".faction-link").forEach(el => {
    el.addEventListener("click", () => {
        document
            .getElementById(el.dataset.target)
            .scrollIntoView({ behavior: "smooth" });
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("show");
    });
}, { threshold: 0.15 });

document.querySelectorAll(".section").forEach(el => observer.observe(el));

window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero");
    hero.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
});


const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

burger.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
});

mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("show");
    });
});

const sections = document.querySelectorAll(".section");

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            sections.forEach(s => s.classList.remove("active"));
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

function smoothScrollTo(targetY, duration = 900) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
        const targetId = link.getAttribute("href");
        if (targetId.length > 1) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (!target) return;

            const yOffset = -80;
            const y = target.getBoundingClientRect().top + window.scrollY + yOffset;

            smoothScrollTo(y, 1000);
        }
    });
});

document.querySelectorAll(".faction-link").forEach(btn => {
    btn.addEventListener("click", e => {
        const targetId = btn.dataset.target;
        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault(); 

        const yOffset = -80;
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({
            top: y,
            behavior: "smooth"
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const devBlocks = document.querySelectorAll('[data-rbx-id]');
    // Тепер використовуємо твій власний проксі на Netlify
    const proxyUrl = "/api/roblox?url="; 

    devBlocks.forEach(block => {
        const userId = block.getAttribute('data-rbx-id');
        const imgElement = block.querySelector('.rbx-avatar');
        const nameElement = block.querySelector('.rbx-name');

        if (userId && userId !== "YOUR_ID") {
            // Завантаження аватарки
            const rbxThumb = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`;
            fetch(`${proxyUrl}${encodeURIComponent(rbxThumb)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.data && data.data[0]) imgElement.src = data.data[0].imageUrl;
                }).catch(() => { imgElement.src = "imgs/logo.png"; });

            // Завантаження імені
            const rbxUser = `https://users.roblox.com/v1/users/${userId}`;
            fetch(`${proxyUrl}${encodeURIComponent(rbxUser)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.displayName) nameElement.textContent = data.displayName;
                }).catch(() => { nameElement.textContent = "Помилка"; });
        }
    });
});
