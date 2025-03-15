import Link from 'next/link';
import {
    FiUsers,
    FiMessageSquare,
    FiShield,
    FiShoppingCart,
    FiBarChart2,
    FiAlertCircle,
    FiClock,
    FiCheckCircle
} from 'react-icons/fi';

export default function Dashboard() {
    // Mock data for dashboard
    const stats = [
        { name: 'Active Suppliers', value: '342', icon: FiUsers, color: 'bg-blue-500' },
        { name: 'Pending Negotiations', value: '28', icon: FiMessageSquare, color: 'bg-yellow-500' },
        { name: 'Compliance Risks', value: '12', icon: FiAlertCircle, color: 'bg-red-500' },
        { name: 'Orders This Month', value: '156', icon: FiShoppingCart, color: 'bg-green-500' },
    ];

    const activities = [
        { id: 1, action: 'New supplier registered', time: '5 minutes ago', status: 'info' },
        { id: 2, action: 'Purchase order #12345 approved', time: '1 hour ago', status: 'success' },
        { id: 3, action: 'Compliance alert for Supplier XYZ', time: '3 hours ago', status: 'warning' },
        { id: 4, action: 'Negotiation session completed', time: 'Yesterday, 15:30', status: 'info' },
        { id: 5, action: 'Order #54321 delivered', time: 'Yesterday, 10:15', status: 'success' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex space-x-3">
                    <Link href="/report" className="btn-primary flex items-center">
                        <FiBarChart2 className="mr-2" />
                        Go to Data Report
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className={`${stat.color} text-white p-3 rounded-full`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-500">{stat.name}</h2>
                                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Module Overview */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Module Overview</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Supplier Discovery */}
                        <Link href="/suppliers" className="border rounded-lg p-5 hover:bg-blue-50 transition-colors cursor-pointer">
                            <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <FiUsers className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-md font-medium text-gray-800">Supplier Discovery</h3>
                                    <p className="text-sm text-gray-500">Find and analyze suppliers</p>
                                </div>
                            </div>
                        </Link>

                        {/* Negotiation Companion */}
                        <Link href="/negotiations" className="border rounded-lg p-5 hover:bg-blue-50 transition-colors cursor-pointer">
                            <div className="flex items-center">
                                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                                    <FiMessageSquare className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-md font-medium text-gray-800">Negotiation Companion</h3>
                                    <p className="text-sm text-gray-500">Optimize your negotiation strategy</p>
                                </div>
                            </div>
                        </Link>

                        {/* Compliance Guardian */}
                        <Link href="/compliance" className="border rounded-lg p-5 hover:bg-blue-50 transition-colors cursor-pointer">
                            <div className="flex items-center">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                    <FiShield className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-md font-medium text-gray-800">Compliance Guardian</h3>
                                    <p className="text-sm text-gray-500">Ensure regulatory compliance</p>
                                </div>
                            </div>
                        </Link>

                        {/* Order Agent */}
                        <Link href="/orders" className="border rounded-lg p-5 hover:bg-blue-50 transition-colors cursor-pointer">
                            <div className="flex items-center">
                                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                    <FiShoppingCart className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-md font-medium text-gray-800">Order Agent</h3>
                                    <p className="text-sm text-gray-500">Manage orders efficiently</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
                    </div>
                    <div className="p-4">
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {activity.status === 'success' && (
                                            <FiCheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                        {activity.status === 'warning' && (
                                            <FiAlertCircle className="h-5 w-5 text-yellow-500" />
                                        )}
                                        {activity.status === 'info' && (
                                            <FiClock className="h-5 w-5 text-blue-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
                                View All Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link
                        href="/suppliers/new"
                        className="flex items-center justify-center p-4 border rounded-md hover:bg-blue-50 transition-colors"
                    >
                        <span className="text-blue-600 mr-2">
                            <FiUsers className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Find Suppliers</span>
                    </Link>
                    <Link
                        href="/negotiations/messages"
                        className="flex items-center justify-center p-4 border rounded-md hover:bg-blue-50 transition-colors"
                    >
                        <span className="text-indigo-600 mr-2">
                            <FiMessageSquare className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Draft Message</span>
                    </Link>
                    <Link
                        href="/compliance/analyze"
                        className="flex items-center justify-center p-4 border rounded-md hover:bg-blue-50 transition-colors"
                    >
                        <span className="text-purple-600 mr-2">
                            <FiShield className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Check Compliance</span>
                    </Link>
                    <Link
                        href="/orders/new"
                        className="flex items-center justify-center p-4 border rounded-md hover:bg-blue-50 transition-colors"
                    >
                        <span className="text-green-600 mr-2">
                            <FiShoppingCart className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">Create Order</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
