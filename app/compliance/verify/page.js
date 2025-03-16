'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiCheck,
    FiX,
    FiAlertCircle,
    FiClock,
    FiCheckCircle,
    FiUpload,
    FiFileText,
    FiShield,
    FiDownload,
    FiExternalLink,
    FiRefreshCw
} from 'react-icons/fi';
import { complianceApi } from '@/lib/api';
import { mockComplianceItems, getSupplierById } from '@/lib/mockData';

// Main component that doesn't directly use useSearchParams
export default function VerifyCompliancePage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <VerifyContent />
        </Suspense>
    );
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-2 rounded-full mr-2">
                        <div className="h-5 w-5 text-gray-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Supplier Compliance Verification</h1>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading compliance data...</p>
            </div>
        </div>
    );
}

// Content component that safely uses useSearchParams inside a Suspense boundary
function VerifyContent() {
    // Import useSearchParams inside this component
    const { useSearchParams } = require('next/navigation');
    const searchParams = useSearchParams();
    const supplierId = searchParams.get('supplierId');
    const documentId = searchParams.get('documentId');

    const [supplier, setSupplier] = useState(null);
    const [complianceItems, setComplianceItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState({
        inProgress: false,
        completed: false,
        success: false
    });
    const [verificationReport, setVerificationReport] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // For a real app, we would call the API
                // const supplierResponse = await supplierApi.getById(supplierId);
                // const complianceResponse = await complianceApi.getItemsBySupplier(supplierId);

                // For the hackathon, use mock data
                setTimeout(() => {
                    if (supplierId) {
                        // Get supplier details
                        const supplierData = getSupplierById(parseInt(supplierId));
                        setSupplier(supplierData);

                        // Filter compliance items for this supplier
                        const items = mockComplianceItems.filter(
                            item => item.supplierId === parseInt(supplierId)
                        );
                        setComplianceItems(items);

                        // If a specific document ID was provided, select that item
                        if (documentId) {
                            const item = mockComplianceItems.find(
                                item => item.id === parseInt(documentId)
                            );
                            if (item) {
                                setSelectedItem(item);
                            }
                        }
                    }

                    setLoading(false);
                }, 700);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [supplierId, documentId]);

    // Function to determine compliance status based on items
    const getOverallComplianceStatus = () => {
        if (!complianceItems || complianceItems.length === 0) return 'unknown';

        if (complianceItems.some(item => item.status === 'non-compliant')) {
            return 'non-compliant';
        }

        if (complianceItems.some(item => item.status === 'review')) {
            return 'review';
        }

        return 'compliant';
    };

    // Function to get status badge styling
    const getStatusBadge = (status) => {
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

    // Function to get status icon
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

    // Function to handle item selection
    const handleSelectItem = (item) => {
        setSelectedItem(item);
        // Reset verification status when a new item is selected
        setVerificationStatus({
            inProgress: false,
            completed: false,
            success: false
        });
        setVerificationReport(null);
    };

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Function to handle verification
    const handleVerify = () => {
        if (!selectedItem) return;

        setVerificationStatus({
            inProgress: true,
            completed: false,
            success: false
        });

        // Mock verification process with setTimeout
        setTimeout(() => {
            // For the hackathon, we'll simulate a successful verification
            const isSuccess = Math.random() > 0.3; // 70% success rate

            // Generate mock verification report
            const report = {
                date: new Date().toISOString(),
                documentType: selectedItem.documentType,
                supplierName: selectedItem.supplierName,
                verificationMethod: 'Automated document verification',
                result: isSuccess ? 'VERIFIED' : 'VERIFICATION FAILED',
                details: isSuccess
                    ? 'Document appears to be authentic and meets all required standards.'
                    : 'Verification failed due to missing or inconsistent information.',
                nextSteps: isSuccess
                    ? 'Document is approved for compliance purposes. Next review scheduled for ' + formatDate(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000))
                    : 'Contact supplier to request corrected or updated documentation.',
                warnings: isSuccess && Math.random() > 0.5
                    ? ['Document will expire in less than 90 days. Consider requesting renewal.']
                    : []
            };

            setVerificationReport(report);
            setVerificationStatus({
                inProgress: false,
                completed: true,
                success: isSuccess
            });

            // Update the status of the selected item (in a real app, this would be saved to the backend)
            if (isSuccess) {
                const updatedItems = complianceItems.map(item =>
                    item.id === selectedItem.id
                        ? { ...item, status: 'compliant', lastChecked: new Date().toISOString() }
                        : item
                );
                setComplianceItems(updatedItems);
                setSelectedItem({ ...selectedItem, status: 'compliant', lastChecked: new Date().toISOString() });
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading compliance data...</p>
                </div>
            </div>
        );
    }

    // If no supplier was found
    if (!supplier && supplierId) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/compliance" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                            <FiArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Supplier Compliance Verification</h1>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-2 text-lg font-medium text-gray-900">Supplier Not Found</h2>
                    <p className="mt-1 text-gray-500">
                        The supplier you're looking for does not exist or has been removed.
                    </p>
                    <div className="mt-4">
                        <Link href="/suppliers" className="btn-primary inline-flex items-center">
                            Browse Suppliers
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // If no supplier was selected
    if (!supplierId) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/compliance" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                            <FiArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Supplier Compliance Verification</h1>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Select a Supplier</h2>
                    <p className="text-gray-600 mb-4">
                        Please select a supplier to verify their compliance status with regulations and company policies.
                    </p>
                    <Link href="/suppliers" className="btn-primary inline-flex items-center">
                        Browse Suppliers
                    </Link>
                </div>
            </div>
        );
    }

    const overallStatus = getOverallComplianceStatus();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/compliance" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Supplier Compliance Verification</h1>
                </div>
                {verificationReport && (
                    <button className="btn-secondary flex items-center">
                        <FiDownload className="mr-2" />
                        Export Report
                    </button>
                )}
            </div>

            {/* Supplier Overview Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    <div>
                        <div className="flex items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-800 mr-3">{supplier.name}</h2>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(overallStatus)}`}>
                                {getStatusIcon(overallStatus)}
                                <span className="ml-1">
                                    {overallStatus === 'compliant' ? 'Compliant' :
                                        overallStatus === 'review' ? 'Under Review' :
                                            'Non-Compliant'}
                                </span>
                            </span>
                        </div>
                        <p className="text-gray-600 mb-2">{supplier.category} • {supplier.subcategory || 'General'}</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <Link href={`/suppliers/${supplier.id}`} className="text-blue-600 hover:underline flex items-center">
                                <FiExternalLink className="mr-1 h-4 w-4" />
                                View Supplier Profile
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full mr-3">
                                <FiFileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total Documents</p>
                                <p className="text-lg font-semibold">{complianceItems.length}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-full mr-3">
                                <FiCheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Compliant</p>
                                <p className="text-lg font-semibold">
                                    {complianceItems.filter(item => item.status === 'compliant').length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-full mr-3">
                                <FiAlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Non-Compliant</p>
                                <p className="text-lg font-semibold">
                                    {complianceItems.filter(item => item.status === 'non-compliant').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                        <FiShield className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                        <div>
                            <h4 className="font-medium text-gray-800 mb-1">Compliance Assessment</h4>
                            <p className="text-sm text-gray-600">
                                {overallStatus === 'compliant'
                                    ? 'This supplier meets all compliance requirements. Regular verification is recommended to maintain compliance status.'
                                    : overallStatus === 'review'
                                        ? 'This supplier has items that require review. Verify each document and follow up with the supplier as needed.'
                                        : 'This supplier has non-compliant items that require immediate attention. Contact the supplier to request updated documentation.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance Items and Verification Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compliance Items List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-md font-medium text-gray-800">Compliance Documents</h2>
                    </div>

                    <div className="p-2">
                        {complianceItems.length === 0 ? (
                            <div className="text-center p-6">
                                <FiFileText className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">No compliance documents found</p>
                                <Link href="/compliance/analyze" className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                                    <FiUpload className="mr-1 h-4 w-4" />
                                    Upload Documents
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {complianceItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-3 rounded-lg cursor-pointer ${selectedItem && selectedItem.id === item.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-gray-200'}`}
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        <div className="flex items-start">
                                            {getStatusIcon(item.status)}
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-800">{item.documentType}</p>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <span className="mr-2">Expires: {formatDate(item.expiryDate || 'N/A')}</span>
                                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                        {item.status === 'compliant' ? 'Compliant' :
                                                            item.status === 'review' ? 'Review' :
                                                                'Non-Compliant'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Verification Area */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
                    {!selectedItem ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <FiFileText className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Document to Verify</h3>
                            <p className="text-gray-500 max-w-md">
                                Choose a compliance document from the list to verify its authenticity and compliance status.
                            </p>
                        </div>
                    ) : (
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">Document Verification</h2>

                            <div className="border rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-md font-medium text-gray-800">{selectedItem.documentType}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedItem.status)}`}>
                                        {selectedItem.status === 'compliant' ? 'Compliant' :
                                            selectedItem.status === 'review' ? 'Under Review' :
                                                'Non-Compliant'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-medium">{selectedItem.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Expiry Date</p>
                                        <p className="font-medium">{formatDate(selectedItem.expiryDate || 'N/A')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Checked</p>
                                        <p className="font-medium">{formatDate(selectedItem.lastChecked)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Document ID</p>
                                        <p className="font-medium">DOC-{selectedItem.id.toString().padStart(4, '0')}</p>
                                    </div>
                                </div>

                                {selectedItem.notes && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-500">Notes</p>
                                        <p className="text-sm">{selectedItem.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Verification Actions */}
                            {!verificationStatus.completed ? (
                                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                                    <FiShield className="h-10 w-10 text-blue-500 mb-3" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">Verify Compliance Status</h3>
                                    <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
                                        Verify this document to confirm its authenticity, validity, and compliance with regulations and company policies.
                                    </p>
                                    <button
                                        onClick={handleVerify}
                                        disabled={verificationStatus.inProgress}
                                        className="btn-primary flex items-center"
                                    >
                                        {verificationStatus.inProgress ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheck className="mr-2" />
                                                Verify Document
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className={`p-6 rounded-lg ${verificationStatus.success ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <div className="flex items-center mb-4">
                                        {verificationStatus.success ? (
                                            <div className="p-2 bg-green-100 rounded-full mr-3">
                                                <FiCheckCircle className="h-6 w-6 text-green-600" />
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-red-100 rounded-full mr-3">
                                                <FiX className="h-6 w-6 text-red-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {verificationStatus.success ? 'Verification Successful' : 'Verification Failed'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {verificationStatus.success
                                                    ? 'This document has been verified and marked as compliant.'
                                                    : 'This document could not be verified. See details below.'}
                                            </p>
                                        </div>
                                    </div>

                                    {verificationReport && (
                                        <div className="mt-4 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Verification Date</p>
                                                    <p className="font-medium">{formatDate(verificationReport.date)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Method</p>
                                                    <p className="font-medium">{verificationReport.verificationMethod}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">Details</p>
                                                <p className="text-sm">{verificationReport.details}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">Next Steps</p>
                                                <p className="text-sm">{verificationReport.nextSteps}</p>
                                            </div>

                                            {verificationReport.warnings && verificationReport.warnings.length > 0 && (
                                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                    <div className="flex items-center">
                                                        <FiAlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                                                        <p className="text-sm font-medium text-yellow-800">Warnings</p>
                                                    </div>
                                                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                                                        {verificationReport.warnings.map((warning, index) => (
                                                            <li key={index}>{warning}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    onClick={() => handleSelectItem(selectedItem)}
                                                    className="btn-secondary flex items-center mr-3"
                                                >
                                                    <FiRefreshCw className="mr-2" />
                                                    Verify Again
                                                </button>
                                                <button className="btn-primary flex items-center">
                                                    <FiDownload className="mr-2" />
                                                    Download Report
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
const FiTrendingUp = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
    </svg>
);

const FiMessageSquare = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
    </svg>
);
