import { NextResponse } from "next/server";
import { generateDocxReport } from "@/lib/report-generator";

export async function POST(req: Request) {
  try {
    const { caseData, comments } = await req.json();

    if (!caseData || !comments) {
      return NextResponse.json({ error: "Missing caseData or comments" }, { status: 400 });
    }

    const buffer = await generateDocxReport(caseData, comments);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Laporan_Investigasi_${caseData.policyNumber || "TBD"}.docx"`,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
