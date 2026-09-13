'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  const onDark = variant === 'onDark';

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href="/"
          className={`font-display text-2xl font-bold tracking-tight transition-opacity hover:opacity-80 ${
            onDark ? 'text-white' : 'text-mesh-ink'
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
                onDark
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
          className={onDark ? 'text-white md:hidden' : 'text-mesh-ink md:hidden'}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div
          className={`border-t px-6 py-6 backdrop-blur-md md:hidden ${
            onDark
              ? 'border-white/10 bg-mesh-ink/95'
              : 'border-mesh-line/40 bg-mesh-paper/95'
          }`}
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium ${onDark ? 'text-white' : 'text-mesh-ink'}`}
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
