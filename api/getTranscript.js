{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import fetch from "node-fetch";\
import mammoth from "mammoth";\
\
export default async function handler(req, res) \{\
  try \{\
    const \{ filename \} = req.query;\
\
    if (!filename) \{\
      return res.status(400).json(\{\
        error: "You must provide a filename, including .docx"\
      \});\
    \}\
\
    // Your public index.json link\
    const indexUrl = "https://1drv.ms/w/c/ea3fc51115cf173a/EUHHy-HQd9tGsC7CI-CWy54BuACVq4mugv_M6AwkzRmukg?e=yYUcVl";\
\
    // 1. Fetch index.json\
    const indexResponse = await fetch(indexUrl);\
    const indexData = await indexResponse.json();\
\
    // 2. Find transcript entry\
    const entry = indexData.transcripts.find(\
      (t) => t.filename.toLowerCase() === filename.toLowerCase()\
    );\
\
    if (!entry) \{\
      return res.status(404).json(\{\
        error: "Transcript not found in index.json"\
      \});\
    \}\
\
    // 3. Download .docx file from OneDrive\
    const fileResponse = await fetch(entry.url);\
    const arrayBuffer = await fileResponse.arrayBuffer();\
    const buffer = Buffer.from(arrayBuffer);\
\
    // 4. Convert .docx \uc0\u8594  plain text\
    const result = await mammoth.extractRawText(\{ buffer \});\
\
    // 5. Return transcript text\
    return res.status(200).json(\{\
      title: entry.title,\
      filename: entry.filename,\
      transcript_text: result.value\
    \});\
  \} catch (error) \{\
    return res.status(500).json(\{\
      error: "Server error",\
      details: error.message\
    \});\
  \}\
\}\
}