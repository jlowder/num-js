# Num Web App

This is a web-based version of the `num` command-line tool - an arbitrary-bitwidth base converter with bitwise operations.

## Features

- **Multi-base conversion**: Convert between decimal, hexadecimal, octal, and binary
- **Bitwise operations**: Invert, shift left/right, reverse bit order
- **Arbitrary bit width**: Support for numbers of practically any bit width
- **Special representations**: English words and Roman numerals
- **Clipboard integration**: Copy any value with one click
- **Keyboard shortcuts**: Same shortcuts as the CLI version
- **Responsive design**: Works on desktop and mobile devices

## Quick Start

This version is implemented using only client-side logic, so everything is located in one static HTML file. Just open
`num-js.html` in your browser.

### Usage
- **Input**: Enter numbers in the current mode (DEC/HEX/OCT/BIN)
- **Mode switching**: Click DEC, HEX, OCT, or BIN buttons to change input mode
- **Bit width**: Adjust the register width
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

## Notes

- Extraneous characters (spaces, punctuation) in input are ignored
- Just like the CLI version, this makes it easy to paste values from other applications
- The web version maintains the same core functionality as the original Lisp implementation
- State is maintained on the client-side within the browser session

## History

This web app was generated from the original command-line lisp tool, `num.lisp` (https://github.com/jlowder/num). It was
"vibe coded" into this standalone HTML version (and also into a full node application) with Warp version v0.2025.08.20.08.11.stable_03
(https://warp.dev) using claude 4 sonnet. This was completed initially all in one prompt. However, Gemini Code Assist conducted
an automated code review and correctly noticed that `bigint` support was necessary to handle bitlengths over 53 due to the way
javascript handles integers. I then prompted Warp again to add bigint support, and the results are what you see here.


