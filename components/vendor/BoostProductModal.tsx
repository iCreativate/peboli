'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Rocket, Check, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Product = {
  id: string;
  name: string;
  images: string[];
};

type BoostOption = {
  id: string;
  label: string;
  durationLabel: string;
  price: number;
  description: string;
  color: string;
};

const BOOST_OPTIONS: BoostOption[] = [
  { 
    id: 'hourly', 
    label: 'Splash Boost', 
    durationLabel: '1 Hour', 
    price: 5, 
    description: 'Perfect for quick sales spikes',
    color: 'bg-orange-50 text-orange-600 border-orange-100'
  },
  { 
    id: 'daily', 
    label: 'Day Pass', 
    durationLabel: '24 Hours', 
    price: 100, 
    description: 'Dominate the category for a day',
    color: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  { 
    id: 'weekly', 
    label: 'Power Week', 
    durationLabel: '7 Days', 
    price: 600, 
    description: 'Sustained visibility campaign',
    color: 'bg-purple-50 text-purple-600 border-purple-100'
  },
  { 
    id: 'monthly', 
    label: 'Mega Month', 
    durationLabel: '30 Days', 
    price: 2000, 
    description: 'Maximum long-term exposure',
    color: 'bg-green-50 text-green-600 border-green-100'
  },
];

interface BoostProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  walletBalance: number;
}

export function BoostProductModal({ product, isOpen, onClose, onSuccess, walletBalance }: BoostProductModalProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>('daily');
  const [step, setStep] = useState<'plan' | 'payment'>('plan');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft' | 'credit'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleBoost = async () => {
    setIsSubmitting(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const res = await fetch('/api/vendor/products/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          boostType: selectedOption,
          paymentMethod,
        }),
      });

      if (!res.ok) throw new Error('Failed to boost product');

      onSuccess();
      onClose();
      // Reset state
      setStep('plan');
      setPaymentMethod('card');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selected = BOOST_OPTIONS.find(o => o.id === selectedOption);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-600" />
              Boost Product
            </h2>
            <p className="text-sm text-gray-500 mt-1">Promote <span className="font-medium text-gray-900">{product.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'plan' ? (
            <>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {BOOST_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                      selectedOption === option.id
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", option.color)}>
                         {option.id === 'hourly' || option.id === 'daily' ? <Clock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="font-black text-gray-900">R {option.price}</div>
                       <div className="text-xs font-medium text-gray-500">{option.durationLabel}</div>
                    </div>
                    {selectedOption === option.id && (
                      <div className="absolute top-1/2 -translate-y-1/2 -left-3 h-6 w-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 text-sm text-gray-600 flex gap-3">
                 <div className="shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5">i</div>
                 <p>Boosting places your product at the top of search results and category pages for the selected duration.</p>
              </div>

              <Button 
                onClick={() => setStep('payment')}
                className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-black text-white rounded-xl"
              >
                Continue to Payment
              </Button>
            </>
          ) : (
            <div className="space-y-6">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-sm text-gray-500">Selected Plan</span>
                   <span className="font-medium text-gray-900">{selected?.label}</span>
                 </div>
                 <div className="flex justify-between items-center text-lg font-bold">
                   <span>Total</span>
                   <span>R {selected?.price}</span>
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-sm font-semibold text-gray-900">Select Payment Method</label>
                 
                 <div 
                   onClick={() => setPaymentMethod('card')}
                   className={cn(
                     "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                     paymentMethod === 'card' ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"
                   )}
                 >
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                     </div>
                     <div>
                       <div className="font-medium text-gray-900">Credit / Debit Card</div>
                       <div className="text-xs text-gray-500">Pay securely with Paystack</div>
                     </div>
                   </div>
                   <div className="h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center">
                     {paymentMethod === 'card' && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                   </div>
                 </div>

                 <div 
                   onClick={() => setPaymentMethod('eft')}
                   className={cn(
                     "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                     paymentMethod === 'eft' ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"
                   )}
                 >
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
                     </div>
                     <div>
                       <div className="font-medium text-gray-900">Instant EFT</div>
                       <div className="text-xs text-gray-500">Ozow, SiD, PayFast</div>
                     </div>
                   </div>
                   <div className="h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center">
                     {paymentMethod === 'eft' && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                   </div>
                 </div>

                 <div 
                   onClick={() => setPaymentMethod('credit')}
                   className={cn(
                     "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                     paymentMethod === 'credit' ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"
                   )}
                 >
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
                     </div>
                     <div>
                       <div className="font-medium text-gray-900">Wallet Credit</div>
                       <div className={cn("text-xs", walletBalance < (selected?.price || 0) ? "text-red-500 font-medium" : "text-gray-500")}>
                         Balance: R {walletBalance.toFixed(2)}
                       </div>
                     </div>
                   </div>
                   <div className="h-4 w-4 rounded-full border border-gray-300 flex items-center justify-center">
                     {paymentMethod === 'credit' && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                   </div>
                 </div>
               </div>

               {paymentMethod === 'credit' && walletBalance < (selected?.price || 0) && (
                 <div className="bg-red-50 border border-red-100 rounded-xl p-4 animate-in slide-in-from-top-2">
                   <div className="flex items-start gap-3">
                     <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5 shrink-0">!</div>
                     <div>
                       <p className="text-sm font-semibold text-red-900">Insufficient Wallet Credit</p>
                       <p className="text-sm text-red-700 mt-1">
                         Your balance is R{walletBalance.toFixed(2)}, but this boost costs R{selected?.price}.
                       </p>
                       <div className="mt-3 flex gap-2">
                         <Button 
                           size="sm" 
                           className="bg-red-600 hover:bg-red-700 text-white h-8 text-xs"
                          onClick={() => {
                            router.push('/vendor/dashboard/wallet');
                          }}
                        >
                          Add Credit
                        </Button>
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="border-red-200 text-red-700 hover:bg-red-100 h-8 text-xs"
                           onClick={() => setPaymentMethod('card')}
                         >
                           Use Card Instead
                         </Button>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               <Button 
                 onClick={handleBoost}
                 disabled={isSubmitting}
                 className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-black text-white rounded-xl mt-6"
               >
                 {isSubmitting ? 'Processing...' : `Pay R ${selected?.price}`}
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
