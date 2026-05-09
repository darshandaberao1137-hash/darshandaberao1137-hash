// Cart Management
let cart = [];

// Load cart from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupEventListeners();
});

function loadCart() {
    const savedCart = localStorage.getItem('vichart-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function saveCart() {
    localStorage.setItem('vichart-cart', JSON.stringify(cart));
}

function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price,
        id: Date.now()
    });
    saveCart();
    updateCartCount();
    showToast(`✓ ${productName} added to cart!`);
    trackEvent('product_added', { product: productName, price: price });
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function printCart() {
    console.log('Shopping Cart:', cart);
    console.log('Total Items:', cart.length);
    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });
    console.log('Total Price: $' + total.toFixed(2));
}

// Toast Notifications
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Mobile Menu Toggle
function setupEventListeners() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name') || this.elements[0].value,
            email: formData.get('email') || this.elements[1].value,
            type: this.elements[3].value,
            message: this.elements[4].value
        };

        console.log('Contact Form Submitted:', data);
        showToast('✓ Thank you! We will contact you soon.');
        trackEvent('contact_form_submitted', { inquiry_type: data.type });
        
        // Reset form
        this.reset();
    });
}

// Newsletter Subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail');
    if (email && email.value) {
        console.log('Newsletter Subscription:', email.value);
        showToast('✓ Thanks for subscribing!');
        trackEvent('newsletter_subscribed', { email: email.value });
        email.value = '';
    }
}

// Analytics Event Tracking
function trackEvent(eventName, eventData = {}) {
    console.log('Event:', eventName, eventData);
    
    // Google Analytics placeholder
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Facebook Pixel placeholder
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}

// Scroll animations for product cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Add active link styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-green);
        border-bottom: 2px solid var(--primary-green);
    }
`;
document.head.appendChild(style);

// Cart icon click handler (could open cart modal)
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        printCart();
        showToast(`📦 You have ${cart.length} items in cart`);
        trackEvent('cart_opened');
    });
}

// Performance optimization: Lazy load images if needed
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('Vichart Website Loaded Successfully!');
console.log('Type printCart() to see cart contents');
