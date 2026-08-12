"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      adSoyad: String(formData.get("adSoyad") ?? "").trim(),
      eposta: String(formData.get("eposta") ?? "").trim(),
      konu: String(formData.get("konu") ?? "").trim(),
      mesaj: String(formData.get("mesaj") ?? "").trim(),
    };

    if (!payload.adSoyad || !payload.eposta || !payload.konu) {
      setState("error");
      setErrorMessage("Ad Soyad, E-posta ve Konu alanları zorunludur.");
      return;
    }

    try {
      const response = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("İstek başarısız oldu");
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
      setErrorMessage("Mesajınız gönderilemedi, lütfen daha sonra tekrar deneyin.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="adSoyad" className="text-xs uppercase tracking-[0.08em]">
          Ad Soyad *
        </label>
        <input id="adSoyad" name="adSoyad" type="text" className="border border-[color:var(--color-stone-sand)] px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="eposta" className="text-xs uppercase tracking-[0.08em]">
          E-posta *
        </label>
        <input id="eposta" name="eposta" type="email" className="border border-[color:var(--color-stone-sand)] px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="konu" className="text-xs uppercase tracking-[0.08em]">
          Konu *
        </label>
        <input id="konu" name="konu" type="text" className="border border-[color:var(--color-stone-sand)] px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="mesaj" className="text-xs uppercase tracking-[0.08em]">
          Mesajınız
        </label>
        <textarea id="mesaj" name="mesaj" rows={4} className="border border-[color:var(--color-stone-sand)] px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="self-start bg-[color:var(--color-stone-ink)] px-6 py-3 text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-cream)] disabled:opacity-50"
      >
        {state === "submitting" ? "Gönderiliyor..." : "Gönder"}
      </button>

      {state === "success" && <p className="text-xs text-green-700">Mesajınız alındı, teşekkürler.</p>}
      {state === "error" && errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
    </form>
  );
}
