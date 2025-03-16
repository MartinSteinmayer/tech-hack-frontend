'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiSearch,
    FiTrendingUp,
    FiDollarSign,
    FiTarget,
    FiShield,
    FiBarChart2,
    FiThumbsUp,
    FiChevronRight,
    FiChevronDown,
    FiChevronUp,
    FiDownload,
    FiMessageSquare,
    FiFileText
} from 'react-icons/fi';
import { mockSuppliers, getSupplierById } from '@/lib/mockData';

// Main component that doesn't directly use useSearchParams
export default function StrategiesPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <StrategiesContent />
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
                    <h1 className="text-2xl font-bold text-gray-800">Pricing Strategies</h1>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading pricing strategies...</p>
            </div>
        </div>
    );
}

// Content component that safely uses useSearchParams inside a Suspense boundary
function StrategiesContent() {
    // Import useSearchParams inside this component
    const { useSearchParams } = require('next/navigation');
    const searchParams = useSearchParams();
    const supplierId = searchParams.get('supplierId');

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [strategies, setStrategies] = useState([]);
    const [fetchingStrategies, setFetchingStrategies] = useState(false);
    const [expandedStrategy, setExpandedStrategy] = useState(null);
    const [formData, setFormData] = useState({
        productCategory: '',
        description: '',
    });

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                setLoading(true);

                if (supplierId) {
                    // Get supplier details from mock data
                    const supplierData = getSupplierById(parseInt(supplierId));
                    if (supplierData) {
                        setSupplier(supplierData);
                        // If they have products, set the first category as default
                        if (supplierData.products && supplierData.products.length > 0) {
                            setFormData(prev => ({
                                ...prev,
                                productCategory: supplierData.products[0].category
                            }));
                        }
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching supplier data:', error);
                setLoading(false);
            }
        };

        fetchSupplier();
    }, [supplierId]);

    // Function to fetch strategies based on supplier and product info
    const fetchStrategies = async () => {
        if (!supplier) return;

        try {
            setFetchingStrategies(true);

            // Construct query parameters
            const params = new URLSearchParams({
                supplier: supplier.name,
                category: formData.productCategory,
                description: formData.description
            });

            // Fetch strategies from API
            const response = await fetch(`https://tech-hack-api.vercel.app/api/negotiations/strategies?${params.toString()}`);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to fetch strategies: ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json();

            // Process the response data
            if (typeof data === 'string') {
                try {
                    // If data is a JSON string, parse it
                    const parsedData = JSON.parse(data);
                    // Handle both array and object with strategies property
                    setStrategies(Array.isArray(parsedData) ? parsedData : (parsedData.strategies || []));
                } catch (parseError) {
                    console.error('Error parsing strategies:', parseError);
                    setStrategies([]);
                }
            } else {
                // If data is already a JSON object or array
                setStrategies(Array.isArray(data) ? data : (data.strategies || []));
            }

            setFetchingStrategies(false);
        } catch (error) {
            console.error('Error fetching strategies:', error);
            setFetchingStrategies(false);

            // Set default mock strategies as fallback
            setStrategies([
                {
                    name: "Volume Discount",
                    description: "Negotiate price reductions based on purchase volume",
                    suggested_approach: "Propose 5-10% discount for orders over $10,000",
                    expected_savings: "5-10%",
                    confidence: "Medium"
                },
                {
                    name: "Early Payment Terms",
                    description: "Offer faster payment for price reduction",
                    suggested_approach: "Propose 2-3% discount for payment within 10 days",
                    expected_savings: "2-3%",
                    confidence: "High"
                },
                {
                    name: "Long-term Contract",
                    description: "Secure better pricing with multi-year commitment",
                    suggested_approach: "Propose 7-12% discount for 2-year supply agreement",
                    expected_savings: "7-12%",
                    confidence: "Medium"
                }
            ]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStrategies();
    };

    const toggleStrategyExpansion = (index) => {
        if (expandedStrategy === index) {
            setExpandedStrategy(null);
        } else {
            setExpandedStrategy(index);
        }
    };

    // Function to get confidence badge color
    const getConfidenceBadge = (confidence) => {
        switch (confidence.toLowerCase()) {
            case 'high':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading supplier details...</p>
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
                        <Link href="/negotiations" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                            <FiArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Pricing Strategies</h1>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
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
                        <Link href="/negotiations" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                            <FiArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Pricing Strategies</h1>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Select a Supplier</h2>
                    <p className="text-gray-600 mb-4">
                        Please select a supplier to generate AI-powered pricing strategies for negotiation.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {mockSuppliers.map((supplier) => (
                            <Link
                                key={supplier.id}
                                href={`/negotiations/strategies?supplierId=${supplier.id}`}
                                className="border rounded-lg p-4 hover:bg-blue-50 transition-colors"
                            >
                                <div className="flex items-start">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-lg font-bold mr-3">
                                        {supplier.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{supplier.name}</h3>
                                        <p className="text-sm text-gray-600">{supplier.category}</p>
                                        <div className="mt-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${supplier.complianceStatus === 'compliant' ? 'bg-green-100 text-green-800' :
                                                supplier.complianceStatus === 'review' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {supplier.complianceStatus === 'compliant' ? 'Compliant' :
                                                    supplier.complianceStatus === 'review' ? 'Under Review' :
                                                        'Non-Compliant'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/negotiations" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Pricing Strategies</h1>
                </div>
                {strategies.length > 0 && (
                    <div className="flex space-x-3">
                        <button className="btn-secondary flex items-center">
                            <FiDownload className="mr-2" />
                            Export Strategies
                        </button>
                    </div>
                )}
            </div>

            {/* Supplier Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    <div>
                        <div className="flex items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-800 mr-3">{supplier.name}</h2>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.complianceStatus === 'compliant' ? 'bg-green-100 text-green-800' :
                                supplier.complianceStatus === 'review' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {supplier.complianceStatus === 'compliant' ? 'Compliant' :
                                    supplier.complianceStatus === 'review' ? 'Under Review' :
                                        'Non-Compliant'}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-2">{supplier.category} • {supplier.subcategory || 'General'}</p>
                        <div className="flex items-center text-sm text-gray-600">
                            <Link href={`/suppliers/${supplier.id}`} className="text-blue-600 hover:underline flex items-center">
                                <FiSearch className="mr-1 h-4 w-4" />
                                View Supplier Profile
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full mr-3">
                                <FiDollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Average Discount</p>
                                <p className="text-lg font-semibold">{supplier.averageDiscount}%</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-full mr-3">
                                <FiBarChart2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Reliability Score</p>
                                <p className="text-lg font-semibold">{supplier.reliabilityScore}%</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-full mr-3">
                                <FiShield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Contract Expiry</p>
                                <p className="text-lg font-semibold">{new Date(supplier.contractExpiry).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strategy Input Form */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-md font-medium text-gray-800 mb-4">Generate Pricing Strategies</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Category
                                </label>
                                <select
                                    name="productCategory"
                                    value={formData.productCategory}
                                    onChange={handleInputChange}
                                    className="form-select cursor-pointer"
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    {supplier.products && supplier.products.map((product, index) => (
                                        <option key={index} value={product.category}>
                                            {product.category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Additional context about your negotiation goals"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="btn-primary flex items-center"
                                disabled={fetchingStrategies || !formData.productCategory}
                            >
                                {fetchingStrategies ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Generating Strategies...
                                    </>
                                ) : (
                                    <>
                                        <FiTrendingUp className="mr-2" />
                                        Generate Strategies
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Strategies Display */}
            {strategies.length > 0 && (
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Recommended Strategies</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            AI-powered pricing strategies based on supplier data and market analysis.
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {strategies.map((strategy, index) => (
                            <div key={index} className="p-6">
                                <div
                                    className="flex justify-between items-start cursor-pointer"
                                    onClick={() => toggleStrategyExpansion(index)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-full mr-3 ${index % 3 === 0 ? 'bg-blue-100 text-blue-600' :
                                                index % 3 === 1 ? 'bg-green-100 text-green-600' :
                                                    'bg-purple-100 text-purple-600'
                                                }`}>
                                                {index % 3 === 0 ? (
                                                    <FiTarget className="h-5 w-5" />
                                                ) : index % 3 === 1 ? (
                                                    <FiDollarSign className="h-5 w-5" />
                                                ) : (
                                                    <FiBarChart2 className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-800">{strategy.name}</h3>
                                                <p className="text-sm text-gray-600">{strategy.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceBadge(strategy.confidence)}`}>
                                            <FiThumbsUp className="mr-1 h-3 w-3" />
                                            {strategy.confidence} Confidence
                                        </span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            {expandedStrategy === index ? (
                                                <FiChevronUp className="h-5 w-5" />
                                            ) : (
                                                <FiChevronDown className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {expandedStrategy === index && (
                                    <div className="mt-4 pl-14">
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700">Suggested Approach</h4>
                                                <p className="text-sm">{strategy.suggested_approach}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700">Expected Savings</h4>
                                                <p className="text-sm font-semibold text-green-600">{strategy.expected_savings}</p>
                                            </div>

                                            <div className="pt-3 border-t border-gray-200 flex justify-end">
                                                <Link
                                                    href={`/negotiations/messages?supplierId=${supplier.id}&strategy=${encodeURIComponent(strategy.name)}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                                                >
                                                    <FiMessageSquare className="mr-1 h-4 w-4" />
                                                    Draft Message with this Strategy
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Next Steps */}
            {strategies.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Next Steps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href={`/negotiations/dossier?supplierId=${supplier.id}`}
                            className="border rounded-lg p-4 hover:bg-blue-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-3">
                                    <FiFileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Generate Dossier</h4>
                                    <p className="text-sm text-gray-600">Create a comprehensive supplier analysis</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={`/negotiations/messages?supplierId=${supplier.id}`}
                            className="border rounded-lg p-4 hover:bg-blue-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="bg-green-100 text-green-600 p-3 rounded-full mr-3">
                                    <FiMessageSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Draft Message</h4>
                                    <p className="text-sm text-gray-600">Compose a negotiation message</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={`/negotiations?supplierId=${supplier.id}`}
                            className="border rounded-lg p-4 hover:bg-blue-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-3">
                                    <FiTrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Start Negotiation</h4>
                                    <p className="text-sm text-gray-600">Begin a negotiation session</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
