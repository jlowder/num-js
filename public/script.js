/**
 * Client-side JavaScript for the Num web application
 * Handles user interactions and API communication
 */

class NumWebApp {
    constructor() {
        this.currentMode = 'dec';
        this.currentNumber = 0;
        this.bitWidth = 32;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadInitialState();
    }

    initializeElements() {
        // Mode buttons
        this.modeBtns = {
            dec: document.getElementById('mode-dec'),
            hex: document.getElementById('mode-hex'),
            bin: document.getElementById('mode-bin')
        };

        // Input elements
        this.numberInput = document.getElementById('number-input');
        this.inputModeSpan = document.querySelector('.input-mode');
        this.bitWidthInput = document.getElementById('bit-width');

        // Display elements
        this.decValue = document.getElementById('dec-value');
        this.hexValue = document.getElementById('hex-value');
        this.binValue = document.getElementById('bin-value');
        this.englishValue = document.getElementById('english-value');
        this.romanValue = document.getElementById('roman-value');

        // Operation buttons
        this.opBtns = {
            invert: document.getElementById('op-invert'),
            shiftLeft: document.getElementById('op-shift-left'),
            shiftRight: document.getElementById('op-shift-right'),
            reverse: document.getElementById('op-reverse')
        };

        // Copy buttons
        this.copyBtns = document.querySelectorAll('.copy-btn');
    }

    attachEventListeners() {
        // Mode buttons
        Object.keys(this.modeBtns).forEach(mode => {
            this.modeBtns[mode].addEventListener('click', () => this.setMode(mode));
        });

        // Number input
        this.numberInput.addEventListener('input', this.debounce(() => {
            this.updateNumber(this.numberInput.value);
        }, 300));

        this.numberInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.updateNumber(this.numberInput.value);
            }
        });

        // Bit width input
        this.bitWidthInput.addEventListener('change', () => {
            this.setBitWidth(parseInt(this.bitWidthInput.value));
        });

        // Operation buttons
        this.opBtns.invert.addEventListener('click', () => this.performOperation('invert'));
        this.opBtns.shiftLeft.addEventListener('click', () => this.performOperation('shift-left'));
        this.opBtns.shiftRight.addEventListener('click', () => this.performOperation('shift-right'));
        this.opBtns.reverse.addEventListener('click', () => this.performOperation('reverse-bits'));

        // Copy buttons
        this.copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-value');
                const targetElement = document.getElementById(targetId);
                this.copyToClipboard(targetElement.textContent, btn);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only process shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT') return;
            
            const key = e.key.toLowerCase();
            switch (key) {
                case 'd':
                    e.preventDefault();
                    this.setMode('dec');
                    break;
                case 'h':
                    e.preventDefault();
                    this.setMode('hex');
                    break;
                case 'b':
                    e.preventDefault();
                    this.setMode('bin');
                    break;
                case 'i':
                    e.preventDefault();
                    this.performOperation('invert');
                    break;
                case 'l':
                    e.preventDefault();
                    this.performOperation('shift-left');
                    break;
                case 'r':
                    e.preventDefault();
                    this.performOperation('shift-right');
                    break;
                case 'v':
                    e.preventDefault();
                    this.performOperation('reverse-bits');
                    break;
            }
        });
    }

    async loadInitialState() {
        try {
            const response = await fetch('/api/state');
            const data = await response.json();
            this.updateDisplay(data);
        } catch (error) {
            console.error('Failed to load initial state:', error);
        }
    }

    async setMode(mode) {
        try {
            await fetch('/api/mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode })
            });

            this.currentMode = mode;
            this.updateModeUI();
        } catch (error) {
            console.error('Failed to set mode:', error);
        }
    }

    async updateNumber(value) {
        if (!value.trim()) return;

        try {
            const response = await fetch('/api/number', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value, mode: this.currentMode })
            });

            const data = await response.json();
            if (response.ok) {
                this.currentNumber = data.number;
                this.updateDisplay(data);
            }
        } catch (error) {
            console.error('Failed to update number:', error);
        }
    }

    async setBitWidth(width) {
        try {
            const response = await fetch('/api/bitwidth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ width })
            });

            const data = await response.json();
            if (response.ok) {
                this.bitWidth = data.bitWidth;
                this.updateDisplay(data);
            }
        } catch (error) {
            console.error('Failed to set bit width:', error);
        }
    }

    async performOperation(operation) {
        try {
            const response = await fetch(`/api/${operation}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (response.ok) {
                this.currentNumber = data.number;
                this.updateDisplay(data);
                
                // Clear input to show the result
                this.numberInput.value = '';
            }
        } catch (error) {
            console.error(`Failed to perform ${operation}:`, error);
        }
    }

    updateDisplay(data) {
        if (data.representations) {
            this.decValue.textContent = data.representations.decimal;
            this.hexValue.textContent = data.representations.hexadecimal;
            this.binValue.textContent = this.formatBinaryForDisplay(data.representations.binary);
            this.englishValue.textContent = data.representations.english;
            this.romanValue.textContent = data.representations.roman;
        }

        if (data.mode !== undefined) {
            this.currentMode = data.mode;
            this.updateModeUI();
        }

        if (data.bitWidth !== undefined) {
            this.bitWidth = data.bitWidth;
            this.bitWidthInput.value = data.bitWidth;
        }
    }

    updateModeUI() {
        // Update active mode button
        Object.keys(this.modeBtns).forEach(mode => {
            this.modeBtns[mode].classList.toggle('active', mode === this.currentMode);
        });

        // Update input mode indicator
        const modeNames = { dec: 'DEC', hex: 'HEX', bin: 'BIN' };
        this.inputModeSpan.textContent = `${modeNames[this.currentMode]}>`;

        // Update input placeholder
        const placeholders = {
            dec: 'Enter decimal number...',
            hex: 'Enter hex number...',
            bin: 'Enter binary number...'
        };
        this.numberInput.placeholder = placeholders[this.currentMode];
    }

    formatBinaryForDisplay(binary) {
        // Add spaces every 4 bits for readability
        return binary.replace(/(.{4})/g, '$1 ').trim();
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            button.classList.add('copy-success');
            const originalText = button.textContent;
            button.textContent = '✓';
            
            setTimeout(() => {
                button.classList.remove('copy-success');
                button.textContent = originalText;
            }, 1000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                button.textContent = '✓';
                setTimeout(() => {
                    button.textContent = '📋';
                }, 1000);
            } catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError);
            }
            document.body.removeChild(textArea);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumWebApp();
});
