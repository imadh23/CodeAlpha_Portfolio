/**
 * Alex Rivera Portfolio - Core Application Script
 * Features: Mobile navigation toggle, Scroll navbar contraction, Active link observer, Project filters, Animated stats counters, Contact submission, Back to top triggers
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initTheme();
    initScrollEffects();
    initProjectFilters();
    initStatsCounters();
    initContactForm();
});

// ==========================================================================
// Theme Initialization & Toggling
// ==========================================================================
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    
    // Check local storage preference
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("portfolio-theme", newTheme);
    });
}

// ==========================================================================
// Navigation & Mobile Menu Menu Toggles
// ==========================================================================
function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navLinksList = document.getElementById("nav-links");
    const navLinks = document.querySelectorAll(".nav-link");

    // Scroll handler to shrink navbar
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Mobile Hamburger Toggle
    mobileToggle.addEventListener("click", () => {
        navLinksList.classList.toggle("active");
        navbar.classList.toggle("menu-open");
    });

    // Close menu when links are clicked (Mobile view)
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinksList.classList.remove("active");
            navbar.classList.remove("menu-open");
        });
    });

    // Intersection Observer to highlight active navigation link based on scroll
    const sections = document.querySelectorAll("section");
    
    const options = {
        root: null, // Viewport
        rootMargin: "-20% 0px -60% 0px", // Trigger when section occupies the main viewport region
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                // Clear active states
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));
}

// ==========================================================================
// Scrolling Effects (Back to Top & Fade Animations)
// ==========================================================================
function initScrollEffects() {
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        // Show/hide floating back to top button
        if (window.scrollY > 400) {
            backToTopBtn.style.display = "flex";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ==========================================================================
// Project Cards Categories Filtering
// ==========================================================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll(".proj-filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active state
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                
                // Animate entry / exit
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                    // Trigger reflow for animation entry
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}

// ==========================================================================
// Animated Profile Stats Counter Heuristics
// ==========================================================================
function initStatsCounters() {
    const statNums = document.querySelectorAll(".stat-num");
    let hasCounted = false;

    const countStats = () => {
        statNums.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-val"));
            const duration = 2000; // 2 seconds total count time
            const stepTime = Math.abs(Math.floor(duration / target));
            
            let count = 0;
            const timer = setInterval(() => {
                count++;
                
                // Format suffixes
                if (stat.parentNode.querySelector(".stat-label").textContent.includes("Uptime")) {
                    stat.textContent = count + "%";
                } else if (stat.parentNode.querySelector(".stat-label").textContent.includes("Projects")) {
                    stat.textContent = count + "+";
                } else {
                    stat.textContent = count;
                }

                if (count >= target) {
                    clearInterval(timer);
                }
            }, stepTime);
        });
    };

    // Trigger count animation when About Section is scrolled into view
    const aboutSection = document.getElementById("about");
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                countStats();
                hasCounted = true; // Trigger once
            }
        });
    }, { threshold: 0.2 });

    if (aboutSection) {
        countObserver.observe(aboutSection);
    }
}

// ==========================================================================
// Contact Form Submission & Mock Delivery Alerts
// ==========================================================================
function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    const successAlert = document.getElementById("form-success");

    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Perform visual submit simulation
        const submitBtn = contactForm.querySelector(".form-submit-btn");
        const origBtnText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>`;

        // Simulate network API delay (1.5 seconds)
        setTimeout(() => {
            // Hide Form, Show success alert
            contactForm.style.display = "none";
            successAlert.style.display = "flex";
            
            // Clean/Reset fields
            contactForm.reset();

            // Re-show form after 10 seconds (in case they want to send another message)
            setTimeout(() => {
                successAlert.style.display = "none";
                contactForm.style.display = "flex";
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnText;
            }, 10000);

        }, 1500);
    });
}
