import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { writeClient } from "@/sanity/writeClient";

vi.mock("@/sanity/writeClient", () => ({
  writeClient: { create: vi.fn() },
}));

describe("POST /api/iletisim", () => {
  beforeEach(() => {
    vi.mocked(writeClient.create).mockReset();
  });

  it("returns 400 when required fields are missing", async () => {
    const request = new Request("http://localhost/api/iletisim", {
      method: "POST",
      body: JSON.stringify({ adSoyad: "", eposta: "", konu: "", mesaj: "" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(writeClient.create).not.toHaveBeenCalled();
  });

  it("creates a mesaj document and returns ok for valid input", async () => {
    vi.mocked(writeClient.create).mockResolvedValueOnce({} as never);
    const request = new Request("http://localhost/api/iletisim", {
      method: "POST",
      body: JSON.stringify({
        adSoyad: "Test Kullanıcı",
        eposta: "test@example.com",
        konu: "Bilgi talebi",
        mesaj: "Merhaba",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(writeClient.create).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "mesaj", adSoyad: "Test Kullanıcı" })
    );
  });
});
