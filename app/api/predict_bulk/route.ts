// File: app/api/predict_bulk/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { json2csv } from "json-2-csv";

// I'm assuming you want to keep the URL with the underscore to match your Python file
const PYTHON_API_URL = process.env.PYTHON_API_URL + "/predict_bulk"; 

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").filter(line => line.trim() !== '');
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ''));
    
    const jsonData = lines.slice(1).map(line => {
      const values = line.split(",");
      // FIX: Define a specific type for the object to avoid 'any'
      const obj: { [key: string]: string | number } = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim().replace(/"/g, '') || '';
        // Check if value is a number before converting
        obj[header] = !isNaN(Number(value)) && value !== '' ? Number(value) : value;
      });
      return obj;
    });

    const apiResponse = await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("Python API Error:", errorBody);
        throw new Error(`Prediction API failed with status ${apiResponse.status}`);
    }

    const resultsJson = await apiResponse.json();
    const csvContent = await json2csv(resultsJson, {});

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="predictions_${file.name}"`,
      },
    });
  } catch (error) {
    console.error("Error in Next.js predict-bulk route:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}