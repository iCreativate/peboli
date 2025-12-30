'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, CreditCard, Landmark, Loader2, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount: number;
  description: string;
  createdAt: string;
}

export default function VendorWalletPage() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft'>('card');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (status === 'authenticated' && userId) {
      fetchWalletData(userId);
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  const fetchWalletData = async (userId?: string) => {
    try {
      const id = userId || (session?.user as any)?.id;
      if (!id) return;

      const res = await fetch(`/api/vendor/wallet?userId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setBalance(Number(data.balance || 0));
        setPendingBalance(Number(data.pendingBalance || 0));
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch wallet data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 2000));
    
    try {
      const res = await fetch('/api/vendor/wallet/top-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: Number(amount),
          paymentMethod 
        }),
      });
      
      if (res.ok) {
        alert(`Successfully added R${amount} to your wallet!`);
        fetchWalletData();
        setAmount('');
      } else {
        alert('Failed to top up wallet');
      }
    } catch (e) {
      console.error(e);
      alert('Error processing payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
      return <div className="p-8 text-center text-gray-500">Loading wallet details...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet & Payments</h1>
        <p className="text-gray-500 mt-1">Manage your store credit and track your earnings.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">R {balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Funds available for withdrawal or boosting products.
          </div>
        </div>

        {/* Pending Balance Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Balance</p>
              <p className="text-3xl font-bold text-gray-900">R {pendingBalance.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Funds held until orders are delivered.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Transaction History */}
         <div className="bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Transaction History</h3>
            </div>
            <div className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No transactions yet.
                    </div>
                ) : (
                    transactions.map((tx) => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center",
                                    tx.type === 'CREDIT' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                )}>
                                    {tx.type === 'CREDIT' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{tx.description}</p>
                                    <p className="text-xs text-gray-500">{format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={cn(
                                    "font-bold",
                                    tx.type === 'CREDIT' ? "text-green-600" : "text-gray-900"
                                )}>
                                    {tx.type === 'CREDIT' ? '+' : '-'} R {Number(tx.amount).toFixed(2)}
                                </p>
                                <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                    tx.status === 'COMPLETED' ? "bg-green-100 text-green-800" :
                                    tx.status === 'PENDING' ? "bg-amber-100 text-amber-800" :
                                    "bg-gray-100 text-gray-800"
                                )}>
                                    {tx.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
         </div>

        {/* Top Up Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm lg:col-span-1 h-fit">
          <h3 className="font-semibold text-gray-900 mb-6">Top Up Wallet</h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Amount to Add (ZAR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R</span>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg"
                  placeholder="0.00"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Payment Method</label>
              <div className="space-y-3">
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    "cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all",
                    paymentMethod === 'card' 
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="h-8 w-8 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">Card Payment</div>
                    <div className="text-xs text-gray-500">Instant credit</div>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('eft')}
                  className={cn(
                    "cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all",
                    paymentMethod === 'eft' 
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="h-8 w-8 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                    <Landmark className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">Instant EFT</div>
                    <div className="text-xs text-gray-500">Ozow / PayFast</div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleTopUp} 
              disabled={processing || !amount} 
              className="bg-gray-900 hover:bg-black text-white w-full h-11 text-base font-medium"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Add Funds'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
