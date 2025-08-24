# Num Web App

This is a web-based version of the Num command-line tool - an interactive number base converter with bitwise operations.

## Features

- **Multi-base conversion**: Convert between decimal, hexadecimal, octal, and binary
- **Bitwise operations**: Invert, shift left/right, reverse bit order
- **Configurable bit width**: Support for 1-64 bit registers
- **Special representations**: English words and Roman numerals
- **Clipboard integration**: Copy any value with one click
- **Keyboard shortcuts**: Same shortcuts as the CLI version
- **Responsive design**: Works on desktop and mobile devices

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3001`

For development with auto-restart:
```bash
npm run dev
```

## Docker Usage

Alternatively, you can run the application using Docker Compose:

### Prerequisites
- Docker
- Docker Compose

### Running with Docker Compose

1. Start the application:
   ```bash
   docker-compose up
   ```

2. Run in detached mode (background):
   ```bash
   docker-compose up -d
   ```

3. Rebuild and start (if you've made changes to the Dockerfile):
   ```bash
   docker-compose up --build
   ```

4. Stop the application:
   ```bash
   docker-compose down
   ```

5. View logs:
   ```bash
   docker-compose logs -f
   ```

The application will be accessible at `http://localhost:3001`. With Docker Compose, any changes you make to your source code will automatically trigger nodemon to restart the server inside the container.

## Usage

### Web Interface
- **Input**: Enter numbers in the current mode (DEC/HEX/OCT/BIN)
- **Mode switching**: Click DEC, HEX, OCT, or BIN buttons to change input mode
- **Bit width**: Adjust the register width (1-64 bits)
- **Operations**: Click operation buttons to apply bitwise operations
- **Copy**: Click the 📋 button next to any value to copy to clipboard

### Keyboard Shortcuts
- **D** - Switch to decimal mode
- **H** - Switch to hexadecimal mode
- **O** - Switch to octal mode
- **B** - Switch to binary mode
- **I** - Invert bits
- **L** - Shift left one bit
- **R** - Shift right one bit
- **V** - Reverse bit order

## API Endpoints

The web app exposes REST API endpoints:

- `GET /api/state` - Get current application state
- `POST /api/number` - Set number value
- `POST /api/mode` - Change input mode
- `POST /api/bitwidth` - Set bit width
- `POST /api/invert` - Invert bits
- `POST /api/shift-left` - Shift left
- `POST /api/shift-right` - Shift right
- `POST /api/reverse-bits` - Reverse bit order
- `GET /api/english` - Get English word representation
- `GET /api/roman` - Get Roman numeral representation

## Files

- `server.js` - Express server and API endpoints
- `utils.js` - Core number conversion and bitwise operations
- `public/index.html` - Web interface
- `public/styles.css` - Styling and responsive design
- `public/script.js` - Client-side JavaScript and API communication

## Notes

- Extraneous characters (spaces, punctuation) in input are ignored
- Just like the CLI version, this makes it easy to paste values from other applications
- The web version maintains the same core functionality as the original Lisp implementation
- State is maintained server-side (in a real app, this would be session-based)

## Original CLI Version

This web app is based on the original `num.lisp` command-line tool. Both versions provide the same core functionality but with different interfaces - terminal vs. web browser.
