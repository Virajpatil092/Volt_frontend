import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, ShoppingCart, Package, Battery, Zap } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { 
  fetchProducts, 
  fetchModels, 
  fetchBatteries, 
  createProduct, 
  createModel, 
  createBattery, 
  updateProductAsync,
  clearError 
} from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import AddProductModal from '../components/AddProductModal';
import AddModelModal from '../components/AddModelModal';
import AddBatteryModal from '../components/AddBatteryModal';
import UpdateQuantityModal from '../components/UpdateQuantityModal';

const Dashboard: React.FC = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [showAddBattery, setShowAddBattery] = useState(false);
  const [showUpdateQuantity, setShowUpdateQuantity] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, models, batteries, loading, error } = useSelector((state: RootState) => state.products);
  const { items } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchModels());
    dispatch(fetchBatteries());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleUpdateQuantity = (product: any) => {
    setSelectedProduct(product);
    setShowUpdateQuantity(true);
  };

  const handleAddProduct = async (productData: any) => {
    try {
      await dispatch(createProduct(productData));
      setShowAddProduct(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleAddModel = async (modelData: any) => {
    try {
      await dispatch(createModel(modelData));
      setShowAddModel(false);
    } catch (error) {
      console.error('Failed to add model:', error);
    }
  };

  const handleAddBattery = async (batteryData: any) => {
    try {
      await dispatch(createBattery(batteryData));
      setShowAddBattery(false);
    } catch (error) {
      console.error('Failed to add battery:', error);
    }
  };

  const handleUpdateProductQuantity = async (quantity: number) => {
    if (selectedProduct) {
      if (!selectedProduct._id) {
        console.error('Product ID is missing');
        return;
      }
      try {
        await dispatch(updateProductAsync({
          id: selectedProduct._id,
          productData: { 
            model: selectedProduct.model,
            battery: selectedProduct.battery,
            range: selectedProduct.range,
            rate: selectedProduct.rate,
            availableQuantity: quantity 
          } 
        }));
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
    setShowUpdateQuantity(false);
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your electric vehicle inventory</p>
        </div>
        <button
          onClick={() => navigate('/place-order')}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all transform hover:scale-105"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Place Order</span>
          {cartItemCount > 0 && (
            <span className="bg-white text-blue-600 rounded-full px-2 py-1 text-xs font-bold">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Models</p>
                <p className="text-2xl font-bold text-gray-800">{models.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Battery className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Batteries</p>
                <p className="text-2xl font-bold text-gray-800">{batteries.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Product Inventory</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModel(true)}
                disabled={loading}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Model</span>
              </button>
              <button
                onClick={() => setShowAddBattery(true)}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Battery</span>
              </button>
              <button
                onClick={() => setShowAddProduct(true)}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Battery Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Range (km)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id || `${product.model.name}-${product.battery.name}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.model.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.battery.name} - {product.battery.capacity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.range}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{product.rate.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.availableQuantity > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.availableQuantity > 5 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.availableQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(product)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Update Qty</span>
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="text-green-600 hover:text-green-900 inline-flex items-center space-x-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        models={models}
        batteries={batteries}
        onSubmit={handleAddProduct}
      />

      <AddModelModal
        isOpen={showAddModel}
        onClose={() => setShowAddModel(false)}
        onSubmit={handleAddModel}
      />

      <AddBatteryModal
        isOpen={showAddBattery}
        onClose={() => setShowAddBattery(false)}
        onSubmit={handleAddBattery}
      />

      <UpdateQuantityModal
        isOpen={showUpdateQuantity}
        onClose={() => setShowUpdateQuantity(false)}
        product={selectedProduct}
        onSubmit={handleUpdateProductQuantity}
      />
    </div>
  );
};

export default Dashboard;