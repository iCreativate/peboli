'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, RotateCcw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: "What is your return policy?",
    answer: "You can return any unwanted item within 30 days of receipt, provided it is unused, in its original packaging, and in a resellable condition. Defective items can be returned within 6 months under our standard warranty policy."
  },
  {
    question: "How do I log a return?",
    answer: "To log a return, go to 'My Orders', select the order containing the item you want to return, and click 'Return Item'. Follow the prompts to choose a reason and your preferred refund method. We will then arrange a collection or drop-off."
  },
  {
    question: "How long does a refund take?",
    answer: "Once we have received and inspected your returned item (usually within 2-4 days of collection), we will process your refund. Funds can take 3-5 business days to reflect in your account, depending on your bank. Credits to your Peboli account are instant."
  },
  {
    question: "Can I exchange an item?",
    answer: "Yes, you can exchange an item for a different size or color of the same product, subject to stock availability. If the new item is cheaper, we will refund the difference. If it is more expensive, you will need to pay the difference."
  },
  {
    question: "What if I received a damaged item?",
    answer: "If your item arrives damaged, please log a return immediately (within 7 days) selecting 'Damaged on arrival' as the reason. Upload photos of the damage if possible. We will arrange a free collection and a replacement or full refund."
  },
  {
    question: "Are there any items I cannot return?",
    answer: "For hygiene and safety reasons, certain products cannot be returned if opened, such as software, personal care items (e.g., earrings, cosmetics), and perishable goods, unless they are defective."
  }
];

export default function ReturnsHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const faqParam = params.get('faq');
    
    if (faqParam === 'refund') {
      setOpenFaq(2); // Index of "How long does a refund take?"
    }
  }, []);

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
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-black text-[#1A1D29] mb-2">Returns & Refunds</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Information on returning products, warranties, and getting your money back.
                </p>

                <div className="space-y-3">
                  <Link href="/returns" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      Log a Return
                    </span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                  <Link href="/returns" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4" />
                      Check Return Status
                    </span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                          openFaq === index ? "text-orange-600" : "group-hover:text-orange-600"
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
              <div className="mt-8 bg-orange-50 rounded-2xl p-6 border border-orange-100 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-orange-900">Need help with a return?</h3>
                  <p className="text-sm text-orange-700 mt-1 mb-4">
                    If you're having trouble logging a return or haven't received your refund, let us know.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors"
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
