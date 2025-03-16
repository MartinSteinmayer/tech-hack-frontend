'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiMessageSquare,
    FiSend,
    FiCopy,
    FiRefreshCw,
    FiEdit,
    FiChevronRight,
    FiClipboard,
    FiThumbsUp,
    FiThumbsDown,
    FiDownload,
    FiAlertCircle,
    FiInfo,
    FiMail,
    FiCheck
} from 'react-icons/fi';
import axios from 'axios';

// Main component that doesn't directly use useSearchParams
export default function MessagesPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <MessagesContent />
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
                    <h1 className="text-2xl font-bold text-gray-800">Message Composer</h1>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading message composer...</p>
            </div>
        </div>
    );
}

// Content component that safely uses useSearchParams inside Suspense
function MessagesContent() {
    // Import useSearchParams inside this component
    const { useSearchParams } = require('next/navigation');
    const searchParams = useSearchParams();
    const supplierId = searchParams.get('supplierId');

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState(null);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        type: 'inquiry',
        supplier: '',
        additionalContext: '',
        keyPoints: ''
    });

    // Mock supplier data for dropdown (would come from mockData.js)
    const [suppliers, setSuppliers] = useState([]);
    const [supplierDetails, setSupplierDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // In a real app, we would use the API client to fetch data
                // For now, extract data from mockData that was imported elsewhere in the app

                // Get supplier data from window object if available
                const mockSuppliersData = window.mockSuppliers || [];

                if (!mockSuppliersData.length) {
                    // Fallback to importing directly if not in window
                    const { mockSuppliers, getSupplierById } = require('@/lib/mockData');

                    // Set the full supplier data for later access to email addresses
                    setSupplierDetails(mockSuppliers);

                    // Set suppliers for dropdown
                    setSuppliers(mockSuppliers.map(s => ({
                        id: s.id,
                        name: s.name,
                        category: s.category,
                        contactEmail: s.contactEmail
                    })));

                    // Set supplier from URL param if it exists
                    if (supplierId) {
                        const supplierData = getSupplierById(parseInt(supplierId));
                        setSupplier(supplierData);

                        // Pre-fill form data with supplier name
                        if (supplierData) {
                            setFormData(prev => ({
                                ...prev,
                                supplier: supplierData.name
                            }));
                        }
                    }
                } else {
                    // Use data from window object
                    setSupplierDetails(mockSuppliersData);

                    setSuppliers(mockSuppliersData.map(s => ({
                        id: s.id,
                        name: s.name,
                        category: s.category,
                        contactEmail: s.contactEmail
                    })));

                    // Set supplier from URL param if it exists
                    if (supplierId) {
                        const supplierData = mockSuppliersData.find(s => s.id === parseInt(supplierId));
                        setSupplier(supplierData);

                        // Pre-fill form data with supplier name
                        if (supplierData) {
                            setFormData(prev => ({
                                ...prev,
                                supplier: supplierData.name
                            }));
                        }
                    }
                }

                setLoading(false);
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

    const handleSupplierSelect = (e) => {
        const selectedSupplierId = e.target.value;
        const selectedSupplier = suppliers.find(s => s.id === parseInt(selectedSupplierId));

        if (selectedSupplier) {
            setFormData(prev => ({
                ...prev,
                supplier: selectedSupplier.name
            }));
        }
    };

    const handleGenerateMessage = async (e) => {
        e.preventDefault();

        if (!formData.supplier) {
            alert('Please select a supplier');
            return;
        }

        try {
            setGenerating(true);

            // Call the API to generate a message
            const response = await axios.post('https://tech-hack-api.vercel.app/api/negotiations/messages', {
                type: formData.type,
                supplier: formData.supplier,
                additionalContext: formData.additionalContext,
                keyPoints: formData.keyPoints
            });

            setGeneratedMessage(response.data);
            setGenerating(false);
        } catch (error) {
            console.error('Error generating message:', error);

            // Fallback to mock response in case the API is down
            const mockResponse = {
                subject: `Re: ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} with ${formData.supplier}`,
                body: `Dear ${formData.supplier},\n\n${formData.type === 'negotiation'
                        ? 'Thank you for your quote. We would like to discuss the possibility of a volume discount based on our projected annual needs.'
                        : formData.type === 'followup'
                            ? 'I\'m following up on our previous conversation regarding pricing. Have you had a chance to review our proposal?'
                            : 'We are interested in your products and would like to request more information about your pricing and availability for our upcoming projects.'
                    }\n\nBest regards,\nTacto Team`,
                suggested_tone: "Professional and direct",
                key_points: ["Reference previous communication", "Be specific about needs", "Include timeline expectations"]
            };

            setGeneratedMessage(mockResponse);
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        if (generatedMessage) {
            navigator.clipboard.writeText(generatedMessage.body);
            setCopied(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    const [emailSent, setEmailSent] = useState(false);
    const [emailSentDetails, setEmailSentDetails] = useState(null);

    const handleSendEmail = () => {
        if (generatedMessage && formData.supplier) {
            // First try to find the supplier in our local state
            const selectedSupplier = suppliers.find(s =>
                s.name.toLowerCase() === formData.supplier.toLowerCase()
            );

            let emailAddress;
            let supplierName = formData.supplier;

            // Check if we have the email in our local state
            if (selectedSupplier && selectedSupplier.contactEmail) {
                emailAddress = selectedSupplier.contactEmail;
                supplierName = selectedSupplier.name;
            }
            // Next check if we have the supplier details in state
            else if (supplierDetails) {
                const fullDetails = supplierDetails.find(s =>
                    s.name.toLowerCase() === formData.supplier.toLowerCase()
                );
                if (fullDetails && fullDetails.contactEmail) {
                    emailAddress = fullDetails.contactEmail;
                    supplierName = fullDetails.name;
                }
            }
            // Finally, try importing from mockData as a fallback
            else {
                try {
                    const { mockSuppliers } = require('@/lib/mockData');
                    const fullSupplierDetails = mockSuppliers.find(s =>
                        s.name.toLowerCase() === formData.supplier.toLowerCase()
                    );
                    if (fullSupplierDetails && fullSupplierDetails.contactEmail) {
                        emailAddress = fullSupplierDetails.contactEmail;
                        supplierName = fullSupplierDetails.name;
                    }
                } catch (error) {
                    console.error('Error importing mockSuppliers:', error);
                }
            }

            // Mock sending the email
            if (emailAddress) {
                // Set a loading state for a brief moment to simulate sending
                setEmailSentDetails({
                    loading: true,
                    recipient: supplierName,
                    email: emailAddress,
                    subject: generatedMessage.subject,
                    timestamp: new Date().toLocaleString()
                });

                // After a brief delay, show success
                setTimeout(() => {
                    setEmailSent(true);
                    setEmailSentDetails(prev => ({
                        ...prev,
                        loading: false,
                        success: true
                    }));

                    // Automatically hide the success message after 5 seconds
                    setTimeout(() => {
                        setEmailSent(false);
                    }, 5000);
                }, 1500);
            } else {
                alert('Could not find email address for the selected supplier.');
            }
        } else {
            alert('Please generate a message first.');
        }
    };

    const messageTypeOptions = [
        { value: 'inquiry', label: 'Initial Inquiry' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'followup', label: 'Follow-up' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/negotiations" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Message Composer</h1>
                </div>
                {generatedMessage && (
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCopy}
                            className="btn-secondary flex items-center"
                        >
                            <FiCopy className="mr-2" />
                            {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                        <button
                            className="btn-secondary flex items-center"
                            onClick={() => handleSendEmail()}
                        >
                            <FiMail className="mr-2" />
                            Send Email
                        </button>
                        <button className="btn-primary flex items-center">
                            <FiDownload className="mr-2" />
                            Export as Draft
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Message Generation Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {supplier ? `Draft Message to ${supplier.name}` : 'Draft Supplier Message'}
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleGenerateMessage}>
                            {/* Supplier Selection */}
                            {!supplier && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Supplier
                                    </label>
                                    <select
                                        className="form-select cursor-pointer"
                                        onChange={handleSupplierSelect}
                                        required
                                    >
                                        <option value="">-- Select Supplier --</option>
                                        {suppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name} ({supplier.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Message Type */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="form-select cursor-pointer"
                                    required
                                >
                                    {messageTypeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Additional Context */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Context (Optional)
                                </label>
                                <textarea
                                    name="additionalContext"
                                    value={formData.additionalContext}
                                    onChange={handleChange}
                                    rows={3}
                                    className="form-input"
                                    placeholder="Add any specific context or background information for the message..."
                                />
                            </div>

                            {/* Key Points to Include */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Key Points to Include (Optional)
                                </label>
                                <textarea
                                    name="keyPoints"
                                    value={formData.keyPoints}
                                    onChange={handleChange}
                                    rows={3}
                                    className="form-input"
                                    placeholder="Enter specific points you want to include in the message (one per line)..."
                                />
                            </div>

                            {/* Generation Button */}
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="btn-primary w-full flex items-center justify-center"
                                    disabled={generating || !formData.supplier}
                                >
                                    {generating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Generating Message...
                                        </>
                                    ) : (
                                        <>
                                            <FiMessageSquare className="mr-2" />
                                            Generate Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Generated Message Output */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Generated Message
                    </h2>

                    {generatedMessage ? (
                        <div className="space-y-4">
                            {/* Subject Line */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Subject</h3>
                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <p className="text-gray-800 font-medium">{generatedMessage.subject}</p>
                                </div>
                            </div>

                            {/* Recipient (when available) */}
                            {supplier && supplier.contactEmail && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Recipient</h3>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <p className="text-gray-800">
                                            <span className="font-medium">{supplier.name}</span> ({supplier.contactEmail})
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Message Body */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Message</h3>
                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-line">
                                    <p className="text-gray-800">{generatedMessage.body}</p>
                                </div>
                            </div>

                            {/* AI Suggestions */}
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">AI Suggestions</h3>
                                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <div className="space-y-3">
                                        {/* Suggested Tone */}
                                        <div>
                                            <span className="text-sm text-blue-700 font-medium">Suggested Tone:</span>
                                            <p className="text-sm text-blue-700">{generatedMessage.suggested_tone}</p>
                                        </div>

                                        {/* Key Points to Consider */}
                                        <div>
                                            <span className="text-sm text-blue-700 font-medium">Key Points to Consider:</span>
                                            <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
                                                {generatedMessage.key_points.map((point, index) => (
                                                    <li key={index}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3 mt-4">
                                <button
                                    onClick={() => setGeneratedMessage(null)}
                                    className="btn-secondary flex items-center"
                                >
                                    <FiRefreshCw className="mr-2" />
                                    Regenerate
                                </button>
                                <button className="btn-secondary flex items-center">
                                    <FiEdit className="mr-2" />
                                    Edit Message
                                </button>
                                <button
                                    onClick={handleSendEmail}
                                    className="btn-primary flex items-center"
                                >
                                    <FiMail className="mr-2" />
                                    Send Email
                                </button>
                            </div>

                            {/* Email Sent Notification */}
                            {emailSent && emailSentDetails && (
                                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            {emailSentDetails.loading ? (
                                                <div className="h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <FiCheck className="h-6 w-6 text-green-500" />
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">
                                                {emailSentDetails.loading ? 'Sending email...' : 'Email sent successfully!'}
                                            </h3>
                                            <div className="mt-2 text-sm text-green-700">
                                                <p>Recipient: <span className="font-medium">{emailSentDetails.recipient}</span> ({emailSentDetails.email})</p>
                                                <p>Subject: {emailSentDetails.subject}</p>
                                                <p>Sent at: {emailSentDetails.timestamp}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Feedback */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-700">Was this message helpful?</h3>
                                    <div className="flex space-x-2">
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <FiThumbsUp className="h-5 w-5 text-gray-500" />
                                        </button>
                                        <button className="p-2 rounded hover:bg-gray-100">
                                            <FiThumbsDown className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <FiMessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No Message Generated Yet</h3>
                            <p className="text-gray-500 max-w-md">
                                Fill out the form and click "Generate Message" to create an AI-powered supplier communication.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Usage Tips */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <FiInfo className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Message Composer Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-1">Message Types</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li><strong>Initial Inquiry:</strong> For first-time communication with a supplier</li>
                                    <li><strong>Negotiation:</strong> For discussing prices, terms, or conditions</li>
                                    <li><strong>Follow-up:</strong> For checking status or continuing a conversation</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-1">Best Practices</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>Be clear about your requirements and timeline</li>
                                    <li>Provide context about your relationship with the supplier</li>
                                    <li>Specify key points you want to address</li>
                                    <li>Review and edit the generated message before sending</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-1">Next Steps</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>Copy the message to your email client</li>
                                    <li>Save messages as templates for future use</li>
                                    <li>Track responses in the supplier's timeline</li>
                                    <li>Document key agreements and decisions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
