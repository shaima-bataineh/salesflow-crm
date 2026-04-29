import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  totalValue: number;
  linkedLead: string;
}

interface CustomersTableProps {
  userRole: 'admin' | 'sales';
}

export default function CustomersTable({ userRole }: CustomersTableProps) {
  const [customers] = useState<Customer[]>([
    { id: '1', name: 'John Smith', email: 'john@techcorp.com', company: 'TechCorp', totalValue: 45000, linkedLead: '1' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@innovate.io', company: 'Innovate Inc', totalValue: 28000, linkedLead: '2' },
    { id: '3', name: 'Emily Davis', email: 'emily@startup.com', company: 'StartupXYZ', totalValue: 32000, linkedLead: '4' },
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        {userRole === 'sales' && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>🔒</span>
            <span>Read-only access</span>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Linked Lead</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.company}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">{formatCurrency(customer.totalValue)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">Lead #{customer.linkedLead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
            <div>
              <h3 className="font-bold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-600">{customer.company}</p>
            </div>
            <p className="text-sm text-gray-600">{customer.email}</p>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-500">Total Value</span>
              <span className="font-bold text-green-600">{formatCurrency(customer.totalValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Linked Lead</span>
              <span className="text-sm text-gray-900">Lead #{customer.linkedLead}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Notice */}
      {userRole === 'sales' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            <strong>Note:</strong> This is read-only access. Only customers linked to your leads are visible. 
            Contact an administrator for any updates.
          </p>
        </div>
      )}
    </div>
  );
}
