import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/writeClient";

type IletisimPayload = {
  adSoyad: string;
  eposta: string;
  konu: string;
  mesaj: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPayload(value: unknown): value is IletisimPayload {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.adSoyad === "string" &&
    payload.adSoyad.trim().length > 0 &&
    payload.adSoyad.length <= 120 &&
    typeof payload.eposta === "string" &&
    payload.eposta.trim().length > 0 &&
    EMAIL_PATTERN.test(payload.eposta) &&
    typeof payload.konu === "string" &&
    payload.konu.trim().length > 0 &&
    payload.konu.length <= 200 &&
    typeof payload.mesaj === "string" &&
    payload.mesaj.length <= 5000
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Geçersiz form verisi." }, { status: 400 });
  }

  try {
    await writeClient.create({
      _type: "mesaj",
      adSoyad: body.adSoyad,
      eposta: body.eposta,
      konu: body.konu,
      mesaj: body.mesaj,
      gonderimTarihi: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Mesaj kaydedilemedi, lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
