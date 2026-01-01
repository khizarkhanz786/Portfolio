const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const tl = gsap.timeline();

tl.from('.hero-greeting', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 2.2, // Wait for loader
    ease: 'power3.out'
})
    .from('.hero-name', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-role', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-desc', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-btns', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.6')
    .from('.scroll-indicator', {
        opacity: 0,
        duration: 1
    }, '-=0.5');

// Section Reveal Animation
gsap.utils.toArray('.section').forEach(section => {
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top 85%'
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });
});

// Section Headers Animation
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// About Image Reveal
gsap.from('.about-image', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%'
    },
    x: -50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
});

// About Text Reveal
gsap.from('.about-content', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%'
    },
    x: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
});

// Skill Bars
gsap.utils.toArray('.bar-fill').forEach(bar => {
    gsap.to(bar, {
        scrollTrigger: {
            trigger: '.skills-container',
            start: 'top 80%'
        },
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.out'
    });
});

// Project Cards Stagger
gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 85%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2, // 0.2s delay between each card
    ease: 'power3.out'
});

// Contact Section
gsap.from('.contact-wrapper', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Typewriter Effect Logic
const terms = ["Developer.", "AI / Chatbot.", "Creator.", "Thinker.", "Web Developer."];
const typeWriterSpan = document.querySelector('.typewriter');
let termIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentTerm = terms[termIndex];

    if (isDeleting) {
        typeWriterSpan.textContent = currentTerm.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeWriterSpan.textContent = currentTerm.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentTerm.length) {
        isDeleting = true;
        setTimeout(typeWriter, 2000); // Wait before deleting
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        termIndex = (termIndex + 1) % terms.length;
        setTimeout(typeWriter, 500); // Wait before typing next word
    } else {
        setTimeout(typeWriter, isDeleting ? 100 : 150);
    }
}

// Start typewriter after a slight delay
setTimeout(typeWriter, 3000);
