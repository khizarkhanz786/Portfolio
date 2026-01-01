// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const progressBar = document.querySelector('.progress');
    const loaderText = document.querySelector('.loader-text');

    // Animate progress
    progressBar.style.width = '100%';

    setTimeout(() => {
        loaderText.style.opacity = '0';
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Refresh scroll triggers after loader is gone and layout is stable
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 500);
    }, 1500);
});

// Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('active');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
    });
});

// Theme Toggle
const themeBtn = document.querySelector('#theme-toggle');
const themeIcon = themeBtn.querySelector('i');
const body = document.body;

// Check local storage
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.add('fa-sun');
        themeIcon.classList.remove('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const statusMsg = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // UI Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            statusMsg.textContent = "Message sent successfully! I'll get back to you soon.";
            statusMsg.style.color = "#00f260";
            contactForm.reset();
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        statusMsg.textContent = "Oops! Something went wrong. Please try again.";
        statusMsg.style.color = "#ff4757";
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Clear status after 5 seconds
        setTimeout(() => {
            statusMsg.textContent = '';
        }, 5000);
    }
});

// Tilt Effect for Project Cards
const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add to current
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                // Small delay to allow display:block to apply before animating opacity
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Refresh ScrollTrigger to recalculate positions
        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 350);
        }
    });
});
// Initial refresh for ScrollTrigger
if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 2000);
    });
}
// Initial visibility check for project cards
window.addEventListener('load', () => {
    setTimeout(() => {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            // If card is still hidden (GSAP from 0 didn't complete), force it visible
            if (window.getComputedStyle(card).opacity === '0') {
                gsap.to(card, { opacity: 1, y: 0, duration: 0.5 });
            }
        });
    }, 2500); // Small buffer after loader and GSAP triggers
});
