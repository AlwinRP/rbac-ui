import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Key, Activity } from 'lucide-react';
import { fetchUsers, fetchRoles, fetchPermissions, fetchActiveSessions, fetchActivities, fetchSystemStatus } from '../api';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [permissionsCount, setPermissionsCount] = useState(0);
  const [activeSessionsCount, setActiveSessionsCount] = useState(0);
  const [activities, setActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState({ status: 'Inactive', lastConnectedTime: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();
        setUsersCount(users.length);

        const roles = await fetchRoles();
        setRolesCount(roles.length);

        const permissions = await fetchPermissions();
        setPermissionsCount(permissions.length);

        const { activeUsersCount } = await fetchActiveSessions();
        setActiveSessionsCount(activeUsersCount);

        const activitiesData = await fetchActivities();
        setActivities(activitiesData);

        const systemStatusData = await fetchSystemStatus();
        setSystemStatus(systemStatusData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSystemStatus({ status: 'Inactive', lastConnectedTime: 'N/A' });
      }
    };

    // Fetch data immediately and set an interval to periodically check the system status
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Check every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const stats = [
    { title: 'Total Users', value: usersCount, icon: Users, color: 'bg-blue-500' },
    { title: 'Active Roles', value: rolesCount, icon: ShieldCheck, color: 'bg-green-500' },
    { title: 'Permissions', value: permissionsCount, icon: Key, color: 'bg-purple-500' },
    { title: 'Active Sessions', value: activeSessionsCount, icon: Activity, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex space-x-3">
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className={`px-2 py-1 text-xs font-medium ${systemStatus.status === 'Active' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'} rounded-full`}>
                {systemStatus.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Connected Time</span>
              <span className="text-sm text-gray-900">{systemStatus.lastConnectedTime === 'N/A' ? 'N/A' : new Date(systemStatus.lastConnectedTime).toLocaleString()}</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
