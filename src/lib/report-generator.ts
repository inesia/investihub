import fs from "fs/promises";
import path from "path";
// docx will be required dynamically to bypass Turbopack parsing
import type { CaseWithRelations, CommentWithAuthor } from "@/types";
import { STATUS_LABELS } from "@/types";
import { formatDateTime } from "./utils";

/**
 * Strips simple HTML tags and converts them to standard TextRuns or Paragraphs.
 * Since docx requires building paragraphs manually, we do a basic parse here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseHtmlToDocxElements(html: string, ParagraphCls: any, TextRunCls: any): any[] {
  if (!html) return [];
  
  // A very basic HTML to plain text conversion for docx.
  const text = html
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<ul>/g, "")
    .replace(/<\/ul>/g, "")
    .replace(/<li>/g, "• ")
    .replace(/<\/li>/g, "\n")
    .replace(/<strong>/g, "") // We lose bold styling for simplicity in this basic parser
    .replace(/<\/strong>/g, "")
    .replace(/<em>/g, "")
    .replace(/<\/em>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  
  // Split by newlines and create a paragraph for each
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  
  return lines.map((line: string) => 
    new ParagraphCls({
      children: [new TextRunCls({ text: line, size: 24 })],
      spacing: { after: 120 }
    })
  );
}

export async function generateDocxReport(caseData: CaseWithRelations, comments: CommentWithAuthor[]) {
  // Use require so Turbopack completely ignores this package during static analysis
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const docx = require("docx");
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    ImageRun,
    AlignmentType,
    PageBreak,
    HeadingLevel,
    BorderStyle
  } = docx;

  // Fetch logo as array buffer using fs in node
  let logoBuffer: Buffer | null = null;
  try {
    const logoPath = path.join(process.cwd(), "public", "global_investigasi.png");
    logoBuffer = await fs.readFile(logoPath);
  } catch (err) {
    console.error("Failed to load logo", err);
  }

  // Cover Page Elements
  const children = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, before: 1000 },
      children: [
        new TextRun({ text: "LAPORAN INVESTIGASI", bold: true, size: 40 }), 
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      border: { bottom: { color: "000000", space: 10, value: BorderStyle.SINGLE, size: 12 } },
      children: [
        new TextRun({ text: "KLAIM CRITICAL ILLNESS", bold: true, size: 40 }),
      ]
    })
  );

  // Insured Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, before: 600 },
      children: [
        new TextRun({ text: "NAMA TERTANGGUNG :", bold: true, size: 32 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({ text: (caseData.insuredName || "").toUpperCase(), bold: true, size: 32 }),
      ]
    })
  );

  // Policy No
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "NO. POLIS :", bold: true, size: 32 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [
        new TextRun({ text: (caseData.policyNumber || "").toUpperCase(), bold: true, size: 32 }),
      ]
    })
  );

  // City
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [
        new TextRun({ text: `KOTA ${(caseData.city || "JAKARTA").toUpperCase()}`, bold: true, size: 32 }),
      ]
    })
  );

  // Logo
  if (logoBuffer) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 800, before: 400 },
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: {
              width: 220,
              height: 220,
            },
          }),
        ]
      })
    );
  } else {
    // Spacer if no logo
    children.push(
      new Paragraph({
        spacing: { after: 2000 },
        children: [new TextRun({ text: "" })]
      })
    );
  }

  // Footer
  const currentYear = new Date().getFullYear();
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 },
      children: [
        new TextRun({ text: "PT. GLOBAL INVESTIGASI", bold: true, size: 32 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "JAKARTA", bold: true, size: 32 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: currentYear.toString(), bold: true, size: 32 }),
      ]
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ---------------------------------------------------------
  // PAGE 2: Case Summary & Findings
  // ---------------------------------------------------------
  
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: "Ringkasan Kasus", bold: true, size: 32 })
      ]
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Nama Tertanggung: ", bold: true, size: 24 }),
        new TextRun({ text: caseData.insuredName, size: 24 }),
      ]
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "No. Polis: ", bold: true, size: 24 }),
        new TextRun({ text: caseData.policyNumber, size: 24 }),
      ]
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Diagnosa: ", bold: true, size: 24 }),
        new TextRun({ text: caseData.diagnosis || "-", size: 24 }),
      ]
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Status Kasus: ", bold: true, size: 24 }),
        new TextRun({ text: STATUS_LABELS[caseData.status], size: 24 }),
      ]
    }),
    new Paragraph({
      spacing: { after: 600 },
      children: [
        new TextRun({ text: "Deskripsi: ", bold: true, size: 24 }),
        new TextRun({ text: caseData.description || "-", size: 24 }),
      ]
    })
  );

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400, before: 400 },
      children: [
        new TextRun({ text: "Log Penyelidikan & Laporan Lapangan", bold: true, size: 32 })
      ]
    })
  );

  // Append Comments
  if (comments && comments.length > 0) {
    const rootComments = comments
      .filter(c => !c.parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    rootComments.forEach((comment, index) => {
      // Header for the report
      children.push(
        new Paragraph({
          spacing: { before: 400, after: 100 },
          children: [
            new TextRun({ 
              text: `Laporan ${index + 1} oleh ${comment.author.name} (${comment.author.role})`, 
              bold: true, 
              size: 26,
              color: "0f172a" 
            })
          ]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ 
              text: formatDateTime(comment.createdAt), 
              italics: true, 
              size: 22,
              color: "64748b" 
            })
          ]
        })
      );

      // Status of the report
      let statusText = "Status: Menunggu Konfirmasi";
      if (comment.isApproved) {
        statusText = "Status: Dikonfirmasi Admin";
      }
      if (comment.clientStatus === "CONFIRMED") {
        statusText = "Status: Dikonfirmasi Klien";
      } else if (comment.clientStatus === "HOLD") {
        statusText = "Status: Ditunda Klien";
      }
      
      children.push(
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({ 
              text: statusText, 
              bold: true, 
              size: 22,
              color: comment.isApproved || comment.clientStatus === "CONFIRMED" ? "16a34a" : "ca8a04" 
            })
          ]
        })
      );

      // Content
      if (comment.contentHtml) {
        const paragraphs = parseHtmlToDocxElements(comment.contentHtml, Paragraph, TextRun);
        children.push(...paragraphs);
      } else {
        const lines = comment.content.split("\n");
        lines.forEach(line => {
          if (line.trim()) {
            children.push(
              new Paragraph({
                spacing: { after: 120 },
                children: [new TextRun({ text: line, size: 24 })]
              })
            );
          }
        });
      }

      children.push(
        new Paragraph({
          spacing: { after: 200 },
          border: { bottom: { color: "e2e8f0", space: 1, value: BorderStyle.SINGLE, size: 6 } },
          children: [new TextRun({ text: "" })]
        })
      );
    });
  } else {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Belum ada laporan lapangan.", italics: true, size: 24 })]
      })
    );
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
