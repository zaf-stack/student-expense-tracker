import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { categorizePhonePe } from './phonepeCategoryRules';

// Set worker to CDN to avoid webpack/local file issues with version 4.x
GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${"4.10.38"}/build/pdf.worker.min.mjs`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_PATTERN = MONTHS.join('|');
// Regex for "Jan 01, 2026" or "01 Jan, 2026". 
// IMPORTANT: Wrap MONTH_PATTERN in (?:) to prevent precedence issues with |
const DATE_PATTERN = new RegExp(`(?:(?:${MONTH_PATTERN})\\s+\\d{1,2},\\s+\\d{4}|\\d{1,2}\\s+(?:${MONTH_PATTERN}),\\s+\\d{4})`, 'gi');
const TIME_PATTERN = /\b\d{1,2}:\d{2}\s*(AM|PM)\b/i;
const TYPE_PATTERN = /\b(DEBIT|CREDIT)\b/i;

const normalizeText = (text) =>
    text
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const extractAmount = (text) => {
    // Matches "Rs. 1,000" or "INR 1,000" or just "1,000" if closely following context
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

export const extractTextFromPdf = async (input) => {
    try {
        const arrayBuffer = input instanceof ArrayBuffer ? input : await input.arrayBuffer();

        // Use CDN worker, do not disable worker
        const pdf = await getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();
            // Join with space to keep flow
            const pageText = content.items.map((item) => item.str).join(' ');
            fullText += `${pageText} `;
        }

        return fullText;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw error;
    }
};

export const parsePhonePeText = (text) => {
    const normalized = normalizeText(text);
    const matches = [...normalized.matchAll(DATE_PATTERN)];
    if (matches.length === 0) return [];

    const transactions = [];

    for (let i = 0; i < matches.length; i += 1) {
        const start = matches[i].index;
        const end = matches[i + 1]?.index ?? normalized.length;
        const block = normalized.slice(start, end).trim();
        const date = matches[i][0];

        const timeMatch = block.match(TIME_PATTERN);
        const typeMatch = block.match(TYPE_PATTERN);
        const amount = extractAmount(block);

        const detailMatch = block.match(/\b(Paid to|Received from|Credited to|Paid by|Sent to|Received by)\b\s+(.+?)(?=\s+(Transaction ID|UTR|UPI|DEBIT|CREDIT|Rs\.?|INR)|$)/i);
        let description = '';
        if (detailMatch) {
            description = `${detailMatch[1]} ${detailMatch[2]}`.trim();
        } else {
            description = block
                .replace(date, '')
                .replace(timeMatch?.[0] || '', '')
                .replace(typeMatch?.[0] || '', '')
                .replace(/Transaction ID.*?(?=UTR|UPI|DEBIT|CREDIT|Rs\.?|INR|$)/i, '')
                .replace(/UTR.*?(?=UPI|DEBIT|CREDIT|Rs\.?|INR|$)/i, '')
                .replace(/UPI.*?(?=DEBIT|CREDIT|Rs\.?|INR|$)/i, '')
                .trim();
        }

        if (!typeMatch || amount === null) continue;

        const type = typeMatch[0].toUpperCase();
        const record = {
            date,
            time: timeMatch?.[0] || '',
            type,
            amount: Math.abs(amount),
            description,
            details: []
        };

        record.category = categorizePhonePe(record.description, record.type);
        transactions.push(record);
    }

    return transactions;
};

export const extractStatementRange = (text) => {
    const match = text.match(/((?:\d{1,2}\s+[A-Z][a-z]{2},\s+\d{4})|(?:[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}))\s*-\s*((?:\d{1,2}\s+[A-Z][a-z]{2},\s+\d{4})|(?:[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}))/);
    if (!match) return null;
    return { start: match[1], end: match[2] };
};
