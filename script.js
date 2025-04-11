// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Improved Parallax Effect with throttling
let lastScrollTime = 0;
const scrollThreshold = 16; // ~60fps

window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < scrollThreshold) return;
    lastScrollTime = now;

    const parallaxElements = document.querySelectorAll('.floating-element, .floating-3d-element');
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        // No need to calculate getBoundingClientRect() on scroll
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// 3D Mockup Effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 30;
        const angleY = (centerX - x) / 30;
        
        card.querySelector('.mockup-content').style.transform = 
            `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.querySelector('.mockup-content').style.transform = 
            'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Animated Background Grid
const createGrid = () => {
    const background = document.querySelector('.animated-background');
    background.style.opacity = '0.8';
};

// Intersection Observer for Fade-in Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Optimized Three.js 3D Background
const initThreeBackground = () => {
    // Check if device is low-end (mobile or tablet)
    const isLowEndDevice = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Use alpha: true for transparent background, but it's more expensive
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: false, // Disable antialiasing for better performance
        powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('.hero').appendChild(renderer.domElement);
    
    // Reduce number of particles on low-end devices
    const particleCount = isLowEndDevice ? 1000 : 5000;
    
    // Create particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < particleCount; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x64ffda,
        size: isLowEndDevice ? 3 : 2, // Larger size but fewer particles on mobile
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: false // Disable size attenuation for better performance
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    camera.position.z = 1000;
    
    // Variable to control animation frame rate
    let lastFrame = 0;
    const frameInterval = isLowEndDevice ? 50 : 16; // Limit to ~20fps on mobile, ~60fps on desktop
    
    // Animation with throttling for low-end devices
    const animate = (timestamp) => {
        requestAnimationFrame(animate);
        
        // Throttle frame rate
        if (timestamp - lastFrame < frameInterval) return;
        lastFrame = timestamp;
        
        // Slower rotation on low-end devices
        particles.rotation.x += isLowEndDevice ? 0.0002 : 0.0005;
        particles.rotation.y += isLowEndDevice ? 0.0002 : 0.0005;
        
        renderer.render(scene, camera);
    };
    
    animate(0);
    
    // Efficient resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 250);
    });
    
    // Add a method to dispose resources when not in viewport
    return {
        dispose: () => {
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        }
    };
};

// Initialize Three.js background when the page loads
window.addEventListener('load', initThreeBackground);

// Form Submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Thank you for your message! I will get back to you soon.');
});

// Enhanced reveal animations for About section
const revealElements = document.querySelectorAll('.reveal-text');
const aboutSection = document.querySelector('.about');

const revealOnScroll = () => {
    const sectionTop = aboutSection.getBoundingClientRect().top;
    const sectionBottom = aboutSection.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.8 && sectionBottom > 0) {
        revealElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200); // Stagger the animations
        });
    }
};

// Optimize Parallax effect for about section
const handleParallax = () => {
    // Using requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
        const scrollPosition = window.pageYOffset;
        const aboutContent = document.querySelector('.about-content');
        
        if (aboutContent) {
            aboutContent.style.transform = `translateY(${scrollPosition * 0.05}px)`; // Reduced parallax intensity
        }
    });
};

// Mouse move effect for skills
const skills = document.querySelectorAll('.skill');
skills.forEach(skill => {
    skill.addEventListener('mousemove', (e) => {
        const rect = skill.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        skill.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    skill.addEventListener('mouseleave', () => {
        skill.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Optimize scroll event listeners with throttling
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;
        window.requestAnimationFrame(() => {
            revealOnScroll();
            handleParallax();
            
            // Show the button when the user scrolls down 300px from the top
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
            
            isScrolling = false;
        });
    }
});

// Get the scroll-to-top button
const scrollTopBtn = document.querySelector('.scroll-top');

// Add scroll to top functionality
scrollTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effects to side buttons
const sideButtons = document.querySelectorAll('.side-button');
sideButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            y: -5,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Section transitions
const sections = document.querySelectorAll('.section-transition');

// Only run heavy animations when in viewport
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Add 'in-view' class for specific section animations
            if (entry.target.classList.contains('about')) {
                entry.target.classList.add('in-view');
            } else if (entry.target.classList.contains('work')) {
                entry.target.classList.add('in-view');
            } else if (entry.target.classList.contains('contact')) {
                entry.target.classList.add('in-view');
            }
            
            // Enable animations when in view
            if (entry.target.classList.contains('hero') && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
            }
        } else {
            // Optionally disable heavy animations when out of view
            // This is a more aggressive optimization
            if (entry.target.classList.contains('hero') && entry.target.hasAttribute('data-animated')) {
                // Could pause animations here for extreme optimization
            }
        }
    });
}, { threshold: 0.1 });

// Observe all sections
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Hero section parallax effect
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    if (heroSection) {
        const scrollPosition = window.pageYOffset;
        const scrollSpeed = 0.5;
        
        // Move hero content slightly up to create parallax, adjusted for lower positioning (55% instead of 50%)
        heroContent.style.transform = `translate(-50%, calc(-55% - ${scrollPosition * scrollSpeed}px))`;
        
        // Add slight rotate effect on scroll
        heroContent.style.transform += ` rotateX(${scrollPosition * 0.01}deg)`;
        
        // Change opacity based on scroll
        heroSection.style.opacity = 1 - (scrollPosition * 0.002);
    }
});

// Enhanced scroll indicators
const scrollIndicators = document.querySelectorAll('.scroll-indicator');

scrollIndicators.forEach(indicator => {
    // Add hover animation with GSAP
    indicator.addEventListener('mouseenter', () => {
        gsap.to(indicator, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    indicator.addEventListener('mouseleave', () => {
        gsap.to(indicator, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    // Hide indicator when scrolling down
    window.addEventListener('scroll', () => {
        const parentSection = indicator.closest('section');
        const sectionBottom = parentSection.getBoundingClientRect().bottom;
        
        if (sectionBottom < window.innerHeight * 0.5) {
            gsap.to(indicator, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(indicator, {
                opacity: 0.7,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
});

// Sequence animations for project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.setProperty('--index', index);
});

// Form group sequence animations
const formGroups = document.querySelectorAll('.form-group');
formGroups.forEach((group, index) => {
    group.style.setProperty('--index', index);
});

// 3D tilt effect on project cards with enhanced physics
projectCards.forEach(card => {
    let rafID = null;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let tiltX = 0;
    let tiltY = 0;
    const maxTilt = 15; // maximum tilt in degrees
    const lerp = 0.1; // linear interpolation factor for smoothing

    card.addEventListener('mousemove', (e) => {
        if (rafID) cancelAnimationFrame(rafID);
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Target angles based on mouse position
        const targetTiltX = ((y - centerY) / centerY) * -maxTilt;
        const targetTiltY = ((x - centerX) / centerX) * maxTilt;
        
        // Smooth animation function
        const animateTilt = () => {
            // Linear interpolation for smooth movement
            tiltX = tiltX + (targetTiltX - tiltX) * lerp;
            tiltY = tiltY + (targetTiltY - tiltY) * lerp;
            
            // Apply transform with smooth values
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
            
            // Check if we should continue animating
            if (Math.abs(tiltX - targetTiltX) > 0.1 || Math.abs(tiltY - targetTiltY) > 0.1) {
                rafID = requestAnimationFrame(animateTilt);
            }
        };
        
        // Start animation
        rafID = requestAnimationFrame(animateTilt);
    });
    
    card.addEventListener('mouseleave', () => {
        if (rafID) cancelAnimationFrame(rafID);
        
        // Smooth return to original position
        rafID = requestAnimationFrame(function resetTilt() {
            tiltX = tiltX * 0.9;
            tiltY = tiltY * 0.9;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1, 1, 1)`;
            
            if (Math.abs(tiltX) > 0.5 || Math.abs(tiltY) > 0.5) {
                rafID = requestAnimationFrame(resetTilt);
            } else {
                card.style.transform = '';
            }
        });
    });
});

// Enhanced scroll reveal for paragraphs with staggered timing
const revealParagraphs = document.querySelectorAll('.about-paragraph');
revealParagraphs.forEach((paragraph, index) => {
    paragraph.style.transitionDelay = `${0.2 + (index * 0.15)}s`;
});

// Premium Hero Effects
function initPremiumHeroEffects() {
    // Create animated particles
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer) {
        const numParticles = 50;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            
            // Random size between 2-6px
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation duration
            const duration = Math.random() * 10 + 10;
            particle.style.animationDuration = `${duration}s`;
            
            // Random animation delay
            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // 3D parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const layer1 = document.querySelector('.layer-1');
    const layer2 = document.querySelector('.layer-2');
    const layer3 = document.querySelector('.layer-3');
    
    document.addEventListener('mousemove', (e) => {
        if (hero && layer1 && layer2 && layer3) {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            // Move layers with different intensities for parallax effect
            gsap.to(layer1, {
                x: mouseX * 50,
                y: mouseY * 50,
                duration: 1,
                ease: 'power2.out'
            });
            
            gsap.to(layer2, {
                x: mouseX * -70,
                y: mouseY * -70,
                duration: 1,
                ease: 'power2.out'
            });
            
            gsap.to(layer3, {
                x: mouseX * 30,
                y: mouseY * 30,
                duration: 1,
                ease: 'power2.out'
            });
            
            // Slight tilt to hero content for 3D effect
            gsap.to(heroContent, {
                rotationY: mouseX * 5,
                rotationX: -mouseY * 5,
                duration: 1,
                ease: 'power2.out'
            });
        }
    });

    // Text animation for subtitle
    const heroSubtitle = document.querySelector('.hero-content p');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
            span.style.display = 'inline-block';
            span.style.animationDelay = `${i * 0.05 + 1}s`;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = 'all 0.3s ease';
            
            heroSubtitle.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, i * 50 + 1000);
        }
    }
}

// Enhanced Hero Background Animations
function enhanceHeroBackground() {
    // Create floating orbs
    createFloatingOrbs();
    
    // Create digital rain effect
    createDigitalRain();
    
    // Create more particles with glow
    createEnhancedParticles();
}

// Create floating orbs
function createFloatingOrbs() {
    const orbsContainer = document.getElementById('hero-orbs');
    if (!orbsContainer) return;
    
    // Create 5-8 orbs with different sizes and positions
    const numOrbs = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < numOrbs; i++) {
        const orb = document.createElement('div');
        orb.className = 'hero-orb';
        
        // Random size between 100-300px
        const size = Math.random() * 200 + 100;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        
        // Random position
        orb.style.left = `${Math.random() * 80 + 10}%`;
        orb.style.top = `${Math.random() * 80 + 10}%`;
        
        // Random animation duration and delay
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 5;
        orb.style.animationDuration = `${duration}s`;
        orb.style.animationDelay = `${delay}s`;
        
        // Random z-index for layering
        orb.style.zIndex = Math.floor(Math.random() * 2);
        
        // Random opacity
        orb.style.opacity = Math.random() * 0.15 + 0.1;
        
        orbsContainer.appendChild(orb);
    }
}

// Create digital rain effect
function createDigitalRain() {
    const rainContainer = document.getElementById('digitalRain');
    if (!rainContainer) return;
    
    // Number of columns based on screen width
    const numColumns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < numColumns; i++) {
        const column = document.createElement('div');
        column.className = 'rain-column';
        
        // Random position
        column.style.left = `${i * 20 + Math.random() * 10}px`;
        
        // Random speed
        const speed = Math.random() * 10 + 5;
        column.style.animationDuration = `${speed}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        column.style.animationDelay = `${delay}s`;
        
        // Generate random characters
        const length = Math.floor(Math.random() * 15) + 5;
        let text = '';
        for (let j = 0; j < length; j++) {
            // Mix of binary, numbers, and special characters for tech feel
            const charPool = '01אבגדהוזחטיךכלםמןנסעףפץצקרשת';
            text += charPool.charAt(Math.floor(Math.random() * charPool.length));
            text += '<br>';
        }
        column.innerHTML = text;
        
        rainContainer.appendChild(column);
    }
}

// Create enhanced particles
function createEnhancedParticles() {
    const particlesContainer = document.getElementById('hero-particles');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create more particles with varied sizes and colors
    const numParticles = 80;
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        
        // Random size between 1-5px
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration
        const duration = Math.random() * 15 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random animation delay
        const delay = Math.random() * 8;
        particle.style.animationDelay = `${delay}s`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.7 + 0.3;
        
        // Random glow intensity
        const glowIntensity = Math.random() * 15 + 5;
        particle.style.boxShadow = `0 0 ${glowIntensity}px ${Math.floor(glowIntensity/2)}px rgba(0, 255, 157, 0.${Math.floor(Math.random() * 5) + 2})`;
        
        particlesContainer.appendChild(particle);
    }
}

// Enhanced Contact Section Background Effects
function enhanceContactBackground() {
    // Create floating orbs for contact section
    createContactOrbs();
    
    // Create digital rain effect for contact section
    createContactDigitalRain();
}

// Create floating orbs for contact section
function createContactOrbs() {
    const orbsContainer = document.getElementById('contact-orbs');
    if (!orbsContainer) return;
    
    // Create 4-6 orbs with different sizes and positions
    const numOrbs = Math.floor(Math.random() * 3) + 4;
    
    for (let i = 0; i < numOrbs; i++) {
        const orb = document.createElement('div');
        orb.className = 'hero-orb';
        
        // Random size between 80-250px
        const size = Math.random() * 170 + 80;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        
        // Random position
        orb.style.left = `${Math.random() * 80 + 10}%`;
        orb.style.top = `${Math.random() * 80 + 10}%`;
        
        // Random animation duration and delay
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 5;
        orb.style.animationDuration = `${duration}s`;
        orb.style.animationDelay = `${delay}s`;
        
        // Random z-index for layering
        orb.style.zIndex = Math.floor(Math.random() * 2);
        
        // Random opacity
        orb.style.opacity = Math.random() * 0.15 + 0.1;
        
        orbsContainer.appendChild(orb);
    }
}

// Create digital rain effect for contact section
function createContactDigitalRain() {
    const rainContainer = document.getElementById('contactDigitalRain');
    if (!rainContainer) return;
    
    // Number of columns based on screen width
    const numColumns = Math.floor(window.innerWidth / 30); // Slightly fewer columns than home
    
    for (let i = 0; i < numColumns; i++) {
        const column = document.createElement('div');
        column.className = 'rain-column';
        
        // Random position
        column.style.left = `${i * 30 + Math.random() * 15}px`;
        
        // Random speed
        const speed = Math.random() * 10 + 8;
        column.style.animationDuration = `${speed}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        column.style.animationDelay = `${delay}s`;
        
        // Generate random characters
        const length = Math.floor(Math.random() * 10) + 5;
        let text = '';
        for (let j = 0; j < length; j++) {
            // Mix of numbers and symbols for tech feel
            const charPool = '01{}[]<>@#$%^&*';
            text += charPool.charAt(Math.floor(Math.random() * charPool.length));
            text += '<br>';
        }
        column.innerHTML = text;
        
        rainContainer.appendChild(column);
    }
}

// Call all effects on load
window.addEventListener('load', () => {
    initPremiumHeroEffects();
    enhanceHeroBackground();
    enhanceContactBackground(); // Initialize contact section background effects
    revealOnScroll();
    handleParallax();
});

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize text effects
    initTextEffects();
    
    // Other existing initialization code...
});

// Initialize Text Effects
function initTextEffects() {
    // Apply typing effect to main heading
    const mainHeading = document.querySelector('.hero h1');
    if (mainHeading) {
        mainHeading.classList.add('typing-effect');
        
        // Remove typing effect after animation completes and add glow
        setTimeout(() => {
            mainHeading.classList.remove('typing-effect');
            mainHeading.style.borderRight = 'none';
            mainHeading.classList.add('glow-text');
        }, 4000);
    }
    
    // Add hover underline effect to navigation menu items
    const menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach(item => {
        item.classList.add('hover-underline');
    });
    
    // Add text gradient effect to section headings
    const sectionHeadings = document.querySelectorAll('h2');
    sectionHeadings.forEach(heading => {
        heading.classList.add('text-gradient');
    });
    
    // Add flicker effect to some elements
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.classList.add('flicker-text');
    }
    
    // Add hover scale effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.add('hover-scale');
    });
    
    // Add glow effect to social media icons
    const socialIcons = document.querySelectorAll('.social-button i');
    socialIcons.forEach(icon => {
        icon.classList.add('glow-text');
    });
    
    // Type writer effect for each paragraph in about section with delays
    const aboutParagraphs = document.querySelectorAll('.about-paragraph p');
    aboutParagraphs.forEach((paragraph, index) => {
        // Store original text
        const originalText = paragraph.textContent;
        paragraph.textContent = '';
        paragraph.style.whiteSpace = 'normal';
        
        // Set typing class
        paragraph.classList.add('typing-ready');
        
        // Create observer to start typing when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start typing after a delay based on paragraph index
                    setTimeout(() => {
                        typeText(paragraph, originalText);
                        paragraph.style.visibility = 'visible';
                    }, index * 1000);
                    observer.unobserve(paragraph);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(paragraph);
    });
}

// Function to simulate typing text
function typeText(element, text) {
    let index = 0;
    const typingSpeed = 20; // ms per character
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        } else {
            // Add glow effect after typing is complete
            element.classList.add('glow-text');
            setTimeout(() => {
                element.classList.remove('glow-text');
            }, 2000);
        }
    }
    
    type();
}

// Rainbow Swirl Cursor Effect - Commented out to remove functionality
/*
function initRainbowCursorEffect() {
    // Check if device is mobile/tablet - disable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    if (isTouchDevice) {
        // Hide cursor elements on touch devices
        const cursorElements = document.querySelectorAll('.cursor, .cursor-follower');
        cursorElements.forEach(el => {
            el.style.display = 'none';
        });
        return; // Exit early
    }
    
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // For speed calculation
    let prevMouseX = 0;
    let prevMouseY = 0;
    let speedX = 0;
    let speedY = 0;
    let lastSpeedUpdateTime = 0;
    
    // For trail
    const trailElements = [];
    const MAX_TRAIL_ELEMENTS = 10; // Reduced from original value
    let trailUpdateCounter = 0;
    const TRAIL_UPDATE_FREQUENCY = 3; // Only create new trail every 3 mouse moves
    
    // Throttle mouse move handler
    let lastMouseMoveTime = 0;
    const MOUSE_MOVE_THROTTLE = 16; // ~60fps
    
    function updateCursorPosition() {
        // Smooth follow with easing
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        
        requestAnimationFrame(updateCursorPosition);
    }
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseMoveTime < MOUSE_MOVE_THROTTLE) return;
        lastMouseMoveTime = now;
        
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Only create trail when moving fast and not too frequently
        calculateMouseSpeed();
        if (isMovingFast() && trailUpdateCounter++ % TRAIL_UPDATE_FREQUENCY === 0) {
            createTrailElement();
        }
    });
    
    function calculateMouseSpeed() {
        const now = Date.now();
        if (now - lastSpeedUpdateTime > 50) { // Update speed every 50ms
            speedX = mouseX - prevMouseX;
            speedY = mouseY - prevMouseY;
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            lastSpeedUpdateTime = now;
        }
    }
    
    function isMovingFast() {
        return Math.abs(speedX) + Math.abs(speedY) > 10;
    }
    
    function createTrailElement() {
        // Manage trail elements count - remove oldest if at max
        if (trailElements.length >= MAX_TRAIL_ELEMENTS) {
            if (trailElements[0] && trailElements[0].parentNode) {
                trailElements[0].parentNode.removeChild(trailElements[0]);
            }
            trailElements.shift();
        }
        
        const trail = document.createElement('div');
        trail.className = 'rainbow-cursor-trail';
        trail.style.left = `${mouseX}px`;
        trail.style.top = `${mouseY}px`;
        
        // Generate rainbow colors with less saturation and opacity
        const hue = Math.floor(Math.random() * 360);
        trail.style.backgroundColor = `hsla(${hue}, 80%, 60%, 0.6)`;
        
        document.body.appendChild(trail);
        trailElements.push(trail);
        
        // Remove the element after animation completes
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
            const index = trailElements.indexOf(trail);
            if (index > -1) {
                trailElements.splice(index, 1);
            }
        }, 800); // Match with CSS animation duration
    }
    
    // Start cursor positioning animation
    updateCursorPosition();
    
    // Handle cursor size change on click
    document.addEventListener('mousedown', () => {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(0.8)`;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) scale(0.6)`;
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(1)`;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) scale(1)`;
    });
}
*/

// Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
    // Comment out or remove the cursor effect initialization
    // initRainbowCursorEffect();
    
    // Other existing initialization code...
});

// Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let autoPlayInterval;
    let autoPlayEnabled = true;
    
    // Initialize gallery
    function initGallery() {
        // Set initial active slide
        updateGallery();
        
        // Add event listeners for prev button
        prevBtn.addEventListener('click', () => {
            pauseAutoPlay();
            showPrevSlide();
        });
        
        // Add event listeners for next button
        nextBtn.addEventListener('click', () => {
            pauseAutoPlay();
            showNextSlide();
        });
        
        // Add indicator click events
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                pauseAutoPlay();
                currentIndex = index;
                updateGallery();
            });
        });
        
        // Start auto play gallery
        startAutoPlay();
    }
    
    // Start auto play
    function startAutoPlay() {
        if (autoPlayEnabled) {
            autoPlayInterval = setInterval(showNextSlide, 1500);
        }
    }
    
    // Pause auto play
    function pauseAutoPlay() {
        autoPlayEnabled = false;
        clearInterval(autoPlayInterval);
    }
    
    // Update gallery state with fade transition
    function updateGallery() {
        // Reset all items
        galleryItems.forEach((item) => {
            // Remove active class to initiate fade out
            item.classList.remove('active', 'previous');
            
            // Update styling for fade effect
            item.style.opacity = '0';
            item.style.left = '0';
            item.style.transition = 'opacity 0.6s ease';
        });
        
        // Set active item with fade in
        galleryItems[currentIndex].style.opacity = '1';
        galleryItems[currentIndex].classList.add('active');
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Show previous slide
    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateGallery();
    }
    
    // Show next slide
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateGallery();
    }
    
    // Initialize when DOM is loaded
    if (galleryItems.length > 0) {
        initGallery();
    }
});
