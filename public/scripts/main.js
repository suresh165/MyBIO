// ==========================================
// MODERN PORTFOLIO - MAIN JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // CONTACT FORM POPUP MODAL
    // ==========================================
    const contactModal = document.getElementById('contactModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const contactFormModal = document.getElementById('contactFormModal');
    
    // Show modal on page load with delay
    function showContactModal() {
        // Check if user has seen the modal before (in this session)
        const hasSeenModal = sessionStorage.getItem('contactModalShown');
        
        if (!hasSeenModal) {
            setTimeout(() => {
                contactModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                sessionStorage.setItem('contactModalShown', 'true');
            }, 2000); // Show after 2 seconds
        }
    }
    
    // Close modal function
    function closeContactModal() {
        contactModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeContactModal);
    }
    
    // Close modal on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeContactModal);
    }
    
    // Close modal on Escape key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeContactModal();
        }
    });
    
    // Handle modal contact form submission
    if (contactFormModal) {
        contactFormModal.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get the submit button
            const submitBtn = contactFormModal.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            
            try {
                // Get form data
                const formData = new FormData(contactFormModal);
                const data = Object.fromEntries(formData);
                
                // Send to Google Sheets using analytics.js function
                if (typeof window.submitContactForm === 'function') {
                    await window.submitContactForm(data);
                }
                
                // Show success message in modal
                showModalSuccessMessage();
                
                // Reset form
                contactFormModal.reset();
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    closeContactModal();
                }, 3000);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                showModalErrorMessage();
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
    
    // Show success message in modal
    function showModalSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'form-message success-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for reaching out! I'll get back to you within 24 hours.</p>
                </div>
            </div>
        `;
        
        // Insert message at the top of modal body
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            // Remove any existing messages
            const existingMessages = modalBody.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());
            
            // Insert new message
            modalBody.insertBefore(message, modalBody.firstChild);
            
            // Scroll to message
            message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Show error message in modal
    function showModalErrorMessage() {
        const message = document.createElement('div');
        message.className = 'form-message error-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <h4>Something went wrong!</h4>
                    <p>Please try again or contact me directly at dineshkumar@example.com</p>
                </div>
            </div>
        `;
        
        // Insert message at the top of modal body
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            // Remove any existing messages
            const existingMessages = modalBody.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());
            
            // Insert new message
            modalBody.insertBefore(message, modalBody.firstChild);
            
            // Scroll to message
            message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Show modal on page load
    showContactModal();
    
    // Reopen modal with "Hire Me" button
    const openContactModalBtn = document.getElementById('openContactModal');
    if (openContactModalBtn) {
        openContactModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Reopen modal from Services section "Let's Work Together" button
    const openContactModalFromServicesBtn = document.getElementById('openContactModalFromServices');
    if (openContactModalFromServicesBtn) {
        openContactModalFromServicesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // ==========================================
    // GLASSY CURSOR EFFECT (Apple-style)
    // ==========================================
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);
    
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation for the glow
    function animateGlow() {
        // Smooth follow effect with easing
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
    // ==========================================
    // SMOOTH SCROLLING FOR NAVIGATION LINKS
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // ==========================================
    // HEADER SCROLL EFFECT
    // ==========================================
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ==========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
    
    // ==========================================
    // ACTIVE SECTION DETECTION
    // ==========================================
    const sectionsForNav = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sectionsForNav.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ==========================================
    // FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get the submit button
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            
            try {
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Send to Google Sheets using analytics.js function
                if (typeof window.submitContactForm === 'function') {
                    await window.submitContactForm(data);
                }
                
                // Show success message
                showSuccessMessage();
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                console.error('Error submitting form:', error);
                showErrorMessage();
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
    
    // Show success message
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'form-message success-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for reaching out! I'll get back to you within 24 hours.</p>
                </div>
            </div>
        `;
        
        // Insert message above the form
        const formWrapper = document.querySelector('.contact-form-wrapper');
        if (formWrapper) {
            // Remove any existing messages
            const existingMessages = formWrapper.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());
            
            // Insert new message
            formWrapper.insertBefore(message, formWrapper.firstChild);
            
            // Scroll to message
            message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-remove after 8 seconds
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 8000);
        }
    }
    
    // Show error message
    function showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'form-message error-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <h4>Something went wrong!</h4>
                    <p>Please try again or contact me directly at dineshkumar@example.com</p>
                </div>
            </div>
        `;
        
        // Insert message above the form
        const formWrapper = document.querySelector('.contact-form-wrapper');
        if (formWrapper) {
            // Remove any existing messages
            const existingMessages = formWrapper.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());
            
            // Insert new message
            formWrapper.insertBefore(message, formWrapper.firstChild);
            
            // Scroll to message
            message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-remove after 8 seconds
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 8000);
        }
    }
    
    // ==========================================
    // SKILL BARS ANIMATION
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
    
    // ==========================================
    // CONSOLE MESSAGE
    // ==========================================
    console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cLooking for a developer? Let\'s connect!', 'font-size: 14px; color: #8b5cf6;');
    console.log('%cTheme toggle is working!', 'font-size: 12px; color: #10b981;');
});
