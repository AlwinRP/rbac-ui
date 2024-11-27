import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updatePermission, fetchPermissionDetails } from '../api'; // Ensure these API functions are defined in your API service

const EditPermissionModal = ({ isOpen, onClose, permissionToEdit, onPermissionUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    actions: [],
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && permissionToEdit) {
      const loadPermissionDetails = async () => {
        try {
          setLoading(true);
          const permissionDetails = await fetchPermissionDetails(permissionToEdit._id);
          setFormData({
            name: permissionDetails.name || '',
            actions: permissionDetails.actions || [],
            description: permissionDetails.description || '',
          });
        } catch (err) {
          setError('Failed to load permission details');
          console.error('Error loading permission details:', err);
        } finally {
          setLoading(false);
        }
      };
      loadPermissionDetails();
    } else {
      // Reset form when modal closes
      setFormData({
        name: '',
        actions: [],
        description: '',
      });
      setError(null);
    }
  }, [isOpen, permissionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      const updatedPermission = await updatePermission(permissionToEdit._id, formData);
      onPermissionUpdated(updatedPermission);  // Notify parent component with the updated permission
      onClose();
    } catch (err) {
      setError('Failed to update permission');
      console.error('Error updating permission:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'actions') {
      setFormData((prev) => ({
        ...prev,
        actions: checked ? [...prev.actions, value] : prev.actions.filter((action) => action !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              disabled={loading}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Edit Permission
                </h3>
                {error && (
                  <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-500">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Permission Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., Create User"
                    />
                  </div>

                  <div>
                    <label htmlFor="actions" className="block text-sm font-medium text-gray-700">
                      Actions
                    </label>
                    <div className="mt-1 space-y-2">
                      {['create', 'read', 'update', 'delete'].map((action) => (
                        <div key={action} className="flex items-center">
                          <input
                            type="checkbox"
                            name="actions"
                            value={action}
                            checked={formData.actions.includes(action)}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <label htmlFor={action} className="ml-2 block text-sm text-gray-900">
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Describe the permission..."
                    />
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Permission'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPermissionModal;
