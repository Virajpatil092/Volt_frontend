import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { RootState } from '../store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';

const PlaceOrder: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (modelName: string, batteryName: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ modelName, batteryName, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (modelName: string, batteryName: string) => {
    dispatch(removeFromCart({ modelName, batteryName }));
  };

  const handleProceedToReceipt = () => {
    if (items.length > 0) {
      navigate('/generate-receipt');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Place Order</h1>
        <p className="text-gray-600">Review your selected items and proceed to generate receipt</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products from the dashboard to get started</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={`${item.product.model.name}-${item.product.battery.name}`} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.product.model.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Battery: {item.product.battery.name} - {item.product.battery.capacity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Range: {item.product.range} km
                        </p>
                        <p className="text-lg font-bold text-gray-800 mt-2">
                          ₹{item.product.rate.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.product.model.name, item.product.battery.name, item.quantity - 1)}
                            className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product.model.name, item.product.battery.name, item.quantity + 1)}
                            className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product.model.name, item.product.battery.name)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {item.quantity} × ₹{item.product.rate.toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                          ₹{(item.product.rate * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({items.length})</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-800">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToReceipt}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Proceed to Generate Receipt</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;