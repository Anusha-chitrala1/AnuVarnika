"use client";

import { FormEvent, useState } from "react";
import { submitContact } from "@/services/api";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const result = await submitContact({ name, email, message });
      setSuccess(result.message);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-16 sm:px-10">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[4px] text-[#8B5A2B]">Contact</p>
          <h1 className="mt-2 text-4xl font-bold text-[#5A3A1B]">We would love to hear from you</h1>
          <p className="mt-4 leading-7 text-gray-600">
            Questions about sizing, fabric care, or a custom drape? Send us a note and our styling
            team will respond within one business day.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-gray-700">
            <li>Email: hello@anuvarnika.com</li>
            <li>Studio hours: Mon–Sat, 10am–7pm IST</li>
            <li>Whatsapp styling consults available on request</li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E7D8C3] bg-white p-8 shadow-sm"
        >
          <label className="block text-sm font-medium text-[#5A3A1B]">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#D8C3A5] px-4 py-3"
            />
          </label>
          <label className="mt-5 block text-sm font-medium text-[#5A3A1B]">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#D8C3A5] px-4 py-3"
            />
          </label>
          <label className="mt-5 block text-sm font-medium text-[#5A3A1B]">
            Message
            <textarea
              required
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#D8C3A5] px-4 py-3"
            />
          </label>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-800">{success}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-[#8B5A2B] py-3 font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </main>
  );
}
