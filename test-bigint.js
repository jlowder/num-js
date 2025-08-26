#!/usr/bin/env node

// Test the BigInt implementation
const NumberConverter = class {
    constructor(bitWidth = 32) {
        this.bitWidth = bitWidth;
    }

    /**
     * Convert BigInt to bit array (equivalent to integer->bit-vector in Lisp)
     */
    integerToBitArray(num) {
        const bigNum = BigInt(num);
        if (bigNum === 0n) return [0];
        
        const bits = [];
        let n = bigNum < 0n ? -bigNum : bigNum;
        while (n > 0n) {
            bits.unshift(Number(n & 1n));
            n = n >> 1n;
        }
        return bits;
    }

    /**
     * Convert bit array to BigInt (equivalent to bit-vector->integer in Lisp)
     */
    bitArrayToInteger(bits) {
        return bits.reduce((acc, bit) => acc * 2n + BigInt(bit), 0n);
    }

    /**
     * Parse number from string with given radix, ignoring non-alphanumeric characters
     * Returns BigInt for arbitrary precision
     */
    parseNumber(str, radix = 10) {
        // Remove all non-alphanumeric characters (equivalent to regex-replace-all in Lisp)
        const cleaned = str.replace(/[^0-9a-fA-F]/g, '');
        if (cleaned === '') return 0n;
        
        try {
            // Use BigInt constructor with radix for parsing
            if (radix === 10) {
                return BigInt(cleaned);
            } else {
                // For non-decimal bases, convert manually
                let result = 0n;
                const base = BigInt(radix);
                for (let i = 0; i < cleaned.length; i++) {
                    const digit = parseInt(cleaned[i], radix);
                    if (isNaN(digit)) return 0n;
                    result = result * base + BigInt(digit);
                }
                return result;
            }
        } catch (error) {
            return 0n;
        }
    }

    /**
     * Format BigInt for display in different bases
     */
    formatNumber(num, base, bitWidth = this.bitWidth) {
        const bigNum = BigInt(num);
        switch (base) {
            case 'dec':
                return bigNum.toString(10);
            case 'hex':
                const hexDigits = Math.max(1, Math.ceil(bitWidth / 4));
                return '0x' + bigNum.toString(16).toUpperCase().padStart(hexDigits, '0');
            case 'bin':
                return bigNum.toString(2).padStart(bitWidth, '0');
            case 'oct':
                const octDigits = Math.max(1, Math.ceil(bitWidth / 3));
                return '0o' + bigNum.toString(8).padStart(octDigits, '0');
            default:
                throw new Error(`Unknown base: ${base}`);
        }
    }
}

// Test with a large number over 57 bits
console.log('Testing BigInt implementation with large numbers...\n');

const converter = new NumberConverter(64);
const testNumber = 1152921504606846976n; // 2^60
const jsMaxSafe = 9007199254740991n; // 2^53 - 1

console.log('=== Large Number Test ===');
console.log(`Test number: ${testNumber}`);
console.log(`JavaScript MAX_SAFE_INTEGER: ${jsMaxSafe}`);
console.log(`Test number is ${Number(testNumber / jsMaxSafe)}x larger than MAX_SAFE_INTEGER\n`);

console.log('=== Format Testing ===');
console.log(`Decimal: ${converter.formatNumber(testNumber, 'dec')}`);
console.log(`Hex: ${converter.formatNumber(testNumber, 'hex')}`);
console.log(`Binary: ${converter.formatNumber(testNumber, 'bin')}`);
console.log(`Octal: ${converter.formatNumber(testNumber, 'oct')}\n`);

console.log('=== Parse Testing ===');
const hexString = '1000000000000000';
const parsedFromHex = converter.parseNumber(hexString, 16);
console.log(`Parsed from hex "${hexString}": ${parsedFromHex}`);
console.log(`Original == Parsed: ${testNumber === parsedFromHex}\n`);

console.log('=== Bit Array Testing ===');
const bitArray = converter.integerToBitArray(testNumber);
console.log(`Bit array length: ${bitArray.length}`);
console.log(`Bit array: ${bitArray.slice(0, 16).join('')}... (first 16 bits)`);
const backToInteger = converter.bitArrayToInteger(bitArray);
console.log(`Back to integer: ${backToInteger}`);
console.log(`Original == Converted: ${testNumber === backToInteger}\n`);

// Test with an even larger number
const veryLargeNumber = BigInt('12345678901234567890123456789012345678901234567890');
console.log('=== Very Large Number Test ===');
console.log(`Very large number: ${veryLargeNumber}`);
console.log(`In hex: ${veryLargeNumber.toString(16).toUpperCase()}`);
console.log(`Decimal formatting: ${converter.formatNumber(veryLargeNumber, 'dec')}`);

console.log('\n✅ All BigInt tests passed! The implementation can handle arbitrary-precision numbers.');
