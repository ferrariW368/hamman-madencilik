"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const posterSource = "/media/ai/ai-hero-quarry-approach-02-poster.jpg";
const mobilePosterSource = "/media/reference/quarry-overview-cropped.jpg";
const videoSource = "/media/ai/ai-hero-quarry-approach-02.mp4";

export function V2HeroMedia({ alt, mobileAlt }: Readonly<{ alt: string; mobileAlt: string }>) {
  const [videoAvailable, setVideoAvailable] = useState(true);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        media.style.setProperty("--hero-parallax", `${Math.min(window.scrollY * 0.08, 36)}px`);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return <div ref={mediaRef} className="v2-hero__media absolute inset-0">
    <Image src={posterSource} alt={alt} fill priority sizes="100vw" className="v2-hero__poster v2-hero__poster--ai object-cover" />
    <Image src={mobilePosterSource} alt={mobileAlt} fill priority sizes="100vw" className="v2-hero__poster v2-hero__poster--mobile object-cover" />
    {videoAvailable ? <video className="v2-hero__video" autoPlay muted loop playsInline preload="metadata" poster={posterSource} onError={() => setVideoAvailable(false)}>
      <source src={videoSource} type="video/mp4" />
    </video> : null}
  </div>;
}
