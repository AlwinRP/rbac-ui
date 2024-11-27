import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, Trash2 } from 'lucide-react';
import RoleModal from '../components/RoleModal';
import EditRoleModal from '../components/EditRoleModal';
import { fetchRoles, createRole, deleteRole, updateRole,fetchUserCountByRole } from '../api';

const Roles = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true); // Define loading state

  useEffect(() => {
    const getRoles = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const rolesData = await fetchRoles();
        
        // Fetch user counts for each role
        const rolesWithUserCounts = await Promise.all(rolesData.map(async (role) => {
          const { userCount } = await fetchUserCountByRole(role._id);
          return { ...role, userCount };
        }));

        setRoles(rolesWithUserCounts);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    getRoles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      setRoles(roles.filter(role => role._id !== id));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleAddRole = async (newRole) => {
    try {
      const createdRole = await createRole(newRole);
      const { userCount } = await fetchUserCountByRole(createdRole._id);  // Fetch user count for the new role
      setRoles([...roles, { ...createdRole, userCount }]);
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleUpdateRole = async (updatedRole) => {
    try {
      await updateRole(updatedRole);
      const { userCount } = await fetchUserCountByRole(updatedRole._id);  // Fetch updated user count
      setRoles(roles.map(role => (role._id === updatedRole._id ? { ...updatedRole, userCount } : role)));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Roles Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Role
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{role.userCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{role.permissions.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() => handleEditClick(role)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(role._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <RoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRoleCreated={handleAddRole}
      />

      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        roleToEdit={selectedRole}
        onRoleUpdated={handleUpdateRole}
      />
    </div>
  );
};

export default Roles;
