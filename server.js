const express = require('express');
const cors = require('cors');
const path = require('path');
const NumberConverter = require('./utils');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Global state (in a real app, this would be session-based)
let converter = new NumberConverter(32);
let currentNumber = 0;
let currentMode = 'dec'; // dec, hex, bin

// API Routes

// Get current state
app.get('/api/state', (req, res) => {
    res.json({
        number: currentNumber,
        mode: currentMode,
        bitWidth: converter.bitWidth,
        representations: converter.getAllRepresentations(currentNumber)
    });
});

// Set number from input
app.post('/api/number', (req, res) => {
    const { value, mode } = req.body;
    
    try {
        let radix;
        switch (mode || currentMode) {
            case 'dec': radix = 10; break;
            case 'hex': radix = 16; break;
            case 'bin': radix = 2; break;
            default: radix = 10;
        }
        
        currentNumber = converter.parseNumber(value.toString(), radix);
        
        res.json({
            number: currentNumber,
            representations: converter.getAllRepresentations(currentNumber)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Set input mode
app.post('/api/mode', (req, res) => {
    const { mode } = req.body;
    
    if (['dec', 'hex', 'bin'].includes(mode)) {
        currentMode = mode;
        res.json({ mode: currentMode });
    } else {
        res.status(400).json({ error: 'Invalid mode. Must be dec, hex, or bin' });
    }
});

// Set bit width
app.post('/api/bitwidth', (req, res) => {
    const { width } = req.body;
    const bitWidth = parseInt(width);
    
    if (bitWidth > 0 && bitWidth <= 64) {
        converter = new NumberConverter(bitWidth);
        res.json({
            bitWidth: converter.bitWidth,
            representations: converter.getAllRepresentations(currentNumber)
        });
    } else {
        res.status(400).json({ error: 'Bit width must be between 1 and 64' });
    }
});

// Bitwise operations
app.post('/api/invert', (req, res) => {
    currentNumber = converter.invert(currentNumber);
    res.json({
        number: currentNumber,
        representations: converter.getAllRepresentations(currentNumber)
    });
});

app.post('/api/shift-left', (req, res) => {
    currentNumber = converter.shiftLeft(currentNumber);
    res.json({
        number: currentNumber,
        representations: converter.getAllRepresentations(currentNumber)
    });
});

app.post('/api/shift-right', (req, res) => {
    currentNumber = converter.shiftRight(currentNumber);
    res.json({
        number: currentNumber,
        representations: converter.getAllRepresentations(currentNumber)
    });
});

app.post('/api/reverse-bits', (req, res) => {
    currentNumber = converter.reverseBits(currentNumber);
    res.json({
        number: currentNumber,
        representations: converter.getAllRepresentations(currentNumber)
    });
});

// Special representations
app.get('/api/english', (req, res) => {
    res.json({
        english: converter.numberToEnglish(currentNumber)
    });
});

app.get('/api/roman', (req, res) => {
    res.json({
        roman: converter.numberToRoman(currentNumber)
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Num webapp server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});
