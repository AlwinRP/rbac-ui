import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, Trash2 } from 'lucide-react';
import PermissionModal from '../components/PermissionModal';
import EditPermissionModal from '../components/EditPermissionModal.jsx';
import { fetchPermissions, fetchRoles, deletePermission, fetchRoleCountByPermission } from '../api';

const Permissions = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPermissionsAndRoles = async () => {
      setLoading(true);
      try {
        const [permissionsData, rolesData] = await Promise.all([fetchPermissions(), fetchRoles()]);

        // Fetch role counts for each permission
        const permissionsWithRoleCounts = await Promise.all(permissionsData.map(async (permission) => {
          const { roleCount } = await fetchRoleCountByPermission(permission._id);
          return { ...permission, roleCount };
        }));

        console.log('Fetched permissions:', permissionsWithRoleCounts);
        console.log('Fetched roles:', rolesData);
        setPermissions(permissionsWithRoleCounts);
        setRoles(rolesData);
      } catch (err) {
        setError('Failed to load permissions and roles');
        console.error('Error loading permissions and roles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPermissionsAndRoles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePermission(id);
      setPermissions(permissions.filter(permission => permission._id !== id));
    } catch (err) {
      console.error('Error deleting permission:', err);
    }
  };

  const handleAddPermission = (newPermission) => {
    setPermissions([...permissions, newPermission]);
  };

  const handleUpdatePermission = (updatedPermission) => {
    setPermissions(permissions.map(permission => (permission._id === updatedPermission._id ? updatedPermission : permission)));
  };

  const handleEditClick = (permission) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  };

  const filteredPermissions = permissions.filter(permission =>
    (typeof permission.name === 'string' && permission.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (Array.isArray(permission.actions) && permission.actions.some(action => action.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Permissions Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Permission
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Roles
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPermissions.map((permission) => (
                <tr key={permission._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {Array.isArray(permission.actions) ? permission.actions.join(', ') : permission.actions}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{permission.roleCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => handleEditClick(permission)}>
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(permission._id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PermissionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPermissionCreated={handleAddPermission}
      />

      <EditPermissionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        permissionToEdit={selectedPermission}
        onPermissionUpdated={handleUpdatePermission}
      />
    </div>
  );
};

export default Permissions;