import { useState, useEffect } from "react";
import { incomingData, outgoingData } from "./data";
import Empty from "../../assets/svg/undraw_no-data_ig65.svg";
import { BiDotsVerticalRounded } from "react-icons/bi";

interface Product {
  id: string;
  img: string;
  title: string;
  priceEth: number;
  rating: number;
}

type TabType = "incoming" | "outgoing";

interface ModalState {
  open: boolean;
  productId: string | null;
  action: string | null;
}

const Order = () => {
  const [activeTab, setActiveTab] = useState<TabType>("incoming");
  const [modal, setModal] = useState<ModalState>({
    open: false,
    productId: null,
    action: null,
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const activeProduct: Record<"incoming" | "outgoing", Product[]> = {
    incoming: incomingData,
    outgoing: outgoingData,
  };

  const toggleMenu = (productId: string) => {
    setOpenMenuId((prev) => (prev === productId ? null : productId));
  };

  const openModal = (action: string, productId: string) => {
    setModal({ open: true, productId, action });
    setOpenMenuId(null); // Close dropdown
  };

  const closeModal = () => {
    setModal({ open: false, productId: null, action: null });
  };

  const confirmAction = () => {
    console.log(`${modal.action} on ${modal.productId}`);
    closeModal();
  };

  // Optional: Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-full min-h-screen px-5 py-10 bg-gray-50">
      {/* Tabs */}
      <div className="flex justify-end gap-4 mb-8">
        {["incoming", "outgoing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`px-5 py-2 rounded-md font-semibold text-white transition ${
              activeTab === tab ? "bg-black" : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {tab === "incoming" ? "Incoming" : "Outgoing"}
          </button>
        ))}
      </div>

      {/* Table */}
      {activeProduct[activeTab]?.length >= 1 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Price (ETH)</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeProduct[activeTab].map((product: Product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4">{product.title}</td>
                  <td className="px-6 py-4">{product.priceEth}</td>
                  <td className="px-6 py-4">{product.rating}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative dropdown-container inline-block">
                      <button
                        onClick={() => toggleMenu(product.id)}
                        className="text-gray-600 hover:text-black"
                      >
                        <BiDotsVerticalRounded size={22} />
                      </button>

                      {openMenuId === product.id && (
                        <div className="absolute right-0 top-full mt-2 w-36 bg-white border rounded shadow-md z-50">
                          {activeTab === "incoming" ? (
                            <>
                              <button
                                onClick={() => openModal("approve", product.id)}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openModal("decline", product.id)}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  openModal("delivered", product.id)
                                }
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Delivered
                              </button>
                              <button
                                onClick={() =>
                                  openModal("rejected", product.id)
                                }
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              >
                                Rejected
                              </button>
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
        <div className="flex flex-col items-center justify-center gap-2 mt-10">
          <img src={Empty} alt="empty" className="w-40 h-40" />
          <h2 className="text-gray-600 text-lg">No listings yet</h2>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4 capitalize">
              Confirm {modal.action}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to <b>{modal.action}</b> this request?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAction}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
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
