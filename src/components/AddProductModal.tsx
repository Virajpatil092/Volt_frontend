import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: any[];
  batteries: any[];
  onSubmit: (product: any) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  models,
  batteries,
  onSubmit,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const handleFormSubmit = (data: any) => {
    // Find the selected model and battery objects
    const selectedModel = models.find(model => model.name === data.modelName);
    const selectedBattery = batteries.find(battery => battery._id === data.batteryId);
    
    const productData = {
      model: {
        name: selectedModel?.name || data.modelName,
        accessoryCharge: selectedModel?.accessoryCharge || 0
      },
      battery: selectedBattery,
      range: parseInt(data.range),
      rate: parseInt(data.rate),
      availableQuantity: parseInt(data.availableQuantity),
    };
    
    onSubmit(productData);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              {...register('modelName', { required: 'Model is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a model</option>
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
            {errors.modelName && (
              <p className="mt-1 text-sm text-red-600">{errors.modelName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Battery
            </label>
            <select
              {...register('batteryId', { required: 'Battery is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a battery</option>
              {batteries.map((battery) => (
                <option key={battery._id} value={battery._id}>
                  {battery.name} - {battery.capacity}
                </option>
              ))}
            </select>
            {errors.batteryId && (
              <p className="mt-1 text-sm text-red-600">{errors.batteryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Range (km)
            </label>
            <input
              type="number"
              {...register('range', { required: 'Range is required', min: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.range && (
              <p className="mt-1 text-sm text-red-600">{errors.range.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate (₹)
            </label>
            <input
              type="number"
              {...register('rate', { required: 'Rate is required', min: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.rate && (
              <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Quantity
            </label>
            <input
              type="number"
              {...register('availableQuantity', { required: 'Quantity is required', min: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.availableQuantity && (
              <p className="mt-1 text-sm text-red-600">{errors.availableQuantity.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;