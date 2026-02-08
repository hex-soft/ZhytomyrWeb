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
