// Donations System with Ko-fi Integration

// Configuration - CAMBIAR ESTO CON TU USUARIO DE KO-FI
const DONATIONS_CONFIG = {
    KO_FI_USERNAME: 'jeancarlovq', // Reemplaza con tu usuario de Ko-fi
    KO_FI_URL: 'https://ko-fi.com/',
    CURRENCY: 'USD',
    PRESET_AMOUNTS: [1, 5, 10, 25],
};

const DonationSystem = {
    currentAmount: null,
    
    init() {
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        const donationBtn = document.getElementById('donationBtn');
        const closeDonationModal = document.getElementById('closeDonationModal');
        const donationModal = document.getElementById('donationModal');
        const donationOverlay = document.querySelector('.donation-modal-overlay');
        const submitBtn = document.querySelector('.donation-submit-btn');
        const donationOptions = document.querySelectorAll('.donation-option');
        const customAmountInput = document.getElementById('customAmount');
        
        // Open modal
        if (donationBtn) {
            donationBtn.addEventListener('click', () => {
                if (donationModal) donationModal.classList.remove('hidden');
            });
        }
        
        // Close modal
        if (closeDonationModal) {
            closeDonationModal.addEventListener('click', () => {
                if (donationModal) donationModal.classList.add('hidden');
            });
        }
        
        if (donationOverlay) {
            donationOverlay.addEventListener('click', () => {
                if (donationModal) donationModal.classList.add('hidden');
            });
        }
        
        // Preset amounts
        donationOptions.forEach(option => {
            option.addEventListener('click', () => {
                const amount = option.getAttribute('data-amount');
                this.selectAmount(amount, option);
                if (customAmountInput) customAmountInput.value = '';
            });
        });
        
        // Custom amount
        if (customAmountInput) {
            customAmountInput.addEventListener('input', (e) => {
                const amount = parseFloat(e.target.value) || 0;
                if (amount > 0) {
                    this.selectAmount(amount.toString(), null);
                    donationOptions.forEach(opt => opt.classList.remove('active'));
                }
            });
        }
        
        // Submit button
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.processDonation();
            });
        }
    },
    
    selectAmount(amount, element) {
        this.currentAmount = parseFloat(amount);
        
        const donationOptions = document.querySelectorAll('.donation-option');
        donationOptions.forEach(opt => opt.classList.remove('active'));
        
        if (element) {
            element.classList.add('active');
        }
        
        const submitBtn = document.querySelector('.donation-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = `Donar $${this.currentAmount}`;
        }
    },
    
    processDonation() {
        if (!this.currentAmount || this.currentAmount <= 0) {
            showNotification('Por favor, selecciona un monto', 'error');
            return;
        }
        
        // Open Ko-fi in new window
        const kofiUrl = `${DONATIONS_CONFIG.KO_FI_URL}${DONATIONS_CONFIG.KO_FI_USERNAME}?hidefm=1`;
        window.open(kofiUrl, '_blank', 'width=600,height=700');
        
        // Close modal
        const donationModal = document.getElementById('donationModal');
        if (donationModal) donationModal.classList.add('hidden');
        
        // Show thank you message
        showNotification('¡Gracias por tu apoyo a HolyVerse! 🙏', 'success');
    },
    
    updateUI() {
        const submitBtn = document.querySelector('.donation-submit-btn');
        if (submitBtn) {
            if (this.currentAmount && this.currentAmount > 0) {
                submitBtn.disabled = false;
                submitBtn.textContent = `Donar $${this.currentAmount}`;
            } else {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Selecciona un monto';
            }
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DonationSystem.init();
    });
} else {
    DonationSystem.init();
}

// Note: For future enhancement with Stripe
// You can replace processDonation() with Stripe integration
