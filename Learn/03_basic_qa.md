# Basic Question & Answers

Here are the standard questions your examiner is likely to ask, and how to answer them.

### Q1: What is the main objective of your project?
**Answer:** The objective is to provide a free, privacy-first alternative to hardware soundboxes for UPI merchants. It allows them to verify transaction receipts instantly using on-device AI (Edge AI) without sending sensitive financial data to cloud servers.

### Q2: Why not just send the image to a cloud server like Google Vision API?
**Answer:** Two main reasons: 
1. **Privacy:** Sending personal receipts to external servers exposes customer data. 
2. **Cost & Latency:** Cloud APIs charge per request and require a fast internet connection. Our on-device approach is free, instant, and works offline.

### Q3: How do you extract text from the receipt?
**Answer:** We use **Tesseract.js**, an OCR library that runs in the browser using Web Workers. Before feeding the image to Tesseract, we use the HTML Canvas API to crop the image into specific regions, enhance contrast, and invert colors if the user uploaded a dark-mode screenshot.

### Q4: What if Tesseract extracts the wrong text?
**Answer:** To handle OCR errors, we use a defense-in-depth approach. First, we use strict Regular Expressions (RegEx) to find UPI IDs and Dates. If RegEx fails to find the amount, we fall back to an NLP (Natural Language Processing) model running in the browser (Transformers.js) which uses AI Question-Answering to intelligently guess the amount from the surrounding text.

### Q5: How do you prevent users from showing a "Fake Receipt" app?
**Answer:** We have two layers of defense. First, our heuristics engine looks for conflicting text (e.g., if a receipt says "Successful" but the OCR finds tiny text saying "Pending" or "Failed"). Second, we built a Bank Statement Verification tool. The merchant can load their bank's PDF statement into the app, and our app parses the PDF locally to cross-check if the Transaction ID and Amount genuinely exist in the official bank record.

### Q6: What technologies are used in the frontend?
**Answer:** The app is built on **Nuxt.js 4** (a Vue.js framework) using **TypeScript** for type safety and **TailwindCSS** for styling. It is configured as a PWA (Progressive Web App) so merchants can install it on their home screen like a native app.

### Q7: How does it work offline?
**Answer:** Because we use a PWA with Service Workers, the HTML/JS assets are cached on the device. Furthermore, the AI models (Tesseract WASM and Transformers.js ONNX files) are cached locally after the first load. Data is saved in the browser cache and syncs with Firebase only when the internet connects.
