# UPI SnapPay - Detailed Project Overview

## 1. Introduction
**UPI SnapPay** is a WebAI-powered Progressive Web App (PWA) designed to help small and medium merchants verify UPI transactions instantly. It eliminates the need for expensive hardware (like Paytm Soundbox) and provides a secure, privacy-first way to stop fake receipt fraud without sending any data to the cloud.

## 2. The Core Problems We Are Solving
1. **The Cost of Hardware:** Soundboxes are expensive (₹2,000-₹5,000 upfront + monthly rental fees). For a street vendor, this eats into their daily profit margin.
2. **The "Fake Receipt" Epidemic:** Scammers use malicious apps to generate fake payment success screens. Visually, they look 100% real. Merchants in a rush just look at the green tick and lose money.
3. **Data Privacy & Cloud Costs:** Existing digital scanners require you to upload the receipt to a cloud server (like Google Vision API) for processing. This is bad for two reasons:
   - **Privacy:** You are exposing customer financial data (UPI IDs, names, balances) to a third-party server.
   - **Latency & Cost:** Cloud APIs cost money per scan and fail if the merchant's internet is slow.

## 3. The UPI SnapPay Solution
UPI SnapPay acts as an intelligent, offline-capable scanner right in the merchant's pocket. It processes screenshots or photos of receipts **entirely on the device (Edge AI)**. 

### How is this possible?
We use modern web capabilities (WebAssembly and Web Workers) to run complex Artificial Intelligence models directly inside the phone's browser. It extracts the text, understands the context (who paid whom), cross-checks it for fraud, and logs it into a secure ledger.

## 4. The Technology Stack Explained Simply
- **Nuxt.js 4 & Vue 3:** The framework used to build the user interface. It makes the app fast and responsive.
- **TailwindCSS:** Used for designing a beautiful, modern, fintech-style user interface.
- **Tesseract.js (OCR):** The "Eyes" of the app. It reads the text from the image. It runs in "Web Workers" so it doesn't freeze the screen.
- **Transformers.js (DistilBERT):** The "Brain" of the app. A miniaturized AI model running via WebAssembly (ONNX) that actually *understands* the meaning of the text.
- **pdfjs-dist:** Used to securely read official bank statements directly on the phone to definitively prove a transaction is real.
- **PWA (Progressive Web App):** Allows the merchant to "Install" the website onto their home screen. It uses "Service Workers" to cache files so the app opens and works even with zero internet connection.
