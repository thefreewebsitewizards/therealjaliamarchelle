// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const navbar = document.querySelector('.navbar');

// Toggle mobile menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Event listeners
hamburger.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', toggleMobileMenu);

// Close menu when clicking on nav links
navMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        // Close the mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        // Ensure scrollbar is restored
        document.body.style.overflow = 'auto';
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Close menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        // Ensure scrollbar is restored
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.program-card, .week-card, .section-title').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// Button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Payment System Functionality
function initializePaymentSystem() {
    const serviceOptions = document.querySelectorAll('.service-option');
    const serviceRadios = document.querySelectorAll('input[name="service"]');
    const paymentForm = document.getElementById('payment-form');
    const submitButton = document.querySelector('.payment-submit');
    const selectedServiceDisplay = document.querySelector('.service-name-display');
    const totalPriceDisplay = document.querySelector('.total-price');
    
    // Service selection handling
    serviceOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            serviceOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Check the radio button
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                updateOrderSummary(radio.value);
            }
        });
    });
    
    // Radio button change handling
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateOrderSummary(radio.value);
            
            // Update visual selection
            serviceOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.querySelector('input[type="radio"]') === radio) {
                    option.classList.add('selected');
                }
            });
        });
    });
    
    // Form validation and submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validatePaymentForm()) {
                processPayment();
            }
        });
    }
    
    // Real-time form validation
    const formInputs = document.querySelectorAll('.payment-form input');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Initialize with first service if available
    const firstRadio = document.querySelector('input[name="service"]');
    if (firstRadio) {
        firstRadio.checked = true;
        updateOrderSummary(firstRadio.value);
        firstRadio.closest('.service-option').classList.add('selected');
    }
}

function updateOrderSummary(serviceValue) {
    const serviceData = {
        'consultation': { name: 'Free Consultation', price: 'Free', amount: 0 },
        'coaching-package': { name: '6-Week Coaching Package', price: '$487', amount: 487 },
        'single-session': { name: '1-Hour Session', price: '$75', amount: 75 }
    };
    
    const selectedServiceDisplay = document.querySelector('.service-name-display');
    const totalPriceDisplay = document.querySelector('.total-price');
    const submitButton = document.querySelector('.payment-submit');
    
    if (serviceData[serviceValue] && selectedServiceDisplay && totalPriceDisplay) {
        selectedServiceDisplay.textContent = serviceData[serviceValue].name;
        totalPriceDisplay.textContent = serviceData[serviceValue].price;
        
        // Enable submit button when service is selected
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        }
        
        // Store selected service data for payment processing
        window.selectedService = {
            type: serviceValue,
            name: serviceData[serviceValue].name,
            price: serviceData[serviceValue].price,
            amount: serviceData[serviceValue].amount
        };
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        isValid = phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    }
    
    // Credit card validation
    if (field.name === 'cardNumber' && value) {
        const cardRegex = /^[\d\s]+$/;
        const cleanCard = value.replace(/\s/g, '');
        isValid = cardRegex.test(value) && cleanCard.length >= 13 && cleanCard.length <= 19;
    }
    
    // Expiry date validation
    if (field.name === 'expiryDate' && value) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        isValid = expiryRegex.test(value);
    }
    
    // CVV validation
    if (field.name === 'cvv' && value) {
        const cvvRegex = /^\d{3,4}$/;
        isValid = cvvRegex.test(value);
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('error');
    } else {
        field.classList.add('error');
    }
    
    return isValid;
}

function validatePaymentForm() {
    const requiredFields = document.querySelectorAll('.payment-form input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check if a service is selected
    const selectedService = document.querySelector('input[name="service"]:checked');
    if (!selectedService) {
        isValid = false;
        showNotification('Please select a service.', 'error');
    }
    
    return isValid;
}

function processPayment() {
    const submitButton = document.querySelector('.payment-submit');
    const originalText = submitButton.innerHTML;
    
    // Get selected payment method
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'credit-card';
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success with correct payment method
        showPaymentSuccess(selectedMethod);
    }, 3000);
}

function showPaymentSuccess(paymentMethod = 'credit-card') {
    const paymentForm = document.querySelector('.payment-form');
    const successMessage = document.querySelector('.payment-success');
    
    if (paymentForm && successMessage) {
        // Update success message with service and payment details
        const successContent = successMessage.querySelector('p');
        if (successContent && window.selectedService) {
            const methodName = getPaymentMethodName(paymentMethod);
            successContent.innerHTML = `
                Thank you for purchasing <strong>${window.selectedService.name}</strong> for <strong>${window.selectedService.price}</strong>.<br>
                Payment processed via <strong>${methodName}</strong>.<br>
                You will receive a confirmation email shortly with next steps.
            `;
        }
        
        paymentForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Start countdown timer
        let countdown = 10;
        const countdownElement = document.getElementById('countdown-seconds');
        if (countdownElement) {
            countdownElement.textContent = countdown;
            
            const countdownInterval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);
        }
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset form after 10 seconds
        setTimeout(() => {
            paymentForm.style.display = 'block';
            successMessage.style.display = 'none';
            paymentForm.reset();
            
            // Reset countdown timer
            const countdownElement = document.getElementById('countdown-seconds');
            if (countdownElement) {
                countdownElement.textContent = '10';
            }
            
            // Reset service selection
            const firstRadio = document.querySelector('input[name="service"]');
            if (firstRadio) {
                firstRadio.checked = true;
                updateOrderSummary(firstRadio.value);
                document.querySelectorAll('.service-option').forEach(opt => opt.classList.remove('selected'));
                firstRadio.closest('.service-option').classList.add('selected');
            }
            
            // Reset payment method selection
            const firstPaymentMethod = document.querySelector('input[name="paymentMethod"]');
            if (firstPaymentMethod) {
                firstPaymentMethod.checked = true;
                const event = new Event('change');
                firstPaymentMethod.dispatchEvent(event);
            }
        }, 10000);
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.payment-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `payment-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <div class="notification-duration-indicator">
            <div class="notification-duration-bar"></div>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        overflow: hidden;
    `;
    
    document.body.appendChild(notification);
    
    // Start duration indicator animation
    const notificationDurationBar = notification.querySelector('.notification-duration-bar');
    if (notificationDurationBar) {
        setTimeout(() => {
            notificationDurationBar.style.transition = 'width 5s linear';
            notificationDurationBar.style.width = '0%';
        }, 100); // Small delay to ensure element is rendered
    }
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}


// Tab Functionality
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
            
            // Smooth scroll to tab content
            const tabContent = document.querySelector('.tab-content');
            if (tabContent) {
                tabContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize tabs when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializePaymentSystem();
    initializePricingButtons();
    
    // Initialize payment methods
    initializePaymentMethods();
});

// Pricing Buttons Functionality
function initializePricingButtons() {
    const pricingButtons = document.querySelectorAll('.pricing-action .btn');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get service data from button
            const serviceType = button.getAttribute('data-service') || getServiceFromButton(button);
            const servicePrice = button.getAttribute('data-price') || getPriceFromButton(button);
            
            // Switch to payment tab
            const paymentTab = document.querySelector('[data-tab="payment"]');
            if (paymentTab) {
                paymentTab.click();
                
                // Pre-select the service in payment form
                setTimeout(() => {
                    preselectService(serviceType);
                    
                    // Scroll to payment section
                    const paymentSection = document.getElementById('payment');
                    if (paymentSection) {
                        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
            
            // Add visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
        
        // Enhanced hover effects
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 8px 25px rgba(235, 150, 171, 0.3)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '';
        });
    });
}

function getServiceFromButton(button) {
    const card = button.closest('.pricing-card');
    if (card.classList.contains('consultation')) return 'consultation';
    if (card.classList.contains('premium') || card.classList.contains('coaching-package')) return 'coaching-package';
    if (card.classList.contains('single-session')) return 'single-session';
    return 'consultation';
}

function getPriceFromButton(button) {
    const priceElement = button.closest('.pricing-card').querySelector('.price-amount');
    if (priceElement) {
        const priceText = priceElement.textContent;
        return priceText.replace(/[^0-9]/g, '') || '0';
    }
    return '0';
}

function preselectService(serviceType) {
    // Direct mapping to match HTML radio button values exactly
    let targetValue = serviceType;
    
    // Handle legacy mappings if needed
    if (serviceType === 'package') targetValue = 'coaching-package';
    if (serviceType === 'session') targetValue = 'single-session';
    
    const radioButton = document.querySelector(`input[name="service"][value="${targetValue}"]`);
    
    if (radioButton) {
        // Clear all selections first
        document.querySelectorAll('input[name="service"]').forEach(radio => {
            radio.checked = false;
        });
        document.querySelectorAll('.service-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select the target service
        radioButton.checked = true;
        radioButton.dispatchEvent(new Event('change'));
        
        // Update visual selection
        const serviceOption = radioButton.closest('.service-option');
        if (serviceOption) {
            serviceOption.classList.add('selected');
        }
    }
}

// Update existing observer to include new tab elements
const tabObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe tab elements for animation
document.querySelectorAll('.overview-card, .tab-btn').forEach(el => {
    el.style.animationPlayState = 'paused';
    tabObserver.observe(el);
});

// Add this to your existing script.js file

// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

// Auto-play carousel
let autoPlayInterval;

function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    showSlide(currentSlideIndex);
    resetAutoPlay();
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
    resetAutoPlay();
}

function autoPlay() {
    currentSlideIndex++;
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    }
    showSlide(currentSlideIndex);
}

function startAutoPlay() {
    autoPlayInterval = setInterval(autoPlay, 4000); // Change slide every 4 seconds
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (slides.length > 0) {
        showSlide(0);
        startAutoPlay();
        
        // Pause auto-play on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
        }
    }
});

function bringToFront(clickedImage) {
    // Remove clicked class from all images
    document.querySelectorAll('.hero-image').forEach(img => {
        img.classList.remove('clicked');
    });
    
    // Add clicked class to the clicked image
    clickedImage.classList.add('clicked');
    
    // Remove the class after 2 seconds to return to normal state
    setTimeout(() => {
        clickedImage.classList.remove('clicked');
    }, 2000);
}

// Payment Method Selection Functions
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentForms = {
        'credit-card': document.getElementById('credit-card-form'),
        'paypal': document.getElementById('paypal-form'),
        'apple-pay': document.getElementById('apple-pay-form'),
        'google-pay': document.getElementById('google-pay-form')
    };
    
    // Add event listeners to payment method radio buttons
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.checked) {
                switchPaymentForm(this.value, paymentForms);
                updatePaymentMethodSelection(this.value);
            }
        });
    });
    
    // Initialize with credit card form visible
    switchPaymentForm('credit-card', paymentForms);
    
    // Add form validation for different payment methods
    initializePaymentValidation();
    
    // Add simulated payment processing
    initializePaymentProcessing();
}

function switchPaymentForm(selectedMethod, paymentForms) {
    // Hide all payment forms
    Object.values(paymentForms).forEach(form => {
        if (form) {
            form.style.display = 'none';
        }
    });
    
    // Show selected payment form
    if (paymentForms[selectedMethod]) {
        paymentForms[selectedMethod].style.display = 'block';
    }
    
    // Update form validation requirements
    updateFormValidation(selectedMethod);
}

function updatePaymentMethodSelection(selectedMethod) {
    const paymentMethodCards = document.querySelectorAll('.payment-method');
    
    paymentMethodCards.forEach(card => {
        const method = card.getAttribute('data-method');
        if (method === selectedMethod) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function updateFormValidation(selectedMethod) {
    const creditCardFields = document.querySelectorAll('#credit-card-form input[required]');
    
    // Remove required attribute from all credit card fields
    creditCardFields.forEach(field => {
        if (selectedMethod !== 'credit-card') {
            field.removeAttribute('required');
        } else {
            field.setAttribute('required', 'required');
        }
    });
}

function initializePaymentValidation() {
    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
            e.target.value = formattedValue;
            
            // Update card type icons
            updateCardTypeDisplay(value);
        });
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
}

function updateCardTypeDisplay(cardNumber) {
    const cardIcons = document.querySelectorAll('.card-icons i');
    
    // Reset all icons
    cardIcons.forEach(icon => {
        icon.style.opacity = '0.3';
    });
    
    // Detect card type and highlight appropriate icon
    if (cardNumber.startsWith('4')) {
        // Visa
        const visaIcon = document.querySelector('.fa-cc-visa');
        if (visaIcon) visaIcon.style.opacity = '1';
    } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
        // Mastercard
        const mastercardIcon = document.querySelector('.fa-cc-mastercard');
        if (mastercardIcon) mastercardIcon.style.opacity = '1';
    } else if (cardNumber.startsWith('3')) {
        // American Express
        const amexIcon = document.querySelector('.fa-cc-amex');
        if (amexIcon) amexIcon.style.opacity = '1';
    } else if (cardNumber.startsWith('6')) {
        // Discover
        const discoverIcon = document.querySelector('.fa-cc-discover');
        if (discoverIcon) discoverIcon.style.opacity = '1';
    }
}

function initializePaymentProcessing() {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
            
            if (selectedMethod) {
                simulatePaymentProcessing(selectedMethod);
            }
        });
    }
}

function simulatePaymentProcessing(paymentMethod) {
    const submitButton = document.querySelector('.payment-submit');
    const originalText = submitButton.innerHTML;
    
    // Show processing state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate different processing times for different methods
    let processingTime = 2000; // Default 2 seconds
    
    switch(paymentMethod) {
        case 'paypal':
            processingTime = 1500;
            break;
        case 'apple-pay':
        case 'google-pay':
            processingTime = 1000;
            break;
        default:
            processingTime = 2500;
    }
    
    setTimeout(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Show success message with service details
        showPaymentSuccess(paymentMethod);
        
        // Show notification
        showNotification(`Payment processed successfully via ${getPaymentMethodName(paymentMethod)}!`, 'success');
    }, processingTime);
}

function getPaymentMethodName(method) {
    const methodNames = {
        'credit-card': 'Credit Card',
        'paypal': 'PayPal',
        'apple-pay': 'Apple Pay',
        'google-pay': 'Google Pay'
    };
    return methodNames[method] || 'Unknown Method';
}

function resetPaymentForm() {
    const paymentForm = document.querySelector('.payment-form');
    const successMessage = document.querySelector('.payment-success');
    
    if (paymentForm && successMessage) {
        paymentForm.style.display = 'block';
        successMessage.style.display = 'none';
        paymentForm.reset();
        
        // Reset countdown timer
        const countdownElement = document.getElementById('countdown-seconds');
        if (countdownElement) {
            countdownElement.textContent = '10';
        }
        
        // Reset service selection
        const firstRadio = document.querySelector('input[name="service"]');
        if (firstRadio) {
            firstRadio.checked = true;
            updateOrderSummary(firstRadio.value);
            document.querySelectorAll('.service-option').forEach(opt => opt.classList.remove('selected'));
            firstRadio.closest('.service-option').classList.add('selected');
        }
        
        // Reset payment method selection
        const firstPaymentMethod = document.querySelector('input[name="paymentMethod"]');
        if (firstPaymentMethod) {
            firstPaymentMethod.checked = true;
            const event = new Event('change');
            firstPaymentMethod.dispatchEvent(event);
        }
    }
}

// Modal functionality
function initializeModals() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close');
    
    // Function to open modal
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    };
    
    // Function to close modal
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    };
    
    // Close modal when clicking the X button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                const modalId = modal.id;
                closeModal(modalId);
            }
        });
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    const modalId = modal.id;
                    closeModal(modalId);
                }
            });
        }
    });
}

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeModals();
});