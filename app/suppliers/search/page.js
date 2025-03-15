'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiArrowLeft,
    FiSearch,
    FiFilter,
    FiSliders,
    FiChevronDown,
    FiChevronUp,
    FiRefreshCw,
    FiSave,
    FiMapPin,
    FiStar,
    FiTruck,
    FiDollarSign,
    FiCheckCircle,
    FiFileText,
    FiPlus
} from 'react-icons/fi';
import { supplierApi } from '../../../lib/api';

export default function SupplierSearchPage() {
    const router = useRouter();

    const [searchForm, setSearchForm] = useState({
        query: '',
        categories: [],
        locations: [],
        minRating: '',
        minReliability: '',
        complianceStatus: '',
        maxDistance: '',
        productCategories: [],
        certifications: [],
        deliveryTime: '',
        priceRange: '',
        sortBy: 'relevance'
    });

    const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [savedSearches, setSavedSearches] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [savedSearchModalOpen, setSavedSearchModalOpen] = useState(false);
    const [newSearchName, setNewSearchName] = useState('');

    // Mock data for filter options
    const categoryOptions = [
        'Electronics', 'Raw Materials', 'Packaging', 'Logistics', 'Services',
        'Chemicals', 'Automotive', 'Textiles', 'Food & Beverage', 'Construction'
    ];

    const locationOptions = [
        'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia',
        'Middle East', 'Eastern Europe', 'Southeast Asia', 'Central America'
    ];

    const productCategoryOptions = [
        'Components', 'Finished Goods', 'Custom Manufacturing', 'Raw Materials',
        'Packaging Materials', 'Hardware', 'Software', 'Chemical Products',
        'Industrial Equipment', 'Maintenance Services'
    ];

    const certificationOptions = [
        'ISO 9001', 'ISO 14001', 'ISO 27001', 'IATF 16949', 'AS9100',
        'FDA Approved', 'REACH Compliant', 'RoHS Compliant', 'Fair Trade',
        'Organic Certified', 'Halal Certified', 'Kosher Certified'
    ];

    // Mock data for suppliers
    const mockSuppliers = [
        {
            id: 1,
            name: 'ElectroTech Industries',
            logo: '/images/supplier1.png',
            category: 'Electronics',
            subcategory: 'Electronic Components',
            location: 'Shanghai, China',
            region: 'Asia',
            rating: 4.8,
            reliabilityScore: 92,
            deliveryScore: 88,
            complianceStatus: 'compliant',
            certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'RoHS Compliant'],
            minOrderValue: 5000,
            leadTime: '2-3 weeks',
            foundedYear: 2005,
            description: 'Leading manufacturer of electronic components specializing in microcontrollers, sensors, and PCB assemblies.',
            keyProducts: ['Microcontrollers', 'Sensors', 'PCB Assemblies']
        },
        {
            id: 2,
            name: 'Global Packaging Solutions',
            logo: '/images/supplier2.png',
            category: 'Packaging',
            subcategory: 'Custom Packaging',
            location: 'Berlin, Germany',
            region: 'Europe',
            rating: 4.5,
            reliabilityScore: 88,
            deliveryScore: 90,
            complianceStatus: 'compliant',
            certifications: ['ISO 9001:2015', 'FSC Certified'],
            minOrderValue: 2000,
            leadTime: '1-2 weeks',
            foundedYear: 2010,
            description: 'Innovative packaging solutions for various industries with focus on sustainable materials.',
            keyProducts: ['Custom Boxes', 'Protective Packaging', 'Shipping Materials']
        },
        {
            id: 3,
            name: 'RawMat Suppliers Inc',
            logo: '/images/supplier3.png',
            category: 'Raw Materials',
            subcategory: 'Industrial Polymers',
            location: 'Chicago, USA',
            region: 'North America',
            rating: 4.2,
            reliabilityScore: 85,
            deliveryScore: 82,
            complianceStatus: 'review',
            certifications: ['ISO 9001:2015', 'REACH Compliant'],
            minOrderValue: 10000,
            leadTime: '2-4 weeks',
            foundedYear: 1998,
            description: 'Supplier of high-quality raw materials for manufacturing including polymers, adhesives, and metals.',
            keyProducts: ['Industrial Polymers', 'Adhesives', 'Metals']
        },
        {
            id: 4,
            name: 'FastTrack Logistics',
            logo: '/images/supplier4.png',
            category: 'Logistics',
            subcategory: 'Express Shipping',
            location: 'Atlanta, USA',
            region: 'North America',
            rating: 4.6,
            reliabilityScore: 90,
            deliveryScore: 95,
            complianceStatus: 'non-compliant',
            certifications: ['ISO 9001:2015'],
            minOrderValue: 1000,
            leadTime: '1-3 days',
            foundedYear: 2007,
            description: 'Specialized logistics provider offering express shipping, warehousing, and distribution services.',
            keyProducts: ['Express Shipping', 'Warehousing', 'Distribution']
        },
        {
            id: 5,
            name: 'Quality Service Providers',
            logo: '/images/supplier5.png',
            category: 'Services',
            subcategory: 'Quality Consulting',
            location: 'London, UK',
            region: 'Europe',
            rating: 4.1,
            reliabilityScore: 82,
            deliveryScore: 80,
            complianceStatus: 'compliant',
            certifications: ['ISO 9001:2015', 'ISO 27001:2013'],
            minOrderValue: 3000,
            leadTime: 'On-demand',
            foundedYear: 2011,
            description: 'Professional services firm specializing in quality management, audits, and process improvement.',
            keyProducts: ['Consulting Services', 'Quality Audits', 'Training']
        },
        {
            id: 6,
            name: 'ChemSolutions Ltd',
            logo: '/images/supplier6.png',
            category: 'Chemicals',
            subcategory: 'Industrial Chemicals',
            location: 'Frankfurt, Germany',
            region: 'Europe',
            rating: 4.3,
            reliabilityScore: 87,
            deliveryScore: 85,
            complianceStatus: 'compliant',
            certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'REACH Compliant'],
            minOrderValue: 8000,
            leadTime: '3-4 weeks',
            foundedYear: 2003,
            description: 'Manufacturer and distributor of industrial chemicals and chemical products.',
            keyProducts: ['Solvents', 'Adhesives', 'Cleaning Chemicals']
        },
    ];

    // Mock data for saved searches
    const mockSavedSearches = [
        {
            id: 1,
            name: 'EU Electronics Suppliers',
            criteria: {
                categories: ['Electronics'],
                locations: ['Europe'],
                minRating: '4',
                complianceStatus: 'compliant'
            },
            dateCreated: '2023-08-15'
        },
        {
            id: 2,
            name: 'Certified Packaging Partners',
            criteria: {
                categories: ['Packaging'],
                certifications: ['ISO 9001', 'ISO 14001'],
                minReliability: '85'
            },
            dateCreated: '2023-09-01'
        }
    ];

    useEffect(() => {
        // Simulate loading saved searches
        setSavedSearches(mockSavedSearches);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (field, value) => {
        setSearchForm(prev => {
            const currentValues = [...prev[field]];

            if (currentValues.includes(value)) {
                return {
                    ...prev,
                    [field]: currentValues.filter(v => v !== value)
                };
            } else {
                return {
                    ...prev,
                    [field]: [...currentValues, value]
                };
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);

        // In a real application, we would call the API
        // const response = await supplierApi.search(searchForm);
        // setSearchResults(response.data);

        // For the hackathon, simulate API call with mock data
        setTimeout(() => {
            // Apply filters to mock data
            let filteredResults = [...mockSuppliers];

            // Basic text search
            if (searchForm.query) {
                const query = searchForm.query.toLowerCase();
                filteredResults = filteredResults.filter(supplier =>
                    supplier.name.toLowerCase().includes(query) ||
                    supplier.description.toLowerCase().includes(query) ||
                    supplier.category.toLowerCase().includes(query) ||
                    supplier.subcategory.toLowerCase().includes(query) ||
                    supplier.keyProducts.some(product => product.toLowerCase().includes(query))
                );
            }

            // Category filter
            if (searchForm.categories.length > 0) {
                filteredResults = filteredResults.filter(supplier =>
                    searchForm.categories.includes(supplier.category)
                );
            }

            // Location filter
            if (searchForm.locations.length > 0) {
                filteredResults = filteredResults.filter(supplier =>
                    searchForm.locations.includes(supplier.region)
                );
            }

            // Rating filter
            if (searchForm.minRating) {
                filteredResults = filteredResults.filter(supplier =>
                    supplier.rating >= parseFloat(searchForm.minRating)
                );
            }

            // Reliability filter
            if (searchForm.minReliability) {
                filteredResults = filteredResults.filter(supplier =>
                    supplier.reliabilityScore >= parseInt(searchForm.minReliability)
                );
            }

            // Compliance status filter
            if (searchForm.complianceStatus) {
                filteredResults = filteredResults.filter(supplier =>
                    supplier.complianceStatus === searchForm.complianceStatus
                );
            }

            // Certifications filter
            if (searchForm.certifications.length > 0) {
                filteredResults = filteredResults.filter(supplier =>
                    searchForm.certifications.some(cert =>
                        supplier.certifications.some(supplierCert =>
                            supplierCert.includes(cert)
                        )
                    )
                );
            }

            // Sort results
            switch (searchForm.sortBy) {
                case 'rating':
                    filteredResults.sort((a, b) => b.rating - a.rating);
                    break;
                case 'reliability':
                    filteredResults.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
                    break;
                case 'name':
                    filteredResults.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                // Default is 'relevance' which is the natural order
            }

            setSearchResults(filteredResults);
            setSearchPerformed(true);
            setLoading(false);
        }, 800);
    };

    const resetForm = () => {
        setSearchForm({
            query: '',
            categories: [],
            locations: [],
            minRating: '',
            minReliability: '',
            complianceStatus: '',
            maxDistance: '',
            productCategories: [],
            certifications: [],
            deliveryTime: '',
            priceRange: '',
            sortBy: 'relevance'
        });
        setSearchResults([]);
        setSearchPerformed(false);
    };

    const loadSavedSearch = (searchCriteria) => {
        setSearchForm(searchCriteria);
        setSavedSearchModalOpen(false);
    };

    const saveCurrentSearch = () => {
        if (!newSearchName.trim()) return;

        const newSavedSearch = {
            id: savedSearches.length + 1,
            name: newSearchName,
            criteria: { ...searchForm },
            dateCreated: new Date().toISOString().slice(0, 10)
        };

        setSavedSearches([...savedSearches, newSavedSearch]);
        setNewSearchName('');
        setSavedSearchModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/suppliers" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Advanced Supplier Search</h1>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setSavedSearchModalOpen(true)}
                        className="btn-secondary flex items-center"
                    >
                        <FiFileText className="mr-2" />
                        Saved Searches
                    </button>
                    <button
                        onClick={resetForm}
                        className="btn-primary flex items-center"
                    >
                        <FiRefreshCw className="mr-2" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSearch}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Suppliers
                        </label>
                        <div className="flex">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="query"
                                    value={searchForm.query}
                                    onChange={handleInputChange}
                                    placeholder="Search by name, product, category, description..."
                                    className="form-input pl-10 w-full"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                                className="ml-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                            >
                                <FiSliders className="mr-2" />
                                Filters
                                {advancedFiltersOpen ? (
                                    <FiChevronUp className="ml-2 h-4 w-4" />
                                ) : (
                                    <FiChevronDown className="ml-2 h-4 w-4" />
                                )}
                            </button>
                            <button
                                type="submit"
                                className="ml-3 btn-primary"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {advancedFiltersOpen && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Advanced Filters</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Categories */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categories
                                    </label>
                                    <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                                        {categoryOptions.map((category) => (
                                            <div key={category} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    id={`category-${category}`}
                                                    checked={searchForm.categories.includes(category)}
                                                    onChange={() => handleCheckboxChange('categories', category)}
                                                    className="form-checkbox"
                                                />
                                                <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                                                    {category}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Locations */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Regions
                                    </label>
                                    <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                                        {locationOptions.map((location) => (
                                            <div key={location} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    id={`location-${location}`}
                                                    checked={searchForm.locations.includes(location)}
                                                    onChange={() => handleCheckboxChange('locations', location)}
                                                    className="form-checkbox"
                                                />
                                                <label htmlFor={`location-${location}`} className="ml-2 text-sm text-gray-700">
                                                    {location}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ratings and Status */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Rating
                                        </label>
                                        <select
                                            name="minRating"
                                            value={searchForm.minRating}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Any Rating</option>
                                            <option value="4.5">4.5+ Stars</option>
                                            <option value="4">4+ Stars</option>
                                            <option value="3.5">3.5+ Stars</option>
                                            <option value="3">3+ Stars</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Reliability Score
                                        </label>
                                        <select
                                            name="minReliability"
                                            value={searchForm.minReliability}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Any Score</option>
                                            <option value="90">90%+</option>
                                            <option value="80">80%+</option>
                                            <option value="70">70%+</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Compliance Status
                                        </label>
                                        <select
                                            name="complianceStatus"
                                            value={searchForm.complianceStatus}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Any Status</option>
                                            <option value="compliant">Compliant</option>
                                            <option value="review">Under Review</option>
                                            <option value="non-compliant">Non-Compliant</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Filter Options */}
                            <div className="mt-6 border-t pt-6">
                                <h4 className="text-md font-medium text-gray-800 mb-4">Additional Filters</h4>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Certifications */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Certifications
                                        </label>
                                        <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                                            {certificationOptions.map((cert) => (
                                                <div key={cert} className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`cert-${cert}`}
                                                        checked={searchForm.certifications.includes(cert)}
                                                        onChange={() => handleCheckboxChange('certifications', cert)}
                                                        className="form-checkbox"
                                                    />
                                                    <label htmlFor={`cert-${cert}`} className="ml-2 text-sm text-gray-700">
                                                        {cert}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Product Categories */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Categories
                                        </label>
                                        <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                                            {productCategoryOptions.map((category) => (
                                                <div key={category} className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`product-${category}`}
                                                        checked={searchForm.productCategories.includes(category)}
                                                        onChange={() => handleCheckboxChange('productCategories', category)}
                                                        className="form-checkbox"
                                                    />
                                                    <label htmlFor={`product-${category}`} className="ml-2 text-sm text-gray-700">
                                                        {category}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delivery and Price */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Maximum Lead Time
                                            </label>
                                            <select
                                                name="deliveryTime"
                                                value={searchForm.deliveryTime}
                                                onChange={handleInputChange}
                                                className="form-select"
                                            >
                                                <option value="">Any Lead Time</option>
                                                <option value="1">Up to 1 week</option>
                                                <option value="2">Up to 2 weeks</option>
                                                <option value="4">Up to 1 month</option>
                                                <option value="12">Up to 3 months</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Maximum Distance
                                            </label>
                                            <select
                                                name="maxDistance"
                                                value={searchForm.maxDistance}
                                                onChange={handleInputChange}
                                                className="form-select"
                                            >
                                                <option value="">Any Distance</option>
                                                <option value="100">Within 100 miles</option>
                                                <option value="500">Within 500 miles</option>
                                                <option value="1000">Within 1000 miles</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Price Range
                                            </label>
                                            <select
                                                name="priceRange"
                                                value={searchForm.priceRange}
                                                onChange={handleInputChange}
                                                className="form-select"
                                            >
                                                <option value="">Any Price Range</option>
                                                <option value="low">Low-Cost</option>
                                                <option value="medium">Mid-Range</option>
                                                <option value="high">Premium</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="mt-6 flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-700 mr-2">Sort By:</span>
                                    <select
                                        name="sortBy"
                                        value={searchForm.sortBy}
                                        onChange={handleInputChange}
                                        className="form-select w-40"
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="rating">Rating</option>
                                        <option value="reliability">Reliability</option>
                                        <option value="name">Name (A-Z)</option>
                                    </select>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Reset Filters
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* Search Results */}
            {searchPerformed && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-800">
                            Search Results ({searchResults.length})
                        </h2>
                        {searchResults.length > 0 && (
                            <button
                                onClick={() => {
                                    setSavedSearchModalOpen(true);
                                }}
                                className="text-sm text-blue-600 flex items-center hover:text-blue-800"
                            >
                                <FiSave className="mr-1 h-4 w-4" />
                                Save this search
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Searching for suppliers...</p>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No suppliers found</h3>
                            <p className="mt-1 text-gray-500">
                                Try adjusting your search criteria to find more suppliers.
                            </p>
                            <button
                                onClick={resetForm}
                                className="mt-4 btn-primary"
                            >
                                Reset Search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {searchResults.map((supplier) => (
                                <div key={supplier.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-lg font-bold mr-4">
                                                    {supplier.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                                                        {supplier.name}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <span className="flex items-center mr-4">
                                                            <FiStar className="h-4 w-4 text-yellow-400 mr-1" />
                                                            {supplier.rating}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <FiMapPin className="h-4 w-4 mr-1" />
                                                            {supplier.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${supplier.complianceStatus === 'compliant' ? 'bg-green-100 text-green-800' :
                                                        supplier.complianceStatus === 'review' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'}`}>
                                                    {supplier.complianceStatus === 'compliant' ? 'Compliant' :
                                                        supplier.complianceStatus === 'review' ? 'Under Review' :
                                                            'Non-Compliant'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{supplier.description}</p>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Category</p>
                                                    <p className="font-medium">{supplier.category} - {supplier.subcategory}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Reliability Score</p>
                                                    <p className="font-medium">{supplier.reliabilityScore}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Lead Time</p>
                                                    <p className="font-medium">{supplier.leadTime}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Min. Order Value</p>
                                                    <p className="font-medium">${supplier.minOrderValue.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <p className="text-xs text-gray-500 mb-1">Key Products/Services</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {supplier.keyProducts.map((product, index) => (
                                                        <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs rounded-full">
                                                            {product}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-5 flex justify-end space-x-3">
                                                <Link
                                                    href={`/negotiations?supplierId=${supplier.id}`}
                                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Negotiate
                                                </Link>
                                                <Link
                                                    href={`/suppliers/${supplier.id}`}
                                                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination (simplified for hackathon) */}
                    {searchResults.length > 0 && (
                        <div className="mt-6 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{searchResults.length}</span> of <span className="font-medium">{searchResults.length}</span> results
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    disabled
                                    className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    className="px-3 py-1 border rounded text-sm bg-blue-50 text-blue-600 border-blue-200"
                                >
                                    1
                                </button>
                                <button
                                    disabled
                                    className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Save Search Modal */}
            {savedSearchModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Saved Searches
                                        </h3>

                                        {searchResults.length > 0 && (
                                            <div className="mb-6 border-b pb-4">
                                                <h4 className="text-md font-medium text-gray-800 mb-2">Save Current Search</h4>
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        value={newSearchName}
                                                        onChange={(e) => setNewSearchName(e.target.value)}
                                                        placeholder="Enter search name"
                                                        className="form-input flex-grow"
                                                    />
                                                    <button
                                                        onClick={saveCurrentSearch}
                                                        className="ml-3 btn-primary whitespace-nowrap"
                                                        disabled={!newSearchName.trim()}
                                                    >
                                                        <FiSave className="mr-2" />
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {savedSearches.length === 0 ? (
                                            <div className="text-center py-6">
                                                <FiFileText className="h-10 w-10 text-gray-400 mx-auto" />
                                                <p className="mt-2 text-gray-600">No saved searches yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                {savedSearches.map((search) => (
                                                    <div key={search.id} className="border rounded-md p-3 hover:bg-gray-50">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h5 className="font-medium text-gray-800">{search.name}</h5>
                                                                <p className="text-xs text-gray-500 mt-1">Created: {search.dateCreated}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => loadSavedSearch(search.criteria)}
                                                                className="text-sm text-blue-600 hover:text-blue-800"
                                                            >
                                                                Load
                                                            </button>
                                                        </div>
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {search.criteria.categories && search.criteria.categories.length > 0 && (
                                                                <span className="inline-block px-2 py-1 bg-blue-100 text-xs rounded-full">
                                                                    {search.criteria.categories.length} categories
                                                                </span>
                                                            )}
                                                            {search.criteria.locations && search.criteria.locations.length > 0 && (
                                                                <span className="inline-block px-2 py-1 bg-green-100 text-xs rounded-full">
                                                                    {search.criteria.locations.length} locations
                                                                </span>
                                                            )}
                                                            {search.criteria.minRating && (
                                                                <span className="inline-block px-2 py-1 bg-yellow-100 text-xs rounded-full">
                                                                    {search.criteria.minRating}+ rating
                                                                </span>
                                                            )}
                                                            {search.criteria.complianceStatus && (
                                                                <span className="inline-block px-2 py-1 bg-purple-100 text-xs rounded-full">
                                                                    {search.criteria.complianceStatus}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setSavedSearchModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/suppliers/new"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Add New Supplier</h3>
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                            <FiPlus className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Add a new supplier to your database with full details and evaluation.
                    </p>
                </Link>

                <Link
                    href="/compliance/verify"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Verify Compliance</h3>
                        <div className="bg-green-100 text-green-600 p-2 rounded-full">
                            <FiCheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Check supplier compliance status and certification verification.
                    </p>
                </Link>

                <Link
                    href="/suppliers"
                    className="bg-white rounded-lg shadow-md p-6 hover:bg-blue-50 transition-colors"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">All Suppliers</h3>
                        <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                            <FiTruck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        View your complete supplier list with status and key metrics.
                    </p>
                </Link>
            </div>
        </div>
    );
}
