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
import { mockSuppliers } from '@/lib/mockData';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";

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

    // Get simplified supplier from mockData.js for dropdown
    const getSimplifiedSuppliers = () => {
        return mockSuppliers.map(supplier => ({
            id: supplier.id,
            name: supplier.name,
            category: supplier.category
        }));
    };

    // Helper to get products from mockData.js by supplier ID
    const getProductsBySupplier = (supplierId) => {
        const supplier = mockSuppliers.find(s => s.id === parseInt(supplierId));
        return supplier && supplier.products ? supplier.products.map(p => p.name) : [];
    };

    // Mock categories for objectives (not in mockData.js)
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

    // Get supplier details from mockData.js
    const getSupplierById = (id) => {
        return mockSuppliers.find(s => s.id === parseInt(id)) || null;
    };

    // Generate dossier based on selected supplier
    const generateMockDossier = (formData) => {
        const supplierData = getSupplierById(formData.supplierId);

        if (!supplierData) return null;

        return {
            supplierId: formData.supplierId,
            supplierName: supplierData.name,
            generatedDate: new Date().toISOString(),
            sections: [
                {
                    title: 'Executive Summary',
                    content: `This dossier provides a comprehensive analysis of ${supplierData.name} to support upcoming negotiations. The primary objectives are ${formData.objectives.slice(0, 3).join(', ') || 'cost reduction, lead time improvement, and enhanced quality standards'}. Based on market analysis, we recommend targeting a ${formData.targetSavings || '5-8%'} cost reduction while securing improved delivery terms.`
                },
                {
                    title: 'Supplier Background',
                    content: `${supplierData.name} is a ${supplierData.category} provider with a strong market presence. Founded in ${supplierData.foundedYear}, the company is based in ${supplierData.location} and has ${supplierData.employees} employees. ${supplierData.description}`
                },
                {
                    title: 'Market Analysis',
                    content: `Current market conditions for ${supplierData.category} show moderate competition with 4-5 major players. Raw material prices have decreased by 3% in the last quarter, suggesting potential for cost reductions. Industry benchmark pricing indicates that our current rates are approximately 7% above market average, representing a clear opportunity for negotiation.`
                },
                {
                    title: 'Negotiation History',
                    content: `Previous negotiations with ${supplierData.name} resulted in ${supplierData.negotiationHistory ? 'the following outcomes: ' + supplierData.negotiationHistory.map(h => `${h.date}: ${h.outcome} with ${h.savings}% savings`).join(', ') : 'limited success in past years'}. The supplier has historically been resistant to contract term changes but flexible on payment terms. Current payment terms are ${supplierData.paymentTerms}.`
                },
                {
                    title: 'SWOT Analysis',
                    content: `
Strengths:
- ${supplierData.qualityScore > 90 ? 'High quality products with low defect rates' : 'Acceptable quality standards'}
- ${supplierData.reliabilityScore > 85 ? 'Reliable delivery performance' : 'Moderate delivery reliability'} (${supplierData.reliabilityScore}%)
- ${supplierData.communicationScore > 85 ? 'Excellent communication' : 'Adequate communication channels'}

Weaknesses:
- ${supplierData.category === 'Premium' ? 'Higher pricing compared to market average' : 'Standard market pricing'}
- Limited production capacity during peak seasons
- ${supplierData.riskFactors ? supplierData.riskFactors.find(r => r.level === 'medium')?.description || 'Some flexibility constraints' : 'Inflexible on minimum order quantities'}

Opportunities:
- Consolidation of orders to achieve volume discounts
- Introduction of longer-term contracts for price stability
- Joint process improvement initiatives

Threats:
- Alternative suppliers entering the market
- Potential supply chain disruptions in Q4
- ${supplierData.riskFactors ? supplierData.riskFactors.find(r => r.level === 'high')?.description || 'Increasing raw material costs' : 'Increasing raw material costs in certain categories'}
        `
                },
                {
                    title: 'Negotiation Strategy',
                    content: `
Recommended approach:
1. Open with a target of ${formData.targetSavings ? parseInt(formData.targetSavings) + 3 : '10'}% cost reduction based on market benchmarks
2. Prioritize improved payment terms (Net 60 vs current ${supplierData.paymentTerms || 'Net 30'})
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
- ${supplierData.qualityScore > 85 ? 'Quality standards are well-established and consistently met' : 'Quality improvements have been noted recently'}
- ${supplierData.riskFactors && supplierData.riskFactors.filter(r => r.level === 'low').length > 0 ? 'Low risk identified in: ' + supplierData.riskFactors.filter(r => r.level === 'low').map(r => r.category).join(', ') : 'Supplier financial stability is strong'}

Medium Risk Areas:
- ${supplierData.riskFactors && supplierData.riskFactors.filter(r => r.level === 'medium').length > 0 ? 'Medium risk identified in: ' + supplierData.riskFactors.filter(r => r.level === 'medium').map(r => r.category).join(', ') : 'Capacity constraints during peak seasons'}
- Potential resistance to significant price reductions

High Risk Areas:
- ${supplierData.riskFactors && supplierData.riskFactors.filter(r => r.level === 'high').length > 0 ? 'High risk identified in: ' + supplierData.riskFactors.filter(r => r.level === 'high').map(r => r.category).join(', ') : 'Limited alternative suppliers for specialized components'}
- Intellectual property protection in collaborative developments
        `
                },
                {
                    title: 'Recommended Targets',
                    content: `
Price: ${formData.targetSavings ? `${formData.targetSavings}% reduction` : '5-8% reduction'} from current levels
Payment Terms: Net 60 (from current ${supplierData.paymentTerms || 'Net 30'})
Lead Time: Reduction of 1 week from current standards
Quality: Maintain current performance with enhanced reporting
Contract Duration: 24 months with quarterly pricing reviews
        `
                }
            ]
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setTimeout(() => {
                    if (supplierId) {
                        const supplierData = getSupplierById(parseInt(supplierId));
                        setSupplier(supplierData);

                        // Set products for this supplier
                        if (supplierData) {
                            setFormData(prev => ({
                                ...prev,
                                products: getProductsBySupplier(supplierData.id) || []
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

            // For the hackathon, use mock data
            setTimeout(() => {
                const generatedDossier = generateMockDossier(formData);
                setDossier(generatedDossier);
                setGenerating(false);
            }, 1500);
        } catch (error) {
            console.error('Error generating dossier:', error);
            setGenerating(false);
        }
    };

    const downloadDossier = () => {
        // Create a new PDF document
        const doc = new jsPDF();

        // Set initial position
        let yPos = 20;
        const leftMargin = 20;
        const pageWidth = doc.internal.pageSize.width;

        // Add company logo placeholder (optional)
        // doc.addImage(logoDataUrl, 'PNG', leftMargin, yPos, 40, 15);

        // Add title
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 51, 102); // Dark blue
        doc.text(`Negotiation Dossier`, leftMargin, yPos);
        yPos += 10;

        // Add supplier name
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text(dossier.supplierName, leftMargin, yPos);
        yPos += 10;

        // Add generated date and disclaimer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100); // Gray
        doc.text(`Generated on ${new Date(dossier.generatedDate).toLocaleDateString()}`, leftMargin, yPos);
        doc.text('AI-generated content. Review for accuracy.', pageWidth - 90, yPos);
        yPos += 15;

        // Add horizontal line
        doc.setDrawColor(200, 200, 200); // Light gray
        doc.setLineWidth(0.5);
        doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
        yPos += 10;

        // Process each section
        for (const section of dossier.sections) {
            // Check if we need a new page
            if (yPos > 260) {
                doc.addPage();
                yPos = 20;
            }

            // Add section title
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 102, 204); // Blue
            doc.text(section.title, leftMargin, yPos);
            yPos += 8;

            // Add section content
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0); // Black

            // Special formatting for SWOT Analysis
            if (section.title === 'SWOT Analysis') {
                // Parse the SWOT content - assuming the format is consistent
                const swotContent = section.content.trim();
                const swotSections = swotContent.split(/\n(?=Strengths:|Weaknesses:|Opportunities:|Threats:)/g);

                for (const swotSection of swotSections) {
                    if (swotSection.trim() === '') continue;

                    // Check if we need a new page
                    if (yPos > 240) {
                        doc.addPage();
                        yPos = 20;
                    }

                    const lines = swotSection.split('\n');
                    const title = lines[0];

                    // Add SWOT category title
                    doc.setFont('helvetica', 'bold');
                    doc.text(title, leftMargin, yPos);
                    yPos += 6;

                    // Add bullet points
                    doc.setFont('helvetica', 'normal');
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (line === '' || !line.startsWith('-')) continue;

                        // Format bullet point
                        const bulletText = line.substring(1).trim();
                        const formattedText = doc.splitTextToSize(bulletText, pageWidth - 50);

                        // Check if we need a new page
                        if (yPos > 270) {
                            doc.addPage();
                            yPos = 20;
                        }

                        // Add bullet and text
                        doc.text('•', leftMargin, yPos);
                        doc.text(formattedText, leftMargin + 5, yPos);
                        yPos += 6 * formattedText.length;
                    }

                    yPos += 5; // Extra space between SWOT categories
                }
            }
            // Special formatting for Negotiation Strategy
            else if (section.title === 'Negotiation Strategy' ||
                section.title === 'Risk Assessment' ||
                section.title === 'Recommended Targets') {
                const lines = section.content.split('\n');
                let isInList = false;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line === '') continue;

                    // Check if we need a new page
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = 20;
                    }

                    // Handle bullet points or numbered lists
                    if (line.match(/^\d+\.\s/) || line.startsWith('-')) {
                        isInList = true;
                        const textIndent = line.match(/^\d+\.\s/) ? 8 : 5;
                        const bulletText = line.match(/^\d+\.\s/) ?
                            line : line.substring(1).trim();

                        const formattedText = doc.splitTextToSize(bulletText, pageWidth - 50);
                        doc.text(formattedText, leftMargin + textIndent, yPos);
                        yPos += 6 * formattedText.length;
                    }
                    // Handle category/subheadings
                    else if (line.endsWith(':')) {
                        isInList = false;
                        yPos += 3; // Add extra space before subheading
                        doc.setFont('helvetica', 'bold');
                        doc.text(line, leftMargin, yPos);
                        doc.setFont('helvetica', 'normal');
                        yPos += 6;
                    }
                    // Regular paragraph text
                    else {
                        isInList = false;
                        const formattedText = doc.splitTextToSize(line, pageWidth - 40);
                        doc.text(formattedText, leftMargin, yPos);
                        yPos += 6 * formattedText.length;
                    }
                }
            }
            // Regular text section
            else {
                const textLines = doc.splitTextToSize(section.content, pageWidth - 40);
                doc.text(textLines, leftMargin, yPos);
                yPos += 6 * textLines.length;
            }

            // Add spacing between sections
            yPos += 10;

            // Add section divider
            if (section !== dossier.sections[dossier.sections.length - 1]) {
                doc.setDrawColor(230, 230, 230);
                doc.setLineWidth(0.3);
                doc.line(leftMargin, yPos - 5, pageWidth - leftMargin, yPos - 5);
            }
        }

        // Add footer with page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${pageCount} | ${dossier.supplierName} Negotiation Dossier`,
                pageWidth / 2, 290, { align: 'center' });
        }

        // Save the PDF
        const filename = `${dossier.supplierName.replace(/\s+/g, '_')}_Negotiation_Dossier.pdf`;
        doc.save(filename);
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
                                        className="form-select cursor-pointer"
                                        required
                                    >
                                        <option value="">-- Select a Supplier --</option>
                                        {getSimplifiedSuppliers().map(supplier => (
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
                                        {getProductsBySupplier(formData.supplierId).map((product, index) => (
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
                                    className="form-select cursor-pointer"
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
