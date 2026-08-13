export type ContactFaceKind = "instagram" | "facebook" | "x" | "youtube" | "email" | "phone";

export type ContactFace = {
  kind: ContactFaceKind;
  label: string;
  href: string;
  external: boolean;
};

export type ContactCubeInput = {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  xUrl?: string | null;
  youtubeUrl?: string | null;
  eposta?: string | null;
  telefon?: string | null;
};

export function buildContactFaces(input: ContactCubeInput): ContactFace[] {
  const faces: ContactFace[] = [];

  if (input.instagramUrl) {
    faces.push({ kind: "instagram", label: "Instagram", href: input.instagramUrl, external: true });
  }
  if (input.facebookUrl) {
    faces.push({ kind: "facebook", label: "Facebook", href: input.facebookUrl, external: true });
  }
  if (input.xUrl) {
    faces.push({ kind: "x", label: "X", href: input.xUrl, external: true });
  }
  if (input.youtubeUrl) {
    faces.push({ kind: "youtube", label: "YouTube", href: input.youtubeUrl, external: true });
  }
  if (input.eposta) {
    faces.push({ kind: "email", label: "E-posta", href: `mailto:${input.eposta}`, external: false });
  }
  if (input.telefon) {
    faces.push({
      kind: "phone",
      label: "Telefon",
      href: `tel:${input.telefon.replace(/\s+/g, "")}`,
      external: false,
    });
  }

  return faces;
}
