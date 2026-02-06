'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim() && email.trim() && message.trim();
  }, [name, email, message]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    await new Promise((r) => setTimeout(r, 650));
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white shadow-none overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Contact</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Contact support</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Tell us what you need and we’ll get back to you. For faster help, include your order number.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6">
                  {!sent ? (
                    <form onSubmit={onSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-[#1A1D29]">Full name</label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 h-11 rounded-xl"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-[#1A1D29]">Email address</label>
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 h-11 rounded-xl"
                            placeholder="you@example.com"
                            type="email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#1A1D29]">Order number (optional)</label>
                        <Input
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          className="mt-2 h-11 rounded-xl"
                          placeholder="PB-12345"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#1A1D29]">Message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="mt-2 w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                          placeholder="Tell us what happened and what you expected..."
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="submit"
                          disabled={!canSubmit}
                          className="h-11 rounded-xl bg-[#0B1220] hover:bg-[#1A1D29] transition-colors text-white font-bold"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send message
                        </Button>
                        <Link href="/help" className="text-sm font-semibold text-[#0B1220] hover:underline">
                          Visit Help Centre
                        </Link>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="font-black text-[#1A1D29] text-xl">Message sent</div>
                      <p className="mt-2 text-sm text-[#8B95A5]">
                        We’ve received your message. A support agent will respond soon.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          onClick={() => setSent(false)}
                          variant="outline"
                          className="h-11 rounded-xl"
                        >
                          Send another message
                        </Button>
                        <Link
                          href="/orders"
                          className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] hover:bg-[#1a283a] transition-colors px-5 py-2.5 text-sm font-semibold text-white"
                        >
                          View orders
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="font-black text-[#1A1D29]">Other ways to reach us</div>
                  <div className="mt-4 space-y-3 text-sm text-[#8B95A5]">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B1220]">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1A1D29]">Email</div>
                        <div>support@peboli.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B1220]">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1A1D29]">Phone</div>
                        <div>+27 (0)11 000 0000 (coming soon)</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B1220]">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1A1D29]">Live chat</div>
                        <div>Available in a future release</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Tip</div>
                    <div className="mt-2 text-sm text-[#1A1D29]">
                      For delivery questions, check <Link href="/orders" className="font-semibold text-[#0B1220] hover:underline">Orders</Link>{' '}
                      first — you’ll get real-time updates there.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
