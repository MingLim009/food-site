import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const buf = await readFile(
    path.join(process.cwd(), "public/brand/eloalimentar-capa-500.jpg"),
  );
  return new Response(buf, {
    headers: {
      "Content-Type": "image/jpeg",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
