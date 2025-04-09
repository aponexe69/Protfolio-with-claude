// Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.floating-element, .floating-3d-element');
    parallaxElements.forEach(el => {
        const speed = 0.5;
        const rect = el.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        
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

// Three.js 3D Background
const initThreeBackground = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('.hero').appendChild(renderer.domElement);
    
    // Create particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < 5000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x64ffda,
        size: 2,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    camera.position.z = 1000;
    
    // Animation
    const animate = () => {
        requestAnimationFrame(animate);
        
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Initialize Three.js background when the page loads
window.addEventListener('load', initThreeBackground);

// Form Submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Thank you for your message! I will get back to you soon.');
}); 
