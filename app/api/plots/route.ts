// In app/api/plots/route.ts
import { type NextRequest } from "next/server";

const PYTHON_API_URL = "http://127.0.0.1:8000/plot";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward the search parameters to the Python API
    const pythonUrl = `${PYTHON_API_URL}?${searchParams.toString()}`;

    const apiResponse = await fetch(pythonUrl);

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch plot from Python API");
    }

    // Get the image data as a blob
    const imageBlob = await apiResponse.blob();

    // Return the image data directly to the frontend
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