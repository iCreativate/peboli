'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Package, FileText, Ban, AlertCircle } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: "How do I track my order?",
    answer: "Go to 'My Orders' in your account dashboard. Find the order you want to track and click on it. You will see a detailed timeline of your delivery status, including when it was packed, shipped, and estimated arrival."
  },
  {
    question: "Can I cancel my order?",
    answer: "You can cancel an order as long as it hasn't been shipped yet. Navigate to 'My Orders', select the order, and look for the 'Cancel Order' button. If the order is already with the courier, you will need to log a return once it arrives."
  },
  {
    question: "Where is my invoice?",
    answer: "Invoices are automatically generated and emailed to you once your order is confirmed. You can also download them anytime from your Order History page under the specific order details."
  },
  {
    question: "An item is missing from my order",
    answer: "Sometimes orders are split into multiple shipments if items come from different warehouses. Check your order tracking to see if another parcel is on the way. If everything shows as delivered but an item is missing, please contact support."
  },
  {
    question: "I received the wrong item",
    answer: "We apologize for the mistake! Please log a return for the incorrect item, selecting 'Incorrect item delivered' as the reason. We will collect it and send you the correct item as quickly as possible."
  },
  {
    question: "Can I add an item to an existing order?",
    answer: "Unfortunately, we cannot add items to an order once payment has been confirmed. You will need to place a new order for the additional items."
  }
];

export default function OrdersHelpPage() {
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
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-black text-[#1A1D29] mb-2">Orders & Cancellations</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Manage your current orders, view history, and handle cancellations.
                </p>

                <div className="space-y-3">
                  <Link href="/orders" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <Package className="h-4 w-4" />
                      View Order History
                    </span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                   <Link href="/orders" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      Download Invoices
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
                          openFaq === index ? "text-purple-600" : "group-hover:text-purple-600"
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
              <div className="mt-8 bg-purple-50 rounded-2xl p-6 border border-purple-100 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-purple-900">Issue with an order?</h3>
                  <p className="text-sm text-purple-700 mt-1 mb-4">
                    If something went wrong with your delivery or order contents, we'll fix it.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
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
