'use client';

import { useState } from 'react';
import {
    FiBell,
    FiSearch,
    FiSettings,
    FiUser
} from 'react-icons/fi';

const Navbar = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Mock notifications
    const notifications = [
        { id: 1, message: 'New supplier application received', time: '5 min ago' },
        { id: 2, message: 'Order #12345 status changed to Shipped', time: '1 hour ago' },
        { id: 3, message: 'Compliance document expiring in 7 days', time: '3 hours ago' },
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center flex-1">
                        <div className="flex-shrink-0 hidden lg:block">
                            {/* This space is intentionally left empty to align with sidebar */}
                        </div>

                        {/* Page title */}
                        <div className="ml-4 text-xl font-semibold text-gray-800">
                            Tacto Supply Chain Platform
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="ml-4 flex items-center">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                className="form-input pl-10 py-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 w-56"
                                type="text"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    {/* Right side buttons */}
                    <div className="ml-4 flex items-center md:ml-6">
                        {/* Notifications dropdown */}
                        <div className="relative ml-3">
                            <button
                                className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                            >
                                <span className="sr-only">View notifications</span>
                                <FiBell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            {notificationsOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                                                >
                                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 text-center text-xs text-blue-600 font-medium border-t border-gray-200">
                                            View all notifications
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Settings button */}
                        <button
                            className="ml-3 p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <span className="sr-only">View settings</span>
                            <FiSettings className="h-6 w-6" />
                        </button>

                        {/* Profile dropdown */}
                        <div className="relative ml-3">
                            <div>
                                <button
                                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <FiUser />
                                    </div>
                                </button>
                            </div>

                            {userMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Your Profile
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Settings
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Sign out
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
