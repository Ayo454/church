// DOM Elements
const donateButton = document.getElementById('donate-btn');
const donationModal = document.getElementById('donation-modal');
const closeModalButton = document.getElementById('close-modal');
const form = document.querySelector('form');
const contactName = document.getElementById('name');
const contactEmail = document.getElementById('email');
const contactMessage = document.getElementById('message');

// Open the donation modal
donateButton.addEventListener('click', () => {
    donationModal.style.display = 'flex';
});

// Close the donation modal
closeModalButton.addEventListener('click', () => {
    donationModal.style.display = 'none';
});

// Form submission handler (you can modify this to send data to your server or perform other actions)
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    
    const name = contactName.value.trim();
    const email = contactEmail.value.trim();
    const message = contactMessage.value.trim();

    // Simple validation check
    if (!name || !email || !message) {
        alert('Please fill out all fields before submitting.');
        return;
    }

    // Here you would typically send the form data to the server
    // For now, we just show a confirmation message.
    alert('Thank you for contacting us, ' + name + '! We will get back to you shortly.');

    // Reset form after submission
    form.reset();
});

// Modal close if clicked outside of it
window.addEventListener('click', (event) => {
    if (event.target === donationModal) {
        donationModal.style.display = 'none';
    }
});

// Optional: Show or hide the donation modal on keypress (Esc key to close)
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && donationModal.style.display === 'flex') {
        donationModal.style.display = 'none';
    }
});
