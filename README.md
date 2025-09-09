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

Click here to try it out:

[num-js](https://jlowder.github.io/num-js/num-js.html)

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
