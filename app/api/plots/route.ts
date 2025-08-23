// File: app/api/plots/route.ts
import { type NextRequest } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL + "/plot";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pythonUrl = `${PYTHON_API_URL}?${searchParams.toString()}`;
    const apiResponse = await fetch(pythonUrl);

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch plot from Python API");
    }

    const imageBlob = await apiResponse.blob();
    return new Response(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error("Error fetching plot:", error);
    return new Response("Failed to generate plot", { status: 500 });
  }
}