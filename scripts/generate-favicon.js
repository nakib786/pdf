#!/usr/bin/env node

/**
 * Favicon Generation Script
 * 
 * This script helps you generate ICO files from the SVG favicon.
 * 
 * To generate ICO files, you can use one of these methods:
 * 
 * 1. Online tools:
 *    - https://favicon.io/favicon-converter/
 *    - https://realfavicongenerator.net/
 *    - https://www.favicon-generator.org/
 * 
 * 2. Command line tools:
 *    - Install ImageMagick: brew install imagemagick (macOS) or apt-get install imagemagick (Ubuntu)
 *    - Convert SVG to ICO: convert favicon.svg favicon.ico
 * 
 * 3. Node.js packages:
 *    - npm install -g svg2png-wasm
 *    - svg2png-wasm favicon.svg --output favicon.png
 *    - Then convert PNG to ICO using online tools
 * 
 * The SVG favicon is already optimized for:
 * - Modern browsers (SVG support)
 * - High DPI displays
 * - Small sizes (32x32)
 * - Brand colors matching the app
 */

console.log('📄 PDFCraft Favicon Generator');
console.log('');
console.log('The SVG favicon has been created at: public/favicon.svg');
console.log('');
console.log('To generate ICO files for better browser compatibility:');
console.log('1. Visit https://favicon.io/favicon-converter/');
console.log('2. Upload the public/favicon.svg file');
console.log('3. Download the generated ICO files');
console.log('4. Place them in the public/ directory');
console.log('');
console.log('The app is already configured to use both SVG and ICO favicons.');
console.log('Modern browsers will use the SVG, older browsers will fall back to ICO.'); 