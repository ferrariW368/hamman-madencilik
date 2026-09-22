import type { SchemaTypeDefinition } from "sanity";
import { hizmet } from "./hizmet";
import { urunKategorisi } from "./urunKategorisi";
import { sirketBilgisi } from "./sirketBilgisi";
import { iletisimBilgisi } from "./iletisimBilgisi";
import { galeriGorseli } from "./galeriGorseli";
import { sahaTesis } from "./sahaTesis";
import { mesaj } from "./mesaj";
import { event } from "./event";
import { project } from "./project";
import { quarry } from "./quarry";
import { stone } from "./stone";
import { localizedString, localizedText, mediaDocument, mediaImage, mediaProvenance, technicalDatum, technicalDocument } from "./v2Shared";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hizmet, urunKategorisi, sirketBilgisi, iletisimBilgisi, galeriGorseli, sahaTesis, mesaj, localizedString, localizedText, mediaProvenance, mediaImage, mediaDocument, technicalDatum, technicalDocument, stone, quarry, project, event],
};
