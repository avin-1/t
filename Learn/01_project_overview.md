# UPI SnapPay - Project Overview

## 1. Introduction
**UPI SnapPay** is a WebAI-powered Progressive Web App (PWA) designed to help small and medium merchants verify UPI transactions instantly without needing expensive IoT Soundboxes (like Paytm Soundbox) or exposing their financial data to third-party cloud servers.

## 2. The Problem We Are Solving
1. **Hardware Cost:** Soundboxes cost ₹2,000-₹5,000 + monthly fees.
2. **Fake Receipt Fraud:** Scammers use fake apps to generate spoofed payment screenshots, which fool visual inspections by merchants.
3. **Data Privacy:** Existing digital verification solutions require uploading receipt images to cloud servers, risking exposure of Personally Identifiable Information (PII).
4. **Offline Capability:** Rural merchants often have poor internet connectivity.

## 3. The Solution
UPI SnapPay processes transaction receipts (images/screenshots) **entirely on the device (Edge AI)** using WebAssembly and Web Workers. It extracts text, understands the semantic meaning (e.g., who paid whom, and how much), checks for signs of fraud, and logs it into a smart ledger.

## 4. Tech Stack
- **Frontend Framework:** Nuxt.js 4, Vue 3, TypeScript, TailwindCSS
- **Optical Character Recognition (OCR):** Tesseract.js (running in Web Workers)
- **Natural Language Processing (NLP):** Transformers.js via ONNX WebAssembly (using a DistilBERT QA model)
- **PDF Processing:** pdfjs-dist (for parsing bank statements securely on the client)
- **Database & Sync:** Firebase / Supabase
- **Offline Support:** PWA (Progressive Web App) Service Workers

## 5. Key Features
- **Zero Cloud Processing:** 100% of OCR and AI runs on the smartphone.
- **Multi-Provider Support:** Handles GPay, PhonePe, and Paytm receipts.
- **Fraud Detection:** Detects failed/pending states and cross-verifies receipts against official bank statement PDFs.
- **Offline-First:** Works without an active internet connection.
