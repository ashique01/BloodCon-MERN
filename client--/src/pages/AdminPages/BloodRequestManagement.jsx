import { ArrowPathIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../../api/axiosInstance";
import { useEffect, useState } from "react";



const STATUSES = ["Pending", "Accepted", "Completed"];


const BloodRequestManagement = ({ theme }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axiosInstance.get("/requests");
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to fetch blood request data.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusClasses = (status) => {
    const base = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    if (theme === "dark") {
      if (status === "Accepted") return `${base} bg-green-800/50 text-green-300`;
      if (status === "Completed") return `${base} bg-blue-800/50 text-blue-300`;
      return `${base} bg-yellow-800/50 text-yellow-300`;
    } else {
      if (status === "Accepted") return `${base} bg-green-100 text-green-800`;
      if (status === "Completed") return `${base} bg-blue-100 text-blue-800`;
      return `${base} bg-yellow-100 text-yellow-800`;
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startEditing = (id, currentStatus) => {
    setEditingId(id);
    setNewStatus(currentStatus);
    setUpdateError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewStatus("");
    setUpdateError("");
  };

  const saveStatus = async (id) => {
    if (!STATUSES.includes(newStatus)) {
      setUpdateError("Invalid status selected.");
      return;
    }
    setUpdating(true);
    setUpdateError("");
    try {
      const { data } = await axiosInstance.put(`/requests/${id}/status`, { status: newStatus });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? data.request : req))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating status:", err);
      setUpdateError(
        err.response?.data?.message || "Failed to update status."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-10 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
          <tr>
            {[
              "Name",
              "Blood Group",
              "City",
              "Hospital",
              "Phone",
              "Status",
              "Requested At",
              ""
            ].map((header, idx) => (
              <th
                key={idx}
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === "dark" ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {requests.map((req) => (
            <tr
              key={req._id}
              className={`transition-colors ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700/70"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <td className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {req.requesterName || "N/A"}
              </td>
              <td className={`px-6 py-4 text-sm whitespace-nowrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {req.bloodGroupNeeded || "N/A"}
              </td>
              <td className={`px-6 py-4 text-sm whitespace-nowrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {req.city || "N/A"}
              </td>
              <td className={`px-6 py-4 text-sm whitespace-nowrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {req.hospitalName || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a
                  href={`tel:${req.phone}`}
                  className={`text-sm ${
                    theme === "dark"
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  {req.phone || "N/A"}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === req._id ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <select
                      disabled={updating}
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className={`rounded border px-2 py-1 text-sm w-full sm:w-auto ${
                        theme === "dark"
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="flex mt-2 sm:mt-0 sm:ml-2">
                      <button
                        onClick={() => saveStatus(req._id)}
                        disabled={updating}
                        className={`px-2 py-1 text-sm font-semibold rounded ${
                          theme === "dark"
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-indigo-500 hover:bg-indigo-600 text-white"
                        }`}
                      >
                        {updating ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={updating}
                        className={`ml-2 px-2 py-1 text-sm font-semibold rounded ${
                          theme === "dark"
                            ? "bg-gray-600 hover:bg-gray-700 text-white"
                            : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                    {updateError && (
                      <div className={`mt-1 text-xs text-red-500 w-full sm:w-auto`}>
                        {updateError}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className={getStatusClasses(req.status || "Pending")}>
                    {req.status || "Pending"}
                  </span>
                )}
              </td>
              <td className={`px-6 py-4 text-sm whitespace-nowrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {formatDateTime(req.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingId !== req._id && (
                  <button
                    onClick={() => startEditing(req._id, req.status || "Pending")}
                    className={`hover:underline ${
                      theme === "dark"
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-900"
                    }`}
                  >
                    Manage
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default BloodRequestManagement;