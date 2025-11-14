// Registration Website JavaScript

// API Base URL - support localhost and deployed Render public host
// Explicit Render public host constant (used as an explicit link/override)
const RENDER_URL = 'https://phone-4hza.onrender.com';
// Expose to window for debugging or other scripts that may read it
window.RENDER_URL = RENDER_URL;

const API_BASE_URL = (() => {
    // If we have an injected RENDER_API_URL from the server, use it
    if (window.RENDER_API_URL) {
        return window.RENDER_API_URL;
    }
    const hostname = window.location.hostname || '';
    // For localhost dev, use Render URL instead of localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'https://phone-4hza.onrender.com';
    }
    // If the site is hosted on Render or you're accessing a Render preview,
    // point API calls explicitly to the public Render service.
    if (hostname.includes('onrender.com') || hostname === 'phone-4hza.onrender.com') {
        return 'https://phone-4hza.onrender.com';
    }

    // For any deployed host (GitHub Pages, Netlify, etc.) use the Render backend.
    // This avoids attempting to call non-existent /api routes on static hosts.
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return 'https://phone-4hza.onrender.com';
    }

    // Default: use same origin (localhost)
    return window.location.origin;
})();

// Supabase Configuration
const SUPABASE_URL = 'https://trcbyqdfgnlaesixhorz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyY2J5cWRmZ25sYWVzaXhob3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTU0ODEsImV4cCI6MjA3ODM3MTQ4MX0.SHMr2WS1-q0zDX5p51MMqiO4Dfz1ZZwVjbNTkMiEUsc';

// Initialize Supabase client
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Registration page initialized with API_BASE_URL:', API_BASE_URL);
console.log('Supabase client:', supabaseClient ? 'Connected' : 'Not available');

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Initialize intl-tel-input for international phone support
let iti = null;
function initIntlTelInput() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput || typeof window.intlTelInput !== 'function') return;

    iti = window.intlTelInput(phoneInput, {
        initialCountry: 'auto',
        preferredCountries: ['us', 'gb', 'ng'],
        separateDialCode: false,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
    });
}

// Ensure intl-tel-input is initialized after DOM and the library is loaded
document.addEventListener('DOMContentLoaded', () => {
    // If the library hasn't loaded yet, try again shortly
    if (typeof window.intlTelInput !== 'function') {
        setTimeout(initIntlTelInput, 300);
    } else {
        initIntlTelInput();
    }
});

// Setup Event Listeners
function setupEventListeners() {
    const form = document.getElementById('registrationForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', handleFormSubmit);
    passwordToggle.addEventListener('click', togglePasswordVisibility);
    confirmPasswordToggle.addEventListener('click', toggleConfirmPasswordVisibility);
    passwordInput.addEventListener('input', checkPasswordStrength);

    // Real-time validation
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('blur', validatePassword);
    document.getElementById('confirmPassword').addEventListener('blur', validatePasswordMatch);
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggle = document.getElementById('passwordToggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggle = document.getElementById('confirmPasswordToggle');

    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        confirmPasswordInput.type = 'password';
        toggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Password Strength Checker
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    let strength = 'weak';
    let color = '#f44336';

    if (password.length >= 8) {
        let hasUpperCase = /[A-Z]/.test(password);
        let hasLowerCase = /[a-z]/.test(password);
        let hasNumbers = /\d/.test(password);
        let hasSpecialChar = /[!@#$%^&*]/.test(password);

        let strengthCount = 0;
        if (hasUpperCase) strengthCount++;
        if (hasLowerCase) strengthCount++;
        if (hasNumbers) strengthCount++;
        if (hasSpecialChar) strengthCount++;

        if (strengthCount >= 3) {
            strength = 'strong';
            color = '#4caf50';
        } else if (strengthCount >= 2) {
            strength = 'fair';
            color = '#ff9800';
        }
    }

    strengthBar.className = 'strength-bar ' + strength;
    strengthText.textContent = 'Password strength: ' + strength.charAt(0).toUpperCase() + strength.slice(1);
}

// Validate Email
function validateEmail() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('emailError');
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        return false;
    } else {
        emailError.classList.remove('show');
        emailInput.classList.remove('error');
        return true;
    }
}

// Validate Password
function validatePassword() {
    const password = document.getElementById('password').value;
    const passwordError = document.getElementById('passwordError');
    const passwordInput = document.getElementById('password');

    if (password.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters long';
        passwordError.classList.add('show');
        passwordInput.classList.add('error');
        return false;
    } else {
        passwordError.classList.remove('show');
        passwordInput.classList.remove('error');
        return true;
    }
}

// Validate Password Match
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        confirmPasswordError.classList.add('show');
        confirmPasswordInput.classList.add('error');
        return false;
    } else {
        confirmPasswordError.classList.remove('show');
        confirmPasswordInput.classList.remove('error');
        return true;
    }
}

// Validate Phone Number
function validatePhoneNumber(phone) {
    // If intl-tel-input is present, we'll accept any non-empty input since
    // the widget provides country selection and optional E.164 formatting.
    if (typeof iti === 'object' && iti !== null) {
        return !!(phone && phone.trim().length > 0);
    }
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
}

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();

    // Clear previous messages
    document.getElementById('errorMessage').classList.remove('show');
    document.getElementById('successMessage').classList.remove('show');

    // Validate all fields
    if (!validateForm()) {
        return;
    }

    // Get form data. Prefer E.164 if intl-tel-input can provide it; otherwise accept user input.
    let phoneValue = document.getElementById('phone').value.trim();
    if (iti && typeof iti.getNumber === 'function') {
        try {
            const e164 = iti.getNumber();
            if (e164 && e164.trim().length > 0) {
                phoneValue = e164;
            }
        } catch (e) {
            // ignore and use raw input
        }
    }

    // Build formData
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: phoneValue,
        password: document.getElementById('password').value,
        userType: document.getElementById('userType').value,
        organization: document.getElementById('organization').value.trim(),
        newsletter: document.getElementById('newsletter').checked,
        createdAt: new Date().toISOString()
    };

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('spinner');
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    spinner.classList.remove('hidden');

    try {
        // Try to save to Supabase first
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('users')
                .insert([{
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    user_type: formData.userType,
                    organization: formData.organization,
                    newsletter_subscribed: formData.newsletter,
                    created_at: formData.createdAt
                }]);

            if (error) {
                console.warn('Supabase insert error:', error.message || error);
                const msg = (error.message || '').toString();
                if (/duplicate|unique|already exists|users_email_key/i.test(msg) || (error.code && error.code === '23505')) {
                    showError('An account with that email already exists. Please login or use a different email.');
                    return;
                }
                await registerViaAPI(formData);
            } else {
                // Save registration fields to sessionStorage for the thank-you page
                try{
                    sessionStorage.setItem('firstName', formData.firstName || '');
                    sessionStorage.setItem('lastName', formData.lastName || '');
                    sessionStorage.setItem('email', formData.email || '');
                    sessionStorage.setItem('phone', formData.phone || '');
                    sessionStorage.setItem('userType', formData.userType || '');
                    sessionStorage.setItem('organization', formData.organization || '');
                    sessionStorage.setItem('registrantName', (formData.firstName || '') + (formData.lastName ? ' ' + formData.lastName : ''));
                }catch(e){/* ignore storage errors */}
                showSuccess('Registration successful! Redirecting to your dashboard...');
                setTimeout(() => {
                    window.location.href = 'thanks.html';
                }, 2000);
            }
        } else {
            // Fallback to API endpoint if Supabase not available
            await registerViaAPI(formData);
        }
    } catch (err) {
        console.error('Registration error:', err);
        showError('An error occurred during registration. Please try again.');
    } finally {
        // Reset loading state
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
}

// Register via API Endpoint
async function registerViaAPI(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const text = await response.text().catch(() => '');
            console.error('API response body:', text);
            showError(`Server error: ${response.status}. Please try again.`);
            return;
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Unexpected non-JSON response from API:', text);
            showError('Server returned an unexpected response. Please try again.');
            return;
        }

        const data = await response.json();

        if (data && data.success) {
            // Save registration fields to sessionStorage for the thank-you page
            try{
                sessionStorage.setItem('firstName', formData.firstName || '');
                sessionStorage.setItem('lastName', formData.lastName || '');
                sessionStorage.setItem('email', formData.email || '');
                sessionStorage.setItem('phone', formData.phone || '');
                sessionStorage.setItem('userType', formData.userType || '');
                sessionStorage.setItem('organization', formData.organization || '');
                sessionStorage.setItem('registrantName', (formData.firstName || '') + (formData.lastName ? ' ' + formData.lastName : ''));
            }catch(e){/* ignore storage errors */}
            showSuccess('Registration successful! Redirecting to your dashboard...');
            setTimeout(() => {
                window.location.href = 'thanks.html';
            }, 2000);
        } else {
            showError(data.message || 'Registration failed. Please try again.');
        }
    } catch (err) {
        console.error('API registration error:', err);
        showError('Failed to connect to server. Please try again.');
    }
}

// Validate Form
function validateForm() {
    let isValid = true;

    // First Name
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    } else {
        clearFieldError('firstName');
    }

    // Last Name
    const lastName = document.getElementById('lastName').value.trim();
    if (!lastName) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    } else {
        clearFieldError('lastName');
    }

    // Email
    if (!validateEmail()) {
        isValid = false;
    }

    // Phone - accept any number the user enters. If intl-tel-input is available
    // and can provide an E.164 formatted number, prefer that.
    const phone = document.getElementById('phone').value.trim();
    let phoneValue = phone;
    if (iti && typeof iti.isValidNumber === 'function') {
        if (iti.isValidNumber()) {
            phoneValue = iti.getNumber(); // E.164 formatted
            clearFieldError('phone');
        } else if (phone && phone.length > 0) {
            // intl-tel-input present but number not recognized; accept raw input
            clearFieldError('phone');
        } else {
            showFieldError('phone', 'Phone number is required');
            isValid = false;
        }
    } else {
        // No intl widget available: require a non-empty phone and use regex as a soft check
        if (!phone) {
            showFieldError('phone', 'Phone number is required');
            isValid = false;
        } else if (!validatePhoneNumber(phone)) {
            // If regex fails, still accept the input but mark it visually (soft warning)
            // We'll not block submission for unusual formats.
            //clearFieldError('phone');
            // Optionally show a non-blocking hint; for now, accept it.
            clearFieldError('phone');
        } else {
            clearFieldError('phone');
        }
    }

    // Password
    if (!validatePassword()) {
        isValid = false;
    }

    // Confirm Password
    if (!validatePasswordMatch()) {
        isValid = false;
    }

    // User Type
    const userType = document.getElementById('userType').value;
    if (!userType) {
        showFieldError('userType', 'Please select your role');
        isValid = false;
    } else {
        clearFieldError('userType');
    }

    // Terms & Conditions
    if (!document.getElementById('terms').checked) {
        showFieldError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    } else {
        clearFieldError('terms');
    }

    return isValid;
}

// Show/Clear Field Errors
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    if (field && errorElement) {
        field.classList.remove('error');
        errorElement.classList.remove('show');
    }
}

// Show Messages
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.classList.add('show');
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
