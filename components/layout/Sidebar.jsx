'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiSearch,
    FiMessageSquare,
    FiShield,
    FiShoppingCart,
    FiMenu,
    FiX
} from 'react-icons/fi';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: FiHome },
        { name: 'Supplier Discovery', href: '/suppliers', icon: FiSearch },
        { name: 'Negotiation Companion', href: '/negotiations', icon: FiMessageSquare },
        { name: 'Compliance Guardian', href: '/compliance', icon: FiShield },
        { name: 'Order Agent', href: '/orders', icon: FiShoppingCart },
    ];

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <>
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden absolute z-50 top-4 left-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 cursor-pointer rounded-md text-gray-500 hover:text-gray-600 focus:outline-none"
                >
                    {collapsed ? <FiMenu size={24} /> : <FiX size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-0 -translate-x-full lg:w-20 lg:translate-x-0' : 'w-64'
                    } lg:relative absolute inset-y-0 left-0 z-40 h-full`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b">
                    {!collapsed && (
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            TACTO
                        </Link>
                    )}
                    {collapsed && (
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            T
                        </Link>
                    )}
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3">
                    <div className="space-y-3">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 flex-shrink-0 h-14 w-6 ${isActive ? 'text-blue-700' : 'text-gray-500'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {!collapsed && <span className='ml-2'>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Collapse toggle for desktop */}
                <div className="hidden lg:flex absolute bottom-5 right-5">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
                    >
                        {collapsed ? <FiMenu size={16} /> : <FiX size={16} />}
                    </button>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {!collapsed && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default Sidebar;
