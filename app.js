// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initVisitorCounter();
    initSmoothScrolling();
    initScrollToTop();
    initNavbarEffects();
    initMobileMenu();
    initResumeDownload();
    initScrollAnimations();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = html.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        html.setAttribute('data-color-scheme', theme);
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// Visitor Counter
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitorCount');
    
    // Get current visitor count from localStorage
    let visitorCount = parseInt(localStorage.getItem('visitorCount')) || 0;
    
    // Check if this is a new session
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    
    // If no last visit or more than 1 hour has passed, count as new visitor
    if (!lastVisit || (currentTime - parseInt(lastVisit)) > oneHour) {
        visitorCount++;
        localStorage.setItem('visitorCount', visitorCount.toString());
        localStorage.setItem('lastVisit', currentTime.toString());
    }
    
    // Update the display with animation
    animateCounter(visitorCountElement, visitorCount);
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const offsetTop = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const hamburger = document.getElementById('navHamburger');
                if (navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    hamburger.querySelector('i').className = 'fas fa-bars';
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavLinkOnScroll, 100));
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    
    let currentSection = '';
    const scrollPosition = window.scrollY + navbarHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }, 100));
    
    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navbar Effects on Scroll
function initNavbarEffects() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', throttle(function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(var(--color-surface-rgb, 252, 252, 249), 0.98)';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.background = 'rgba(var(--color-surface-rgb, 252, 252, 249), 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll (only on mobile)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    }, 50));
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.getElementById('navHamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        navMenu.classList.toggle('show');
        
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('show');
            hamburger.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// Resume Download
function initResumeDownload() {
    const downloadBtn = document.getElementById('downloadResume');
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create resume content
        const resumeContent = generateResumeContent();
        
        // Create and download PDF-like content as HTML
        const blob = new Blob([resumeContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Jagadish_Bollu_Resume.html';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show download feedback
        showDownloadFeedback();
    });
}

function generateResumeContent() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jagadish Bollu - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2c5aa0; padding-bottom: 20px; }
        .header h1 { color: #2c5aa0; margin-bottom: 10px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 5px; margin-bottom: 15px; }
        .contact-info { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 15px; }
        .contact-info span { background: #f0f0f0; padding: 8px 12px; border-radius: 20px; font-size: 14px; }
        .education-item, .project-item { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
        .education-item strong, .project-item strong { color: #2c5aa0; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-tag { background: #2c5aa0; color: white; padding: 8px 15px; border-radius: 20px; font-size: 14px; font-weight: 500; }
        .grade { color: #28a745; font-weight: bold; }
        @media print { body { margin: 0; font-size: 12px; } .header { page-break-after: avoid; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>JAGADISH BOLLU</h1>
        <h3 style="color: #666; margin: 5px 0;">Full Stack Developer & Data Science</h3>
        <div class="contact-info">
            <span>📧 jagadishbollu225@gmail.com</span>
            <span>📱 +91-9347436745</span>
            <span>📍 Bhadradri Kothagudem, Telangana</span>
            <span>🔗 LinkedIn: linkedin.com/bollu-jagadish-a25264220</span>
        </div>
    </div>

    <div class="section">
        <h2>PROFESSIONAL SUMMARY</h2>
        <p>Motivated and results-oriented MCA graduate with a strong foundation in computer science and a passion for software development. Proficient in Java, Python, and SQL with hands-on experience in cutting-edge technologies like deepfake detection. Currently pursuing advanced studies in Data Science while seeking opportunities to contribute to innovative projects and dynamic teams.</p>
    </div>

    <div class="section">
        <h2>EDUCATION</h2>
        <div class="education-item">
            <strong>Master of Computer Applications (MCA)</strong><br>
            University College KAKATIYA UNIVERSITY, Hanmakonda, Telangana<br>
            <em>Duration: 2023-2025</em> | <span class="grade">CGPA: 75%</span>
        </div>
        <div class="education-item">
            <strong>Bachelor's Degree: MPCS</strong><br>
            SR&BGNR ARTS AND SCIENCE COLLEGE, AUTONOMOUS, Khammam, Telangana<br>
            <em>Duration: 2019-2022</em> | <span class="grade">CGPA: 9.45</span>
        </div>
        <div class="education-item">
            <strong>Intermediate: MPC</strong><br>
            Sri vidya techno junior college, E.Bayyaram, BhadradriKothagudem<br>
            <em>Duration: 2017-2019</em> | <span class="grade">Percentage: 92.7%</span>
        </div>
        <div class="education-item">
            <strong>Secondary Education</strong><br>
            ZPSS HIGH SCHOOL, Janampeta, BhadradriKothagudem<br>
            <em>Duration: 2016-2017</em> | <span class="grade">Percentage: 82%</span>
        </div>
    </div>

    <div class="section">
        <h2>TECHNICAL SKILLS</h2>
        <p><strong>Programming Languages:</strong></p>
        <div class="skills">
            <span class="skill-tag">Python</span>
            <span class="skill-tag">Java</span>
            <span class="skill-tag">JavaScript</span>
        </div>
        <br>
        <p><strong>Web Technologies:</strong></p>
        <div class="skills">
            <span class="skill-tag">HTML</span>
            <span class="skill-tag">CSS</span>
            <span class="skill-tag">JavaScript</span>
        </div>
        <br>
        <p><strong>Tools & Software:</strong></p>
        <div class="skills">
            <span class="skill-tag">MS Word</span>
            <span class="skill-tag">MS Excel</span>
        </div>
        <br>
        <p><strong>Currently Learning:</strong></p>
        <div class="skills">
            <span class="skill-tag">Data Science</span>
            <span class="skill-tag">Machine Learning</span>
            <span class="skill-tag">Deep Learning</span>
        </div>
    </div>

    <div class="section">
        <h2>FEATURED PROJECT</h2>
        <div class="project-item">
            <strong>Deepfake Video Detection</strong> <em>(Academic Project)</em><br><br>
            <p>Advanced machine learning project focused on detecting deepfake videos using deep learning techniques. Implemented CNN and LSTM models to analyze video frames and identify artificially generated content with high accuracy.</p>
            <p><strong>Key Achievements:</strong></p>
            <ul>
                <li>Implemented state-of-the-art CNN architecture for video frame analysis</li>
                <li>Utilized LSTM networks for temporal pattern recognition</li>
                <li>Achieved high detection accuracy in identifying synthetic content</li>
            </ul>
            <p><strong>Technologies Used:</strong> Python, Deep Learning, CNN, LSTM, Computer Vision</p>
        </div>
    </div>

    <div class="section">
        <h2>CERTIFICATIONS</h2>
        <div style="padding: 15px; background: #f9f9f9; border-radius: 8px;">
            <strong>Online Soft Skills Training</strong><br>
            <em>INFOSYS BPM LTD for Telangana Academy For Skills and Knowledge (TASK)</em><br>
            <span style="color: #28a745; font-weight: bold;">Certificate of Participation</span>
        </div>
    </div>

    <div class="section">
        <h2>INTERPERSONAL SKILLS</h2>
        <div class="skills">
            <span class="skill-tag">Leadership</span>
            <span class="skill-tag">Problem Solving</span>
            <span class="skill-tag">Analytical Skills</span>
            <span class="skill-tag">Quick Learning & Adaptation</span>
        </div>
    </div>

    <div class="section">
        <h2>CAREER OBJECTIVE</h2>
        <p>Seeking an entry-level position in software development or data science where I can utilize my technical skills, contribute to innovative projects, and grow within a dynamic team environment. Eager to apply my knowledge of machine learning and web development to solve real-world problems and make a significant impact in the IT industry.</p>
    </div>
</body>
</html>`;
}

function showDownloadFeedback() {
    const btn = document.getElementById('downloadResume');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    btn.style.background = 'var(--color-success)';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'var(--color-primary)';
        btn.disabled = false;
    }, 2000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .cert-card, .contact-item');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Performance optimization - throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', throttle(function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.getElementById('navHamburger');
    
    if (window.innerWidth > 768 && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        hamburger.querySelector('i').className = 'fas fa-bars';
    }
}, 250));