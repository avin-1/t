const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Color palette - Light blue + white fintech, refined for a professional tech presentation
const C = {
  darkBg: "0B1426",        // Very deep navy
  midBg: "122343",         // Mid navy
  accent: "3B82F6",        // Primary blue
  accentLight: "60A5FA",   // Lighter blue
  accentSoft: "EFF6FF",    // Very light blue bg
  white: "FFFFFF",
  offWhite: "F8FAFC",
  cardBg: "1E293B",        // Slate 800 for dark mode cards
  textDark: "0F172A",
  textMid: "334155",
  textLight: "94A3B8",
  green: "10B981",
  orange: "F59E0B",
  red: "EF4444",
  purple: "8B5CF6",
  gradient1: "2563EB",
  gradient2: "3B82F6",
};

function makeShadow() {
  return { type: "outer", blur: 10, offset: 4, angle: 135, color: "000000", opacity: 0.15 };
}

async function buildPPT() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "UPI SnapPay - Technical Architecture";

  // ─────────────────────────────────────────────
  // SLIDE 1 – Title
  // ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };

    // Background shapes for modern tech feel
    s.addShape(pres.shapes.OVAL, { x: 7.0, y: -2.0, w: 6.0, h: 6.0, fill: { color: C.accent, transparency: 85 } });
    s.addShape(pres.shapes.OVAL, { x: -1.0, y: 3.5, w: 4.0, h: 4.0, fill: { color: C.purple, transparency: 85 } });
    
    // Abstract grid pattern lines
    for(let i=0; i<10; i++) {
       s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.5 * i, w: 10, h: 0.01, fill: { color: C.white, transparency: 95 } });
       s.addShape(pres.shapes.RECTANGLE, { x: 1.0 * i, y: 0, w: 0.01, h: 5.625, fill: { color: C.white, transparency: 95 } });
    }

    // Title Text
    s.addText("UPI SnapPay", { x: 0.8, y: 1.8, w: 8.4, h: 1.0, fontSize: 52, color: C.white, bold: true, fontFace: "Segoe UI" });
    s.addText("Edge-AI Powered UPI Verification & Cryptographic Ledger", {
      x: 0.8, y: 2.8, w: 8.4, h: 0.6, fontSize: 20, color: C.accentLight, fontFace: "Segoe UI", italic: true
    });

    // Tech Stack Pills
    const badges = ["Nuxt 4", "WASM", "Transformers.js", "Tesseract", "PWA"];
    badges.forEach((b, i) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.8 + i * 1.5, y: 3.8, w: 1.3, h: 0.4,
        fill: { color: C.midBg }, line: { color: C.accent, width: 1.5 }, rectRadius: 0.2
      });
      s.addText(b, { x: 0.8 + i * 1.5, y: 3.8, w: 1.3, h: 0.4, fontSize: 10, color: C.white, align: "center", valign: "middle", bold: true });
    });
  }

  // ─────────────────────────────────────────────
  // SLIDE 2 – Conceptual Framework & Problem
  // ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: C.darkBg } });
    s.addText("CONCEPTUAL FRAMEWORK", { x: 0.5, y: 0, w: 9, h: 0.6, fontSize: 14, color: C.accentLight, bold: true, charSpacing: 2 });

    s.addText("The Merchant Verification Trilemma", { x: 0.5, y: 0.8, w: 9, h: 0.6, fontSize: 28, color: C.textDark, bold: true, fontFace: "Segoe UI" });

    // 3 Cards explaining the problem
    const problems = [
      { title: "Fake Receipt Fraud", desc: "Spoofed transaction screenshots bypass visual inspection. Requires deep heuristic validation of layout, fonts, and metadata.", color: C.red },
      { title: "Hardware Dependency", desc: "IoT Soundboxes cost ₹2,000+ per unit and rely on cellular network availability, failing in remote rural connectivity zones.", color: C.orange },
      { title: "Data Privacy Risks", desc: "Sending receipt images to cloud servers exposes PII. Processing must be decentralized to the edge (device).", color: C.purple }
    ];

    problems.forEach((p, i) => {
      const x = 0.5 + i * 3.1;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.8, w: 2.8, h: 2.5, fill: { color: C.white }, line: { color: C.textLight, width: 0.5 }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.8, w: 2.8, h: 0.1, fill: { color: p.color } });
      s.addText(p.title, { x: x + 0.2, y: 2.1, w: 2.4, h: 0.4, fontSize: 16, color: C.textDark, bold: true });
      s.addText(p.desc, { x: x + 0.2, y: 2.6, w: 2.4, h: 1.2, fontSize: 12, color: C.textMid, align: "left" });
    });

    s.addText("Solution: A localized, WebAssembly-accelerated PWA that eliminates cloud dependency.", {
      x: 0.5, y: 4.6, w: 9, h: 0.5, fontSize: 16, color: C.accent, bold: true, align: "center"
    });
  }

  // ─────────────────────────────────────────────
  // SLIDE 3 – System Architecture
  // ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };

    s.addText("SYSTEM ARCHITECTURE", { x: 0.5, y: 0.3, w: 4.2, h: 0.3, fontSize: 12, color: C.accentLight, bold: true, charSpacing: 2 });
    s.addText("Decentralized Edge AI Pipeline", { x: 0.5, y: 0.7, w: 8.0, h: 0.6, fontSize: 28, color: C.white, bold: true });

    // Architecture blocks
    const arch = [
      { layer: "Presentation (PWA)", tech: "Nuxt 4 + Vue 3 + Tailwind", desc: "Service workers for offline caching, Web App Manifest for native-like install." },
      { layer: "Optical Engine (WASM)", tech: "Tesseract.js (Worker Threads)", desc: "Multi-PSM image segmentation. Dynamic contrast adjustments via Canvas API." },
      { layer: "Semantic NLP (ONNX)", tech: "Transformers.js (DistilBERT)", desc: "In-browser Question Answering for intent extraction and contextual verification." },
      { layer: "Validation & Ledger", tech: "PDF.js + Firebase/Supabase", desc: "Client-side PDF parsing for bank statement reconciliation. Syncs when online." }
    ];

    arch.forEach((a, i) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.6 + i * 0.9, w: 3.5, h: 0.7, fill: { color: C.midBg }, line: { color: C.accent } });
      s.addText(a.layer, { x: 0.7, y: 1.6 + i * 0.9, w: 3.1, h: 0.35, fontSize: 14, color: C.white, bold: true });
      s.addText(a.tech, { x: 0.7, y: 1.95 + i * 0.9, w: 3.1, h: 0.25, fontSize: 10, color: C.accentLight });

      s.addText("➔", { x: 4.2, y: 1.75 + i * 0.9, w: 0.5, h: 0.4, fontSize: 24, color: C.accentLight, align: "center" });

      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.9, y: 1.6 + i * 0.9, w: 4.5, h: 0.7, fill: { color: C.cardBg } });
      s.addText(a.desc, { x: 5.1, y: 1.6 + i * 0.9, w: 4.1, h: 0.7, fontSize: 12, color: C.offWhite, valign: "middle" });
    });
  }

  // ─────────────────────────────────────────────
  // SLIDE 4 – Deep Dive: Optical Character Recognition (OCR)
  // ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: C.darkBg } });
    s.addText("TECHNICAL DEEP DIVE", { x: 0.5, y: 0, w: 9, h: 0.6, fontSize: 14, color: C.accentLight, bold: true, charSpacing: 2 });
    s.addText("Multi-Pass Robust OCR Extraction", { x: 0.5, y: 0.8, w: 9, h: 0.6, fontSize: 26, color: C.textDark, bold: true });

    // Content
    s.addText("Problem: UPI Provider receipts (GPay, PhonePe, Paytm) use highly stylized fonts, shifting layouts for failed/pending transactions, and variable lighting conditions.", {
      x: 0.5, y: 1.6, w: 9, h: 0.6, fontSize: 13, color: C.textMid, italic: true
    });

    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.4, w: 4.3, h: 2.6, fill: { color: C.white }, line: { color: C.accentLight }, shadow: makeShadow() });
    s.addText("Preprocessing & Layout Mapping", { x: 0.7, y: 2.6, w: 4.0, h: 0.4, fontSize: 16, color: C.accent, bold: true });
    s.addText(
      "• Upscaling & Contrast: Image smoothing and dynamic thresholding via HTML Canvas.\n" +
      "• Provider-Specific Cropping: Defined bounding boxes for GPay vs PhonePe layouts.\n" +
      "• Luminance Inversion: Generates inverted variants for dark-mode screenshots.\n" +
      "• Shift Resilience: Expanded search bands for failed/pending states where buttons push UI elements down.",
      { x: 0.7, y: 3.1, w: 3.9, h: 1.8, fontSize: 12, color: C.textDark, bullet: true }
    );

    s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.4, w: 4.3, h: 2.6, fill: { color: C.white }, line: { color: C.accentLight }, shadow: makeShadow() });
    s.addText("Tesseract Page Segmentation", { x: 5.4, y: 2.6, w: 4.0, h: 0.4, fontSize: 16, color: C.accent, bold: true });
    s.addText(
      "• PSM 6 (Uniform Block): Broad reading of transaction metadata and dates.\n" +
      "• PSM 7 (Single Line) + Whitelist: High precision extraction of numeric amounts.\n" +
      "• PSM 13 (Raw Line): Bypasses heuristics for heavily stylized fonts (e.g. GPay amounts).\n" +
      "• PSM 8 (Single Word): Fallback for isolated numeric clusters avoiding symbol misreads.",
      { x: 5.4, y: 3.1, w: 3.9, h: 1.8, fontSize: 12, color: C.textDark, bullet: true }
    );
  }

  // ─────────────────────────────────────────────
  // SLIDE 5 – Deep Dive: NLP & Semantic Understanding
  // ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };

    s.addText("TECHNICAL DEEP DIVE", { x: 0.5, y: 0.3, w: 4.2, h: 0.3, fontSize: 12, color: C.accentLight, bold: true, charSpacing: 2 });
    s.addText("Semantic Intelligence via Transformers.js", { x: 0.5, y: 0.7, w: 8.0, h: 0.6, fontSize: 26, color: C.white, bold: true });

    s.addText("Execution: ONNX Runtime compiled to WebAssembly running Xenova/distilbert-base-uncased-distilled-squad entirely in-browser.", {
      x: 0.5, y: 1.4, w: 9.0, h: 0.4, fontSize: 12, color: C.green
    });

    // Diagram layout
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 2.0, w: 2.8, h: 3.0, fill: { color: C.cardBg } });
    s.addText("1. Text Normalization", { x: 0.7, y: 2.2, w: 2.4, h: 0.3, fontSize: 14, color: C.white, bold: true });
    s.addText("Corrects OCR hallucinations:\n• '2' to '₹' based on positional regex contexts.\n• Fixes zero/O confusions.\n• Standardizes Date/Time to ISO format.", { x: 0.7, y: 2.6, w: 2.4, h: 1.5, fontSize: 11, color: C.offWhite, bullet: true });

    s.addText("➔", { x: 3.4, y: 3.3, w: 0.4, h: 0.4, fontSize: 24, color: C.accentLight, align: "center" });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.9, y: 2.0, w: 2.8, h: 3.0, fill: { color: C.cardBg } });
    s.addText("2. Heuristic Scoring", { x: 4.1, y: 2.2, w: 2.4, h: 0.3, fontSize: 14, color: C.white, bold: true });
    s.addText("Evaluates intent (Sent vs Received) using weighted keyword maps.\n• Positive cues: 'Paid to', 'Credited'\n• Negative cues: 'Available balance', 'UTR'", { x: 4.1, y: 2.6, w: 2.4, h: 1.5, fontSize: 11, color: C.offWhite, bullet: true });

    s.addText("➔", { x: 6.8, y: 3.3, w: 0.4, h: 0.4, fontSize: 24, color: C.accentLight, align: "center" });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.3, y: 2.0, w: 2.2, h: 3.0, fill: { color: C.cardBg } });
    s.addText("3. DistilBERT QA", { x: 7.5, y: 2.2, w: 1.8, h: 0.3, fontSize: 14, color: C.white, bold: true });
    s.addText("Runs natural language queries against the text:\n'What is the main transaction amount?'\n'Who received the money?'", { x: 7.5, y: 2.6, w: 1.8, h: 1.5, fontSize: 11, color: C.offWhite, bullet: true });
  }

  // ─────────────────────────────────────────────
  // SLIDE 6 – Deep Dive: Fraud Prevention Engine
  // ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: C.darkBg } });
    s.addText("SECURITY ARCHITECTURE", { x: 0.5, y: 0, w: 9, h: 0.6, fontSize: 14, color: C.accentLight, bold: true, charSpacing: 2 });
    s.addText("Cryptographic & Heuristic Verification", { x: 0.5, y: 0.8, w: 9, h: 0.6, fontSize: 26, color: C.textDark, bold: true });

    // Fraud vectors
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.8, w: 9.0, h: 1.0, fill: { color: C.white }, line: { color: C.textLight, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.8, w: 0.15, h: 1.0, fill: { color: C.red } });
    s.addText("Vector 1: Edited Screenshot Spoofing", { x: 0.8, y: 1.9, w: 8.5, h: 0.3, fontSize: 14, color: C.textDark, bold: true });
    s.addText("Defense: OCR parses 'failed' or 'pending' state text globally, even if hidden. Conflicting intent cues ('Paid' vs 'Declined') degrade validation scores instantly.", { x: 0.8, y: 2.2, w: 8.5, h: 0.4, fontSize: 11, color: C.textMid });

    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 9.0, h: 1.0, fill: { color: C.white }, line: { color: C.textLight, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 0.15, h: 1.0, fill: { color: C.orange } });
    s.addText("Vector 2: Fake Receipt Generation Apps", { x: 0.8, y: 3.1, w: 8.5, h: 0.3, fontSize: 14, color: C.textDark, bold: true });
    s.addText("Defense: Provider Classifiers verify layout bounding boxes. If a PhonePe UTR pattern is found inside a GPay layout, the transaction is flagged.", { x: 0.8, y: 3.4, w: 8.5, h: 0.4, fontSize: 11, color: C.textMid });

    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.2, w: 9.0, h: 1.0, fill: { color: C.white }, line: { color: C.textLight, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.2, w: 0.15, h: 1.0, fill: { color: C.green } });
    s.addText("Vector 3: Total Forgery (Ground Truth Verification)", { x: 0.8, y: 4.3, w: 8.5, h: 0.3, fontSize: 14, color: C.textDark, bold: true });
    s.addText("Defense: Client-side PDF Statement Parsing (pdfjs-dist). Securely compares extracted Transaction IDs, Amounts, and Dates against the merchant's actual bank PDF.", { x: 0.8, y: 4.6, w: 8.5, h: 0.4, fontSize: 11, color: C.textMid });
  }

  // ─────────────────────────────────────────────
  // SLIDE 7 – Core Advantages
  // ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };

    s.addText("BUSINESS & TECHNICAL VALUE", { x: 0.5, y: 0.3, w: 4.5, h: 0.3, fontSize: 12, color: C.accentLight, bold: true, charSpacing: 2 });
    s.addText("Why Edge AI is the Future of Fintech", { x: 0.5, y: 0.7, w: 8.0, h: 0.6, fontSize: 28, color: C.white, bold: true });

    const advantages = [
      { title: "Zero Hardware CapEx", desc: "Turns any low-end smartphone into an intelligent POS system.", icon: "📱" },
      { title: "Data Sovereign", desc: "No PII or financial data is transmitted to an external inference API.", icon: "🔒" },
      { title: "Ultra-Low Latency", desc: "WASM execution bypasses network roundtrips for instant verification.", icon: "⚡" },
      { title: "Offline Resilience", desc: "Service Workers ensure operation even in patchy cellular networks.", icon: "📶" }
    ];

    advantages.forEach((a, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.5 + col * 4.6;
      const y = 1.8 + row * 1.6;

      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.3, h: 1.3, fill: { color: "112244" }, line: { color: C.accent, transparency: 50 }, rectRadius: 0.15 });
      s.addText(a.icon, { x: x + 0.2, y: y + 0.3, w: 0.8, h: 0.8, fontSize: 32 });
      s.addText(a.title, { x: x + 1.2, y: y + 0.2, w: 3.0, h: 0.4, fontSize: 16, color: C.white, bold: true });
      s.addText(a.desc, { x: x + 1.2, y: y + 0.6, w: 2.9, h: 0.5, fontSize: 11, color: C.accentLight });
    });
  }

  // ─────────────────────────────────────────────
  // SLIDE 8 – Conclusion
  // ─────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg };

    s.addShape(pres.shapes.OVAL, { x: 1.0, y: -1.0, w: 8.0, h: 8.0, fill: { color: C.accent, transparency: 90 } });
    
    s.addText("UPI SnapPay", { x: 0, y: 1.8, w: 10, h: 1.0, fontSize: 46, color: C.white, bold: true, align: "center", fontFace: "Segoe UI" });
    
    s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 2.8, w: 3.0, h: 0.02, fill: { color: C.accentLight } });

    s.addText("Bridging the gap between rural merchant adoption and advanced cryptography.\nDelivering enterprise-grade fraud detection without the enterprise cost.", {
      x: 1.0, y: 3.0, w: 8.0, h: 0.8, fontSize: 14, color: C.offWhite, align: "center", italic: true
    });

    s.addText("End of Presentation", { x: 0, y: 4.8, w: 10, h: 0.5, fontSize: 12, color: C.accentLight, align: "center", bold: true });
  }

  await pres.writeFile({ fileName: "UPI_SnapPay.pptx" });
  console.log("PPT generated successfully!");
}

buildPPT().catch(console.error);
