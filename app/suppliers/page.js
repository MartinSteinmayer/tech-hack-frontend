'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiSearch,
    FiFilter,
    FiPlusCircle,
    FiChevronDown,
    FiChevronUp,
    FiDownload,
    FiStar,
    FiMapPin
} from 'react-icons/fi';
import { supplierApi } from '../../lib/api';
import { mockSuppliers } from '@/lib/mockData';

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        rating: '',
        complianceStatus: ''
    });

    // Mock categories and locations for filter
    const categories = ['Electronics', 'Raw Materials', 'Packaging', 'Logistics', 'Services'];
    const locations = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia'];

    // Mock data for suppliers
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                // In a real application, we would use the API client
                // const response = await supplierApi.getAll(filters);
                // setSuppliers(response.data);

                // For the hackathon, use mock data
                setTimeout(() => {
                    setSuppliers(mockSuppliers);
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, [filters]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredSuppliers = suppliers.filter(supplier => {
        // Filter by search term
        if (searchTerm && !supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Filter by category
        if (filters.category && supplier.category !== filters.category) {
            return false;
        }

        // Filter by location
        if (filters.location && supplier.location !== filters.location) {
            return false;
        }

        // Filter by rating
        if (filters.rating) {
            const minRating = parseFloat(filters.rating);
            if (supplier.rating < minRating) {
                return false;
            }
        }

        // Filter by compliance status
        if (filters.complianceStatus && supplier.complianceStatus !== filters.complianceStatus) {
            return false;
        }

        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Supplier Discovery</h1>
                <div className="flex space-x-3">
                    <Link href="/suppliers/new" className="btn-secondary flex items-center">
                        <FiPlusCircle className="mr-2" />
                        Add Supplier
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Search input */}
                    <div className="relative w-full lg:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            className="form-input pl-10 w-full"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Filter toggle button */}
                    <button
                        className="flex items-center justify-center text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                        onClick={() => setFiltersOpen(!filtersOpen)}
                    >
                        <FiFilter className="h-5 w-5 mr-1" />
                        Filters
                        {filtersOpen ? (
                            <FiChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                            <FiChevronDown className="h-4 w-4 ml-1" />
                        )}
                    </button>
                </div>

                {/* Filter options */}
                {filtersOpen && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                className="form-select"
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <select
                                className="form-select"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {locations.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rating filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Rating
                            </label>
                            <select
                                className="form-select"
                                value={filters.rating}
                                onChange={(e) => handleFilterChange('rating', e.target.value)}
                            >
                                <option value="">Any Rating</option>
                                <option value="4.5">4.5+ Stars</option>
                                <option value="4">4+ Stars</option>
                                <option value="3.5">3.5+ Stars</option>
                                <option value="3">3+ Stars</option>
                            </select>
                        </div>

                        {/* Compliance Status filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Compliance Status
                            </label>
                            <select
                                className="form-select"
                                value={filters.complianceStatus}
                                onChange={(e) => handleFilterChange('complianceStatus', e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="compliant">Compliant</option>
                                <option value="review">Under Review</option>
                                <option value="non-compliant">Non-Compliant</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Suppliers List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">
                        Suppliers ({filteredSuppliers.length})
                    </h2>
                    <button className="text-sm text-gray-600 flex items-center hover:text-gray-900">
                        <FiDownload className="h-4 w-4 mr-1" />
                        Export
                    </button>
                </div>

                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading suppliers...</p>
                    </div>
                ) : filteredSuppliers.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-600">No suppliers found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredSuppliers.map((supplier) => (
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
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Category</p>
                                                <p className="font-medium">{supplier.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Reliability Score</p>
                                                <p className="font-medium">{supplier.reliabilityScore}%</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Status</p>
                                                <p className={`font-medium ${supplier.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {supplier.status === 'active' ? 'Active' : 'Inactive'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Last Order</p>
                                                <p className="font-medium">
                                                    {new Date(supplier.lastOrder).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex justify-end items-center space-x-3">
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
                        ))}
                    </div>
                )}
            </div>

            {/* Add Quick Action for New Supplier */}
            <div className="fixed bottom-6 right-6">
                <Link
                    href="/suppliers/new"
                    className="flex items-center justify-center h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
                    title="Add New Supplier"
                >
                    <FiPlusCircle className="h-6 w-6" />
                </Link>
            </div>
        </div>
    );
}
