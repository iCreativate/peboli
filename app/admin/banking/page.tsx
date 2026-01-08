'use client';

import { useState, useEffect } from 'react';
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
    // TODO: Replace with actual API call
    setLoading(true);
    setTimeout(() => {
      setAccounts([
        {
          id: '1',
          bankName: 'Standard Bank',
          accountNumber: '****1234',
          accountType: 'checking',
          balance: 125000.50,
          currency: 'ZAR',
          isActive: true,
        },
        {
          id: '2',
          bankName: 'FNB',
          accountNumber: '****5678',
          accountType: 'savings',
          balance: 50000.00,
          currency: 'ZAR',
          isActive: true,
        },
      ]);
      setTransactions([
        {
          id: '1',
          type: 'deposit',
          amount: 5000.00,
          description: 'Order payment from customer',
          status: 'completed',
          date: new Date().toISOString(),
          reference: 'ORD-12345',
        },
        {
          id: '2',
          type: 'withdrawal',
          amount: 2500.00,
          description: 'Vendor payout',
          status: 'completed',
          date: new Date(Date.now() - 86400000).toISOString(),
          reference: 'PAY-67890',
        },
        {
          id: '3',
          type: 'fee',
          amount: 50.00,
          description: 'Transaction fee',
          status: 'completed',
          date: new Date(Date.now() - 172800000).toISOString(),
          reference: 'FEE-11111',
        },
      ]);
      setLoading(false);
    }, 500);
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
            onClick={() => {
              setAccountForm({
                bankName: '',
                accountNumber: '',
                accountType: 'checking',
                branchCode: '',
                accountHolderName: '',
                currency: 'ZAR',
              });
              setShowAddAccountModal(true);
            }}
            className="h-10 rounded-xl premium-gradient text-white"
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
            onClick={() => setActiveTab(tab.id as any)}
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
                  {transactions.slice(0, 5).map((transaction) => (
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
                  ))}
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
                      {filteredTransactions.map((transaction) => (
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
                      ))}
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
                            checked={integration.isEnabled}
                            onChange={(e) => {
                              setPaymentIntegrations(prev => 
                                prev.map(i => i.id === integration.id ? { ...i, isEnabled: e.target.checked } : i)
                              );
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      {integration.isEnabled && (
                        <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                          <div>
                            <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">
                              API Key / Public Key
                            </label>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                              <Input
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
                            <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">
                              Secret Key
                            </label>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                              <Input
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
                            <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">
                              Webhook URL
                            </label>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                              <Input
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
                            className="h-10 rounded-xl premium-gradient text-white font-bold w-full"
                            onClick={() => {
                              // TODO: Save integration settings to API
                              alert(`${integration.name} settings saved!`);
                            }}
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
                    <label className="text-sm font-semibold text-[#1A1D29]">Default Currency</label>
                    <select className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1D29] focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Auto-Reconciliation</label>
                    <div className="mt-2 flex items-center gap-2">
                      <input type="checkbox" id="autoReconcile" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="autoReconcile" className="text-sm text-[#8B95A5]">Automatically reconcile transactions daily</label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Transaction Notifications</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="notifyDeposits" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="notifyDeposits" className="text-sm text-[#8B95A5]">Notify on deposits</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="notifyWithdrawals" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="notifyWithdrawals" className="text-sm text-[#8B95A5]">Notify on withdrawals</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="notifyFailures" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="notifyFailures" className="text-sm text-[#8B95A5]">Notify on failed transactions</label>
                      </div>
                    </div>
                  </div>
                  <Button className="h-11 rounded-xl premium-gradient text-white font-bold">
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
                <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Bank Name</label>
                <Input
                  placeholder="e.g. Standard Bank, FNB, ABSA"
                  value={accountForm.bankName}
                  onChange={(e) => setAccountForm({ ...accountForm, bankName: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Number</label>
                <Input
                  type="text"
                  placeholder="Enter account number"
                  value={accountForm.accountNumber}
                  onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Holder Name</label>
                <Input
                  placeholder="Account holder's full name"
                  value={accountForm.accountHolderName}
                  onChange={(e) => setAccountForm({ ...accountForm, accountHolderName: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Type</label>
                  <select
                    value={accountForm.accountType}
                    onChange={(e) => setAccountForm({ ...accountForm, accountType: e.target.value as 'checking' | 'savings' })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1D29] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Branch Code</label>
                  <Input
                    placeholder="e.g. 051001"
                    value={accountForm.branchCode}
                    onChange={(e) => setAccountForm({ ...accountForm, branchCode: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Currency</label>
                <select
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
                className="flex-1 h-11 rounded-xl premium-gradient text-white font-bold"
                onClick={() => {
                  if (!accountForm.bankName || !accountForm.accountNumber) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  
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
                  
                  setAccounts([...accounts, newAccount]);
                  setShowAddAccountModal(false);
                  setAccountForm({
                    bankName: '',
                    accountNumber: '',
                    accountType: 'checking',
                    branchCode: '',
                    accountHolderName: '',
                    currency: 'ZAR',
                  });
                }}
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
                <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Bank Name</label>
                <Input
                  placeholder="e.g. Standard Bank, FNB, ABSA"
                  value={accountForm.bankName}
                  onChange={(e) => setAccountForm({ ...accountForm, bankName: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Number</label>
                <Input
                  type="text"
                  placeholder="Enter account number"
                  value={accountForm.accountNumber}
                  onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Holder Name</label>
                <Input
                  placeholder="Account holder's full name"
                  value={accountForm.accountHolderName}
                  onChange={(e) => setAccountForm({ ...accountForm, accountHolderName: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Account Type</label>
                  <select
                    value={accountForm.accountType}
                    onChange={(e) => setAccountForm({ ...accountForm, accountType: e.target.value as 'checking' | 'savings' })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1D29] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Branch Code</label>
                  <Input
                    placeholder="e.g. 051001"
                    value={accountForm.branchCode}
                    onChange={(e) => setAccountForm({ ...accountForm, branchCode: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-[#1A1D29] mb-1 block">Currency</label>
                <select
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
                className="flex-1 h-11 rounded-xl premium-gradient text-white font-bold"
                onClick={() => {
                  if (!accountForm.bankName || !accountForm.accountNumber) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  
                  setAccounts(accounts.map(acc => 
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
                }}
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

