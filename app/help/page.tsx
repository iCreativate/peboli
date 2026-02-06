'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ChevronRight, 
  CreditCard, 
  Package, 
  RotateCcw, 
  Search, 
  Shield, 
  Truck, 
  Gift, 
  FileText, 
  HelpCircle,
  MapPin,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

// Enhanced Categories based on typical e-commerce help centers
const CATEGORIES = [
  {
    id: 'delivery',
    title: 'Delivery & Collection',
    description: 'Tracking, shipping options, costs, and changing addresses.',
    icon: <Truck className="h-6 w-6" />,
    href: '/help/delivery',
    links: ['Track my order', 'Delivery fees', 'Change delivery address', 'Collection points']
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    description: 'Policy, logging a return, and refund status.',
    icon: <RotateCcw className="h-6 w-6" />,
    href: '/help/returns',
    links: ['Log a return', 'Return policy', 'Refund timelines', 'Warranty info']
  },
  {
    id: 'payments',
    title: 'Payments & Promos',
    description: 'Payment methods, coupons, and credit info.',
    icon: <CreditCard className="h-6 w-6" />,
    href: '/help/payments',
    links: ['Payment options', 'Apply a coupon', 'eBucks & Loyalty', 'Credit refunds']
  },
  {
    id: 'orders',
    title: 'Orders & Cancellations',
    description: 'Managing orders, cancellations, and invoices.',
    icon: <Package className="h-6 w-6" />,
    href: '/help/orders',
    links: ['Cancel an order', 'Order history', 'Invoices', 'Missing items']
  },
  {
    id: 'account',
    title: 'Account & Security',
    description: 'Profile, password reset, and newsletter settings.',
    icon: <Shield className="h-6 w-6" />,
    href: '/help/account',
    links: ['Reset password', 'Update profile', 'Manage newsletters', 'Privacy policy']
  },
  {
    id: 'products',
    title: 'Product & Stock',
    description: 'Stock availability, reviews, and buying guides.',
    icon: <BookOpen className="h-6 w-6" />,
    href: '/help/products',
    links: ['Stock alerts', 'Product reviews', 'Pre-orders', 'Gift guides']
  }
];

const POPULAR_ARTICLES = [
  {
    title: 'Where is my order?',
    category: 'Delivery',
    href: '/orders'
  },
  {
    title: 'How do I log a return?',
    category: 'Returns',
    href: '/returns'
  },
  {
    title: 'Can I change my delivery address?',
    category: 'Delivery',
    href: '/help/delivery?faq=address'
  },
  {
    title: 'When will I get my refund?',
    category: 'Returns',
    href: '/help/returns?faq=refund'
  },
  {
    title: 'Payment options available',
    category: 'Payments',
    href: '/help/payments?faq=options'
  },
  {
    title: 'How to use a coupon code',
    category: 'Payments',
    href: '/help/payments?faq=coupon'
  }
];

const QUICK_ACTIONS = [
  { label: 'Track Order', icon: <MapPin className="h-5 w-5" />, href: '/orders' },
  { label: 'Log Return', icon: <RotateCcw className="h-5 w-5" />, href: '/returns' },
  { label: 'Reset Password', icon: <Shield className="h-5 w-5" />, href: '/account' },
  { label: 'Invoices', icon: <FileText className="h-5 w-5" />, href: '/orders' },
];

const SEARCH_ITEMS = [
  // Delivery
  { title: "How much does delivery cost?", category: "Delivery", href: "/help/delivery" },
  { title: "When will I get my order?", category: "Delivery", href: "/help/delivery" },
  { title: "Can I change my delivery address?", category: "Delivery", href: "/help/delivery?faq=address" },
  { title: "Do you deliver on weekends?", category: "Delivery", href: "/help/delivery" },
  
  // Returns
  { title: "What is your return policy?", category: "Returns", href: "/help/returns" },
  { title: "How do I log a return?", category: "Returns", href: "/help/returns" },
  { title: "How long does a refund take?", category: "Returns", href: "/help/returns?faq=refund" },
  { title: "Can I exchange an item?", category: "Returns", href: "/help/returns" },
  
  // Payments
  { title: "What payment methods do you accept?", category: "Payments", href: "/help/payments?faq=options" },
  { title: "How do I use a coupon code?", category: "Payments", href: "/help/payments?faq=coupon" },
  { title: "Why was my payment declined?", category: "Payments", href: "/help/payments" },
  
  // Orders
  { title: "How do I track my order?", category: "Orders", href: "/help/orders" },
  { title: "Can I cancel my order?", category: "Orders", href: "/help/orders" },
  
  // Account
  { title: "How do I reset my password?", category: "Account", href: "/help/account" },
  { title: "How do I update my personal details?", category: "Account", href: "/help/account" },
  
  // Products
  { title: "How do I know if an item is in stock?", category: "Products", href: "/help/products" },
  { title: "Do you offer warranties?", category: "Products", href: "/help/products" }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredResults = searchQuery 
    ? SEARCH_ITEMS.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        {/* Hero Search Section */}
        <div className="bg-[#0B1220] px-4 py-20 text-center relative overflow-hidden">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-16 max-w-6xl mx-auto hover:border-gray-300 transition-colors duration-300">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Hi, how can we help?
            </h1>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              Search for answers regarding orders, deliveries, returns, and more.
            </p>
            
            <div className="relative max-w-2xl mx-auto group">
              <div className="relative flex items-center bg-white rounded-2xl border border-gray-200">
                <div className="pl-6 text-gray-400">
                  <Search className="h-6 w-6" />
                </div>
                <input
                  type="text"
                  placeholder="Search for help (e.g. returns, delivery, payments)"
                  className="w-full h-16 pl-4 pr-6 rounded-2xl border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 text-lg font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && (
                 <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden z-50">
                    {filteredResults.length > 0 ? (
                      <ul className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                        {filteredResults.map((result, idx) => (
                           <li key={idx}>
                             <Link 
                               href={result.href}
                               className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                             >
                               <div>
                                 <span className="text-xs font-bold text-blue-600 uppercase mb-1 block">{result.category}</span>
                                 <span className="font-medium text-gray-900">{result.title}</span>
                               </div>
                               <ChevronRight className="h-4 w-4 text-gray-400" />
                             </Link>
                           </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <HelpCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No results found for "{searchQuery}"</p>
                      </div>
                    )}
                 </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-6 -mt-12 pb-20 relative z-20">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-16 max-w-6xl mx-auto hover:border-gray-300 transition-colors duration-300">
             <div className="flex items-center gap-3 mb-6">
               <div className="h-8 w-1 bg-[#FF6B4A] rounded-full" />
               <h2 className="text-lg font-bold text-[#1A1D29] uppercase tracking-wide">Quick Actions</h2>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {QUICK_ACTIONS.map((action) => (
                  <Link 
                    key={action.label} 
                    href={action.href}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all duration-200 group border border-transparent hover:border-blue-100"
                  >
                    <div className="h-12 w-12 rounded-xl bg-white text-gray-600 group-hover:text-blue-600 flex items-center justify-center transition-colors duration-200">
                      {action.icon}
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">{action.label}</span>
                  </Link>
                ))}
             </div>
          </div>

          {/* Help Categories Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1A1D29] mb-6">Browse Help Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{cat.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 h-10">{cat.description}</p>
                  <ul className="space-y-3">
                    {cat.links.map((link) => (
                      <li key={link}>
                        <Link href="#" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group/link">
                          <ChevronRight className="h-4 w-4 mr-2 text-gray-300 group-hover/link:text-blue-600" />
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-50">
                     <Link href={cat.href} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                        View all {cat.title}
                        <ChevronRight className="h-4 w-4 ml-1" />
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-[#1A1D29] mb-6">Popular Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {POPULAR_ARTICLES.map((article, idx) => (
                <Link 
                  key={idx} 
                  href={article.href}
                  className="flex flex-col p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className="h-5 w-5 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                     <span className={cn(
                       "px-2.5 py-1 rounded-full text-xs font-semibold",
                       article.category === 'Delivery' && "bg-blue-50 text-blue-600",
                       article.category === 'Returns' && "bg-orange-50 text-orange-600",
                       article.category === 'Payments' && "bg-green-50 text-green-600"
                     )}>
                       {article.category}
                     </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors pr-6">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Get help with {article.title.toLowerCase()} and other related topics in our {article.category} section.
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Still Need Help? */}
          <div className="max-w-6xl mx-auto mt-20 mb-10">
            <h2 className="text-2xl font-bold text-[#1A1D29] mb-6 text-center">Still need help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100">
                    <Phone className="w-6 h-6 text-[#0B1220]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B1220]">Call Us</h3>
                    <p className="text-gray-500 text-sm">Mon-Fri, 8am-5pm</p>
                  </div>
                </div>
                <p className="text-[#0B1220] font-medium text-lg mb-6">087 362 8000</p>
                <button className="w-full bg-[#0B1220] text-white py-3 rounded-xl font-medium hover:bg-[#1a2537] transition-colors">
                  Call Now
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100">
                    <Mail className="w-6 h-6 text-[#0B1220]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B1220]">Email Support</h3>
                    <p className="text-gray-500 text-sm">Response within 24h</p>
                  </div>
                </div>
                <p className="text-[#0B1220] font-medium text-lg mb-6">help@peboli.com</p>
                <button className="w-full bg-white border-2 border-[#0B1220] text-[#0B1220] py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Send Email
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100">
                    <MessageCircle className="w-6 h-6 text-[#0B1220]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B1220]">Live Chat</h3>
                    <p className="text-gray-500 text-sm">Available 24/7</p>
                  </div>
                </div>
                <p className="text-[#0B1220] font-medium text-lg mb-6">Average wait: 2 mins</p>
                <button className="w-full bg-[#FF6B4A] text-white py-3 rounded-xl font-medium hover:bg-[#e55a3b] transition-colors">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
