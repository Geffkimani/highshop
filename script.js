// Initialize Lucide Icons
lucide.createIcons();

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initAgeVerification();
    initCart();
    initQuiz();
    initMobileMenu();
    initCursorParticles();
    initAnimations();
    
    // Age verification - show on first visit
    const ageVerified = localStorage.getItem('novaBitesAgeVerified');
    if (!ageVerified) {
        setTimeout(() => {
            document.getElementById('age-modal').classList.remove('hidden');
        }, 1000);
    }
});

// Age Verification Functions
function initAgeVerification() {
    const confirmBtn = document.getElementById('confirm-age');
    const exitBtn = document.getElementById('exit-site');
    const ageModal = document.getElementById('age-modal');
    
    confirmBtn.addEventListener('click', function() {
        localStorage.setItem('novaBitesAgeVerified', 'true');
        ageModal.classList.add('hidden');
        
        // Gentle entrance animation for content
        document.body.classList.add('opacity-0');
        setTimeout(() => {
            document.body.classList.remove('opacity-0');
        }, 10);
    });
    
    exitBtn.addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });
}

// Cart Functions
function initCart() {
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartModal = document.getElementById('cart-modal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    let cart = JSON.parse(localStorage.getItem('novaBitesCart')) || [];
    
    // Update cart display
    function updateCartDisplay() {
        // Update count
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartSubtotal.textContent = '$0';
            return;
        }
        
        emptyCartMessage.classList.add('hidden');
        
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'flex justify-between items-center py-4 border-b border-white border-opacity-10';
            cartItem.innerHTML = `
                <div>
                    <h4 class="font-bold space-font">${item.name}</h4>
                    <p class="text-sm opacity-70">$${item.price} × ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <button class="decrease-quantity squishy-btn w-8 h-8 flex items-center justify-center rounded-full glass-effect" data-index="${index}">
                            <i data-lucide="minus" class="w-4 h-4"></i>
                        </button>
                        <span class="font-bold">${item.quantity}</span>
                        <button class="increase-quantity squishy-btn w-8 h-8 flex items-center justify-center rounded-full glass-effect" data-index="${index}">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <button class="remove-item squishy-btn text-psychedelic" data-index="${index}">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Update subtotal
        cartSubtotal.textContent = `$${subtotal}`;
        
        // Re-attach event listeners for new elements
        attachCartItemEvents();
    }
    
    // Attach events to cart items
    function attachCartItemEvents() {
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity++;
                saveCart();
                updateCartDisplay();
            });
        });
        
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                saveCart();
                updateCartDisplay();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                saveCart();
                updateCartDisplay();
            });
        });
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('novaBitesCart', JSON.stringify(cart));
    }
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.product;
            const productPrice = parseInt(this.dataset.price);
            
            // Check if product already in cart
            const existingIndex = cart.findIndex(item => item.name === productName);
            
            if (existingIndex >= 0) {
                cart[existingIndex].quantity++;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            saveCart();
            updateCartDisplay();
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.classList.add('bg-gummy');
            
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('bg-gummy');
            }, 1000);
        });
    });
    
    // Cart modal toggle
    cartBtn.addEventListener('click', function() {
        cartModal.classList.remove('hidden');
        setTimeout(() => {
            document.querySelector('#cart-modal > div:last-child').classList.remove('translate-x-full');
        }, 10);
    });
    
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    function closeCart() {
        document.querySelector('#cart-modal > div:last-child').classList.add('translate-x-full');
        setTimeout(() => {
            cartModal.classList.add('hidden');
        }, 300);
    }
    
    // Initial cart display
    updateCartDisplay();
}

// Quiz Functions
function initQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    const resultButton = document.getElementById('result-button');
    
    let quizAnswers = {
        vibe: '',
        type: ''
    };
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const nextStep = this.dataset.next;
            const answer = this.dataset.answer;
            
            // Determine which question was answered
            const currentStep = this.closest('.quiz-step');
            if (currentStep.id === 'quiz-step-1') {
                quizAnswers.vibe = answer;
            } else if (currentStep.id === 'quiz-step-2') {
                quizAnswers.type = answer;
            }
            
            // Hide current step
            currentStep.classList.add('hidden');
            
            // Show next step
            if (nextStep === 'result') {
                showQuizResult();
            } else {
                document.getElementById(`quiz-step-${nextStep}`).classList.remove('hidden');
            }
        });
    });
    
    function showQuizResult() {
        const resultContainer = document.getElementById('quiz-result');
        const productElement = document.getElementById('result-product');
        const descriptionElement = document.getElementById('result-description');
        
        // Determine product based on answers
        let product, description;
        
        if (quizAnswers.type === 'cookie') {
            if (quizAnswers.vibe === 'chill') {
                product = 'Galactic Chocolate Chip';
                description = 'Perfect for your chill cosmic vibe! These cookies will help you float through the universe with delicious chocolatey bliss.';
            } else if (quizAnswers.vibe === 'creative') {
                product = 'Nova Double Fudge';
                description = 'Ideal for creative expansion! The rich double chocolate will fuel your artistic journey through the cosmos.';
            } else if (quizAnswers.vibe === 'fun') {
                product = 'Cosmic Snickerdoodle';
                description = 'Great for fun times! These cinnamon-sugar cookies bring playful energy to any gathering.';
            } else {
                product = 'Zen Matcha Cookie';
                description = 'Perfect for focused mindfulness! The matcha provides clarity while the cookie satisfies.';
            }
        } else { // gummy
            if (quizAnswers.vibe === 'chill') {
                product = 'Strawberry Serenity Gummies';
                description = 'Perfect for your chill cosmic vibe! These strawberry gummies will help you unwind and float peacefully.';
            } else if (quizAnswers.vibe === 'creative') {
                product = 'Psychedelic Peach Rings';
                description = 'Ideal for creative expansion! The juicy peach flavor will inspire your intergalactic creations.';
            } else if (quizAnswers.vibe === 'fun') {
                product = 'Rainbow Blast Gummies';
                description = 'Great for fun times! Every color is a different flavor for a party in your mouth.';
            } else {
                product = 'Blueberry Focus Gummies';
                description = 'Perfect for focused mindfulness! Blueberry antioxidants meet clear-headed elevation.';
            }
        }
        
        productElement.textContent = product;
        descriptionElement.textContent = description;
        
        // Update result button to add the recommended product
        resultButton.dataset.product = product;
        resultButton.dataset.price = '32'; // Default price
        
        resultContainer.classList.remove('hidden');
        
        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Result button adds to cart
    resultButton.addEventListener('click', function() {
        const productName = this.dataset.product;
        const productPrice = parseInt(this.dataset.price);
        
        // Add to cart
        let cart = JSON.parse(localStorage.getItem('novaBitesCart')) || [];
        const existingIndex = cart.findIndex(item => item.name === productName);
        
        if (existingIndex >= 0) {
            cart[existingIndex].quantity++;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        localStorage.setItem('novaBitesCart', JSON.stringify(cart));
        
        // Update cart display
        const cartCount = document.getElementById('cart-count');
        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;
        
        // Visual feedback
        const originalText = this.textContent;
        this.textContent = 'Added to Cart!';
        this.classList.add('bg-gummy');
        
        setTimeout(() => {
            this.textContent = originalText;
            this.classList.remove('bg-gummy');
        }, 2000);
    });
}

// Mobile Menu Functions
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Change icon
        const icon = menuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            lucide.createIcons();
        } else {
            icon.setAttribute('data-lucide', 'x');
            lucide.createIcons();
        }
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            menuBtn.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });
}

// Cursor Particle Effects
function initCursorParticles() {
    const particlesContainer = document.getElementById('cursor-particles');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Create particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        
        // Random color from brand palette
        const colors = ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Starting position at cursor
        particle.style.left = `${mouseX}px`;
        particle.style.top = `${mouseY}px`;
        
        // Random velocity
        const velocity = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
        };
        
        // Add to DOM
        particlesContainer.appendChild(particle);
        
        particles.push({
            element: particle,
            velocity: velocity,
            life: 100 // frames
        });
        
        // Limit particles
        if (particles.length > 30) {
            const oldParticle = particles.shift();
            oldParticle.element.remove();
        }
    }
    
    // Animation loop
    function animateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            
            // Update position
            const currentLeft = parseFloat(particle.element.style.left);
            const currentTop = parseFloat(particle.element.style.top);
            
            particle.element.style.left = `${currentLeft + particle.velocity.x}px`;
            particle.element.style.top = `${currentTop + particle.velocity.y}px`;
            
            // Reduce life
            particle.life--;
            
            // Fade out
            particle.element.style.opacity = particle.life / 100;
            
            // Remove dead particles
            if (particle.life <= 0) {
                particle.element.remove();
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    // Create particles on mouse move (with throttle)
    let lastParticleTime = 0;
    document.addEventListener('mousemove', function() {
        const now = Date.now();
        if (now - lastParticleTime > 50) { // Throttle to 20 particles per second
            createParticle();
            lastParticleTime = now;
        }
    });
    
    // Start animation
    animateParticles();
}

// Animation Initialization
function initAnimations() {
    // Add animation classes to elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.product-card, .glass-effect').forEach(element => {
        observer.observe(element);
    });
    
    // Add CSS for fadeIn animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// View Labs button functionality
document.getElementById('view-labs').addEventListener('click', function() {
    // In a real implementation, this would show lab reports
    // For demo, we'll show a notification
    showNotification('Lab reports would open in a modal here. In a real implementation, these would be PDFs or an interactive component.', 'info');
});

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 glass-effect rounded-xl p-4 max-w-sm transform transition-transform translate-x-full`;
    
    // Add icon based on type
    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'alert-circle';
    
    notification.innerHTML = `
        <div class="flex items-start">
            <i data-lucide="${icon}" class="w-5 h-5 mr-3 flex-shrink-0 ${type === 'success' ? 'text-gummy' : type === 'error' ? 'text-psychedelic' : 'text-nova'}"></i>
            <p class="text-sm">${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}