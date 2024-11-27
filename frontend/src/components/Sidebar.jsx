import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-gray-100 h-screen">
            <div className="p-4">
            </div>
            <nav className="mt-10">
                <Link to="/" className="block py-2.5 px-6 rounded transition duration-200 hover:bg-gray-700 hover:text-white">Dashboard</Link>
                <Link to="/users" className="block py-2.5 px-6 rounded transition duration-200 hover:bg-gray-700 hover:text-white">Users</Link>
                <Link to="/roles" className="block py-2.5 px-6 rounded transition duration-200 hover:bg-gray-700 hover:text-white">Roles</Link>
                <Link to="/permissions" className="block py-2.5 px-6 rounded transition duration-200 hover:bg-gray-700 hover:text-white ">Permissions</Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
