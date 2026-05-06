# Advanced / Cross-Questions (Viva Preparation)

These are the tough, conceptual questions a professor might throw at you to test if you actually wrote the code and understand the deep architecture.

### Q1: Running Machine Learning models in a browser using JavaScript sounds incredibly slow. Doesn't loading Tesseract and BERT freeze the browser UI?
**Answer:** It would freeze the UI if we ran it incorrectly. We solved this using two technologies: **Web Workers** and **WebAssembly (WASM)**.
- **Web Workers:** We offload all the heavy AI processing to background threads. The main thread (which handles the UI and animations) remains completely unblocked and 60fps smooth.
- **WebAssembly:** JavaScript is not designed for heavy matrix multiplication (which AI requires). We use the ONNX Web Runtime, which compiles the AI models into WebAssembly. WASM runs at near-native C++ speeds directly inside the browser engine.

### Q2: GPay, PhonePe, and Paytm have completely different layouts. How does your OCR know where to look? Do you scan the whole image?
**Answer:** Scanning a full 1080p screenshot is slow and inaccurate. We built a `useProviderClassifier` module. 
1. First, we do a very fast, low-res scan to classify the provider (looking for keywords like "Google Transaction ID" vs "PhonePe Support"). 
2. Once we know it's a PhonePe receipt, we apply **Provider-Specific Cropping**. For example, we know PhonePe places the amount in small text on the mid-right. We dynamically adjust our canvas coordinates to crop *only* that specific region, scale it up 5x, and run high-accuracy OCR on just that tiny slice. This saves massive compute time.

### Q3: Tesseract notoriously struggles with stylized fonts like GPay's numeric font. How did you specifically solve this?
**Answer:** This was one of our hardest challenges. Standard OCR applies language dictionaries to fix typos, which ruins stylized numbers. We solved this by manipulating Tesseract's **Page Segmentation Modes (PSM)**. 
We isolated the amount region and ran it with **PSM 13 (Raw Line)**. PSM 13 bypasses all linguistic heuristics and Tesseract's internal grammar rules. It tells the engine, "Don't try to understand the word, just read the raw shapes." Combined with a strict whitelist (`0123456789.,₹`), this made GPay extraction highly accurate.

### Q4: If the receipt is in Dark Mode, OCR accuracy drops massively. How is this handled programmatically?
**Answer:** Before processing the cropped region, we read the image data using the HTML Canvas API (`ctx.getImageData`). We calculate the average **luminance** (brightness) of the pixels. If the average luminance falls below a certain threshold (e.g., < 150), it means the image is in dark mode. We then loop through the pixel array and mathematically invert the RGB values (`255 - value`). This converts white text on a black background into black text on a white background, which Tesseract handles perfectly.

### Q5: What is DistilBERT doing in your app? Why not just use RegEx to find the amount?
**Answer:** RegEx is extremely brittle. If PhonePe adds an extra space or changes "Paid: ₹500" to "Successfully transferred 500 rupees", the RegEx fails entirely.
We use the `distilbert-base-uncased-distilled-squad` model for **semantic understanding**. Instead of looking for a strict text pattern, we pass the noisy OCR text to the model and ask: *"What is the main transaction amount?"* Because the BERT model was trained on reading comprehension, it understands the contextual relationship of the words in the sentence and extracts the correct value regardless of formatting changes.

### Q6: If a transaction fails on GPay, the layout shifts downwards because a "Retry" button appears. How do you handle this shifting layout?
**Answer:** We built **shift resilience** into our cropping logic. First, our NLP intent engine scans the text for negative cues like "Failed", "Declined", or "Pending". If a non-success state is detected, the app dynamically shifts the Y-axis of our search bands downward by about 10-15%. This accounts for the new UI elements (like the status banner and retry button) that pushed the transaction amount lower on the screen, ensuring our bounding box still captures the correct data.
