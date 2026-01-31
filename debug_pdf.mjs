import fs from 'fs';
import { getDocument } from 'pdfjs-dist/build/pdf.mjs';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_PATTERN = MONTHS.join('|');
const DATE_PATTERN = new RegExp(`(?:(?:${MONTH_PATTERN})\\s+\\d{1,2},\\s+\\d{4}|\\d{1,2}\\s+(?:${MONTH_PATTERN}),\\s+\\d{4})`, 'gi');
const TIME_PATTERN = /\b\d{1,2}:\d{2}\s*(AM|PM)\b/i;
const TYPE_PATTERN = /\b(DEBIT|CREDIT)\b/i;

const normalizeText = (text) =>
    text
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const extractAmount = (text) => {
    const match = text.match(/(Rs\.?|INR)\s*([0-9,]+(\.[0-9]{1,2})?)/i);
    if (match) {
        const value = parseFloat(match[2].replace(/,/g, ''));
        return Number.isNaN(value) ? null : value;
    }
    const typeMatch = text.match(TYPE_PATTERN);
    if (typeMatch) {
        const afterType = text.slice(typeMatch.index + typeMatch[0].length);
        const numberMatch = afterType.match(/([0-9,]+(\.[0-9]{1,2})?)/);
        if (numberMatch) {
            const value = parseFloat(numberMatch[1].replace(/,/g, ''));
            return Number.isNaN(value) ? null : value;
        }
    }
    return null;
};

const parsePhonePeText = (text) => {
    const normalized = normalizeText(text);
    const matches = [...normalized.matchAll(DATE_PATTERN)];
    console.log(`Found ${matches.length} date matches.`);
    matches.forEach(m => {
        if (m[0].length < 10) console.log(`SHORT MATCH: "${m[0]}" at ${m.index}`);
    });

    const transactions = [];

    for (let i = 0; i < matches.length; i += 1) {
        const start = matches[i].index;
        const end = matches[i + 1]?.index ?? normalized.length;
        const block = normalized.slice(start, end).trim();
        const date = matches[i][0];

        const timeMatch = block.match(TIME_PATTERN);
        const typeMatch = block.match(TYPE_PATTERN);
        const amount = extractAmount(block);

        if (date === 'Jan') {
            console.log('--- FOUND "Jan" DATE ---');
            console.log('Block:', block);
            console.log('Time:', timeMatch);
            console.log('Type:', typeMatch);
        }

        if (!typeMatch || amount === null) continue;

        const type = typeMatch[0].toUpperCase();
        const record = {
            date,
            type,
            amount: Math.abs(amount),
        };
        transactions.push(record);
    }
    return transactions;
};

async function extractText() {
    const pdfPath = 'screenshots/PhonePe_Statement_Jan2026_Jan2026.pdf';
    console.log(`Reading PDF from: ${pdfPath}`);

    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = new Uint8Array(dataBuffer);

        const loadingTask = getDocument({ data, disableWorker: true });
        const pdf = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            fullText += strings.join(' ') + ' ';
        }

        console.log('--- Parsing Text ---');
        const txs = parsePhonePeText(fullText);
        console.log(`Parsed ${txs.length} transactions.`);

        txs.forEach(tx => {
            if (tx.date.length < 6) console.log('BAD TX:', tx);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

extractText();
