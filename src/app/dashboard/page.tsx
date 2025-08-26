'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  MessageCircle,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock data - replace with actual API calls
const mockStats = {
  todayRevenue: 125000,
  pendingPayments: 45000,
  totalCustomers: 24,
  totalInvoices: 156,
  monthlyRevenue: 850000,
  weeklyRevenue: 320000,
};

const mockInvoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-0001',
    customerName: 'John Doe',
    amount: 25000,
    status: 'paid',
    dueDate: '2025-01-15',
    createdAt: '2025-01-10',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-0002',
    customerName: 'Jane Smith',
    amount: 15000,
    status: 'pending',
    dueDate: '2025-01-20',
    createdAt: '2025-01-12',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-0003',
    customerName: 'Mike Johnson',
    amount: 35000,
    status: 'overdue',
    dueDate: '2025-01-08',
    createdAt: '2025-01-05',
  },
];

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState(mockStats);
  const [invoices, setInvoices] = useState(mockInvoices);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">InvoicePro</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">InvoicePro</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/invoices"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <FileText className="w-5 h-5 mr-3" />
                Invoices
              </Link>
              <Link
                href="/customers"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <Users className="w-5 h-5 mr-3" />
                Customers
              </Link>
              <Link
                href="/payments"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <DollarSign className="w-5 h-5 mr-3" />
                Payments
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="px-4 space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <TrendingUp className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href="/invoices"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    Invoices
                  </Link>
                  <Link
                    href="/customers"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    Customers
                  </Link>
                  <Link
                    href="/payments"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <DollarSign className="w-5 h-5 mr-3" />
                    Payments
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="container-mobile container-tablet container-desktop">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                      <p className="mt-1 text-sm text-gray-600">
                        Welcome back! Here's what's happening with your business today.
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Link href="/invoices/create">
                        <Button className="w-full sm:w-auto">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Invoice
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="dashboard-card">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="dashboard-label">Today's Revenue</p>
                        <p className="dashboard-stat">{formatCurrency(stats.todayRevenue)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="dashboard-label">Pending Payments</p>
                        <p className="dashboard-stat">{formatCurrency(stats.pendingPayments)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="dashboard-label">Total Customers</p>
                        <p className="dashboard-stat">{stats.totalCustomers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="dashboard-label">Total Invoices</p>
                        <p className="dashboard-stat">{stats.totalInvoices}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Invoices */}
                <div className="dashboard-card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
                    <Link href="/invoices">
                      <Button variant="ghost" size="sm">
                        View all
                      </Button>
                    </Link>
                  </div>

                  <div className="overflow-hidden">
                    <div className="table-responsive">
                      <table className="table-mobile">
                        <thead>
                          <tr>
                            <th>Invoice</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                              <td>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {invoice.invoiceNumber}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(invoice.createdAt)}
                                  </p>
                                </div>
                              </td>
                              <td>
                                <p className="text-sm text-gray-900">{invoice.customerName}</p>
                              </td>
                              <td>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatCurrency(invoice.amount)}
                                </p>
                              </td>
                              <td>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                  {getStatusIcon(invoice.status)}
                                  <span className="ml-1 capitalize">{invoice.status}</span>
                                </span>
                              </td>
                              <td>
                                <p className="text-sm text-gray-900">
                                  {formatDate(invoice.dueDate)}
                                </p>
                              </td>
                              <td>
                                <div className="flex items-center space-x-2">
                                  <Link href={`/invoices/${invoice.id}`}>
                                    <Button variant="ghost" size="sm">
                                      View
                                    </Button>
                                  </Link>
                                  {invoice.status === 'pending' && (
                                    <Button variant="whatsapp" size="sm">
                                      <MessageCircle className="w-4 h-4 mr-1" />
                                      Send
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden bottom-nav">
        <div className="flex justify-around">
          <Link href="/dashboard" className="bottom-nav-item active">
            <TrendingUp className="w-5 h-5 mb-1" />
            <span>Dashboard</span>
          </Link>
          <Link href="/invoices" className="bottom-nav-item">
            <FileText className="w-5 h-5 mb-1" />
            <span>Invoices</span>
          </Link>
          <Link href="/invoices/create" className="bottom-nav-item">
            <Plus className="w-5 h-5 mb-1" />
            <span>Create</span>
          </Link>
          <Link href="/customers" className="bottom-nav-item">
            <Users className="w-5 h-5 mb-1" />
            <span>Customers</span>
          </Link>
          <Link href="/settings" className="bottom-nav-item">
            <Settings className="w-5 h-5 mb-1" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}