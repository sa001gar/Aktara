// Login page specific functionality
class AuthManager {
    constructor() {
        this.loginTab = document.getElementById('loginTab');
        this.signupTab = document.getElementById('signupTab');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        
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

    setupFormSubmissions() {
        // Login form submission
        const loginFormElement = this.loginForm?.querySelector('form');
        if (loginFormElement) {
            loginFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateLoginForm(e);
            });
        }

        // Signup form submission
        const signupFormElement = this.signupForm?.querySelector('form');
        if (signupFormElement) {
            signupFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateSignupForm(e);
            });
        }
    }

    validateLoginForm(event) {
        const form = event.target;
        const email = form.querySelector('#login-email')?.value;
        const password = form.querySelector('#login-password')?.value;

        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return false;
        }
        
        // Add more validation if needed
        return true;
    }

    validateSignupForm(event) {
        const form = event.target;
        const name = form.querySelector('#signup-name')?.value;
        const email = form.querySelector('#signup-email')?.value;
        const password = form.querySelector('#signup-password')?.value;
        const terms = form.querySelector('#terms')?.checked;

        if (!name || !email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return false;
        }

        if (!terms) {
            this.showMessage('Please accept the terms and conditions', 'error');
            return false;
        }
        
        // Add more validation if needed
        return true;
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        messageDiv.textContent = message;

        // Add to page
        document.body.appendChild(messageDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
