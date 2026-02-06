'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, BookOpen, Star, Info, AlertCircle } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: "How do I know if an item is in stock?",
    answer: "The stock status is displayed on every product page. 'In Stock' means it is available for immediate shipping. 'Out of Stock' means it is currently unavailable, but you can sign up for notifications when it returns."
  },
  {
    question: "Do you offer warranties?",
    answer: "Yes, most products come with a standard 6-month warranty against manufacturing defects. Some brands offer extended warranties, which will be specified on the product page or in the manual."
  },
  {
    question: "How do reviews work?",
    answer: "Only verified buyers can leave reviews on products they have purchased. This ensures that all ratings and feedback on our platform are genuine and helpful to other customers."
  },
  {
    question: "Can I pre-order items?",
    answer: "Yes, we offer pre-orders for highly anticipated releases (e.g., games, consoles, new tech). The expected release date will be shown, and we will ship the item to arrive as close to that date as possible."
  },
  {
    question: "Where can I find product specifications?",
    answer: "Detailed specifications, dimensions, and features are listed in the 'Description' and 'Specifications' tabs on the product page. If you need more info, you can ask a question in the Q&A section."
  },
  {
    question: "What if the price drops after I buy?",
    answer: "Our prices fluctuate based on suppliers and promotions. We do not offer price protection or refunds for price drops that occur after your purchase has been completed."
  }
];

export default function ProductsHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                <div className="h-12 w-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-black text-[#1A1D29] mb-2">Product & Stock</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Information about product availability, warranties, and specifications.
                </p>

                <div className="space-y-3">
                  <Link href="/deals" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-pink-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <Star className="h-4 w-4" />
                      View Daily Deals
                    </span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                   <Link href="/contact" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-pink-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <Info className="h-4 w-4" />
                      Product Enquiry
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
                          openFaq === index ? "text-pink-600" : "group-hover:text-pink-600"
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
              <div className="mt-8 bg-pink-50 rounded-2xl p-6 border border-pink-100 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-pink-900">Have a specific product question?</h3>
                  <p className="text-sm text-pink-700 mt-1 mb-4">
                    Our team can help verify specs or check stock availability for you.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 py-2 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 transition-colors"
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
