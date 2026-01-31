const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractText() {
    const pdfPath = 'screenshots/PhonePe_Statement_Jan2026_Jan2026.pdf';
    console.log(`Reading PDF from: ${pdfPath}`);

    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = new Uint8Array(dataBuffer);

        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;

        console.log(`PDF loaded. Pages: ${pdf.numPages}`);

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            // Use same logic as frontend: items.map(item => item.str).join(' ')
            // But let's verify if ' ' join is better or '\n'
            // The user code recently changed to join(' '), let's see raw items first

            console.log(`--- Page ${i} ---`);
            const strings = content.items.map(item => item.str);
            console.log(strings.join('\n')); // Log with newlines to see structure

            fullText += strings.join(' ') + '\n';
        }

        console.log('--- Full Text (joined with spaces) ---');
        console.log(fullText);

    } catch (error) {
        console.error('Error extracting text:', error);
    }
}

extractText();
