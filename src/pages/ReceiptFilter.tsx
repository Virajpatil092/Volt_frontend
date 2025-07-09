import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Search, Filter, Download, Eye, Calendar, FileText, Phone, MapPin } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { searchReceipts, clearFilteredReceipts, clearError, fetchReceiptById } from '../store/slices/receiptSlice';
import { useNavigate } from 'react-router-dom';

interface FilterForm {
  fromDate: string;
  toDate: string;
  chassisNo: string;
  receiptNumber: string;
  phone: string;
  state: string;
  code: string;
  gstin: string;
}

const ReceiptFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { filteredReceipts, loading, error } = useSelector((state: RootState) => state.receipt);
  const [hasSearched, setHasSearched] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FilterForm>();

  useEffect(() => {
    return () => {
      dispatch(clearFilteredReceipts());
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: FilterForm) => {
    // Remove empty fields
    const filters = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value && value.trim() !== '')
    );
    
    setHasSearched(true);
    await dispatch(searchReceipts(filters));
  };

  const handleViewReceipt = async (receiptId: string) => {
    await dispatch(fetchReceiptById(receiptId));
    navigate('/invoice-preview');
  };

  const handleClearFilters = () => {
    reset();
    setHasSearched(false);
    dispatch(clearFilteredReceipts());
    dispatch(clearError());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Receipt Search</h1>
          <p className="text-gray-600 mt-2">Search and filter receipts by various criteria</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Search Filters</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                From Date
              </label>
              <input
                type="date"
                {...register('fromDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                To Date
              </label>
              <input
                type="date"
                {...register('toDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Invoice Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Invoice Number
              </label>
              <input
                type="text"
                {...register('receiptNumber')}
                placeholder="EV-123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chassis Number
              </label>
              <input
                type="text"
                {...register('chassisNo')}
                placeholder="CH123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Customer Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="9876543210"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                State
              </label>
              <input
                type="text"
                {...register('state')}
                placeholder="Maharashtra"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State Code
              </label>
              <input
                type="text"
                {...register('code')}
                placeholder="27"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GSTIN
              </label>
              <input
                type="text"
                {...register('gstin')}
                placeholder="27XXXXX1234X1ZX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>{loading ? 'Searching...' : 'Search Receipts'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Search Results ({filteredReceipts.length} found)
            </h2>
          </div>

          {filteredReceipts.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No receipts found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {receipt.customerName}
                          </div>
                          <div className="text-sm text-gray-500">{receipt.phone}</div>
                          <div className="text-sm text-gray-500">
                            {receipt.state} - {receipt.code}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {receipt.receiptNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(receipt.date)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {receipt.items.map((item, index) => (
                            <div key={index} className="mb-1">
                              {item.model.name} - {item.battery.name} (Qty: {item.quantity})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(receipt.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Payment: {receipt.paymentType.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewReceipt(receipt._id!)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiptFilter;