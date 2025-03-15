'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FiArrowLeft,
    FiPlus,
    FiTrash2,
    FiSave,
    FiSend,
    FiCalendar,
    FiDollarSign,
    FiAlertCircle,
    FiCheck,
    FiClock,
    FiTruck
} from 'react-icons/fi';
import { orderApi, supplierApi } from '../../../lib/api';

export default function NewOrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSupplierId = searchParams.get('supplierId');
    const initialProductId = searchParams.get('productId');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    const [formData, setFormData] = useState({
        supplierId: initialSupplierId || '',
        orderDate: new Date().toISOString().slice(0, 10),
        deliveryDate: '',
        paymentTerms: 'Net 30',
        notes: '',
        items: [
            { id: 1, productId: initialProductId || '', name: '', description: '', quantity: 1, unitPrice: 0, total: 0 }
        ],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
    });

    // Mock suppliers data
    const mockSuppliers = [
        { id: 1, name: 'ElectroTech Industries', category: 'Electronics' },
        { id: 2, name: 'Global Packaging Solutions', category: 'Packaging' },
        { id: 3, name: 'RawMat Suppliers Inc', category: 'Raw Materials' },
        { id: 4, name: 'FastTrack Logistics', category: 'Logistics' },
        { id: 5, name: 'Quality Service Providers', category: 'Services' },
    ];

    // Mock products by supplier
    const mockProductsBySupplier = {
        1: [
            { id: 101, name: 'Microcontrollers', description: 'ATmega328P microcontrollers', unitPrice: 15 },
            { id: 102, name: 'Sensors', description: 'Temperature and humidity sensors', unitPrice: 12 },
            { id: 103, name: 'PCB Assemblies', description: 'Custom PCB assemblies', unitPrice: 120 },
        ],
        2: [
            { id: 201, name: 'Custom Boxes', description: 'Branded packaging boxes', unitPrice: 2 },
            { id: 202, name: 'Protective Packaging', description: 'Bubble wrap and foam inserts', unitPrice: 5 },
            { id: 203, name: 'Shipping Materials', description: 'Packaging tape and labels', unitPrice: 0.5 },
        ],
        3: [
            { id: 301, name: 'Industrial Polymers', description: 'High-grade polymers for manufacturing', unitPrice: 40 },
            { id: 302, name: 'Adhesives', description: 'Industrial strength adhesives', unitPrice: 30 },
            { id: 303, name: 'Metals', description: 'Raw metal materials', unitPrice: 25 },
        ],
        4: [
            { id: 401, name: 'Express Shipping', description: 'Priority 1-2 day shipping', unitPrice: 8000 },
            { id: 402, name: 'Warehousing', description: 'Monthly storage services', unitPrice: 5000 },
            { id: 403, name: 'Distribution', description: 'Product distribution services', unitPrice: 7500 },
        ],
        5: [
            { id: 501, name: 'Consulting Services', description: 'Professional consulting', unitPrice: 15000 },
            { id: 502, name: 'Quality Audits', description: 'Product quality assessment', unitPrice: 2000 },
            { id: 503, name: 'Training', description: 'Staff training sessions', unitPrice: 5000 },
        ],
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, we would use the API client
                // const suppliersResponse = await supplierApi.getAll();
                // setSuppliers(suppliersResponse.data);

                // For the hackathon, use mock data
                setTimeout(() => {
                    setSuppliers(mockSuppliers);

                    // If a supplier is already selected, fetch their products
                    if (initialSupplierId) {
                        const supplierProducts = mockProductsBySupplier[initialSupplierId] || [];
                        setProducts(supplierProducts);

                        // If a product is specified, add it as the first item
                        if (initialProductId) {
                            const product = supplierProducts.find(p => p.id.toString() === initialProductId);
                            if (product) {
                                setFormData(prev => ({
                                    ...prev,
                                    items: [{
                                        id: 1,
                                        productId: product.id.toString(),
                                        name: product.name,
                                        description: product.description,
                                        quantity: 1,
                                        unitPrice: product.unitPrice,
                                        total: product.unitPrice
                                    }],
                                    subtotal: product.unitPrice,
                                    total: product.unitPrice
                                }));
                            }
                        }
                    }

                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [initialSupplierId, initialProductId]);

    const handleSupplierChange = async (e) => {
        const supplierId = e.target.value;

        setFormData(prev => ({
            ...prev,
            supplierId,
            items: [{ id: 1, productId: '', name: '', description: '', quantity: 1, unitPrice: 0, total: 0 }],
            subtotal: 0,
            total: 0
        }));

        if (supplierId) {
            // In a real app, we would use the API client
            // const productsResponse = await supplierApi.getProducts(supplierId);
            // setProducts(productsResponse.data);

            // For the hackathon, use mock data
            setProducts(mockProductsBySupplier[supplierId] || []);
        } else {
            setProducts([]);
        }
    };

    const handleProductChange = (index, e) => {
        const productId = e.target.value;
        const product = products.find(p => p.id.toString() === productId);

        const updatedItems = [...formData.items];

        if (product) {
            updatedItems[index] = {
                ...updatedItems[index],
                productId,
                name: product.name,
                description: product.description,
                unitPrice: product.unitPrice,
                total: product.unitPrice * updatedItems[index].quantity
            };
        } else {
            updatedItems[index] = {
                ...updatedItems[index],
                productId,
                name: '',
                description: '',
                unitPrice: 0,
                total: 0
            };
        }

        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        const total = subtotal + formData.tax + formData.shipping;

        setFormData(prev => ({
            ...prev,
            items: updatedItems,
            subtotal,
            total
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];

        if (field === 'quantity') {
            value = parseInt(value) || 0;
            updatedItems[index] = {
                ...updatedItems[index],
                quantity: value,
                total: value * updatedItems[index].unitPrice
            };
        } else if (field === 'unitPrice') {
            value = parseFloat(value) || 0;
            updatedItems[index] = {
                ...updatedItems[index],
                unitPrice: value,
                total: updatedItems[index].quantity * value
            };
        } else {
            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value
            };
        }

        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        const total = subtotal + formData.tax + formData.shipping;

        setFormData(prev => ({
            ...prev,
            items: updatedItems,
            subtotal,
            total
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'tax' || name === 'shipping') {
            const numValue = parseFloat(value) || 0;
            const total = formData.subtotal + (name === 'tax' ? numValue : formData.tax) +
                (name === 'shipping' ? numValue : formData.shipping);

            setFormData(prev => ({
                ...prev,
                [name]: numValue,
                total
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const addItem = () => {
        const newItemId = formData.items.length > 0
            ? Math.max(...formData.items.map(item => item.id)) + 1
            : 1;

        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { id: newItemId, productId: '', name: '', description: '', quantity: 1, unitPrice: 0, total: 0 }
            ]
        }));
    };

    const removeItem = (id) => {
        if (formData.items.length <= 1) {
            return; // Keep at least one item
        }

        const updatedItems = formData.items.filter(item => item.id !== id);
        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        const total = subtotal + formData.tax + formData.shipping;

        setFormData(prev => ({
            ...prev,
            items: updatedItems,
            subtotal,
            total
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.supplierId) {
            errors.supplierId = 'Supplier is required';
        }

        if (!formData.deliveryDate) {
            errors.deliveryDate = 'Delivery date is required';
        }

        let hasItemErrors = false;

        formData.items.forEach((item, index) => {
            if (!item.productId) {
                errors[`item_${index}_productId`] = 'Product is required';
                hasItemErrors = true;
            }

            if (item.quantity <= 0) {
                errors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
                hasItemErrors = true;
            }

            if (item.unitPrice <= 0) {
                errors[`item_${index}_unitPrice`] = 'Unit price must be greater than 0';
                hasItemErrors = true;
            }
        });

        if (hasItemErrors) {
            errors.items = 'One or more items have errors';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e, asDraft = false) => {
        e.preventDefault();

        if (!asDraft && !validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            const orderData = {
                ...formData,
                status: asDraft ? 'draft' : 'processing'
            };

            // In a real app, we would call the API
            // const response = await orderApi.createOrder(orderData);
            // const orderId = response.data.id;

            // For the hackathon, simulate API call
            setTimeout(() => {
                setSubmitting(false);

                // Mock order ID
                const orderId = 'ORD-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000);

                // Redirect to order details page
                router.push(`/orders/${orderId}`);
            }, 1500);
        } catch (error) {
            console.error('Error creating order:', error);
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/orders" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={(e) => handleSubmit(e, true)}
                        className="btn-secondary flex items-center"
                        disabled={submitting}
                    >
                        {submitting && asDraft ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                            <FiSave className="mr-2" />
                        )}
                        Save as Draft
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, false)}
                        className="btn-primary flex items-center"
                        disabled={submitting}
                    >
                        {submitting && !asDraft ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                            <FiSend className="mr-2" />
                        )}
                        Submit Order
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order form...</p>
                </div>
            ) : (
                <form className="space-y-6">
                    {/* Order Details Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Order Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Supplier Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="supplierId">
                                    Supplier <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="supplierId"
                                    name="supplierId"
                                    value={formData.supplierId}
                                    onChange={handleSupplierChange}
                                    className={`form-select ${validationErrors.supplierId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                >
                                    <option value="">-- Select Supplier --</option>
                                    {suppliers.map(supplier => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name} ({supplier.category})
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.supplierId && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.supplierId}</p>
                                )}
                            </div>

                            {/* Order Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="orderDate">
                                    Order Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCalendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        id="orderDate"
                                        name="orderDate"
                                        value={formData.orderDate}
                                        onChange={handleChange}
                                        className="form-input pl-10"
                                    />
                                </div>
                            </div>

                            {/* Delivery Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="deliveryDate">
                                    Required Delivery Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCalendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        id="deliveryDate"
                                        name="deliveryDate"
                                        value={formData.deliveryDate}
                                        onChange={handleChange}
                                        className={`form-input pl-10 ${validationErrors.deliveryDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                </div>
                                {validationErrors.deliveryDate && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.deliveryDate}</p>
                                )}
                            </div>

                            {/* Payment Terms */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="paymentTerms">
                                    Payment Terms
                                </label>
                                <select
                                    id="paymentTerms"
                                    name="paymentTerms"
                                    value={formData.paymentTerms}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="Net 15">Net 15</option>
                                    <option value="Net 30">Net 30</option>
                                    <option value="Net 45">Net 45</option>
                                    <option value="Net 60">Net 60</option>
                                    <option value="Immediate">Immediate</option>
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                                Order Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Enter any special requirements or additional information"
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Order Items Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-800">Order Items</h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-sm bg-blue-50 text-blue-600 py-1 px-3 rounded-md border border-blue-200 hover:bg-blue-100 flex items-center"
                            >
                                <FiPlus className="mr-1 h-4 w-4" />
                                Add Item
                            </button>
                        </div>

                        {validationErrors.items && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                                <FiAlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                <p className="text-sm text-red-600">{validationErrors.items}</p>
                            </div>
                        )}

                        {formData.items.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No items added</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Start by adding items to your order
                                </p>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="mt-4 btn-primary"
                                >
                                    Add First Item
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={item.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-md font-medium text-gray-800">Item #{index + 1}</h3>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                                disabled={formData.items.length <= 1}
                                            >
                                                <FiTrash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Product Selection */}
                                            <div className="md:col-span-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Product <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={item.productId}
                                                    onChange={(e) => handleProductChange(index, e)}
                                                    className={`form-select ${validationErrors[`item_${index}_productId`] ? 'border-red-300' : ''}`}
                                                    disabled={!formData.supplierId}
                                                >
                                                    <option value="">-- Select Product --</option>
                                                    {products.map(product => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.name} - ${product.unitPrice}
                                                        </option>
                                                    ))}
                                                </select>
                                                {validationErrors[`item_${index}_productId`] && (
                                                    <p className="mt-1 text-sm text-red-600">{validationErrors[`item_${index}_productId`]}</p>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <div className="md:col-span-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    className="form-input"
                                                    placeholder="Product description"
                                                />
                                            </div>

                                            {/* Quantity */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Quantity <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    className={`form-input ${validationErrors[`item_${index}_quantity`] ? 'border-red-300' : ''}`}
                                                />
                                                {validationErrors[`item_${index}_quantity`] && (
                                                    <p className="mt-1 text-sm text-red-600">{validationErrors[`item_${index}_quantity`]}</p>
                                                )}
                                            </div>

                                            {/* Unit Price */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Unit Price <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.unitPrice}
                                                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                                        className={`form-input pl-8 ${validationErrors[`item_${index}_unitPrice`] ? 'border-red-300' : ''}`}
                                                    />
                                                </div>
                                                {validationErrors[`item_${index}_unitPrice`] && (
                                                    <p className="mt-1 text-sm text-red-600">{validationErrors[`item_${index}_unitPrice`]}</p>
                                                )}
                                            </div>

                                            {/* Total */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Total
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={item.total.toFixed(2)}
                                                        readOnly
                                                        className="form-input pl-8 bg-gray-50"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Order Summary */}
                        <div className="mt-6 border-t pt-6">
                            <div className="flex justify-end">
                                <div className="w-full md:w-1/2 lg:w-1/3">
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Tax:</span>
                                        <div className="flex items-center">
                                            <FiDollarSign className="h-4 w-4 text-gray-400 mr-1" />
                                            <input
                                                type="number"
                                                name="tax"
                                                min="0"
                                                step="0.01"
                                                value={formData.tax}
                                                onChange={handleChange}
                                                className="form-input w-20 py-1 text-right"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Shipping:</span>
                                        <div className="flex items-center">
                                            <FiDollarSign className="h-4 w-4 text-gray-400 mr-1" />
                                            <input
                                                type="number"
                                                name="shipping"
                                                min="0"
                                                step="0.01"
                                                value={formData.shipping}
                                                onChange={handleChange}
                                                className="form-input w-20 py-1 text-right"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-lg">
                                        <span>Total:</span>
                                        <span>${formData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/orders"
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save as Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, false)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Order'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

// Missing icon components
const FiShoppingCart = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
    </svg>
);
