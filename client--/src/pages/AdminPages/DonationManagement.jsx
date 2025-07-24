import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

const DonationManagement = ({ theme }) => {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null); // 🆕 for modal

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError("");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const { data } = await axiosInstance.get("/donations", config);
        setDonations(data);
      } catch (err) {
        setError("Failed to fetch donation data.");
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [token]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const closeModal = () => setSelectedDonation(null); // 🆕 close modal

  if (loading) {
    return <div className="flex justify-center items-center py-10">Loading donations...</div>;
  }

  if (error) {
    return (
      <div className={`text-center py-10 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg relative">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
          <tr>
            {["Donor Name", "Blood Group", "Location", "Date", ""].map((header, idx) => (
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
          {donations.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className={`px-6 py-4 text-center text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                No donations found.
              </td>
            </tr>
          ) : (
            donations.map((donation) => (
              <tr
                key={donation._id}
                className={`transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700/70"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {donation.donor?.name || "N/A"}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {donation.bloodGroup || "N/A"}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {donation.location || "N/A"}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {formatDateTime(donation.donationDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedDonation(donation)} // 🆕 show modal
                    className={`hover:underline ${
                      theme === "dark"
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-900"
                    }`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🆕 Modal Popup */}
      {selectedDonation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className={`bg-white dark:bg-gray-800 rounded-md shadow-lg p-6 w-full max-w-md`}>
            <h2 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              Donation Details
            </h2>
            <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
              <li><strong>Donor:</strong> {selectedDonation.donor?.name || "N/A"}</li>
              <li><strong>Blood Group:</strong> {selectedDonation.bloodGroup}</li>
              <li><strong>Location:</strong> {selectedDonation.location}</li>
              <li><strong>Date:</strong> {formatDateTime(selectedDonation.donationDate)}</li>
              <li><strong>Recipient:</strong> {selectedDonation.recipientName || "N/A"}</li>
              <li><strong>Notes:</strong> {selectedDonation.notes || "N/A"}</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationManagement;
