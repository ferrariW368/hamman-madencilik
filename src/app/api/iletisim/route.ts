import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/writeClient";

type IletisimPayload = {
  adSoyad: string;
  eposta: string;
  konu: string;
  mesaj: string;
};

function isValidPayload(value: unknown): value is IletisimPayload {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.adSoyad === "string" &&
    payload.adSoyad.trim().length > 0 &&
    typeof payload.eposta === "string" &&
    payload.eposta.trim().length > 0 &&
    typeof payload.konu === "string" &&
    payload.konu.trim().length > 0 &&
    typeof payload.mesaj === "string"
  );
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Geçersiz form verisi." }, { status: 400 });
  }

  await writeClient.create({
    _type: "mesaj",
    adSoyad: body.adSoyad,
    eposta: body.eposta,
    konu: body.konu,
    mesaj: body.mesaj,
    gonderimTarihi: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
