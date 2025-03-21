// lib/mockData.js
export const mockSuppliers = [
    {
        id: 1,
        name: 'ElectroTech Industries',
        logo: '/images/supplier1.png',
        description: 'ElectroTech Industries is a leading supplier of electronic components and assemblies for various industries.',
        category: 'Electronics',
        subcategory: 'Electronic Components',
        location: 'Shanghai, China',
        region: 'Asia',
        foundedYear: 2005,
        employees: '1000-5000',
        website: 'https://electrotech-industries.example.com',
        contactEmail: 'info@electrotech-industries.example.com',
        contactPhone: '+86 21 5555 1234',
        rating: 4.8,
        reliabilityScore: 92,
        qualityScore: 95,
        deliveryScore: 88,
        communicationScore: 90,
        status: 'active',
        complianceStatus: 'compliant',
        lastOrder: '2023-09-15',
        averageDiscount: 7.5,
        currentPricing: 'Premium',
        paymentTerms: 'Net 30',
        contractExpiry: '2024-03-15',
        certifications: [
            { name: 'ISO 9001:2015', valid: true, expirationDate: '2025-06-30' },
            { name: 'ISO 14001:2015', valid: true, expirationDate: '2024-11-15' },
            { name: 'RoHS Compliant', valid: true, expirationDate: '2024-12-31' },
        ],
        performanceHistory: [
            { month: 'Aug 2023', onTimeDelivery: 95, qualityCompliance: 98, costVariance: -2 },
            { month: 'Jul 2023', onTimeDelivery: 92, qualityCompliance: 97, costVariance: -1 },
            { month: 'Jun 2023', onTimeDelivery: 94, qualityCompliance: 95, costVariance: 0 },
            { month: 'May 2023', onTimeDelivery: 90, qualityCompliance: 96, costVariance: -3 },
            { month: 'Apr 2023', onTimeDelivery: 88, qualityCompliance: 94, costVariance: -2 },
            { month: 'Mar 2023', onTimeDelivery: 91, qualityCompliance: 93, costVariance: 1 },
        ],
        riskFactors: [
            { category: 'Geopolitical', level: 'medium', description: 'Occasional political tensions in the region' },
            { category: 'Supply Chain', level: 'low', description: 'Multiple backup suppliers available' },
            { category: 'Financial', level: 'low', description: 'Strong financial position with consistent growth' },
        ],
        products: [
            { id: 101, name: 'Microcontrollers', category: 'Semiconductors', leadTime: '2-3 weeks', minOrderQty: 1000, unitPrice: 15 },
            { id: 102, name: 'Sensors', category: 'Electronic Components', leadTime: '1-2 weeks', minOrderQty: 500, unitPrice: 12 },
            { id: 103, name: 'PCB Assemblies', category: 'Assemblies', leadTime: '3-4 weeks', minOrderQty: 100, unitPrice: 120 },
        ],
        recentOrders: [
            { id: 'ORD-2023-421', date: '2023-09-15', status: 'Delivered', amount: 45000 },
            { id: 'ORD-2023-387', date: '2023-08-28', status: 'Delivered', amount: 32000 },
            { id: 'ORD-2023-352', date: '2023-07-15', status: 'Delivered', amount: 58000 },
        ],
        negotiationHistory: [
            { date: '2023-06-15', outcome: 'Success', savings: 8.2 },
            { date: '2022-12-10', outcome: 'Partial', savings: 5.0 },
            { date: '2022-06-22', outcome: 'Success', savings: 7.5 },
        ],
        annualRevenue: 1200000,
        annualProfit: 240000,
        profitMargin: 20
    },
    {
        id: 2,
        name: 'Global Packaging Solutions',
        logo: '/images/supplier2.png',
        description: 'Global Packaging Solutions provides innovative and sustainable packaging solutions for consumer goods and industrial applications.',
        category: 'Packaging',
        subcategory: 'Custom Packaging',
        location: 'Berlin, Germany',
        region: 'Europe',
        foundedYear: 2010,
        employees: '500-1000',
        website: 'https://globalpackaging.example.com',
        contactEmail: 'contact@globalpackaging.example.com',
        contactPhone: '+49 30 5555 6789',
        rating: 4.5,
        reliabilityScore: 88,
        qualityScore: 90,
        deliveryScore: 87,
        communicationScore: 85,
        status: 'active',
        complianceStatus: 'compliant',
        lastOrder: '2023-08-28',
        averageDiscount: 6.2,
        currentPricing: 'Standard',
        paymentTerms: 'Net 45',
        contractExpiry: '2024-02-10',
        certifications: [
            { name: 'ISO 9001:2015', valid: true, expirationDate: '2024-10-15' },
            { name: 'FSC Certified', valid: true, expirationDate: '2024-08-30' },
            { name: 'Plastic-Free Packaging Alliance', valid: true, expirationDate: '2025-01-15' },
        ],
        performanceHistory: [
            { month: 'Aug 2023', onTimeDelivery: 92, qualityCompliance: 94, costVariance: -1 },
            { month: 'Jul 2023', onTimeDelivery: 90, qualityCompliance: 92, costVariance: 0 },
            { month: 'Jun 2023', onTimeDelivery: 88, qualityCompliance: 91, costVariance: 1 },
            { month: 'May 2023', onTimeDelivery: 85, qualityCompliance: 90, costVariance: 0 },
            { month: 'Apr 2023', onTimeDelivery: 87, qualityCompliance: 89, costVariance: -1 },
            { month: 'Mar 2023', onTimeDelivery: 84, qualityCompliance: 88, costVariance: 2 },
        ],
        riskFactors: [
            { category: 'Geopolitical', level: 'low', description: 'Stable political environment in Europe' },
            { category: 'Supply Chain', level: 'medium', description: 'Dependent on imported raw materials' },
            { category: 'Financial', level: 'low', description: 'Solid financial standing with diverse clientele' },
        ],
        products: [
            { id: 201, name: 'Custom Boxes', category: 'Packaging', leadTime: '2-3 weeks', minOrderQty: 5000, unitPrice: 2 },
            { id: 202, name: 'Protective Packaging', category: 'Packaging', leadTime: '1-2 weeks', minOrderQty: 1000, unitPrice: 5 },
            { id: 203, name: 'Shipping Materials', category: 'Packaging', leadTime: '1 week', minOrderQty: 10000, unitPrice: 0.5 },
        ],
        recentOrders: [
            { id: 'ORD-2023-415', date: '2023-08-25', status: 'Delivered', amount: 5000 },
            { id: 'ORD-2023-376', date: '2023-07-18', status: 'Delivered', amount: 15000 },
            { id: 'ORD-2023-342', date: '2023-06-12', status: 'Delivered', amount: 12000 },
        ],
        negotiationHistory: [
            { date: '2023-07-10', outcome: 'Success', savings: 6.2 },
            { date: '2022-11-15', outcome: 'Success', savings: 5.8 },
            { date: '2022-05-20', outcome: 'Partial', savings: 3.5 },
        ],
        annualRevenue: 800000,
        annualProfit: 160000,
        profitMargin: 20
    },
    {
        id: 3,
        name: 'RawMat Suppliers Inc',
        logo: '/images/supplier3.png',
        description: 'RawMat Suppliers Inc specializes in providing high-quality raw materials for manufacturing, including industrial polymers and adhesives.',
        category: 'Raw Materials',
        subcategory: 'Industrial Polymers',
        location: 'Chicago, USA',
        region: 'North America',
        foundedYear: 1998,
        employees: '100-500',
        website: 'https://rawmat.example.com',
        contactEmail: 'sales@rawmat.example.com',
        contactPhone: '+1 312 555 7890',
        rating: 4.2,
        reliabilityScore: 85,
        qualityScore: 88,
        deliveryScore: 82,
        communicationScore: 80,
        status: 'active',
        complianceStatus: 'review',
        lastOrder: '2023-09-05',
        averageDiscount: 5.5,
        currentPricing: 'Economy',
        paymentTerms: 'Net 60',
        contractExpiry: '2024-04-30',
        certifications: [
            { name: 'ISO 9001:2015', valid: true, expirationDate: '2024-05-20' },
            { name: 'REACH Compliant', valid: true, expirationDate: '2024-07-10' },
            { name: 'ISO 14001:2015', valid: false, expirationDate: '2023-06-15' },
        ],
        performanceHistory: [
            { month: 'Aug 2023', onTimeDelivery: 86, qualityCompliance: 90, costVariance: 1 },
            { month: 'Jul 2023', onTimeDelivery: 84, qualityCompliance: 88, costVariance: 2 },
            { month: 'Jun 2023', onTimeDelivery: 80, qualityCompliance: 87, costVariance: 0 },
            { month: 'May 2023', onTimeDelivery: 81, qualityCompliance: 85, costVariance: -1 },
            { month: 'Apr 2023', onTimeDelivery: 83, qualityCompliance: 86, costVariance: 3 },
            { month: 'Mar 2023', onTimeDelivery: 79, qualityCompliance: 84, costVariance: 1 },
        ],
        riskFactors: [
            { category: 'Geopolitical', level: 'low', description: 'Stable business environment in the USA' },
            { category: 'Supply Chain', level: 'medium', description: 'Susceptible to raw material price fluctuations' },
            { category: 'Financial', level: 'medium', description: 'Expansion causing increased debt load' },
        ],
        products: [
            { id: 301, name: 'Industrial Polymers', category: 'Raw Materials', leadTime: '2-4 weeks', minOrderQty: 500, unitPrice: 40 },
            { id: 302, name: 'Adhesives', category: 'Raw Materials', leadTime: '1-2 weeks', minOrderQty: 200, unitPrice: 30 },
            { id: 303, name: 'Metals', category: 'Raw Materials', leadTime: '3-5 weeks', minOrderQty: 1000, unitPrice: 25 },
        ],
        recentOrders: [
            { id: 'ORD-2023-418', date: '2023-09-05', status: 'Processing', amount: 26000 },
            { id: 'ORD-2023-389', date: '2023-08-12', status: 'Delivered', amount: 18000 },
            { id: 'ORD-2023-360', date: '2023-07-01', status: 'Delivered', amount: 22000 },
        ],
        negotiationHistory: [
            { date: '2023-05-20', outcome: 'Partial', savings: 4.2 },
            { date: '2022-10-05', outcome: 'Success', savings: 6.5 },
            { date: '2022-04-15', outcome: 'Success', savings: 5.8 },
        ],
        annualRevenue: 600000,
        annualProfit: 90000,
        profitMargin: 15
    },
    {
        id: 4,
        name: 'FastTrack Logistics',
        logo: '/images/supplier4.png',
        description: 'FastTrack Logistics offers comprehensive express shipping, warehousing, and distribution services.',
        category: 'Logistics',
        subcategory: 'Express Shipping',
        location: 'Atlanta, USA',
        region: 'North America',
        foundedYear: 2007,
        employees: '1000-5000',
        website: 'https://fasttracklogistics.example.com',
        contactEmail: 'info@fasttrack.example.com',
        contactPhone: '+1 404 555 2345',
        rating: 4.6,
        reliabilityScore: 90,
        qualityScore: 88,
        deliveryScore: 95,
        communicationScore: 88,
        status: 'inactive',
        complianceStatus: 'non-compliant',
        lastOrder: '2023-09-10',
        averageDiscount: 4.8,
        currentPricing: 'Premium',
        paymentTerms: 'Net 15',
        contractExpiry: '2024-01-15',
        certifications: [
            { name: 'ISO 9001:2015', valid: true, expirationDate: '2024-03-15' },
            { name: 'C-TPAT Certified', valid: false, expirationDate: '2023-08-20' },
            { name: 'ISPM 15 Compliant', valid: true, expirationDate: '2024-02-28' },
        ],
        performanceHistory: [
            { month: 'Aug 2023', onTimeDelivery: 97, qualityCompliance: 92, costVariance: 2 },
            { month: 'Jul 2023', onTimeDelivery: 98, qualityCompliance: 90, costVariance: 1 },
            { month: 'Jun 2023', onTimeDelivery: 96, qualityCompliance: 89, costVariance: 0 },
            { month: 'May 2023', onTimeDelivery: 95, qualityCompliance: 87, costVariance: 3 },
            { month: 'Apr 2023', onTimeDelivery: 97, qualityCompliance: 88, costVariance: 2 },
            { month: 'Mar 2023', onTimeDelivery: 94, qualityCompliance: 86, costVariance: 1 },
        ],
        riskFactors: [
            { category: 'Geopolitical', level: 'low', description: 'Operates in stable regions' },
            { category: 'Supply Chain', level: 'high', description: 'Susceptible to fuel price and labor shortages' },
            { category: 'Financial', level: 'medium', description: 'High operational costs with thin margins' },
        ],
        products: [
            { id: 401, name: 'Express Shipping', category: 'Logistics', leadTime: '1-3 days', minOrderQty: 1, unitPrice: 8000 },
            { id: 402, name: 'Warehousing', category: 'Logistics', leadTime: 'Immediate', minOrderQty: 1, unitPrice: 5000 },
            { id: 403, name: 'Distribution', category: 'Logistics', leadTime: '1 week', minOrderQty: 1, unitPrice: 7500 },
        ],
        recentOrders: [
            { id: 'ORD-2023-419', date: '2023-09-10', status: 'Shipped', amount: 8000 },
            { id: 'ORD-2023-401', date: '2023-08-22', status: 'Delivered', amount: 12500 },
            { id: 'ORD-2023-375', date: '2023-08-05', status: 'Delivered', amount: 15000 },
        ],
        negotiationHistory: [
            { date: '2023-08-05', outcome: 'Success', savings: 4.8 },
            { date: '2023-01-20', outcome: 'Partial', savings: 3.2 },
            { date: '2022-07-10', outcome: 'Success', savings: 5.0 },
        ],
        annualRevenue: 1500000,
        annualProfit: 225000,
        profitMargin: 15
    },
    {
        id: 5,
        name: 'Quality Service Providers',
        logo: '/images/supplier5.png',
        description: 'Quality Service Providers delivers professional consulting and quality management services.',
        category: 'Services',
        subcategory: 'Quality Consulting',
        location: 'London, UK',
        region: 'Europe',
        foundedYear: 2011,
        employees: '50-100',
        website: 'https://qualityservices.example.com',
        contactEmail: 'enquiries@qualityservices.example.com',
        contactPhone: '+44 20 5555 6789',
        rating: 4.1,
        reliabilityScore: 82,
        qualityScore: 87,
        deliveryScore: 80,
        communicationScore: 94,
        status: 'active',
        complianceStatus: 'compliant',
        lastOrder: '2023-08-15',
        averageDiscount: 8.0,
        currentPricing: 'Standard',
        paymentTerms: 'Net 45',
        contractExpiry: '2024-06-15',
        certifications: [
            { name: 'ISO 9001:2015', valid: true, expirationDate: '2025-01-10' },
            { name: 'ISO 27001:2013', valid: true, expirationDate: '2024-09-15' },
            { name: 'Six Sigma Certification', valid: true, expirationDate: '2024-05-20' },
        ],
        performanceHistory: [
            { month: 'Aug 2023', onTimeDelivery: 84, qualityCompliance: 92, costVariance: -1 },
            { month: 'Jul 2023', onTimeDelivery: 82, qualityCompliance: 90, costVariance: 0 },
            { month: 'Jun 2023', onTimeDelivery: 80, qualityCompliance: 89, costVariance: -2 },
            { month: 'May 2023', onTimeDelivery: 83, qualityCompliance: 88, costVariance: 1 },
            { month: 'Apr 2023', onTimeDelivery: 81, qualityCompliance: 91, costVariance: -1 },
            { month: 'Mar 2023', onTimeDelivery: 79, qualityCompliance: 87, costVariance: 0 },
        ],
        riskFactors: [
            { category: 'Geopolitical', level: 'low', description: 'Stable business environment in the UK' },
            { category: 'Supply Chain', level: 'low', description: 'Minimal dependency due to service-based nature' },
            { category: 'Financial', level: 'medium', description: 'Small firm with limited financial buffers' },
        ],
        products: [
            { id: 501, name: 'Consulting Services', category: 'Services', leadTime: 'On-demand', minOrderQty: 1, unitPrice: 15000 },
            { id: 502, name: 'Quality Audits', category: 'Services', leadTime: '2-3 weeks', minOrderQty: 1, unitPrice: 2000 },
            { id: 503, name: 'Training', category: 'Services', leadTime: '1-2 weeks', minOrderQty: 1, unitPrice: 5000 },
        ],
        recentOrders: [
            { id: 'ORD-2023-416', date: '2023-08-28', status: 'Processing', amount: 25000 },
            { id: 'ORD-2023-386', date: '2023-07-12', status: 'Delivered', amount: 17000 },
            { id: 'ORD-2023-355', date: '2023-06-05', status: 'Delivered', amount: 13000 },
        ],
        negotiationHistory: [
            { date: '2023-06-30', outcome: 'Success', savings: 8.0 },
            { date: '2022-12-20', outcome: 'Success', savings: 7.5 },
            { date: '2022-06-05', outcome: 'Partial', savings: 4.0 },
        ],
        annualRevenue: 500000,
        annualProfit: 75000,
        profitMargin: 15
    },
    {
        id: 6,
        name: 'ChemSolutions Ltd',
        logo: '/images/supplier6.png',
        description: 'ChemSolutions Ltd manufactures and distributes industrial chemicals and solvents for various sectors.',
        category: 'Chemicals',
        subcategory: 'Industrial Chemicals',
        location: 'Frankfurt, Germany',
        region: 'Europe',
        foundedYear: 2003,
        employees: '100-500',
        website: 'https://chemsolutions.example.com',
        contactEmail: 'sales@chemsolutions.example.com',
        contactPhone: '+49 69 5555 8901',
        rating: 4.3,
        reliabilityScore: 87,
        qualityScore: 89,
        deliveryScore: 85,
        communicationScore: 83,
        status: 'active',
        complianceStatus: 'compliant',
        lastOrder: '2023-09-01',
        averageDiscount: 6.8,
        currentPricing: 'Premium',
        paymentTerms: 'Net 30',
        contractExpiry: '2024-05-15',
        certifications: [
            { name: 'ISO 9001:2015', valid: true, expirationDate: '2024-08-10' },
            { name: 'ISO 14001:2015', valid: true, expirationDate: '2024-07-15' },
            { name: 'REACH Compliant', valid: true, expirationDate: '2024-12-20' },
        ],
        performanceHistory: [
            { month: 'Aug 2023', onTimeDelivery: 89, qualityCompliance: 92, costVariance: 0 },
            { month: 'Jul 2023', onTimeDelivery: 87, qualityCompliance: 90, costVariance: -1 },
            { month: 'Jun 2023', onTimeDelivery: 86, qualityCompliance: 91, costVariance: 1 },
            { month: 'May 2023', onTimeDelivery: 84, qualityCompliance: 88, costVariance: 0 },
            { month: 'Apr 2023', onTimeDelivery: 88, qualityCompliance: 87, costVariance: 2 },
            { month: 'Mar 2023', onTimeDelivery: 85, qualityCompliance: 89, costVariance: -1 },
        ],
        riskFactors: [
            { category: 'Geopolitical', level: 'low', description: 'Stable market conditions in Europe' },
            { category: 'Supply Chain', level: 'medium', description: 'Dependence on international raw materials' },
            { category: 'Financial', level: 'low', description: 'Healthy profit margins and solid financials' },
        ],
        products: [
            { id: 601, name: 'Solvents', category: 'Chemicals', leadTime: '2-3 weeks', minOrderQty: 200, unitPrice: 45 },
            { id: 602, name: 'Adhesives', category: 'Chemicals', leadTime: '1-2 weeks', minOrderQty: 100, unitPrice: 60 },
            { id: 603, name: 'Cleaning Chemicals', category: 'Chemicals', leadTime: '1-2 weeks', minOrderQty: 300, unitPrice: 35 },
        ],
        recentOrders: [
            { id: 'ORD-2023-412', date: '2023-09-01', status: 'Processing', amount: 22000 },
            { id: 'ORD-2023-390', date: '2023-08-10', status: 'Delivered', amount: 185400 },
            { id: 'ORD-2023-361', date: '2023-07-05', status: 'Delivered', amount: 15000 },
        ],
        negotiationHistory: [
            { date: '2023-07-15', outcome: 'Success', savings: 6.8 },
            { date: '2022-12-05', outcome: 'Partial', savings: 4.5 },
            { date: '2022-05-12', outcome: 'Success', savings: 7.2 },
        ],
        annualRevenue: 950000,
        annualProfit: 142500,
        profitMargin: 15
    }
];



// Helper function to get a supplier by ID
export const getSupplierById = (id) => {
    return mockSuppliers.find(supplier => supplier.id === parseInt(id)) || null;
};

// Mock orders data
export const mockOrders = [
    {
        id: 'ORD-2023-421',
        supplierId: 1,
        supplierName: 'ElectroTech Industries',
        date: '2023-09-15',
        deliveryDate: '2023-09-30',
        status: 'processing',
        items: [
            { name: 'Microcontrollers', quantity: 1000, unitPrice: 15, total: 15000 },
            { name: 'Sensors', quantity: 2000, unitPrice: 12, total: 24000 }
        ],
        total: 39000,
        paymentTerms: 'Net 30',
        notes: 'Priority order for Q4 production',
        lastUpdated: '2023-09-16'
    },
    {
        id: 'ORD-2023-420',
        supplierId: 2,
        supplierName: 'Global Packaging Solutions',
        date: '2023-09-14',
        deliveryDate: '2023-09-28',
        status: 'draft',
        items: [
            { name: 'Custom Boxes', quantity: 5000, unitPrice: 2, total: 10000 },
            { name: 'Protective Packaging', quantity: 1000, unitPrice: 5, total: 5000 }
        ],
        total: 15000,
        paymentTerms: 'Net 30',
        notes: 'Awaiting final approval',
        lastUpdated: '2023-09-14'
    },
    {
        id: 'ORD-2023-419',
        supplierId: 4,
        supplierName: 'FastTrack Logistics',
        date: '2023-09-10',
        deliveryDate: '2023-09-17',
        status: 'shipped',
        items: [
            { name: 'Express Shipping', quantity: 1, unitPrice: 8000, total: 8000 }
        ],
        total: 8000,
        paymentTerms: 'Net 15',
        notes: 'Time-sensitive shipment',
        lastUpdated: '2023-09-12',
        trackingNumber: 'FTL-39485-28B'
    },
    {
        id: 'ORD-2023-42349',
        supplierId: 6,
        supplierName: 'FastTrack Logistics',
        date: '2023-09-10',
        deliveryDate: '2023-09-17',
        status: 'shipped',
        items: [
            { name: 'Solvents', quantity: 12, unitPrice: 8000, total: 8000 }
        ],
        total: 8000,
        paymentTerms: 'Net 15',
        notes: 'Time-sensitive shipment',
        lastUpdated: '2023-09-12',
        trackingNumber: 'FTL-39485-28B'
    },
    {
        id: 'ORD-2023-418',
        supplierId: 3,
        supplierName: 'RawMat Suppliers Inc',
        date: '2023-09-05',
        deliveryDate: '2023-09-20',
        status: 'processing',
        items: [
            { name: 'Industrial Polymers', quantity: 500, unitPrice: 40, total: 20000 },
            { name: 'Adhesives', quantity: 200, unitPrice: 30, total: 6000 }
        ],
        total: 26000,
        paymentTerms: 'Net 30',
        notes: 'Special handling required',
        lastUpdated: '2023-09-08'
    },
    {
        id: 'ORD-2023-417',
        supplierId: 1,
        supplierName: 'ElectroTech Industries',
        date: '2023-09-01',
        deliveryDate: '2023-09-15',
        status: 'delivered',
        items: [
            { name: 'PCB Assemblies', quantity: 100, unitPrice: 120, total: 12000 }
        ],
        total: 12000,
        paymentTerms: 'Net 30',
        notes: 'Delivered on time, quality check passed',
        lastUpdated: '2023-09-16',
        deliveredDate: '2023-09-15'
    },
    {
        id: 'ORD-2023-416',
        supplierId: 5,
        supplierName: 'Quality Service Providers',
        date: '2023-08-28',
        deliveryDate: '2023-10-15',
        status: 'processing',
        items: [
            { name: 'Consulting Services', quantity: 1, unitPrice: 15000, total: 15000 },
            { name: 'Quality Audits', quantity: 5, unitPrice: 2000, total: 10000 }
        ],
        total: 25000,
        paymentTerms: 'Net 45',
        notes: 'Ongoing service contract',
        lastUpdated: '2023-09-10'
    },
    {
        id: 'ORD-2023-415',
        supplierId: 2,
        supplierName: 'Global Packaging Solutions',
        date: '2023-08-25',
        deliveryDate: '2023-09-08',
        status: 'delivered',
        items: [
            { name: 'Shipping Materials', quantity: 10000, unitPrice: 0.5, total: 5000 }
        ],
        total: 5000,
        paymentTerms: 'Net 30',
        notes: 'Regular monthly order',
        lastUpdated: '2023-09-09',
        deliveredDate: '2023-09-08'
    }
];

// Mock negotiations data
export const mockNegotiations = [
    {
        id: 1,
        supplierId: 1,
        supplierName: 'ElectroTech Industries',
        category: 'Electronics',
        startDate: '2023-09-10',
        status: 'active',
        nextAction: 'Awaiting supplier response',
        lastActivity: '2023-09-15',
        products: ['Microcontrollers', 'Sensors'],
        targetSavings: 8.5,
        currentStage: 'Counter Offer',
        priority: 'high'
    },
    {
        id: 2,
        supplierId: 2,
        supplierName: 'Global Packaging Solutions',
        category: 'Packaging',
        startDate: '2023-09-05',
        status: 'active',
        nextAction: 'Review supplier proposal',
        lastActivity: '2023-09-14',
        products: ['Custom Boxes', 'Protective Packaging'],
        targetSavings: 5.2,
        currentStage: 'Initial Proposal',
        priority: 'medium'
    },
    {
        id: 3,
        supplierId: 3,
        supplierName: 'RawMat Suppliers Inc',
        category: 'Raw Materials',
        startDate: '2023-08-28',
        status: 'scheduled',
        nextAction: 'Kickoff meeting on 2023-09-20',
        lastActivity: '2023-09-12',
        products: ['Industrial Polymers', 'Adhesives'],
        targetSavings: 7.0,
        currentStage: 'Planning',
        priority: 'low'
    },
    {
        id: 4,
        supplierId: 5,
        supplierName: 'Quality Service Providers',
        category: 'Services',
        startDate: '2023-08-15',
        status: 'completed',
        nextAction: 'Implementation',
        lastActivity: '2023-09-08',
        products: ['Consulting Services', 'Quality Audits'],
        targetSavings: 10.0,
        currentStage: 'Agreement',
        priority: 'medium',
        outcome: 'Success',
        actualSavings: 11.2
    }
];

// Mock compliance items data
export const mockComplianceItems = [
    {
        id: 1,
        supplierId: 1,
        supplierName: 'ElectroTech Industries',
        documentType: 'ISO 9001 Certification',
        status: 'compliant',
        expiryDate: '2024-06-30',
        lastChecked: '2023-09-12',
        category: 'Quality Management',
        notes: 'Certification verified with issuing body'
    },
    {
        id: 2,
        supplierId: 1,
        supplierName: 'ElectroTech Industries',
        documentType: 'Environmental Policy',
        status: 'compliant',
        expiryDate: '2024-11-15',
        lastChecked: '2023-09-12',
        category: 'Environmental',
        notes: 'Document meets all requirements'
    },
    {
        id: 3,
        supplierId: 2,
        supplierName: 'Global Packaging Solutions',
        documentType: 'Food Safety Certification',
        status: 'review',
        expiryDate: '2023-10-30',
        lastChecked: '2023-09-10',
        category: 'Product Safety',
        notes: 'Certification expires in less than 60 days'
    },
    {
        id: 4,
        supplierId: 3,
        supplierName: 'RawMat Suppliers Inc',
        documentType: 'REACH Compliance',
        status: 'non-compliant',
        expiryDate: '2023-07-15',
        lastChecked: '2023-09-05',
        category: 'Regulatory',
        notes: 'Certification expired, follow-up required'
    },
    {
        id: 5,
        supplierId: 4,
        supplierName: 'FastTrack Logistics',
        documentType: 'Insurance Certificate',
        status: 'compliant',
        expiryDate: '2024-02-28',
        lastChecked: '2023-09-01',
        category: 'Insurance',
        notes: 'Coverage meets minimum requirements'
    },
    {
        id: 6,
        supplierId: 5,
        supplierName: 'Quality Service Providers',
        documentType: 'Professional Certifications',
        status: 'compliant',
        expiryDate: '2024-05-15',
        lastChecked: '2023-08-20',
        category: 'Professional Qualifications',
        notes: 'All staff certifications verified'
    },
    {
        id: 7,
        supplierId: 3,
        supplierName: 'RawMat Suppliers Inc',
        documentType: 'Fair Labor Practices',
        status: 'review',
        expiryDate: null,
        lastChecked: '2023-09-08',
        category: 'Social Responsibility',
        notes: 'Additional documentation requested'
    },
];

// Other mock data can be added as needed for the application

export const updateMockOrders = (newOrder) => {
    mockOrders.push(newOrder);
    return mockOrders;
};

export const updateMockSuppliers = (newSupplier) => {
    // Generate a new ID (next number after the highest ID)
    const newId = Math.max(...mockSuppliers.map(supplier => supplier.id)) + 1;

    // Add ID to the new supplier
    const supplierWithId = {
        ...newSupplier,
        id: newId
    };

    // Add to mock suppliers array
    mockSuppliers.push(supplierWithId);

    return supplierWithId;
};
