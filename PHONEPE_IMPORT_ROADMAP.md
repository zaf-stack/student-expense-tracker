# PhonePe PDF Import - Feature Roadmap

Goal: Add a new sidebar page where user uploads a PhonePe statement PDF and all transactions auto-fill into the same kind of table as "Daily Usage" (no manual entry).

## Phase 0: Feature Definition (Must Decide)
- Input: PhonePe PDF only (no images), or PDF + image OCR?
- Output: import into existing `dailyExpenses` or a new storage key (e.g. `phonepeExpenses`)?
- Currency: always INR? If not, need multi-currency support.
- Categories: auto-category rules (keyword matching) vs manual review?

## Phase 1: UI + Sidebar Integration
- Add a new sidebar item: "PhonePe Import" or "Statement Import".
- Create a new page `src/pages/PhonePeImport.js`.
- Layout idea from your image:
  - Top header card with "PhonePe Statement" + date range
  - Upload box (drag/drop + button)
  - Preview table with Date, Details, Type, Amount, Category
  - Import button (saves to table/localStorage)

## Phase 2: PDF Parsing (Client-Side First)
Recommended for simplicity: parse PDF in browser using `pdfjs-dist`.
Steps:
1) User uploads PDF.
2) Read file with `FileReader`.
3) Use PDF.js to extract text from each page.
4) Convert raw text into structured transactions (regex + rule-based parsing).
5) Show preview table with edit controls (optional).
6) Save to localStorage and merge with `dailyExpenses`.

Parsing notes for PhonePe statement:
- Lines usually include date, time, "Paid to"/"Received from", type (DEBIT/CREDIT), amount.
- Use a regex pipeline:
  - Detect date line: `MMM DD, YYYY`
  - Next lines: details text
  - Detect type: DEBIT or CREDIT
  - Detect amount: `?` or `Rs`
  - Combine into one record per transaction
- Map type:
  - CREDIT => positive amount
  - DEBIT => negative amount (or same numeric, but use `type` field)

## Phase 3: Auto Category Rules
- Add a keyword rules list in `src/utils/phonepeCategoryRules.js`.
- Example mapping:
  - "grocery", "mart", "kirana" => Grocery
  - "zomato", "swiggy", "food" => Food
  - "uber", "ola", "rapido" => Transport
  - "rent" => Rent
- Fallback to "Other".
- Allow manual override in preview table before import.

## Phase 4: Data Model + Storage
Option A (Merge with Daily Usage):
- Convert PhonePe rows into `dailyExpenses` structure:
  - `date`, `category`, `amount`, `description`, `type`, `source: 'phonepe'`
Option B (Separate):
- Keep in `phonepeExpenses` and show in its own table.
- Add a "Send to Daily Usage" action to copy selected rows.

## Phase 5: Duplicate Detection
- Use a simple hash key:
  - `${date}|${amount}|${type}|${description}`
- On import, skip duplicates (or mark them as duplicates for user review).

## Phase 6: Analytics Integration
- If merged, existing Analytics/Dashboard will auto-include imported data.
- If separate, add a toggle "Include PhonePe" on dashboard/analytics.

## Phase 7: UX Polishing
- Progress indicator while parsing.
- Error handling for unsupported PDF format.
- Sample template PDF for testing.
- "Reset Import" button.

## Phase 8: Optional Server-Side (If PDF Parsing Fails)
If PhonePe changes PDF layout or PDF text is not extractable:
- Add a backend endpoint to upload PDF.
- Use OCR (Tesseract) + layout parsing.
- Return JSON transactions to the frontend.

## Deliverables Checklist
- New sidebar item + route in `App.js` and `Layout.js`.
- New page `PhonePeImport.js`.
- PDF parsing utility `src/utils/phonepeParser.js`.
- Category rules `src/utils/phonepeCategoryRules.js`.
- Preview + import table component (can reuse `ExpenseList` style).
- LocalStorage integration + duplicate detection.

## Estimated Effort
- UI + routing: 0.5 day
- PDF parsing + rules: 1?2 days
- Preview + import flow: 1 day
- QA with real PDFs: 0.5?1 day
