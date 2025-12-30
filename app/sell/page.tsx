import Link from 'next/link';
import { 
  BarChart3, 
  CheckCircle2, 
  ChevronRight, 
  Package, 
  ShieldCheck, 
  Store, 
  Truck, 
  TrendingUp, 
  Layers, 
  FileText, 
  UserPlus, 
  BookOpen, 
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { SellAuthButtons, SellPricingAuthButton } from '@/components/sell/SellAuthButtons';

const PROCESS_STEPS = [
  {
    title: 'Application',
    description: 'Apply now and tell us about your business and products.',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Approval',
    description: 'We\'ll review your application and get in touch within 10 business days.',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: 'Registration',
    description: 'Complete your Seller account by supplying required information.',
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    title: 'Onboarding',
    description: 'Learn all about our processes and choose your stock model.',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: 'Sales',
    description: 'Get your products live and start selling to millions of shoppers.',
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: 'Growth',
    description: 'Boost your sales via promotions and analyse your performance.',
    icon: <TrendingUp className="h-5 w-5" />,
  },
];

const VALUE_PROPS = [
  {
    title: 'Optimise Your Growth',
    description: 'Easily boost your sales by leveraging our active customer base of over 3 million happy online shoppers.',
    icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
    bg: 'bg-blue-50'
  },
  {
    title: 'End-to-End Solutions',
    description: 'We\'ll provide the tools you need to set up and sell – manage your stock, pricing, product selection and more.',
    icon: <Layers className="h-6 w-6 text-purple-600" />,
    bg: 'bg-purple-50'
  },
  {
    title: 'Hassle-Free Logistics',
    description: 'From handling warehousing to delivery and returns, we\'ve made online retail easier than ever.',
    icon: <Truck className="h-6 w-6 text-orange-600" />,
    bg: 'bg-orange-50'
  },
  {
    title: 'Safe & Secure Online Payments',
    description: 'Payments are made directly to you four times per month. Secure and reliable.',
    icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
    bg: 'bg-green-50'
  }
];

export default function SellPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          
          {/* Hero Section */}
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden mb-8">
            <div className="p-8 md:p-12 premium-gradient text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="text-white/80 text-sm font-semibold mb-2">Seller Solution</div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Sell your products online
                </h1>
                <p className="mt-4 text-white/90 text-lg leading-relaxed max-w-xl">
                  Get the tools you need to increase sales and grow your business online. Simply apply to sell as a Peboli seller today.
                </p>
                
                <SellAuthButtons />
              </div>
              
              {/* Abstract Graphic/Illustration Placeholder */}
              <div className="hidden md:block relative w-64 h-64 bg-white/10 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Store className="h-32 w-32 text-white/80" />
              </div>
            </div>
          </div>

          {/* Value Props Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`h-14 w-14 rounded-2xl ${prop.bg} flex items-center justify-center mb-4`}>
                  {prop.icon}
                </div>
                <h3 className="font-bold text-[#1A1D29] text-lg mb-2">{prop.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{prop.description}</p>
              </div>
            ))}
          </div>

          {/* Process Steps Section */}
          <div className="bg-white rounded-3xl border border-gray-100 premium-shadow p-8 md:p-12 mb-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-black text-[#1A1D29] mb-4">Start selling online in just a few easy steps</h2>
              <p className="text-gray-500">Join thousands of businesses growing with Peboli.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden lg:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10"></div>
              
              {PROCESS_STEPS.map((step, idx) => (
                <div key={step.title} className="relative bg-white flex flex-col items-center text-center group">
                  <div className="h-16 w-16 rounded-2xl bg-[#1A1D29] text-white flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-[#1A1D29] text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed px-4">{step.description}</p>
                  
                  {/* Step Number */}
                  <div className="absolute top-0 right-10 -mt-2 -mr-2 bg-gray-100 text-gray-400 text-xs font-bold px-2 py-1 rounded-full border border-white">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-[#1A1D29] rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-black mb-4">Simple, Transparent Pricing</h2>
                <p className="text-white/70 text-lg mb-6">
                  Focus on selling while we handle the technology and logistics. No hidden fees.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>Access to millions of shoppers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>Secure payments 4x per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>Cancel your account at any time</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white text-[#1A1D29] rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Subscription Fee</div>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-5xl font-black">R250</span>
                    <span className="text-gray-500 font-medium">/month</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-6">* Excludes VAT</p>
                  
                  <SellPricingAuthButton />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/help/seller" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:underline">
              Have questions? Visit our Seller Help Center
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
