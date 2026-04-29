import { useState } from 'react';

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  status: 'Negotiation' | 'Proposal' | 'Won' | 'Lost';
  closeDate: string;
}

interface DealsTableProps {
  userRole: 'admin' | 'sales';
}

export default function DealsTable({ userRole }: DealsTableProps) {
  const [deals] = useState<Deal[]>([
    { id: '1', name: 'TechCorp - Enterprise', company: 'TechCorp', value: 45000, status: 'Negotiation', closeDate: '2026-03-15' },
    { id: '2', name: 'Innovate - Pro Services', company: 'Innovate Inc', value: 28000, status: 'Proposal', closeDate: '2026-03-20' },
    { id: '3', name: 'GlobalTech - Consultation', company: 'GlobalTech', value: 15000, status: 'Negotiation', closeDate: '2026-03-10' },
  ]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Negotiation': return 'bg-yellow-100 text-yellow-800';
      case 'Proposal': return 'bg-blue-100 text-blue-800';
      case 'Won': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Deals</h2>
        {userRole === 'sales' && (
          <p className="text-sm text-gray-500">🔒 View only - No delete access</p>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Deal Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Close Date</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{deal.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{deal.company}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">{formatCurrency(deal.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(deal.closeDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => { setSelectedDeal(deal); setShowViewModal(true); }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                  >
                    👁️ View
                  </button>
                  <button
                    disabled={userRole === 'sales'}
                    className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                      userRole === 'sales' 
                        ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                        : 'hover:bg-red-50 text-red-600'
                    }`}
                    title={userRole === 'sales' ? 'Sales users cannot delete deals' : ''}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{deal.name}</h3>
                <p className="text-sm text-gray-600">{deal.company}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deal.status)}`}>
                {deal.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">{formatCurrency(deal.value)}</span>
              <span className="text-sm text-gray-600">{new Date(deal.closeDate).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setSelectedDeal(deal); setShowViewModal(true); }}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                👁️ View
              </button>
              <button
                disabled={userRole === 'sales'}
                className={`flex-1 px-3 py-2 text-sm border border-gray-300 rounded ${
                  userRole === 'sales' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'
                }`}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {showViewModal && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Deal Details</h3>
            <p className="text-sm text-gray-500">View-only access</p>
            <div className="space-y-3 pt-2">
              <div>
                <p className="text-sm text-gray-500">Deal Name</p>
                <p className="font-medium text-gray-900">{selectedDeal.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium text-gray-900">{selectedDeal.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Value</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedDeal.value)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedDeal.status)}`}>
                  {selectedDeal.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Close Date</p>
                <p className="font-medium text-gray-900">{new Date(selectedDeal.closeDate).toLocaleDateString()}</p>
              </div>
            </div>
            <button onClick={() => setShowViewModal(false)} className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
