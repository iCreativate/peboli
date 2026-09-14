'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/contact', label: 'Contact' },
];

type AgencyNavProps = {
  variant?: 'onDark' | 'onLight';
};

export function AgencyNav({ variant = 'onLight' }: AgencyNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Over the dark hero: light text until the user scrolls, then solid bar + dark text
  const lightText = variant === 'onDark' && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? 'border-b border-mesh-line/60 bg-mesh-paper/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          className={`font-display text-2xl font-bold tracking-tight transition-colors hover:opacity-80 ${
            lightText ? 'text-white' : 'text-mesh-ink'
          }`}
        >
          MESH
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                lightText
                  ? 'text-white/70 hover:text-white'
                  : 'text-mesh-muted hover:text-mesh-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-sm bg-mesh-signal px-4 py-2.5 text-sm font-semibold text-mesh-ink transition-transform hover:scale-[1.02]"
          >
            Book a call
          </Link>
        </div>

        <button
          type="button"
          className={lightText ? 'text-white md:hidden' : 'text-mesh-ink md:hidden'}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-mesh-line/40 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-mesh-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 inline-flex w-fit rounded-sm bg-mesh-signal px-4 py-2.5 text-sm font-semibold text-mesh-ink"
              onClick={() => setOpen(false)}
            >
              Book a call
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
