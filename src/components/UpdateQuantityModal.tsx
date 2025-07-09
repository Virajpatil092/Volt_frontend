import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

interface UpdateQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSubmit: (quantity: number) => void;
}

const UpdateQuantityModal: React.FC<UpdateQuantityModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      quantity: product?.availableQuantity || 0
    }
  });

  if (!isOpen || !product) return null;

  const handleFormSubmit = (data: any) => {
    onSubmit(parseInt(data.quantity));
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Quantity</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">Product: {product.model.name} - {product.battery.name}</p>
          <p className="text-sm text-gray-600">Current Quantity: {product.availableQuantity}</p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Quantity
            </label>
            <input
              type="number"
              {...register('quantity', { required: 'Quantity is required', min: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {typeof errors.quantity?.message === 'string' && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
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
              Update Quantity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuantityModal;