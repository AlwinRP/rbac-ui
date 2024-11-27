const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fetch permissions
export const fetchPermissions = async () => {
    const response = await fetch(`${API_URL}/permissions`);
    if (!response.ok) throw new Error('Failed to fetch permissions');
    return response.json();
};

// Fetch permission details by ID
export const fetchPermissionDetails = async (id) => {
  const response = await fetch(`${API_URL}/permissions/${id}`);
  if (!response.ok) throw new Error('Failed to fetch permission details');
  return response.json();
};


// Fetch roles
export const fetchRoles = async () => {
    const response = await fetch(`${API_URL}/roles`);
    if (!response.ok) throw new Error('Failed to fetch roles');
    return response.json();
};

// Fetch users
export const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};
//Fetch role by id
export const fetchRoleById = async (id) => { 
    const response = await fetch(`${API_URL}/roles/${id}`); 
    if (!response.ok) { throw new Error('Failed to fetch role by ID'); 

    } return response.json();
};

// Create a new user
export const createUser = async (user) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const responseData = await response.json();
    console.log('Response from server:', responseData); // Log response data
    if (!response.ok) throw new Error('Failed to create user');
    return responseData;
};

// Update a user by ID
export const updateUser = async (id, user) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.error || 'Failed to update user');
    return responseData;
};

// Delete a user by ID
export const deleteUser = async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
};

// Create a new role
export const createRole = async (role) => {
    const response = await fetch(`${API_URL}/roles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
    });
    const responseData = await response.json();
    console.log('Response from server:', responseData); // Log response data
    if (!response.ok) throw new Error(responseData.error || 'Failed to update user');
    return responseData;
};

// Update a role by ID
export const updateRole = async (id, updates) => {
    const response = await fetch(`${API_URL}/roles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update role');
    return response.json();
};

// Delete a role by ID
export const deleteRole = async (id) => {
    const response = await fetch(`${API_URL}/roles/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete role');
    return response.json();
};

// Create a new permission
export const createPermission = async (permission) => {
    const response = await fetch(`${API_URL}/permissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(permission),
    });
    if (!response.ok) throw new Error('Failed to create permission');
    return response.json();
};

// Update a permission by ID
export const updatePermission = async (id, updates) => {
    const response = await fetch(`${API_URL}/permissions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update permission');
    return response.json();
};

// Delete a permission by ID
export const deletePermission = async (id) => {
    const response = await fetch(`${API_URL}/permissions/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete permission');
    return response.json();
};

// Fetch active sessions
export const fetchActiveSessions = async () => {
    const response = await fetch(`${API_URL}/users/active-sessions`);
    if (!response.ok) throw new Error('Failed to fetch active sessions');
    return response.json();
};

export const fetchActivities = async () => { 
    const response = await fetch(`${API_URL}/activities/latest`); 
    if (!response.ok) { throw new Error('Failed to fetch activities'); 

    } return response.json();
};

export const fetchSystemStatus = async () => { 
    const response = await fetch(`${API_URL}/system/status`); 
    if (!response.ok) { throw new Error('Failed to fetch system status'); 
        
    } return response.json();
};

export const fetchUserCountByRole = async (roleId) => { 
    const response = await fetch(`${API_URL}/users/count-by-role/${roleId}`); 
    if (!response.ok) { 
        throw new Error(`Failed to fetch user count for role ${roleId}`); 
    } return response.json(); 
};


export const fetchRoleCountByPermission = async (permissionId) => {
    const response = await fetch(`${API_URL}/roles/count-by-permission/${permissionId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch role count for permission ${permissionId}`);
    }
    return response.json();
  };
  