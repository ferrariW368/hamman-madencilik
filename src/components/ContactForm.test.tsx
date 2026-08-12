import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows a validation error and does not call fetch when required fields are empty", async () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));

    expect(await screen.findByText(/zorunludur/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits the form and shows a success message on a successful response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/ad soyad/i), { target: { value: "Test Kullanıcı" } });
    fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/konu/i), { target: { value: "Bilgi talebi" } });

    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));

    await waitFor(() => {
      expect(screen.getByText(/mesajınız alındı/i)).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith("/api/iletisim", expect.objectContaining({ method: "POST" }));
  });

  it("shows an error message when the request fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/ad soyad/i), { target: { value: "Test Kullanıcı" } });
    fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/konu/i), { target: { value: "Bilgi talebi" } });

    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));

    await waitFor(() => {
      expect(screen.getByText(/gönderilemedi/i)).toBeInTheDocument();
    });
  });
});
