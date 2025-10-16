import { useState, useEffect } from "react";
import { useWallet } from "../../context/walletContext";
import { toast } from "sonner";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { incomingData, outgoingData } from "./data";

interface Order {
  id: string;
  productId: string;
  title: string;
  price: string;
  image?: string;
  quantity: number;
  sellerId: string;
  buyerId: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentRef: string;
  createdAt: string;
  totalAmount: string;
}

const Order = () => {
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");
  const [modal, setModal] = useState({
    open: false,
    orderId: null as string | null,
    action: null as string | null,
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWallet();

  // Convert your existing data to our order format
  const convertToOrders = () => {
    const incomingOrders: Order[] = incomingData.map((item, _index) => ({
      id: item.id,
      productId: `prod_${item.id}`,
      title: item.title,
      price: (item.priceEth * 1000).toString(), // Convert ETH to USD approximate
      image: item.img, // ✅ Use the imported image directly
      quantity: 1,
      sellerId: "seller123",
      buyerId: "buyer456",
      status: "paid" as const,
      paymentRef: `pay_${item.id}`,
      createdAt: "2024-01-15",
      totalAmount: (item.priceEth * 1000).toString()
    }));

    const outgoingOrders: Order[] = outgoingData.map((item, _index) => ({
      id: item.id,
      productId: `prod_${item.id}`,
      title: item.title,
      price: (item.priceEth * 1000).toString(),
      image: item.img, // ✅ Use the imported image directly
      quantity: 1,
      sellerId: "seller789",
      buyerId: "buyer123",
      status: "shipped" as const,
      paymentRef: `pay_out_${item.id}`,
      createdAt: "2024-01-16",
      totalAmount: (item.priceEth * 1000).toString()
    }));

    return { incomingOrders, outgoingOrders };
  };

  useEffect(() => {
    loadOrders();
  }, [account]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { incomingOrders, outgoingOrders } = convertToOrders();
      
      // Set orders based on active tab
      if (activeTab === "incoming") {
        setOrders(incomingOrders);
      } else {
        setOrders(outgoingOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Reload orders when tab changes
  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const toggleMenu = (orderId: string) => {
    setOpenMenuId((prev) => (prev === orderId ? null : orderId));
  };

  const openModal = (action: string, orderId: string) => {
    setModal({ open: true, orderId, action });
    setOpenMenuId(null);
  };

  const closeModal = () => {
    setModal({ open: false, orderId: null, action: null });
  };

  const confirmAction = async () => {
    if (!modal.orderId || !modal.action) return;

    try {
      const order = orders.find(o => o.id === modal.orderId);
      if (!order) return;

      switch (modal.action) {
        case "mark_shipped":
          await handleMarkAsShipped(order);
          break;
        case "confirm_delivery":
          await handleConfirmDelivery(order);
          break;
        case "cancel_order":
          await handleCancelOrder(order);
          break;
        case "request_refund":
          await handleRequestRefund();
          break;
        default:
          console.log(`Action ${modal.action} on order ${modal.orderId}`);
      }

      closeModal();
      loadOrders(); // Refresh orders
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error("Failed to process action");
    }
  };

  const handleMarkAsShipped = async (_order: Order) => {
    try {
      toast.info("Updating delivery status...");
      // For demo, we'll just show success without calling contract
      toast.success("Order marked as shipped!");
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmDelivery = async (_order: Order) => {
    try {
      toast.info("Confirming delivery...");
      // For demo, we'll just show success without calling contract
      toast.success("Delivery confirmed! Funds will be released to seller.");
    } catch (error) {
      throw error;
    }
  };

  const handleCancelOrder = async (_order: Order) => {
    try {
      toast.info("Cancelling order...");
      // For demo, we'll just show success without calling contract
      toast.success("Order cancelled successfully");
    } catch (error) {
      throw error;
    }
  };

  const handleRequestRefund = async () => {
    try {
      toast.info("Processing refund request...");
      toast.success("Refund request submitted");
    } catch (error) {
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "paid": return "bg-blue-100 text-blue-700";
      case "shipped": return "bg-purple-100 text-purple-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending Payment";
      case "paid": return "Payment Received";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  // Filter orders based on user role and tab
  const filteredOrders = orders;

  if (loading) {
    return (
      <div className="w-full min-h-screen px-5 py-10 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-5 py-10 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">Manage your incoming and outgoing orders</p>
      </div>

      {/* Tabs - NOW CLICKABLE */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === "incoming" 
              ? "bg-black text-white" 
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          📥 Incoming Orders
        </button>
        <button
          onClick={() => setActiveTab("outgoing")}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === "outgoing" 
              ? "bg-black text-white" 
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          📤 Outgoing Orders
        </button>
      </div>

      {/* Orders Table */}
      {filteredOrders.length >= 1 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Product</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Details</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {/* ✅ IMAGES WILL NOW SHOW - using imported images directly */}
                    {order.image ? (
                      <img
                        src={order.image}
                        alt={order.title}
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border">
                        📦
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.title}</p>
                      <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                      <p className="text-xs text-gray-500">ID: {order.productId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-green-600">${order.totalAmount}</p>
                    <p className="text-sm text-gray-600">${order.price} each</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleMenu(order.id)}
                        className="text-gray-600 hover:text-black p-2 rounded hover:bg-gray-100"
                      >
                        <BiDotsVerticalRounded size={20} />
                      </button>

                      {openMenuId === order.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          {activeTab === "incoming" ? (
                            // Seller actions (Incoming tab)
                            <>
                              {order.status === "paid" && (
                                <button
                                  onClick={() => openModal("mark_shipped", order.id)}
                                  className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b"
                                >
                                  🚚 Mark as Shipped
                                </button>
                              )}
                              {order.status === "paid" && (
                                <button
                                  onClick={() => openModal("cancel_order", order.id)}
                                  className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-red-600"
                                >
                                  ❌ Cancel Order
                                </button>
                              )}
                            </>
                          ) : (
                            // Buyer actions (Outgoing tab)
                            <>
                              {order.status === "shipped" && (
                                <button
                                  onClick={() => openModal("confirm_delivery", order.id)}
                                  className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b"
                                >
                                  ✅ Confirm Delivery
                                </button>
                              )}
                              {(order.status === "paid" || order.status === "shipped") && (
                                <button
                                  onClick={() => openModal("request_refund", order.id)}
                                  className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-red-600"
                                >
                                  💰 Request Refund
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 mt-10 bg-white p-12 rounded-lg shadow">
          <div className="text-6xl">📦</div>
          <h2 className="text-xl font-semibold text-gray-700">No orders yet</h2>
          <p className="text-gray-500 text-center max-w-md">
            {activeTab === "incoming" 
              ? "You don't have any incoming orders yet. Orders will appear here when customers purchase your products."
              : "You haven't placed any orders yet. Start shopping to see your order history here."
            }
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 capitalize">
              Confirm {modal.action?.replace('_', ' ')}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to <b>{modal.action?.replace('_', ' ')}</b> this order?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAction}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;