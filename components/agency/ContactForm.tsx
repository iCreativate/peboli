'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          message: data.get('message'),
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(payload.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        className="rounded-sm border border-mesh-line bg-white p-8"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="font-display text-2xl font-bold text-mesh-ink">Message received</h2>
        <p className="mt-3 text-mesh-muted">
          Thanks — we have your brief and will reply within one business day with next steps.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-mesh-ink">Name</span>
          <input
            required
            name="name"
            className="mt-2 w-full rounded-sm border border-mesh-line bg-white px-4 py-3 text-mesh-ink outline-none transition-colors focus:border-mesh-ink"
            placeholder="Alex Rivera"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-mesh-ink">Work email</span>
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full rounded-sm border border-mesh-line bg-white px-4 py-3 text-mesh-ink outline-none transition-colors focus:border-mesh-ink"
            placeholder="alex@company.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-mesh-ink">Company</span>
        <input
          name="company"
          className="mt-2 w-full rounded-sm border border-mesh-line bg-white px-4 py-3 text-mesh-ink outline-none transition-colors focus:border-mesh-ink"
          placeholder="Acme Co."
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-mesh-ink">What should we automate?</span>
        <textarea
          required
          name="message"
          rows={5}
          className="mt-2 w-full rounded-sm border border-mesh-line bg-white px-4 py-3 text-mesh-ink outline-none transition-colors focus:border-mesh-ink"
          placeholder="Lead qualification, support triage, reporting…"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-mesh-signal px-6 py-3.5 text-sm font-semibold text-mesh-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send brief'}
      </button>
    </form>
  );
}
