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
    btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;

        const yOffset = -80;
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset;

        smoothScrollTo(y, 1100);
    });
});
