# Detailed Question & Answers

Here are standard questions your examiner is likely to ask, with clear, detailed answers that show off your technical understanding.

### Q1: What is the main objective of your project?
**Answer:** The objective is to provide a highly secure, privacy-first alternative to hardware soundboxes (like Paytm Soundbox) for small UPI merchants. It allows them to verify transaction receipts instantly using on-device Artificial Intelligence (Edge AI), entirely offline, without sending any sensitive financial data to cloud servers.

### Q2: Why did you choose to do this completely on the device instead of using a cloud API like AWS or Google Cloud?
**Answer:** Three critical reasons:
1. **Privacy:** Sending a customer's personal receipt (which contains names, bank details, and balances) to an external cloud server is a major data privacy risk. By processing it on the device, the image never leaves the phone.
2. **Zero Cloud Compute Cost:** Cloud APIs charge money per scan. By utilizing the user's smartphone processor (via WebAssembly), we reduce our server costs to exactly zero.
3. **Offline Capability:** Rural Indian merchants often face patchy internet. Our app works instantly even in airplane mode.

### Q3: How do you extract text from the receipt image?
**Answer:** We use **Tesseract.js**, which is an Optical Character Recognition (OCR) engine ported to JavaScript. However, raw OCR is inaccurate. We first use the HTML5 Canvas API to enhance the image contrast and crop it into specific regions (bounding boxes) based on whether it's a GPay or PhonePe receipt. If the user uploads a dark-mode screenshot, our code detects the low luminance and programmatically inverts the colors so the text becomes readable for the OCR engine.

### Q4: What happens if the OCR misreads the text? How do you reliably get the amount?
**Answer:** We use a "defense-in-depth" approach. 
First, we tune Tesseract using **Page Segmentation Modes (PSM)** and character whitelists to force it to only look for numbers.
If the layout is confusing and regular expressions fail, we fall back to an **NLP (Natural Language Processing) model** called DistilBERT, which we run locally in the browser. We pass the OCR text to the model and perform a Question-Answering task, asking it: *"What is the transaction amount?"* Because BERT understands context, it can pluck the correct amount out of messy text.

### Q5: There are apps that generate fake GPay receipts. How do you prevent a scammer from showing a fake screenshot?
**Answer:** Fake apps generate images that look visually perfect, so visual AI isn't enough. We implemented two defenses:
1. **Heuristic Conflict Detection:** We analyze the text for conflicting intent. For example, if the app detects the word "Successful" but the OCR finds tiny text near the bottom saying "Pending" or "Failed", our system flags it.
2. **Ground-Truth PDF Verification:** The ultimate defense. The merchant can load their official bank statement PDF into our app. Our app parses the PDF locally using `pdfjs-dist` and cross-checks the Transaction ID and Amount. If it's in the bank statement, it's 100% real. If not, it's a fake receipt.

### Q6: Can you explain how your app works offline?
**Answer:** We built the project as a **Progressive Web App (PWA)** using Nuxt.js. When the merchant visits the site for the first time, a **Service Worker** installs in the background. It caches all the HTML, CSS, JavaScript, and crucially, it downloads the AI model weights (the WASM files for Tesseract and Transformers.js) into the browser's local storage. From that point on, if they disconnect from the internet, the app serves files from the local cache and performs all AI calculations locally.
