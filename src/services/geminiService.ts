/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WasteCategory } from "../types";

export interface ClassificationResult {
  category: WasteCategory;
  explanation: string;
  confidence: number;
}

export async function classifyWaste(base64Image: string): Promise<ClassificationResult> {
  const response = await fetch("/api/classify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to classify waste");
  }

  return response.json();
}
