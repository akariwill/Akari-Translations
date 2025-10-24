import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const novelsDataPath = path.join(process.cwd(), "novels-data.json");

  if (!fs.existsSync(novelsDataPath)) {
    return NextResponse.json({ error: "Novels data not found. Run 'npm run generate-novels-data' first." }, { status: 404 });
  }

  const novelsData = fs.readFileSync(novelsDataPath, "utf-8");
  const novels = JSON.parse(novelsData);

  return NextResponse.json(novels);
}
