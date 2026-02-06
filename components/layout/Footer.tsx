'use client';

import Link from 'next/link';
import { TRUST_SIGNALS } from '@/lib/constants/trust-signals';
import { useState, useEffect } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Music,
  ExternalLink
} from 'lucide-react';

export function Footer() {
  const [departments, setDepartments] = useState<Array<{ name: string; slug: string }>>([]);
  const [socialMedia, setSocialMedia] = useState<Record<string, string>>({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    
    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const res = await fetch('/api/departments?t=' + Date.now(), { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDepartments(data.slice(0, 5)); // Limit to 5 for footer
          }
        }
      } catch (error) {
        console.error('Error fetching departments for footer:', error);
      }
    };

    // Fetch social media
    const fetchSocialMedia = async () => {
      try {
        const res = await fetch('/api/social-media?t=' + Date.now(), {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.socialMedia) {
            setSocialMedia(data.socialMedia);
          }
        }
      } catch (error) {
        console.error('Error fetching social media for footer:', error);
      }
    };

    fetchDepartments();
    fetchSocialMedia();
  }, []);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'tiktok': return <Music className="h-5 w-5" />;
      default: return <ExternalLink className="h-5 w-5" />;
    }
  };

  const socialLinks = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'tiktok', label: 'TikTok' },
  ].filter(platform => socialMedia[platform.id]);

  return (
    <footer className="border-t border-gray-100 bg-[#F7F8FA]">
      {/* Trust Signals */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_SIGNALS.map((signal, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 hover:border-gray-200 transition-all duration-200"
              >
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
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
      <div className="bg-[#0B1220] text-white">
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            <div className="md:col-span-4">
              <div className="text-2xl font-black tracking-tight">PEBOLI</div>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                A premium marketplace experience built for fast discovery, trusted sellers, and great deals.
              </p>
              <div className="mt-4 text-[10px] text-white/30 font-mono">v1.1.0</div>
            </div>

            <div className="md:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                  <h3 className="font-bold text-sm tracking-wide uppercase text-white/90 mb-5">Shop</h3>
                  <ul className="space-y-3 text-sm">
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <li key={dept.slug}>
                          <Link href={`/categories/${dept.slug}`} className="text-white/70 hover:text-white transition-colors font-medium">
                            {dept.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
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
                      </>
                    )}
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
                &copy; {currentYear} Peboli. All rights reserved.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((platform) => (
                  <a
                    key={platform.id}
                    href={socialMedia[platform.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    aria-label={platform.label}
                  >
                    {getSocialIcon(platform.id)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

