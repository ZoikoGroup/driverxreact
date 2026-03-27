"use client";

import { useEffect, useState, useMemo } from "react";
import { Spinner, Form } from "react-bootstrap";
import beQuick from "../../utils/dasdbeQuickApi";

// ---------- Types ----------
interface Order {
  id?: string | number;
  order_id?: string | number;
  date?: string;
  created_at?: string;
  description?: string;
  amount?: string | number;
  total?: string | number;
  status?: string;
}

// ---------- Component ----------
export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  // ---------- Fetch Orders ----------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // ✅ FIX: use driverx_user key
        const userData = JSON.parse(localStorage.getItem("driverx_user") || "{}");
        //const userEmail: string = userData?.email || "info@golitemobile.com"; // ✅ static fallback
        const userEmail: string = "info@golitemobile.com";

        if (!userEmail) {
          setError("User not found");
          return;
        }

        const subscriberResult = await beQuick.getSubscriberByEmail(userEmail) as { subscriber_id: number } | false;

        if (!subscriberResult || !subscriberResult.subscriber_id) {
          setError("Subscriber not found");
          return;
        }

        const SUBSCRIBER_ID = subscriberResult.subscriber_id;

        const ord = await beQuick.getOrders(SUBSCRIBER_ID) as { orders?: Order[]; data?: Order[] };
        setOrders(ord?.orders || ord?.data || []);
      } catch (err) {
        console.error("Orders fetch error:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------- Filter + Search ----------
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        (order.id || order.order_id || "").toString().includes(search) ||
        (order.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (order.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // ---------- Pagination ----------
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ---------- Render ----------
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow dark:bg-gray-900 bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Title */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold mb-0">All Orders</h4>
            <span className="text-gray-400 text-sm">
              Total: {filteredOrders.length} orders
            </span>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Control
                  type="text"
                  placeholder="🔍 Search orders..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {/* Error */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Empty */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="text-center py-10">
              <h5 className="font-semibold">No Orders Found</h5>
              <p className="text-gray-400">Try changing filters or search</p>
            </div>
          )}

          {/* Orders Grid */}
          <div className="row g-4">
            {paginatedOrders.map((order, i) => {
              const status = (order.status || "").toLowerCase();
              const badgeClass =
                status === "completed" ? "bg-success" :
                status === "processing" ? "bg-info text-dark" :
                status === "pending" ? "bg-warning text-dark" :
                status === "failed" ? "bg-danger" :
                "bg-secondary";

              return (
                <div className="col-md-6 col-lg-4" key={i}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 h-full flex flex-col">

                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-bold mb-0">
                        Order #{order.id || order.order_id}
                      </h6>
                      <span className={`badge ${badgeClass}`}>
                        {status || "unknown"}
                      </span>
                    </div>

                    <small className="text-gray-400 mb-2 block">
                      {order.date || order.created_at || "-"}
                    </small>

                    <p className="text-gray-500 flex-grow mb-3">
                      {order.description || "Plan Purchase"}
                    </p>

                    <h5 className="text-green-600 font-bold mb-0">
                      ${Number(order.amount || order.total || 0).toFixed(2)}
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ← Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${currentPage === i + 1 ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}