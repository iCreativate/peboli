'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, Truck, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: "How much does delivery cost?",
    answer: "Delivery fees are calculated based on your location and the total value of your order. Standard delivery is FREE for orders over R500. For orders under R500, a standard fee of R60 applies. Express and Same-Day delivery options are available at higher rates in select areas."
  },
  {
    question: "When will I get my order?",
    answer: "Delivery times depend on the shipping method selected and your location. Standard delivery typically takes 2-5 business days. Express delivery takes 1-2 business days. You can see the estimated delivery date on the product page and during checkout."
  },
  {
    question: "Can I change my delivery address?",
    answer: "You can change your delivery address for an order only if it hasn't been shipped yet. Go to 'My Orders', select the order, and look for the 'Change Address' option. If the order is already with the courier, please contact support immediately."
  },
  {
    question: "What if I'm not available to receive my order?",
    answer: "If you're not available, the courier will attempt to contact you or leave a card. They will usually try to deliver again on the next business day. You can also contact the courier directly using the tracking info provided to arrange a specific time or collection."
  },
  {
    question: "Do you deliver on weekends?",
    answer: "Standard delivery is Monday to Friday, 8am to 5pm. However, we do offer special Weekend Delivery options for certain areas at an additional cost. This option must be selected during checkout."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, Peboli only ships to addresses within South Africa. We do not offer international shipping at this time."
  }
];

export default function DeliveryHelpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeliveryHelpContent />
    </Suspense>
  );
}

function DeliveryHelpContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    const faqParam = searchParams.get('faq');
    
    if (faqParam === 'address') {
      setOpenFaq(2); // Index of "Can I change my delivery address?"
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 lg:px-6">
          <Link href="/help" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar / Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-black text-[#1A1D29] mb-2">Delivery & Collection</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Everything you need to know about getting your order to your door or a collection point.
                </p>

                <div className="space-y-3">
                  <Link href="/orders" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <MapPin className="h-4 w-4" />
                      Track my order
                    </span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                  <Link href="/shipping" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <Calendar className="h-4 w-4" />
                      Delivery Times
                    </span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-[#1A1D29]">Frequently Asked Questions</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {FAQS.map((faq, index) => (
                    <button
                      key={index}
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full text-left p-6 hover:bg-gray-50 transition-colors flex items-start gap-4 group"
                    >
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-semibold text-[#1A1D29] transition-colors",
                          openFaq === index ? "text-blue-600" : "group-hover:text-blue-600"
                        )}>
                          {faq.question}
                        </h3>
                        <div className={cn(
                          "grid transition-all duration-300 ease-in-out text-sm text-gray-500 overflow-hidden",
                          openFaq === index ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                        )}>
                          <div className="overflow-hidden leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                      <div className={cn(
                        "flex-shrink-0 transition-transform duration-300 mt-1",
                        openFaq === index ? "rotate-180" : ""
                      )}>
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Support CTA */}
              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900">Still can't find the answer?</h3>
                  <p className="text-sm text-blue-700 mt-1 mb-4">
                    Our support team is here to help with any specific delivery issues you might be facing.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Contact Support
                  </Link>
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
