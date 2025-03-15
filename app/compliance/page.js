'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiShield,
    FiUpload,
    FiFileText,
    FiCheckCircle,
    FiAlertCircle,
    FiClock,
    FiSearch,
    FiFilter,
    FiCalendar,
    FiRefreshCw,
    FiExternalLink
} from 'react-icons/fi';
import { complianceApi } from '../../lib/api';

export default function CompliancePage() {
    const [loading, setLoading] = useState(true);
    const [complianceItems, setComplianceItems] = useState([]);
    const [stats, setStats] = useState({
        compliant: 0,
        review: 0,
        nonCompliant: 0,
        expiringSoon: 0
    });

    // Mock data for compliance items
    const mockComplianceItems = [
        {
            id: 1,
            supplierId: 1,
            supplierName: 'ElectroTech Industries',
            documentType: 'ISO 9001 Certification',
            status: 'compliant',
            expiryDate: '2024-06-30',
            lastChecked: '2023-09-12',
            category: 'Quality Management',
            notes: 'Certification verified with issuing body'
        },
        {
            id: 2,
            supplierId: 1,
            supplierName: 'ElectroTech Industries',
            documentType: 'Environmental Policy',
            status: 'compliant',
            expiryDate: '2024-11-15',
            lastChecked: '2023-09-12',
            category: 'Environmental',
            notes: 'Document meets all requirements'
        },
        {
            id: 3,
            supplierId: 2,
            supplierName: 'Global Packaging Solutions',
            documentType: 'Food Safety Certification',
            status: 'review',
            expiryDate: '2023-10-30',
            lastChecked: '2023-09-10',
            category: 'Product Safety',
            notes: 'Certification expires in less than 60 days'
        },
        {
            id: 4,
            supplierId: 3,
            supplierName: 'RawMat Suppliers Inc',
            documentType: 'REACH Compliance',
            status: 'non-compliant',
            expiryDate: '2023-07-15',
            lastChecked: '2023-09-05',
            category: 'Regulatory',
            notes: 'Certification expired, follow-up required'
        },
        {
            id: 5,
            supplierId: 4,
            supplierName: 'FastTrack Logistics',
            documentType: 'Insurance Certificate',
            status: 'compliant',
            expiryDate: '2024-02-28',
            lastChecked: '2023-09-01',
            category: 'Insurance',
            notes: 'Coverage meets minimum requirements'
        },
        {
            id: 6,
            supplierId: 5,
            supplierName: 'Quality Service Providers',
            documentType: 'Professional Certifications',
            status: 'compliant',
            expiryDate: '2024-05-15',
            lastChecked: '2023-08-20',
            category: 'Professional Qualifications',
            notes: 'All staff certifications verified'
        },
        {
            id: 7,
            supplierId: 3,
            supplierName: 'RawMat Suppliers Inc',
            documentType: 'Fair Labor Practices',
            status: 'review',
            expiryDate: null,
            lastChecked: '2023-09-08',
            category: 'Social Responsibility',
            notes: 'Additional documentation requested'
        },
    ];

    useEffect(() => {
        const fetchComplianceData = async () => {
            try {
                // In a real app, we would use the API client
                // const response = await complianceApi.getItems();
                // setComplianceItems(response.data);

                // For the hackathon, use mock data
                setTimeout(() => {
                    setComplianceItems(mockComplianceItems);

                    // Calculate statistics
                    const stats = {
                        compliant: mockComplianceItems.filter(item => item.status === 'compliant').length,
                        review: mockComplianceItems.filter(item => item.status === 'review').length,
                        nonCompliant: mockComplianceItems.filter(item => item.status === 'non-compliant').length,
                        expiringSoon: mockComplianceItems.filter(item => {
                            if (!item.expiryDate) return false;

                            const expiryDate = new Date(item.expiryDate);
                            const today = new Date();
                            const days = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

                            return days > 0 && days <= 60;
                        }).length
                    };

                    setStats(stats);
                    setLoading(false);
                }, 700);
            } catch (error) {
                console.error('Error fetching compliance data:', error);
                setLoading(false);
            }
        };

        fetchComplianceData();
    }, []);

    // Function to determine the status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'compliant':
                return 'bg-green-100 text-green-800';
            case 'review':
                return 'bg-yellow-100 text-yellow-800';
            case 'non-compliant':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Function to determine the status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'compliant':
                return <FiCheckCircle className="h-5 w-5 text-green-500" />;
            case 'review':
                return <FiClock className="h-5 w-5 text-yellow-500" />;
            case 'non-compliant':
                return <FiAlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <FiFileText className="h-5 w-5 text-gray-500" />;
        }
    };

    // Function to format the date display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Function to calculate days until expiry
    const getDaysUntilExpiry = (dateString) => {
        if (!dateString) return null;

        const expiryDate = new Date(dateString);
        const today = new Date();
        const days = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

        return days;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Compliance Guardian</h1>
                <div className="flex space-x-3">
                    <Link href="/compliance/documents" className="btn-secondary flex items-center">
                        <FiFileText className="mr-2" />
                        View Documents
                    </Link>
                    <Link href="/compliance/analyze" className="btn-primary flex items-center">
                        <FiUpload className="mr-2" />
                        Analyze Document
                    </Link>
                </div>
            </div>

            {/* Compliance Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-medium text-gray-700">Compliant</h2>
                        <div className="p-2 bg-green-100 rounded-full">
                            <FiCheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <div className="text-3xl font-bold text-gray-800">{stats.compliant}</div>
                        <div className="text-sm text-gray-500 ml-2 mb-1">items</div>
                    </div>
                    <div className="mt-4 text-sm text-green-600">
                        {Math.round((stats.compliant / (stats.compliant + stats.review + stats.nonCompliant)) * 100)}% of total
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-medium text-gray-700">Under Review</h2>
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <FiClock className="h-5 w-5 text-yellow-600" />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <div className="text-3xl font-bold text-gray-800">{stats.review}</div>
                        <div className="text-sm text-gray-500 ml-2 mb-1">items</div>
                    </div>
                    <div className="mt-4 text-sm text-yellow-600">
                        Requires attention
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-medium text-gray-700">Non-Compliant</h2>
                        <div className="p-2 bg-red-100 rounded-full">
                            <FiAlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <div className="text-3xl font-bold text-gray-800">{stats.nonCompliant}</div>
                        <div className="text-sm text-gray-500 ml-2 mb-1">items</div>
                    </div>
                    <div className="mt-4 text-sm text-red-600">
                        Urgent action required
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md font-medium text-gray-700">Expiring Soon</h2>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <FiCalendar className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <div className="text-3xl font-bold text-gray-800">{stats.expiringSoon}</div>
                        <div className="text-sm text-gray-500 ml-2 mb-1">items</div>
                    </div>
                    <div className="mt-4 text-sm text-blue-600">
                        Expiring within 60 days
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search compliance items..."
                            className="form-input pl-10 w-full"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <select className="form-select">
                                <option value="">All Suppliers</option>
                                <option value="1">ElectroTech Industries</option>
                                <option value="2">Global Packaging Solutions</option>
                                <option value="3">RawMat Suppliers Inc</option>
                                <option value="4">FastTrack Logistics</option>
                                <option value="5">Quality Service Providers</option>
                            </select>
                        </div>

                        <div className="relative">
                            <select className="form-select">
                                <option value="">All Categories</option>
                                <option value="Quality Management">Quality Management</option>
                                <option value="Environmental">Environmental</option>
                                <option value="Product Safety">Product Safety</option>
                                <option value="Regulatory">Regulatory</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Professional Qualifications">Professional Qualifications</option>
                                <option value="Social Responsibility">Social Responsibility</option>
                            </select>
                        </div>

                        <div className="relative">
                            <select className="form-select">
                                <option value="">All Statuses</option>
                                <option value="compliant">Compliant</option>
                                <option value="review">Under Review</option>
                                <option value="non-compliant">Non-Compliant</option>
                            </select>
                        </div>

                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <FiRefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Compliance Items */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">Compliance Items</h2>
                </div>

                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading compliance data...</p>
                    </div>
                ) : complianceItems.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <FiFileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No compliance items found</h3>
                        <p className="mt-1 text-gray-500">
                            Add documents or check your filter settings
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Document Type
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Supplier
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expiry Date
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Checked
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {complianceItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getStatusIcon(item.status)}
                                                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {item.status === 'compliant' ? 'Compliant' :
                                                        item.status === 'review' ? 'Under Review' :
                                                            'Non-Compliant'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.documentType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Link href={`/suppliers/${item.supplierId}`} className="hover:text-blue-600 hover:underline">
                                                {item.supplierName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.expiryDate ? (
                                                <div>
                                                    {formatDate(item.expiryDate)}
                                                    {getDaysUntilExpiry(item.expiryDate) < 0 ? (
                                                        <div className="text-xs text-red-600 font-medium">
                                                            Expired
                                                        </div>
                                                    ) : getDaysUntilExpiry(item.expiryDate) <= 60 ? (
                                                        <div className="text-xs text-yellow-600 font-medium">
                                                            {getDaysUntilExpiry(item.expiryDate)} days left
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.lastChecked)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/compliance/items/${item.id}`}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/compliance/verify?documentId=${item.id}`}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Verify
                                            </Link>
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
                    href="/compliance/analyze"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Analyze Document</h3>
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                            <FiUpload className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Upload and analyze contracts, certifications, and other documents for compliance.
                    </p>
                </Link>

                <Link
                    href="/compliance/requirements"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Compliance Requirements</h3>
                        <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                            <FiFileText className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        View regulatory and company requirements for different supplier categories.
                    </p>
                </Link>

                <Link
                    href="/compliance/verify"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Supplier Verification</h3>
                        <div className="bg-green-100 text-green-600 p-2 rounded-full">
                            <FiCheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Verify a supplier's overall compliance status across all requirements.
                    </p>
                </Link>
            </div>

            {/* External Resources */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Compliance Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="#"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                        onClick={(e) => e.preventDefault()}
                    >
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <FiFileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Compliance Policy Templates</h4>
                            <p className="text-xs text-gray-500">Standard templates for key compliance documents</p>
                        </div>
                        <FiExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>

                    <a
                        href="#"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                        onClick={(e) => e.preventDefault()}
                    >
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <FiFileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Regulatory Updates</h4>
                            <p className="text-xs text-gray-500">Latest changes to compliance regulations</p>
                        </div>
                        <FiExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>

                    <a
                        href="#"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                        onClick={(e) => e.preventDefault()}
                    >
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <FiFileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Compliance Training</h4>
                            <p className="text-xs text-gray-500">Training materials for procurement teams</p>
                        </div>
                        <FiExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>

                    <a
                        href="#"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                        onClick={(e) => e.preventDefault()}
                    >
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <FiFileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Industry Best Practices</h4>
                            <p className="text-xs text-gray-500">Compliance guidelines by industry sector</p>
                        </div>
                        <FiExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>
                </div>
            </div>
        </div>
    );
}
