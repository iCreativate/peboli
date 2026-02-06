'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Shield, User, Lock, Mail, AlertCircle } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: "How do I reset my password?",
    answer: "Go to the Login page and click 'Forgot Password?'. Enter your email address, and we will send you a link to reset your password. If you don't see the email, check your spam folder."
  },
  {
    question: "How do I update my personal details?",
    answer: "Log in to your account and go to 'My Profile'. Here you can update your name, email address, phone number, and saved delivery addresses."
  },
  {
    question: "How do I unsubscribe from newsletters?",
    answer: "You can manage your communication preferences in your Account Dashboard under 'Newsletter Subscriptions'. Simply uncheck the boxes for the emails you no longer wish to receive."
  },
  {
    question: "How do I delete my account?",
    answer: "To permanently delete your account and all associated data, please contact our support team. Note that this action is irreversible and you will lose your order history and any saved credits."
  },
  {
    question: "My account is locked",
    answer: "If you enter the wrong password too many times, your account may be temporarily locked for security. Wait 30 minutes and try again, or use the 'Forgot Password' feature to reset it."
  },
  {
    question: "Is my personal information safe?",
    answer: "We take data privacy seriously. Your personal information is encrypted and stored securely in compliance with the POPI Act. We never share your data with third parties without your consent."
  }
];

export default function AccountHelpPage() {
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
                <div className="h-12 w-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-black text-[#1A1D29] mb-2">Account & Security</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Manage your profile, login security, and privacy settings.
                </p>

                <div className="space-y-3">
                  <Link href="/account" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      Edit Profile
                    </span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                   <Link href="/account" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3">
                      <Lock className="h-4 w-4" />
                      Change Password
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
                          openFaq === index ? "text-gray-900" : "group-hover:text-gray-900"
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
              <div className="mt-8 bg-gray-100 rounded-2xl p-6 border border-gray-200 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Can't access your account?</h3>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    If you're locked out or suspect unauthorized access, let us know immediately.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors"
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
