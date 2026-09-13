'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Instagram,
  Mail,
  Tag,
  Wallet,
  ListChecks,
  Rocket,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { MARKUP_DEFAULT, MARKUP_MAX, MARKUP_MIN } from '@/lib/pricing';

type Tone = 'urgent' | 'friendly' | 'premium' | 'local';

interface PackResult {
  productTitle: string;
  titleAlternates: string[];
  shortDescription: string;
  longDescription: string;
  bulletPoints: string[];
  whatsappBlast: string;
  instagramCaption: string;
  facebookPost: string;
  dealHeadline: string;
  dealSubcopy: string;
  emailSubject: string;
  emailBody: string;
  hashtags: string[];
  ctaOptions: string[];
  profit: {
    cost: number;
    markupPercent: number;
    sellPrice: number;
    profitPerUnit: number;
    marginPercent: number;
    breakEvenAtR100Ads: number;
    breakEvenAtR500Ads: number;
  };
  resellerPackages: {
    id: string;
    name: string;
    priceZar: number;
    deliverables: string[];
    targetClient: string;
    estimatedHours: number;
    suggestedMarginNote: string;
  }[];
  playbookSteps: string[];
  source: 'openai' | 'peboli-engine';
}

const TONES: { id: Tone; label: string }[] = [
  { id: 'local', label: 'Local SA' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'premium', label: 'Premium' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B95A5] hover:text-[#1A1D29] transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[#00C48C]" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function OutputBlock({
  title,
  icon: Icon,
  text,
}: {
  title: string;
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/80 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1D29]">
          <Icon className="h-4 w-4 text-[#FF6B4A]" />
          {title}
        </div>
        <CopyButton text={text} />
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#1A1D29]">
        {text}
      </pre>
    </div>
  );
}

export function AiResellerStudio() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('home');
  const [cost, setCost] = useState('100');
  const [markupPercent, setMarkupPercent] = useState(String(MARKUP_DEFAULT));
  const [keyBenefits, setKeyBenefits] = useState('');
  const [audience, setAudience] = useState('Gauteng families');
  const [tone, setTone] = useState('local' as Tone);
  const [location, setLocation] = useState('Gauteng');
  const [pack, setPack] = useState(null as PackResult | null);
  const [error, setError] = useState(null as string | null);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('copy' as 'copy' | 'packages' | 'playbook');

  const liveCost = Number(cost) || 0;
  const liveMarkup = Math.min(MARKUP_MAX, Math.max(MARKUP_MIN, Number(markupPercent) || MARKUP_DEFAULT));
  const liveSell = liveCost > 0 ? Math.round(liveCost * (1 + liveMarkup / 100)) : 0;
  const liveProfit = Math.max(0, liveSell - liveCost);

  const onGenerate = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/ai-marketing/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName,
            category,
            cost: liveCost,
            markupPercent: liveMarkup,
            keyBenefits,
            audience,
            tone,
            location,
            channel: 'full_pack',
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Generation failed');
          return;
        }
        setPack(data);
        setActiveTab('copy');
      } catch {
        setError('Network error — try again');
      }
    });
  };

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 10% -10%, rgba(255,107,74,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 0%, rgba(0,196,140,0.12), transparent 50%), linear-gradient(180deg, #F7F8FA 0%, #FFFFFF 40%, #F0F3F8 100%)',
        }}
      />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6B4A]">
            Peboli · Local Shelf
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#0B1220] sm:text-5xl">
            AI Reseller Studio
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#8B95A5] sm:text-lg">
            Price local stock at 30–40% markup, generate sales copy in seconds, and package the
            same AI marketing to sell to nearby shops.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-6 space-y-5 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(11,18,32,0.35)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
              <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
              Product inputs
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#8B95A5]">Product name</span>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Cast iron skillet 28cm"
                className="w-full rounded-xl border border-black/10 bg-[#F7F8FA] px-3 py-2.5 text-sm outline-none ring-[#FF6B4A]/30 focus:ring-2"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#8B95A5]">Landed cost (R)</span>
                <input
                  type="number"
                  min={1}
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#F7F8FA] px-3 py-2.5 text-sm outline-none ring-[#FF6B4A]/30 focus:ring-2"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#8B95A5]">
                  Markup ({MARKUP_MIN}–{MARKUP_MAX}%)
                </span>
                <input
                  type="number"
                  min={MARKUP_MIN}
                  max={MARKUP_MAX}
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#F7F8FA] px-3 py-2.5 text-sm outline-none ring-[#FF6B4A]/30 focus:ring-2"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#0B1220] p-3 text-center text-white">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-white/50">Sell</p>
                <p className="text-lg font-bold">R{liveSell || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-white/50">Profit</p>
                <p className="text-lg font-bold text-[#00C48C]">R{liveProfit || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-white/50">Markup</p>
                <p className="text-lg font-bold">{liveMarkup}%</p>
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#8B95A5]">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-[#F7F8FA] px-3 py-2.5 text-sm outline-none"
              >
                <option value="home">Home</option>
                <option value="kitchen">Kitchen</option>
                <option value="beauty">Beauty</option>
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="kids">Kids</option>
                <option value="general">General</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#8B95A5]">Key benefits (comma-separated)</span>
              <textarea
                value={keyBenefits}
                onChange={(e) => setKeyBenefits(e.target.value)}
                rows={2}
                placeholder="Even heat, dishwasher safe, lifetime use"
                className="w-full resize-none rounded-xl border border-black/10 bg-[#F7F8FA] px-3 py-2.5 text-sm outline-none ring-[#FF6B4A]/30 focus:ring-2"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#8B95A5]">Audience</span>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#F7F8FA] px-3 py-2.5 text-sm outline-none"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#8B95A5]">Location</span>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#F7F8FA] px-3 py-2.5 text-sm outline-none"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium text-[#8B95A5]">Tone</span>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                      tone === t.id
                        ? 'bg-[#0B1220] text-white'
                        : 'bg-[#F7F8FA] text-[#8B95A5] hover:text-[#1A1D29]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="button"
              disabled={isPending || !productName.trim() || liveCost <= 0}
              onClick={onGenerate}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6B4A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#e85a3c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating pack…
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Generate marketing pack
                </>
              )}
            </button>
          </div>
        </motion.div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!pack ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-white/50 px-6 text-center"
              >
                <Sparkles className="mb-4 h-10 w-10 text-[#FF6B4A]/70" />
                <h2 className="text-xl font-bold text-[#0B1220]">Your pack appears here</h2>
                <p className="mt-2 max-w-md text-sm text-[#8B95A5]">
                  Enter a product and cost, then generate titles, WhatsApp blasts, social posts,
                  deal copy, and ready-to-sell marketing packages.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="pack"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-1 rounded-2xl bg-white p-1 shadow-sm">
                    {(
                      [
                        ['copy', 'Copy kit'],
                        ['packages', 'Sell packages'],
                        ['playbook', 'Playbook'],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          activeTab === id
                            ? 'bg-[#0B1220] text-white'
                            : 'text-[#8B95A5] hover:text-[#1A1D29]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <span className="rounded-full bg-[#00C48C]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#00C48C]">
                    {pack.source === 'openai' ? 'OpenAI' : 'Peboli engine'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Sell price', value: `R${pack.profit.sellPrice}` },
                    { label: 'Profit / unit', value: `R${pack.profit.profitPerUnit}` },
                    { label: 'Margin', value: `${pack.profit.marginPercent}%` },
                    {
                      label: 'Break-even @ R500 ads',
                      value: `${pack.profit.breakEvenAtR500Ads} units`,
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-black/5 bg-white px-4 py-3"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#8B95A5]">
                        {s.label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#0B1220]">{s.value}</p>
                    </div>
                  ))}
                </div>

                {activeTab === 'copy' && (
                  <div className="space-y-4">
                    <OutputBlock title="Listing title" icon={Tag} text={pack.productTitle} />
                    <OutputBlock
                      title="Alternates"
                      icon={ListChecks}
                      text={pack.titleAlternates.join('\n')}
                    />
                    <OutputBlock
                      title="Short description"
                      icon={Tag}
                      text={pack.shortDescription}
                    />
                    <OutputBlock
                      title="Long description"
                      icon={Tag}
                      text={pack.longDescription}
                    />
                    <OutputBlock
                      title="Bullets"
                      icon={ListChecks}
                      text={pack.bulletPoints.map((b) => `• ${b}`).join('\n')}
                    />
                    <OutputBlock
                      title="WhatsApp blast"
                      icon={MessageCircle}
                      text={pack.whatsappBlast}
                    />
                    <OutputBlock
                      title="Instagram"
                      icon={Instagram}
                      text={pack.instagramCaption}
                    />
                    <OutputBlock title="Facebook" icon={Instagram} text={pack.facebookPost} />
                    <OutputBlock
                      title="Deal banner"
                      icon={Tag}
                      text={`${pack.dealHeadline}\n${pack.dealSubcopy}`}
                    />
                    <OutputBlock
                      title="Email"
                      icon={Mail}
                      text={`Subject: ${pack.emailSubject}\n\n${pack.emailBody}`}
                    />
                    <OutputBlock
                      title="Hashtags & CTAs"
                      icon={Sparkles}
                      text={`${pack.hashtags.join(' ')}\n\n${pack.ctaOptions.map((c) => `→ ${c}`).join('\n')}`}
                    />
                  </div>
                )}

                {activeTab === 'packages' && (
                  <div className="space-y-4">
                    <p className="text-sm text-[#8B95A5]">
                      Resell AI marketing to local businesses. Deliver these packs under your own
                      brand and keep the difference after tool costs.
                    </p>
                    {pack.resellerPackages.map((pkg, i) => (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="rounded-2xl border border-black/5 bg-white p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-[#0B1220]">{pkg.name}</h3>
                            <p className="mt-1 text-sm text-[#8B95A5]">{pkg.targetClient}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-[#FF6B4A]">
                              R{pkg.priceZar.toLocaleString('en-ZA')}
                            </p>
                            <p className="text-xs text-[#8B95A5]">~{pkg.estimatedHours}h work</p>
                          </div>
                        </div>
                        <ul className="mt-4 space-y-1.5">
                          {pkg.deliverables.map((d) => (
                            <li
                              key={d}
                              className="flex items-start gap-2 text-sm text-[#1A1D29]"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00C48C]" />
                              {d}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#F7F8FA] px-3 py-2 text-xs text-[#8B95A5]">
                          <Wallet className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {pkg.suggestedMarginNote}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'playbook' && (
                  <div className="rounded-2xl border border-black/5 bg-white p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0B1220]">
                      <Rocket className="h-5 w-5 text-[#FF6B4A]" />
                      Make money playbook
                    </h3>
                    <ol className="space-y-3">
                      {pack.playbookSteps.map((step, i) => (
                        <li key={step} className="flex gap-3 text-sm leading-relaxed text-[#1A1D29]">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-xs font-bold text-white">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
