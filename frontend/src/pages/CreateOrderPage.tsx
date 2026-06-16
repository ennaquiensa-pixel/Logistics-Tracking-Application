import React, { useState } from 'react';
import { Plus, Minus, Trash2, Package, Truck, Calendar, DollarSign, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/OrderService';

interface OrderItem {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  weightKg?: number;
}

interface CreateOrderForm {
  userId: number;
  warehouseId: number;
  expectedDeliveryDate: string;
  shippingCost: number;
  currency: string;
  notes: string;
  items: OrderItem[];
}

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateOrderForm>({
    userId: Number(user?.userId) || 0,
    warehouseId: 1, // Default warehouse
    expectedDeliveryDate: '',
    shippingCost: 0,
    currency: 'MAD',
    notes: '',
    items: [
      {
        sku: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        weightKg: undefined,
      }
    ]
  });

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalAmount = subtotal + formData.shippingCost;

  const handleInputChange = (field: keyof CreateOrderForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Calculate total price if unitPrice or quantity changes
    if (field === 'unitPrice' || field === 'quantity') {
      const item = updatedItems[index];
      // You can add totalPrice calculation here if needed
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          sku: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          weightKg: undefined,
        }
      ]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validations
    if (!formData.warehouseId) {
      newErrors.warehouseId = 'Warehouse is required';
    }

    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = 'Expected delivery date is required';
    }

    if (formData.shippingCost < 0) {
      newErrors.shippingCost = 'Shipping cost cannot be negative';
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.sku.trim()) {
        newErrors[`items[${index}].sku`] = 'SKU is required';
      }

      if (!item.description.trim()) {
        newErrors[`items[${index}].description`] = 'Description is required';
      }

      if (item.quantity < 1) {
        newErrors[`items[${index}].quantity`] = 'Quantity must be at least 1';
      }

      if (item.unitPrice < 0) {
        newErrors[`items[${index}].unitPrice`] = 'Unit price cannot be negative';
      }

      if (item.weightKg && item.weightKg < 0) {
        newErrors[`items[${index}].weightKg`] = 'Weight cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare the request data
      const createOrderRequest = {
        userId: formData.userId,
        warehouseId: formData.warehouseId,
        expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toISOString().split('T')[0] : undefined,
        shippingCost: formData.shippingCost,
        currency: formData.currency,
        notes: formData.notes,
        items: formData.items.map(item => ({
          sku: item.sku,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          weightKg: item.weightKg
        }))
      };

      console.log('Submitting order:', createOrderRequest);
      
      const response = await orderService.createOrder(createOrderRequest);
      
      console.log('Order created successfully:', response);
      
      // Redirect to orders page or show success message
      navigate('/orders');
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      
      // Handle API validation errors
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (typeof apiErrors === 'object') {
          setErrors(apiErrors);
        } else if (typeof apiErrors === 'string') {
          setErrors({ general: apiErrors });
        }
      } else {
        setErrors({ general: 'Failed to create order. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getError = (field: string): string => {
    return errors[field] || '';
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Order</h1>
            <p className="text-gray-400">Add order details and items</p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg mb-6">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information Card */}
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-400" />
                <span>Order Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Warehouse</label>
                  <select
                    className={`w-full bg-gray-800 text-white px-4 py-2 rounded-lg border ${
                      getError('warehouseId') ? 'border-red-500' : 'border-gray-700'
                    } focus:border-blue-500 focus:outline-none`}
                    value={formData.warehouseId}
                    onChange={(e) => handleInputChange('warehouseId', Number(e.target.value))}
                  >
                    <option value={1}>Warehouse 1</option>
                    <option value={2}>Warehouse 2</option>
                    <option value={3}>Warehouse 3</option>
                  </select>
                  {getError('warehouseId') && (
                    <p className="text-red-400 text-sm mt-1">{getError('warehouseId')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Expected Delivery Date</label>
                  <input
                    type="date"
                    className={`w-full bg-gray-800 text-white px-4 py-2 rounded-lg border ${
                      getError('expectedDeliveryDate') ? 'border-red-500' : 'border-gray-700'
                    } focus:border-blue-500 focus:outline-none`}
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {getError('expectedDeliveryDate') && (
                    <p className="text-red-400 text-sm mt-1">{getError('expectedDeliveryDate')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Shipping Cost ({formData.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-full bg-gray-800 text-white px-4 py-2 rounded-lg border ${
                      getError('shippingCost') ? 'border-red-500' : 'border-gray-700'
                    } focus:border-blue-500 focus:outline-none`}
                    value={formData.shippingCost}
                    onChange={(e) => handleInputChange('shippingCost', Number(e.target.value))}
                  />
                  {getError('shippingCost') && (
                    <p className="text-red-400 text-sm mt-1">{getError('shippingCost')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Currency</label>
                  <select
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                  >
                    <option value="MAD">MAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Notes</label>
                  <textarea
                    rows={3}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes or instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-400" />
                  <span>Order Items</span>
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Item {index + 1}</h3>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">SKU *</label>
                        <input
                          type="text"
                          className={`w-full bg-gray-700 text-white px-3 py-2 rounded-lg border ${
                            getError(`items[${index}].sku`) ? 'border-red-500' : 'border-gray-600'
                          } focus:border-blue-500 focus:outline-none`}
                          value={item.sku}
                          onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                          placeholder="Product SKU"
                        />
                        {getError(`items[${index}].sku`) && (
                          <p className="text-red-400 text-sm mt-1">{getError(`items[${index}].sku`)}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          className={`w-full bg-gray-700 text-white px-3 py-2 rounded-lg border ${
                            getError(`items[${index}].quantity`) ? 'border-red-500' : 'border-gray-600'
                          } focus:border-blue-500 focus:outline-none`}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        />
                        {getError(`items[${index}].quantity`) && (
                          <p className="text-red-400 text-sm mt-1">{getError(`items[${index}].quantity`)}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Description *</label>
                        <input
                          type="text"
                          className={`w-full bg-gray-700 text-white px-3 py-2 rounded-lg border ${
                            getError(`items[${index}].description`) ? 'border-red-500' : 'border-gray-600'
                          } focus:border-blue-500 focus:outline-none`}
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Product description"
                        />
                        {getError(`items[${index}].description`) && (
                          <p className="text-red-400 text-sm mt-1">{getError(`items[${index}].description`)}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Unit Price ({formData.currency}) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={`w-full bg-gray-700 text-white px-3 py-2 rounded-lg border ${
                            getError(`items[${index}].unitPrice`) ? 'border-red-500' : 'border-gray-600'
                          } focus:border-blue-500 focus:outline-none`}
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                        />
                        {getError(`items[${index}].unitPrice`) && (
                          <p className="text-red-400 text-sm mt-1">{getError(`items[${index}].unitPrice`)}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          className={`w-full bg-gray-700 text-white px-3 py-2 rounded-lg border ${
                            getError(`items[${index}].weightKg`) ? 'border-red-500' : 'border-gray-600'
                          } focus:border-blue-500 focus:outline-none`}
                          value={item.weightKg || ''}
                          onChange={(e) => handleItemChange(index, 'weightKg', e.target.value ? Number(e.target.value) : undefined)}
                        />
                        {getError(`items[${index}].weightKg`) && (
                          <p className="text-red-400 text-sm mt-1">{getError(`items[${index}].weightKg`)}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-gray-750 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Item Total:</span>
                        <span className="text-white font-semibold">
                          {formData.currency} {(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span>Order Summary</span>
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Items Total</span>
                  <span className="text-white font-semibold">
                    {formData.currency} {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shipping Cost</span>
                  <span className="text-white font-semibold">
                    {formData.currency} {formData.shippingCost.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">Total Amount</span>
                    <span className="text-white font-bold text-lg">
                      {formData.currency} {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Create Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderPage;