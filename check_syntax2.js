const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
const js = scriptMatch[1];

// Try parsing incrementally to find the error
const lines = js.split('\n');
let chunk = '';
for (let i = 0; i < lines.length; i++) {
    chunk += lines[i] + '\n';
    if (i > 0 && i % 50 === 0) {
        try {
            new Function(chunk);
        } catch(e) {
            console.log(`Error at line ${i-50} to ${i}: ${e.message}`);
            // Show the problematic lines
            for (let j = Math.max(0, i-5); j <= i; j++) {
                console.log(`${j+1}: ${lines[j].substring(0, 120)}`);
            }
            break;
        }
    }
}

// Also try: find the BUILTIN_QUESTIONS array and check it
const bqStart = js.indexOf('const BUILTIN_QUESTIONS=[');
const dsStart = js.indexOf('const DEFAULT_SOURCES=[');
if (bqStart !== -1 && dsStart !== -1) {
    const bqSection = js.substring(bqStart, dsStart);
    console.log(`\nBUILTIN_QUESTIONS section: ${bqSection.length} chars`);
    try {
        // Try to parse just the array
        eval(bqSection);
        console.log('BUILTIN_QUESTIONS array syntax OK');
    } catch(e) {
        console.log(`BUILTIN_QUESTIONS array error: ${e.message}`);
        // Find the error position within the section
        const posMatch = e.message.match(/position (\d+)/);
        if (posMatch) {
            const pos = parseInt(posMatch[1]);
            const start = Math.max(0, pos - 80);
            const end = Math.min(bqSection.length, pos + 80);
            console.log('Context:', bqSection.substring(start, end));
        }
    }
}
