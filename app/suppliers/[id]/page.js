'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    FiArrowLeft,
    FiStar,
    FiMapPin,
    FiFileText,
    FiClock,
    FiTruck,
    FiDollarSign,
    FiCheckCircle,
    FiAlertCircle,
    FiBarChart2,
    FiMessageSquare,
    FiShield,
    FiPlusCircle,
    FiShoppingCart
} from 'react-icons/fi';
import { supplierApi } from '../../../lib/api';
import { mockSuppliers, getSupplierById } from '@/lib/mockData';

export default function SupplierDetailsPage() {
    const params = useParams();
    const supplierId = params.id;

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock supplier data
    useEffect(() => {
        const fetchSupplierDetails = async () => {
            try {
                // In a real application, we would use the API client
                // const response = await supplierApi.getById(supplierId);
                // setSupplier(response.data);

                // For the hackathon, use mock data and find the specific supplier by ID
                setTimeout(() => {
                    const supplierData = getSupplierById(supplierId);
                    setSupplier(supplierData);
                    setLoading(false);
                }, 700);
            } catch (error) {
                console.error('Error fetching supplier details:', error);
                setLoading(false);
            }
        };

        fetchSupplierDetails();
    }, [supplierId]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading supplier details...</p>
                </div>
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h2 className="mt-2 text-xl font-semibold text-gray-800">Supplier Not Found</h2>
                    <p className="mt-1 text-gray-600">The supplier you're looking for does not exist or has been removed.</p>
                    <Link href="/suppliers" className="mt-4 inline-block btn-primary">
                        Return to Suppliers
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with back button and actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center">
                    <Link href="/suppliers" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">{supplier.name}</h1>
                </div>
                <div className="flex space-x-3">
                    <Link
                        href={`/negotiations?supplierId=${supplier.id}`}
                        className="btn-secondary flex items-center"
                    >
                        <FiMessageSquare className="mr-2" />
                        Negotiate
                    </Link>
                    <Link
                        href={`/orders/new?supplierId=${supplier.id}`}
                        className="btn-primary flex items-center"
                    >
                        <FiShoppingCart className="mr-2" />
                        Create Order
                    </Link>
                </div>
            </div>

            {/* Supplier overview card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Logo/initial and basic info */}
                    <div className="flex items-start">
                        <div className="h-20 w-20 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                            {supplier.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-gray-800 mb-1">{supplier.name}</h2>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                                <span className="flex items-center mr-4">
                                    <FiStar className="h-4 w-4 text-yellow-400 mr-1" />
                                    {supplier.rating}
                                </span>
                                <span className="flex items-center">
                                    <FiMapPin className="h-4 w-4 mr-1" />
                                    {supplier.location}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{supplier.category} • {supplier.subcategory}</p>
                        </div>
                    </div>

                    {/* Key metrics */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="border rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Reliability</p>
                                <div className="flex items-center">
                                    <div className="h-2 w-full bg-gray-200 rounded mr-2">
                                        <div
                                            className="h-2 bg-blue-500 rounded"
                                            style={{ width: `${supplier.reliabilityScore}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{supplier.reliabilityScore}%</span>
                                </div>
                            </div>

                            <div className="border rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Quality</p>
                                <div className="flex items-center">
                                    <div className="h-2 w-full bg-gray-200 rounded mr-2">
                                        <div
                                            className="h-2 bg-green-500 rounded"
                                            style={{ width: `${supplier.qualityScore}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{supplier.qualityScore}%</span>
                                </div>
                            </div>

                            <div className="border rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Delivery</p>
                                <div className="flex items-center">
                                    <div className="h-2 w-full bg-gray-200 rounded mr-2">
                                        <div
                                            className="h-2 bg-purple-500 rounded"
                                            style={{ width: `${supplier.deliveryScore}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{supplier.deliveryScore}%</span>
                                </div>
                            </div>

                            <div className="border rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Communication</p>
                                <div className="flex items-center">
                                    <div className="h-2 w-full bg-gray-200 rounded mr-2">
                                        <div
                                            className="h-2 bg-yellow-500 rounded"
                                            style={{ width: `${supplier.communicationScore}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{supplier.communicationScore}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className={`text-sm font-medium ${supplier.status === 'active' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {supplier.status === 'active' ? 'Active' : 'Inactive'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Compliance</p>
                                <p className={`text-sm font-medium ${supplier.complianceStatus === 'compliant' ? 'text-green-600' :
                                    supplier.complianceStatus === 'review' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                    {supplier.complianceStatus === 'compliant' ? 'Compliant' :
                                        supplier.complianceStatus === 'review' ? 'Under Review' :
                                            'Non-Compliant'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Last Order</p>
                                <p className="text-sm font-medium">
                                    {new Date(supplier.lastOrder).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Founded</p>
                                <p className="text-sm font-medium">{supplier.foundedYear}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Supplier description */}
                <div className="mt-6">
                    <p className="text-gray-700">{supplier.description}</p>
                </div>
            </div>

            {/* Tabs for different sections */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b">
                    <nav className="flex overflow-x-auto">
                        <button
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'overview'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'performance'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('performance')}
                        >
                            Performance
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'compliance'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('compliance')}
                        >
                            Compliance
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'products'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('products')}
                        >
                            Products
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'orders'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Orders
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {/* Overview tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Contact information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Website</p>
                                        <a
                                            href={supplier.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {supplier.website.replace('https://', '')}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <a
                                            href={`mailto:${supplier.contactEmail}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {supplier.contactEmail}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <a
                                            href={`tel:${supplier.contactPhone}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {supplier.contactPhone}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Risk assessment */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Risk Assessment</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {supplier.riskFactors.map((risk, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{risk.category} Risk</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk.level === 'low' ? 'bg-green-100 text-green-800' :
                                                    risk.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{risk.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Key stats */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Company Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">Founded</p>
                                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                <FiFileText className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xl font-semibold">{supplier.foundedYear}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">Employees</p>
                                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                <FiUsers className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xl font-semibold">{supplier.employees}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">Location</p>
                                            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                                <FiMapPin className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xl font-semibold">{supplier.location}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">Category</p>
                                            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                                <FiTag className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xl font-semibold">{supplier.category}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Performance tab */}
                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Performance History</h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Month
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                On-Time Delivery
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quality Compliance
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cost Variance
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {supplier.performanceHistory.map((period, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {period.month}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <div className="w-16 bg-gray-200 rounded h-2 mr-2">
                                                            <div
                                                                style={{ width: `${period.onTimeDelivery}%` }}
                                                                className="bg-blue-500 h-2 rounded"
                                                            ></div>
                                                        </div>
                                                        <span>{period.onTimeDelivery}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <div className="w-16 bg-gray-200 rounded h-2 mr-2">
                                                            <div
                                                                style={{ width: `${period.qualityCompliance}%` }}
                                                                className="bg-green-500 h-2 rounded"
                                                            ></div>
                                                        </div>
                                                        <span>{period.qualityCompliance}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={
                                                        period.costVariance <= 0
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }>
                                                        {period.costVariance > 0 ? '+' : ''}
                                                        {period.costVariance}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Key Performance Indicators</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white border rounded-lg p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-gray-700 font-medium">On-Time Delivery</h4>
                                            <div className="text-blue-600">
                                                <FiClock className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-2">
                                            {supplier.performanceHistory[0].onTimeDelivery}%
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {supplier.performanceHistory[0].onTimeDelivery > supplier.performanceHistory[1].onTimeDelivery ? (
                                                <span className="text-green-600">
                                                    +{supplier.performanceHistory[0].onTimeDelivery - supplier.performanceHistory[1].onTimeDelivery}% from last month
                                                </span>
                                            ) : (
                                                <span className="text-red-600">
                                                    {supplier.performanceHistory[0].onTimeDelivery - supplier.performanceHistory[1].onTimeDelivery}% from last month
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white border rounded-lg p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-gray-700 font-medium">Quality Compliance</h4>
                                            <div className="text-green-600">
                                                <FiCheckCircle className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-2">
                                            {supplier.performanceHistory[0].qualityCompliance}%
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {supplier.performanceHistory[0].qualityCompliance > supplier.performanceHistory[1].qualityCompliance ? (
                                                <span className="text-green-600">
                                                    +{supplier.performanceHistory[0].qualityCompliance - supplier.performanceHistory[1].qualityCompliance}% from last month
                                                </span>
                                            ) : (
                                                <span className="text-red-600">
                                                    {supplier.performanceHistory[0].qualityCompliance - supplier.performanceHistory[1].qualityCompliance}% from last month
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white border rounded-lg p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-gray-700 font-medium">Cost Performance</h4>
                                            <div className="text-purple-600">
                                                <FiDollarSign className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-2">
                                            {supplier.performanceHistory[0].costVariance > 0 ? '+' : ''}
                                            {supplier.performanceHistory[0].costVariance}%
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {supplier.performanceHistory[0].costVariance <= supplier.performanceHistory[1].costVariance ? (
                                                <span className="text-green-600">
                                                    Improved by {Math.abs(supplier.performanceHistory[0].costVariance - supplier.performanceHistory[1].costVariance)}% from last month
                                                </span>
                                            ) : (
                                                <span className="text-red-600">
                                                    Decreased by {Math.abs(supplier.performanceHistory[0].costVariance - supplier.performanceHistory[1].costVariance)}% from last month
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Compliance tab */}
                    {activeTab === 'compliance' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Certifications & Compliance</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {supplier.certifications.map((cert, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex items-start">
                                            <div className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full ${cert.valid ? 'bg-green-100' : 'bg-red-100'
                                                } flex items-center justify-center`}>
                                                <div className={`h-3 w-3 rounded-full ${cert.valid ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="font-medium">{cert.name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Valid until: {new Date(cert.expirationDate).toLocaleDateString()}
                                                </p>
                                                <div className="mt-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cert.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {cert.valid ? 'Active' : 'Expired'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-800">Compliance Actions</h3>
                                    <Link
                                        href={`/compliance/verify?supplierId=${supplier.id}`}
                                        className="btn-primary flex items-center text-sm"
                                    >
                                        <FiShield className="mr-2" />
                                        Verify Compliance
                                    </Link>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <div className="px-6 py-4 bg-gray-50 border-b">
                                        <p className="text-sm font-medium text-gray-700">
                                            Recent Compliance Checks
                                        </p>
                                    </div>
                                    <div className="p-6 text-center text-gray-600">
                                        <p>No recent compliance checks found.</p>
                                        <p className="text-sm mt-1">
                                            Use the Compliance Guardian to verify this supplier's compliance status.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products tab */}
                    {activeTab === 'products' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-800">Products & Services</h3>
                                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    Request Catalog
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product Name
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Lead Time
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Min. Order Qty
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {supplier.products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.leadTime}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.minOrderQty.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Details
                                                    </button>
                                                    <Link
                                                        href={`/orders/new?supplierId=${supplier.id}&productId=${product.id}`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Order
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Orders tab */}
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
                                <Link
                                    href={`/orders/new?supplierId=${supplier.id}`}
                                    className="btn-primary flex items-center text-sm"
                                >
                                    <FiPlusCircle className="mr-2" />
                                    New Order
                                </Link>
                            </div>

                            {supplier.recentOrders.length === 0 ? (
                                <div className="text-center py-8 border rounded-lg">
                                    <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating a new order with this supplier.
                                    </p>
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
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {supplier.recentOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {order.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(order.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'In Transit'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : order.status === 'Processing'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ${order.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={`/orders/${order.id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Missing icon components
const FiUsers = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
    </svg>
);

const FiTag = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
    </svg>
);
