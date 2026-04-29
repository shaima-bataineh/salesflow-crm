import { useState } from 'react';
import { StatCard } from '../components/StatCard';
import LeadsTable from '../components/tables/LeadsTable';
import DealsTable from '../components/tables/dealstable';
import CustomersTable from '../components/tables/CustomersTable';

export default function DashboardSales() {
  const [activeTab, setActiveTab] = useState<'leads' | 'deals' | 'customers'>('leads');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
            <div className="h-12 w-1 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full"></div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">
                Sales Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Welcome back! Here's your sales overview</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard title="Total Leads" value="4" trend="up" color="orange" />
            <StatCard title="Active Deals" value="3" trend="down" color="orange" />
            <StatCard title="Conversion Rate" value="50%" trend="up" color="orange" />
            <StatCard title="Customers" value="3" trend="down" color="orange" />
          </div>

          {/* Role Access Notice */}
          <div className="bg-white p-4 rounded-lg border border-orange-200 shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Sales User Access</h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  You have limited permissions. You can create and edit your own leads, but cannot delete leads, 
                  convert leads to customers, or delete deals. Customer data is read-only.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row border-b border-gray-200">
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-all ${
                  activeTab === 'leads'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-all ${
                  activeTab === 'deals'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Deals
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-all ${
                  activeTab === 'customers'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Customers
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-x-auto">
              {activeTab === 'leads' && <LeadsTable userRole="sales" />}
              {activeTab === 'deals' && <DealsTable userRole="sales" />}
              {activeTab === 'customers' && <CustomersTable userRole="sales" />}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}