import { NextResponse } from "next/server";

export async function GET() {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!serverUrl) {
      return NextResponse.json(
        { message: "Server URL not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { domain: serverUrl },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching server URL:", error);
    return NextResponse.json(
      { message: "Failed to fetch server URL" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
