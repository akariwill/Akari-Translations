import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const novelsDir = path.join(process.cwd(), "public", "novels");

  if (!fs.existsSync(novelsDir)) {
    return NextResponse.json({ error: "No novels folder found." }, { status: 404 });
  }

  const novels = fs.readdirSync(novelsDir).map((folder) => {
    const novelPath = path.join(novelsDir, folder);
    const files = fs.readdirSync(novelPath);

    const cover = files.find((f) => f.toLowerCase().includes("cover"));
    const volumes = files.filter((f) => f.endsWith(".pdf"));
    const synopsisFile = files.find((f) => f === "synopsis.json");

    let synopsis = null;
    if (synopsisFile) {
      const synopsisPath = path.join(novelPath, synopsisFile);
      const synopsisData = fs.readFileSync(synopsisPath, "utf-8");
      synopsis = JSON.parse(synopsisData).synopsis;
    }

    return {
      title: folder,
      cover: cover ? `/novels/${folder}/${cover}` : null,
      volumes: volumes.map((v) => `/novels/${folder}/${v}`),
      synopsis: synopsis,
    };
  });

  return NextResponse.json(novels);
}
