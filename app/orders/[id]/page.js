'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    FiArrowLeft,
    FiFileText,
    FiEdit,
    FiPrinter,
    FiDownload,
    FiTruck,
    FiClock,
    FiCheck,
    FiAlertCircle,
    FiMapPin,
    FiCalendar,
    FiDollarSign,
    FiPackage,
    FiShoppingCart,
    FiClipboard,
    FiMessageSquare,
    FiX
} from 'react-icons/fi';
import { orderApi } from '@/lib/api';
import { mockOrders, getSupplierById } from '@/lib/mockData';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;

    const [order, setOrder] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmCancel, setConfirmCancel] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // In a real app, we would use the API client
                // const response = await orderApi.getOrderById(orderId);
                // setOrder(response.data);

                // For the hackathon, use mock data
                setTimeout(() => {
                    const orderData = mockOrders.find(order => order.id === orderId);

                    if (orderData) {
                        setOrder(orderData);

                        // Get supplier details
                        const supplierData = getSupplierById(orderData.supplierId);
                        setSupplier(supplierData);
                    }

                    setLoading(false);
                }, 700);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

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
                return <FiX className="h-5 w-5 text-red-500" />;
            default:
                return <FiFileText className="h-5 w-5 text-gray-500" />;
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Function to handle order cancellation
    const handleCancelOrder = () => {
        if (confirmCancel) {
            // In a real app, we would call the API
            // await orderApi.updateOrderStatus(orderId, 'cancelled');

            // Update local state
            setOrder(prev => ({
                ...prev,
                status: 'cancelled'
            }));

            setConfirmCancel(false);
        } else {
            setConfirmCancel(true);
        }
    };

    // Function to handle order status update
    const handleUpdateStatus = (newStatus) => {
        // In a real app, we would call the API
        // await orderApi.updateOrderStatus(orderId, newStatus);

        // Update local state
        setOrder(prev => ({
            ...prev,
            status: newStatus,
            lastUpdated: new Date().toISOString()
        }));
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h2 className="mt-2 text-xl font-semibold text-gray-800">Order Not Found</h2>
                    <p className="mt-1 text-gray-600">The order you're looking for does not exist or has been removed.</p>
                    <Link href="/orders" className="mt-4 inline-block btn-primary">
                        Return to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with back button and actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/orders" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Order {order.id}</h1>
                </div>
                <div className="flex space-x-3">
                    <button className="btn-secondary flex items-center">
                        <FiPrinter className="mr-2" />
                        Print
                    </button>
                    <button className="btn-secondary flex items-center">
                        <FiDownload className="mr-2" />
                        Export
                    </button>
                    {order.status === 'draft' && (
                        <Link href={`/orders/${order.id}/edit`} className="btn-primary flex items-center">
                            <FiEdit className="mr-2" />
                            Edit Order
                        </Link>
                    )}
                </div>
            </div>

            {/* Order summary card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    {/* Order ID and supplier */}
                    <div>
                        <div className="flex items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-800 mr-3">Order Details</h2>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                <span className="mr-1">{getStatusIcon(order.status)}</span>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Supplier: </span>
                            {supplier ? (
                                <Link href={`/suppliers/${supplier.id}`} className="text-blue-600 hover:underline">
                                    {supplier.name}
                                </Link>
                            ) : (
                                order.supplierName
                            )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Created on: </span>
                            {formatDate(order.date)}
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Last updated: </span>
                            {formatDate(order.lastUpdated)}
                        </div>
                    </div>

                    {/* Order key metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <FiCalendar className="mr-2 h-4 w-4" />
                                Delivery Date
                            </div>
                            <p className="font-medium">
                                {formatDate(order.deliveryDate)}
                                {order.status === 'processing' && new Date(order.deliveryDate) < new Date() && (
                                    <span className="ml-2 text-yellow-600 text-xs font-medium">
                                        Delayed
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <FiDollarSign className="mr-2 h-4 w-4" />
                                Payment Terms
                            </div>
                            <p className="font-medium">{order.paymentTerms}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <FiPackage className="mr-2 h-4 w-4" />
                                Items
                            </div>
                            <p className="font-medium">{order.items.length}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <FiDollarSign className="mr-2 h-4 w-4" />
                                Total Value
                            </div>
                            <p className="font-medium">${order.total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Order notes */}
                {order.notes && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start">
                            <FiClipboard className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                            <div>
                                <h4 className="font-medium text-blue-800 mb-1">Order Notes</h4>
                                <p className="text-sm text-blue-700">{order.notes}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Order status timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h2>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute h-full w-0.5 bg-gray-200 left-5 top-0"></div>

                    {/* Timeline events */}
                    <div className="ml-12 space-y-8">
                        {/* Created */}
                        <div className="relative">
                            <div className="absolute -left-12 mt-1.5 h-4 w-4 rounded-full border-2 border-blue-500 bg-white"></div>
                            <div>
                                <h3 className="text-md font-medium text-gray-800">Order Created</h3>
                                <p className="mt-1 text-sm text-gray-500">{formatDate(order.date)}</p>
                            </div>
                        </div>

                        {/* Processing */}
                        {(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
                            <div className="relative">
                                <div className="absolute -left-12 mt-1.5 h-4 w-4 rounded-full border-2 border-blue-500 bg-white"></div>
                                <div>
                                    <h3 className="text-md font-medium text-gray-800">Processing Started</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {formatDate(order.lastUpdated)}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Order is being processed by the supplier
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Shipped */}
                        {(order.status === 'shipped' || order.status === 'delivered') && (
                            <div className="relative">
                                <div className="absolute -left-12 mt-1.5 h-4 w-4 rounded-full border-2 border-yellow-500 bg-white"></div>
                                <div>
                                    <h3 className="text-md font-medium text-gray-800">Order Shipped</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {formatDate(order.lastUpdated)}
                                    </p>
                                    {order.trackingNumber && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Delivered */}
                        {order.status === 'delivered' && (
                            <div className="relative">
                                <div className="absolute -left-12 mt-1.5 h-4 w-4 rounded-full border-2 border-green-500 bg-white"></div>
                                <div>
                                    <h3 className="text-md font-medium text-gray-800">Order Delivered</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {formatDate(order.deliveredDate || order.lastUpdated)}
                                    </p>
                                    <p className="mt-1 text-sm text-green-600">
                                        Order completed successfully
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Cancelled */}
                        {order.status === 'cancelled' && (
                            <div className="relative">
                                <div className="absolute -left-12 mt-1.5 h-4 w-4 rounded-full border-2 border-red-500 bg-white"></div>
                                <div>
                                    <h3 className="text-md font-medium text-gray-800">Order Cancelled</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {formatDate(order.lastUpdated)}
                                    </p>
                                    <p className="mt-1 text-sm text-red-600">
                                        This order has been cancelled
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Expected delivery (for pending orders) */}
                        {(order.status === 'processing' || order.status === 'shipped') && (
                            <div className="relative">
                                <div className="absolute -left-12 mt-1.5 h-4 w-4 rounded-full border-2 border-gray-300 bg-white"></div>
                                <div>
                                    <h3 className="text-md font-medium text-gray-400">Expected Delivery</h3>
                                    <p className="mt-1 text-sm text-gray-400">
                                        {formatDate(order.deliveryDate)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order items table */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Price
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {item.quantity.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        ${item.unitPrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                        ${item.total.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                    Subtotal
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    ${order.total.toLocaleString()}
                                </td>
                            </tr>
                            {/* For simplicity, we're not showing shipping and tax here,
                                but you could add those lines if those fields exist in your data */}
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-base font-bold text-gray-900 text-right">
                                    Total
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900 text-right">
                                    ${order.total.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Action buttons based on status */}
            <div className="flex justify-between">
                <div>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                            onClick={handleCancelOrder}
                            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                        >
                            {confirmCancel ? 'Confirm Cancellation' : 'Cancel Order'}
                        </button>
                    )}
                </div>

                <div className="flex space-x-3">
                    {order.status === 'draft' && (
                        <button
                            onClick={() => handleUpdateStatus('processing')}
                            className="btn-primary flex items-center"
                        >
                            <FiCheck className="mr-2" />
                            Submit Order
                        </button>
                    )}

                    {order.status === 'processing' && (
                        <button
                            onClick={() => handleUpdateStatus('shipped')}
                            className="btn-primary flex items-center"
                        >
                            <FiTruck className="mr-2" />
                            Mark as Shipped
                        </button>
                    )}

                    {order.status === 'shipped' && (
                        <button
                            onClick={() => handleUpdateStatus('delivered')}
                            className="btn-primary flex items-center"
                        >
                            <FiCheck className="mr-2" />
                            Mark as Delivered
                        </button>
                    )}

                    {supplier && (
                        <Link
                            href={`/negotiations?supplierId=${supplier.id}`}
                            className="btn-secondary flex items-center"
                        >
                            <FiMessageSquare className="mr-2" />
                            Contact Supplier
                        </Link>
                    )}

                    <Link href={`/orders/new?supplierId=${order.supplierId}`} className="btn-secondary flex items-center">
                        <FiShoppingCart className="mr-2" />
                        New Order
                    </Link>
                </div>
            </div>
        </div>
    );
}
