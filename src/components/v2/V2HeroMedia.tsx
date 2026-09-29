"use client";

import Image from "next/image";
import { useState } from "react";

const posterSource = "/media/ai/ai-hero-quarry-approach-02-poster.jpg";
const videoSource = "/media/ai/ai-hero-quarry-approach-02.mp4";

export function V2HeroMedia({ alt }: Readonly<{ alt: string }>) {
  const [videoAvailable, setVideoAvailable] = useState(true);

  return <>
    <Image src={posterSource} alt={alt} fill priority sizes="100vw" className="v2-hero__poster object-cover" />
    {videoAvailable ? <video className="v2-hero__video" autoPlay muted loop playsInline preload="metadata" poster={posterSource} aria-hidden="true" onError={() => setVideoAvailable(false)}>
      <source src={videoSource} type="video/mp4" />
    </video> : null}
  </>;
}
