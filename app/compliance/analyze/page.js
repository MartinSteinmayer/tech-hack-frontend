'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiUpload,
    FiFileText,
    FiCheckCircle,
    FiAlertCircle,
    FiClock,
    FiX,
    FiSearch,
    FiDownload,
    FiExternalLink,
    FiInfo
} from 'react-icons/fi';
import { complianceApi } from '@/lib/api';

export default function DocumentAnalysisPage() {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);

    // Mock analysis results for the hackathon
    const mockResults = {
        documentName: 'supplier_agreement_revision2.pdf',
        documentType: 'Supplier Agreement',
        status: 'review',
        complianceScore: 75,
        supplierName: 'Global Packaging Solutions',
        supplierId: 2,
        dateAnalyzed: new Date().toISOString(),
        summary: 'The document is generally compliant but contains some clauses that require review. Specific areas of concern include liability limitations, warranty periods, and data protection provisions.',
        sections: [
            {
                title: 'Document Identification',
                status: 'compliant',
                items: [
                    { name: 'Document Type', value: 'Supplier Agreement', status: 'compliant' },
                    { name: 'Parties Correctly Identified', value: 'Yes', status: 'compliant' },
                    { name: 'Agreement Date', value: '2023-08-15', status: 'compliant' },
                    { name: 'Version Control', value: 'Revision 2.0', status: 'compliant' },
                ]
            },
            {
                title: 'Core Terms',
                status: 'review',
                items: [
                    { name: 'Payment Terms', value: 'Net 45', status: 'compliant' },
                    { name: 'Delivery Terms', value: 'FOB Destination', status: 'compliant' },
                    { name: 'Contract Duration', value: '24 months', status: 'compliant' },
                    { name: 'Termination Clause', value: '60 days notice', status: 'review', notes: 'Standard is 30 days notice' },
                ]
            },
            {
                title: 'Liability & Warranties',
                status: 'non-compliant',
                items: [
                    { name: 'Liability Cap', value: 'Limited to 50% of contract value', status: 'non-compliant', notes: 'Below minimum requirement of 100% of contract value' },
                    { name: 'Warranty Period', value: '6 months', status: 'non-compliant', notes: 'Below minimum standard of 12 months' },
                    { name: 'Indemnification', value: 'Present, but limited scope', status: 'review', notes: 'Does not cover all required areas' },
                    { name: 'Insurance Requirements', value: 'Present and adequate', status: 'compliant' },
                ]
            },
            {
                title: 'Data & Confidentiality',
                status: 'review',
                items: [
                    { name: 'Confidentiality Clause', value: 'Present', status: 'compliant' },
                    { name: 'Data Protection', value: 'Present but incomplete', status: 'review', notes: 'Missing specific GDPR provisions' },
                    { name: 'Intellectual Property', value: 'Clearly defined', status: 'compliant' },
                    { name: 'Data Security Standards', value: 'Referenced but not detailed', status: 'review', notes: 'Should reference specific security standards' },
                ]
            },
            {
                title: 'Regulatory Compliance',
                status: 'compliant',
                items: [
                    { name: 'Environmental Standards', value: 'ISO 14001 commitment', status: 'compliant' },
                    { name: 'Labor Compliance', value: 'References all required standards', status: 'compliant' },
                    { name: 'Anti-corruption', value: 'FCPA and UK Bribery Act compliant', status: 'compliant' },
                    { name: 'Export Controls', value: 'Addressed adequately', status: 'compliant' },
                ]
            }
        ],
        recommendations: [
            'Renegotiate liability cap to at least 100% of contract value',
            'Extend warranty period to standard 12 months minimum',
            'Revise termination clause to align with company policy of 30 days notice',
            'Enhance data protection clauses to include specific GDPR requirements',
            'Add specific security standards for data handling'
        ]
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Check file type (pdf, doc, docx)
        const fileType = file.type;
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        if (!validTypes.includes(fileType)) {
            alert('Please upload a valid document file (PDF, DOC, DOCX, or TXT)');
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit');
            return;
        }

        setFile(file);
    };

    const removeFile = () => {
        setFile(null);
        setAnalysisResults(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const analyzeDocument = async () => {
        if (!file) return;

        try {
            setAnalyzing(true);

            // In a real app, we would call the API
            // const formData = new FormData();
            // formData.append('document', file);
            // const response = await complianceApi.analyzeDocument(formData);
            // setAnalysisResults(response.data);

            // For the hackathon, simulate API call with mock data
            setTimeout(() => {
                setAnalysisResults(mockResults);
                setAnalyzing(false);
            }, 3000);
        } catch (error) {
            console.error('Error analyzing document:', error);
            setAnalyzing(false);
        }
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/compliance" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Document Analysis</h1>
                </div>
                {analysisResults && (
                    <div className="flex space-x-3">
                        <button className="btn-secondary flex items-center">
                            <FiDownload className="mr-2" />
                            Export Report
                        </button>
                        <Link
                            href={`/compliance/verify?supplierId=${analysisResults.supplierId}`}
                            className="btn-primary flex items-center"
                        >
                            <FiCheckCircle className="mr-2" />
                            Verify Supplier
                        </Link>
                    </div>
                )}
            </div>

            {!analysisResults ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Upload Document for Analysis</h2>
                        <p className="text-gray-600">
                            Upload contracts, certificates, or other supplier documents to check for compliance with regulations and company policies.
                        </p>
                    </div>

                    {/* File Upload Area */}
                    <div
                        className={`mt-4 border-2 border-dashed rounded-lg p-6 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="text-center">
                            {!file ? (
                                <>
                                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.txt"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, DOCX, or TXT up to 10MB
                                    </p>
                                </>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <FiFileText className="h-10 w-10 text-blue-500 mr-3" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {(file.size / 1024).toFixed(2)} KB • {file.type}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="ml-4 p-1 rounded-full text-gray-500 hover:bg-gray-200"
                                        >
                                            <FiX className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {file && (
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={analyzeDocument}
                                className="btn-primary flex items-center"
                                disabled={analyzing}
                            >
                                {analyzing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Analyzing Document...
                                    </>
                                ) : (
                                    <>
                                        <FiSearch className="mr-2" />
                                        Analyze Document
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Quick Info About The Analysis */}
                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-md font-medium text-gray-800 mb-4">What We Check For</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                                        <FiFileText className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-medium">Document Structure</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    We verify the document contains all required sections and legal clauses.
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <div className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                                        <FiCheckCircle className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-medium">Regulatory Compliance</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    We check for adherence to industry regulations and legal requirements.
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                                        <FiAlertCircle className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-medium">Risk Assessment</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    We identify potential risk factors and areas that require attention.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Upload Tips */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                            <FiInfo className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                            <div>
                                <h4 className="font-medium text-blue-800 mb-1">Document Analysis Tips</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Upload complete documents rather than excerpts for full analysis</li>
                                    <li>• Ensure documents are not password protected</li>
                                    <li>• For best results, upload documents with clear text (not scanned images)</li>
                                    <li>• Review the analysis report carefully and verify key findings</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Analysis Results Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                                <div className="flex items-center mb-2">
                                    <h2 className="text-lg font-semibold text-gray-800 mr-3">Analysis Results</h2>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(analysisResults.status)}`}>
                                        {analysisResults.status === 'compliant' ? 'Compliant' :
                                            analysisResults.status === 'review' ? 'Needs Review' :
                                                'Non-Compliant'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{analysisResults.documentName}</p>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <FiFileText className="mr-2 h-4 w-4" />
                                    <span>Document Type: <span className="font-medium">{analysisResults.documentType}</span></span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <FiExternalLink className="mr-2 h-4 w-4" />
                                    <span>Supplier: <Link href={`/suppliers/${analysisResults.supplierId}`} className="font-medium text-blue-600 hover:underline">{analysisResults.supplierName}</Link></span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FiClock className="mr-2 h-4 w-4" />
                                    <span>Analyzed on: <span className="font-medium">{new Date(analysisResults.dateAnalyzed).toLocaleString()}</span></span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg md:w-64">
                                <div className="text-center">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Compliance Score</h3>
                                    <div className="text-3xl font-bold text-gray-800 mb-2">{analysisResults.complianceScore}%</div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${analysisResults.complianceScore >= 90 ? 'bg-green-500' :
                                                analysisResults.complianceScore >= 70 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                            style={{ width: `${analysisResults.complianceScore}%` }}
                                        ></div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        {analysisResults.complianceScore >= 90 ? 'Highly Compliant' :
                                            analysisResults.complianceScore >= 70 ? 'Partially Compliant' :
                                                'Significant Issues'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 border rounded-lg">
                            <h3 className="text-md font-medium text-gray-800 mb-2">Summary</h3>
                            <p className="text-gray-700">{analysisResults.summary}</p>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Analysis</h2>

                        {analysisResults.sections.map((section, index) => (
                            <div
                                key={index}
                                className={`mb-6 ${index < analysisResults.sections.length - 1 ? 'pb-6 border-b' : ''}`}
                            >
                                <div className="flex items-center mb-3">
                                    <h3 className="text-md font-medium text-gray-800 mr-3">{section.title}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(section.status)}`}>
                                        {section.status === 'compliant' ? 'Compliant' :
                                            section.status === 'review' ? 'Needs Review' :
                                                'Non-Compliant'}
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Item
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Value
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {section.items.map((item, itemIndex) => (
                                                <tr key={itemIndex} className={itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.value}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                            {item.status === 'compliant' ? 'Compliant' :
                                                                item.status === 'review' ? 'Review' :
                                                                    'Non-Compliant'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.notes || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h2>

                        <div className="space-y-4">
                            {analysisResults.recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <FiAlertCircle className={`h-5 w-5 ${index < 2 ? 'text-red-500' :
                                            index < 4 ? 'text-yellow-500' :
                                                'text-blue-500'
                                            }`} />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-gray-700">{recommendation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-md font-medium text-gray-800">Next Steps</h3>
                                <Link
                                    href={`/compliance/verify?supplierId=${analysisResults.supplierId}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                                >
                                    Verify Supplier Compliance
                                    <FiChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-red-100 p-2 rounded-full mr-2">
                                            <FiAlertCircle className="h-4 w-4 text-red-600" />
                                        </div>
                                        <h4 className="font-medium text-gray-800">Address Critical Issues</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Contact the supplier to address non-compliant items, especially liability and warranty terms.
                                    </p>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-yellow-100 p-2 rounded-full mr-2">
                                            <FiFileText className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <h4 className="font-medium text-gray-800">Document Updates</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Request a revised version of the document with the recommended changes.
                                    </p>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-blue-100 p-2 rounded-full mr-2">
                                            <FiCheckCircle className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h4 className="font-medium text-gray-800">Final Verification</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Re-analyze the updated document to ensure all compliance issues are resolved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Missing icon components
const FiChevronRight = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);
