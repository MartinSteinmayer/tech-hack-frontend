// lib/supplierApi.js

/**
 * API adapter for supplier-related API calls
 */

/**
 * Get AI recommendations for suppliers based on description and criteria
 * @param {string} description - Text description of requirements
 * @param {string[]} criteria - Array of criteria IDs
 * @param {string} category - Optional category filter
 * @param {Object[]} mockSuppliers - Mock supplier data to use in case of API failure
 * @returns {Promise<Object[]>} - Array of recommended suppliers
 */
export async function getAiRecommendations(description, criteria = [], category = '', mockSuppliers = []) {
    try {
        // Prepare supplier data to send to the API
        const supplierData = mockSuppliers.map(supplier => ({
            id: supplier.id,
            name: supplier.name,
            category: supplier.category,
            description: supplier.description,
            location: supplier.location,
            region: supplier.region,
            rating: supplier.rating || Math.random() * 5,
            sustainabilityScore: supplier.sustainabilityScore ||
                (criteria.includes('sustainable') ? Math.random() * 100 : Math.random() * 50),
            pricing: supplier.pricing ||
                (criteria.includes('premium') ? 'Premium' :
                    criteria.includes('budget') ? 'Budget' : 'Standard'),
            deliverySpeed: supplier.deliverySpeed ||
                (criteria.includes('fast') ? 'Fast' : 'Standard'),
            isoCertified: supplier.isoCertified || criteria.includes('certified'),
            isLocal: supplier.isLocal || criteria.includes('local'),
            reliabilityScore: supplier.reliabilityScore,
            qualityScore: supplier.qualityScore
        }));

        // Prepare the request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: category,
                description: description,
                criteria: criteria,
                suppliers: supplierData
            })
        };

        // Make the API call to our new endpoint
        const response = await fetch('/api/suppliers/recommend', requestOptions);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response data:', data);

        // Format the response properly
        if (data.recommended_supplier) {
            // If API returns a single recommended supplier with reasons
            const enhancedSupplier = {
                ...data.recommended_supplier,
                aiRecommendation: {
                    reasons: data.reasons || [],
                    considerations: data.considerations || ""
                }
            };
            return [enhancedSupplier];
        } else if (Array.isArray(data)) {
            // If API returns an array of suppliers
            return data;
        } else {
            // If data is in some other format, return an empty array
            console.warn('Unexpected data format from API:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching AI recommendations:', error);

        // If API call fails, use fallback results
        return getFallbackResults(description, criteria, mockSuppliers);
    }
}

/**
 * Get fallback results based on local filtering when API fails
 * @param {string} description - Text description of requirements
 * @param {string[]} criteria - Array of criteria IDs
 * @param {Object[]} mockSuppliers - Mock supplier data
 * @returns {Object[]} - Array of filtered suppliers
 */
export function getFallbackResults(description, criteria = [], mockSuppliers = []) {
    // Extract category from description
    const categoryHints = ['Electronics', 'Raw Materials', 'Packaging', 'Logistics', 'Services', 'Chemicals']
        .filter(category => description.toLowerCase().includes(category.toLowerCase()));
    const categoryFromDesc = categoryHints.length > 0 ? categoryHints[0] : '';

    // Match suppliers against criteria and description
    return mockSuppliers
        .filter(s => {
            // Apply category filter if found in description
            if (categoryFromDesc && !s.category.toLowerCase().includes(categoryFromDesc.toLowerCase())) {
                return false;
            }

            // Apply criteria filters if we have supplier description to check against
            if (s.description) {
                if (criteria.includes('sustainable') && !s.description.toLowerCase().includes('sustainable')) {
                    return false;
                }
                if (criteria.includes('certified') && !s.description.toLowerCase().includes('certified')) {
                    return false;
                }
                if (criteria.includes('local') && !s.description.toLowerCase().includes('local')) {
                    return false;
                }
            }

            return true;
        })
        .map(supplier => ({
            ...supplier,
            aiRecommendation: {
                reasons: [
                    `Matches your search criteria: "${description}"`,
                    ...criteria.map(category => `Has ${category} qualities based on description`)
                ],
                considerations: "This is a fallback recommendation based on keyword matching."
            }
        }))
        .slice(0, 3);
}

/**
 * Search suppliers by name or category
 * @param {string} searchTerm - Search term
 * @param {Object[]} mockSuppliers - Mock supplier data
 * @returns {Object[]} - Array of matching suppliers
 */
export function searchSuppliers(searchTerm, mockSuppliers = []) {
    if (!searchTerm || searchTerm.length < 2) {
        return [];
    }

    return mockSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/**
 * Get detailed information about a specific supplier
 * @param {string} supplierId - Supplier ID
 * @returns {Promise<Object>} - Supplier details
 */
export async function getSupplierDetails(supplierId) {
    try {
        const response = await fetch(`/api/suppliers/${supplierId}`);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching supplier details:', error);
        throw error;
    }
}

/**
 * Filter suppliers based on multiple criteria
 * @param {Object} filters - Object containing filter criteria
 * @returns {Promise<Object[]>} - Array of filtered suppliers
 */
export async function filterSuppliers(filters) {
    try {
        // Convert filters to query parameters
        const params = new URLSearchParams();

        if (filters.category) {
            params.append('category', filters.category);
        }

        if (filters.minRating) {
            params.append('min_rating', filters.minRating);
        }

        const response = await fetch(`/api/suppliers?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error filtering suppliers:', error);
        throw error;
    }
}
