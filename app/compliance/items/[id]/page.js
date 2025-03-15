'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    FiArrowLeft,
    FiFileText,
    FiDownload,
    FiEdit,
    FiCheckCircle,
    FiAlertCircle,
    FiClock,
    FiCalendar,
    FiUser,
    FiTag,
    FiClipboard,
    FiShield,
    FiExternalLink,
    FiUpload,
    FiRefreshCw,
    FiChevronRight
} from 'react-icons/fi';
import { complianceApi } from '@/lib/api';
import { mockComplianceItems, getSupplierById } from '@/lib/mockData';

export default function ComplianceItemDetailsPage() {
    const params = useParams();
    const itemId = parseInt(params.id);

    const [complianceItem, setComplianceItem] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [relatedItems, setRelatedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchComplianceItem = async () => {
            try {
                // In a real app, we would use the API client
                // const response = await complianceApi.getItemById(itemId);
                // setComplianceItem(response.data);

                // For the hackathon, use mock data
                setTimeout(() => {
                    const item = mockComplianceItems.find(item => item.id === itemId);
                    setComplianceItem(item);

                    if (item) {
                        // Get supplier details
                        const supplierData = getSupplierById(item.supplierId);
                        setSupplier(supplierData);

                        // Get related compliance items for the same supplier
                        const related = mockComplianceItems.filter(
                            relatedItem => relatedItem.supplierId === item.supplierId && relatedItem.id !== item.id
                        );
                        setRelatedItems(related);
                    }

                    setLoading(false);
                }, 700);
            } catch (error) {
                console.error('Error fetching compliance item:', error);
                setLoading(false);
            }
        };

        fetchComplianceItem();
    }, [itemId]);

    // Function to handle document download
    const handleDownload = async () => {
        if (!complianceItem) return;

        try {
            setDownloading(true);

            // In a real app, we would fetch the document from an API
            // const response = await complianceApi.downloadDocument(complianceItem.id);

            // Using a mock file for the hackathon demo
            const fileName = 'iso-9001-certificate.pdf';
            const fileUrl = '/iso-9001-certificate-html.pdf';

            // Fetch the file
            const response = await fetch(fileUrl);

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            // Get the file as a blob
            const blob = await response.blob();

            // Create a URL for the blob
            const downloadUrl = window.URL.createObjectURL(blob);

            // Create a temporary link element to trigger the download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            setDownloading(false);
        } catch (error) {
            console.error('Error downloading document:', error);
            setDownloading(false);
            alert('Failed to download document. Please try again later.');
        }
    };

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

    // Get expiry status message and color
    const getExpiryStatus = (dateString) => {
        if (!dateString) return { message: 'No expiration date', color: 'text-gray-500' };

        const days = getDaysUntilExpiry(dateString);

        if (days < 0) {
            return { message: 'Expired', color: 'text-red-600' };
        } else if (days <= 30) {
            return { message: `Expires in ${days} days`, color: 'text-red-600' };
        } else if (days <= 60) {
            return { message: `Expires in ${days} days`, color: 'text-yellow-600' };
        } else {
            return { message: `Expires in ${days} days`, color: 'text-green-600' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading compliance details...</p>
                </div>
            </div>
        );
    }

    if (!complianceItem) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h2 className="mt-2 text-xl font-semibold text-gray-800">Compliance Item Not Found</h2>
                    <p className="mt-1 text-gray-600">The compliance item you're looking for does not exist or has been removed.</p>
                    <Link href="/compliance" className="mt-4 inline-block btn-primary">
                        Return to Compliance
                    </Link>
                </div>
            </div>
        );
    }

    // Get expiry status
    const expiryStatus = getExpiryStatus(complianceItem.expiryDate);

    return (
        <div className="space-y-6">
            {/* Header with back button and actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/compliance" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Compliance Document Details</h1>
                </div>
                <div className="flex space-x-3">
                    <button
                        className="btn-secondary flex items-center"
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        {downloading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <FiDownload className="mr-2" />
                                Download
                            </>
                        )}
                    </button>
                    <button className="btn-primary flex items-center">
                        <FiEdit className="mr-2" />
                        Update Status
                    </button>
                </div>
            </div>

            {/* Compliance Item Details Card */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <div className="flex items-center mb-2">
                                <h2 className="text-lg font-medium text-gray-800 mr-3">{complianceItem.documentType}</h2>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complianceItem.status)}`}>
                                    {getStatusIcon(complianceItem.status)}
                                    <span className="ml-1">
                                        {complianceItem.status === 'compliant' ? 'Compliant' :
                                            complianceItem.status === 'review' ? 'Under Review' :
                                                'Non-Compliant'}
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <FiUser className="mr-2 h-4 w-4" />
                                <span className="mr-1">Supplier:</span>
                                <Link href={`/suppliers/${complianceItem.supplierId}`} className="text-blue-600 hover:underline">
                                    {complianceItem.supplierName}
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center">
                                <FiCalendar className="mr-2 h-4 w-4 text-gray-500" />
                                <div>
                                    <span className="text-xs text-gray-500">Last Checked</span>
                                    <p className="text-sm font-medium">{formatDate(complianceItem.lastChecked)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FiCalendar className="mr-2 h-4 w-4 text-gray-500" />
                                <div>
                                    <span className="text-xs text-gray-500">Expiry Date</span>
                                    <p className={`text-sm font-medium ${expiryStatus.color}`}>
                                        {formatDate(complianceItem.expiryDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rest of the component remains unchanged */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column - key details */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Status information */}
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <div className="flex items-start">
                                    {getStatusIcon(complianceItem.status)}
                                    <div className="ml-3">
                                        <h3 className="text-md font-medium text-gray-800">
                                            {complianceItem.status === 'compliant' ? 'Document is Compliant' :
                                                complianceItem.status === 'review' ? 'Document Needs Review' :
                                                    'Document Not Compliant'}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {complianceItem.status === 'compliant'
                                                ? 'This document meets all requirements and standards.'
                                                : complianceItem.status === 'review'
                                                    ? 'This document requires review to ensure compliance with standards.'
                                                    : 'This document does not meet compliance requirements and needs immediate attention.'}
                                        </p>
                                    </div>
                                </div>

                                {complianceItem.expiryDate && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center">
                                            <FiCalendar className="h-5 w-5 text-gray-500 mr-3" />
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-800">Expiration Status</h4>
                                                <p className={`text-sm ${expiryStatus.color}`}>
                                                    {expiryStatus.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <FiTag className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-800">Category</h4>
                                            <p className="text-sm text-gray-600">{complianceItem.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Document Details */}
                            <div className="bg-white border rounded-lg p-5">
                                <h3 className="text-md font-medium text-gray-800 mb-3">Document Details</h3>

                                {complianceItem.notes && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                                        <p className="text-sm text-gray-600">{complianceItem.notes}</p>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Document Type</h4>
                                            <p className="text-sm text-gray-600">{complianceItem.documentType}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h4>
                                            <p className="text-sm text-gray-600">{formatDate(complianceItem.lastChecked)}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Verification Method</h4>
                                            <p className="text-sm text-gray-600">Document Analysis</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Document ID</h4>
                                            <p className="text-sm text-gray-600">DOC-{complianceItem.id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Actions */}
                            {complianceItem.status !== 'compliant' && (
                                <div className="bg-white border rounded-lg p-5">
                                    <h3 className="text-md font-medium text-gray-800 mb-3">Recommended Actions</h3>

                                    <div className="space-y-4">
                                        {complianceItem.status === 'review' ? (
                                            <>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                                            <span className="text-xs">1</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-gray-700">
                                                            Review the document for compliance with latest standards
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                                            <span className="text-xs">2</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-gray-700">
                                                            Contact supplier for any clarifications or missing information
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                                            <span className="text-xs">3</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-gray-700">
                                                            Update compliance status after review
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                                            <span className="text-xs">1</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-gray-700">
                                                            Notify supplier immediately about non-compliance
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                                            <span className="text-xs">2</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-gray-700">
                                                            Request corrected documentation within 15 days
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                                            <span className="text-xs">3</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-gray-700">
                                                            Escalate to compliance team if no response within 7 days
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right column - supplier info & actions */}
                        <div className="space-y-6">
                            {/* Supplier Information */}
                            {supplier && (
                                <div className="bg-white border rounded-lg p-5">
                                    <h3 className="text-md font-medium text-gray-800 mb-3">Supplier Information</h3>

                                    <div className="flex items-center mb-4">
                                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-lg font-bold mr-3">
                                            {supplier.name.charAt(0)}
                                        </div>
                                        <div>
                                            <Link href={`/suppliers/${supplier.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                                                {supplier.name}
                                            </Link>
                                            <p className="text-xs text-gray-500">{supplier.category}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 w-32">Status:</span>
                                            <span className={`font-medium ${supplier.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 w-32">Compliance Status:</span>
                                            <span className={`font-medium ${supplier.complianceStatus === 'compliant' ? 'text-green-600' :
                                                supplier.complianceStatus === 'review' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {supplier.complianceStatus.charAt(0).toUpperCase() + supplier.complianceStatus.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 w-32">Location:</span>
                                            <span className="font-medium">{supplier.location}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 w-32">Contract Expires:</span>
                                            <span className="font-medium">{formatDate(supplier.contractExpiry)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <Link
                                            href={`/suppliers/${supplier.id}`}
                                            className="text-sm text-blue-600 font-medium flex items-center"
                                        >
                                            View Supplier Profile
                                            <FiChevronRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-white border rounded-lg p-5">
                                <h3 className="text-md font-medium text-gray-800 mb-3">Quick Actions</h3>

                                <div className="space-y-3">
                                    <Link
                                        href={`/compliance/verify?documentId=${complianceItem.id}`}
                                        className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                                            <FiCheckCircle className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">Verify Compliance</span>
                                    </Link>

                                    <Link
                                        href={`/compliance/analyze`}
                                        className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <FiUpload className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">Upload New Version</span>
                                    </Link>

                                    <button
                                        className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors w-full cursor-pointer"
                                    >
                                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                            <FiRefreshCw className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium cursor-pointer">Schedule Review</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Compliance Items */}
            {relatedItems.length > 0 && (
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Related Compliance Items</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Document Type
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expiry Date
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {relatedItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.documentType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.category}
                                        </td>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.expiryDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/compliance/items/${item.id}`}
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
                </div>
            )}
        </div>
    );
}
