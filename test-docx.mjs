import fs from "fs";
import { Document, Packer, Paragraph, TextRun } from "docx";

async function run() {
  try {
    const doc = new Document({
      sections: [{ properties: {}, children: [new Paragraph({ children: [new TextRun({ text: "Hello" })] })] }]
    });
    const buffer = await Packer.toBuffer(doc);
    console.log("Success! Buffer size:", buffer.length);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
