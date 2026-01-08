'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  X,
  Check,
  Key,
  Link as LinkIcon,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'refund' | 'fee';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  reference: string;
};

type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
  balance: number;
  currency: string;
  isActive: boolean;
  branchCode?: string;
  accountHolderName?: string;
};

type PaymentIntegration = {
  id: string;
  name: string;
  type: 'yoco' | 'ikhokha';
  isEnabled: boolean;
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  testMode?: boolean;
};

export default function BankingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'transactions' | 'settings'>('overview');
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [paymentIntegrations, setPaymentIntegrations] = useState<PaymentIntegration[]>([
    { id: 'yoco', name: 'Yoco', type: 'yoco', isEnabled: false },
    { id: 'ikhokha', name: 'iKhokha', type: 'ikhokha', isEnabled: false },
  ]);
  const [isPending, startTransition] = useTransition();
  
  // Form state for adding/editing accounts
  const [accountForm, setAccountForm] = useState({
    bankName: '',
    accountNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
    branchCode: '',
    accountHolderName: '',
    currency: 'ZAR',
  });

  useEffect(() => {
    // Fetch banking data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch payment integrations
        const integrationsRes = await fetch('/api/admin/payment-integrations');
        if (integrationsRes.ok) {
          const integrationsData = await integrationsRes.json();
          if (integrationsData.success && integrationsData.integrations) {
            setPaymentIntegrations(integrationsData.integrations);
          }
        }

        // TODO: Fetch bank accounts from API
        // const accountsRes = await fetch('/api/admin/bank-accounts');
        // if (accountsRes.ok) {
        //   const accountsData = await accountsRes.json();
        //   if (accountsData.success && accountsData.accounts) {
        //     setAccounts(accountsData.accounts);
        //   }
        // }

        // TODO: Fetch transactions from API
        // const transactionsRes = await fetch('/api/admin/transactions');
        // if (transactionsRes.ok) {
        //   const transactionsData = await transactionsRes.json();
        //   if (transactionsData.success && transactionsData.transactions) {
        //     setTransactions(transactionsData.transactions);
        //   }
        // }
      } catch (error) {
        console.error('Error fetching banking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const monthlyIncome = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(t => (t.type === 'withdrawal' || t.type === 'fee') && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'accounts', label: 'Bank Accounts' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'settings', label: 'Settings' },
  ];

  // Optimized event handlers for better INP
  const handleAddAccountClick = useCallback(() => {
    startTransition(() => {
      setAccountForm({
        bankName: '',
        accountNumber: '',
        accountType: 'checking',
        branchCode: '',
        accountHolderName: '',
        currency: 'ZAR',
      });
      setShowAddAccountModal(true);
    });
  }, []);

  const handleTabClick = useCallback((tabId: string) => {
    startTransition(() => {
      setActiveTab(tabId as any);
    });
  }, []);

  const handleSaveAccount = useCallback(() => {
    if (!accountForm.bankName || !accountForm.accountNumber) {
      alert('Please fill in all required fields');
      return;
    }
    
    startTransition(() => {
      const newAccount: BankAccount = {
        id: Date.now().toString(),
        bankName: accountForm.bankName,
        accountNumber: `****${accountForm.accountNumber.slice(-4)}`,
        accountType: accountForm.accountType,
        balance: 0,
        currency: accountForm.currency,
        isActive: true,
        branchCode: accountForm.branchCode,
        accountHolderName: accountForm.accountHolderName,
      };
      
      setAccounts(prev => [...prev, newAccount]);
      setShowAddAccountModal(false);
      setAccountForm({
        bankName: '',
        accountNumber: '',
        accountType: 'checking',
        branchCode: '',
        accountHolderName: '',
        currency: 'ZAR',
      });
    });
  }, [accountForm]);

  const handleUpdateAccount = useCallback(() => {
    if (!accountForm.bankName || !accountForm.accountNumber || !editingAccount) {
      alert('Please fill in all required fields');
      return;
    }
    
    startTransition(() => {
      setAccounts(prev => prev.map(acc => 
        acc.id === editingAccount.id 
          ? {
              ...acc,
              bankName: accountForm.bankName,
              accountNumber: `****${accountForm.accountNumber.slice(-4)}`,
              accountType: accountForm.accountType,
              branchCode: accountForm.branchCode,
              accountHolderName: accountForm.accountHolderName,
              currency: accountForm.currency,
            }
          : acc
      ));
      setShowEditAccountModal(false);
      setEditingAccount(null);
    });
  }, [accountForm, editingAccount]);

  const handleSaveIntegration = useCallback(async (integration: PaymentIntegration) => {
    try {
      const response = await fetch('/api/admin/payment-integrations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ integration }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state with saved integration
        setPaymentIntegrations(prev => 
          prev.map(i => i.id === integration.id ? { ...i, ...data.integration } : i)
        );
        alert(`${integration.name} settings saved successfully!`);
      } else {
        alert(`Failed to save ${integration.name} settings: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving payment integration:', error);
      alert(`Failed to save ${integration.name} settings. Please try again.`);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1D29]">Banking</h1>
          <p className="text-sm text-[#8B95A5] mt-1">Manage bank accounts, transactions, and financial settings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleAddAccountClick}
            className="h-10 rounded-xl text-white border-0 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1A2333 45%, #0B1220 100%)' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative pb-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#8B95A5]">Total Balance</span>
                    <Wallet className="h-5 w-5 text-[#8B95A5]" />
                  </div>
                  <p className="text-2xl font-bold text-[#1A1D29]">R {totalBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-[#8B95A5] mt-1">{accounts.length} active account{accounts.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#8B95A5]">Monthly Income</span>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">R {monthlyIncome.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-[#8B95A5] mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    This month
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#8B95A5]">Monthly Expenses</span>
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">R {monthlyExpenses.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-[#8B95A5] mt-1 flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3" />
                    This month
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#8B95A5]">Pending</span>
                    <CreditCard className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
                  <p className="text-xs text-[#8B95A5] mt-1">Transactions</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1A1D29]">Recent Transactions</h2>
                  <Button variant="ghost" size="sm" className="text-sm">
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No transactions yet</p>
                      <p className="text-sm text-gray-400 mt-2">Transactions will appear here once you start processing payments</p>
                    </div>
                  ) : (
                    transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-100 text-green-600' :
                          transaction.type === 'withdrawal' ? 'bg-blue-100 text-blue-600' :
                          transaction.type === 'refund' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {transaction.type === 'deposit' ? <ArrowUpRight className="h-5 w-5" /> :
                           transaction.type === 'withdrawal' ? <ArrowDownRight className="h-5 w-5" /> :
                           <CreditCard className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A1D29]">{transaction.description}</p>
                          <p className="text-xs text-[#8B95A5]">{transaction.reference} • {new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}R {transaction.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs ${
                          transaction.status === 'completed' ? 'text-green-600' :
                          transaction.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                <h2 className="text-lg font-bold text-[#1A1D29] mb-4">Bank Accounts</h2>
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1A1D29]">{account.bankName}</p>
                            <p className="text-xs text-[#8B95A5]">{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} • {account.accountNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#1A1D29]">R {account.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p className="text-xs text-[#8B95A5]">{account.currency}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                          onClick={() => {
                            setEditingAccount(account);
                            setAccountForm({
                              bankName: account.bankName,
                              accountNumber: account.accountNumber.replace(/\*/g, ''),
                              accountType: account.accountType,
                              branchCode: account.branchCode || '',
                              accountHolderName: account.accountHolderName || '',
                              currency: account.currency,
                            });
                            setShowEditAccountModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove ${account.bankName}?`)) {
                              setAccounts(accounts.filter(a => a.id !== account.id));
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1A1D29]">All Transactions</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                      <Input
                        id="searchTransactions"
                        name="searchTransactions"
                        type="search"
                        placeholder="Search transactions..."
                        className="h-10 rounded-xl pl-10 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="h-10 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase tracking-wider">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#8B95A5] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
                              <p className="text-gray-500 font-medium">No transactions found</p>
                              <p className="text-sm text-gray-400 mt-2">
                                {searchQuery ? 'Try adjusting your search' : 'Transactions will appear here once you start processing payments'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1D29]">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'deposit' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'withdrawal' ? 'bg-blue-100 text-blue-800' :
                              transaction.type === 'refund' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#1A1D29]">{transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8B95A5]">{transaction.reference}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                            transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}R {transaction.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Payment Integrations */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                <h2 className="text-lg font-bold text-[#1A1D29] mb-4">Payment Integrations</h2>
                <p className="text-sm text-[#8B95A5] mb-6">Connect payment gateways to accept payments from customers.</p>
                
                <div className="space-y-4">
                  {paymentIntegrations.map((integration) => (
                    <div key={integration.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            integration.type === 'yoco' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#1A1D29]">{integration.name}</h3>
                            <p className="text-xs text-[#8B95A5]">
                              {integration.type === 'yoco' 
                                ? 'Accept card payments via Yoco' 
                                : 'Accept card payments via iKhokha'}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id={`enable-${integration.id}`}
                            name={`enable-${integration.id}`}
                            checked={integration.isEnabled}
                            onChange={(e) => {
                              setPaymentIntegrations(prev => 
                                prev.map(i => i.id === integration.id ? { ...i, isEnabled: e.target.checked } : i)
                              );
                            }}
                            className="sr-only peer"
                            aria-label={`Enable ${integration.name} payment integration`}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      {integration.isEnabled && (
                        <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                          <div>
                            <label htmlFor={`apiKey-${integration.id}`} className="text-sm font-semibold text-[#1A1D29] mb-1 block">
                              API Key / Public Key
                            </label>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                              <Input
                                id={`apiKey-${integration.id}`}
                                name={`apiKey-${integration.id}`}
                                type="password"
                                placeholder={integration.type === 'yoco' ? 'Yoco Public Key' : 'iKhokha API Key'}
                                value={integration.apiKey || ''}
                                onChange={(e) => {
                                  setPaymentIntegrations(prev => 
                                    prev.map(i => i.id === integration.id ? { ...i, apiKey: e.target.value } : i)
                                  );
                                }}
                                className="h-10 rounded-xl pl-10"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor={`secretKey-${integration.id}`} className="text-sm font-semibold text-[#1A1D29] mb-1 block">
                              Secret Key
                            </label>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                              <Input
                                id={`secretKey-${integration.id}`}
                                name={`secretKey-${integration.id}`}
                                type="password"
                                placeholder={integration.type === 'yoco' ? 'Yoco Secret Key' : 'iKhokha Secret Key'}
                                value={integration.secretKey || ''}
                                onChange={(e) => {
                                  setPaymentIntegrations(prev => 
                                    prev.map(i => i.id === integration.id ? { ...i, secretKey: e.target.value } : i)
                                  );
                                }}
                                className="h-10 rounded-xl pl-10"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor={`webhookUrl-${integration.id}`} className="text-sm font-semibold text-[#1A1D29] mb-1 block">
                              Webhook URL
                            </label>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                              <Input
                                id={`webhookUrl-${integration.id}`}
                                name={`webhookUrl-${integration.id}`}
                                type="text"
                                placeholder="https://peboli.store/api/webhooks/payment"
                                value={integration.webhookUrl || ''}
                                onChange={(e) => {
                                  setPaymentIntegrations(prev => 
                                    prev.map(i => i.id === integration.id ? { ...i, webhookUrl: e.target.value } : i)
                                  );
                                }}
                                className="h-10 rounded-xl pl-10"
                              />
                            </div>
                            <p className="text-xs text-[#8B95A5] mt-1">This URL will receive payment notifications</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`testMode-${integration.id}`}
                              checked={integration.testMode || false}
                              onChange={(e) => {
                                setPaymentIntegrations(prev => 
                                  prev.map(i => i.id === integration.id ? { ...i, testMode: e.target.checked } : i)
                                );
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`testMode-${integration.id}`} className="text-sm text-[#8B95A5]">
                              Enable test mode (sandbox)
                            </label>
                          </div>
                          <Button 
                            className="h-10 rounded-xl text-white font-bold w-full border-0 hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1A2333 45%, #0B1220 100%)' }}
                            onClick={() => handleSaveIntegration(integration)}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save {integration.name} Settings
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Banking Settings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 premium-shadow">
                <h2 className="text-lg font-bold text-[#1A1D29] mb-4">Banking Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="defaultCurrency" className="text-sm font-semibold text-[#1A1D29]">Default Currency</label>
                    <select id="defaultCurrency" name="defaultCurrency" className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1D29] focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="autoReconcile" className="text-sm font-semibold text-[#1A1D29]">Auto-Reconciliation</label>
                    <div className="mt-2 flex items-center gap-2">
                      <input type="checkbox" id="autoReconcile" name="autoReconcile" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="autoReconcile" className="text-sm text-[#8B95A5]">Automatically reconcile transactions daily</label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Transaction Notifications</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="notifyDeposits" name="notifyDeposits" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="notifyDeposits" className="text-sm text-[#8B95A5]">Notify on deposits</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="notifyWithdrawals" name="notifyWithdrawals" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="notifyWithdrawals" className="text-sm text-[#8B95A5]">Notify on withdrawals</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="notifyFailures" name="notifyFailures" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="notifyFailures" className="text-sm text-[#8B95A5]">Notify on failed transactions</label>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="h-11 rounded-xl text-white font-bold border-0 hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1A2333 45%, #0B1220 100%)' }}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 premium-shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A1D29]">Add Bank Account</h2>
              <button
                onClick={() => setShowAddAccountModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-[#8B95A5]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="add-modal-bankName" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Bank Name</label>
                <Input
                  id="add-modal-bankName"
                  name="add-modal-bankName"
                  placeholder="e.g. Standard Bank, FNB, ABSA"
                  value={accountForm.bankName}
                  onChange={(e) => setAccountForm({ ...accountForm, bankName: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div>
                <label htmlFor="add-modal-accountNumber" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Number</label>
                <Input
                  id="add-modal-accountNumber"
                  name="add-modal-accountNumber"
                  type="text"
                  placeholder="Enter account number"
                  value={accountForm.accountNumber}
                  onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div>
                <label htmlFor="add-modal-accountHolderName" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Holder Name</label>
                <Input
                  id="add-modal-accountHolderName"
                  name="add-modal-accountHolderName"
                  placeholder="Account holder's full name"
                  value={accountForm.accountHolderName}
                  onChange={(e) => setAccountForm({ ...accountForm, accountHolderName: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="add-modal-accountType" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Type</label>
                  <select
                    id="add-modal-accountType"
                    name="add-modal-accountType"
                    value={accountForm.accountType}
                    onChange={(e) => setAccountForm({ ...accountForm, accountType: e.target.value as 'checking' | 'savings' })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1D29] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="add-modal-branchCode" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Branch Code</label>
                  <Input
                    id="add-modal-branchCode"
                    name="add-modal-branchCode"
                    placeholder="e.g. 051001"
                    value={accountForm.branchCode}
                    onChange={(e) => setAccountForm({ ...accountForm, branchCode: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="add-modal-currency" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Currency</label>
                <select
                  id="add-modal-currency"
                  name="add-modal-currency"
                  value={accountForm.currency}
                  onChange={(e) => setAccountForm({ ...accountForm, currency: e.target.value })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1D29] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                onClick={() => setShowAddAccountModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl text-white font-bold border-0 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1A2333 45%, #0B1220 100%)' }}
                onClick={handleSaveAccount}
              >
                <Check className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditAccountModal && editingAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 premium-shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A1D29]">Edit Bank Account</h2>
              <button
                onClick={() => {
                  setShowEditAccountModal(false);
                  setEditingAccount(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-[#8B95A5]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-modal-bankName" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Bank Name</label>
                <Input
                  id="edit-modal-bankName"
                  name="edit-modal-bankName"
                  placeholder="e.g. Standard Bank, FNB, ABSA"
                  value={accountForm.bankName}
                  onChange={(e) => setAccountForm({ ...accountForm, bankName: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div>
                <label htmlFor="edit-modal-accountNumber" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Number</label>
                <Input
                  id="edit-modal-accountNumber"
                  name="edit-modal-accountNumber"
                  type="text"
                  placeholder="Enter account number"
                  value={accountForm.accountNumber}
                  onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div>
                <label htmlFor="edit-modal-accountHolderName" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Holder Name</label>
                <Input
                  id="edit-modal-accountHolderName"
                  name="edit-modal-accountHolderName"
                  placeholder="Account holder's full name"
                  value={accountForm.accountHolderName}
                  onChange={(e) => setAccountForm({ ...accountForm, accountHolderName: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-modal-accountType" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Type</label>
                  <select
                    id="edit-modal-accountType"
                    name="edit-modal-accountType"
                    value={accountForm.accountType}
                    onChange={(e) => setAccountForm({ ...accountForm, accountType: e.target.value as 'checking' | 'savings' })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1D29] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-modal-branchCode" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Branch Code</label>
                  <Input
                    id="edit-modal-branchCode"
                    name="edit-modal-branchCode"
                    placeholder="e.g. 051001"
                    value={accountForm.branchCode}
                    onChange={(e) => setAccountForm({ ...accountForm, branchCode: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-modal-currency" className="text-sm font-semibold text-[#1A1D29] mb-1 block">Currency</label>
                <select
                  id="edit-modal-currency"
                  name="edit-modal-currency"
                  value={accountForm.currency}
                  onChange={(e) => setAccountForm({ ...accountForm, currency: e.target.value })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1D29] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                onClick={() => {
                  setShowEditAccountModal(false);
                  setEditingAccount(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl text-white font-bold border-0 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1A2333 45%, #0B1220 100%)' }}
                onClick={handleUpdateAccount}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

