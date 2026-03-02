// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.loadCart();
    }

    loadCart() {
        const savedCart = localStorage.getItem('luxeCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateTotal();
        }
    }

    saveCart() {
        localStorage.setItem('luxeCart', JSON.stringify(this.items));
        this.updateTotal();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartDisplay() {
        const cartCountElement = document.getElementById('cartCount');
        const cartItemsElement = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');

        if (cartCountElement) {
            cartCountElement.textContent = this.getCartCount();
        }

        if (cartItemsElement) {
            this.renderCartItems(cartItemsElement);
        }

        if (cartTotalElement) {
            cartTotalElement.textContent = `$${this.total.toLocaleString()}`;
        }
    }

    renderCartItems(container) {
        if (this.items.length === 0) {
            container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="cart.removeItem(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary);
            color: var(--white);
            padding: 15px 25px;
            border-radius: 4px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Render categories
    const categoryGrid = document.getElementById('categoryGrid');
    if (categoryGrid) {
        categoryGrid.innerHTML = categories.map(category => `
            <div class="category-card">
                <img src="${category.image}" alt="${category.name}">
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.count} products</p>
                </div>
            </div>
        `).join('');
    }

    // Render products
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-overlay">
                        <button class="quick-view" onclick="quickView(${product.id})">Quick View</button>
                    </div>
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category}</p>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price}</p>
                    <button class="add-to-cart" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Cart sidebar functionality
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('open');
            overlay.classList.add('active');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // Mobile menu
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');

    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            cart.showNotification(`Thank you for subscribing with ${email}!`);
            e.target.reset();
        });
    }

    // Search functionality (placeholder)
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            cart.showNotification('Search feature coming soon');
        });
    }

    // Account icon (placeholder)
    const accountIcon = document.querySelector('.account-icon');
    if (accountIcon) {
        accountIcon.addEventListener('click', () => {
            cart.showNotification('Account feature coming soon');
        });
    }
});

// Quick view function
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-grid">
                    <div class="modal-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="modal-info">
                        <p class="product-category">${product.category}</p>
                        <h2>${product.name}</h2>
                        <p class="product-price">$${product.price}</p>
                        <p class="product-description">${product.description}</p>
                        <button class="add-to-cart" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .quick-view-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            
            .modal-content {
                background: white;
                max-width: 900px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                padding: 40px;
            }
            
            .close-modal {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 24px;
                cursor: pointer;
            }
            
            .modal-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
            }
            
            .modal-image img {
                width: 100%;
                height: auto;
            }
            
            .modal-info h2 {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                margin: 10px 0;
            }
            
            .product-description {
                margin: 20px 0;
                line-height: 1.6;
                color: var(--light-text);
            }
            
            @media (max-width: 768px) {
                .modal-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            style.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                style.remove();
            }
        });
    }
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .empty-cart {
        text-align: center;
        color: var(--light-text);
        padding: 40px 0;
    }
`;

document.head.appendChild(style);
