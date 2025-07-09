import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Calculator, FileText, ArrowRight } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { generateReceipt } from '../store/slices/receiptSlice';

interface ReceiptForm {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  code: string;
  gstin: string;
  accessories: boolean;
  paymentType: string;
  specialDiscount: number;
  finalAmount: number;
}

interface ProductForm {
  batteryNumber: string;
  chargerNumber: string;
  chassisNumber: string;
  hsnCode: string;
  color: string;
}

const GenerateReceipt: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { models } = useSelector((state: RootState) => state.products);
  const { loading, error } = useSelector((state: RootState) => state.receipt);
  
  const itemUnits = items.flatMap(item =>
    Array.from({ length: item.quantity }, () => ({ ...item }))
  );

  const [productForms, setProductForms] = useState<ProductForm[]>(
    itemUnits.map(() => ({
      batteryNumber: '',
      chargerNumber: '',
      chassisNumber: '',
      hsnCode: '',
      color: ''
    }))
  );
  
  const [calculations, setCalculations] = useState({
    subtotal: total,
    accessoryCharges: 0,
    discount: 0,
    taxableAmount: total,
    cgst: 0,
    sgst: 0,
    totalAmount: total,
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReceiptForm>({
    defaultValues: {
      specialDiscount: 0,
      finalAmount: total,
      accessories: false,
      paymentType: 'cash',
    },
  });

  const watchedValues = watch();

  React.useEffect(() => {
    const accessories = watchedValues.accessories;
    const specialDiscount = watchedValues.specialDiscount || 0;
    
    // Calculate accessory charges
    let accessoryCharges = 0;
    if (accessories) {
      items.forEach(item => {
        accessoryCharges += item.product.model.accessoryCharge * item.quantity;
      });
    }
    
    // Calculate totals
    const subtotal = total + accessoryCharges;
    const discount = (subtotal * specialDiscount) / 100;
    const taxableAmount = subtotal - discount;
    const cgst = taxableAmount * 0.09; // 9% CGST
    const sgst = taxableAmount * 0.09; // 9% SGST
    const totalAmount = taxableAmount + cgst + sgst;
    
    setCalculations({
      subtotal,
      accessoryCharges,
      discount,
      taxableAmount,
      cgst,
      sgst,
      totalAmount,
    });
    
    setValue('finalAmount', Math.round(totalAmount));
  }, [watchedValues.accessories, watchedValues.specialDiscount, total, items, models, setValue]);

  // Update product forms when items change
  React.useEffect(() => {
    setProductForms(itemUnits.map((_, index) => ({
      batteryNumber: productForms[index]?.batteryNumber || '',
      chargerNumber: productForms[index]?.chargerNumber || '',
      chassisNumber: productForms[index]?.chassisNumber || '',
      hsnCode: productForms[index]?.hsnCode || '',
      color: productForms[index]?.color || ''
    })));
  }, [itemUnits.length]);

  const handleProductFormChange = (index: number, field: keyof ProductForm, value: string) => {
    setProductForms(prev => prev.map((form, i) => 
      i === index ? { ...form, [field]: value } : form
    ));
  };

  const onSubmit = async (data: ReceiptForm) => {
    const receiptData = {
      ...data,
      items: itemUnits.map((item, index) => ({
        product: item.product,
          model: {
            name: item.product.model.name,
            accessoryCharge: item.product.model.accessoryCharge
          },
          battery: {
            name: item.product.battery.name,
            capacity: item.product.battery.capacity
          },
          range: item.product.range,
          rate: item.product.rate,
        quantity: 1,
        amount: item.product.rate * item.quantity,
        color: productForms[index]?.color || '',
        hsnCode: productForms[index]?.hsnCode || '',
        batteryNumber: productForms[index]?.batteryNumber,
        chargerNumber: productForms[index]?.chargerNumber,
        chassisNumber: productForms[index]?.chassisNumber,
      })),
      ...calculations,
      receiptNumber: `EV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
    };

    try {
      await dispatch(generateReceipt(receiptData));
      navigate('/invoice-preview');
    } catch (error) {
      console.error('Failed to generate receipt:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No items to generate receipt</h2>
          <p className="text-gray-600 mb-6">Please add items to your cart first</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Generate Receipt</h1>
        <p className="text-gray-600">Fill in customer details and generate invoice</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    {...register('customerName', { required: 'Customer name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    {...register('address', { required: 'Address is required' })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    {...register('code', { required: 'Code is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    {...register('gstin')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

              </div>
            </div>

            {/* Product-Specific Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>
              <div className="space-y-6">
                {itemUnits.map((item, index) => (
                  <div key={`${item.product.model.name}-${item.product.battery.name}`} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Product {index + 1}: {item.product.model.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Battery: {item.product.battery.name} - {item.product.battery.capacity} | 
                        Quantity: {item.quantity} | 
                        Rate: ₹{item.product.rate.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chassis Number
                        </label>
                        <input
                          type="text"
                          value={productForms[index]?.chassisNumber || ''}
                          onChange={(e) => handleProductFormChange(index, 'chassisNumber', e.target.value)}
                          placeholder={`CHxxxxxx`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Battery Number
                        </label>
                        <input
                          type="text"
                          value={productForms[index]?.batteryNumber || ''}
                          onChange={(e) => handleProductFormChange(index, 'batteryNumber', e.target.value)}
                          placeholder={`BTxxxxx`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Charger Number
                        </label>
                        <input
                          type="text"
                          value={productForms[index]?.chargerNumber || ''}
                          onChange={(e) => handleProductFormChange(index, 'chargerNumber', e.target.value)}
                          placeholder={`charger number`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          HSN code
                        </label>
                        <input
                          type="text"
                          value={productForms[index]?.hsnCode || ''}
                          onChange={(e) => handleProductFormChange(index, 'hsnCode', e.target.value)}
                          placeholder={"HSN code"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color
                        </label>
                        <input
                          type="text"
                          value={productForms[index]?.color || ''}
                          onChange={(e) => handleProductFormChange(index, 'color', e.target.value)}
                          placeholder={"Color"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment & Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Type *
                  </label>
                  <select
                    {...register('paymentType', { required: 'Payment type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                  {errors.paymentType && (
                    <p className="mt-1 text-sm text-red-600">{errors.paymentType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('specialDiscount', { min: 0, max: 100 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('accessories')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Include Accessories
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Final Amount</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Amount (₹)
                </label>
                <input
                  type="number"
                  {...register('finalAmount', { required: 'Final amount is required', min: 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-lg"
                />
                {errors.finalAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.finalAmount.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
              <span>{loading ? 'Generating...' : 'Generate Invoice'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Calculation Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{calculations.subtotal.toLocaleString()}</span>
              </div>
              
              {calculations.accessoryCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Accessory Charges</span>
                  <span className="font-semibold">₹{calculations.accessoryCharges.toLocaleString()}</span>
                </div>
              )}
              
              {calculations.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-red-600">-₹{calculations.discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable Amount</span>
                <span className="font-semibold">₹{calculations.taxableAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">CGST (9%)</span>
                <span className="font-semibold">₹{calculations.cgst.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">SGST (9%)</span>
                <span className="font-semibold">₹{calculations.sgst.toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount</span>
                  <span className="text-xl font-bold text-gray-800">
                    ₹{calculations.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReceipt;