import Link from 'next/link';
import { TRUST_SIGNALS } from '@/lib/constants/trust-signals';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gradient-to-b from-white via-white to-[#F7F8FA]">
      {/* Trust Signals */}
      <div className="border-b border-gray-100 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_SIGNALS.map((signal, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 premium-shadow hover:premium-shadow-lg transition-all duration-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#FF6B4A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center">
                    <span className="text-2xl">{signal.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A1D29] mb-1">
                      {signal.title}
                    </h3>
                    <p className="text-sm text-[#8B95A5] leading-relaxed">{signal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-gradient-to-b from-[#0B1220] to-[#050A14] text-white">
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            <div className="md:col-span-4">
              <div className="text-2xl font-black tracking-tight">PEBOLI</div>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                A premium marketplace experience built for fast discovery, trusted sellers, and great deals.
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                  <h3 className="font-bold text-sm tracking-wide uppercase text-white/90 mb-5">Shop</h3>
                  <ul className="space-y-3 text-sm">
              <li>
                <Link href="/categories/electronics" className="text-white/70 hover:text-white transition-colors font-medium">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/categories/fashion" className="text-white/70 hover:text-white transition-colors font-medium">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/categories/home" className="text-white/70 hover:text-white transition-colors font-medium">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-white/70 hover:text-white transition-colors font-medium">
                  Deals
                </Link>
              </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide uppercase text-white/90 mb-5">Sell</h3>
                  <ul className="space-y-3 text-sm">
              <li>
                <Link href="/sell" className="text-white/70 hover:text-white transition-colors font-medium">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link href="/vendor/dashboard" className="text-white/70 hover:text-white transition-colors font-medium">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/vendor/pricing" className="text-white/70 hover:text-white transition-colors font-medium">
                  Pricing
                </Link>
              </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide uppercase text-white/90 mb-5">Support</h3>
                  <ul className="space-y-3 text-sm">
              <li>
                <Link href="/help" className="text-white/70 hover:text-white transition-colors font-medium">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-white/70 hover:text-white transition-colors font-medium">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white/70 hover:text-white transition-colors font-medium">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors font-medium">
                  Contact Us
                </Link>
              </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide uppercase text-white/90 mb-5">Legal</h3>
                  <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/popia" className="text-white/70 hover:text-white transition-colors font-medium">
                  POPIA Compliance
                </Link>
              </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 lg:px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/60 font-medium">
                &copy; {new Date().getFullYear()} Peboli. All rights reserved.
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

