# Deep Dive: The OCR Enhancement Pipeline

When an examiner asks, *"How did you improve standard OCR to make it work on complex receipts?"*, they want to hear the exact image processing steps you implemented before Tesseract even sees the image.

## 1. The Problem with Standard OCR on Receipts
If you feed a raw screenshot of a GPay receipt to Tesseract, it will likely fail. 
- **Dark Mode:** White text on dark blue backgrounds confuses standard OCR models trained on black text over white paper.
- **Stylized Fonts:** The large amounts on GPay use non-standard geometric fonts.
- **Resolution:** Screenshots taken on low-end Androids have compression artifacts.

## 2. Image Pre-Processing (The Canvas API)
Before we run Tesseract, we manipulate the image at the pixel level using the HTML5 `<canvas>` API (`CanvasRenderingContext2D.getImageData`).

### Step A: Provider-Specific Bounding Box Cropping
Instead of scanning the whole image, we slice it. If the `ProviderClassifier` detects a PhonePe receipt, we know the amount is located at `x: 0.65, y: 0.10, width: 0.35, height: 0.15` (relative to the image size). 
We extract *only* this tiny slice and scale it up by 5.5x (`scale: 5.5`). This gives Tesseract massive, clear letters to read, reducing processing time from seconds to milliseconds.

### Step B: Luminance Detection & Inversion (Handling Dark Mode)
We calculate the perceived brightness (Luminance) of the cropped region using the standard human-eye perception formula:
`Luminance = (Red * 0.299) + (Green * 0.587) + (Blue * 0.114)`

We average this across all pixels. If `AverageLuminance < 150`, we mathematically know the image has a dark background. 
We then loop through the `ImageData` array and invert the pixels (`255 - pixelValue`). This instantly converts a dark-mode receipt into a traditional high-contrast "black text on white paper" image.

### Step C: Contrast Stretching & Thresholding
We push the light gray pixels to pure white (`255`) and dark gray pixels to pure black (`0`). This removes compression artifacts, watermarks, and background patterns, leaving only perfectly crisp text edges.

## 3. Multi-Variant OCR Execution
Because we cannot predict which enhancement will work best, we generate an array of **OcrVariants**:
1. `amount-band-grayscale`
2. `amount-band-inverted`
3. `amount-band-raw` (PSM 13)

We run all these variants through Tesseract *concurrently* (using Web Workers).

## 4. Page Segmentation Mode (PSM) Overrides
Once the image is prepped, we inject it into Tesseract with strict configurations:
- **PSM 7 (Single Line):** We force the OCR engine to treat the image as a single line of text.
- **Character Whitelist:** We pass `tessedit_char_whitelist: '0123456789.,₹'`. This absolutely prevents Tesseract from hallucinating letters like reading a `0` as an `O` or an `S` as a `5`.
- **PSM 13 (Raw Line):** For GPay's highly custom fonts, standard Tesseract applies a "dictionary check" trying to fix spelling mistakes. PSM 13 turns the dictionary off, forcing it to just output the raw geometry it sees. This bypasses GPay's font obfuscation entirely.

**Summary to tell the Professor:**
*"I don't just use OCR. I built a dynamic image pre-processing pipeline using the Canvas API to crop, scale, threshold, and invert luminance based on the pixel data. Then I run multiple concurrent Tesseract variants using specific Page Segmentation Modes and Character Whitelists to guarantee precision."*
