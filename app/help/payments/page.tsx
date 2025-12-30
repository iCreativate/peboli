'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, CreditCard, Ticket, ShieldCheck, AlertCircle } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa and Mastercard credit and debit cards, EFT via Ozow, PayFast, and Peboli Account Credit. We also offer payment options like Mobicred for installment payments."
  },
  {
    question: "Is it safe to use my credit card?",
    answer: "Yes, absolutely. We use industry-standard 3D Secure technology to protect your card details. We do not store your full card number on our servers, and all transactions are encrypted."
  },
  {
    question: "How do I use a coupon code?",
    answer: "You can apply a coupon code during checkout. Look for the 'Add Coupon' or 'Promo Code' field on the payment page, enter your code, and click 'Apply'. The discount will be deducted from your total immediately if valid."
  },
  {
    question: "Can I pay with eBucks?",
    answer: "Currently, we do not support direct eBucks payments. However, you can use your credit card associated with your eBucks account to earn rewards on your purchase."
  },
  {
    question: "Why was my payment declined?",
    answer: "Payments can be declined for various reasons: insufficient funds, incorrect card details, or bank security blocks. Please check your details and try again, or contact your bank to authorize the transaction."
  },
  {
    question: "How do refunds work?",
    answer: "Refunds are processed back to the original payment method used. If you paid by card, the money will be reversed to that card. If you paid by EFT, we will request your banking details to make a deposit. Account credits are instant."
  }
];

export default function PaymentsHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const faqParam = params.get('faq');
    
    if (faqParam === 'options') {
      setOpenFaq(0); // Index of "What payment methods do you accept?"
    } else if (faqParam === 'coupon') {
      setOpenFaq(2); // Index of "How do I use a coupon code?"
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
                <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-black text-[#1A1D29] mb-2">Payments & Promos</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Details on secure payments, using coupons, and troubleshooting transaction issues.
                </p>

                <div className="space-y-3">
                   <Link href="/account" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4" />
                      Manage Cards
                    </span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                  <Link href="/cart" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <Ticket className="h-4 w-4" />
                      Apply Coupon
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
                          openFaq === index ? "text-green-600" : "group-hover:text-green-600"
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
              <div className="mt-8 bg-green-50 rounded-2xl p-6 border border-green-100 flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-green-900">Payment security is our priority</h3>
                  <p className="text-sm text-green-700 mt-1 mb-4">
                    If you suspect any fraudulent activity or have a payment dispute, contact us immediately.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Contact Fraud Support
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
