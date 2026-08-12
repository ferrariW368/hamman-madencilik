import { createClient } from "@sanity/client";
import { config } from "dotenv";
config({ path: ".env.local" });
import { hizmetler, urunler, sirketBilgisi, iletisimBilgisi } from "../src/sanity/seed-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN in .env.local"
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
});

async function seed() {
  console.log("Hizmetler ekleniyor...");
  for (const hizmet of hizmetler) {
    await client.createOrReplace({ _type: "hizmet", ...hizmet });
  }

  console.log("Ürünler ekleniyor...");
  for (const urun of urunler) {
    await client.createOrReplace({ _type: "urunKategorisi", ...urun });
  }

  console.log("Şirket bilgisi ekleniyor...");
  await client.createOrReplace(sirketBilgisi);

  console.log("İletişim bilgisi ekleniyor...");
  await client.createOrReplace(iletisimBilgisi);

  console.log("Tamamlandı.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
