# Deep Dive: The DistilBERT NLP Flow

If the examiner asks, *"How exactly does your AI model understand the text? Explain the end-to-end flow of the Transformers.js implementation,"* you can use this technical breakdown.

## 1. The Core Architecture: Transformers.js & ONNX
We are not making API calls to ChatGPT or any server. We are running a **Deep Learning Transformer model** directly inside the browser's memory.
- We use the library `@xenova/transformers`.
- The model is `distilbert-base-uncased-distilled-squad` (a smaller, faster version of Google's BERT, fine-tuned on the SQuAD dataset for Question-Answering).
- It executes via the **ONNX Runtime (Open Neural Network Exchange)** compiled to WebAssembly (WASM), which allows Python-level deep learning math (like Matrix Multiplications) to run at near-native speeds in JavaScript.

## 2. End-to-End Technical Flow (Example Scenario)

Let's assume our OCR extracted a very noisy, confusing string:
`"Success.. You transfrred 1,250.00 rupees to Rajesh K on 12 Feb. UTR: 8937492"`
*(Notice the spelling mistakes and weird formatting that would break a Regular Expression).*

### Step A: Tokenization
The browser downloads the DistilBERT model weights (cached in IndexedDB). The raw text is passed to the model's **Tokenizer**. 
The Tokenizer converts the text into mathematical vectors (arrays of numbers) that the neural network can understand. It maps words to sub-word IDs.

### Step B: The Question Formulation
We programmatically construct a query context:
**Context:** `"Success.. You transfrred 1,250.00 rupees to Rajesh K on 12 Feb. UTR: 8937492"`
**Question:** `"What is the main transaction amount?"`

### Step C: Inference (The Forward Pass)
The tokenized arrays are pushed through the layers of the DistilBERT model inside WebAssembly. 
BERT is a "Bidirectional Encoder". It doesn't just read left-to-right; it looks at the words surrounding the numbers. 
It sees `"transfrred"` before the number and `"rupees"` after it. Through its attention heads, it mathematically scores every word in the context to determine the probability of it being the answer to the question.

### Step D: Extraction (Logits & Span Scoring)
The model outputs raw tensor data containing "Start Logits" and "End Logits" (probabilities of where the answer starts and ends in the sentence).
It calculates that the highest probability span starts at `"1,250.00"`.
It returns a JSON object to our JavaScript:
```json
{
  "answer": "1,250.00",
  "score": 0.94,
  "startIndex": 25,
  "endIndex": 33
}
```

### Step E: Sanitization
We take the extracted answer `1,250.00` and pass it through our `parseAmount()` utility function. It strips the commas and converts it to a standard JavaScript `Number` type: `1250.00`.

## 3. Why is this better than RegEx?
If PhonePe updates their app tomorrow and changes the text from `"Amount Paid: 500"` to `"Total Debited: 500"`, a RegEx looking for `Amount Paid:` will immediately break in production. 
Because BERT understands the *semantic relationship* of English words, it knows that "Debited" is synonymous with "Paid" in financial contexts. The model adapts to layout changes automatically, making our application highly resilient.

**Summary to tell the Professor:**
*"We use Transformers.js to execute a quantized DistilBERT ONNX model via WebAssembly directly in the browser's memory. By passing the OCR text into a Question-Answering pipeline, the model uses its attention mechanisms to calculate the probability span of the exact amount or merchant name, allowing us to extract data semantically rather than relying on brittle Regular Expressions."*
