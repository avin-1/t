# Core Concepts Explained Simply

If the examiner asks you to explain the technical architecture, use these simple analogies to demonstrate you understand *why* you used these specific tools.

---

## 1. Tesseract.js & PSM (Page Segmentation Mode)
**The Concept:** OCR (Optical Character Recognition) is the process of extracting text from an image. We use Tesseract.js. But receipts from GPay, PhonePe, and Paytm look completely different, so standard OCR gets confused.

**Simple Analogy for PSM:**
Imagine giving a person a magnifying glass and instructions on how to read a page. That's what **PSM (Page Segmentation Mode)** does.
- **PSM 6 (Read a Block):** We tell Tesseract, "Read this whole paragraph." We use this to get general details like names and dates.
- **PSM 7 (Single Line Laser Focus):** We tell Tesseract, "Look at this exact box, there is only ONE line of text here." We use this, combined with a whitelist (telling it to *only* look for numbers 0-9 and the ₹ symbol), to guarantee we extract the exact payment amount without picking up garbage text.
- **PSM 13 (Raw Line - No Grammar):** GPay uses very stylized, weird fonts for its numbers. Standard OCR tries to apply "grammar rules" and fails. PSM 13 tells Tesseract, "Don't try to understand the word, just read the raw shapes." This solves the GPay font issue.

---

## 2. Transformers.js & The BERT Model
**The Concept:** OCR gives us "dumb text" (just a string of characters). We need to know what those characters mean. Usually, developers use RegEx (Regular Expressions) to find amounts, but RegEx breaks easily if the receipt layout changes slightly.

**Simple Analogy for BERT:**
Think of **RegEx** as a simple "Find" (Ctrl+F) command. If you search for "Amount: ₹", and the receipt says "You successfully transferred 500", RegEx finds nothing. It's rigid.

We use **DistilBERT**, a miniaturized Natural Language Processing (NLP) AI model. Think of DistilBERT as a **smart librarian**. 
We pass the extracted text to the model and ask it a question: *"What is the main transaction amount?"*
Because BERT understands the *meaning* of human language, it looks at "You successfully transferred 500" and intelligently knows that "500" is the answer to our question. It handles variations perfectly.

---

## 3. WebAssembly (WASM) & Web Workers
**The Concept:** Running AI models in a browser usually freezes the phone. We solved this using WASM and Web Workers.

**Simple Analogy for Web Workers:**
Imagine the browser's Main Thread as a **Waiter** in a restaurant. The waiter's job is to take orders (button clicks) and serve food (update the UI). 
If you ask the Waiter to also go into the kitchen and cook a 5-course meal (run OCR and AI), he stops serving customers. The app freezes.
**Web Workers** are like hiring a **Chef** in the back kitchen. The Waiter passes the receipt image to the Chef. The Chef runs the heavy AI processing in the background, allowing the Waiter to keep the screen smooth and animated.

**Simple Analogy for WebAssembly (WASM):**
JavaScript is a flexible language, but it's slow for heavy math (like AI). **WebAssembly** is like taking the Chef's normal kitchen knives and upgrading them to industrial power tools. It allows us to run C++ or Rust level code directly in the browser at near-native speeds.

---

## 4. Ground-Truth PDF Verification
**The Concept:** Scammers use fake apps that generate screenshots that look 100% identical to GPay. OCR and AI cannot detect the fake because the pixels literally say "Success". 

**The Solution:** 
We built a local bank statement parser using `pdfjs-dist`. 
If a merchant suspects a fake receipt, they download their official bank statement PDF and load it into our app. 
Our app extracts the text from the PDF locally (without sending it to the cloud) and cross-checks if the `Transaction ID`, `Date`, and `Amount` on the screenshot actually exist in the official bank ledger. If it matches, it is cryptographically verified.
