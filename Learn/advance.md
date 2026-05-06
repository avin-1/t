# Advanced / Cross-Questions (Viva Preparation)

These are the tough, conceptual questions a professor might throw at you to test if you actually wrote the code and understand the deep architecture.

### Q1: WebAssembly (WASM) is heavy. Doesn't loading Tesseract and Transformers.js freeze the browser UI?
**Answer:** No, because we execute the heavy AI workloads off the main thread. Tesseract.js runs in **Web Workers**, meaning the OCR extraction happens in a background thread. The UI remains fully responsive. Transformers.js is optimized via the ONNX runtime for WebAssembly, making execution highly efficient.

### Q2: GPay and PhonePe have completely different layouts. How does your OCR know where to look?
**Answer:** We built a `useProviderClassifier` module. First, we do a quick, low-res scan to classify the provider (looking for keywords like "Google Transaction ID" vs "PhonePe Support"). Once identified, we apply **Provider-Specific Cropping**. For example, we know PhonePe places the amount on the mid-right, while GPay places it large in the center. We dynamically adjust our canvas cropping coordinates based on the detected provider before doing the high-res OCR pass.

### Q3: Tesseract notoriously struggles with stylized fonts like GPay's numeric font. How did you solve this?
**Answer:** We manipulate Tesseract's **Page Segmentation Modes (PSM)**. While PSM 3 or 6 is good for blocks of text, it tries to apply standard linguistic heuristics which fails on GPay's custom font. To extract the exact amount, we isolate the amount-band region and run it with **PSM 13 (Raw Line)** or **PSM 7 (Single Line)** combined with a strict numeric character whitelist (`0-9, ₹, .`).

### Q4: If the receipt is in Dark Mode, OCR accuracy drops massively. How is this handled?
**Answer:** Before processing, we analyze the cropped canvas region and calculate its average **luminance**. If the luminance falls below a certain threshold (indicating dark mode), we programmatically invert the pixels (turning white text on black background into black text on white background). This normalizes the image for Tesseract, drastically improving accuracy.

### Q5: How do you verify the PDF Bank Statements? Are you sending the PDF to a backend?
**Answer:** Absolutely not; sending bank statements to a server would be a massive privacy violation. We use `pdfjs-dist` to parse the PDF entirely on the client side. We extract all text layers from the PDF document locally in the browser and then run string matching algorithms to verify if the Transaction ID, Date, and Amount from the receipt exist in the official ledger text.

### Q6: What is DistilBERT doing in your app? Why not just use RegEx?
**Answer:** RegEx is brittle. If a receipt layout updates slightly or OCR misses a character, RegEx breaks. We use `distilbert-base-uncased-distilled-squad` via Transformers.js for semantic understanding. When RegEx fails to extract the exact amount, we pass the OCR text to the model and ask: *"What is the main transaction amount?"* The AI understands the context of the sentence (e.g., "Paid 500 successfully") and extracts "500" even if the formatting is weird.

### Q7: If a transaction fails on GPay, the layout shifts downwards because of the "Retry" button. How do you handle this shifting layout?
**Answer:** We built shift resilience into our cropping logic. If our NLP detects negative intent keywords (like "Failed" or "Declined"), the app dynamically shifts the Y-axis of our search bands downward to account for the UI elements (like a status banner or retry button) that push the transaction amount lower on the screen.
