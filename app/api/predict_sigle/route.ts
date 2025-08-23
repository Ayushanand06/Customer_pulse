// File: app/api/predict_sigle/route.ts
import { type NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL + "/predict_sigle";

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json();
    const apiResponse = await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("Python API Error:", errorBody);
      throw new Error(`Prediction API failed with status ${apiResponse.status}`);
    }
    const predictionResult = await apiResponse.json();
    return NextResponse.json(predictionResult);
  } catch (error) {
    console.error("Error in Next.js predict-single route:", error);
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }
}