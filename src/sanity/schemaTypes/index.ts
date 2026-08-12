import type { SchemaTypeDefinition } from "sanity";
import { hizmet } from "./hizmet";
import { urunKategorisi } from "./urunKategorisi";
import { sirketBilgisi } from "./sirketBilgisi";
import { iletisimBilgisi } from "./iletisimBilgisi";
import { galeriGorseli } from "./galeriGorseli";
import { sahaTesis } from "./sahaTesis";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hizmet, urunKategorisi, sirketBilgisi, iletisimBilgisi, galeriGorseli, sahaTesis],
};
