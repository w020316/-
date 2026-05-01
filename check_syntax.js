const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) { console.log('No script found'); process.exit(1); }
const js = scriptMatch[1];
try {
    new Function(js);
    console.log('JS syntax OK');
} catch(e) {
    console.log('JS syntax error:', e.message);
    // Find the position
    const lines = js.split('\n');
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1;
        if (charCount >= 0) {
            // Just show lines around the error
        }
    }
    // Show context around the error position
    const posMatch = e.message.match(/position (\d+)/);
    if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const start = Math.max(0, pos - 100);
        const end = Math.min(js.length, pos + 100);
        console.log('\nContext around error:');
        console.log(js.substring(start, end));
        console.log('\n' + ' '.repeat(pos - start) + '^');
    }
}
