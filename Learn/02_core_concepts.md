# Core Concepts & Working Mechanism

This document breaks down the major technical pillars of UPI SnapPay.

## 1. The OCR Pipeline (Tesseract.js)
Because receipts from GPay, PhonePe, and Paytm have wildly different layouts, fonts, and colors, a standard OCR approach fails.
- **Canvas Preprocessing:** Before OCR, the image is passed through an HTML5 `<canvas>`. We apply contrast stretching and thresholding. If the receipt is in "Dark Mode", we detect average luminance and invert it.
- **Provider-Specific Crops:** We define specific "bounding boxes" (x, y, width, height). For example, PhonePe's amount is usually small and on the right, while GPay's is large and centered.
- **PSM Manipulation:** Tesseract uses Page Segmentation Modes (PSM).
  - `PSM 6` (Uniform block of text) is used for general details.
  - `PSM 7` (Single line) combined with a character whitelist (`0-9, ₹`) is used to aggressively target the exact transaction amount.
  - `PSM 13` (Raw line) is used as a fallback for highly stylized fonts (like GPay's custom number font).

## 2. The NLP Engine (Transformers.js)
OCR just gives us "dumb text". We need to understand it. 
- The project loads a small language model (`distilbert-base-uncased-distilled-squad`) directly into the browser memory using WebAssembly.
- It performs **Question Answering (QA)**. If our RegEx fails to find the amount, we ask the AI: *"What is the main transaction amount?"*
- It performs **Intent Classification**: By analyzing keywords, it assigns a score to whether the money was "Sent" or "Received", flagging suspicious receipts that contain mixed cues (e.g., both "Paid" and "Declined").

## 3. Fraud Detection via PDF Verification
Screenshots can be edited in Photoshop. To definitively prove a transaction is real, merchants can upload their official bank statement PDF.
- `pdfjs-dist` parses the PDF text locally.
- The system extracts the `Transaction ID`, `Amount`, `Date`, and `UPI ID` from the statement text.
- If the details on the screenshot match the details in the official bank ledger, the transaction is marked as cryptographically verified.

## 4. The Edge AI Advantage
By keeping the Transformers model and Tesseract OCR engine strictly inside the browser (Edge AI), there are zero API latency delays and zero server compute costs. It also guarantees maximum privacy since the image never leaves the phone.
