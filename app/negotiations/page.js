'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
    FiMessageSquare,
    FiTrendingUp,
    FiFileText,
    FiRefreshCw,
    FiChevronRight,
    FiBriefcase,
    FiClock,
    FiDollarSign,
    FiBarChart2
} from 'react-icons/fi';
import { negotiationApi, supplierApi } from '@/lib/api';
import { mockNegotiations, getSupplierById } from '@/lib/mockData';

// Main container component that doesn't use useSearchParams
export default function NegotiationsPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <NegotiationsContent />
        </Suspense>
    );
}

// Loading fallback component
function LoadingState() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Negotiation Companion
                </h1>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading negotiations...</p>
            </div>
        </div>
    );
}

// Content component that safely uses useSearchParams inside Suspense
function NegotiationsContent() {
    // Import useSearchParams inside the component
    const { useSearchParams } = require('next/navigation');
    const searchParams = useSearchParams();
    const supplierId = searchParams.get('supplierId');

    const [activeNegotiations, setActiveNegotiations] = useState([]);
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // For the hackathon, use mock data
                setTimeout(() => {
                    if (supplierId) {
                        // Use the getSupplierById helper function from mockData.js
                        const supplierData = getSupplierById(supplierId);

                        if (supplierData) {
                            // If we found the supplier, use its data
                            setSupplier({
                                id: supplierData.id,
                                name: supplierData.name,
                                category: supplierData.category,
                                products: supplierData.products.map(p => p.name),
                                lastNegotiation: supplierData.negotiationHistory?.[0]?.date || new Date().toISOString(),
                                averageDiscount: supplierData.averageDiscount,
                                currentPricing: supplierData.currentPricing,
                                reliability: supplierData.reliabilityScore,
                                communicationScore: supplierData.communicationScore,
                                preferredCommunication: 'Email',
                                paymentTerms: supplierData.paymentTerms,
                                contractExpiry: supplierData.contractExpiry,
                                negotiationHistory: supplierData.negotiationHistory || []
                            });

                            setActiveNegotiations(mockNegotiations.filter(n => n.supplierId === parseInt(supplierId)));
                        } else {
                            // If supplier not found, show empty state
                            setActiveNegotiations([]);
                        }
                    } else {
                        setActiveNegotiations(mockNegotiations);
                    }
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [supplierId]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    {supplier ? `Negotiations with ${supplier.name}` : 'Negotiation Companion'}
                </h1>
                <div className="flex space-x-3">
                    <Link href="/suppliers" className="btn-secondary flex items-center">
                        {supplier ? 'Change Supplier' : 'Select Supplier'}
                    </Link>
                </div>
            </div>

            {/* Module Overview */}
            {!supplier && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Negotiation Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/negotiations/dossier" className="border rounded-lg p-5 hover:bg-blue-50 transition-colors">
                            <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <FiFileText className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-md font-medium text-gray-800">Negotiation Dossier</h3>
                                    <p className="text-sm text-gray-500">Create a comprehensive supplier analysis to prepare for a negotiation.</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/negotiations/strategies" className="border rounded-lg p-5 hover:bg-blue-50 transition-colors">
                            <div className="flex items-center">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                    <FiTrendingUp className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-md font-medium text-gray-800">Pricing Strategies</h3>
                                    <p className="text-sm text-gray-500">Get AI-powered pricing recommendations.</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/negotiations/messages" className="border rounded-lg p-5 hover:bg-blue-50 transition-colors">
                            <div className="flex items-center">
                                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                    <FiMessageSquare className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-md font-medium text-gray-800">Message Composer</h3>
                                    <p className="text-sm text-gray-500">Draft effective supplier communications with AI assistance.</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {/* Supplier Negotiation Profile */}
            {supplier && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Supplier Negotiation Profile</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium">{supplier.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Negotiation</p>
                                    <p className="font-medium">{new Date(supplier.lastNegotiation).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Avg. Discount</p>
                                    <p className="font-medium">{supplier.averageDiscount}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Current Pricing</p>
                                    <p className="font-medium">{supplier.currentPricing}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Reliability</p>
                                    <p className="font-medium">{supplier.reliability}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Communication</p>
                                    <p className="font-medium">{supplier.communicationScore}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Terms</p>
                                    <p className="font-medium">{supplier.paymentTerms}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Contract Expiry</p>
                                    <p className="font-medium">{new Date(supplier.contractExpiry).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-sm text-gray-500 mb-2">Products</p>
                                <div className="flex flex-wrap gap-2">
                                    {supplier.products.map((product, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                                        >
                                            {product}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="text-md font-medium text-gray-800 mb-3">Negotiation History</h3>
                            {supplier.negotiationHistory.map((history, index) => (
                                <div key={index} className={`py-2 ${index < supplier.negotiationHistory.length - 1 ? 'border-b' : ''}`}>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm">{new Date(history.date).toLocaleDateString()}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${history.outcome === 'Success'
                                            ? 'bg-green-100 text-green-800'
                                            : history.outcome === 'Partial'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {history.outcome}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">Savings achieved: {history.savings}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Rest of the component remains the same */}
            {/* Active Negotiations */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">
                        {supplier ? 'Current Negotiations' : 'Active Negotiations'}
                    </h2>
                    <button className="text-sm text-gray-600 flex items-center hover:text-gray-900">
                        <FiRefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading negotiations...</p>
                    </div>
                ) : activeNegotiations.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <FiMessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No active negotiations</h3>
                        <p className="mt-1 text-gray-500">
                            {supplier
                                ? `Start a new negotiation with ${supplier.name}`
                                : 'Select a supplier to start a negotiation'}
                        </p>
                        <div className="mt-4">
                            {supplier ? (
                                <Link
                                    href={`/negotiations/dossier?supplierId=${supplierId}`}
                                    className="btn-primary inline-flex items-center"
                                >
                                    <FiFileText className="mr-2" />
                                    Generate Dossier
                                </Link>
                            ) : (
                                <Link
                                    href="/suppliers"
                                    className="btn-primary inline-flex items-center"
                                >
                                    Select Supplier
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {activeNegotiations.map((negotiation) => (
                            <div key={negotiation.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div className="flex items-start">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${negotiation.priority === 'high'
                                            ? 'bg-red-100 text-red-600'
                                            : negotiation.priority === 'medium'
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-green-100 text-green-600'
                                            }`}>
                                            <FiBriefcase className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex items-center">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {negotiation.supplierName}
                                                </h3>
                                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${negotiation.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : negotiation.status === 'scheduled'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {negotiation.category} • Started {new Date(negotiation.startDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center">
                                        <div className="text-sm text-gray-500 mr-4">
                                            <span className="font-medium">
                                                {negotiation.currentStage}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/suppliers/${negotiation.supplierId}`}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            View Details
                                            <FiChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 text-gray-400">
                                            <FiClock className="h-5 w-5" />
                                        </div>
                                        <div className="ml-2">
                                            <p className="text-xs text-gray-500">Next Action</p>
                                            <p className="text-sm">{negotiation.nextAction}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 text-gray-400">
                                            <FiDollarSign className="h-5 w-5" />
                                        </div>
                                        <div className="ml-2">
                                            <p className="text-xs text-gray-500">Target Savings</p>
                                            <p className="text-sm">{negotiation.targetSavings}%</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 text-gray-400">
                                            <FiBarChart2 className="h-5 w-5" />
                                        </div>
                                        <div className="ml-2">
                                            <p className="text-xs text-gray-500">Products</p>
                                            <p className="text-sm">{negotiation.products.join(', ')}</p>
                                        </div>
                                    </div>
                                </div>

                                {negotiation.status === 'completed' && (
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex items-center">
                                            <div className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${negotiation.outcome === 'Success'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {negotiation.outcome}
                                            </div>
                                            <p className="text-sm">
                                                Achieved savings of <span className="font-medium">{negotiation.actualSavings}%</span>
                                                {negotiation.targetSavings < negotiation.actualSavings && (
                                                    <span className="text-green-600"> (exceeded target by {(negotiation.actualSavings - negotiation.targetSavings).toFixed(1)}%)</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href={supplierId ? `/negotiations/dossier?supplierId=${supplierId}` : "/negotiations/dossier"}
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Generate Dossier</h3>
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                            <FiFileText className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Create a comprehensive analysis of a supplier to prepare for negotiations.
                    </p>
                </Link>

                <Link
                    href={supplierId ? `/negotiations/strategies?supplierId=${supplierId}` : "/negotiations/strategies"}
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Pricing Strategies</h3>
                        <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                            <FiTrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Get AI-powered pricing recommendations and negotiation strategies.
                    </p>
                </Link>

                <Link
                    href={supplierId ? `/negotiations/messages?supplierId=${supplierId}` : "/negotiations/messages"}
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Message Composer</h3>
                        <div className="bg-green-100 text-green-600 p-2 rounded-full">
                            <FiMessageSquare className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Draft effective supplier communications with AI assistance.
                    </p>
                </Link>
            </div>
        </div>
    );
}
