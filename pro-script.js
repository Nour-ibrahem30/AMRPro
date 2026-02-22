// ===== GSAP INITIALIZATION =====
gsap.registerPlugin(ScrollTrigger);

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== HERO CANVAS ANIMATION =====
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    heroCanvas.width = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * heroCanvas.width;
            this.y = Math.random() * heroCanvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > heroCanvas.width) this.x = 0;
            if (this.x < 0) this.x = heroCanvas.width;
            if (this.y > heroCanvas.height) this.y = 0;
            if (this.y < 0) this.y = heroCanvas.height;
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 102, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((a, i) => {
            particles.slice(i + 1).forEach(b => {
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 102, 255, ${1 - distance / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        heroCanvas.width = heroCanvas.offsetWidth;
        heroCanvas.height = heroCanvas.offsetHeight;
    });
}

// ===== GSAP ANIMATIONS =====

// Hero Section Animation
gsap.from('.hero-badge', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.2
});

gsap.from('.hero-title', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.4
});

gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.6
});

gsap.from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.8
});

gsap.from('.hero-buttons', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 1
});

gsap.from('.hero-stats .stat-item', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 1.2,
    stagger: 0.2
});

// Problem Cards Animation
gsap.utils.toArray('.problem-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1
    });
});

// Solution Reveal Animation
gsap.from('.solution-line', {
    scrollTrigger: {
        trigger: '.solution-reveal',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    scaleX: 0,
    duration: 1,
    ease: 'power2.out'
});

gsap.from('.solution-content', {
    scrollTrigger: {
        trigger: '.solution-reveal',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.5
});

// Architecture Cards Animation
gsap.utils.toArray('.arch-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        delay: i * 0.15
    });
});

// ===== ROBOT EXPLODED VIEW ANIMATION =====
const robotParts = document.querySelectorAll('.robot-part');
const partInfos = document.querySelectorAll('.info-content');

// Click to show part info
robotParts.forEach(part => {
    part.addEventListener('click', () => {
        const partName = part.dataset.part;
        
        // Remove active class from all parts and infos
        robotParts.forEach(p => p.classList.remove('active'));
        partInfos.forEach(info => info.classList.remove('active'));
        
        // Add active class to clicked part
        part.classList.add('active');
        
        // Show corresponding info
        const targetInfo = document.querySelector(`[data-info="${partName}"]`);
        if (targetInfo) {
            targetInfo.classList.add('active');
        }
    });
});

// ===== VIDEO SHOWCASE INTERACTION =====
const videoOverlay = document.getElementById('videoOverlay');
const playButton = document.getElementById('playButton');
const robotVideo = document.getElementById('robotVideo');

if (videoOverlay && playButton) {
    videoOverlay.addEventListener('click', () => {
        videoOverlay.classList.add('hidden');
        // Add autoplay to iframe src
        const currentSrc = robotVideo.src;
        if (!currentSrc.includes('autoplay=1')) {
            robotVideo.src = currentSrc + '&autoplay=1';
        }
    });
}

// Video Section Animations
gsap.from('.video-wrapper', {
    scrollTrigger: {
        trigger: '.robot-video-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    scale: 0.9,
    duration: 1,
    ease: 'power3.out'
});

gsap.utils.toArray('.feature-highlight').forEach((feature, i) => {
    gsap.from(feature, {
        scrollTrigger: {
            trigger: feature,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: i * 0.15
    });
});

gsap.utils.toArray('.stat-box').forEach((stat, i) => {
    gsap.from(stat, {
        scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: i * 0.1
    });
});

// ===== MOVEMENT SIMULATION =====
const movementCanvas = document.getElementById('movementCanvas');
if (movementCanvas) {
    const ctx = movementCanvas.getContext('2d');
    movementCanvas.width = movementCanvas.offsetWidth;
    movementCanvas.height = movementCanvas.offsetHeight;

    let robotX = movementCanvas.width / 2;
    let robotY = movementCanvas.height / 2;
    let robotAngle = 0;
    let velocityX = 0;
    let velocityY = 0;

    const obstacles = [
        { x: 150, y: 150, width: 80, height: 80 },
        { x: 400, y: 300, width: 100, height: 60 },
        { x: 250, y: 400, width: 60, height: 100 }
    ];

    function drawRobot() {
        ctx.save();
        ctx.translate(robotX, robotY);
        ctx.rotate(robotAngle);
        
        // Robot body
        ctx.fillStyle = '#0066FF';
        ctx.fillRect(-25, -25, 50, 50);
        
        // Direction indicator
        ctx.fillStyle = '#00D4FF';
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(35, -10);
        ctx.lineTo(35, 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    function drawObstacles() {
        ctx.fillStyle = 'rgba(255, 51, 102, 0.3)';
        ctx.strokeStyle = '#FF3366';
        ctx.lineWidth = 2;
        
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        });
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 102, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < movementCanvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, movementCanvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < movementCanvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(movementCanvas.width, y);
            ctx.stroke();
        }
    }

    function updateRobot() {
        robotX += velocityX;
        robotY += velocityY;
        
        // Boundary check
        robotX = Math.max(30, Math.min(movementCanvas.width - 30, robotX));
        robotY = Math.max(30, Math.min(movementCanvas.height - 30, robotY));
        
        // Friction
        velocityX *= 0.95;
        velocityY *= 0.95;
        
        if (Math.abs(velocityX) < 0.1) velocityX = 0;
        if (Math.abs(velocityY) < 0.1) velocityY = 0;
    }

    function animate() {
        ctx.fillStyle = '#141824';
        ctx.fillRect(0, 0, movementCanvas.width, movementCanvas.height);
        
        drawGrid();
        drawObstacles();
        updateRobot();
        drawRobot();
        
        requestAnimationFrame(animate);
    }

    animate();

    // Movement controls
    const moveButtons = document.querySelectorAll('.move-btn');
    moveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            const speed = 3;
            
            switch(direction) {
                case 'forward':
                    velocityY = -speed;
                    break;
                case 'backward':
                    velocityY = speed;
                    break;
                case 'left':
                    velocityX = -speed;
                    break;
                case 'right':
                    velocityX = speed;
                    break;
                case 'stop':
                    velocityX = 0;
                    velocityY = 0;
                    break;
            }
        });
    });

    window.addEventListener('resize', () => {
        movementCanvas.width = movementCanvas.offsetWidth;
        movementCanvas.height = movementCanvas.offsetHeight;
    });
}

// ===== ANIMATED COUNTERS =====
const resultNumbers = document.querySelectorAll('.result-number');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const targetValue = parseFloat(target.dataset.target);
            const duration = 2000;
            const increment = targetValue / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < targetValue) {
                    target.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    target.textContent = targetValue;
                }
            };
            
            updateCounter();
            counterObserver.unobserve(target);
        }
    });
}, observerOptions);

resultNumbers.forEach(number => {
    counterObserver.observe(number);
});

// ===== CALCULATION CARDS ANIMATION =====
gsap.utils.toArray('.calc-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1
    });
});

// ===== FEATURE CARDS ANIMATION =====
gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        delay: i * 0.15
    });
});

// ===== RESULTS CARDS ANIMATION =====
gsap.utils.toArray('.result-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1
    });
});

// ===== FUTURE CARDS ANIMATION =====
gsap.utils.toArray('.future-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        delay: i * 0.15
    });
});

// ===== TEAM CARDS ANIMATION =====
gsap.utils.toArray('.team-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        delay: i * 0.2
    });
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== 3D TILT EFFECT ON CARDS =====
const tiltCards = document.querySelectorAll('.arch-card, .calc-card, .feature-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ===== SCROLL PROGRESS INDICATOR =====
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0066FF, #00D4FF);
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ===== CONSOLE BRANDING =====
console.log('%c🤖 AMR Pro - Autonomous Industrial Transport Robot', 'background: #0066FF; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%cBuilt with GSAP, modern web technologies, and YouTube integration', 'color: #00D4FF; font-size: 14px;');
console.log('%cGraduation Project 2026', 'color: #A0AEC0; font-size: 12px;');

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('✅ AMR Pro website loaded successfully!');


// ===== BACK TO TOP BUTTON =====
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ===== SCROLL PROGRESS BAR =====
const scrollProgressFill = document.getElementById('scrollProgressFill');

if (scrollProgressFill) {
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        scrollProgressFill.style.width = progress + '%';
    });
}


// ===== LOADING SCREEN =====
const loadingScreen = document.getElementById('loadingScreen');
const loadingBarFill = document.getElementById('loadingBarFill');
let loadingProgress = 0;

function updateLoadingProgress(progress) {
    loadingProgress = Math.min(100, progress);
    if (loadingBarFill) {
        loadingBarFill.style.width = loadingProgress + '%';
    }
}

// Simulate loading progress
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        updateLoadingProgress(progress);
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 500);
        }
    }, 200);
}

// Start loading when page loads
window.addEventListener('load', () => {
    simulateLoading();
});


// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}


// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Arrow keys for navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -100 && rect.top <= 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let targetIndex;
            
            if (e.key === 'ArrowUp') {
                targetIndex = Math.max(0, currentIndex - 1);
            } else {
                targetIndex = Math.min(sections.length - 1, currentIndex + 1);
            }
            
            sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Home/End keys
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});


// ===== SECTION INDICATORS =====
const indicators = document.querySelectorAll('.indicator');
const sectionsForIndicators = document.querySelectorAll('section[id]');

function updateIndicators() {
    let currentSection = '';
    
    sectionsForIndicators.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section.id;
        }
    });
    
    indicators.forEach(indicator => {
        const sectionId = indicator.getAttribute('data-section');
        if (sectionId === currentSection) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateIndicators);
updateIndicators(); // Initial call
