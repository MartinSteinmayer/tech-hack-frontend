'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiSearch,
    FiPlus,
    FiCheck,
    FiSave,
    FiFilter,
    FiMapPin,
    FiMail,
    FiPhone,
    FiGlobe,
    FiInfo,
    FiAlertCircle,
    FiCpu
} from 'react-icons/fi';
import { mockSuppliers, updateMockSuppliers } from '@/lib/mockData';
import { searchSuppliers } from '@/lib/supplierApi';

export default function NewSupplierPage() {
    // State for tab navigation
    const [activeTab, setActiveTab] = useState('standard');

    // State for standard search
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // State for AI search
    const [aiDescription, setAiDescription] = useState('');
    const [aiCategories, setAiCategories] = useState([]);
    const [aiSearchLoading, setAiSearchLoading] = useState(false);
    const [aiResults, setAiResults] = useState([]);

    // State for selected supplier
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // State for new supplier form
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        subcategory: '',
        location: '',
        region: '',
        description: '',
        website: 'https://',
        contactEmail: '',
        contactPhone: '',
        products: [{ name: '', category: '', leadTime: '', minOrderQty: 1, unitPrice: 0 }]
    });

    // Available categories for dropdown
    const categories = ['Electronics', 'Raw Materials', 'Packaging', 'Logistics', 'Services', 'Chemicals'];

    // Available locations for dropdown
    const locations = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia'];

    // AI search categories/criteria
    const aiCriteriaOptions = [
        { id: 'sustainable', label: 'Sustainable/Green' },
        { id: 'certified', label: 'ISO Certified' },
        { id: 'local', label: 'Local Supplier' },
        { id: 'budget', label: 'Budget-Friendly' },
        { id: 'premium', label: 'Premium Quality' },
        { id: 'fast', label: 'Fast Delivery' },
        { id: 'innovative', label: 'Innovative Solutions' },
        { id: 'global', label: 'Global Reach' }
    ];

    // Handle standard search
    useEffect(() => {
        // Using the searchSuppliers function from the API adapter
        const results = searchSuppliers(searchTerm, mockSuppliers);
        setSearchResults(results);
    }, [searchTerm]);

    // Handle selecting a supplier from search results
    const handleSelectSupplier = (supplier) => {
        setSelectedSupplier(supplier);

        // Update the form data with the selected supplier info
        setFormData({
            name: supplier.name,
            category: supplier.category,
            subcategory: supplier.subcategory || '',
            location: supplier.location,
            region: supplier.region || '',
            description: supplier.description,
            website: supplier.website,
            contactEmail: supplier.contactEmail,
            contactPhone: supplier.contactPhone,
            products: supplier.products || [{ name: '', category: '', leadTime: '', minOrderQty: 1, unitPrice: 0 }]
        });
    };

    // Handle AI search criteria selection
    const handleAiCriteriaChange = (criteriaId) => {
        if (aiCategories.includes(criteriaId)) {
            setAiCategories(aiCategories.filter(id => id !== criteriaId));
        } else {
            setAiCategories([...aiCategories, criteriaId]);
        }
    };

    // MODIFIED: Mock AI search function to always return the same result
    const handleAiSearch = async () => {
        console.log('Performing AI search...');

        setAiSearchLoading(true);

        // Simulate API delay
        setTimeout(() => {
            // Mock result that will always be returned
            const mockResult = [{
                id: "sup-12345",
                name: "EcoPack Solutions",
                category: "Packaging",
                description: "Premium sustainable packaging solutions with rapid delivery across Europe. ISO 9001 and 14001 certified.",
                location: "Frankfurt, Germany",
                region: "Europe",
                rating: 4.8,
                sustainabilityScore: 92,
                pricing: "Standard",
                deliverySpeed: "Fast",
                isoCertified: true,
                isLocal: false,
                aiRecommendation: {
                    reasons: [
                        "Matches all 3 of your criteria: sustainable materials, fast delivery, and ISO certification",
                        "92/100 sustainability score exceeds industry average by 45%",
                        "European location aligns with your regional requirements",
                        "Specialized in packaging solutions with proven track record"
                    ],
                    considerations: "Premium pricing may be higher than industry average, but offset by reduced carbon footprint and long-term sustainability benefits."
                }
            }];

            console.log('Mocked AI search results:', mockResult);
            setAiResults(mockResult);
            setAiSearchLoading(false);
        }, 1500); // 1.5 second delay to simulate API call
    };

    // Handle form input changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle adding a new product field
    const handleAddProduct = () => {
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, { name: '', category: '', leadTime: '', minOrderQty: 1, unitPrice: 0 }]
        }));
    };

    // Handle product field changes
    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: value
        };

        setFormData(prev => ({
            ...prev,
            products: updatedProducts
        }));
    };

    // Handle removing a product
    const handleRemoveProduct = (index) => {
        if (formData.products.length <= 1) return;

        const updatedProducts = formData.products.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            products: updatedProducts
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name || !formData.category || !formData.contactEmail || !formData.contactPhone) {
            alert("Please fill out all required fields.");
            return;
        }

        try {
            // Format the supplier data
            const supplierData = {
                // Basic information
                name: formData.name,
                description: formData.description,
                category: formData.category,
                subcategory: formData.subcategory,
                location: formData.location,
                region: formData.region,

                // Contact information
                website: formData.website,
                contactEmail: formData.contactEmail,
                contactPhone: formData.contactPhone,

                // Default values for new suppliers
                foundedYear: new Date().getFullYear(),
                employees: '1-50',
                rating: 4.0,
                reliabilityScore: 80,
                qualityScore: 85,
                deliveryScore: 80,
                communicationScore: 85,
                status: 'active',
                complianceStatus: 'review',

                // Products
                products: formData.products.filter(p => p.name).map((product, index) => ({
                    id: 1000 + index,  // Generate product IDs
                    name: product.name,
                    category: product.category || formData.category,
                    leadTime: product.leadTime || '2-3 weeks',
                    minOrderQty: product.minOrderQty || 1,
                    unitPrice: product.unitPrice || 0
                })),

                // Empty arrays for other data
                certifications: [],
                performanceHistory: [],
                riskFactors: [
                    { category: 'Financial', level: 'low', description: 'New supplier - limited data available' }
                ],
                recentOrders: [],
                negotiationHistory: []
            };

            // Add to mockSuppliers
            const newSupplier = updateMockSuppliers(supplierData);
            console.log('New supplier added:', newSupplier);
            console.log('Updated suppliers list:', mockSuppliers);

            // Show success message
            alert('Supplier added successfully!');

            // In a real app, you would redirect here
            // router.push('/suppliers');

        } catch (error) {
            console.error('Error adding supplier:', error);
            alert('Error adding supplier. Please try again.');
        }
    };

    // Set the AI tab active when component loads
    useEffect(() => {
        setActiveTab('ai');
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/suppliers" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Supplier</h1>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleSubmit}
                        className="btn-primary flex items-center cursor-pointer"
                    >
                        <FiSave className="mr-2" />
                        Save Supplier
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Find a Supplier</h2>
                    <p className="text-gray-600">
                        Search for existing suppliers or use AI to discover new potential suppliers based on your requirements.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex -mb-px space-x-8">
                        <button
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'standard'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('standard')}
                        >
                            Standard Search
                        </button>
                        <button
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === 'ai'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab('ai')}
                        >
                            <div className="flex items-center">
                                <FiCpu className="mr-2" />
                                AI-Powered Search
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Standard Search Content */}
                {activeTab === 'standard' && (
                    <div>
                        <div className="mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search suppliers by name or category..."
                                    className="form-input pl-10 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mb-6 border rounded-lg overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Search Results ({searchResults.length})
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {searchResults.map((supplier) => (
                                        <div
                                            key={supplier.id}
                                            className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleSelectSupplier(supplier)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-md font-medium text-gray-900">{supplier.name}</h4>
                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                        <span className="flex items-center mr-4">
                                                            <FiFilter className="h-4 w-4 mr-1" />
                                                            {supplier.category}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <FiMapPin className="h-4 w-4 mr-1" />
                                                            {supplier.region || supplier.location}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    Select
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {searchTerm.length >= 2 && searchResults.length === 0 && (
                            <div className="mb-6 text-center py-8 border rounded-lg">
                                <FiAlertCircle className="mx-auto h-10 w-10 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Try a different search term or create a new supplier.
                                </p>
                            </div>
                        )}

                        {searchTerm.length === 0 && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start">
                                    <FiInfo className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-1">Search Tips</h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• Search by supplier name or category</li>
                                            <li>• Type at least 2 characters to start searching</li>
                                            <li>• Select a supplier from the results to pre-fill the form</li>
                                            <li>• Or fill out the form below to create a new supplier</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* AI-Powered Search Content */}
                {activeTab === 'ai' && (
                    <div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Describe your supplier requirements
                            </label>
                            <textarea
                                rows={4}
                                className="form-input"
                                placeholder="E.g., I need an electronics component supplier with experience in microcontrollers and sensors, preferably in Asia with ISO certification..."
                                value={aiDescription}
                                onChange={(e) => setAiDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional criteria (optional)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {aiCriteriaOptions.map((option) => (
                                    <div key={option.id} className="flex items-center">
                                        <input
                                            id={`criteria-${option.id}`}
                                            type="checkbox"
                                            className="form-checkbox cursor-pointer"
                                            checked={aiCategories.includes(option.id)}
                                            onChange={() => handleAiCriteriaChange(option.id)}
                                        />
                                        <label
                                            htmlFor={`criteria-${option.id}`}
                                            className="ml-2 text-sm text-gray-700 cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={handleAiSearch}
                                disabled={!aiDescription || aiSearchLoading}
                                className="btn-primary flex items-center cursor-pointer"
                            >
                                {aiSearchLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Finding Suppliers...
                                    </>
                                ) : (
                                    <>
                                        <FiCpu className="mr-2" />
                                        Find Suppliers with AI
                                    </>
                                )}
                            </button>
                        </div>

                        {/* AI Search Results */}
                        {aiResults.length > 0 && (
                            <div className="mb-6 border rounded-lg overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        AI-Recommended Suppliers ({aiResults.length})
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {aiResults.map((supplier) => (
                                        <div
                                            key={supplier.id}
                                            className="px-6 py-4 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-md font-medium text-gray-900">{supplier.name}</h4>
                                                    <p className="text-sm text-gray-600 mt-1 mb-2">{supplier.description}</p>

                                                    {supplier.aiRecommendation && supplier.aiRecommendation.reasons && (
                                                        <div className="mb-2 p-2 bg-blue-50 rounded">
                                                            <p className="text-sm font-medium text-blue-700">Why this supplier is recommended:</p>
                                                            <ul className="text-sm text-blue-600 list-disc pl-5 mt-1">
                                                                {supplier.aiRecommendation.reasons.map((reason, idx) => (
                                                                    <li key={idx}>{reason}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <span className="flex items-center mr-4">
                                                            <FiFilter className="h-4 w-4 mr-1" />
                                                            {supplier.category}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <FiMapPin className="h-4 w-4 mr-1" />
                                                            {supplier.region || supplier.location}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleSelectSupplier(supplier)}
                                                    className="btn-secondary text-sm cursor-pointer"
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {aiSearchLoading === false && aiResults.length === 0 && aiDescription && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-gray-600">
                                    Enter your requirements and click "Find Suppliers with AI" to get recommendations.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Common Supplier Form */}
                <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                        {selectedSupplier ? 'Edit Supplier Details' : 'Create New Supplier'}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Supplier Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    className="form-select cursor-pointer"
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subcategory
                                </label>
                                <input
                                    type="text"
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleFormChange}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="location"
                                    value={formData.region}
                                    onChange={handleFormChange}
                                    className="form-select cursor-pointer"
                                    required
                                >
                                    <option value="">-- Select Location --</option>
                                    {locations.map((location) => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Contact Information */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    rows={3}
                                    className="form-input"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Website
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiGlobe className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleFormChange}
                                        className="form-input pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleFormChange}
                                        className="form-input pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Phone <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleFormChange}
                                        className="form-input pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">Products & Services</h3>
                                <button
                                    type="button"
                                    onClick={handleAddProduct}
                                    className="text-sm bg-blue-50 text-blue-600 py-1 px-3 rounded-md border border-blue-200 hover:bg-blue-100 flex items-center cursor-pointer"
                                >
                                    <FiPlus className="mr-1 h-4 w-4" />
                                    Add Product
                                </button>
                            </div>

                            {formData.products.map((product, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-4 mb-4"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-md font-medium text-gray-800">Product #{index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(index)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                            disabled={formData.products.length <= 1}
                                        >
                                            <FiX className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Name
                                            </label>
                                            <input
                                                type="text"
                                                value={product.name}
                                                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                className="form-input"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                value={product.category}
                                                onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Lead Time
                                            </label>
                                            <input
                                                type="text"
                                                value={product.leadTime}
                                                onChange={(e) => handleProductChange(index, 'leadTime', e.target.value)}
                                                className="form-input"
                                                placeholder="e.g., 2-3 weeks"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Min Order Qty
                                            </label>
                                            <input
                                                type="number"
                                                value={product.minOrderQty}
                                                onChange={(e) => handleProductChange(index, 'minOrderQty', parseInt(e.target.value))}
                                                className="form-input"
                                                min="1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Unit Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                value={product.unitPrice}
                                                onChange={(e) => handleProductChange(index, 'unitPrice', parseFloat(e.target.value))}
                                                className="form-input"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <Link
                                href="/suppliers"
                                className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="btn-primary cursor-pointer"
                            >
                                {selectedSupplier ? 'Update Supplier' : 'Add Supplier'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Missing icon components
const FiX = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);
