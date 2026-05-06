# Deep Dive: System Architecture & Data Flow

If the examiner asks, *"Walk me through the exact technical lifecycle of an image from the moment the user clicks 'Upload' to the moment the ledger updates,"* use this architecture flow.

## 1. The Input Layer
- The user uploads an image via the `<input type="file" accept="image/*">` tag in our Vue component (`scan.vue`).
- The file is converted into a base64 `DataURL` format using the standard `FileReader` API.

## 2. Phase 1: Rapid Heuristic Classification
Before doing heavy processing, we do a rapid, low-resolution pass over the image using standard Tesseract.
- We pass the text to `useDocumentClassifier.ts` which checks for success/failure intent.
- We pass it to `useProviderClassifier.ts` which counts keyword matches to confidently determine if the receipt is from GPay, PhonePe, or Paytm. 

## 3. Phase 2: Dynamic Region Execution (The Heavy Lifting)
Now that we know the provider (e.g., GPay), we trigger the high-accuracy pipeline.
- We generate **Bounding Box Crops** specific to GPay using the HTML5 Canvas.
- We generate multiple **Variants** of these crops (Grayscale, High Contrast, Inverted Luminance for dark mode).
- We spawn Tesseract **Web Workers** and run these variants concurrently using `PSM 7` and `PSM 13`.
- We assign a `score` to every OCR output string. A string containing the ₹ symbol scores higher than a string without it. We select the highest-scoring text block.

## 4. Phase 3: Semantic Verification (Transformers.js)
We now have high-quality text, but we must verify its semantic meaning to detect fraud.
- We parse the text through `useNlpValidator.ts`. We count positive intent cues ("paid to") vs negative cues ("failed", "available balance"). If we detect high negative cues on a receipt that claims to be a success, we flag it.
- We parse the text through `useSemanticExtractor.ts`. If standard Regex fails to find the amount or receiver name, we boot up the **DistilBERT ONNX model** via WebAssembly and run a Question-Answering pipeline to intelligently extract the missing entities.

## 5. Phase 4: Ground Truth Reconciliation (Optional but Critical)
To absolutely prevent fake receipt spoofing, the merchant can cross-verify against their bank statement.
- The merchant uploads a PDF of their bank statement.
- We use `pdfjs-dist` to parse the PDF text strictly locally.
- We cross-reference the extracted `Transaction ID`, `Amount`, and `Date` from Phase 3 against the parsed PDF text. If a match is found, the transaction is cryptographically secured as authentic.

## 6. Phase 5: Ledger Persistence & Synchronization
- The validated transaction object (containing Amount, Sender, Provider, Date, and Verification Status) is passed to a Pinia Store (`useTransactions.ts`).
- Pinia updates the local Vue state instantly (optimistic UI update).
- If the device is online, the transaction is pushed to the Firebase / Supabase backend API.
- If the device is offline, the Service Worker caches the HTTP POST request using the Background Sync API, and will automatically execute the database write the moment the user connects to a cellular network.

**Summary to tell the Professor:**
*"The system architecture is a multi-stage deterministic pipeline. It begins with provider classification, moves to targeted bounding-box OCR with dynamic luminance thresholding, passes through a DistilBERT NLP validation layer, performs local PDF reconciliation for fraud prevention, and finally persists the normalized data through a Vue/Pinia store backed by offline-capable Service Workers."*
