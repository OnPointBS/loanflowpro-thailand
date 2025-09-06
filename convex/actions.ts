"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const processOCR = action({
  args: {
    documentId: v.id("documents"),
    imageUrl: v.string(),
  },
  handler: async (ctx, { documentId, imageUrl }) => {
    // Mock OCR processing for now
    // In a real implementation, you would use Google Vision API here
    console.log(`Processing OCR for document ${documentId} with image ${imageUrl}`);
    
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock OCR results
    const mockOCRResults = {
      text: "Sample extracted text from document",
      confidence: 0.95,
      boundingBoxes: [],
    };
    
    // Update document with OCR results
    await ctx.runMutation(api.documents.updateDocument, {
      documentId,
      description: mockOCRResults.text,
    });
    
    return { success: true, results: mockOCRResults };
  },
});
