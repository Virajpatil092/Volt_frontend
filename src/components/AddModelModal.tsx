import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (model: any) => void;
}

const AddModelModal: React.FC<AddModelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const handleFormSubmit = (data: any) => {
    const modelData = {
      name: data.name,
      accessoryCharge: parseInt(data.accessoryCharge),
    };
    onSubmit(modelData);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Model</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Model name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accessory Charge (₹)
            </label>
            <input
              type="number"
              {...register('accessoryCharge', { required: 'Accessory charge is required', min: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.accessoryCharge && (
              <p className="mt-1 text-sm text-red-600">{errors.accessoryCharge.message}</p>
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModelModal;