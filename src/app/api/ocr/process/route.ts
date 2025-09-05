import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Process OCR
    await convex.mutation(api.documents.processOCR, {
      documentId,
    });

    return NextResponse.json({
      success: true,
      message: "OCR processing started",
    });
  } catch (error) {
    console.error("OCR processing error:", error);
    return NextResponse.json(
      { error: "OCR processing failed" },
      { status: 500 }
    );
  }
}
