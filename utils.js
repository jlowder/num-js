/**
 * Core utilities for number conversion and bitwise operations
 * Port of num.lisp functionality to JavaScript
 */

class NumberConverter {
    constructor(bitWidth = 32) {
        this.bitWidth = bitWidth;
    }

    /**
     * Convert integer to bit array (equivalent to integer->bit-vector in Lisp)
     */
    integerToBitArray(num) {
        if (num === 0) return [0];
        
        const bits = [];
        let n = Math.abs(num);
        while (n > 0) {
            bits.unshift(n & 1);
            n = Math.floor(n / 2);
        }
        return bits;
    }

    /**
     * Convert bit array to integer (equivalent to bit-vector->integer in Lisp)
     */
    bitArrayToInteger(bits) {
        return bits.reduce((acc, bit) => acc * 2 + bit, 0);
    }

    /**
     * Pad bit array to specified width
     */
    padBitArray(bits, width) {
        const padding = width - bits.length;
        if (padding > 0) {
            return new Array(padding).fill(0).concat(bits);
        }
        return bits.slice(-width); // Truncate if too long
    }

    /**
     * Format number for display in different bases
     */
    formatNumber(num, base, bitWidth = this.bitWidth) {
        switch (base) {
            case 'dec':
                return num.toString(10);
            case 'hex':
                const hexDigits = Math.max(1, Math.ceil(bitWidth / 4));
                return '0x' + num.toString(16).toUpperCase().padStart(hexDigits, '0');
            case 'bin':
                return num.toString(2).padStart(bitWidth, '0');
            default:
                throw new Error(`Unknown base: ${base}`);
        }
    }

    /**
     * Parse number from string with given radix, ignoring non-alphanumeric characters
     */
    parseNumber(str, radix = 10) {
        // Remove all non-alphanumeric characters (equivalent to regex-replace-all in Lisp)
        const cleaned = str.replace(/[^0-9a-fA-F]/g, '');
        if (cleaned === '') return 0;
        
        const num = parseInt(cleaned, radix);
        return isNaN(num) ? 0 : num;
    }

    /**
     * Bitwise invert operation
     */
    invert(num) {
        const bits = this.padBitArray(this.integerToBitArray(num), this.bitWidth);
        const inverted = bits.map(bit => bit ^ 1);
        return this.bitArrayToInteger(inverted);
    }

    /**
     * Shift right operation
     */
    shiftRight(num) {
        const bits = this.padBitArray(this.integerToBitArray(num), this.bitWidth);
        const shifted = [0].concat(bits.slice(0, this.bitWidth - 1));
        return this.bitArrayToInteger(shifted);
    }

    /**
     * Shift left operation
     */
    shiftLeft(num) {
        const bits = this.padBitArray(this.integerToBitArray(num), this.bitWidth);
        const shifted = bits.slice(1).concat([0]);
        return this.bitArrayToInteger(shifted);
    }

    /**
     * Reverse bit order
     */
    reverseBits(num) {
        const bits = this.padBitArray(this.integerToBitArray(num), this.bitWidth);
        const reversed = bits.slice().reverse();
        return this.bitArrayToInteger(reversed);
    }

    /**
     * Convert number to English words
     */
    numberToEnglish(num) {
        if (num === 0) return 'zero';
        
        const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const scales = ['', 'thousand', 'million', 'billion', 'trillion'];
        
        function convertChunk(n) {
            let result = '';
            
            if (n >= 100) {
                result += ones[Math.floor(n / 100)] + ' hundred';
                n %= 100;
                if (n > 0) result += ' ';
            }
            
            if (n >= 20) {
                result += tens[Math.floor(n / 10)];
                n %= 10;
                if (n > 0) result += '-' + ones[n];
            } else if (n >= 10) {
                result += teens[n - 10];
            } else if (n > 0) {
                result += ones[n];
            }
            
            return result;
        }
        
        if (num < 0) {
            return 'negative ' + this.numberToEnglish(-num);
        }
        
        const chunks = [];
        let scaleIndex = 0;
        
        while (num > 0) {
            const chunk = num % 1000;
            if (chunk > 0) {
                let chunkStr = convertChunk(chunk);
                if (scaleIndex > 0) {
                    chunkStr += ' ' + scales[scaleIndex];
                }
                chunks.unshift(chunkStr);
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }
        
        return chunks.join(' ');
    }

    /**
     * Convert number to Roman numerals
     */
    numberToRoman(num) {
        if (num <= 0 || num > 3999) {
            return 'Number out of range (1-3999)';
        }
        
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        
        let result = '';
        for (let i = 0; i < values.length; i++) {
            while (num >= values[i]) {
                result += numerals[i];
                num -= values[i];
            }
        }
        return result;
    }

    /**
     * Get all representations of a number
     */
    getAllRepresentations(num) {
        return {
            decimal: this.formatNumber(num, 'dec'),
            hexadecimal: this.formatNumber(num, 'hex'),
            binary: this.formatNumber(num, 'bin'),
            english: this.numberToEnglish(num),
            roman: this.numberToRoman(num)
        };
    }
}

module.exports = NumberConverter;
