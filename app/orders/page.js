'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiShoppingCart,
    FiPlus,
    FiFilter,
    FiSearch,
    FiDownload,
    FiTruck,
    FiClock,
    FiCheck,
    FiAlertCircle,
    FiFileText,
    FiPieChart,
    FiCalendar,
    FiChevronRight
} from 'react-icons/fi';
import { orderApi } from '../../lib/api';
import { mockOrders } from '@/lib/mockData';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        draft: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        total: 0,
        totalValue: 0
    });
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // In a real app, we would use the API client
                // const response = await orderApi.getAllOrders();
                // setOrders(response.data);

                // For the hackathon, use mock data
                setTimeout(() => {
                    setOrders(mockOrders);

                    // Calculate statistics
                    const stats = {
                        draft: mockOrders.filter(order => order.status === 'draft').length,
                        processing: mockOrders.filter(order => order.status === 'processing').length,
                        shipped: mockOrders.filter(order => order.status === 'shipped').length,
                        delivered: mockOrders.filter(order => order.status === 'delivered').length,
                        total: mockOrders.length,
                        totalValue: mockOrders.reduce((sum, order) => sum + order.total, 0)
                    };

                    setStats(stats);
                    setLoading(false);
                }, 700);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter orders based on selected filter
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    // Function to get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-yellow-100 text-yellow-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Function to get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'draft':
                return <FiFileText className="h-5 w-5 text-gray-500" />;
            case 'processing':
                return <FiClock className="h-5 w-5 text-blue-500" />;
            case 'shipped':
                return <FiTruck className="h-5 w-5 text-yellow-500" />;
            case 'delivered':
                return <FiCheck className="h-5 w-5 text-green-500" />;
            case 'cancelled':
                return <FiAlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <FiFileText className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                <div className="flex space-x-3">
                    <button className="btn-secondary flex items-center">
                        <FiDownload className="mr-2" />
                        Export
                    </button>
                    <Link href="/orders/new" className="btn-primary flex items-center">
                        <FiPlus className="mr-2" />
                        New Order
                    </Link>
                </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <FiShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                    <div className="mt-1 text-sm text-gray-500">Last 30 days</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium text-gray-500">Draft</h2>
                        <div className="p-2 bg-gray-100 rounded-full">
                            <FiFileText className="h-5 w-5 text-gray-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{stats.draft}</div>
                    <div className="mt-1 text-sm text-gray-500">Awaiting submission</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium text-gray-500">Processing</h2>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <FiClock className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{stats.processing}</div>
                    <div className="mt-1 text-sm text-gray-500">In progress</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium text-gray-500">Shipped</h2>
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <FiTruck className="h-5 w-5 text-yellow-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{stats.shipped}</div>
                    <div className="mt-1 text-sm text-gray-500">In transit</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium text-gray-500">Delivered</h2>
                        <div className="p-2 bg-green-100 rounded-full">
                            <FiCheck className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{stats.delivered}</div>
                    <div className="mt-1 text-sm text-gray-500">Completed</div>
                </div>
            </div>

            {/* Order Value Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                            This Month
                        </button>
                        <button className="px-3 py-1.5 text-sm border border-blue-500 bg-blue-50 text-blue-700 rounded-md">
                            Last 30 Days
                        </button>
                        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                            Last Quarter
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Total Order Value</h3>
                            <div className="p-2 bg-blue-100 rounded-full">
                                <FiPieChart className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                            ${stats.totalValue.toLocaleString()}
                        </div>
                        <div className="mt-1 text-sm text-green-600">
                            +12% from previous period
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                            <div className="p-2 bg-purple-100 rounded-full">
                                <FiPieChart className="h-4 w-4 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                            ${stats.total > 0 ? Math.round(stats.totalValue / stats.total).toLocaleString() : 0}
                        </div>
                        <div className="mt-1 text-sm text-green-600">
                            +5% from previous period
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Orders Pending Delivery</h3>
                            <div className="p-2 bg-yellow-100 rounded-full">
                                <FiCalendar className="h-4 w-4 text-yellow-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                            {stats.processing + stats.shipped}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                            Expected within 15 days
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-medium text-gray-800">Orders</h2>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    className="form-input pl-10 w-full sm:w-64"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${filter === 'all'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${filter === 'draft'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => setFilter('draft')}
                                >
                                    Draft
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${filter === 'processing'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => setFilter('processing')}
                                >
                                    Processing
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${filter === 'shipped'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => setFilter('shipped')}
                                >
                                    Shipped
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${filter === 'delivered'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => setFilter('delivered')}
                                >
                                    Delivered
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <FiShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="mt-1 text-gray-500">
                            {filter === 'all'
                                ? 'Start by creating a new order'
                                : `No orders with status "${filter}"`}
                        </p>
                        {filter === 'all' && (
                            <div className="mt-4">
                                <Link href="/orders/new" className="btn-primary inline-flex items-center">
                                    <FiPlus className="mr-2" />
                                    Create Order
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Supplier
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Delivery Date
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            <Link href={`/orders/${order.id}`} className="hover:underline">
                                                {order.id}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Link href={`/suppliers/${order.supplierId}`} className="hover:text-blue-600 hover:underline">
                                                {order.supplierName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getStatusIcon(order.status)}
                                                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            ${order.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
                                            {order.status === 'processing' && order.deliveryDate && new Date(order.deliveryDate) < new Date() && (
                                                <span className="ml-2 text-yellow-600 text-xs font-medium">
                                                    Delayed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                View
                                            </Link>
                                            {order.status === 'draft' && (
                                                <Link
                                                    href={`/orders/${order.id}/edit`}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/orders/new"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Create New Order</h3>
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:bg-blue-200">
                            <FiPlus className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Create a new purchase order for any supplier with custom items and terms.
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                        Start new order
                        <FiChevronRight className="ml-1 h-4 w-4" />
                    </div>
                </Link>

                <Link
                    href="/orders/templates"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Order Templates</h3>
                        <div className="bg-purple-100 text-purple-600 p-2 rounded-full group-hover:bg-purple-200">
                            <FiFileText className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Create and manage templates for recurring orders to save time.
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                        View templates
                        <FiChevronRight className="ml-1 h-4 w-4" />
                    </div>
                </Link>

                <Link
                    href="/report"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Order Reports</h3>
                        <div className="bg-green-100 text-green-600 p-2 rounded-full group-hover:bg-green-200">
                            <FiPieChart className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Generate detailed reports on order history, spending, and supplier performance.
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                        Generate reports
                        <FiChevronRight className="ml-1 h-4 w-4" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
