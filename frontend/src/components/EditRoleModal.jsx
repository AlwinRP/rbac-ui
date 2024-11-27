import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchPermissions, updateRole } from '../api';

const EditRoleModal = ({ isOpen, onClose, roleToEdit, onRoleUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && roleToEdit) {
      loadPermissions();
      setFormData({
        name: roleToEdit.name,
        description: roleToEdit.description,
        permissions: roleToEdit.permissions.map(permission => permission._id),
      });
    } else {
      // Reset form when modal closes
      setFormData({
        name: '',
        description: '',
        permissions: [],
      });
      setError(null);
    }
  }, [isOpen, roleToEdit]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPermissions();
      setPermissions(data);
    } catch (err) {
      setError('Failed to load permissions');
      console.error('Error loading permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.permissions.length === 0) {
      setError('Please select at least one permission');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updateRole(roleToEdit._id, formData);
      if (onRoleUpdated) onRoleUpdated(formData);
      onClose();
    } catch (err) {
      setError('Failed to update role');
      console.error('Error updating role:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
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
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Edit Role
                </h3>
                {error && (
                  <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-500">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Role Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., Editor"
                    />
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
                      placeholder="Describe the role's responsibilities..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                      {loading ? (
                        <div className="text-center py-4 text-gray-500">Loading permissions...</div>
                      ) : permissions.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No permissions available</div>
                      ) : (
                        permissions.map((permission) => (
                          <label
                            key={permission._id}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission._id)}
                              onChange={() => handlePermissionToggle(permission._id)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-700">
                                {permission.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {permission.resource} - {permission.action}
                              </span>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update Role'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EditRoleModal;
