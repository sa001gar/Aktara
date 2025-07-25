// Login page specific functionality

// Login/Signup form management
class AuthManager {
    constructor() {
        this.loginTab = document.getElementById('loginTab');
        this.signupTab = document.getElementById('signupTab');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.passwordToggles = document.querySelectorAll('.password-toggle');
        
        this.init();
    }

    init() {
        // Set initial active tab
        this.setActiveTab('login');
        
        // Add event listeners
        if (this.loginTab) {
            this.loginTab.addEventListener('click', () => this.setActiveTab('login'));
        }
        
        if (this.signupTab) {
            this.signupTab.addEventListener('click', () => this.setActiveTab('signup'));
        }
        
        // Setup password toggles
        this.setupPasswordToggles();
        
        // Setup form submissions
        this.setupFormSubmissions();
    }

    setActiveTab(tab) {
        if (tab === 'login') {
            // Style login tab as active
            if (this.loginTab) {
                this.loginTab.classList.add('bg-aktara-red', 'text-white');
                this.loginTab.classList.remove('text-gray-700');
            }
            
            // Style signup tab as inactive
            if (this.signupTab) {
                this.signupTab.classList.remove('bg-aktara-red', 'text-white');
                this.signupTab.classList.add('text-gray-700');
            }
            
            // Show/hide forms
            if (this.loginForm) this.loginForm.classList.remove('hidden');
            if (this.signupForm) this.signupForm.classList.add('hidden');
        } else {
            // Style signup tab as active
            if (this.signupTab) {
                this.signupTab.classList.add('bg-aktara-red', 'text-white');
                this.signupTab.classList.remove('text-gray-700');
            }
            
            // Style login tab as inactive
            if (this.loginTab) {
                this.loginTab.classList.remove('bg-aktara-red', 'text-white');
                this.loginTab.classList.add('text-gray-700');
            }
            
            // Show/hide forms
            if (this.signupForm) this.signupForm.classList.remove('hidden');
            if (this.loginForm) this.loginForm.classList.add('hidden');
        }
    }

    setupPasswordToggles() {
        this.passwordToggles.forEach(button => {
            button.addEventListener('click', () => {
                const passwordInput = button.previousElementSibling;
                const eyeOpen = button.querySelector('.eye-open');
                const eyeClosed = button.querySelector('.eye-closed');
                
                if (passwordInput && eyeOpen && eyeClosed) {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        eyeOpen.classList.add('hidden');
                        eyeClosed.classList.remove('hidden');
                    } else {
                        passwordInput.type = 'password';
                        eyeOpen.classList.remove('hidden');
                        eyeClosed.classList.add('hidden');
                    }
                }
            });
        });
    }

    setupFormSubmissions() {
        // Login form submission
        const loginFormElement = this.loginForm?.querySelector('form');
        if (loginFormElement) {
            loginFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Signup form submission
        const signupFormElement = this.signupForm?.querySelector('form');
        if (signupFormElement) {
            signupFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(e);
            });
        }
    }

    async handleLogin(event) {
        const form = event.target;
        const email = form.querySelector('#login-email')?.value;
        const password = form.querySelector('#login-password')?.value;
        const rememberMe = form.querySelector('#remember-me')?.checked;
        const submitButton = form.querySelector('button[type="submit"]');

        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing In...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            const response = await this.callLoginAPI(email, password, rememberMe);
            
            if (response.success) {
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Store user data if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('userEmail', email);
                }
                
                // Redirect after success
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showMessage(response.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Login failed. Please try again.', 'error');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async handleSignup(event) {
        const form = event.target;
        const name = form.querySelector('#signup-name')?.value;
        const email = form.querySelector('#signup-email')?.value;
        const password = form.querySelector('#signup-password')?.value;
        const terms = form.querySelector('#terms')?.checked;
        const submitButton = form.querySelector('button[type="submit"]');

        if (!name || !email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!terms) {
            this.showMessage('Please accept the terms and conditions', 'error');
            return;
        }

        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            const response = await this.callSignupAPI(name, email, password);
            
            if (response.success) {
                this.showMessage('Account created successfully! Please sign in.', 'success');
                
                // Switch to login tab after successful signup
                setTimeout(() => {
                    this.setActiveTab('login');
                    // Pre-fill email in login form
                    const loginEmailInput = document.getElementById('login-email');
                    if (loginEmailInput) {
                        loginEmailInput.value = email;
                    }
                }, 1500);
            } else {
                this.showMessage(response.message || 'Signup failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage('Signup failed. Please try again.', 'error');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    // API call simulation for login
    async callLoginAPI(email, password, rememberMe) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate API response
        // In real implementation, you would make actual API call:
        /*
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, rememberMe })
        });
        return await response.json();
        */

        // Mock response for demo
        if (email === 'demo@aktara.com' && password === 'demo123') {
            return {
                success: true,
                message: 'Login successful',
                user: { email, name: 'Demo User' },
                token: 'mock-jwt-token'
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
    }

    // API call simulation for signup
    async callSignupAPI(name, email, password) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Simulate API response
        // In real implementation:
        /*
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        return await response.json();
        */

        // Mock response for demo
        if (email.includes('@')) {
            return {
                success: true,
                message: 'Account created successfully',
                user: { email, name }
            };
        } else {
            return {
                success: false,
                message: 'Invalid email format'
            };
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        messageDiv.textContent = message;

        // Add to page
        document.body.appendChild(messageDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize login page functionality
function initLoginPage() {
    console.log('Initializing login page...');
    
    // Initialize auth manager
    new AuthManager();
    
    // Pre-fill email if remembered
    const rememberedEmail = localStorage.getItem('userEmail');
    if (rememberedEmail) {
        const loginEmailInput = document.getElementById('login-email');
        if (loginEmailInput) {
            loginEmailInput.value = rememberedEmail;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initLoginPage);