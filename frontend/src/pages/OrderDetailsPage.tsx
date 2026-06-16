import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Package, User, Phone, Mail, Truck, CheckCircle, AlertCircle, Calendar, DollarSign } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/OrderService";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderById(Number(id));
      setOrder(response);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  console.log("the id", id);
  console.log("the order details:", order);

  // Calculate total value
  const calculateTotalValue = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total: number, item: any) => total + (item.unitPrice * item.quantity), 0);
  };

  // Calculate total weight
  const calculateTotalWeight = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total: number, item: any) => total + (item.weight * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? 'Error Loading Order' : 'Order Not Found'}
          </h2>
          <p className="text-gray-600 mb-4">{error || 'The requested order could not be found.'}</p>
          <Link to="/dashboard/client" className="bg-[#4F46E5] hover:bg-[#4338CA] px-4 py-2 rounded-lg text-white transition-colors shadow-sm">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard/client" 
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{order.id}</p>
          </div>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm">Total Value</p>
          <p className="text-gray-900 font-semibold text-xl">
            {order.currency} {calculateTotalValue().toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {/* <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Truck className="h-5 w-5 text-[#4F46E5]" />
              <span>Order Timeline</span>
            </h2> */}
            <div className="space-y-4">
              {order.timeline?.map((event: any, index: number) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === order.timeline.length - 1 ? 'bg-[#4F46E5]' : 'bg-green-500'
                    }`} />
                    {index < order.timeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-gray-900 font-semibold">{event.status}</h3>
                      <span className="text-gray-500 text-sm">{event.timestamp}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Package className="h-5 w-5 text-yellow-600" />
              <span>Order Items</span>
            </h2>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-gray-900 font-semibold">{item.description}</h3>
                      <p className="text-gray-600 text-sm">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-semibold">
                        {order.currency} {(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {order.currency} {item.unitPrice} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Quantity:</span>
                      <span className="text-gray-900 ml-2">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Unit Price:</span>
                      <span className="text-gray-900 ml-2">{order.currency} {item.unitPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="text-gray-900 font-semibold">#{order.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Warehouse ID</span>
                <span className="text-gray-900 font-semibold">{order.reference}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expected Delivery</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 font-semibold">{order.expectedDeliveryDate}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items Total:</span>
                  <span className="text-gray-900">{order.currency} {calculateTotalValue().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">{order.currency} {order.shippingCost}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    {order.currency} {(calculateTotalValue() + order.shippingCost).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-3">
              {calculateTotalWeight() > 0 && (
                <div>
                  <span className="text-gray-600 text-sm">Total Weight</span>
                  <p className="text-gray-900 font-semibold">{calculateTotalWeight()} kg</p>
                </div>
              )}
              
              <div>
                <span className="text-gray-600 text-sm">Currency</span>
                <p className="text-gray-900 font-semibold">{order.currency}</p>
              </div>
              {order.notes && (
                <div>
                  <span className="text-gray-600 text-sm">Notes</span>
                  <p className="text-gray-700 text-sm mt-1">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;