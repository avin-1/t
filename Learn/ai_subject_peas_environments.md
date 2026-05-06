# Artificial Intelligence Core Concepts: PEAS & Environment

Since this is a project for your Artificial Intelligence subject, your professor will likely evaluate it based on standard AI textbook definitions (like those in *Artificial Intelligence: A Modern Approach* by Stuart Russell and Peter Norvig). 

Use this document to map your UPI SnapPay application to formal AI terminologies.

---

## 1. Type of AI Agent
UPI SnapPay acts as an **Intelligent Diagnostic & Information Extraction Agent**. 
It perceives noisy, unstructured environments (images) and uses a combination of Computer Vision, Natural Language Processing, and Heuristic Rules to diagnose if a transaction is authentic or fraudulent.

---

## 2. PEAS Description
The PEAS framework defines an AI agent based on its Performance, Environment, Actuators, and Sensors.

* **Performance Measure (P):**
  - High accuracy in extracting the exact transaction amount and merchant name.
  - Correct classification of the payment intent (Sent, Received, Pending, Failed).
  - Maximizing True Positives (correctly identifying valid receipts) and minimizing False Positives (accepting fake receipts).
  - Low latency processing (running in milliseconds via WASM).

* **Environment (E):**
  - **Primary:** The digital image pixel data (screenshots, camera photos) uploaded by the user.
  - **Secondary:** Official bank statement PDFs used for ground-truth reconciliation.
  - The environment is highly noisy: images have varying resolutions, dark/light modes, compression artifacts, and different provider layouts (GPay, PhonePe, Paytm).

* **Actuators (A):**
  - **UI Updates:** Rendering the verification status (Green Success Tick or Red Warning Cross).
  - **Data Persistence:** Pushing verified transaction records into the smart ledger (Pinia Store / Firebase Database).
  - **Canvas Manipulation:** Programmatically inverting image colors or cropping specific layout regions.

* **Sensors (S):**
  - **Input Devices:** The smartphone camera or gallery file uploader.
  - **Data Readers:** HTML5 Canvas API (reading `ImageData` pixels for luminance), Tesseract OCR Engine (sensing characters), and `pdfjs-dist` (sensing text layers inside PDFs).

---

## 3. Properties of the Task Environment
How does your AI perceive the world it operates in?

* **Partially Observable (Not Fully Observable):** 
  The agent only sees a 2D image of a receipt. It cannot inherently "see" the true state of the bank account. The image might be a photoshopped fake (meaning the image hides the true state). It only becomes Fully Observable if the user uploads the Bank PDF.
* **Stochastic (Not Deterministic):** 
  If you feed the exact same image with slightly different compression or lighting, the OCR might output slightly different garbage characters. The outcome of the environment state is somewhat unpredictable due to real-world noise.
* **Episodic (Not Sequential):** 
  Each receipt verification is a standalone "episode". The AI's decision on Receipt A does not impact its decision on Receipt B. The agent does not need to look ahead at future states.
* **Static (Not Dynamic):** 
  While the AI is processing the receipt (running OCR and NLP), the receipt image itself is not changing or moving. The environment is paused during the AI's "think" cycle.
* **Discrete (Not Continuous):** 
  The environment state is discrete. The output classes are fixed (GPay, PhonePe, Paytm) and the text characters parsed are discrete symbols.
* **Single-Agent:** 
  UPI SnapPay acts alone to solve the problem. There is no other AI agent competing or cooperating with it in the environment.

---

## 4. Mapping Your Code to Formal AI Domains
If asked what branches of AI your project uses, you can point to these three:

1. **Computer Vision (Perception):** 
   Using Tesseract.js to interpret pixel arrangements as discrete textual symbols. We also utilize thresholding and luminance inversion (classic computer vision pre-processing).
2. **Natural Language Processing (NLP):** 
   Using the `distilbert-base-uncased-distilled-squad` Transformer model. We utilize **Attention Mechanisms** to parse the semantic intent of strings (e.g., distinguishing whether money was "sent to" or "received from") and performing **Extractive Question-Answering** to find the transaction amount.
3. **Expert Systems (Heuristics):** 
   Before Deep Learning triggers, the app uses a rule-based expert system (`useProviderClassifier.ts`) which relies on hard-coded knowledge (e.g., knowing PhonePe puts the amount on the right) to apply bounding boxes.
