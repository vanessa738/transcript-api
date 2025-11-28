import fetch from "node-fetch";
import mammoth from "mammoth";

export default async function handler(req, res) {
  try {
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: "Filename parameter is required" });
    }

    // 1. Fetch index.json from your OneDrive shared folder
    const indexUrl = "https://1drv.ms/f/c/ea3fc51115cf173a/EnQerG5PrUdJlrYX3KpRuwsBG1eat7AdnO3CtcIzho37fA?e=YHDvh2/index.json";
    const indexResp = await fetch(indexUrl);
    if (!indexResp.ok) {
      return res.status(500).json({ error: "Could not fetch index.json", status: indexResp.status });
    }
    const index = await indexResp.json();
    
    // 2. Find the entry matching the requested filename
    const entry = index.transcripts.find(t => t.filename === filename);
    if (!entry) {
      return res.status(404).json({ error: "Transcript not found in index.json" });
    }

    // 3. Download .docx
    const fileResp = await fetch(entry.url);
    if (!fileResp.ok) {
      return res.status(500).json({ error: "Could not download transcript file", status: fileResp.status });
    }
    const arrayBuffer = await fileResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Convert .docx → text
    const result = await mammoth.extractRawText({ buffer });

    // 5. Return transcript text
    return res.status(200).json({
      title: entry.title,
      filename: entry.filename,
      transcript: result.value
    });

  } catch (err) {
    console.error("Transcript API error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.toString() });
  }
}
