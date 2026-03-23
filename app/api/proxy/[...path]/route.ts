import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://14.225.207.221:5092";

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join("/");
  const search = req.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/${path}${search ? `?${search}` : ""}`;

  const init: RequestInit = {
    method: req.method,
    headers: { "Content-Type": "application/json" },
  };

  if (req.method !== "GET" && req.method !== "DELETE") {
    try {
      init.body = JSON.stringify(await req.json());
    } catch {
      // no body
    }
  }

  try {
    const res = await fetch(url, init);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Backend unreachable", detail: error.message },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(req, params);
}
