import Link from 'next/link';

export function AgencyFooter() {
  return (
    <footer className="border-t border-mesh-line bg-mesh-ink text-mesh-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <p className="font-display text-3xl font-bold tracking-tight">MESH</p>
          <p className="mt-2 max-w-sm text-sm text-mesh-fog">
            AI automation agency. We design agents, workflows, and integrations that remove busywork from growing companies.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <Link href="/services" className="text-mesh-fog transition-colors hover:text-mesh-paper">
            Services
          </Link>
          <Link href="/work" className="text-mesh-fog transition-colors hover:text-mesh-paper">
            Work
          </Link>
          <Link href="/contact" className="text-mesh-fog transition-colors hover:text-mesh-paper">
            Contact
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-6 py-5 text-xs text-mesh-fog lg:px-10">
        © {new Date().getFullYear()} MESH Automation. All rights reserved.
      </div>
    </footer>
  );
}
