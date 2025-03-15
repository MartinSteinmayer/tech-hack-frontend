'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    FiArrowLeft,
    FiFileText,
    FiDownload,
    FiSearch,
    FiChevronRight,
    FiCheck,
    FiX,
    FiAlertCircle,
    FiInfo
} from 'react-icons/fi';
import { negotiationApi, supplierApi } from '../../../lib/api';

export default function DossierGeneratorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supplierId = searchParams.get('supplierId');

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [dossier, setDossier] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        supplierId: supplierId || '',
        objectives: [],
        products: [],
        targetSavings: '',
        negotiationContext: '',
        additionalNotes: ''
    });

    // Mock data for suppliers
    const mockSuppliers = [
        { id: 1, name: 'ElectroTech Industries', category: 'Electronics' },
        { id: 2, name: 'Global Packaging Solutions', category: 'Packaging' },
        { id: 3, name: 'RawMat Suppliers Inc', category: 'Raw Materials' },
        { id: 4, name: 'FastTrack Logistics', category: 'Logistics' },
        { id: 5, name: 'Quality Service Providers', category: 'Services' },
    ];

    // Mock data for specific supplier
    const mockSupplier = supplierId ? mockSuppliers.find(s => s.id === parseInt(supplierId)) || null : null;

    // Mock data for products by supplier
    const mockProductsBySupplier = {
        1: ['Microcontrollers', 'Sensors', 'PCB Assemblies'],
        2: ['Custom Boxes', 'Protective Packaging', 'Shipping Materials'],
        3: ['Industrial Polymers', 'Adhesives', 'Metals'],
        4: ['Express Shipping', 'Warehousing', 'Distribution'],
        5: ['Consulting Services', 'Quality Audits', 'Training'],
    };

    // Mock categories for objectives
    const mockCategories = [
        'Cost Reduction',
        'Quality Improvement',
        'Lead Time Reduction',
        'Contract Terms',
        'Payment Terms',
        'Volume Discounts',
        'Service Level Agreement',
        'Technology Access',
        'Exclusivity',
        'Sustainability'
    ];

    // Mock sample dossier
    const mockDossier = {
        supplierId: supplierId,
        supplierName: mockSupplier?.name || 'Unknown Supplier',
        generatedDate: new Date().toISOString(),
        sections: [
            {
                title: 'Executive Summary',
                content: `This dossier provides a comprehensive analysis of ${mockSupplier?.name || 'the supplier'} to support upcoming negotiations. The primary objectives are cost reduction, lead time improvement, and enhanced quality standards. Based on market analysis, we recommend targeting a ${formData.targetSavings || '5-8%'} cost reduction while securing improved delivery terms.`
            },
            {
                title: 'Supplier Background',
                content: `${mockSupplier?.name || 'The supplier'} is a ${mockSupplier?.category || 'major'} provider with a strong market presence. Recent financial performance shows stable growth with a healthy margin structure. The supplier has been in business for over 15 years and serves multiple industries including automotive, consumer electronics, and industrial manufacturing.`
            },
            {
                title: 'Market Analysis',
                content: `Current market conditions for ${mockSupplier?.category || 'this category'} show moderate competition with 4-5 major players. Raw material prices have decreased by 3% in the last quarter, suggesting potential for cost reductions. Industry benchmark pricing indicates that our current rates are approximately 7% above market average, representing a clear opportunity for negotiation.`
            },
            {
                title: 'Negotiation History',
                content: `Previous negotiations with ${mockSupplier?.name || 'this supplier'} resulted in a 5% cost reduction in 2022. The supplier has historically been resistant to contract term changes but flexible on payment terms. Last negotiation cycle took approximately 4 weeks to complete.`
            },
            {
                title: 'SWOT Analysis',
                content: `
Strengths:
- High quality products with low defect rates
- Reliable delivery performance (98% on-time)
- Technical expertise and support

Weaknesses:
- Higher pricing compared to market average
- Limited production capacity during peak seasons
- Inflexible on minimum order quantities

Opportunities:
- Consolidation of orders to achieve volume discounts
- Introduction of longer-term contracts for price stability
- Joint process improvement initiatives

Threats:
- Alternative suppliers entering the market
- Potential supply chain disruptions in Q4
- Increasing raw material costs in certain categories
        `
            },
            {
                title: 'Negotiation Strategy',
                content: `
Recommended approach:
1. Open with a target of ${formData.targetSavings ? parseInt(formData.targetSavings) + 3 : '10'}% cost reduction based on market benchmarks
2. Prioritize improved payment terms (Net 60 vs current Net 30)
3. Request volume-based tiered pricing structure
4. Be prepared to compromise on order scheduling flexibility

Key discussion points:
- Market pricing comparisons from alternative suppliers
- Recent quality improvements reducing our total cost of ownership
- Potential for increased order volumes in the coming year
- Streamlined ordering process reducing administrative costs
        `
            },
            {
                title: 'Risk Assessment',
                content: `
Low Risk Areas:
- Quality standards are well-established and consistently met
- Supplier financial stability is strong

Medium Risk Areas:
- Capacity constraints during peak seasons
- Potential resistance to significant price reductions

High Risk Areas:
- Limited alternative suppliers for specialized components
- Intellectual property protection in collaborative developments
        `
            },
            {
                title: 'Recommended Targets',
                content: `
Price: ${formData.targetSavings ? `${formData.targetSavings}% reduction` : '5-8% reduction'} from current levels
Payment Terms: Net 60 (from current Net 30)
Lead Time: Reduction of 1 week from current standards
Quality: Maintain current performance with enhanced reporting
Contract Duration: 24 months with quarterly pricing reviews
        `
            }
        ]
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, we would use the API client
                // if (supplierId) {
                //   const supplierResponse = await supplierApi.getById(supplierId);
                //   setSupplier(supplierResponse.data);
                // }
                // const categoriesResponse = await negotiationApi.getCategories();
                // setCategories(categoriesResponse.data);

                // For the hackathon, use mock data
                setTimeout(() => {
                    if (supplierId) {
                        const supplier = mockSuppliers.find(s => s.id === parseInt(supplierId));
                        setSupplier(supplier || null);

                        // Set products for this supplier
                        if (supplier) {
                            setFormData(prev => ({
                                ...prev,
                                products: mockProductsBySupplier[supplier.id] || []
                            }));
                        }
                    }
                    setCategories(mockCategories);
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [supplierId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name, value) => {
        setFormData(prev => {
            const currentValues = [...prev[name]];

            if (currentValues.includes(value)) {
                return {
                    ...prev,
                    [name]: currentValues.filter(v => v !== value)
                };
            } else {
                return {
                    ...prev,
                    [name]: [...currentValues, value]
                };
            }
        });
    };

    const handleSupplierChange = async (e) => {
        const newSupplierId = e.target.value;

        setFormData(prev => ({
            ...prev,
            supplierId: newSupplierId,
            products: [] // Reset products when supplier changes
        }));

        if (newSupplierId) {
            router.push(`/negotiations/dossier?supplierId=${newSupplierId}`);
        } else {
            router.push('/negotiations/dossier');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setGenerating(true);

            // In a real app, we would call the API
            // const response = await negotiationApi.generateDossier(formData);
            // setDossier(response.data);

            // For the hackathon, use mock data
            setTimeout(() => {
                setDossier(mockDossier);
                setGenerating(false);
            }, 1500);
        } catch (error) {
            console.error('Error generating dossier:', error);
            setGenerating(false);
        }
    };

    const downloadDossier = () => {
        // In a real app, this would download a PDF
        alert('Download functionality would be implemented in the final application');
    };

    // If we've generated a dossier, show it
    if (dossier) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={() => setDossier(null)}
                            className="p-2 rounded-full hover:bg-gray-100 mr-2"
                        >
                            <FiArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Negotiation Dossier: {dossier.supplierName}
                        </h1>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={downloadDossier}
                            className="btn-primary flex items-center"
                        >
                            <FiDownload className="mr-2" />
                            Download PDF
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {dossier.supplierName} - Negotiation Analysis
                            </h2>
                            <p className="text-sm text-gray-600">
                                Generated on {new Date(dossier.generatedDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <FiInfo className="h-4 w-4 mr-1" />
                            AI-generated content. Review for accuracy.
                        </div>
                    </div>

                    <div className="space-y-8">
                        {dossier.sections.map((section, index) => (
                            <div key={index} className={index > 0 ? "pt-6 border-t border-gray-200" : ""}>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    {section.title}
                                </h3>
                                <div className="text-gray-700 whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Next Steps
                            </h3>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link
                                href={`/negotiations/strategies?supplierId=${dossier.supplierId}`}
                                className="border rounded-lg p-4 hover:bg-blue-50 transition-colors flex items-center"
                            >
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-3">
                                    <FiTrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Pricing Strategies</h4>
                                    <p className="text-sm text-gray-600">Get detailed pricing recommendations</p>
                                </div>
                                <FiChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                            </Link>

                            <Link
                                href={`/negotiations/messages?supplierId=${dossier.supplierId}`}
                                className="border rounded-lg p-4 hover:bg-blue-50 transition-colors flex items-center"
                            >
                                <div className="bg-green-100 text-green-600 p-3 rounded-full mr-3">
                                    <FiMessageSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Draft Message</h4>
                                    <p className="text-sm text-gray-600">Create a negotiation message</p>
                                </div>
                                <FiChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                            </Link>

                            <Link
                                href={`/negotiations?supplierId=${dossier.supplierId}`}
                                className="border rounded-lg p-4 hover:bg-blue-50 transition-colors flex items-center"
                            >
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-3">
                                    <FiFileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Start Negotiation</h4>
                                    <p className="text-sm text-gray-600">Create a negotiation session</p>
                                </div>
                                <FiChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                            </Link>
                        </div>
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
                    <h1 className="text-2xl font-bold text-gray-800">
                        Generate Negotiation Dossier
                    </h1>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Negotiation Dossier Generator
                        </h2>
                        <p className="text-gray-600">
                            Create a comprehensive analysis of a supplier to prepare for negotiations.
                            The AI will generate key insights, competitive analysis, and recommended strategies.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Supplier Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Supplier
                                </label>
                                <div className="relative">
                                    <select
                                        name="supplierId"
                                        value={formData.supplierId}
                                        onChange={handleSupplierChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Select a Supplier --</option>
                                        {mockSuppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name} ({supplier.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Products */}
                            {formData.supplierId && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Products/Services
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        {mockProductsBySupplier[formData.supplierId]?.map((product, index) => (
                                            <div key={index} className="flex items-center">
                                                <input
                                                    id={`product-${index}`}
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    checked={formData.products.includes(product)}
                                                    onChange={() => handleCheckboxChange('products', product)}
                                                />
                                                <label htmlFor={`product-${index}`} className="ml-2 text-sm text-gray-700">
                                                    {product}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Negotiation Objectives */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Negotiation Objectives
                                </label>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {categories.map((category, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                id={`objective-${index}`}
                                                type="checkbox"
                                                className="form-checkbox"
                                                checked={formData.objectives.includes(category)}
                                                onChange={() => handleCheckboxChange('objectives', category)}
                                            />
                                            <label htmlFor={`objective-${index}`} className="ml-2 text-sm text-gray-700">
                                                {category}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Target Savings */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Savings (%)
                                </label>
                                <input
                                    type="number"
                                    name="targetSavings"
                                    value={formData.targetSavings}
                                    onChange={handleChange}
                                    placeholder="e.g., 5"
                                    className="form-input"
                                    min="0"
                                    max="100"
                                />
                            </div>

                            {/* Negotiation Context */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Negotiation Context
                                </label>
                                <select
                                    name="negotiationContext"
                                    value={formData.negotiationContext}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">-- Select Context --</option>
                                    <option value="new">New Relationship</option>
                                    <option value="renewal">Contract Renewal</option>
                                    <option value="expansion">Expanding Relationship</option>
                                    <option value="issue">Addressing Issues</option>
                                    <option value="cost">Cost Reduction Initiative</option>
                                </select>
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Notes
                                </label>
                                <textarea
                                    name="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={handleChange}
                                    rows={4}
                                    className="form-input"
                                    placeholder="Enter any specific information or requirements..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="btn-primary w-full flex items-center justify-center"
                                    disabled={generating || !formData.supplierId}
                                >
                                    {generating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Generating Dossier...
                                        </>
                                    ) : (
                                        <>
                                            <FiFileText className="mr-2" />
                                            Generate Dossier
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
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
