import Link from 'next/link';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

type PageCta = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
};

type PageSection = {
  title: string;
  items: string[];
};

type PageDefinition = {
  title: string;
  subtitle: string;
  ctas?: PageCta[];
  sections?: PageSection[];
};

function normalizePathFromSlug(slug: string[]) {
  return `/${slug.join('/')}`.replace(/\/+$/, '') || '/';
}

function getPageDefinition(path: string): PageDefinition {
  const first = path.split('/').filter(Boolean)[0] || '';

  if (path === '/help') {
    return {
      title: 'Help Centre',
      subtitle: 'Get answers fast. If you still need help, contact us and we’ll assist you.',
      ctas: [
        { label: 'Contact Support', href: '/contact', variant: 'primary' },
        { label: 'Returns', href: '/returns', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'Popular topics',
          items: [
            'Tracking orders and delivery updates',
            'Returns, refunds, and exchanges',
            'Payment methods and security',
            'Account and login help',
          ],
        },
        {
          title: 'Frequently asked questions',
          items: [
            'Where is my order? You can track orders from the Orders page.',
            'How do returns work? Start a return from your Orders page or the Returns page.',
            'Is my payment information safe? Payments are encrypted and processed securely.',
          ],
        },
      ],
    };
  }

  if (path === '/sell') {
    return {
      title: 'Sell on Peboli',
      subtitle: 'Reach customers nationwide with a premium storefront and trusted fulfilment options.',
      ctas: [
        { label: 'Open a Seller Account', href: '/register', variant: 'primary' },
        { label: 'View Pricing', href: '/vendor/pricing', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'How selling works',
          items: [
            'Create your seller profile and verify your business details',
            'List products with pricing, stock, and images',
            'Receive orders and manage fulfilment',
            'Payouts processed on scheduled cycles',
          ],
        },
        {
          title: 'What you’ll need',
          items: [
            'Business or individual verification details',
            'Banking details for payouts',
            'Product catalogue information (SKU, pricing, stock)',
            'Clear product images and descriptions',
          ],
        },
      ],
    };
  }

  if (path === '/login') {
    return {
      title: 'Login',
      subtitle: 'Access your account to track orders, manage returns, and update your details.',
      ctas: [
        { label: 'Create an account', href: '/register', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'Sign in',
          items: [
            'Email address',
            'Password',
            'Forgot password? (coming soon)',
          ],
        },
      ],
    };
  }

  if (path === '/register') {
    return {
      title: 'Create an account',
      subtitle: 'Sign up to save favourites, checkout faster, and get tailored deals.',
      ctas: [
        { label: 'Already have an account? Login', href: '/login', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'Account details',
          items: [
            'First name and last name',
            'Email address',
            'Password',
            'Agree to Terms and Privacy Policy',
          ],
        },
      ],
    };
  }

  if (path === '/orders') {
    return {
      title: 'Orders',
      subtitle: 'View your recent purchases, track deliveries, and start returns.',
      ctas: [
        { label: 'Go to Checkout', href: '/checkout', variant: 'primary' },
        { label: 'Returns', href: '/returns', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'What you can do here',
          items: [
            'Track delivery status and estimated arrival',
            'Download invoices (coming soon)',
            'Request returns and refunds',
          ],
        },
      ],
    };
  }

  if (path === '/account') {
    return {
      title: 'My Account',
      subtitle: 'Manage your profile, addresses, and communication preferences.',
      ctas: [
        { label: 'View Orders', href: '/orders', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'Account settings',
          items: [
            'Profile details',
            'Addresses (coming soon)',
            'Notifications (coming soon)',
            'Security settings (coming soon)',
          ],
        },
      ],
    };
  }

  if (path === '/returns') {
    return {
      title: 'Returns',
      subtitle: 'Start a return, check eligibility, and learn how refunds work.',
      ctas: [
        { label: 'View Orders', href: '/orders', variant: 'primary' },
        { label: 'Contact Us', href: '/contact', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'Return guidelines',
          items: [
            'Keep the original packaging where possible',
            'Return items within the eligible return window',
            'Refunds are processed to your original payment method',
          ],
        },
        {
          title: 'Refund timelines',
          items: [
            'Refunds are typically processed within 3–5 business days after inspection',
            'Bank processing times may vary by provider',
          ],
        },
      ],
    };
  }

  if (path === '/shipping') {
    return {
      title: 'Shipping info',
      subtitle: 'Delivery options, fees, and pickup details.',
      ctas: [
        { label: 'Shop deals', href: '/deals', variant: 'primary' },
      ],
      sections: [
        {
          title: 'Delivery options',
          items: [
            'Standard delivery: 4–7 business days',
            'Express delivery: 2–3 business days (where available)',
            'Pickup points: select locations (coming soon)',
          ],
        },
        {
          title: 'Delivery fees',
          items: [
            'Free delivery thresholds may apply on selected promotions',
            'Fees vary by order size, region, and delivery option',
          ],
        },
      ],
    };
  }

  if (path === '/contact') {
    return {
      title: 'Contact us',
      subtitle: 'We’re here to help. Reach out and we’ll get back to you as soon as possible.',
      ctas: [
        { label: 'Help Centre', href: '/help', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'Support channels',
          items: [
            'Email support: support@peboli.com',
            'WhatsApp updates: enabled for order notifications',
            'Business hours: Mon–Fri, 08:00–17:00',
          ],
        },
        {
          title: 'Before you contact us',
          items: [
            'Have your order number ready (if applicable)',
            'Include screenshots for technical issues',
            'Tell us what you expected vs what happened',
          ],
        },
      ],
    };
  }

  if (path === '/privacy') {
    return {
      title: 'Privacy policy',
      subtitle: 'How we collect, use, and protect your personal information.',
      sections: [
        {
          title: 'Key points',
          items: [
            'We collect data to process orders and improve your experience',
            'We don’t sell your personal information',
            'You can request access or deletion of your data (subject to legal requirements)',
          ],
        },
        {
          title: 'What we collect',
          items: [
            'Account information (name, email, phone)',
            'Order and payment metadata (not raw card details)',
            'Usage analytics to improve site performance',
          ],
        },
      ],
    };
  }

  if (path === '/terms') {
    return {
      title: 'Terms of service',
      subtitle: 'Rules for using the platform, buying, selling, and account usage.',
      sections: [
        {
          title: 'Highlights',
          items: [
            'Use the platform lawfully and respectfully',
            'Prices and availability may change without notice',
            'Returns and refunds follow the published policy',
          ],
        },
      ],
    };
  }

  if (path === '/popia') {
    return {
      title: 'POPIA compliance',
      subtitle: 'Our approach to protecting personal information under South African law.',
      sections: [
        {
          title: 'Our commitments',
          items: [
            'Process personal information lawfully and transparently',
            'Use appropriate security safeguards',
            'Allow access/correction requests where applicable',
          ],
        },
      ],
    };
  }

  if (path === '/brands') {
    return {
      title: 'Brand store',
      subtitle: 'Browse popular brands and discover trusted sellers.',
      ctas: [
        { label: 'Browse Electronics', href: '/categories/electronics', variant: 'primary' },
      ],
      sections: [
        {
          title: 'Featured brands',
          items: ['Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas', 'Dyson', 'Canon'],
        },
      ],
    };
  }

  if (path === '/new' || path === '/christmas' || path === '/summer' || path === '/liquor' || path === '/clearance' || path === '/more') {
    const titleByPath: Record<string, string> = {
      '/new': 'New arrivals',
      '/christmas': 'Christmas',
      '/summer': 'Summer',
      '/liquor': 'Festive liquor',
      '/clearance': 'Clearance',
      '/more': 'PeboliSPLASH',
    };

    return {
      title: titleByPath[path] || 'Collections',
      subtitle: 'Explore curated picks and popular categories — updated regularly.',
      ctas: [
        { label: 'Shop deals', href: '/deals', variant: 'primary' },
        { label: 'Browse categories', href: '/', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'Recommended categories',
          items: [],
        },
        {
          title: 'What you’ll find here',
          items: ['Limited-time promos', 'Featured products', 'Seasonal picks', 'Trending items'],
        },
      ],
    };
  }

  if (path === '/vendor/dashboard' || first === 'vendor') {
    if (path === '/vendor/pricing') {
      return {
        title: 'Vendor pricing',
        subtitle: 'Transparent fees and tools designed for sustainable selling.',
        ctas: [
          { label: 'Start selling', href: '/sell', variant: 'primary' },
          { label: 'Vendor dashboard', href: '/vendor/dashboard', variant: 'secondary' },
        ],
        sections: [
          {
            title: 'What’s included',
            items: ['Storefront tools', 'Order management', 'Customer communication (coming soon)', 'Promotions (coming soon)'],
          },
          {
            title: 'Fees (example)',
            items: ['Commission per sale (category-based)', 'Optional promotional placements', 'Payout processing (scheduled)'],
          },
        ],
      };
    }

    return {
      title: 'Vendor dashboard',
      subtitle: 'Manage products, orders, pricing, and payouts from one place.',
      ctas: [
        { label: 'View pricing', href: '/vendor/pricing', variant: 'secondary' },
      ],
      sections: [
        {
          title: 'Dashboard features',
          items: ['Add and manage listings', 'Track sales and performance', 'Manage fulfilment status', 'Payout overview (coming soon)'],
        },
      ],
    };
  }

  if (path === '/deals') {
    return {
      title: 'Deals & promotions',
      subtitle: 'Fresh savings across top categories. Check back often for new drops.',
      ctas: [
        { label: 'Browse electronics deals', href: '/categories/electronics', variant: 'primary' },
      ],
      sections: [
        {
          title: 'Deal types',
          items: ['Splash deals', 'Bundle savings', 'Clearance offers', 'Limited-time promos'],
        },
      ],
    };
  }

  return {
    title: 'Explore Peboli',
    subtitle: 'This page isn’t fully defined yet, but you can keep browsing without hitting a 404.',
    ctas: [
      { label: 'Go to home', href: '/', variant: 'primary' },
      { label: 'Shop deals', href: '/deals', variant: 'secondary' },
    ],
    sections: [
      {
        title: 'Suggested next steps',
        items: ['Browse categories', 'View today’s deals', 'Visit the help centre'],
      },
    ],
  };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = normalizePathFromSlug(slug);
  const page = getPageDefinition(path);

  const ctas = page.ctas || [];
  const primaryCta = ctas.find((c) => c.variant === 'primary') || ctas[0];
  const secondaryCtas = ctas.filter((c) => c !== primaryCta);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D29]">{page.title}</h1>
            <p className="mt-3 text-[#8B95A5]">{page.subtitle}</p>
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
              <div className="text-sm text-[#8B95A5]">Requested path</div>
              <div className="mt-1 font-mono text-sm text-[#1A1D29] break-all">{path}</div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center rounded-lg bg-[#0B1220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1A1D29] transition-colors"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCtas.map((cta) => (
                <Link
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                >
                  {cta.label}
                </Link>
              ))}
            </div>

            {page.sections && page.sections.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {page.sections.map((section) => (
                  <div key={section.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="text-base font-bold text-[#1A1D29]">{section.title}</h2>
                    <ul className="mt-4 space-y-2 text-sm text-[#8B95A5]">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#0B1220] flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
